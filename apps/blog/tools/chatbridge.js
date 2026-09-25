#!/usr/bin/env node
"use strict";

/**
 * Zabon Blog App — paste-bundle-qwen5 bridge
 *
 * Purpose:
 * - Pack required text files into <= 5 upload bundles for Qwen.
 * - Run local commands and capture output into output bundles.
 * - Preserve paste-mode discipline: the model still cannot read disk or run commands.
 *
 * Subcommands:
 *   prep [--milestone NN] [--max-files N] [--reserve-output N] [--extra-files a,b,c]
 *   run --label name --exec "command" [--milestone NN]
 *   note --label name --text "observation" [--milestone NN]
 *   verify [--milestone NN]
 *   finalize --milestone NN --message "commit message"
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const BLOG_ROOT = path.resolve(__dirname, "..");
process.chdir(BLOG_ROOT);

const TOOLS_DIR = path.join(BLOG_ROOT, "tools");
const STATE_PATH = path.join(TOOLS_DIR, "state.json");
const UPLOAD_ROOT = path.join(TOOLS_DIR, "chat-upload");

function fail(message) {
  console.error(`CHATBRIDGE FAIL: ${message}`);
  process.exit(1);
}

function sha256String(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function rel(p) {
  return path.relative(BLOG_ROOT, p).split(path.sep).join("/");
}

function resolveWithinBlog(relPath) {
  const abs = path.resolve(BLOG_ROOT, relPath);
  const relative = path.relative(BLOG_ROOT, abs);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    fail(`Path escapes BLOG_ROOT: ${relPath}`);
  }
  return abs;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function int(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        opts[key] = next;
        i += 1;
      } else {
        opts[key] = true;
      }
    }
  }
  return opts;
}

function readState() {
  const defaults = {
    upload_mode: "paste-bundle-qwen5",
    max_upload_files: 5,
    reserve_output_files: 0,
    chat_sequence: [],
    current_milestone: 0,
    completed_milestones: [],
    next_milestone: 0,
    current_chat_id: null,
    completed_chat_ids: [],
    next_chat_id: null,
  };

  if (!fs.existsSync(STATE_PATH)) {
    return defaults;
  }

  try {
    const raw = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
    return { ...defaults, ...raw };
  } catch (err) {
    fail(`tools/state.json is not valid JSON: ${err.message}`);
  }
}

function writeState(state) {
  fs.writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function isProbablyBinary(buf) {
  return Buffer.isBuffer(buf) && buf.slice(0, 1024).includes(0);
}

function loadSecrets() {
  const envPath = path.join(BLOG_ROOT, ".env");
  if (!fs.existsSync(envPath)) return [];

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  const secrets = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const value = trimmed
      .slice(trimmed.indexOf("=") + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
    if (value && value.length >= 4) secrets.push(value);
  }

  return secrets;
}

function redact(text) {
  if (!text) return "";
  let out = String(text);
  for (const secret of loadSecrets()) {
    out = out.split(secret).join("[REDACTED]");
  }
  return out;
}

function slugify(s) {
  return (
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

function dirListing(dir) {
  const abs = resolveWithinBlog(dir);
  if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) {
    fail(`Directory listing failed: ${dir}`);
  }

  const lines = [`# Directory listing: ${dir}`, ""];

  function walk(current, prefix) {
    const entries = fs
      .readdirSync(current, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if ([".git", "node_modules", "chat-upload"].includes(entry.name))
        continue;

      const entryAbs = path.join(current, entry.name);
      const entryRel = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        lines.push(`- ${entryRel}/`);
        walk(entryAbs, entryRel);
      } else if (entry.isFile()) {
        const st = fs.statSync(entryAbs);
        lines.push(`- ${entryRel} (${st.size} bytes)`);
      }
    }
  }

  walk(abs, "");
  return lines.join("\n");
}

function loadVirtual(entry) {
  if (entry.startsWith("DIRLIST ")) {
    const dir = entry.slice("DIRLIST ".length).trim();
    const content = dirListing(dir);
    const virtualPath = `generated/dir-list-${slugify(dir)}.md`;
    return {
      path: virtualPath,
      content,
      sha256: sha256String(content),
      chars: content.length,
      virtual: true,
    };
  }

  const abs = resolveWithinBlog(entry);
  if (!fs.existsSync(abs)) {
    fail(`Missing required file: ${entry}`);
  }

  const buf = fs.readFileSync(abs);
  if (isProbablyBinary(buf)) {
    fail(`Binary file cannot be packed as text: ${entry}`);
  }

  const content = buf.toString("utf8");
  return {
    path: entry,
    content,
    sha256: sha256String(content),
    chars: content.length,
    virtual: false,
  };
}

function parseUploadList(chatText) {
  const lines = chatText.split(/\r?\n/);
  const raw = [];
  let inBlock = false;
  let collected = false;

  for (const line of lines) {
    if (/^Upload these files first:/i.test(line.trim())) {
      inBlock = true;
      continue;
    }

    if (!inBlock) continue;

    const trimmed = line.trim();

    if (!trimmed) {
      if (collected) break;
      continue;
    }

    if (/^MILESTONE=/.test(trimmed)) break;

    const backtick = trimmed.match(/`([^`]+)`/);
    if (backtick) {
      if (/directory listing/i.test(trimmed)) {
        raw.push(`DIRLIST ${backtick[1]}`);
      } else {
        raw.push(backtick[1]);
      }
      collected = true;
      continue;
    }

    if (/^a directory listing of/i.test(trimmed)) {
      const dir = trimmed
        .replace(/^a directory listing of/i, "")
        .trim()
        .replace(/[`.]/g, "");
      if (dir) raw.push(`DIRLIST ${dir}`);
      collected = true;
    }
  }

  return raw;
}

function findMilestoneFile(chatId) {
  const dir = path.join(TOOLS_DIR, "milestones");
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).sort();

  const direct = files.find((f) => f === `${chatId}.md`);
  if (direct) return rel(path.join(dir, direct));

  const prefixed = files.find(
    (f) => f.startsWith(`${chatId}-`) && f.endsWith(".md"),
  );
  if (prefixed) return rel(path.join(dir, prefixed));

  return null;
}

function addUnique(list, item) {
  if (item && !list.includes(item)) list.push(item);
}

function sanitizeChatText(chatText) {
  const lines = chatText.split(/\r?\n/);
  const out = [];
  let skip = false;

  for (const line of lines) {
    if (/^Upload these files first:/i.test(line.trim())) {
      skip = true;
      continue;
    }

    if (skip) {
      if (line.trim() === "") {
        skip = false;
        continue;
      }
      if (/^MILESTONE=/.test(line.trim())) {
        skip = false;
        continue;
      }
      continue;
    }

    if (/^MILESTONE=/.test(line.trim())) continue;

    out.push(line);
  }

  return out.join("\n").trim();
}

function groupFor(filePath) {
  const p = filePath.replace(/\\/g, "/");

  if (
    p === "tools/CONTEXT.md" ||
    p === "tools/LOCKED_DECISIONS.txt" ||
    p === ".env.example" ||
    p === ".gitignore" ||
    p.startsWith("tools/milestones/") ||
    p.startsWith("tools/schema/") ||
    p === "tools/README.md" ||
    p.startsWith("tools/bootstrap/")
  ) {
    return "rules";
  }

  if (
    p === "HANDOFF.md" ||
    p === "PARTIAL.md" ||
    p === "tools/state.json" ||
    p.startsWith("tools/reports/") ||
    p.startsWith("generated/")
  ) {
    return "state";
  }

  if (p.startsWith("content/") || p.startsWith("tools/source/")) {
    return "content";
  }

  if (p.startsWith("apps/blog/")) {
    return "app";
  }

  return "other";
}

function chunkSize(files) {
  return files.reduce((sum, f) => sum + f.chars + 200, 0);
}

function splitGroup(files, maxChars) {
  const chunks = [];
  let current = [];
  let currentSize = 0;

  for (const file of files) {
    const estimated = file.chars + 200;
    if (estimated > maxChars) {
      fail(`File too large for one bundle: ${file.path}`);
    }

    if (currentSize + estimated > maxChars && current.length) {
      chunks.push(current);
      current = [];
      currentSize = 0;
    }

    current.push(file);
    currentSize += estimated;
  }

  if (current.length) chunks.push(current);
  return chunks;
}

function makeChunks(files, maxBundles, maxChars) {
  const groups = new Map();

  for (const file of files) {
    const key = groupFor(file.path);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(file);
  }

  const ordered = ["rules", "state", "content", "app", "other"];
  const keys = ordered
    .filter((k) => groups.has(k))
    .concat([...groups.keys()].filter((k) => !ordered.includes(k)));

  let chunks = [];

  for (const key of keys) {
    const groupFiles = groups
      .get(key)
      .sort((a, b) => a.path.localeCompare(b.path));
    chunks = chunks.concat(splitGroup(groupFiles, maxChars));
  }

  while (chunks.length > maxBundles) {
    chunks.sort((a, b) => chunkSize(a) - chunkSize(b));

    let combined = false;

    outer: for (let i = 0; i < chunks.length; i += 1) {
      for (let j = i + 1; j < chunks.length; j += 1) {
        const combinedSize = chunkSize(chunks[i]) + chunkSize(chunks[j]);
        if (combinedSize <= maxChars) {
          chunks[i] = chunks[i].concat(chunks[j]);
          chunks.splice(j, 1);
          combined = true;
          break outer;
        }
      }
    }

    if (!combined) {
      fail(
        `Cannot pack required files into ${maxBundles} bundles. ` +
          "Reduce the read list, split the milestone, or increase --max-chars if Qwen allows.",
      );
    }
  }

  return chunks;
}

function renderBundle(milestone, prefix, index, files) {
  const nonce = crypto.randomBytes(4).toString("hex");
  const lines = [];

  lines.push(
    `# Zabon paste-bundle ${milestone}/${prefix}/${String(index).padStart(2, "0")}`,
  );
  lines.push(`GENERATED_AT: ${new Date().toISOString()}`);
  lines.push(`UPLOAD_MODE: paste-bundle-qwen5`);
  lines.push(`BUNDLE_FILE_COUNT: ${files.length}`);
  lines.push("");

  for (const file of files) {
    lines.push(`<<<ZABON:${nonce} FILE ${file.path} SHA256 ${file.sha256}>>>`);
    lines.push(file.content);
    lines.push(`<<<END ZABON:${nonce}>>>`);
    lines.push("");
  }

  return lines.join("\n");
}

function writeBundles(milestone, chunks, prefix) {
  const dir = path.join(UPLOAD_ROOT, milestone);
  ensureDir(dir);

  for (const existing of fs.readdirSync(dir)) {
    if (
      existing.startsWith(`${milestone}-${prefix}-`) &&
      existing.endsWith(".md")
    ) {
      fs.rmSync(path.join(dir, existing), { force: true });
    }
  }

  const bundles = [];

  chunks.forEach((files, idx) => {
    const bundleRel = `tools/chat-upload/${milestone}/${milestone}-${prefix}-${String(idx + 1).padStart(2, "0")}.md`;
    const abs = path.join(BLOG_ROOT, bundleRel);
    const content = renderBundle(milestone, prefix, idx + 1, files);
    fs.writeFileSync(abs, content, "utf8");

    bundles.push({
      path: bundleRel,
      sha256: sha256String(content),
      files: files.map((f) => ({
        path: f.path,
        sha256: f.sha256,
        virtual: !!f.virtual,
      })),
    });
  });

  return bundles;
}

function buildPrompt(milestone, state, bundles, chatText, maxFiles) {
  const stateHash = fs.existsSync(STATE_PATH)
    ? sha256String(fs.readFileSync(STATE_PATH, "utf8"))
    : "MISSING";

  const bundleList = bundles.map((b) => `- ${b.path}`).join("\n");

  const preamble = [
    `MILESTONE=${milestone} STATE_SHA256=${stateHash}`,
    `Upload mode: paste-bundle-qwen5. Qwen upload limit: ${maxFiles} files.`,
    "",
    "Upload these generated bundle files only:",
    bundleList,
    "",
    "Bundle rules:",
    "- Each bundle contains virtual files delimited by <<<ZABON ...>>> markers.",
    "- Treat each virtual file as if it had been uploaded directly.",
    "- If a required virtual file is missing, stop and ask for the exact path.",
    "- Do not reconstruct missing files from memory.",
    "- Do not run shell commands.",
    "- When a command is required, ask the human to run it through tools/chatbridge.js run.",
    "- The generated bundles override the raw upload list in the original chat message.",
    "",
  ].join("\n");

  return `${preamble}\n${sanitizeChatText(chatText)}\n`;
}

function prep(opts) {
  const state = readState();
  const milestone = opts.milestone || state.next_chat_id;

  if (!milestone) {
    console.log("PACK COMPLETE");
    return;
  }

  const chatMessageRel = `tools/chat-messages/${milestone}.md`;
  const chatMessageAbs = path.join(BLOG_ROOT, chatMessageRel);

  if (!fs.existsSync(chatMessageAbs)) {
    fail(`Missing chat message: ${chatMessageRel}`);
  }

  const chatText = fs.readFileSync(chatMessageAbs, "utf8");
  const required = parseUploadList(chatText);

  const milestoneFile = findMilestoneFile(milestone);
  if (!milestoneFile) fail(`Missing milestone file for chat id: ${milestone}`);

  addUnique(required, "tools/CONTEXT.md");
  addUnique(required, "tools/LOCKED_DECISIONS.txt");
  addUnique(required, "tools/state.json");
  addUnique(required, milestoneFile);

  if (fs.existsSync(path.join(BLOG_ROOT, "HANDOFF.md")) && milestone !== "00") {
    addUnique(required, "HANDOFF.md");
  }

  if (fs.existsSync(path.join(BLOG_ROOT, "PARTIAL.md"))) {
    addUnique(required, "PARTIAL.md");
  }

  if (opts["extra-files"]) {
    String(opts["extra-files"])
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((f) => addUnique(required, f));
  }

  const files = required.map(loadVirtual);

  const maxFiles = int(opts["max-files"], state.max_upload_files || 5);
  const reserveOutput = int(
    opts["reserve-output"],
    state.reserve_output_files || 0,
  );
  const maxBundles = maxFiles - reserveOutput;

  if (maxBundles < 1) {
    fail("max-files minus reserve-output must be at least 1.");
  }

  const maxChars = int(opts["max-chars"], 120000);
  const chunks = makeChunks(files, maxBundles, maxChars);
  const bundles = writeBundles(milestone, chunks, "bundle");

  const manifest = {
    milestone,
    generated_at: new Date().toISOString(),
    upload_mode: "paste-bundle-qwen5",
    max_files: maxFiles,
    reserve_output_files: reserveOutput,
    state_sha256: fs.existsSync(STATE_PATH)
      ? sha256String(fs.readFileSync(STATE_PATH, "utf8"))
      : null,
    sources: files.map((f) => ({
      path: f.path,
      sha256: f.sha256,
      virtual: !!f.virtual,
    })),
    bundles,
  };

  const manifestPath = path.join(UPLOAD_ROOT, milestone, "manifest.json");
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  const prompt = buildPrompt(milestone, state, bundles, chatText, maxFiles);

  console.log("CHATBRIDGE PREP OK");
  console.log("");
  console.log("Upload these generated files:");
  bundles.forEach((b) => console.log(b.path));
  console.log("");
  console.log("Optional verification:");
  console.log(`node tools/chatbridge.js verify --milestone ${milestone}`);
  console.log("");
  console.log("----- BEGIN PROMPT -----");
  console.log(prompt);
  console.log("----- END PROMPT -----");
}

function writeRawOutput(milestone, label, content) {
  const outDir = path.join(UPLOAD_ROOT, milestone, "outputs");
  ensureDir(outDir);

  const existing = fs.readdirSync(outDir).filter((f) => f.endsWith(".md"));
  const seq = String(existing.length + 1).padStart(2, "0");
  const outFile = path.join(outDir, `${seq}-${slugify(label)}.md`);

  fs.writeFileSync(outFile, content, "utf8");
  return outFile;
}

function packOutputs(milestone, maxBundles, maxChars) {
  const outDir = path.join(UPLOAD_ROOT, milestone, "outputs");
  if (!fs.existsSync(outDir)) return [];

  const rawFiles = fs
    .readdirSync(outDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => loadVirtual(rel(path.join(outDir, f))));

  if (!rawFiles.length) return [];

  const chunks = makeChunks(rawFiles, maxBundles, maxChars);
  return writeBundles(milestone, chunks, "outputs");
}

function run(opts) {
  const state = readState();
  const milestone = opts.milestone || state.next_chat_id || "current";

  if (!opts.label) fail("--label is required");
  if (!opts.exec) fail("--exec is required");

  const command = String(opts.exec);
  const startedAt = new Date().toISOString();

  const result = spawnSync(command, {
    shell: true,
    cwd: BLOG_ROOT,
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
  });

  const exitCode = result.status === null ? 127 : result.status;
  const stdout = redact(result.stdout || "");
  const stderr = redact(result.stderr || "");
  const errorText = result.error ? redact(result.error.message) : "";

  const md = [
    `# Command output: ${opts.label}`,
    "",
    `MILESTONE: ${milestone}`,
    `COMMAND: ${redact(command)}`,
    `EXIT_CODE: ${exitCode}`,
    `STARTED_AT: ${startedAt}`,
    `CAPTURED_AT: ${new Date().toISOString()}`,
    "",
    "## STDOUT",
    "",
    stdout || "(empty)",
    "",
    "## STDERR",
    "",
    stderr || "(empty)",
    "",
    errorText ? `## ERROR\n\n${errorText}\n` : "",
  ].join("\n");

  writeRawOutput(milestone, opts.label, md);

  const outputBundles = int(
    opts["output-bundles"],
    state.reserve_output_files || 1,
  );
  const maxChars = int(opts["max-chars"], 120000);
  const bundles = packOutputs(milestone, outputBundles, maxChars);

  console.log(`COMMAND DONE: exit=${exitCode}`);
  console.log("");
  console.log(
    "Upload these output bundle files if the model needs the full output:",
  );
  bundles.forEach((b) => console.log(b.path));
  console.log("");
  console.log("Short output block:");
  console.log("----- BEGIN OUTPUT -----");
  console.log(stdout.slice(-2000) || "(empty stdout)");
  if (stderr) {
    console.log("STDERR:");
    console.log(stderr.slice(-1000));
  }
  console.log("----- END OUTPUT -----");
}

function note(opts) {
  const state = readState();
  const milestone = opts.milestone || state.next_chat_id || "current";

  if (!opts.label) fail("--label is required");
  if (!opts.text) fail("--text is required");

  const md = [
    `# Human observation: ${opts.label}`,
    "",
    `MILESTONE: ${milestone}`,
    `AT: ${new Date().toISOString()}`,
    "",
    String(opts.text),
    "",
  ].join("\n");

  writeRawOutput(milestone, opts.label, md);

  const outputBundles = int(
    opts["output-bundles"],
    state.reserve_output_files || 1,
  );
  const maxChars = int(opts["max-chars"], 120000);
  const bundles = packOutputs(milestone, outputBundles, maxChars);

  console.log("NOTE CAPTURED");
  console.log("");
  console.log(
    "Upload these output bundle files if the model needs the observation:",
  );
  bundles.forEach((b) => console.log(b.path));
}

function advanceState(state, chatId) {
  const seq = state.chat_sequence || [];
  const idx = seq.indexOf(chatId);

  if (idx < 0) {
    fail(`Chat id not in chat_sequence: ${chatId}`);
  }

  state.current_chat_id = chatId;
  state.completed_chat_ids = Array.from(
    new Set([...(state.completed_chat_ids || []), chatId]),
  );
  state.next_chat_id = idx + 1 < seq.length ? seq[idx + 1] : null;

  state.current_milestone = idx;
  state.next_milestone = idx + 1;
  state.completed_milestones = Array.from(
    new Set([...(state.completed_milestones || []), idx]),
  );

  return state;
}

function finalize(opts) {
  const stateBefore = readState();
  const milestone = opts.milestone || stateBefore.next_chat_id;

  if (!milestone)
    fail("--milestone is required, and state has no next_chat_id.");

  const message = opts.message || `zabon/blog: Chat ${milestone}`;

  const result = spawnSync(
    "node",
    ["tools/finalize-chat.js", "--milestone", milestone, "--message", message],
    {
      cwd: BLOG_ROOT,
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    },
  );

  if (result.stdout) console.log(result.stdout);
  if (result.stderr) console.error(result.stderr);

  if (result.status !== 0) {
    fail(`finalize-chat.js failed with exit code ${result.status}`);
  }

  let after = {};
  try {
    after = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    after = {};
  }

  const merged = {
    ...stateBefore,
    ...after,
    upload_mode: stateBefore.upload_mode,
    max_upload_files: stateBefore.max_upload_files,
    reserve_output_files: stateBefore.reserve_output_files,
    chat_sequence: stateBefore.chat_sequence,
  };

  advanceState(merged, milestone);
  writeState(merged);

  console.log("");
  console.log(
    `STATE ADVANCED: completed=${milestone} next=${merged.next_chat_id || "COMPLETE"}`,
  );
  console.log("Next command:");
  console.log(
    merged.next_chat_id ? "node tools/chatbridge.js prep" : "Pack complete.",
  );
}

function verify(opts) {
  const state = readState();
  const milestone = opts.milestone || state.next_chat_id;

  if (!milestone) fail("No milestone specified and state has no next_chat_id.");

  const manifestPath = path.join(UPLOAD_ROOT, milestone, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    fail(`Missing manifest: tools/chat-upload/${milestone}/manifest.json`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const errors = [];

  for (const bundle of manifest.bundles || []) {
    const abs = path.join(BLOG_ROOT, bundle.path);
    if (!fs.existsSync(abs)) {
      errors.push(`Missing bundle: ${bundle.path}`);
      continue;
    }

    const actual = sha256String(fs.readFileSync(abs, "utf8"));
    if (actual !== bundle.sha256) {
      errors.push(`Bundle hash mismatch: ${bundle.path}`);
    }
  }

  for (const source of manifest.sources || []) {
    if (source.virtual) continue;

    const abs = path.join(BLOG_ROOT, source.path);
    if (!fs.existsSync(abs)) {
      errors.push(`Missing source file: ${source.path}`);
      continue;
    }

    const actual = sha256String(fs.readFileSync(abs, "utf8"));
    if (actual !== source.sha256) {
      errors.push(`Source hash mismatch since prep: ${source.path}`);
    }
  }

  if (errors.length) {
    console.error("VERIFY FAIL:");
    errors.forEach((e) => console.error(`- ${e}`));
    process.exit(1);
  }

  console.log("VERIFY OK");
}

function help() {
  console.log(`Zabon chatbridge

Commands:
  prep [--milestone NN] [--max-files N] [--reserve-output N] [--extra-files a,b,c]
  run --label name --exec "command" [--milestone NN]
  note --label name --text "observation" [--milestone NN]
  verify [--milestone NN]
  finalize --milestone NN --message "commit message"
`);
}

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const opts = parseArgs(rest);

  if (cmd === "prep") return prep(opts);
  if (cmd === "run") return run(opts);
  if (cmd === "note") return note(opts);
  if (cmd === "verify") return verify(opts);
  if (cmd === "finalize") return finalize(opts);

  help();
}

main();

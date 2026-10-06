#!/usr/bin/env node
/**
 * Zabon Blog — Offline Translation Pipeline (milestone 11a, decision m1)
 *
 * PRE-GENERATED, OFFLINE translator. It is NEVER called at runtime by the
 * app; the API key is read from an environment variable and is NEVER
 * committed or shipped (D-11a-2).
 *
 *   node tools/translate.js --lang <fa|th|ar> [--slug <slug>] [--dry-run]
 *
 * Reads  content/en/<slug>.json  (the canonical EN envelope).
 * Writes content/<lang>/<slug>.json (g1: same structure, translated text).
 *
 * g1 (D-11a-3): translate ONLY human-readable text —
 *   top-level `title`; and, per block: paragraph.content, quote.content,
 *   image.caption, embed.content, table.content, footnotes.content.
 * NEVER TOUCH: `slug`, `lang`, `date`, block `type`, `src`/URLs, and — the
 * critical one — the HTML TAGS, ATTRIBUTES, ENTITIES and hrefs INSIDE any
 * `content` string. Those are preserved BYTE-FOR-BYTE. Achieved via the
 * provider's HTML mode (DeepL tag_handling=html); if a fragment's round-trip
 * is not tag-neutral, we fall back to translating ONLY the text segments
 * between tags. A per-field tag-invariance assertion runs on EVERY translated
 * field and ABORTS the whole run (writing nothing) on any mismatch (D-11a-7).
 *
 * Node 20 LTS native (global fetch, URLSearchParams). No external npm deps.
 */

"use strict";

const fs = require("fs");
const path = require("path");

// --- Locations (this file lives in apps/blog/tools) -------------------------
const APP_ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(APP_ROOT, "content");

// --- Config ----------------------------------------------------------------
const DEFAULT_SLUG = "update";
const SUPPORTED_LANGS = ["fa", "th", "ar"];

// DeepL (default). Source is always EN.
const KEY_ENV = "DEEPL_API_KEY";
const DEEPL_ENDPOINT = "https://api-free.deepl.com/v2/translate";
const DEEPL_ENDPOINT_PRO = "https://api.deepl.com/v2/translate";
// Usage endpoint mirrors the translate host (free vs pro). /v2/usage is the
// AUTHORITATIVE quota for the KEY IN USE — it is NOT the account page on the
// web (those can be different accounts; see HANDOFF-11b note re HTTP 456).
const DEEPL_USAGE = "https://api-free.deepl.com/v2/usage";
const DEEPL_USAGE_PRO = "https://api.deepl.com/v2/usage";
// DeepL wants upper-case target codes and (optionally) region variants.
const DEEPL_TARGET = { fa: "FA", th: "TH", ar: "AR" };
// Explicit source lang for HTML fragments; keeps behaviour deterministic.
const DEEPL_SOURCE = "EN";

// g1: the ONLY string fields that may be translated, keyed by block type.
// A block type not listed here has NO translatable string (e.g. heading has
// `content` but is not in scope for 11a's live set) — see TRANSLATE_TITLE
// below and the field list in the milestone.
const TRANSLATABLE_BLOCK_FIELDS = {
  paragraph: ["content"],
  quote: ["content"],
  image: ["caption"],
  embed: ["content"],
  table: ["content"],
  footnotes: ["content"],
};

// ===========================================================================
// Tag handling
// ===========================================================================

// A tolerant tag/comment/entity-aware segmenter. We only ever need to know
// (a) the exact list of tag tokens in a string and (b) how to split a string
// into alternating text/tag tokens. We do NOT reimplement an HTML parser.
const TAG_OR_COMMENT_RE = /<!--[\s\S]*?-->|<[^>]*>/g;

/**
 * Return the ordered list of tag tokens (verbatim) found in an HTML string.
 * Entities are NOT tags and are intentionally ignored here; they ride along
 * inside text and are preserved by the provider's HTML mode / by segmenting.
 */
function extractTags(html) {
  if (typeof html !== "string") return [];
  return html.match(TAG_OR_COMMENT_RE) || [];
}

/**
 * Split an HTML string into an ordered array of tokens:
 *   { kind: "tag",   value }   — a tag/comment, preserved verbatim
 *   { kind: "text",  value }   — a run of text (may contain entities)
 * Concatenating every token's .value reproduces the input EXACTLY.
 */
function segment(html) {
  const tokens = [];
  if (typeof html !== "string" || html.length === 0) return tokens;
  let last = 0;
  TAG_OR_COMMENT_RE.lastIndex = 0;
  let m;
  while ((m = TAG_OR_COMMENT_RE.exec(html)) !== null) {
    if (m.index > last) {
      tokens.push({ kind: "text", value: html.slice(last, m.index) });
    }
    tokens.push({ kind: "tag", value: m[0] });
    last = m.index + m[0].length;
  }
  if (last < html.length) {
    tokens.push({ kind: "text", value: html.slice(last) });
  }
  return tokens;
}

/**
 * Assert that the source and the provider's output carry the SAME ORDERED
 * sequence of tag tokens (each token VERBATIM). This is the g1 tag-invariance
 * contract (D-11a-3 / D-11a-7). Throws on ANY mismatch: a changed count, a
 * changed token (mangled attribute / dropped self-closing slash), a dropped
 * tag, an injected tag, OR a reordered pair.
 *
 * Why ORDER and not just a multiset: g1 says tags are preserved
 * BYTE-FOR-BYTE; an order-preserving verbatim sequence is the faithful,
 * strongest invariant, and DeepL's HTML mode preserves order in practice.
 * A reordered fragment is treated as unsafe and will fall back to the
 * segmentation path (which preserves order by construction) or abort.
 */
function assertTagsInvariant(sourceHtml, translatedHtml, fieldLabel) {
  const srcTags = extractTags(sourceHtml);
  const outTags = extractTags(translatedHtml);
  if (srcTags.length !== outTags.length) {
    throw new TagInvarianceError(
      fieldLabel,
      `tag count changed: source=${srcTags.length} translated=${outTags.length}`,
    );
  }
  for (let i = 0; i < srcTags.length; i += 1) {
    if (srcTags[i] !== outTags[i]) {
      throw new TagInvarianceError(
        fieldLabel,
        `tag token #${i} changed: source=${JSON.stringify(
          srcTags[i],
        )} translated=${JSON.stringify(outTags[i])}`,
      );
    }
  }
}

/**
 * A plain-text / no-tag field still gets the invariance assertion (zero tags
 * expected on both sides) so a provider that suddenly injects markup is
 * caught. Kept explicit for clarity.
 */
function assertPlainTextBudget(sourceText, translatedText, fieldLabel) {
  assertTagsInvariant(sourceText, translatedText, fieldLabel);
}

class TagInvarianceError extends Error {
  constructor(fieldLabel, detail) {
    super(`tag-invariance violated for "${fieldLabel}": ${detail}`);
    this.name = "TagInvarianceError";
    this.fieldLabel = fieldLabel;
    this.detail = detail;
  }
}

// ===========================================================================
// DeepL transport
// ===========================================================================

function getApiKey() {
  const key = process.env[KEY_ENV];
  if (!key || !key.trim()) return null;
  return key.trim();
}

/**
 * Fetch the AUTHORITATIVE quota for the key in use from /v2/usage.
 * Returns { character_count, character_limit, remaining } or throws.
 *
 * This is the source of truth for "how many characters do I have left".
 * It is NOT the DeepL account web page — a key can belong to a different
 * account (or carry a per-key cap) than the page shows, which is exactly the
 * confusing case where the web page shows "120,446 / 1M" but the API returns
 * HTTP 456 "Quota exceeded" because the KEY's own account is exhausted
 * (e.g. 1,000,000 / 1,000,000).
 */
async function deeplUsage(apiKey) {
  const endpoint = apiKey.endsWith(":fx") ? DEEPL_USAGE : DEEPL_USAGE_PRO;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: `DeepL-Auth-Key ${apiKey}` },
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch (_) {
      /* ignore */
    }
    throw new Error(
      `DeepL usage request failed: HTTP ${res.status} ${res.statusText}${
        detail ? ` — ${detail.slice(0, 200)}` : ""
      }`,
    );
  }
  const json = await res.json();
  const character_count = Number(json.character_count);
  const character_limit = Number(json.character_limit);
  if (!Number.isFinite(character_count) || !Number.isFinite(character_limit)) {
    throw new Error("DeepL usage response missing character_count/limit.");
  }
  return {
    character_count,
    character_limit,
    remaining: character_limit - character_count,
  };
}

/**
 * Call DeepL once with tag_handling=html for a list of texts, returning the
 * translated strings in the same order. Throws on transport/HTTP errors.
 */
async function deeplTranslateBatch(texts, targetLangCode, apiKey) {
  const body = new URLSearchParams();
  for (const t of texts) body.append("text", t);
  body.set("source_lang", DEEPL_SOURCE);
  body.set("target_lang", targetLangCode);
  body.set("tag_handling", "html");
  body.set("preserve_formatting", "1");

  // DeepL free keys end with ":fx"; use the free host for those.
  const endpoint = apiKey.endsWith(":fx") ? DEEPL_ENDPOINT : DEEPL_ENDPOINT_PRO;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch (_) {
      /* ignore */
    }
    throw new Error(
      `DeepL request failed: HTTP ${res.status} ${res.statusText}${
        detail ? ` — ${detail.slice(0, 400)}` : ""
      }`,
    );
  }

  const json = await res.json();
  if (!json || !Array.isArray(json.translations)) {
    throw new Error("DeepL response missing `translations` array.");
  }
  return json.translations.map((tr) => String(tr.text));
}

/**
 * Translate ONE string field safely.
 *
 * Primary path: send the whole fragmentation through DeepL HTML mode.
 * Fallback (D-11a-3): if the round-trip is NOT tag-neutral, translate ONLY
 * the text segments individually and reassemble with the original tags.
 * Either way we (re)assert invariance before returning.
 *
 * Returns the translated string.
 */
async function translateFieldSafe(srcHtml, targetLangCode, apiKey, fieldLabel) {
  // Fast path: no tags -> plain translate.
  const tags = extractTags(srcHtml);
  if (tags.length === 0) {
    const [out] = await deeplTranslateBatch([srcHtml], targetLangCode, apiKey);
    assertPlainTextBudget(srcHtml, out, fieldLabel);
    return out;
  }

  // Primary: whole-fragment HTML mode.
  const [whole] = await deeplTranslateBatch([srcHtml], targetLangCode, apiKey);
  try {
    assertTagsInvariant(srcHtml, whole, fieldLabel);
    return whole;
  } catch (err) {
    if (!(err instanceof TagInvarianceError)) throw err;
    // Fall through to the segmentation fallback.
  }

  // Fallback: translate text segments only, keep tags verbatim.
  const tokens = segment(srcHtml);
  const textIdx = [];
  const textsToTranslate = [];
  tokens.forEach((tok, i) => {
    if (tok.kind === "text" && tok.value.length > 0) {
      textIdx.push(i);
      textsToTranslate.push(tok.value);
    }
  });

  let translatedSegments = [];
  if (textsToTranslate.length > 0) {
    translatedSegments = await deeplTranslateBatch(
      textsToTranslate,
      targetLangCode,
      apiKey,
    );
  }

  const outTokens = tokens.map((t) => t.value);
  textIdx.forEach((tokIndex, k) => {
    outTokens[tokIndex] = translatedSegments[k];
  });
  const out = outTokens.join("");

  // Final hard assertion: reassembled output must be tag-identical.
  assertTagsInvariant(srcHtml, out, fieldLabel);
  return out;
}

// ===========================================================================
// Envelope walk (g1)
// ===========================================================================

/**
 * Build the target envelope from the EN envelope + the three table lookups.
 * We translate by MUTATING a deep clone, never the source object.
 *
 * Returns { envelope, plan } where plan is a list of { path, chars } records.
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

async function translateEnvelope(envelope, lang, apiKey, dryRun) {
  const out = deepClone(envelope);
  out.lang = lang; // g1: language tag becomes the target.

  const plan = []; // { path, chars }

  // 1) Top-level title (human-readable text; may contain entities, no tags
  //    in the current corpus, but use the same safe path regardless).
  if (typeof envelope.title === "string" && envelope.title.length > 0) {
    plan.push({ path: "title", chars: envelope.title.length });
    if (!dryRun) {
      out.title = await translateFieldSafe(
        envelope.title,
        DEEPL_TARGET[lang] || lang.toUpperCase(),
        apiKey,
        "title",
      );
    }
  }

  // 2) Per-block fields (g1).
  const blocks = Array.isArray(envelope.blocks) ? envelope.blocks : [];
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    if (!block || typeof block !== "object") continue;
    const fields = TRANSLATABLE_BLOCK_FIELDS[block.type];
    if (!fields) continue; // block type has no in-scope translatable text.
    for (const field of fields) {
      const src = block[field];
      if (typeof src !== "string" || src.length === 0) continue;
      const label = `blocks[${i}].${field}`;
      plan.push({ path: label, chars: src.length });
      if (!dryRun) {
        out.blocks[i][field] = await translateFieldSafe(
          src,
          DEEPL_TARGET[lang] || lang.toUpperCase(),
          apiKey,
          label,
        );
      }
    }
  }

  return { envelope: out, plan };
}

// ===========================================================================
// CLI
// ===========================================================================

function parseArgs(argv) {
  const args = {
    lang: null,
    slug: DEFAULT_SLUG,
    dryRun: false,
    usage: false,
    skipUsageCheck: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--lang") args.lang = argv[++i];
    else if (a.startsWith("--lang=")) args.lang = a.slice(7);
    else if (a === "--slug") args.slug = argv[++i];
    else if (a.startsWith("--slug=")) args.slug = a.slice(7);
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--usage") args.usage = true;
    else if (a === "--no-usage-check") args.skipUsageCheck = true;
    else if (a === "-h" || a === "--help") args.help = true;
    else if (a.startsWith("-")) throw new Error(`Unknown flag: ${a}`);
  }
  return args;
}

function usageText() {
  console.log(
    [
      "Usage: node tools/translate.js --lang <fa|th|ar> [--slug <slug>] [--dry-run]",
      "       node tools/translate.js --usage",
      "",
      `  --lang    target language (one of: ${SUPPORTED_LANGS.join(", ")})`,
      `  --slug    EN source slug (default: ${DEFAULT_SLUG})`,
      "  --dry-run print the translation plan and write nothing",
      "  --usage   print the authoritative DeepL quota for the key and exit",
      "  --no-usage-check  skip the preflight quota check (real runs only)",
      "",
      `Requires the API key in the environment variable ${KEY_ENV}.`,
      "The key is never committed or shipped (offline, pre-generated only).",
      "QUOTA: /v2/usage is authoritative, NOT the DeepL account web page.",
    ].join("\n"),
  );
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`\n✗ ${err.message}\n`);
    usageText();
    process.exit(2);
  }

  if (args.help) {
    usageText();
    process.exit(0);
  }

  // --usage: print the AUTHORITATIVE quota for the key in use and exit.
  // No --lang required. This is the number to trust (NOT the account page).
  if (args.usage) {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.error(`\n✗ Missing API key. Export ${KEY_ENV} and re-run.\n`);
      process.exit(3);
    }
    try {
      const u = await deeplUsage(apiKey);
      console.log(
        `\n=== DeepL usage (key in use; ${apiKey.endsWith(":fx") ? "free" : "pro"} host) ===\n`,
      );
      console.log(`  used      : ${u.character_count}`);
      console.log(`  limit     : ${u.character_limit}`);
      console.log(`  remaining : ${u.remaining}`);
      console.log(
        u.remaining <= 0
          ? "\n  ⚠ QUOTA EXHAUSTED — HTTP 456 expected until the monthly reset.\n"
          : "",
      );
    } catch (err) {
      console.error(`\n✗ ${err.message}\n`);
      process.exit(1);
    }
    process.exit(0);
  }

  // Validate language.
  if (!args.lang || !SUPPORTED_LANGS.includes(args.lang)) {
    console.error(
      `\n✗ --lang is required and must be one of: ${SUPPORTED_LANGS.join(
        ", ",
      )} (got ${JSON.stringify(args.lang)})\n`,
    );
    usageText();
    process.exit(2);
  }

  const slug = args.slug;
  const srcFile = path.join(CONTENT_DIR, "en", `${slug}.json`);
  const destDir = path.join(CONTENT_DIR, args.lang);
  const destFile = path.join(destDir, `${slug}.json`);

  if (!fs.existsSync(srcFile)) {
    console.error(`\n✗ EN source not found: ${srcFile}\n`);
    process.exit(1);
  }

  let source;
  try {
    source = JSON.parse(fs.readFileSync(srcFile, "utf8"));
  } catch (err) {
    console.error(`\n✗ Failed to parse ${srcFile}: ${err.message}\n`);
    process.exit(1);
  }

  // The API key is required for a real run AND for the dry-run (so the human
  // gets a meaningful, key-gated check). --dry-run writes nothing either way.
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error(
      `\n✗ Missing API key. Export ${KEY_ENV} and re-run.\n` +
        `  The key is read from the environment and is never committed.\n`,
    );
    process.exit(3);
  }

  // Compute the plan (no network needed for the plan itself).
  const { envelope, plan } = await translateEnvelope(
    source,
    args.lang,
    apiKey,
    true,
  );

  const mode = args.dryRun ? "DRY-RUN" : "WRITE";
  console.log(`\n=== translate.js — ${mode} ===\n`);
  console.log(`  source : ${path.relative(APP_ROOT, srcFile)}`);
  console.log(`  target : ${path.relative(APP_ROOT, destFile)}`);
  console.log(`  lang   : en -> ${args.lang}`);
  console.log(
    `  blocks : ${Array.isArray(source.blocks) ? source.blocks.length : 0}`,
  );
  console.log(`  fields : ${plan.length} translatable string field(s)`);
  for (const p of plan) {
    console.log(`    - ${p.path} (${p.chars} chars)`);
  }

  if (args.dryRun) {
    console.log("\n  DRY-RUN: no network call made, no file written.\n");
    process.exit(0);
  }

  // Preflight quota check (real runs only). /v2/usage is AUTHORITATIVE for
  // the key in use — NOT the DeepL account web page (they can differ, which
  // is the confusing "page shows 120K/1M but API returns 456" case). We
  // estimate the source-character cost of this slug and warn/abort early
  // instead of failing mid-batch with HTTP 456.
  if (!args.skipUsageCheck) {
    try {
      const u = await deeplUsage(apiKey);
      const cost = plan.reduce((n, p) => n + p.chars, 0);
      console.log(
        `\n  quota : ${u.character_count} / ${u.character_limit} used ` +
          `(${u.remaining} remaining; this slug ≈ ${cost} source chars)`,
      );
      if (u.remaining <= 0) {
        console.error(
          `\n✗ ABORTED before writing: DeepL quota exhausted ` +
            `(${u.character_count}/${u.character_limit}).\n` +
            `  /v2/usage is authoritative for THIS key. If your account page\n` +
            `  shows unused quota, the key belongs to a DIFFERENT account (or\n` +
            `  carries a per-key cap). Wait for the monthly reset, upgrade, or\n` +
            `  use another key. Re-run with --no-usage-check to override.\n`,
        );
        process.exit(6);
      }
      if (cost > u.remaining) {
        console.error(
          `\n✗ ABORTED before writing: this slug needs ≈ ${cost} source chars ` +
            `but only ${u.remaining} remain.\n` +
            `  Wait for the monthly reset, upgrade, or translate a shorter\n` +
            `  slug. Re-run with --no-usage-check to override.\n`,
        );
        process.exit(6);
      }
    } catch (err) {
      // A usage-probe failure must NOT block translation (best-effort check).
      console.error(
        `  quota : (usage check unavailable: ${err.message}) — continuing`,
      );
    }
  }

  // Real run: translate (network), asserting tag-invariance per field.
  let result;
  try {
    result = await translateEnvelope(source, args.lang, apiKey, false);
  } catch (err) {
    if (err instanceof TagInvarianceError) {
      console.error(
        `\n✗ ABORTED before writing: ${err.message}\n` +
          `  No file was written (D-11a-7).\n`,
      );
      process.exit(4);
    }
    console.error(`\n✗ ABORTED before writing: ${err.message}\n`);
    process.exit(5);
  }

  // Structural guard: identical envelope shape except lang + translated text.
  assertStructurePreserved(source, result.envelope);

  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(
    destFile,
    JSON.stringify(result.envelope, null, 2) + "\n",
    "utf8",
  );
  console.log(`\n✓ Wrote ${path.relative(APP_ROOT, destFile)}\n`);
}

/**
 * Hard structural guard: the target must have the SAME slug, date, block
 * count, per-block `type`, and every non-text field (incl. src) as the source.
 * g1/N4. Throws on any divergence.
 */
function assertStructurePreserved(src, out) {
  const fail = (msg) => {
    throw new Error(`structure divergence: ${msg}`);
  };
  if (src.slug !== out.slug) fail(`slug changed (${src.slug} -> ${out.slug})`);
  if (src.date !== out.date) fail("date changed");
  if (!Array.isArray(src.blocks) || !Array.isArray(out.blocks))
    fail("blocks not arrays");
  if (src.blocks.length !== out.blocks.length)
    fail(`block count changed (${src.blocks.length} -> ${out.blocks.length})`);

  for (let i = 0; i < src.blocks.length; i += 1) {
    const a = src.blocks[i];
    const b = out.blocks[i];
    if (a.type !== b.type)
      fail(`blocks[${i}].type changed (${a.type} -> ${b.type})`);
    // Every key present in the source block must exist in the target block,
    // and every non-translatable field must be byte-identical.
    const translatable = TRANSLATABLE_BLOCK_FIELDS[a.type] || [];
    for (const key of Object.keys(a)) {
      if (!(key in b)) fail(`blocks[${i}] lost field "${key}"`);
      if (key === "type") continue;
      if (translatable.includes(key)) continue; // allowed to differ
      if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
        fail(`blocks[${i}].${key} changed (non-translatable)`);
      }
    }
  }
}

main().catch((err) => {
  console.error(
    `\n✗ Unexpected error: ${err && err.stack ? err.stack : err}\n`,
  );
  process.exit(1);
});

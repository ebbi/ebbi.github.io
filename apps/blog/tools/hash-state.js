#!/usr/bin/env node
/**
 * Zabon Blog — Hash State Generator
 * Outputs SHA256 hashes for canonical files in HANDOFF format.
 *
 * Run from REPO_ROOT (zabon/):
 *   node apps/blog/tools/hash-state.js
 *
 * Decisions frozen in milestone 05a-fix:
 * - APP_ROOT resolves to apps/blog (__dirname is apps/blog/tools).
 * - SCHEMA_SHA256 is omitted (Option 2): no canonical schema.json exists yet.
 * - FILE_TREE_SHA256 = sha256 of `git ls-files apps/blog`, sorted, newline-joined.
 * - CONTENT_EN_..._SHA256 = sha256 of the posts.json entry matching the pilot slug.
 * - GIT_HEAD / GIT_DIRTY come from `git` run with cwd at repo root.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

// __dirname is apps/blog/tools → one ".." lands on apps/blog.
const APP_ROOT = path.join(__dirname, "..");
// Repo root (zabon/) is two levels up from APP_ROOT.
const REPO_ROOT = path.join(APP_ROOT, "..", "..");

const PILOT_SLUG = "jews-in-palestine-before-israel";

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function hashFile(filePath) {
  if (!fs.existsSync(filePath)) return "MISSING";
  return sha256(fs.readFileSync(filePath));
}

function git(args) {
  return execSync(`git ${args}`, { encoding: "utf8", cwd: REPO_ROOT }).trim();
}

/**
 * sha256 of the sorted, newline-joined list of paths under apps/blog/
 * tracked by git (`git ls-files apps/blog`), which honors .gitignore.
 */
function hashFileTree() {
  try {
    const raw = execSync("git ls-files apps/blog", {
      encoding: "utf8",
      cwd: REPO_ROOT,
    });
    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    lines.sort();
    return sha256(lines.join("\n"));
  } catch (err) {
    return "MISSING";
  }
}

/**
 * sha256 of the posts.json array entry whose slug matches PILOT_SLUG,
 * re-serialized deterministically so unrelated post edits don't shift the hash.
 */
function hashPilotContent() {
  const postsPath = path.join(APP_ROOT, "assets", "data", "posts.json");
  if (!fs.existsSync(postsPath)) return "MISSING";
  let posts;
  try {
    posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));
  } catch (err) {
    return "MISSING";
  }
  if (!Array.isArray(posts)) return "MISSING";
  const entry = posts.find((p) => p && p.slug === PILOT_SLUG);
  if (!entry) return "MISSING";
  return sha256(JSON.stringify(entry, null, 2));
}

function printHashState() {
  console.log("\n=== Hash State ===\n");

  console.log(
    `LOCKED_DECISIONS_SHA256=${hashFile(
      path.join(APP_ROOT, "tools", "LOCKED_DECISIONS.txt"),
    )}`,
  );

  // SCHEMA_SHA256 intentionally omitted (Option 2 — no schema.json yet).

  console.log(
    `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=${hashPilotContent()}`,
  );

  console.log(`FILE_TREE_SHA256=${hashFileTree()}`);

  try {
    console.log(`GIT_HEAD=${git("rev-parse HEAD")}`);
    const status = git("status --porcelain");
    console.log(`GIT_DIRTY=${status.length > 0}`);
  } catch (err) {
    console.log("GIT_HEAD=UNAVAILABLE");
    console.log("GIT_DIRTY=UNKNOWN");
  }

  console.log("\n");
}

printHashState();

#!/usr/bin/env node
/**
 * Zabon Blog — Hash State Generator
 * Outputs SHA256 hashes for key files in HANDOFF format
 * Run from REPO_ROOT: node zabon/apps/blog/tools/hash-state.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const APP_ROOT = path.join(__dirname, "..", "..");

/**
 * Compute SHA256 hash of a file
 */
function hashFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return "MISSING";
  }
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Output hash state in HANDOFF format
 */
function printHashState() {
  const filesToHash = [
    { key: "LOCKED_DECISIONS_SHA256", path: "tools/LOCKED_DECISIONS.txt" },
    { key: "SCHEMA_SHA256", path: "tools/CONTEXT.md" },
    {
      key: "CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256",
      path: "content/en/jews-in-palestine-before-israel.json",
    },
    { key: "FILE_TREE_SHA256", path: ".gitignore" }, // Placeholder for file tree hash
  ];

  console.log("\n=== Hash State ===\n");

  filesToHash.forEach(({ key, path: filePath }) => {
    const fullPath = path.join(APP_ROOT, filePath);
    const hash = hashFile(fullPath);
    console.log(`${key}=${hash}`);
  });

  // Git HEAD hash
  try {
    const { execSync } = require("child_process");
    const gitHead = execSync("git rev-parse HEAD", {
      encoding: "utf8",
      cwd: path.join(APP_ROOT, "..", ".."),
    }).trim();
    console.log(`GIT_HEAD=${gitHead}`);

    // Check dirty state
    const status = execSync("git status --porcelain", {
      encoding: "utf8",
      cwd: path.join(APP_ROOT, "..", ".."),
    }).trim();
    const isDirty = status.length > 0;
    console.log(`GIT_DIRTY=${isDirty}`);
  } catch (err) {
    console.log("GIT_HEAD=UNAVAILABLE");
    console.log("GIT_DIRTY=UNKNOWN");
  }

  console.log("\n");
}

printHashState();

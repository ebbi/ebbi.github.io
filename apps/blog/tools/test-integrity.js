#!/usr/bin/env node
/**
 * Zabon Blog — Integrity Test Script
 * Run from REPO_ROOT: node zabon/apps/blog/tools/test-integrity.js
 */

const fs = require("fs");
const path = require("path");

const APP_ROOT = path.join(__dirname, "..", "..");
const REQUIRED_FILES = [
  "index.html",
  "assets/css/style.css",
  "assets/js/router.js",
  "assets/js/app.js",
  "tools/test-integrity.js",
  "tools/hash-state.js",
];

let allPassed = true;

console.log("\n=== Zabon Blog — Integrity Check ===\n");

// Check required files exist

REQUIRED_FILES.forEach((file) => {
  const fullPath = path.join(APP_ROOT, file);
  const exists = fs.existsSync(fullPath);

  console.log(`[${exists ? "✓" : "✗"}] ${file}`);
  if (!exists) allPassed = false;
});

// Check LOCKED_DECISIONS.txt exists (required for context)

const lockedDecisionsPath = path.join(
  APP_ROOT,
  "tools",
  "LOCKED_DECISIONS.txt",
);
const hasLockedDecisions = fs.existsSync(lockedDecisionsPath);

console.log(`[${hasLockedDecisions ? "✓" : "✗"}] tools/LOCKED_DECISIONS.txt`);
if (!hasLockedDecisions) allPassed = false;

// Check CONTEXT.md exists

const contextPath = path.join(APP_ROOT, "tools", "CONTEXT.md");
const hasContext = fs.existsSync(contextPath);

console.log(`[${hasContext ? "✓" : "✗"}] tools/CONTEXT.md`);
if (!hasContext) allPassed = false;

console.log("\n");

if (allPassed) {
  console.log("INTEGRITY OK\n");
  process.exit(0);
} else {
  console.log("INTEGRITY FAILED — Missing required files.\n");
  process.exit(1);
}

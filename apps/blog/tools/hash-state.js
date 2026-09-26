const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

// __dirname is zabon/apps/blog/tools
const APP_ROOT = path.resolve(__dirname, "../..");
const REPO_ROOT = path.resolve(__dirname, "../../../");

function hashFile(relPath) {
  const fullPath = path.join(APP_ROOT, relPath);
  if (!fs.existsSync(fullPath)) return "MISSING";
  try {
    return crypto
      .createHash("sha256")
      .update(fs.readFileSync(fullPath))
      .digest("hex");
  } catch {
    return "ERROR";
  }
}

function git(cmd) {
  try {
    return execSync(cmd, {
      cwd: REPO_ROOT,
      env: { ...process.env, GIT_DISCOVERY_ACROSS_FILESYSTEM: "1" },
      encoding: "utf8",
    }).trim();
  } catch {
    return "UNAVAILABLE";
  }
}

console.log("=== Hash State ===");
console.log(
  `LOCKED_DECISIONS_SHA256=${hashFile("tools/LOCKED_DECISIONS.txt")}`,
);
console.log(`SCHEMA_SHA256=${hashFile("tools/schema.json")}`);
console.log(
  `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=${hashFile("content/en/jews-in-palestine-before-israel.json")}`,
);
console.log(`FILE_TREE_SHA256=${hashFile("assets/data/file-tree.json")}`);
console.log(`GIT_HEAD=${git("git rev-parse HEAD")}`);
console.log(
  `GIT_DIRTY=${git("git diff --quiet HEAD -- 2>/dev/null || echo true")}`,
);

#!/usr/bin/env node
/**
 * group‑by‑language.js
 *
 * Convert a flat array of bilingual objects into a language‑grouped object.
 *
 *   INPUT (flat):
 *   [
 *     { "th": "ฉัน", "en": "I / me" },
 *     { "th": "ไป", "en": "go / travel" },
 *     { "th": "ตลาด", "en": "market / bazaar" }
 *   ]
 *
 *   OUTPUT (grouped):
 *   {
 *     "en": ["I / me", "go / travel", "market / bazaar"],
 *     "th": ["ฉัน", "ไป", "ตลาด"]
 *   }
 *
 * Usage (from the terminal, inside the project root):
 *   node group-by-language.js <input‑json‑file> <output‑json‑file>
 *
 * Example:
 *   node group-by-language.js ai_thai_raw.json ai_thai_grouped.json
 *
 * The script will:
 *   • read the input file (must be valid JSON),
 *   • detect every language key that appears in the first object,
 *   • build an array for each language preserving the original order,
 *   • write the resulting object to the output file (pretty‑printed).
 *
 * No external dependencies – just the built‑in `fs` and `path` modules.
 */

const fs = require('fs');
const path = require('path');

// -----------------------------------------------------------------
// Helper – exit with a friendly message if something goes wrong.
// -----------------------------------------------------------------
function die(msg) {
    console.error('\n❌  ' + msg);
    process.exit(1);
}

// -----------------------------------------------------------------
// Parse CLI arguments
// -----------------------------------------------------------------
const [, , inFile, outFile] = process.argv;

if (!inFile || !outFile) {
    die(`Usage: node ${path.basename(process.argv[1])} <input‑json> <output‑json>\n` +
        `Example: node ${path.basename(process.argv[1])} ai_thai_raw.json ai_thai_grouped.json`);
}

// Resolve relative paths (makes it work from any cwd)
const inPath = path.resolve(process.cwd(), inFile);
const outPath = path.resolve(process.cwd(), outFile);

// -----------------------------------------------------------------
// 1️⃣  Load & parse the input JSON
// -----------------------------------------------------------------
let rawData;
try {
    rawData = JSON.parse(fs.readFileSync(inPath, 'utf8'));
} catch (e) {
    die(`Failed to read or parse "${inFile}": ${e.message}`);
}

// Expect an array of objects
if (!Array.isArray(rawData)) {
    die(`Input file must contain a JSON array (got ${typeof rawData})`);
}
if (rawData.length === 0) {
    die('Input array is empty – nothing to group.');
}

// -----------------------------------------------------------------
// 2️⃣  Discover all language keys present in the first element.
// -----------------------------------------------------------------
const firstObj = rawData[0];
const langKeys = Object.keys(firstObj).filter(k => typeof firstObj[k] === 'string');

if (langKeys.length === 0) {
    die('No string‑valued language keys found in the first object.');
}

// -----------------------------------------------------------------
// 3️⃣  Build the grouped result: { en: [], th: [], … }
// -----------------------------------------------------------------
const grouped = {};
langKeys.forEach(k => (grouped[k] = []));

for (const entry of rawData) {
    // Guard against missing keys – we simply push an empty string.
    for (const k of langKeys) {
        const val = entry[k];
        grouped[k].push(typeof val === 'string' ? val : '');
    }
}

// -----------------------------------------------------------------
// 4️⃣  Write the output file (pretty‑printed, 2‑space indent)
// -----------------------------------------------------------------
try {
    fs.writeFileSync(outPath, JSON.stringify(grouped, null, 2), 'utf8');
    console.log(`✅  Grouped data written to "${outFile}"`);
} catch (e) {
    die(`Failed to write "${outFile}": ${e.message}`);
}
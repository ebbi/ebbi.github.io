#!/usr/bin/env node
/**
 * i18n‑key audit
 *
 * Scans all JSON locale files, compares them against a reference
 * (default: en.json) and prints missing / extra keys per language.
 *
 * Usage:
 *   node scripts/i18n-audit.js          # uses ./app/en.json as reference
 *   node scripts/i18n-audit.js fr.json  # specify a different reference file
 *
 * Exit code:
 *   0 – all locales are in sync
 *   1 – at least one locale has missing or extra keys
 *
 * No external dependencies – pure Node.js (fs, path, util, glob).
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const glob = util.promisify(require('glob'));

// ---------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------

// Folder that contains the locale JSON files (relative to project root)
const LOCALES_DIR = path.join(__dirname, '..', 'app');

// Glob pattern for locale files – adjust if you store them elsewhere
const LOCALE_GLOB = path.join(LOCALES_DIR, '*.json');

// Reference language (the file that defines the *canonical* key set)
// By default we use English, but you can pass another filename as CLI arg.
const REFERENCE_FILE = process.argv[2] || 'en.json';

// ---------------------------------------------------------------------
// Helper: read a JSON file and return a plain object (throws on parse error)
// ---------------------------------------------------------------------
function readJson(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8');
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error(`❌ Failed to parse JSON in ${filePath}: ${e.message}`);
        process.exit(2);
    }
}

// ---------------------------------------------------------------------
// Helper: flatten a nested object into dot‑separated keys
// Example: { a: { b: 1, c: { d: 2 } } } → [ 'a.b', 'a.c.d' ]
// ---------------------------------------------------------------------
function flattenKeys(obj, prefix = '') {
    const keys = [];
    for (const [k, v] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === 'object' && !Array.isArray(v)) {
            keys.push(...flattenKeys(v, fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    return keys;
}

// ---------------------------------------------------------------------
// Main audit logic
// ---------------------------------------------------------------------
(async () => {
    // 1️⃣ Gather all locale files
    const localePaths = await glob(LOCALE_GLOB);
    if (!localePaths.length) {
        console.error('❌ No locale JSON files found – check LOCALE_GLOB.');
        process.exit(2);
    }

    // 2️⃣ Load the reference file and compute its key set
    const refPath = path.join(LOCALES_DIR, REFERENCE_FILE);
    if (!fs.existsSync(refPath)) {
        console.error(`❌ Reference file ${REFERENCE_FILE} not found in ${LOCALES_DIR}`);
        process.exit(2);
    }
    const refData = readJson(refPath);
    const masterKeys = new Set(flattenKeys(refData));

    // 3️⃣ Iterate over each locale and compare
    let hasProblems = false;

    for (const localePath of localePaths) {
        const localeName = path.basename(localePath);
        // Skip the reference file itself – we already know it matches
        if (localeName === REFERENCE_FILE) continue;

        const localeData = readJson(localePath);
        const localeKeys = new Set(flattenKeys(localeData));

        // Missing keys = masterKeys – localeKeys
        const missing = [...masterKeys].filter(k => !localeKeys.has(k));
        // Extra keys = localeKeys – masterKeys
        const extra = [...localeKeys].filter(k => !masterKeys.has(k));

        if (missing.length === 0 && extra.length === 0) {
            console.log(`✅ ${localeName}: ✅ all keys present`);
            continue;
        }

        hasProblems = true;
        console.log(`\n⚠️ ${localeName}:`);

        if (missing.length) {
            console.log('  ❌ Missing keys:');
            missing.forEach(k => console.log(`    • ${k}`));
        }

        if (extra.length) {
            console.log('  ⚡ Unexpected (extra) keys:');
            extra.forEach(k => console.log(`    • ${k}`));
        }
    }

    if (hasProblems) {
        console.log('\n🚨 One or more locales have issues. See above.');
        process.exit(1);
    } else {
        console.log('\n🎉 All locale files are in sync with the reference.');
        process.exit(0);
    }
})();
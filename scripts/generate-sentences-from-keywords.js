#!/usr/bin/env node
// ---------------------------------------------
// generate-sentences-from-keywords-only.js
// -------------------------------------------------------------
// 1️⃣  Load thai_words_101_200_words.json (array of { th, en }).
// 2️⃣  For each entry create the sentence: "นี่ คือ <keyword‑th>".
// 3️⃣  Tokenise the Thai sentence.
// 4️⃣  Build a matching English token array: ["this","is","<keyword‑en>"].
// 5️⃣  Produce a JSON file whose objects have the exact shape of
//     thai_201_300_sentences_tokens.json, all sharing the same
//     category ("Keyword‑Generated").
// ---------------------------------------------------------------

const fs = require('fs');
const path = require('path');

// ----------------------------------------------------------------
// CONFIGURATION – change only if you move the files around
// ----------------------------------------------------------------
const INPUT_JSON = path.join(__dirname, 'thai_words_101_200_words.json');
const OUTPUT_JSON = path.join(__dirname, 'generated_from_keywords.json');

// ----------------------------------------------------------------
// 1️⃣  Load the keyword list (array of { th, en })
// ----------------------------------------------------------------
const keywordData = JSON.parse(fs.readFileSync(INPUT_JSON, 'utf8')); // [{th,en}, …]

// -----------------------------------------------------------
// 2️⃣  Fixed tokens that appear in every sentence
// -------------------------------------------------------------
const TH_THIS = 'นี่';
const TH_IS = 'คือ';
const EN_THIS = 'this';
const EN_IS = 'is';

// -------------------------------------------------------------
// 3️⃣  Build ONE sentence for a given keyword (preserve input order)
// ----------------------------------------------------------------
function buildSentence(index) {
    const { th: keywordTh, en: keywordEn } = keywordData[index];

    // Thai sentence: "นี่ คือ <keyword>"
    const thTokens = [TH_THIS, TH_IS, keywordTh];

    // English sentence: "this is <keyword>"
    const enTokens = [EN_THIS, EN_IS, keywordEn];

    // Place‑holder arrays for the other languages (you can replace later)
    const zhTokens = thTokens.map(() => '<zh>');
    const jaTokens = thTokens.map(() => '<ja>');
    const faTokens = thTokens.map(() => '<fa>');

    return {
        th: thTokens,
        en: enTokens,
        zh: zhTokens,
        ja: jaTokens,
        fa: faTokens
    };
}

// ------------------------------------------------------------
// 4️⃣  Assemble the final output array (preserve the order of the input)
// ----------------------------------------------------------------
const output = [];

for (let i = 0; i < keywordData.length; i++) {
    const sentenceObj = buildSentence(i);
    const id = `kw${String(i + 1).padStart(3, '0')}`; // kw001, kw002, …

    output.push({
        id,
        category: 'Keyword‑Generated', // same category for every entry
        ...sentenceObj
    });
}

// -------------------------------------------------------------
// 5️⃣  Write the result to disk
// ----------------------------------------------------------------
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2), 'utf8');
console.log(`✅ Generated ${output.length} sentences → ${OUTPUT_JSON}`);
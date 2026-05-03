// Translation API
const TranslationAPI = {
    cache: JSON.parse(localStorage.getItem('translationCache_v2') || '{}'),

    async translate(text, targetLang) {
        if (!text || text.trim() === '') return '';
        const cacheKey = `${text}_${targetLang}`;
        if (this.cache[cacheKey]) return this.cache[cacheKey];

        try {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=th|${targetLang}`
            );
            const data = await response.json();
            if (data.responseStatus === 200) {
                let translation = data.responseData.translatedText;
                if (targetLang === 'en') {
                    translation = translation.toLowerCase();
                }
                this.cache[cacheKey] = translation;
                localStorage.setItem('translationCache_v2', JSON.stringify(this.cache));
                return translation;
            }
        } catch (e) {
            console.warn('Translation failed:', e);
        }
        return '';
    },

    async translateHeading(text) {
        if (!text) return { en: '', fa: '', th: text };
        try {
            const enTranslation = await this.translate(text, 'en');
            const faTranslation = await this.translate(text, 'fa');
            return { en: enTranslation, fa: faTranslation, th: text };
        } catch (error) {
            return { en: '', fa: '', th: text };
        }
    }
};

// Text Cleaner
const Cleaner = {
    clean(text) {
        if (!text) return text;
        let cleaned = text.replace(/[^\u0E00-\u0E7F\s\n\/:\(\)]/g, '');
        cleaned = cleaned
            .replace(/[^\S\n]+/g, ' ')
            .replace(/^\s+/gm, '')
            .replace(/\s+$/gm, '')
            .replace(/\n\s+\n/g, '\n\n')
            .replace(/\n{3,}/g, '\n\n');
        return cleaned.trim();
    }
};

// App State
const AppState = {
    dataType: 'word',
    languages: [
        { code: 'en', name: 'English', flag: '🇬🇧', selected: true },
        { code: 'fa', name: 'Farsi', flag: '🇮🇷', selected: true }
    ],
    mainVocabulary: {},
    blocks: [],
    currentWorkflow: 'create',
    currentDocument: null
};

// ==================== INIT ====================
function init() {
    setDataType('word');
    updateStats();
    updateCacheDisplay();
    showFullDocument();
    document.getElementById('newTag').addEventListener('keypress', handleTagKeyPress);
    document.getElementById('updateFileInput').addEventListener('change', loadDocumentForUpdate);
    switchWorkflow('create');
    addWordMismatchIndicator();
}

// ==================== WORKFLOW SWITCHING ====================
function switchWorkflow(workflow) {
    AppState.currentWorkflow = workflow;
    document.getElementById('createView').classList.add('hidden');
    document.getElementById('updateView').classList.add('hidden');
    document.getElementById('metadataPanel').classList.add('hidden');

    if (workflow === 'create') {
        document.getElementById('metadataPanel').classList.remove('hidden');
        document.getElementById('createView').classList.remove('hidden');
        initializeNewDocument();
    } else {
        document.getElementById('updateFileInput').click();
    }
}

// ==================== CREATE WORKFLOW ====================
function initializeNewDocument() {
    AppState.mainVocabulary = {};
    AppState.blocks = [];

    const tags = getTags();

    const newDoc = {
        documentId: document.getElementById('docId').value,
        metadata: {
            version: document.getElementById('version').value,
            created: new Date().toISOString().split('T')[0] + 'T10:00:00Z',
            updated: new Date().toISOString(),
            authors: document.getElementById('authors').value.split(',').map(s => s.trim()).filter(s => s),
            reviewers: document.getElementById('reviewers').value.split(',').map(s => s.trim()).filter(s => s),
            difficulty: parseInt(document.getElementById('difficulty').value),
            prerequisites: document.getElementById('prerequisites').value.split(',').map(s => s.trim()).filter(s => s),
            tags: tags
        },
        vocabulary: {},
        activity: { words: true, sentences: true },
        sections: [{
            sectionId: document.getElementById('docId').value + 'Section',
            heading: { en: 'Main Section', fa: '', th: '' },
            content: []
        }]
    };

    window.currentDocument = newDoc;
    updateCacheDisplay();
    showFullDocument();
    updateBlocksDisplay();
}

// ==================== UPDATE WORKFLOW ====================
function loadDocumentForUpdate() {
    const file = document.getElementById('updateFileInput').files[0];
    if (!file) { switchWorkflow('create'); return; }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            AppState.currentDocument = data;
            AppState.mainVocabulary = data.vocabulary || {};
            AppState.blocks = [];

            if (data.sections && data.sections[0] && data.sections[0].content) {
                AppState.blocks = data.sections[0].content;
            }

            // --- STRIP REDUNDANT PROPERTIES ---
            if (data.sections) {
                data.sections.forEach(section => {
                    if (section.content) {
                        section.content.forEach(block => {
                            if (block.type === 'paragraph' && block.sentences) {
                                block.sentences.forEach(sentence => {
                                    delete sentence.originalSource; // REMOVED
                                    delete sentence.type;           // REMOVED
                                });
                            }
                        });
                    }
                });
            }
            // ---------------------------------

            document.getElementById('docId').value = data.documentId || '';
            document.getElementById('version').value = data.metadata?.version || '2.0.0';
            document.getElementById('difficulty').value = data.metadata?.difficulty || 2;
            document.getElementById('authors').value = (data.metadata?.authors || []).join(', ');
            document.getElementById('reviewers').value = (data.metadata?.reviewers || []).join(', ');
            document.getElementById('prerequisites').value = (data.metadata?.prerequisites || []).join(', ');

            document.getElementById('tagsContainer').innerHTML = '<input type="text" id="newTag" placeholder="Add tag and press Enter..." style="border: none; outline: none; flex: 1;">';
            document.getElementById('newTag').addEventListener('keypress', handleTagKeyPress);
            if (data.metadata?.tags) data.metadata.tags.forEach(tag => addTag(tag));

            document.getElementById('metadataPanel').classList.remove('hidden');
            document.getElementById('updateView').classList.remove('hidden');

            renderEditableDocument();
            setupAddContentPanel();
            validateWordTranslations();
            showFullDocument();
            showDocumentValidationWarnings();

        } catch (error) {
            alert('Error loading document: ' + error.message);
            switchWorkflow('create');
        }
    };
    reader.readAsText(file);
}

function setupAddContentPanel() {
    const container = document.getElementById('addContentInner');
    if (!container) return;

    container.innerHTML = `
        <div class="input-section" style="margin-top:0;">
            <h3>⚙️ Input Configuration</h3>
            <div class="radio-group">
                <div class="radio-card" id="updateRadioWord" onclick="setDataType('word')">
                    <span class="material-icons">grid_view</span>
                    <h4>Word List</h4>
                    <small>space between words</small>
                </div>
                <div class="radio-card" id="updateRadioParagraph" onclick="setDataType('paragraph')">
                    <span class="material-icons">chat</span>
                    <h4>Paragraph</h4>
                    <small>new lines between sentences, spaces between words</small>
                </div>
            </div>
        </div>
        <div class="input-section">
            <h3>📝 Enter New Thai Text</h3>
            <div class="heading-input">
                <label>Heading (Optional - Thai)</label>
                <input type="text" id="updateHeadingInput" placeholder="เช่น: ทักทายเบื้องต้น, รายการคำศัพท์ ฯลฯ" lang="th">
                <small>Will be automatically translated to English and Farsi in the output</small>
            </div>
            <div class="instruction-box" style="background: rgba(37, 99, 235, 0.05); border-left: 4px solid var(--primary); padding: 15px; border-radius: 4px; margin-bottom: 15px;">
                <span class="material-icons">info</span>
                <span id="updateInstructionText">Separate words with space. Example: กิน ดื่ม ดู ฟัง ตื่น</span>
            </div>
            <div id="updateGrammarPanel" class="grammar-panel" style="display: none;">
                <h4>📐 Grammar Settings (Optional)</h4>
                <small style="color: var(--text-secondary);">Leave blank to omit grammar from block</small>
                <div class="grammar-grid">
                    <div class="grammar-field">
                        <label>Pattern</label>
                        <input type="text" id="updateGrammarPattern" placeholder="e.g., Sentence + ครับ/ค่ะ">
                    </div>
                    <div class="grammar-field">
                        <label>Example</label>
                        <input type="text" id="updateGrammarExample" placeholder="e.g., สวัสดีครับ" lang="th">
                    </div>
                </div>
            </div>
            <div class="activity-block-panel">
                <h4>🎮 Block-level Activity Settings (Optional)</h4>
                <small style="color: var(--text-secondary);">Leave as "inherit" to use document settings</small>
                <div class="activity-mode-selector">
                    <label><input type="radio" name="updateActivityMode" value="inherit" checked onchange="toggleUpdateActivityMode()"> Inherit from document</label>
                    <label><input type="radio" name="updateActivityMode" value="override" onchange="toggleUpdateActivityMode()"> Override</label>
                </div>
                <div id="updateActivityOverridePanel" style="display: none;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div><h5>Word Activities</h5><label><input type="checkbox" id="updateBlockWordMCQ"> Multiple Choice Word</label><br><label><input type="checkbox" id="updateBlockWordFlash"> Flashcard Word</label></div>
                        <div><h5>Sentence Activities</h5><label><input type="checkbox" id="updateBlockSentMCQ"> Multiple Choice Sentence</label><br><label><input type="checkbox" id="updateBlockSentFlash"> Flashcard Sentence</label><br><label><input type="checkbox" id="updateBlockSentBuild"> Build Sentence</label></div>
                    </div>
                    <div style="margin-top: 15px;">
                        <h5>Add/Remove Modifiers</h5>
                        <div style="display: flex; gap: 20px;">
                            <div style="flex: 1;"><label>Add types:</label><input type="text" id="updateBlockActivityAdd" placeholder="e.g., buildSentence" style="width: 100%; padding: 5px;"></div>
                            <div style="flex: 1;"><label>Remove types:</label><input type="text" id="updateBlockActivityRemove" placeholder="e.g., flashcardWord" style="width: 100%; padding: 5px;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <textarea id="updateThaiInput" placeholder="กิน ดื่ม ดู ฟัง ตื่น" lang="th" style="width:100%; min-height:150px; padding:10px; margin:15px 0;"></textarea>
            <div class="input-stats">
                <span><span class="material-icons">abc</span> Words: <span id="updateWordCount">0</span></span>
                <span><span class="material-icons">sentence</span> Sentences: <span id="updateSentenceCount">0</span></span>
                <span><span class="material-icons">cleaning_services</span> <button class="btn btn-outline" style="padding:5px 10px;" onclick="cleanUpdateText()">Clean Text</button></span>
                <span><span class="material-icons">sync</span> <button class="btn btn-outline" style="padding:5px 10px;" onclick="checkUpdateDuplicates()">Check Duplicates</button></span>
            </div>
            <button class="generate-button" onclick="generateUpdateBlock()" id="updateGenerateBtn">
                <span class="material-icons">auto_awesome</span>
                Generate New Block and Add to Document
            </button>
            <div id="updateGeneratedBlocks" class="generated-blocks"></div>
        </div>
    `;

    if (AppState.dataType === 'word') {
        document.getElementById('updateRadioWord').classList.add('selected');
        document.getElementById('updateRadioParagraph').classList.remove('selected');
        document.getElementById('updateGrammarPanel').style.display = 'none';
        document.getElementById('updateInstructionText').innerText = 'Separate words with space. Example: กิน ดื่ม ดู ฟัง ตื่น';
    } else {
        document.getElementById('updateRadioParagraph').classList.add('selected');
        document.getElementById('updateRadioWord').classList.remove('selected');
        document.getElementById('updateGrammarPanel').style.display = 'block';
        document.getElementById('updateInstructionText').innerText = 'Separate sentences with new lines. Words within sentences with space.';
    }

    document.getElementById('updateThaiInput').addEventListener('input', updateUpdateStats);
}

function toggleUpdateActivityMode() {
    const mode = document.querySelector('input[name="updateActivityMode"]:checked')?.value;
    document.getElementById('updateActivityOverridePanel').style.display = mode === 'override' ? 'block' : 'none';
}

function cleanUpdateText() {
    const textarea = document.getElementById('updateThaiInput');
    textarea.value = Cleaner.clean(textarea.value);
    updateUpdateStats();
}

function checkUpdateDuplicates() {
    const text = document.getElementById('updateThaiInput').value;
    const newWords = new Set();
    if (AppState.dataType === 'word') {
        text.split(/\s+/).filter(w => w.trim()).forEach(w => newWords.add(w));
    } else {
        text.split('\n').filter(s => s.trim()).forEach(s => {
            s.split(/\s+/).filter(w => w.trim()).forEach(w => newWords.add(w));
        });
    }
    const existing = [];
    newWords.forEach(word => {
        if (AppState.mainVocabulary[word]) existing.push(word);
    });
    const warning = document.getElementById('duplicateWarning');
    if (existing.length > 0) {
        warning.style.display = 'flex';
        document.getElementById('duplicateMessage').innerHTML = `📚 Existing: ${existing.join(', ')}. ✨ New: ${newWords.size - existing.length}`;
    } else {
        warning.style.display = 'none';
    }
}

function updateUpdateStats() {
    const text = document.getElementById('updateThaiInput').value;
    if (AppState.dataType === 'word') {
        const words = text.split(/\s+/).filter(w => w.trim().length > 0);
        document.getElementById('updateWordCount').textContent = words.length;
        document.getElementById('updateSentenceCount').textContent = 'N/A';
    } else {
        const sentences = text.split('\n').filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.trim().length > 0);
        document.getElementById('updateWordCount').textContent = words.length;
        document.getElementById('updateSentenceCount').textContent = sentences.length;
    }
}

async function generateUpdateBlock() {
    const text = document.getElementById('updateThaiInput').value;
    if (!text.trim()) {
        alert('Please enter some Thai text');
        return;
    }

    showLoading('Generating translations...');

    try {
        if (AppState.dataType === 'word') {
            await generateWordBlockForUpdate(text);
        } else {
            await generateParagraphBlockForUpdate(text);
        }
    } finally {
        hideLoading();
    }

    updateCacheDisplay();
    updateBlocksDisplay();
    validateWordTranslations();
    showFullDocument();
    renderEditableDocument();
}

async function generateWordBlockForUpdate(text) {
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    if (words.length === 0) return;

    const uniqueWords = [...new Set(words)];

    for (const word of uniqueWords) {
        if (!AppState.mainVocabulary[word]) {
            const enTranslation = await TranslationAPI.translate(word, 'en');
            const faTranslation = await TranslationAPI.translate(word, 'fa');
            AppState.mainVocabulary[word] = { translations: { en: enTranslation, fa: faTranslation } };
        }
    }

    const heading = document.getElementById('updateHeadingInput').value.trim();
    const newBlock = { type: 'words' };
    if (heading) {
        const enTranslation = await TranslationAPI.translate(heading, 'en');
        const faTranslation = await TranslationAPI.translate(heading, 'fa');
        newBlock.heading = {
            en: enTranslation,
            fa: faTranslation,
            th: heading
        };
    }
    newBlock.activity = getUpdateBlockActivitySettings();
    newBlock.wordIds = uniqueWords;

    AppState.blocks.push(newBlock);
    if (window.currentDocument) {
        window.currentDocument.sections[0].content = AppState.blocks;
        window.currentDocument.vocabulary = AppState.mainVocabulary;
    }
}

async function generateParagraphBlockForUpdate(text) {
    const sentences = text.split('\n').filter(s => s.trim().length > 0);
    if (sentences.length === 0) return;

    const sentencesData = [];
    const allWords = new Set();

    for (const sentence of sentences) {
        const words = sentence.split(/\s+/).filter(w => w.trim().length > 0);
        words.forEach(w => allWords.add(w));

        const enTranslation = await TranslationAPI.translate(sentence, 'en');
        const faTranslation = await TranslationAPI.translate(sentence, 'fa');
        const continuousSource = words.join('');

        // REMOVED originalSource and type from sentence object
        sentencesData.push({
            source: continuousSource,
            wordIds: words,
            translations: { en: enTranslation, fa: faTranslation }
        });
    }

    for (const word of allWords) {
        if (!AppState.mainVocabulary[word]) {
            const enTranslation = await TranslationAPI.translate(word, 'en');
            const faTranslation = await TranslationAPI.translate(word, 'fa');
            AppState.mainVocabulary[word] = { translations: { en: enTranslation, fa: faTranslation } };
        }
    }

    const heading = document.getElementById('updateHeadingInput').value.trim();
    const newBlock = { type: 'paragraph' };

    if (heading) {
        const enTranslation = await TranslationAPI.translate(heading, 'en');
        const faTranslation = await TranslationAPI.translate(heading, 'fa');
        newBlock.heading = {
            en: enTranslation,
            fa: faTranslation,
            th: heading
        };
    }

    const grammarPattern = document.getElementById('updateGrammarPattern').value.trim();
    const grammarExample = document.getElementById('updateGrammarExample').value.trim();

    if (grammarPattern || grammarExample) {
        newBlock.grammar = {};
        if (grammarPattern) newBlock.grammar.pattern = grammarPattern;
        if (grammarExample) {
            newBlock.grammar.examples = [{
                sentenceSource: grammarExample,
                translations: {
                    en: await TranslationAPI.translate(grammarExample, 'en'),
                    fa: await TranslationAPI.translate(grammarExample, 'fa')
                }
            }];
        }
    }

    newBlock.activity = getUpdateBlockActivitySettings();
    newBlock.sentences = sentencesData;

    AppState.blocks.push(newBlock);
    if (window.currentDocument) {
        window.currentDocument.sections[0].content = AppState.blocks;
        window.currentDocument.vocabulary = AppState.mainVocabulary;
    }
}

async function updateGrammarExample(sectionIdx, blockIdx, exampleIdx, value) {
    const block = AppState.currentDocument?.sections?.[sectionIdx]?.content?.[blockIdx];
    if (!block || !block.grammar || !block.grammar.examples) return;

    showLoading('Translating grammar example...');

    try {
        block.grammar.examples[exampleIdx].sentenceSource = value;

        const enTranslation = await TranslationAPI.translate(value, 'en');
        const faTranslation = await TranslationAPI.translate(value, 'fa');

        if (!block.grammar.examples[exampleIdx].translations) {
            block.grammar.examples[exampleIdx].translations = {};
        }

        block.grammar.examples[exampleIdx].translations.en = enTranslation;
        block.grammar.examples[exampleIdx].translations.fa = faTranslation;

        renderEditableDocument();
        showFullDocument();

        showTranslationWarning(`✅ Grammar example updated with translations - EN: "${enTranslation}", FA: "${faTranslation}"`);
    } catch (error) {
        console.error('Error translating grammar example:', error);
        showTranslationWarning('⚠️ Failed to translate grammar example');
    } finally {
        hideLoading();
    }
}

function getUpdateBlockActivitySettings() {
    const mode = document.querySelector('input[name="updateActivityMode"]:checked')?.value;
    if (mode === 'inherit' || !mode) return { inherit: true };

    const activity = { inherit: false };
    const types = [];

    if (document.getElementById('updateBlockWordMCQ')?.checked) types.push('multipleChoiceWord');
    if (document.getElementById('updateBlockWordFlash')?.checked) types.push('flashcardWord');
    if (document.getElementById('updateBlockSentMCQ')?.checked) types.push('multipleChoiceSentence');
    if (document.getElementById('updateBlockSentFlash')?.checked) types.push('flashcardSentence');
    if (document.getElementById('updateBlockSentBuild')?.checked) types.push('buildSentence');

    if (types.length > 0) activity.types = types;

    const addTypes = document.getElementById('updateBlockActivityAdd')?.value.trim();
    if (addTypes) activity.add = addTypes.split(',').map(t => t.trim());

    const removeTypes = document.getElementById('updateBlockActivityRemove')?.value.trim();
    if (removeTypes) activity.remove = removeTypes.split(',').map(t => t.trim());

    return activity;
}

// ==================== RENDER EDIT DOCUMENT (non‑nested block details) ====================
function renderEditableDocument() {
    const container = document.getElementById('documentEditContainer');
    if (!container || !AppState.currentDocument) return;

    const doc = AppState.currentDocument;
    let html = `
        <details class="edit-section-details" open>
            <summary>
                <span class="material-icons">edit_document</span>
                Edit Document Content
            </summary>
            <div class="edit-content">
    `;

    if (doc.sections && doc.sections.length > 0) {
        doc.sections.forEach((section, sectionIdx) => {
            html += `
                <div class="edit-section" style="margin-bottom:20px;">
                    <div class="edit-field">
                        <label>Section Heading (English)</label>
                        <input type="text" id="sectionHeading-${sectionIdx}" value="${escapeHtml(section.heading?.en || '')}" 
                               onchange="updateSectionHeading(${sectionIdx}, this.value)">
                    </div>
            `;

            if (section.content && section.content.length > 0) {
                section.content.forEach((block, blockIdx) => {
                    html += renderEditableBlock(block, sectionIdx, blockIdx);
                });
            }

            html += `</div>`;
        });
    }

    html += `
            </div>
        </details>
    `;

    container.innerHTML = html;
}

function renderEditableBlock(block, sectionIdx, blockIdx) {
    let summaryText = block.type === 'words' ? '📚 Word List' : '📝 Paragraph';
    if (block.heading && block.heading.en) {
        summaryText += `: ${block.heading.en}`;
    } else if (block.type === 'words' && block.wordIds) {
        summaryText += ` (${block.wordIds.length} words)`;
    } else if (block.type === 'paragraph' && block.sentences) {
        summaryText += ` (${block.sentences.length} sentences)`;
    }

    let html = `<details class="edit-block-details" id="block-details-${sectionIdx}-${blockIdx}">`;
    html += `<summary style="display: flex; align-items: center; gap: 10px;">`;
    html += `<span>${summaryText}</span>`;
    html += `<button class="btn-remove" style="margin-left: auto;" onclick="event.stopPropagation(); removeBlock(${sectionIdx}, ${blockIdx})"><span class="material-icons">delete</span></button>`;
    html += `</summary>`;
    html += `<div class="edit-block-content">`;

    html += renderActivityInfo(block);

    if (block.heading) {
        html += `
            <div class="edit-field">
                <label>Heading (Thai)</label>
                <input type="text" id="blockHeading-${sectionIdx}-${blockIdx}" 
                    value="${escapeHtml(block.heading?.th || '')}" lang="th"
                    onchange="updateBlockHeading(${sectionIdx}, ${blockIdx}, this.value)">
                <div style="display: flex; gap: 20px; margin-top: 5px; font-size: 0.9rem; color: var(--text-secondary);">
                    <span><strong>EN:</strong> ${escapeHtml(block.heading?.en || '')}</span>
                    <span><strong>FA:</strong> ${escapeHtml(block.heading?.fa || '')}</span>
                </div>
            </div>
        `;
    }

    if (block.type === 'words') {
        html += `
            <div class="edit-field">
                <label>Word IDs (comma-separated)</label>
                <textarea id="blockWords-${sectionIdx}-${blockIdx}" 
                          onchange="updateWordList(${sectionIdx}, ${blockIdx}, this.value)">${(block.wordIds || []).join(', ')}</textarea>
            </div>
        `;

        if (block.wordIds && block.wordIds.length > 0) {
            html += '<div style="margin-top: 10px;">';
            block.wordIds.forEach(wordId => {
                const wordData = AppState.mainVocabulary[wordId];
                if (wordData) {
                    const translations = wordData.translations || {};
                    html += `
                        <span class="word-chip" onclick="editWord('${escapeHtml(wordId)}')" title="EN: ${escapeHtml(translations.en || '')} | FA: ${escapeHtml(translations.fa || '')}">
                            ${escapeHtml(wordId)}
                            <span class="material-icons">edit</span>
                        </span>
                    `;
                }
            });
            html += '</div>';
        }
    } else {
        if (block.sentences && block.sentences.length > 0) {
            block.sentences.forEach((sentence, sentIdx) => {
                html += `
                    <div class="edit-field" style="border-left: 2px solid var(--primary); padding-left: 10px; margin: 10px 0;">
                        <label>Sentence ${sentIdx + 1}</label>
                        <input type="text" value="${escapeHtml(sentence.source)}" lang="th"
                               onchange="updateSentence(${sectionIdx}, ${blockIdx}, ${sentIdx}, 'source', this.value)">
                        <div style="display: flex; gap: 10px; margin-top: 5px;">
                            <input type="text" placeholder="EN Translation" value="${escapeHtml(sentence.translations?.en || '')}"
                                   onchange="updateSentence(${sectionIdx}, ${blockIdx}, ${sentIdx}, 'en', this.value)">
                            <input type="text" placeholder="FA Translation" value="${escapeHtml(sentence.translations?.fa || '')}"
                                   onchange="updateSentence(${sectionIdx}, ${blockIdx}, ${sentIdx}, 'fa', this.value)">
                        </div>
                        <small>Words: ${(sentence.wordIds || []).join(' · ')}</small>
                    </div>
                `;
            });
        }

        if (block.grammar) {
            html += `
                <div class="edit-field">
                    <label>Grammar Pattern</label>
                    <input type="text" value="${escapeHtml(block.grammar.pattern || '')}"
                        onchange="updateGrammar(${sectionIdx}, ${blockIdx}, 'pattern', this.value)">
                </div>
            `;

            if (block.grammar.examples && block.grammar.examples.length > 0) {
                block.grammar.examples.forEach((example, exampleIdx) => {
                    html += `
                        <div class="edit-field" style="border-left: 2px solid var(--secondary); padding-left: 10px; margin: 10px 0;">
                            <label>Grammar Example ${exampleIdx + 1} (Thai)</label>
                            <input type="text" value="${escapeHtml(example.sentenceSource || '')}" lang="th"
                                onchange="updateGrammarExample(${sectionIdx}, ${blockIdx}, ${exampleIdx}, this.value)">
                            <div style="display: flex; gap: 20px; margin-top: 5px; font-size: 0.9rem; color: var(--text-secondary);">
                                <span><strong>EN:</strong> ${escapeHtml(example.translations?.en || '')}</span>
                                <span><strong>FA:</strong> ${escapeHtml(example.translations?.fa || '')}</span>
                            </div>
                        </div>
                    `;
                });
            }

            html += `
                <button class="update-btn" onclick="addGrammarExample(${sectionIdx}, ${blockIdx})" style="margin-top: 10px;">
                    <span class="material-icons">add</span> Add Grammar Example
                </button>
            `;
        }
    }

    html += `
        <button class="update-btn" onclick="updateBlock(${sectionIdx}, ${blockIdx}, event)" style="margin-top: 15px;">
            <span class="material-icons">save</span> Update Block
        </button>
    `;

    html += `</div></details>`;

    return html;
}

function renderActivityInfo(block) {
    const effective = getEffectiveActivities(block);
    return `
        <div class="activity-info">
            <strong>🎮 Effective Activities:</strong><br>
            <span class="material-icons ${effective.words ? 'enabled' : 'disabled'}">${effective.words ? 'check_circle' : 'radio_button_unchecked'}</span> Words: ${effective.words ? 'Enabled' : 'Disabled'}<br>
            <span class="material-icons ${effective.sentences ? 'enabled' : 'disabled'}">${effective.sentences ? 'check_circle' : 'radio_button_unchecked'}</span> Sentences: ${effective.sentences ? 'Enabled' : 'Disabled'}
        </div>
    `;
}

function getEffectiveActivities(block) {
    const doc = AppState.currentDocument;
    const docActivities = {
        words: doc?.activity?.words || false,
        sentences: doc?.activity?.sentences || false
    };

    if (!block.activity || block.activity.inherit) {
        return docActivities;
    }

    const effective = {
        words: block.activity.types?.some(t => t.includes('Word')) || false,
        sentences: block.activity.types?.some(t => t.includes('Sentence') || t === 'buildSentence') || false
    };

    if (block.activity.add) {
        if (block.activity.add.some(t => t.includes('Word'))) effective.words = true;
        if (block.activity.add.some(t => t.includes('Sentence') || t === 'buildSentence')) effective.sentences = true;
    }

    if (block.activity.remove) {
        if (block.activity.remove.some(t => t.includes('Word')) && !block.activity.types?.some(t => t.includes('Word'))) {
            effective.words = false;
        }
        if (block.activity.remove.some(t => t.includes('Sentence') || t === 'buildSentence') &&
            !block.activity.types?.some(t => t.includes('Sentence') || t === 'buildSentence')) {
            effective.sentences = false;
        }
    }

    return effective;
}

// ==================== UPDATE HANDLERS ====================
function updateSectionHeading(sectionIdx, value) {
    if (AppState.currentDocument?.sections?.[sectionIdx]) {
        if (!AppState.currentDocument.sections[sectionIdx].heading) {
            AppState.currentDocument.sections[sectionIdx].heading = {};
        }
        AppState.currentDocument.sections[sectionIdx].heading.en = value;
        showFullDocument();
    }
}

function updateBlockHeading(sectionIdx, blockIdx, value) {
    const block = AppState.currentDocument?.sections?.[sectionIdx]?.content?.[blockIdx];
    if (block) {
        if (!block.heading) block.heading = {};

        block.heading.th = value;

        showLoading('Translating heading...');

        TranslationAPI.translateHeading(value).then(translations => {
            console.log('Received translations:', translations);

            block.heading = {
                en: translations.en || block.heading?.en || '',
                fa: translations.fa || block.heading?.fa || '',
                th: value
            };

            renderEditableDocument();
            showFullDocument();
            hideLoading();

            showTranslationWarning(`✅ Heading updated - TH: "${value}", EN: "${translations.en}", FA: "${translations.fa}"`);
        }).catch(error => {
            console.error('Error translating heading:', error);
            hideLoading();
            showTranslationWarning('⚠️ Failed to translate heading');
        });
    }
}

async function updateWordList(sectionIdx, blockIdx, value) {
    const block = AppState.currentDocument?.sections?.[sectionIdx]?.content?.[blockIdx];
    if (!block || block.type !== 'words') return;

    const oldWords = new Set(block.wordIds || []);
    const newWordIds = value.split(',').map(w => w.trim()).filter(w => w);
    const uniqueNewWords = [...new Set(newWordIds)];

    if (uniqueNewWords.length !== newWordIds.length) {
        alert('Duplicate words in list were merged automatically');
    }

    block.wordIds = uniqueNewWords;

    let newWordsAdded = 0;
    const addedWords = [];
    for (const wordId of uniqueNewWords) {
        if (!AppState.mainVocabulary[wordId]) {
            const enTranslation = await TranslationAPI.translate(wordId, 'en');
            const faTranslation = await TranslationAPI.translate(wordId, 'fa');

            AppState.mainVocabulary[wordId] = {
                translations: {
                    en: enTranslation || '',
                    fa: faTranslation || ''
                }
            };
            newWordsAdded++;
            addedWords.push(wordId);
        }
    }

    for (const oldWord of oldWords) {
        if (!uniqueNewWords.includes(oldWord) && !isWordUsedElsewhere(oldWord, sectionIdx, blockIdx)) {
            delete AppState.mainVocabulary[oldWord];
        }
    }

    clearVocabularyCache();

    if (newWordsAdded > 0) {
        showTranslationWarning(`✅ Added ${newWordsAdded} new word(s): ${addedWords.join(', ')}`);
    }

    validateWordTranslations();
    updateCacheDisplay();
    showFullDocument();
    renderEditableDocument();
}

async function updateSentence(sectionIdx, blockIdx, sentIdx, field, value) {
    const sentence = AppState.currentDocument?.sections?.[sectionIdx]?.content?.[blockIdx]?.sentences?.[sentIdx];
    if (!sentence) return;

    if (field === 'source') {
        const oldWords = new Set(sentence.wordIds || []);
        sentence.source = value.replace(/\s+/g, '');
        const newWords = value.split(/\s+/).filter(w => w.trim().length > 0);
        sentence.wordIds = newWords;


        let newWordsAdded = 0;
        const addedWords = [];
        for (const wordId of newWords) {
            if (!AppState.mainVocabulary[wordId]) {
                const enTranslation = await TranslationAPI.translate(wordId, 'en');
                const faTranslation = await TranslationAPI.translate(wordId, 'fa');

                AppState.mainVocabulary[wordId] = {
                    translations: {
                        en: enTranslation || '',
                        fa: faTranslation || ''
                    }
                };
                newWordsAdded++;
                addedWords.push(wordId);
            }
        }

        for (const oldWord of oldWords) {
            if (!newWords.includes(oldWord) && !isWordUsedElsewhere(oldWord, sectionIdx, blockIdx, sentIdx)) {
                delete AppState.mainVocabulary[oldWord];
            }
        }

        clearVocabularyCache();

        if (newWordsAdded > 0) {
            showTranslationWarning(`✅ Added translations for ${newWordsAdded} new word(s): ${addedWords.join(', ')}`);
        }

        validateWordTranslations();

    } else if (field === 'en' || field === 'fa') {
        if (!sentence.translations) sentence.translations = {};
        sentence.translations[field] = field === 'en' ? value.toLowerCase() : value;
    }

    updateCacheDisplay();
    showFullDocument();
    renderEditableDocument();
}

async function ensureWordTranslations(word) {
    if (!AppState.mainVocabulary[word]) {
        showLoading(`Fetching translation for: ${word}...`);

        const enTranslation = await TranslationAPI.translate(word, 'en');
        const faTranslation = await TranslationAPI.translate(word, 'fa');

        AppState.mainVocabulary[word] = {
            translations: {
                en: enTranslation,
                fa: faTranslation
            }
        };

        hideLoading();
        return true;
    }
    return false;
}

function updateGrammar(sectionIdx, blockIdx, field, value) {
    const block = AppState.currentDocument?.sections?.[sectionIdx]?.content?.[blockIdx];
    if (block) {
        if (!block.grammar) block.grammar = {};
        block.grammar[field] = value;
        showFullDocument();
    }
}

async function addGrammarExample(sectionIdx, blockIdx) {
    const block = AppState.currentDocument?.sections?.[sectionIdx]?.content?.[blockIdx];
    if (!block) return;

    if (!block.grammar) {
        block.grammar = {};
    }

    if (!block.grammar.examples) {
        block.grammar.examples = [];
    }

    block.grammar.examples.push({
        sentenceSource: '',
        translations: {
            en: '',
            fa: ''
        }
    });

    renderEditableDocument();
    showFullDocument();
}

async function updateBlock(sectionIdx, blockIdx, clickEvent) {
    const block = AppState.currentDocument?.sections?.[sectionIdx]?.content?.[blockIdx];
    if (!block) return;

    showLoading('Updating block and checking vocabulary...');

    try {
        let newWordsAdded = 0;
        const addedWords = [];

        if (block.type === 'words') {
            for (const wordId of block.wordIds || []) {
                if (!AppState.mainVocabulary[wordId]) {
                    const enTranslation = await TranslationAPI.translate(wordId, 'en');
                    const faTranslation = await TranslationAPI.translate(wordId, 'fa');

                    AppState.mainVocabulary[wordId] = {
                        translations: {
                            en: enTranslation || '',
                            fa: faTranslation || ''
                        }
                    };
                    newWordsAdded++;
                    addedWords.push(wordId);
                }
            }
        } else if (block.type === 'paragraph') {
            for (const sentence of block.sentences || []) {
                for (const wordId of sentence.wordIds || []) {
                    if (!AppState.mainVocabulary[wordId]) {
                        const enTranslation = await TranslationAPI.translate(wordId, 'en');
                        const faTranslation = await TranslationAPI.translate(wordId, 'fa');

                        AppState.mainVocabulary[wordId] = {
                            translations: {
                                en: enTranslation || '',
                                fa: faTranslation || ''
                            }
                        };
                        newWordsAdded++;
                        addedWords.push(wordId);
                    }
                }
            }
        }

        clearVocabularyCache();

        validateWordTranslations();
        updateCacheDisplay();
        showFullDocument();

        if (newWordsAdded > 0) {
            showTranslationWarning(`✅ Added ${newWordsAdded} new word(s) to vocabulary: ${addedWords.join(', ')}`);
        } else {
            showTranslationWarning('✅ Block updated - all words already in vocabulary');
        }

        if (clickEvent && clickEvent.target) {
            const btn = clickEvent.target;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="material-icons">check</span> Updated!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 1500);
        }

    } catch (error) {
        console.error('Error updating block:', error);
        alert('Error updating block. Please try again.');
    } finally {
        hideLoading();
    }
}

function removeBlock(sectionIdx, blockIdx) {
    if (confirm('Remove this block?')) {
        const section = AppState.currentDocument?.sections?.[sectionIdx];
        if (section && section.content) {
            const block = section.content[blockIdx];

            if (block.type === 'words' && block.wordIds) {
                block.wordIds.forEach(wordId => {
                    if (!isWordUsedElsewhere(wordId, sectionIdx, blockIdx)) {
                        delete AppState.mainVocabulary[wordId];
                    }
                });
            } else if (block.type === 'paragraph' && block.sentences) {
                block.sentences.forEach(sentence => {
                    if (sentence.wordIds) {
                        sentence.wordIds.forEach(wordId => {
                            if (!isWordUsedElsewhere(wordId, sectionIdx, blockIdx)) {
                                delete AppState.mainVocabulary[wordId];
                            }
                        });
                    }
                });
            }

            section.content.splice(blockIdx, 1);
            renderEditableDocument();
            validateWordTranslations();
            showFullDocument();
        }
    }
}

function editWord(wordId) {
    const word = AppState.mainVocabulary[wordId];
    if (!word) return;

    const newWordText = prompt('Edit Thai word (changing this will create a new vocabulary entry):', wordId);
    if (!newWordText || newWordText === wordId) return;

    if (AppState.mainVocabulary[newWordText] && newWordText !== wordId) {
        alert('This word already exists. Merging translations...');

        if (word.translations?.en && !AppState.mainVocabulary[newWordText].translations.en) {
            AppState.mainVocabulary[newWordText].translations.en = word.translations.en;
        }
        if (word.translations?.fa && !AppState.mainVocabulary[newWordText].translations.fa) {
            AppState.mainVocabulary[newWordText].translations.fa = word.translations.fa;
        }

        updateWordReferences(wordId, newWordText);
        delete AppState.mainVocabulary[wordId];
    } else {
        AppState.mainVocabulary[newWordText] = {
            translations: {
                en: word.translations?.en || '',
                fa: word.translations?.fa || ''
            }
        };

        updateWordReferences(wordId, newWordText);
        delete AppState.mainVocabulary[wordId];
    }

    const newEn = prompt('Edit English translation:', AppState.mainVocabulary[newWordText].translations.en || '');
    if (newEn !== null) {
        AppState.mainVocabulary[newWordText].translations.en = newEn.toLowerCase();
    }

    const newFa = prompt('Edit Farsi translation:', AppState.mainVocabulary[newWordText].translations.fa || '');
    if (newFa !== null) {
        AppState.mainVocabulary[newWordText].translations.fa = newFa;
    }

    if (!AppState.mainVocabulary[newWordText].translations.en || !AppState.mainVocabulary[newWordText].translations.fa) {
        showTranslationWarning('Warning: Both English and Farsi translations should be provided');
    }

    renderEditableDocument();
    validateWordTranslations();
    updateCacheDisplay();
    showFullDocument();
}

function updateWordReferences(oldWordId, newWordId) {
    if (!AppState.currentDocument) return;

    AppState.currentDocument.sections.forEach(section => {
        section.content.forEach(block => {
            if (block.type === 'words' && block.wordIds) {
                const index = block.wordIds.indexOf(oldWordId);
                if (index !== -1) {
                    block.wordIds[index] = newWordId;
                }
            } else if (block.type === 'paragraph' && block.sentences) {
                block.sentences.forEach(sentence => {
                    if (sentence.wordIds) {
                        const index = sentence.wordIds.indexOf(oldWordId);
                        if (index !== -1) {
                            sentence.wordIds[index] = newWordId;
                        }
                    }
                });
            }
        });
    });
}

function isWordUsedElsewhere(wordId, currentSectionIdx, currentBlockIdx, currentSentIdx = -1) {
    if (!AppState.currentDocument) return false;

    for (let s = 0; s < AppState.currentDocument.sections.length; s++) {
        const section = AppState.currentDocument.sections[s];
        for (let b = 0; b < section.content.length; b++) {
            const block = section.content[b];

            if (s === currentSectionIdx && b === currentBlockIdx) continue;

            if (block.type === 'words' && block.wordIds) {
                if (block.wordIds.includes(wordId)) return true;
            } else if (block.type === 'paragraph' && block.sentences) {
                for (let i = 0; i < block.sentences.length; i++) {
                    if (s === currentSectionIdx && b === currentBlockIdx && i === currentSentIdx) continue;

                    const sentence = block.sentences[i];
                    if (sentence.wordIds && sentence.wordIds.includes(wordId)) return true;
                }
            }
        }
    }
    return false;
}

function validateWordTranslations() {
    const missingTranslations = [];

    Object.entries(AppState.mainVocabulary).forEach(([wordId, wordData]) => {
        if (!wordData.translations?.en) {
            missingTranslations.push(`${wordId} (missing EN)`);
        }
        if (!wordData.translations?.fa) {
            missingTranslations.push(`${wordId} (missing FA)`);
        }
    });

    const warningDiv = document.getElementById('translationWarning');
    if (missingTranslations.length > 0) {
        warningDiv.style.display = 'flex';
        warningDiv.innerHTML = `
            <span class="material-icons">warning</span>
            <span>Words missing translations: ${missingTranslations.join(', ')}</span>
        `;
    } else {
        warningDiv.style.display = 'none';
    }
}

function showTranslationWarning(message) {
    const warningDiv = document.getElementById('translationWarning');
    warningDiv.style.display = 'flex';
    warningDiv.innerHTML = `
        <span class="material-icons">warning</span>
        <span>${message}</span>
    `;
    setTimeout(() => {
        warningDiv.style.display = 'none';
    }, 5000);
}

// ==================== BLOCK GENERATION ====================
function toggleActivityMode() {
    const mode = document.querySelector('input[name="activityMode"]:checked').value;
    document.getElementById('activityOverridePanel').style.display = mode === 'override' ? 'block' : 'none';
}

function getBlockActivitySettings() {
    const mode = document.querySelector('input[name="activityMode"]:checked').value;
    if (mode === 'inherit') {
        return { inherit: true };
    }

    const activity = { inherit: false };
    const types = [];

    if (document.getElementById('blockWordMCQ').checked) types.push('multipleChoiceWord');
    if (document.getElementById('blockWordFlash').checked) types.push('flashcardWord');
    if (document.getElementById('blockSentMCQ').checked) types.push('multipleChoiceSentence');
    if (document.getElementById('blockSentFlash').checked) types.push('flashcardSentence');
    if (document.getElementById('blockSentBuild').checked) types.push('buildSentence');

    if (types.length > 0) {
        activity.types = types;
    }

    const addTypes = document.getElementById('blockActivityAdd').value.trim();
    if (addTypes) {
        activity.add = addTypes.split(',').map(t => t.trim());
    }

    const removeTypes = document.getElementById('blockActivityRemove').value.trim();
    if (removeTypes) {
        activity.remove = removeTypes.split(',').map(t => t.trim());
    }

    return activity;
}

async function generateBlock() {
    const text = document.getElementById('thaiInput').value;
    if (!text.trim()) {
        alert('Please enter some Thai text');
        return;
    }

    const selectedLangs = ['en', 'fa'];

    showLoading('Generating translations...');

    try {
        if (AppState.dataType === 'word') {
            await generateWordBlock(text, selectedLangs);
        } else {
            await generateParagraphBlock(text, selectedLangs);
        }
    } finally {
        hideLoading();
    }

    updateCacheDisplay();
    updateBlocksDisplay();
    validateWordTranslations();
    showBlocksOnly();
}

async function generateWordBlock(text, selectedLangs) {
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    if (words.length === 0) return;

    const uniqueWords = [...new Set(words)];

    for (const word of uniqueWords) {
        if (!AppState.mainVocabulary[word]) {
            const enTranslation = await TranslationAPI.translate(word, 'en');
            const faTranslation = await TranslationAPI.translate(word, 'fa');

            AppState.mainVocabulary[word] = {
                translations: {
                    en: enTranslation,
                    fa: faTranslation
                }
            };
        }
    }

    const newBlock = {
        type: 'words'
    };

    const heading = document.getElementById('headingInput').value.trim();
    if (heading) {
        const enTranslation = await TranslationAPI.translate(heading, 'en');
        const faTranslation = await TranslationAPI.translate(heading, 'fa');
        newBlock.heading = {
            en: enTranslation,
            fa: faTranslation,
            th: heading
        };
    }

    newBlock.activity = getBlockActivitySettings();
    newBlock.wordIds = uniqueWords;

    AppState.blocks.push(newBlock);

    if (!window.currentDocument) {
        initializeNewDocument();
    }
    window.currentDocument.sections[0].content = AppState.blocks;
}

// ==================== GENERATE NEW BLOCKS ====================
async function generateParagraphBlock(text, selectedLangs) {
    const sentences = text.split('\n').filter(s => s.trim().length > 0);
    if (sentences.length === 0) return;

    const sentencesData = [];
    const allWords = new Set();

    for (const sentence of sentences) {
        const words = sentence.split(/\s+/).filter(w => w.trim().length > 0);
        words.forEach(w => allWords.add(w));

        const enTranslation = await TranslationAPI.translate(sentence, 'en');
        const faTranslation = await TranslationAPI.translate(sentence, 'fa');
        const continuousSource = words.join('');

        // NO originalSource, NO type
        sentencesData.push({
            source: continuousSource,
            wordIds: words,
            translations: { en: enTranslation, fa: faTranslation }
        });
    }

    let newWordsCount = 0;
    for (const word of allWords) {
        if (!AppState.mainVocabulary[word]) {
            const enTranslation = await TranslationAPI.translate(word, 'en');
            const faTranslation = await TranslationAPI.translate(word, 'fa');

            AppState.mainVocabulary[word] = {
                translations: {
                    en: enTranslation,
                    fa: faTranslation
                }
            };
            newWordsCount++;
        }
    }

    if (newWordsCount > 0) {
        showTranslationWarning(`✅ Added translations for ${newWordsCount} new word(s)`);
    }

    const newBlock = {
        type: 'paragraph'
    };

    const heading = document.getElementById('headingInput').value.trim();
    if (heading) {
        const enTranslation = await TranslationAPI.translate(heading, 'en');
        const faTranslation = await TranslationAPI.translate(heading, 'fa');
        newBlock.heading = {
            en: enTranslation,
            fa: faTranslation,
            th: heading
        };
    }

    const grammarPattern = document.getElementById('grammarPattern').value.trim();
    const grammarExample = document.getElementById('grammarExample').value.trim();

    if (grammarPattern || grammarExample) {
        newBlock.grammar = {};
        if (grammarPattern) newBlock.grammar.pattern = grammarPattern;
        if (grammarExample) {
            newBlock.grammar.examples = [{
                sentenceSource: grammarExample,
                translations: {
                    en: await TranslationAPI.translate(grammarExample, 'en'),
                    fa: await TranslationAPI.translate(grammarExample, 'fa')
                }
            }];
        }
    }

    newBlock.activity = getBlockActivitySettings();
    newBlock.sentences = sentencesData;

    AppState.blocks.push(newBlock);

    if (!window.currentDocument) {
        initializeNewDocument();
    }
    window.currentDocument.sections[0].content = AppState.blocks;

    updateCacheDisplay();
    updateBlocksDisplay();
    showFullDocument();
}

async function processEditedSentence(uniqueId, sectionIdx, blockIdx, sentIdx) {
    const textarea = document.getElementById(`edit-source-${uniqueId}`);
    if (!textarea) return;

    const spacedSource = textarea.value.trim();
    if (!spacedSource) {
        alert('Please enter the sentence with spaces.');
        return;
    }

    showLoading('Processing sentence and fetching translations...');

    try {
        const sentence = AppState.currentDocument.sections[sectionIdx].content[blockIdx].sentences[sentIdx];

        const newWords = spacedSource.split(/\s+/).filter(w => w.trim().length > 0);

        const continuousSource = newWords.join('');

        const oldWords = new Set(sentence.wordIds || []);

        sentence.source = continuousSource;
        sentence.wordIds = newWords;

        let newWordsCount = 0;
        for (const word of newWords) {
            if (!AppState.mainVocabulary[word]) {
                console.log(`Adding new word to vocabulary: "${word}"`);
                const enTranslation = await TranslationAPI.translate(word, 'en');
                const faTranslation = await TranslationAPI.translate(word, 'fa');

                AppState.mainVocabulary[word] = {
                    translations: {
                        en: enTranslation || '',
                        fa: faTranslation || ''
                    }
                };
                newWordsCount++;
            }
        }

        for (const oldWord of oldWords) {
            if (!newWords.includes(oldWord) && !isWordUsedElsewhere(oldWord, sectionIdx, blockIdx, sentIdx)) {
                console.log(`Removing unused word from vocabulary: "${oldWord}"`);
                delete AppState.mainVocabulary[oldWord];
            }
        }

        clearVocabularyCache();

        validateWordTranslations();

        const sentenceInput = document.querySelector(`#block-${sectionIdx}-${blockIdx} .edit-field:nth-child(${sentIdx + 3}) input[type="text"]`);
        if (sentenceInput) {
            sentenceInput.value = continuousSource;
        }

        if (newWordsCount > 0) {
            showTranslationWarning(`✅ Added translations for ${newWordsCount} new word(s): ${newWords.filter(w => !oldWords.has(w)).join(', ')}`);
        } else {
            showTranslationWarning('✅ Sentence updated successfully!');
        }

        showFullDocument();

        refreshValidationWarnings();

        updateVocabularyChips();

    } catch (error) {
        console.error('Error processing sentence:', error);
        alert('Error processing sentence. Please try again.');
    } finally {
        hideLoading();
    }
}

function updateVocabularyChips() {
    document.querySelectorAll('.word-chip').forEach(chip => {
        const wordId = chip.textContent.replace('edit', '').trim();
        const wordData = AppState.mainVocabulary[wordId];
        if (wordData) {
            const translations = wordData.translations || {};
            chip.setAttribute('title', `EN: ${translations.en || ''} | FA: ${translations.fa || ''}`);
        }
    });
}

async function processAllMismatches() {
    const mismatches = validateDocumentSentences();
    if (mismatches.length === 0) {
        showTranslationWarning('No mismatches found!');
        return;
    }

    if (!confirm(`Process ${mismatches.length} mismatched sentences? This will update them and add any missing words to vocabulary.`)) {
        return;
    }

    showLoading('Processing all mismatches...');

    let processedCount = 0;
    let newWordsTotal = 0;
    const allNewWords = new Set();

    try {
        for (const m of mismatches) {
            const sentence = AppState.currentDocument.sections[m.sectionIdx].content[m.blockIdx].sentences[m.sentIdx];

            const continuousSource = sentence.wordIds.join('');

            if (sentence.source !== continuousSource) {
                sentence.source = continuousSource;
                processedCount++;
            }

            for (const word of sentence.wordIds) {
                if (!AppState.mainVocabulary[word]) {
                    const enTranslation = await TranslationAPI.translate(word, 'en');
                    const faTranslation = await TranslationAPI.translate(word, 'fa');

                    AppState.mainVocabulary[word] = {
                        translations: {
                            en: enTranslation || '',
                            fa: faTranslation || ''
                        }
                    };
                    newWordsTotal++;
                    allNewWords.add(word);
                }
            }
        }

        renderEditableDocument();
        validateWordTranslations();
        showFullDocument();

        const newWordsList = Array.from(allNewWords).join(', ');
        showTranslationWarning(`✅ Processed ${processedCount} sentence(s), added ${newWordsTotal} new word(s): ${newWordsList}`);

    } catch (error) {
        console.error('Error processing mismatches:', error);
        alert('Error processing mismatches. Please try again.');
    } finally {
        hideLoading();
    }
}

function refreshValidationWarnings() {
    const mismatches = validateDocumentSentences();

    const existingContainer = document.getElementById('documentValidationWarnings');

    if (mismatches.length === 0) {
        if (existingContainer) {
            existingContainer.remove();
        }
        return;
    }

    if (existingContainer) {
        updateWarningContainer(existingContainer, mismatches);
    } else {
        const warningContainer = document.createElement('div');
        warningContainer.id = 'documentValidationWarnings';
        warningContainer.style.margin = '20px 0';

        const editContainer = document.getElementById('documentEditContainer');
        if (editContainer) {
            editContainer.insertBefore(warningContainer, editContainer.firstChild);
            updateWarningContainer(warningContainer, mismatches);
        }
    }
}

// ==================== Validation ====================
function addWordMismatchIndicator() {
    const textarea = document.getElementById('thaiInput');
    const container = textarea.parentElement;

    let indicator = document.getElementById('wordMismatchIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'wordMismatchIndicator';
        indicator.style.marginTop = '10px';
        container.appendChild(indicator);
    }

    textarea.addEventListener('input', function () {
        const text = this.value;
        const sentences = text.split('\n').filter(s => s.trim().length > 0);
        const mismatches = validateWordMismatches(sentences);

        if (mismatches.length > 0) {
            indicator.innerHTML = `
                <div style="background: rgba(220, 38, 38, 0.1); border: 1px solid var(--error); border-radius: 4px; padding: 10px;">
                    <span class="material-icons" style="color: var(--error); vertical-align: middle;">warning</span>
                    <span style="color: var(--error);">${mismatches.length} sentence(s) with word mismatches detected</span>
                </div>
            `;
        } else {
            indicator.innerHTML = '';
        }
    });
}

function showWordMismatchWarning(mismatches) {
    const warningDiv = document.getElementById('translationWarning');
    if (!warningDiv) return;

    if (mismatches.length === 0) {
        warningDiv.style.display = 'none';
        return;
    }

    let html = `
        <div style="background: rgba(220, 38, 38, 0.1); border-left: 4px solid var(--error); padding: 15px; margin: 15px 0; border-radius: 4px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span class="material-icons" style="color: var(--error);">error</span>
                <strong style="color: var(--error);">Word Mismatch Detected!</strong>
            </div>
            <p style="margin-bottom: 10px;">Words in your sentences don't match when spaces are removed. This will cause rendering issues in the app.</p>
    `;

    mismatches.forEach(m => {
        html += `
            <div style="margin: 15px 0; padding: 10px; background: var(--card); border-radius: 4px;">
                <div><strong>Sentence ${m.sentenceIdx + 1}:</strong></div>
                <div style="padding: 5px; background: var(--bg); border-radius: 4px; margin: 5px 0;">
                    <span style="  color: var(--primary);">${escapeHtml(m.sentence)}</span>
                </div>
                <div><strong>Continuous:</strong> <span>${escapeHtml(m.continuous)}</span></div>
                <div style="margin-top: 8px;">
                    <strong>Problem words:</strong>
                    <ul style="margin: 5px 0 0 20px;">
        `;

        m.failedWords.forEach(fw => {
            const before = m.continuous.slice(0, fw.position);
            const mismatch = m.continuous.slice(fw.position, fw.position + fw.word.length);
            const after = m.continuous.slice(fw.position + fw.word.length);

            html += `
                <li style="margin-bottom: 8px;">
                    <div><span style="color: var(--error);">❌ "${escapeHtml(fw.word)}"</span> doesn't match at position ${fw.position}</div>
                    <div style="background: var(--bg); padding: 5px; border-radius: 4px; margin-top: 3px;">
                        <span>${escapeHtml(before)}</span>
                        <span style="background: rgba(220, 38, 38, 0.2); color: var(--error); font-weight: bold;">${escapeHtml(mismatch)}</span>
                        <span>${escapeHtml(after)}</span>
                    </div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 3px;">
                        Expected: "${escapeHtml(fw.expected)}" | Got: "${escapeHtml(fw.word)}"
                    </div>
                </li>
            `;
        });

        html += `
                    </ul>
                </div>
                <div style="margin-top: 10px; padding: 8px; background: rgba(37, 99, 235, 0.05); border-radius: 4px;">
                    <span class="material-icons" style="font-size: 18px; vertical-align: middle;">tips_and_updates</span>
                    <strong>Fix:</strong> Make sure words are properly delimited with spaces. 
                    The continuous text should be exactly the concatenation of your words.
                </div>
            </div>
        `;
    });

    html += '</div>';

    warningDiv.style.display = 'block';
    warningDiv.innerHTML = html;
}

function validateWordMismatches(sentences) {
    const mismatches = [];

    sentences.forEach((sentence, idx) => {
        const words = sentence.split(/\s+/).filter(w => w.trim().length > 0);

        const continuousText = words.join('');

        let searchText = continuousText;
        let position = 0;
        let failedWords = [];

        words.forEach(word => {
            const wordPos = searchText.indexOf(word);
            if (wordPos === 0) {
                searchText = searchText.slice(word.length);
                position += word.length;
            } else {
                failedWords.push({
                    word: word,
                    expected: continuousText.slice(position, position + word.length),
                    position: position
                });
            }
        });

        if (failedWords.length > 0) {
            mismatches.push({
                sentenceIdx: idx,
                sentence: sentence,
                continuous: continuousText,
                failedWords: failedWords
            });
        }
    });

    return mismatches;
}

function validateDocumentSentences() {
    if (!AppState.currentDocument || !AppState.currentDocument.sections) return [];

    const mismatches = [];

    AppState.currentDocument.sections.forEach((section, sectionIdx) => {
        if (!section.content) return;

        section.content.forEach((block, blockIdx) => {
            if (block.type === 'paragraph' && block.sentences) {
                block.sentences.forEach((sentence, sentIdx) => {
                    if (sentence.source && sentence.wordIds) {
                        const continuousFromWords = sentence.wordIds.join('');
                        const sourceWithoutSpaces = sentence.source.replace(/\s+/g, '');

                        if (continuousFromWords !== sourceWithoutSpaces) {
                            mismatches.push({
                                sectionIdx,
                                blockIdx,
                                sentIdx,
                                source: sentence.source,
                                wordIds: sentence.wordIds,
                                continuousFromWords,
                                sourceWithoutSpaces,
                                originalSource: sentence.source,
                                originalWordIds: [...sentence.wordIds]
                            });
                        }
                    }
                });
            }
        });
    });

    return mismatches;
}

function resetSentenceEdit(uniqueId, sectionIdx, blockIdx, sentIdx) {
    const sentence = AppState.currentDocument.sections[sectionIdx].content[blockIdx].sentences[sentIdx];
    const textarea = document.getElementById(`edit-source-${uniqueId}`);
    if (textarea && sentence) {
        // Use wordIds to reconstruct the spaced version (no longer relying on originalSource)
        const spacedFromWords = sentence.wordIds.join(' ');
        textarea.value = spacedFromWords;
    }
}

function refreshDocumentView() {
    renderEditableDocument();
    showDocumentValidationWarnings();
    showFullDocument();
}

function showDocumentValidationWarnings() {
    const mismatches = validateDocumentSentences();

    const existingContainer = document.getElementById('documentValidationWarnings');
    if (mismatches.length === 0) {
        if (existingContainer) existingContainer.remove();
        return;
    }

    let warningContainer = existingContainer;
    if (!warningContainer) {
        warningContainer = document.createElement('div');
        warningContainer.id = 'documentValidationWarnings';
        warningContainer.style.margin = '20px 0';

        const editContainer = document.getElementById('documentEditContainer');
        if (editContainer) {
            editContainer.insertBefore(warningContainer, editContainer.firstChild);
        }
    }

    let html = `
        <div style="background: rgba(220, 38, 38, 0.1); border: 2px solid var(--error); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                <span class="material-icons" style="color: var(--error); font-size: 32px;">error</span>
                <h3 style="color: var(--error); margin: 0;">Document Contains Word Mismatches</h3>
            </div>
            <p style="margin-bottom: 15px;">The following sentences have mismatches. Click "Edit Source" to correct with spaces, then "Process" to update vocabulary.</p>
    `;

    mismatches.forEach(m => {
        const uniqueId = `mismatch-${m.sectionIdx}-${m.blockIdx}-${m.sentIdx}`;
        const sentence = AppState.currentDocument.sections[m.sectionIdx].content[m.blockIdx].sentences[m.sentIdx];

        // Use wordIds to show spaced version
        const spacedFromWords = sentence.wordIds.join(' ');

        html += `
            <div style="background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 15px; margin-bottom: 15px;" id="${uniqueId}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong>Section ${m.sectionIdx + 1}, Sentence ${m.sentIdx + 1}</strong>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 10px;">
                    <div>
                        <div style="font-weight: 600; margin-bottom: 5px;">Current Source (no spaces):</div>
                        <div style="font-size: 1.5rem; background: var(--bg); padding: 10px; border-radius: 4px; border-left: 3px solid var(--warning);">
                            ${escapeHtml(m.source)}
                        </div>
                    </div>
                    <div>
                        <div style="font-weight: 600; margin-bottom: 5px;">Word IDs (${m.wordIds.length} words):</div>
                        <div style="background: var(--bg); padding: 10px; border-radius: 4px; border-left: 3px solid var(--primary);">
                            ${m.wordIds.map(w => `<span style="font-size: 1.25rem; color: var(--primary);">${escapeHtml(w)}</span>`).join(' ')}
                        </div>
                    </div>
                </div>

                <!-- Edit Source with Spaces -->
                <div style="margin-top: 15px; padding: 15px; background: rgba(37, 99, 235, 0.05); border-radius: 8px;">
                    <div style="font-weight: 600; margin-bottom: 10px;">✏️ Edit Sentence with Spaces:</div>
                    <div style="display: flex; gap: 10px; align-items: flex-start;">
                        <textarea id="edit-source-${uniqueId}" lang="th"
                            style="flex: 1; padding: 10px; font-size: var(--thai-font-size); border: 2px solid var(--primary); border-radius: 6px; min-height: 80px;"
                            placeholder="Enter sentence with spaces between words...">${escapeHtml(spacedFromWords)}</textarea>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button class="btn btn-success" onclick="processEditedSentence('${uniqueId}', ${m.sectionIdx}, ${m.blockIdx}, ${m.sentIdx})">
                                <span class="material-icons">sync</span> Process
                            </button>
                            <button class="btn btn-outline" onclick="resetSentenceEdit('${uniqueId}', ${m.sectionIdx}, ${m.blockIdx}, ${m.sentIdx})">
                                <span class="material-icons">undo</span> Reset
                            </button>
                        </div>
                    </div>
                    <div style="margin-top: 10px; font-size: 0.9rem; color: var(--text-secondary);">
                        <span class="material-icons" style="font-size: 16px; vertical-align: middle;">info</span>
                        Type the sentence with spaces between each word. New words will be automatically translated.
                    </div>
                </div>

                <!-- Preview of changes -->
                <div id="preview-${uniqueId}" style="margin-top: 10px; display: none;">
                    <div style="font-weight: 600; margin-bottom: 5px;">Preview:</div>
                    <div style="background: var(--bg); padding: 10px; border-radius: 4px;"></div>
                </div>
            </div>
        `;
    });

    html += `
        <div style="margin-top: 15px; display: flex; gap: 10px;">
            <button class="btn btn-success" onclick="processAllMismatches()">
                <span class="material-icons">auto_fix_high</span> Process All Mismatches
            </button>
            <button class="btn btn-outline" onclick="refreshDocumentView()">
                <span class="material-icons">refresh</span> Refresh
            </button>
        </div>
    </div>`;

    warningContainer.innerHTML = html;
}

async function fixAllSentenceMismatches() {
    await processAllMismatches();
}

function editSentenceWords(sectionIdx, blockIdx, sentIdx) {
    if (!AppState.currentDocument?.sections?.[sectionIdx]?.content?.[blockIdx]?.sentences?.[sentIdx]) return;

    const sentence = AppState.currentDocument.sections[sectionIdx].content[blockIdx].sentences[sentIdx];

    const newWordIds = prompt('Edit word IDs (space-separated):', sentence.wordIds.join(' '));
    if (newWordIds) {
        sentence.wordIds = newWordIds.split(/\s+/).filter(w => w.trim().length > 0);

        sentence.wordIds.forEach(wordId => {
            if (!AppState.mainVocabulary[wordId]) {
                AppState.mainVocabulary[wordId] = {
                    translations: { en: '', fa: '' }
                };
            }
        });

        renderEditableDocument();
        showDocumentValidationWarnings();
        showFullDocument();
    }
}

// ==================== DISPLAY FUNCTIONS ====================
function updateCacheDisplay() {
    document.getElementById('mainVocabCount').textContent = Object.keys(AppState.mainVocabulary).length;
}

function updateBlocksDisplay() {
    const container = document.getElementById('generatedBlocks');
    container.innerHTML = '';

    AppState.blocks.forEach((block, index) => {
        const card = document.createElement('div');
        card.className = 'block-card';

        if (block.type === 'words') {
            card.innerHTML = `
                <div class="block-header">
                    <span class="block-type">📚 Word List</span>
                    <span class="material-icons" onclick="removeBlockFromList(${index})">close</span>
                </div>
                <div><strong>Words:</strong> ${block.wordIds?.length || 0}</div>
                <div><strong>Heading:</strong> ${block.heading?.en || 'None'}</div>
                <div><strong>Activity:</strong> ${block.activity?.inherit ? 'Inherit' : 'Override'}</div>
                <div style="margin-top: 10px; font-size: 0.9rem;">${block.wordIds?.slice(0, 5).join(' · ')}${block.wordIds?.length > 5 ? '...' : ''}</div>
            `;
        } else {
            card.innerHTML = `
                <div class="block-header">
                    <span class="block-type">📝 Paragraph</span>
                    <span class="material-icons" onclick="removeBlockFromList(${index})">close</span>
                </div>
                <div><strong>Sentences:</strong> ${block.sentences?.length || 0}</div>
                <div><strong>Heading:</strong> ${block.heading?.en || 'None'}</div>
                <div><strong>Grammar:</strong> ${block.grammar ? 'Yes' : 'No'}</div>
                <div><strong>Activity:</strong> ${block.activity?.inherit ? 'Inherit' : 'Override'}</div>
                <div style="margin-top: 10px; font-size: 0.9rem;">${block.sentences?.slice(0, 2).map(s => s.source).join('<br>')}${block.sentences?.length > 2 ? '<br>...' : ''}</div>
            `;
        }
        container.appendChild(card);
    });
}

function removeBlockFromList(index) {
    if (confirm('Remove this block?')) {
        AppState.blocks.splice(index, 1);
        if (window.currentDocument) {
            window.currentDocument.sections[0].content = AppState.blocks;
        }
        updateBlocksDisplay();
        showFullDocument();
    }
}

function buildFullDocument() {
    if (AppState.currentWorkflow === 'update' && AppState.currentDocument) {
        AppState.currentDocument.documentId = document.getElementById('docId').value;
        if (!AppState.currentDocument.metadata) AppState.currentDocument.metadata = {};
        AppState.currentDocument.metadata.version = document.getElementById('version').value;
        AppState.currentDocument.metadata.difficulty = parseInt(document.getElementById('difficulty').value);
        AppState.currentDocument.metadata.authors = document.getElementById('authors').value.split(',').map(s => s.trim()).filter(s => s);
        AppState.currentDocument.metadata.reviewers = document.getElementById('reviewers').value.split(',').map(s => s.trim()).filter(s => s);
        AppState.currentDocument.metadata.prerequisites = document.getElementById('prerequisites').value.split(',').map(s => s.trim()).filter(s => s);
        AppState.currentDocument.metadata.tags = getTags();
        AppState.currentDocument.metadata.updated = new Date().toISOString();

        AppState.currentDocument.vocabulary = AppState.mainVocabulary;

        return AppState.currentDocument;
    } else {
        const docId = document.getElementById('docId').value;
        const version = document.getElementById('version').value;
        const difficulty = parseInt(document.getElementById('difficulty').value);
        const authors = document.getElementById('authors').value.split(',').map(s => s.trim()).filter(s => s);
        const reviewers = document.getElementById('reviewers').value.split(',').map(s => s.trim()).filter(s => s);
        const prerequisites = document.getElementById('prerequisites').value.split(',').map(s => s.trim()).filter(s => s);
        const tags = getTags();

        return {
            documentId: docId,
            metadata: {
                version: version,
                created: new Date().toISOString().split('T')[0] + 'T10:00:00Z',
                updated: new Date().toISOString(),
                authors: authors.length ? authors : ['author1'],
                reviewers: reviewers.length ? reviewers : ['reviewer1'],
                difficulty: difficulty,
                prerequisites: prerequisites,
                tags: tags
            },
            vocabulary: AppState.mainVocabulary,
            activity: {
                words: true,
                sentences: true
            },
            sections: [
                {
                    sectionId: docId + 'Section',
                    heading: {
                        en: 'Main Section',
                        fa: '',
                        th: ''
                    },
                    content: AppState.blocks
                }
            ]
        };
    }
}

function showFullDocument() {
    stripSpacesFromSources();
    const doc = buildFullDocument();

    // Ensure all English translations in vocabulary are lowercase
    if (doc.vocabulary) {
        for (const wordId in doc.vocabulary) {
            const word = doc.vocabulary[wordId];
            if (word.translations && word.translations.en) {
                word.translations.en = word.translations.en.toLowerCase();
            }
        }
    }

    document.getElementById('jsonViewer').textContent = JSON.stringify(doc, null, 2);
}

function showBlocksOnly() {
    if (AppState.blocks.length > 0) {
        const lastBlock = AppState.blocks[AppState.blocks.length - 1];
        if (lastBlock.type === 'paragraph' && lastBlock.sentences) {
            lastBlock.sentences.forEach(sentence => {
                if (sentence.source && sentence.source.includes(' ')) {
                    sentence.source = sentence.source.replace(/\s+/g, '');
                }
            });
        }
        document.getElementById('jsonViewer').textContent = JSON.stringify(lastBlock, null, 2);
    } else {
        document.getElementById('jsonViewer').textContent = '{}';
    }
}

function stripSpacesFromSources() {
    if (!AppState.currentDocument?.sections) return 0;

    let modifiedCount = 0;

    AppState.currentDocument.sections.forEach(section => {
        if (!section.content) return;

        section.content.forEach(block => {
            if (block.type === 'paragraph' && block.sentences) {
                block.sentences.forEach(sentence => {
                    if (sentence.source && sentence.source.includes(' ')) {
                        sentence.source = sentence.source.replace(/\s+/g, '');
                        modifiedCount++;
                    }
                });
            }
        });
    });

    return modifiedCount;
}

// ==================== UTILITY FUNCTIONS ====================
function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function showLoading(message) {
    document.getElementById('loadingMessage').textContent = message || 'Generating translations...';
    document.getElementById('loadingOverlay').style.display = 'flex';
    document.getElementById('generateBtn').disabled = true;
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
    document.getElementById('generateBtn').disabled = false;
}

function setDataType(type) {
    AppState.dataType = type;

    document.getElementById('radioWord').classList.remove('selected');
    document.getElementById('radioParagraph').classList.remove('selected');
    document.getElementById(`radio${type.charAt(0).toUpperCase() + type.slice(1)}`).classList.add('selected');

    const instruction = document.getElementById('instructionText');
    const grammarPanel = document.getElementById('grammarPanel');

    if (type === 'word') {
        instruction.innerHTML = 'Separate words with <kbd>space</kbd>. Example: กิน ดื่ม ดู ฟัง ตื่น';
        grammarPanel.style.display = 'none';
    } else {
        instruction.innerHTML = 'Separate sentences with <kbd>new lines</kbd>. Words within sentences with <kbd>space</kbd>. Example: สวัสดีครับ<br>ผมชื่อจอห์น<br>คุณสบายดีไหม';
        grammarPanel.style.display = 'block';
    }

    const updateRadioWord = document.getElementById('updateRadioWord');
    const updateRadioParagraph = document.getElementById('updateRadioParagraph');
    const updateGrammarPanel = document.getElementById('updateGrammarPanel');
    const updateInstructionText = document.getElementById('updateInstructionText');

    if (updateRadioWord && updateRadioParagraph) {
        updateRadioWord.classList.remove('selected');
        updateRadioParagraph.classList.remove('selected');

        if (type === 'word') {
            updateRadioWord.classList.add('selected');
            if (updateGrammarPanel) updateGrammarPanel.style.display = 'none';
            if (updateInstructionText) {
                updateInstructionText.innerHTML = 'Separate words with <kbd>space</kbd>. Example: กิน ดื่ม ดู ฟัง ตื่น';
            }
        } else {
            updateRadioParagraph.classList.add('selected');
            if (updateGrammarPanel) updateGrammarPanel.style.display = 'block';
            if (updateInstructionText) {
                updateInstructionText.innerHTML = 'Separate sentences with <kbd>new lines</kbd>. Words within sentences with <kbd>space</kbd>. Example: สวัสดีครับ<br>ผมชื่อจอห์น<br>คุณสบายดีไหม';
            }
        }
    }
}

function handleTagKeyPress(e) {
    if (e.key === 'Enter') {
        const input = document.getElementById('newTag');
        const tag = input.value.trim();
        if (tag) {
            addTag(tag);
            input.value = '';
        }
    }
}

function addTag(tag) {
    const container = document.getElementById('tagsContainer');
    const tagEl = document.createElement('span');
    tagEl.className = 'tag';
    tagEl.style.cssText = 'background: var(--primary-light); color: white; padding: 4px 10px; border-radius: 16px; display: inline-flex; align-items: center; gap: 5px;';
    tagEl.innerHTML = `${tag} <span class="material-icons" style="font-size: 14px; cursor: pointer;" onclick="this.parentElement.remove()">close</span>`;
    container.insertBefore(tagEl, document.getElementById('newTag'));
}

function getTags() {
    const tags = [];
    document.querySelectorAll('.tag').forEach(t => {
        tags.push(t.textContent.replace('close', '').trim());
    });
    return tags;
}

function updateStats() {
    const text = document.getElementById('thaiInput').value;
    if (AppState.dataType === 'word') {
        const words = text.split(/\s+/).filter(w => w.trim().length > 0);
        document.getElementById('wordCount').textContent = words.length;
        document.getElementById('sentenceCount').textContent = 'N/A';
    } else {
        const sentences = text.split('\n').filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.trim().length > 0);
        document.getElementById('wordCount').textContent = words.length;
        document.getElementById('sentenceCount').textContent = sentences.length;
    }
}

function cleanText() {
    const textarea = document.getElementById('thaiInput');
    textarea.value = Cleaner.clean(textarea.value);
    updateStats();
}

function checkDuplicates() {
    const text = document.getElementById('thaiInput').value;
    const newWords = new Set();

    if (AppState.dataType === 'word') {
        text.split(/\s+/).filter(w => w.trim()).forEach(w => newWords.add(w));
    } else {
        text.split('\n').filter(s => s.trim()).forEach(s => {
            s.split(/\s+/).filter(w => w.trim()).forEach(w => newWords.add(w));
        });
    }

    const existing = [];
    const trulyNew = [];

    newWords.forEach(word => {
        if (AppState.mainVocabulary[word]) {
            existing.push(word);
        } else {
            trulyNew.push(word);
        }
    });

    const warning = document.getElementById('duplicateWarning');
    if (existing.length > 0) {
        warning.style.display = 'flex';
        let message = `📚 Existing in vocabulary: ${existing.join(', ')}. `;
        message += `✨ New: ${trulyNew.length}`;
        document.getElementById('duplicateMessage').innerHTML = message;
    } else {
        warning.style.display = 'none';
    }
}

function switchPreview(mode) {
    document.querySelectorAll('.preview-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    if (mode === 'full') {
        showFullDocument();
    } else if (mode === 'blocks') {
        if (AppState.blocks.length > 0) {
            const lastBlock = AppState.blocks[AppState.blocks.length - 1];
            document.getElementById('jsonViewer').textContent = JSON.stringify(lastBlock, null, 2);
        } else {
            document.getElementById('jsonViewer').textContent = '{}';
        }
    } else if (mode === 'vocab') {
        document.getElementById('jsonViewer').textContent = JSON.stringify(AppState.mainVocabulary, null, 2);
    }
}

function downloadJSON(type) {
    const modifiedCount = stripSpacesFromSources();
    if (modifiedCount > 0) {
        alert(`Stripped spaces from ${modifiedCount} sentence(s) for clean output`);
    }

    let data;
    let filename;

    if (type === 'full') {
        data = buildFullDocument();
        // Ensure English translations are lowercase before saving
        if (data.vocabulary) {
            for (const wordId in data.vocabulary) {
                const word = data.vocabulary[wordId];
                if (word.translations && word.translations.en) {
                    word.translations.en = word.translations.en.toLowerCase();
                }
            }
        }
        filename = `${document.getElementById('docId').value}_full.json`;
    } else {
        if (AppState.blocks.length === 0) {
            alert('No blocks to download');
            return;
        }
        data = AppState.blocks[AppState.blocks.length - 1];
        filename = `${document.getElementById('docId').value}_block_${AppState.blocks.length}.json`;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function copyPreview() {
    const text = document.getElementById('jsonViewer').textContent;
    if (text && text !== '{}') {
        navigator.clipboard.writeText(text);
        alert('Preview copied to clipboard!');
    }
}

function clearPreview() {
    document.getElementById('jsonViewer').textContent = '';
}

function updateWarningContainer(container, mismatches) {
    let html = `
        <div style="background: rgba(220, 38, 38, 0.1); border: 2px solid var(--error); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                <span class="material-icons" style="color: var(--error); font-size: 32px;">error</span>
                <h3 style="color: var(--error); margin: 0;">Document Contains Word Mismatches</h3>
            </div>
            <p style="margin-bottom: 15px;">The following sentences have mismatches. Click "Edit Source" to correct with spaces, then "Process" to update vocabulary.</p>
    `;

    mismatches.forEach(m => {
        const uniqueId = `mismatch-${m.sectionIdx}-${m.blockIdx}-${m.sentIdx}`;
        const sentence = AppState.currentDocument.sections[m.sectionIdx].content[m.blockIdx].sentences[m.sentIdx];

        // Reconstruct spaced version from wordIds
        const spacedFromWords = sentence.wordIds.join(' ');

        html += `
            <div style="background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 15px; margin-bottom: 15px;" id="${uniqueId}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong>Section ${m.sectionIdx + 1}, Sentence ${m.sentIdx + 1}</strong>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 10px;">
                    <div>
                        <div style="font-weight: 600; margin-bottom: 5px;">Current Source (no spaces):</div>
                        <div style="font-family: monospace; background: var(--bg); padding: 10px; border-radius: 4px; border-left: 3px solid var(--warning);">
                            ${escapeHtml(m.source)}
                        </div>
                    </div>
                    <div>
                        <div style="font-weight: 600; margin-bottom: 5px;">Word IDs (${m.wordIds.length} words):</div>
                        <div style="font-family: monospace; background: var(--bg); padding: 10px; border-radius: 4px; border-left: 3px solid var(--primary);">
                            ${m.wordIds.map(w => `<span font-size: 1.25rem; style="color: var(--primary);">${escapeHtml(w)}</span>`).join(' ')}
                        </div>
                    </div>
                </div>

                <!-- Edit Source with Spaces -->
                <div style="margin-top: 15px; padding: 15px; background: rgba(37, 99, 235, 0.05); border-radius: 8px;">
                    <div style="font-weight: 600; margin-bottom: 10px;">✏️ Edit Sentence with Spaces:</div>
                    <div style="display: flex; gap: 10px; align-items: flex-start;">
                        <textarea id="edit-source-${uniqueId}" lang="th"
                            style="flex: 1; padding: 10px; font-size: var(--thai-font-size); border: 2px solid var(--primary); border-radius: 6px; min-height: 80px;"
                            placeholder="Enter sentence with spaces between words...">${escapeHtml(spacedFromWords)}</textarea>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button class="btn btn-success" onclick="processEditedSentence('${uniqueId}', ${m.sectionIdx}, ${m.blockIdx}, ${m.sentIdx})">
                                <span class="material-icons">sync</span> Process
                            </button>
                            <button class="btn btn-outline" onclick="resetSentenceEdit('${uniqueId}', ${m.sectionIdx}, ${m.blockIdx}, ${m.sentIdx})">
                                <span class="material-icons">undo</span> Reset
                            </button>
                        </div>
                    </div>
                    <div style="margin-top: 10px; font-size: 0.9rem; color: var(--text-secondary);">
                        <span class="material-icons" style="font-size: 16px; vertical-align: middle;">info</span>
                        Type the sentence with spaces between each word. New words will be automatically translated.
                    </div>
                </div>

                <!-- Preview of changes -->
                <div id="preview-${uniqueId}" style="margin-top: 10px; display: none;">
                    <div style="font-weight: 600; margin-bottom: 5px;">Preview:</div>
                    <div style="font-family: monospace; background: var(--bg); padding: 10px; border-radius: 4px;"></div>
                </div>
            </div>
        `;
    });

    html += `
        <div style="margin-top: 15px; display: flex; gap: 10px;">
            <button class="btn btn-success" onclick="processAllMismatches()">
                <span class="material-icons">auto_fix_high</span> Process All Mismatches
            </button>
            <button class="btn btn-outline" onclick="refreshDocumentView()">
                <span class="material-icons">refresh</span> Refresh
            </button>
        </div>
    </div>`;

    container.innerHTML = html;
}

function clearVocabularyCache() {
    console.log('Vocabulary updated');
}

// Initialize
init();

// Make functions global
window.switchWorkflow = switchWorkflow;
window.setDataType = setDataType;
window.cleanText = cleanText;
window.downloadJSON = downloadJSON;
window.switchPreview = switchPreview;
window.removeBlockFromList = removeBlockFromList;
window.handleTagKeyPress = handleTagKeyPress;
window.generateBlock = generateBlock;
window.checkDuplicates = checkDuplicates;
window.addTag = addTag;
window.copyPreview = copyPreview;
window.clearPreview = clearPreview;
window.toggleActivityMode = toggleActivityMode;
window.updateSectionHeading = updateSectionHeading;
window.updateBlockHeading = updateBlockHeading;
window.updateWordList = updateWordList;
window.updateSentence = updateSentence;
window.updateGrammar = updateGrammar;
window.updateBlock = updateBlock;
window.removeBlock = removeBlock;
window.editWord = editWord;
window.toggleUpdateActivityMode = toggleUpdateActivityMode;
window.cleanUpdateText = cleanUpdateText;
window.checkUpdateDuplicates = checkUpdateDuplicates;
window.generateUpdateBlock = generateUpdateBlock;
window.updateGrammarExample = updateGrammarExample;
window.renderEditableDocument = renderEditableDocument;
window.addGrammarExample = addGrammarExample;
window.processEditedSentence = processEditedSentence;
window.resetSentenceEdit = resetSentenceEdit;
window.refreshDocumentView = refreshDocumentView;
window.processAllMismatches = processAllMismatches;
window.fixAllSentenceMismatches = fixAllSentenceMismatches;
window.editSentenceWords = editSentenceWords;
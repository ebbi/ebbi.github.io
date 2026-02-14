const App = {
    /* ------------------------------------------------------------------
       STATE & DEFAULTS
    ------------------------------------------------------------------ */
    state: {
        lang: localStorage.getItem('localStorageLang') || 'en',
        theme: localStorage.getItem('localStorageTheme') || 'light',
        font: localStorage.getItem('localStorageFont') || 'font-serif',
        translations: {},
        manifest: null,
        currentDoc: null,
        isAutoScrolling: false,

        media: {
            isPlaying: false,
            currentIndex: 0,
            speed: parseFloat(localStorage.getItem('localStorageSpeed')) || 1,
            delay: parseInt(localStorage.getItem('localStorageDelay')) || 1,
            pitch: parseFloat(localStorage.getItem('localStoragePitch')) || 1,
            voice: localStorage.getItem('localStorageVoice') || '',
            // Merge stored map with defaults so missing languages never disappear
            langSettings: (() => {
                const defaults = {
                    th: { show: true, rep: 1 },
                    en: { show: true, rep: 1 },
                    fa: { show: true, rep: 1 }
                };
                try {
                    const stored = JSON.parse(localStorage.getItem('localStorageLangMap'));
                    return { ...defaults, ...(stored || {}) };
                } catch (_) {
                    return defaults;
                }
            })()
        }
    },

    /* ------------------------------------------------------------------
       UTILITIES
    ------------------------------------------------------------------ */
    /** Simple HTML‑escape to avoid XSS when inserting external strings */
    esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    /** Cached voice list – filled once `onvoiceschanged` fires */
    cachedVoices: [],

    /** Convert a language code to a sensible locale for SpeechSynthesis */
    localeFor(lang) {
        const map = { th: 'th-TH', en: 'en-US', fa: 'fa-IR' };
        return map[lang] || `${lang}-${lang.toUpperCase()}`;
    },

    /** Helper to render a single word‑card (used in both paragraph &
        standalone‑words blocks) */
    renderWordCard(wordObj, uid) {
        const settings = this.state.media.langSettings;
        let html = `<div class="word-card">`;
        html += `<div class="word-source audio-element"
                     lang="th"
                     data-text="${this.esc(wordObj.word)}"
                     data-lang="th"
                     onclick="App.seekAndPlay(this)">${this.esc(wordObj.word)}</div>`;
        html += `<div class="word-trans-group">`;
        Object.entries(settings).forEach(([code, cfg]) => {
            if (code !== 'th' && cfg.show && wordObj.translations?.[code]) {
                html += `<div class="word-trans lang-${code} audio-element"
                             lang="${code}"
                             data-text="${this.esc(wordObj.translations[code])}"
                             data-lang="${code}"
                             onclick="App.seekAndPlay(this)">${this.esc(wordObj.translations[code])}</div>`;
            }
        });
        html += `</div></div>`;
        return html;
    },

    /** Helper to render a translated sentence span (splits on Unicode
        punctuation while preserving it) */
    renderTranslationSpan(text, lang, uid) {
        if (!text) return '';
        // Split on anything that is NOT a Letter, Mark, Number, or ZWNJ
        const tokens = text.split(/([^\p{L}\p{M}\p{N}\u200c]+)/u);
        let charPos = 0;
        return tokens
            .map(tok => {
                const isWord = /[\p{L}\p{N}]/u.test(tok);
                const start = charPos;
                const end = charPos + tok.length;
                charPos = end;
                if (isWord) {
                    return `<span id="${uid}-${lang}-w-${start}"
                                 class="word-span"
                                 data-start="${start}"
                                 data-end="${end}">${this.esc(tok)}</span>`;
                }
                return this.esc(tok);
            })
            .join('');
    },

    /**
     * Render the different block types that appear inside a section.
     *
     * Supported block types:
     *   • paragraph – contains one or more sentences, each with optional word‑breakdown
     *   • words     – a grid of standalone word cards
     *
     * The method returns a single HTML string that will be inserted into the
     * section’s `<div class="card section-card">` container.
     */
    renderBlocks(blocks) {
        const settings = this.state.media.langSettings;

        // Map each block to its HTML representation and join them together
        return blocks.map((block, blockIndex) => {
            let blockHtml = `<div class="block-container">`;

            // ------------------------------------------------------------------
            // Paragraph blocks – sentences with source text, optional word list,
            // and per‑language translations.
            // ------------------------------------------------------------------
            if (block.type === 'paragraph') {
                block.elements.forEach((el, elIndex) => {
                    if (el.type !== 'sentence') return;

                    const uid = `s-${blockIndex}-${elIndex}`;

                    // ---- Source sentence (Thai) ----
                    blockHtml += `<div class="sentence-group">
                    <div class="stack-column">
                        <div class="stack-item source audio-element"
                             lang="th"
                             data-text="${this.esc(el.source)}"
                             data-lang="th"
                             data-uid="${uid}"
                             onclick="App.seekAndPlay(this)">
                            ${this.hydrateSource(el.source, el.words, uid)}
                        </div>`;

                    // ---- Word‑by‑word breakdown (appears right under the source) ----
                    if (el.words && el.words.length > 0) {
                        blockHtml += `<div class="sent-word-block">`;
                        el.words.forEach((w, wIdx) => {
                            blockHtml += `<div id="${uid}-card-${wIdx}"
                             class="sent-word-item audio-element"
                             data-text="${this.esc(w.word)}"
                             data-lang="th"
                             data-link="${uid}-w-${wIdx}"
                             onclick="App.seekAndPlay(this)">
                            <div class="sent-word-source">${this.esc(w.word)}</div>`;

                            // Show translations for each enabled language
                            Object.keys(settings).forEach(l => {
                                if (l !== 'th' && settings[l].show && w.translations?.[l]) {
                                    blockHtml += `<div class="sent-word-trans lang-${l}">${this.esc(w.translations[l])}</div>`;
                                }
                            });
                            blockHtml += `</div>`;
                        });
                        blockHtml += `</div>`;
                    }

                    // ---- Translations for the whole sentence (one per enabled language) ----
                    Object.keys(settings).forEach(l => {
                        if (l !== 'th' && settings[l].show && el.translations?.[l]) {
                            const transUid = `${uid}-trans-${l}`;
                            blockHtml += `<div class="stack-item trans lang-${l} audio-element"
                                         lang="${l}"
                                         data-text="${this.esc(el.translations[l])}"
                                         data-lang="${l}"
                                         onclick="App.seekAndPlay(this)">
                            ${this.renderTranslationSpan(el.translations[l], l, transUid)}
                        </div>`;
                        }
                    });

                    blockHtml += `</div></div>`; // close stack-column & sentence-group
                });
            }

            // ------------------------------------------------------------------
            // Words‑grid blocks – a simple grid of independent word cards.
            // ------------------------------------------------------------------
            else if (block.type === 'words') {
                blockHtml += `<div class="words-grid">`;
                block.data.forEach((w, wIdx) => {
                    // Re‑use the same helper that builds a single word card
                    blockHtml += this.renderWordCard(w, `w-${blockIndex}-${wIdx}`);
                });
                blockHtml += `</div>`;
            }

            blockHtml += `</div>`; // close block-container
            return blockHtml;
        }).join('');
    },

    /**
 * Inject `<span>` tags around the words that have a word‑breakdown.
 * Each span gets a unique id (`${uid}-w-${i}`) and a `data‑link`
 * attribute that points to the corresponding word‑card (`${uid}-card-${i}`).
 *
 * @param {string} text   – the original source sentence (Thai)
 * @param {Array}  words  – array of word objects, each with:
 *                         { word:string, range:[start,end] }
 * @param {string} uid    – a unique identifier for the sentence
 * @returns {string} HTML with the word spans wrapped around the matching text.
 */
    hydrateSource(text, words, uid) {
        if (!words || words.length === 0) return this.esc(text);

        let html = '';
        let cursor = 0;

        words.forEach((w, i) => {
            // Add the text before the current word
            html += this.esc(text.slice(cursor, w.range[0]));

            // Wrap the word itself in a span that can be linked/highlighted
            html += `<span id="${uid}-w-${i}"
                     class="word-span"
                     data-link="${uid}-card-${i}">${this.esc(w.word)}</span>`;

            // Move the cursor past this word
            cursor = w.range[1];
        });

        // Append any trailing text after the last word
        html += this.esc(text.slice(cursor));

        return html;
    },

    /** Pause playback without resetting the index (used when the user
        scrolls manually) */
    pausePlayback() {
        this.state.media.isPlaying = false;
        window.speechSynthesis.cancel();
        // Do *not* reset currentIndex – keep the position for later resume
        this.renderMediaBar(document.getElementById('media-player-container'));
    },

    /* ------------------------------------------------------------------
       INITIALISATION & GLOBAL SETUP
    ------------------------------------------------------------------ */
    async init() {
        try {
            await this.loadTranslations();
            await this.loadManifest();
            this.applyGlobalSettings();
            this.renderLayout();

            const stopOnScroll = () => {
                if (this.state.media.isPlaying && !this.state.isAutoScrolling) {
                    this.pausePlayback(); // <-- new pause‑instead‑of‑reset behaviour
                }
            };
            window.addEventListener('wheel', stopOnScroll);
            window.addEventListener('touchmove', stopOnScroll);

            // Populate cachedVoices once the browser has them
            window.speechSynthesis.onvoiceschanged = () => {
                this.cachedVoices = window.speechSynthesis.getVoices();
                this.autoSelectThaiVoice();
            };
            // In case voices are already available
            this.cachedVoices = window.speechSynthesis.getVoices();
            this.autoSelectThaiVoice();

            window.onhashchange = () => this.router();
            this.router();
        } catch (e) {
            console.error('Init error:', e);
        }
    },

    autoSelectThaiVoice() {
        if (!this.state.media.voice) {
            const thaiVoice = this.cachedVoices.find(v => v.lang.startsWith('th'));
            if (thaiVoice) {
                this.state.media.voice = thaiVoice.name;
                localStorage.setItem('localStorageVoice', thaiVoice.name);
            }
        }
    },

    async loadTranslations() {
        const res = await fetch(`./locales/${this.state.lang}.json`);
        this.state.translations = await res.json();
    },

    async loadManifest() {
        // Manifest is static for a session – load once
        if (!this.state.manifest) {
            const res = await fetch('./data/manifest.json');
            this.state.manifest = await res.json();
        }
    },

    applyGlobalSettings() {
        const root = document.documentElement;
        root.lang = this.state.lang;
        root.dir = this.state.lang === 'fa' ? 'rtl' : 'ltr';
        const allFontClasses = [
            'font-standard',
            'font-serif',
            'font-thai-modern',
            'font-fa-vazir'
        ];
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${this.state.theme}-theme`);
        document.body.classList.remove(...allFontClasses);
        document.body.classList.add(this.state.font);
    },

    renderLayout() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <header id="app-toolbar">
                <nav class="toolbar-left">
                    <button class="material-icons toolbar-btn"
                            onclick="location.hash='library'">home</button>
                </nav>
                <nav class="toolbar-right">
                    <button class="material-icons toolbar-btn"
                            onclick="App.toggleMenu('lang')">language</button>
                    <button class="material-icons toolbar-btn"
                            onclick="App.toggleMenu('font')">text_fields</button>
                    <button class="material-icons toolbar-btn"
                            onclick="App.toggleTheme()">
                        ${this.state.theme === 'light' ? 'dark_mode' : 'light_mode'}
                    </button>
                    <button class="material-icons toolbar-btn"
                            onclick="location.hash='help'">help_outline</button>
                </nav>
            </header>
            <div id="media-player-container"></div>
            <main id="main-content"></main>
            <div id="overlay-anchor"></div>
        `;
    },

    /* ------------------------------------------------------------------
       ROUTING
    ------------------------------------------------------------------ */
    async router() {
        const hash = location.hash.replace('#', '') || 'library';
        const main = document.getElementById('main-content');
        const mediaBar = document.getElementById('media-player-container');

        this.stopSequence(); // always stop any playback first
        mediaBar.innerHTML = '';

        if (hash === 'library') {
            this.renderLibrary(main);
        } else if (hash.startsWith('doc/')) {
            this.renderMediaBar(mediaBar);
            await this.handleDocumentSelection(hash.split('/')[1], main);
        } else if (hash.startsWith('quiz/')) {
            this.initQuizFromHash(hash.split('/'));
        } else if (hash === 'help') {
            this.renderHelp(main);
        }
    },

    renderMediaBar(container) {
        if (!container) return;
        const m = this.state.media;
        const repBadges = Object.entries(m.langSettings)
            .filter(([, cfg]) => cfg.show)
            .map(
                ([code, cfg]) => `
                <button class="media-badge"
                        onclick="App.cycleLanguageRep('${code}')">
                    ${code} ${cfg.rep}r
                </button>`
            )
            .join('');

        container.innerHTML = `
            <div class="media-row">
                <div class="media-col">
                    <button class="material-icons player-ctrl"
                            onclick="App.togglePlay()">
                        ${m.isPlaying ? 'pause' : 'play_arrow'}
                    </button>
                    <button class="material-icons player-ctrl"
                            onclick="App.stopSequence()">stop</button>
                </div>
                <div class="media-col middle">
                    <button class="media-badge"
                            onclick="App.cycleSpeed()">${m.speed}x</button>
                    <button class="media-badge"
                            onclick="App.cycleDelay()">${m.delay}s</button>
                    ${repBadges}
                </div>
                <div class="media-col">
                    <button class="material-icons player-ctrl"
                            onclick="App.showSettingsOverlay()">settings</button>
                </div>
            </div>`;
    },

    /**
     * Load a document JSON, set up navigation, and render its sections.
     * This restores the original behaviour that was unintentionally omitted
     * during the refactor.
     */
    async handleDocumentSelection(docId, container) {
        // --------------------------------------------------------------
        // 1️⃣ Load the document JSON (if it isn’t already in state)
        // --------------------------------------------------------------
        if (!this.state.currentDoc || this.state.currentDoc.documentId !== docId) {
            try {
                let path = '';
                // Find the file path from the manifest
                this.state.manifest.learningObjects.forEach(lo => {
                    const d = lo.documents.find(doc => doc.id === docId);
                    if (d) path = d.filePath;
                });

                const resp = await fetch(path);
                this.state.currentDoc = await resp.json();
            } catch (e) {
                console.error('Error loading document:', e);
                container.innerHTML = `<div class="card">Error loading document.</div>`;
                return;
            }
        }

        // --------------------------------------------------------------
        // 2️⃣ Pull the document’s metadata (title, activities, etc.)
        // --------------------------------------------------------------
        let docMeta = null;
        this.state.manifest.learningObjects.forEach(lo => {
            const d = lo.documents.find(doc => doc.id === docId);
            if (d) docMeta = d;
        });

        // --------------------------------------------------------------
        // 3️⃣ Reset media‑related state for the newly‑selected doc
        // --------------------------------------------------------------
        this.state.media.currentIndex = 0;
        this.state.isAutoScrolling = false;

        // --------------------------------------------------------------
        // 4️⃣ Build the HTML for the document view
        // --------------------------------------------------------------
        let html = `<div class="document-content">`;

        // ---- Document title ----
        html += `<h1 class="card">${this.esc(
            docMeta.title[this.state.lang] ||
            docMeta.title.en ||
            'Untitled Document'
        )}</h1>`;

        // ---- Document‑level activities (if any) ----
        if (docMeta.activities && docMeta.activities.length > 0) {
            html += `<div class="activity-header-row" style="padding:0 10px 20px;display:flex;gap:10px;">`;
            docMeta.activities.forEach(act => {
                const label = act.includes('Word') ? 'Quiz: Words' : 'Quiz: Sentences';
                html += `<button class="btn-activity"
                         onclick="location.hash='quiz/${docId}/${act}'">
                        <span class="material-icons" style="font-size:18px;vertical-align:middle;">quiz</span>
                        ${label}
                     </button>`;
            });
            html += `</div>`;
        }

        // ---- Sections ----
        this.state.currentDoc.sections.forEach((sec, idx) => {
            const heading = sec.heading[this.state.lang] ||
                sec.heading.en ||
                'Untitled Section';

            html += `<details class="section-details" open>
            <summary>
                <span class="section-title-text">${this.esc(heading)}</span>
                ${sec.activities ? `
                    <div class="section-activity-inline" style="display:inline-flex;gap:8px;margin-left:15px;vertical-align:middle;">
                        ${sec.activities.map(act => {
                const label = act.includes('Word') ? 'Quiz: Words' : 'Quiz: Sentences';
                return `<button class="btn-activity"
                                            style="padding:4px 8px;font-size:0.75rem;"
                                            onclick="event.stopPropagation(); location.hash='quiz/${docId}/${idx}/${act}'">
                                        <span class="material-icons" style="font-size:18px;vertical-align:middle;">quiz</span>
                                        ${label}
                                    </button>`;
            }).join('')}
                    </div>` : ''}
            </summary>
            <div class="card section-card">
                ${this.renderBlocks(sec.blocks)}
            </div>
        </details>`;
        });

        html += `</div>`;
        container.innerHTML = html;

        // --------------------------------------------------------------
        // 5️⃣ Update the media bar with the first available audio element
        // --------------------------------------------------------------
        const firstAudio = document.querySelector('.audio-element');
        if (firstAudio) {
            this.updateMediaBar(firstAudio.dataset.text, firstAudio.dataset.lang);
        }
    },

    updateMediaBar(text, lang) {
        const display = document.getElementById('media-text-display');
        if (display) {
            display.innerText = text;
            display.className = `media-text lang-${lang}`;
        }
    },

    /* ------------------------------------------------------------------
       MEDIA PLAYBACK
    ------------------------------------------------------------------ */
    togglePlay() {
        this.state.media.isPlaying = !this.state.media.isPlaying;
        if (this.state.media.isPlaying) {
            this.playSequence();
        } else {
            window.speechSynthesis.cancel();
        }
        this.renderMediaBar(document.getElementById('media-player-container'));
    },

    stopSequence() {
        this.state.media.isPlaying = false;
        this.state.media.currentIndex = 0;
        window.speechSynthesis.cancel();

        // Clean up highlight classes (no leading dot!)
        document
            .querySelectorAll('.active-highlight')
            .forEach(el => el.classList.remove('active-highlight'));
        document
            .querySelectorAll('.word-span-highlight')
            .forEach(el => el.classList.remove('word-span-highlight'));

        this.renderMediaBar(document.getElementById('media-player-container'));
    },

    async seekAndPlay(el) {
        // Ignore clicks on inner spans – they are handled by highlightWord()
        if (el.tagName === 'SPAN') return;

        const all = Array.from(document.querySelectorAll('.audio-element'));
        const target = el.classList.contains('audio-element')
            ? el
            : el.closest('.audio-element');

        this.state.media.currentIndex = all.indexOf(target);
        window.speechSynthesis.cancel();
        if (!this.state.media.isPlaying) this.togglePlay();
    },

    async playSequence() {
        const elements = document.querySelectorAll('.audio-element');
        const settings = this.state.media.langSettings;

        while (
            this.state.media.isPlaying &&
            this.state.media.currentIndex < elements.length
        ) {
            const el = elements[this.state.media.currentIndex];
            if (!el) break;

            // Clear previous highlights
            document
                .querySelectorAll('.active-highlight')
                .forEach(n => n.classList.remove('active-highlight'));

            const text = el.getAttribute('data-text');
            const lang = el.getAttribute('data-lang');
            const reps = parseInt(settings[lang]?.rep) || 1;

            // Auto‑scroll handling
            this.state.isAutoScrolling = true;
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => (this.state.isAutoScrolling = false), 600);

            // Repeat according to language‑specific repeat count
            for (let i = 0; i < reps; i++) {
                if (!this.state.media.isPlaying) break;
                await this.speakPromise(text, el, lang);
            }

            if (!this.state.media.isPlaying) break;

            await new Promise(res =>
                setTimeout(res, this.state.media.delay * 1000)
            );
            this.state.media.currentIndex++;
        }

        // If we reached the end, stop cleanly
        if (this.state.media.currentIndex >= elements.length) {
            this.stopSequence();
        }
    },

    speakPromise(text, el, langCode) {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.localeFor(langCode);
            utterance.rate = this.state.media.speed;
            utterance.pitch = this.state.media.pitch;

            // Use the cached Thai voice if applicable
            if (langCode === 'th' && this.state.media.voice) {
                const voice = this.cachedVoices.find(
                    v => v.name === this.state.media.voice
                );
                if (voice) utterance.voice = voice;
            }

            // Linked highlighting (sentence ↔ word card)
            const linkId = el.getAttribute('data-link');
            const linkedEl = linkId ? document.getElementById(linkId) : null;

            utterance.onstart = () => {
                el.classList.add('active-highlight');
                if (linkedEl) linkedEl.classList.add('active-highlight');
            };

            const cleanup = () => {
                el.classList.remove('active-highlight');
                if (linkedEl) linkedEl.classList.remove('active-highlight');
                resolve();
            };

            utterance.onend = cleanup;
            utterance.onerror = cleanup;
            window.speechSynthesis.speak(utterance);
        });
    },

    cycleSpeed() {
        const speeds = [0.5, 0.75, 1, 1.25, 1.5];
        const idx = speeds.indexOf(this.state.media.speed);
        const next = speeds[(idx + 1) % speeds.length];
        this.updateMediaParam('speed', next);
    },

    cycleDelay() {
        const next = (this.state.media.delay % 5) + 1; // allow 1‑5 seconds
        this.updateMediaParam('delay', next);
    },

    updateMediaParam(key, val) {
        this.state.media[key] = parseFloat(val);
        localStorage.setItem(`v2_${key}`, val);
        this.renderMediaBar(document.getElementById('media-player-container'));
    },

    cycleLanguageRep(langCode) {
        const cur = this.state.media.langSettings[langCode].rep;
        this.state.media.langSettings[langCode].rep = (cur % 3) + 1;
        localStorage.setItem(
            'localStorageLangMap',
            JSON.stringify(this.state.media.langSettings)
        );
        this.renderMediaBar(document.getElementById('media-player-container'));
    },

    /* ------------------------------------------------------------------
       HIGHLIGHTING
    ------------------------------------------------------------------ */
    highlightWord(el) {
        // Remove any existing highlights
        document
            .querySelectorAll('.active-highlight')
            .forEach(n => n.classList.remove('active-highlight'));

        const linkId = el.getAttribute('data-link');
        const linkedEl = linkId ? document.getElementById(linkId) : null;

        el.classList.add('active-highlight');
        if (linkedEl) linkedEl.classList.add('active-highlight');
    },

    /* ------------------------------------------------------------------
       SETTINGS OVERLAY
    ------------------------------------------------------------------ */
    showSettingsOverlay() {
        const anchor = document.getElementById('overlay-anchor');
        const m = this.state.media;

        // Build language‑configuration rows for the table
        const langRows = Object.entries(m.langSettings)
            .map(
                ([code, cfg]) => `
                <tr>
                    <td>${code.toUpperCase()}</td>
                    <td>
                        <input type="checkbox"
                               ${cfg.show ? 'checked' : ''}
                               onchange="App.updateLangCfg('${code}','show',this.checked)">
                    </td>
                    <td>
                        <input type="number" style="width:40px"
                               value="${cfg.rep}"
                               onchange="App.updateLangCfg('${code}','rep',this.value)">
                    </td>
                </tr>`
            )
            .join('');

        anchor.innerHTML = `
            <div class="overlay-full card">
                <div class="settings-header">
                    <h3>Settings</h3>
                    <button class="material-icons"
                            onclick="document.getElementById('overlay-anchor').innerHTML=''">
                        close
                    </button>
                </div>

                <div class="settings-sliders">
                    <div class="control-row-inline">
                        <label>Speed</label>
                        <input type="range" min="0.5" max="2" step="0.25"
                               value="${m.speed}"
                               oninput="App.updateMediaParam('speed', this.value)">
                        <span class="val-label">${m.speed}x</span>
                    </div>

                    <div class="control-row-inline">
                        <label>Delay</label>
                        <input type="range" min="1" max="5" step="1"
                               value="${m.delay}"
                               oninput="App.updateMediaParam('delay', this.value)">
                        <span class="val-label">${m.delay}s</span>
                    </div>

                    <div class="control-row-inline">
                        <label>Pitch</label>
                        <input type="range" min="0.5" max="1.5" step="0.1"
                               value="${m.pitch}"
                               oninput="App.updateMediaParam('pitch', this.value)">
                        <span class="val-label">${m.pitch}</span>
                    </div>
                </div>

                <select id="voice-select"
                        onchange="App.updateMediaParam('voice', this.value)">
                    ${this.cachedVoices
                .map(
                    v => `<option value="${v.name}"
                                      ${m.voice === v.name ? 'selected' : ''}>
                                      ${v.name}
                                   </option>`
                )
                .join('')}
                </select>

                <table>
                    <thead>
                        <tr><th>Language</th><th>Show</th><th>Repeat</th></tr>
                    </thead>
                    <tbody>
                        ${langRows}
                    </tbody>
                </table>
            </div>`;
    },

    /** Update a language‑specific configuration (visibility or repeat count) */
    updateLangCfg(code, key, value) {
        const cfg = this.state.media.langSettings[code];
        if (!cfg) return;
        cfg[key] = key === 'show' ? !!value : parseInt(value, 10);
        localStorage.setItem(
            'localStorageLangMap',
            JSON.stringify(this.state.media.langSettings)
        );
        this.renderMediaBar(document.getElementById('media-player-container'));
        // Re‑render the current view so the new language settings take effect
        this.router();
    },

    /* ------------------------------------------------------------------
       LIBRARY & HELP RENDERS
    ------------------------------------------------------------------ */
    renderLibrary(container) {
        let html = '';
        this.state.manifest.learningObjects.forEach(obj => {
            html += `<section class="card"><h3>${this.esc(
                obj.title[this.state.lang] ||
                obj.title.en ||
                'Untitled'
            )}</h3><div class="doc-grid">`;
            obj.documents.forEach(d => {
                html += `<div class="card doc-card"
                             onclick="location.hash='doc/${d.id}'">
                            <h4>${this.esc(
                    d.title[this.state.lang] ||
                    d.title.en ||
                    'Untitled'
                )}</h4>
                         </div>`;
            });
            html += `</div></section>`;
        });
        container.innerHTML = html;
    },

    renderHelp(container) {
        const t = this.state.translations;
        const renderSteps = steps =>
            (Array.isArray(steps) ? steps : [])
                .map(s => `<li>${this.esc(s)}</li>`)
                .join('');

        container.innerHTML = `
            <section class="card">
                <h2>${t.help_title || 'Help'}</h2>

                <div style="margin-bottom:20px;">
                    <button class="btn-activity"
                            onclick="App.testSpeech()">
                        ${t.test_speech || 'Test Speech'}
                    </button>
                </div>

                <details class="section-details">
                    <summary>${t.setup_android || 'Android'}</summary>
                    <div class="card"><ol>${renderSteps(t.android_steps)}</ol></div>
                </details>

                <details class="section-details">
                    <summary>${t.setup_apple || 'Apple'}</summary>
                    <div class="card"><ol>${renderSteps(t.apple_steps)}</ol></div>
                </details>

                <details class="section-details" open>
                    <summary>${t.generate_json || 'JSON Generator'}</summary>
                    <div class="card">
                        <div class="gen-options" style="display:flex;gap:15px;margin-bottom:15px;">
                            <label style="cursor:pointer">
                                <input type="radio" name="genMode" value="sentence"
                                       checked onchange="App.resetJsonState()">
                                ${t.mode_sentence || 'Sentence'}
                            </label>
                            <label style="cursor:pointer">
                                <input type="radio" name="genMode" value="words"
                                       onchange="App.resetJsonState()">
                                ${t.mode_words || 'Words'}
                            </label>
                        </div>

                        <label style="display:block;margin-bottom:8px;">
                            ${t.thai_input_label || 'Input (Comma Separated):'}
                        </label>
                        <input type="text" id="thai-input" class="gen-input"
                               style="width:100%;padding:10px;margin-bottom:10px;"
                               placeholder="word one, word two, word three"
                               oninput="App.resetJsonState()">

                        <button id="btn-generate" class="btn-activity"
                                onclick="App.generateJsonSample(document.getElementById('thai-input').value)">
                            ${t.btn_generate || 'Generate'}
                        </button>

                        <pre id="json-output" class="json-output-box"
                             style="margin-top:15px;background:#1e1e1e;color:#a9dc76;padding:15px;display:none;overflow-x:auto;"></pre>
                    </div>
                </details>
            </section>`;
    },

    /* ------------------------------------------------------------------
       SMALL HELPERS
    ------------------------------------------------------------------ */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    async fetchTranslation(text, pair) {
        try {
            const resp = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
                    text
                )}&langpair=${pair}`
            );
            const data = await resp.json();
            return data.responseStatus === 200 ? data.responseData.translatedText : '';
        } catch (e) {
            console.error('Translation error:', e);
            return '';
        }
    },

    async generateJsonSample(input) {
        if (!input || input.trim() === '') return;

        const outBox = document.getElementById('json-output');
        outBox.style.display = 'block';
        outBox.textContent =
            'Processing translations… please wait (throttled)…';

        const mode = document.querySelector('input[name="genMode"]:checked')
            .value;
        const tokens = input
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        let output = {};

        if (mode === 'words') {
            const wordList = [];
            for (const token of tokens) {
                const en = await this.fetchTranslation(token, 'th|en');
                await this.sleep(200);
                const fa = await this.fetchTranslation(token, 'th|fa');
                await this.sleep(200);
                wordList.push({
                    word: token,
                    translations: { en, fa }
                });
            }
            output = { type: 'words', data: wordList };
        } else {
            // ----- SENTENCE MODE -----
            const source = tokens.join('');
            const sentEn = await this.fetchTranslation(source, 'th|en');
            await this.sleep(300);
            const sentFa = await this.fetchTranslation(source, 'th|fa');
            await this.sleep(300);

            const wordsData = [];
            let cursor = 0;
            for (const token of tokens) {
                const len = token.length;
                const start = cursor;
                const end = cursor + len;

                const wordEn = await this.fetchTranslation(token, 'th|en');
                await this.sleep(200);
                const wordFa = await this.fetchTranslation(token, 'th|fa');
                await this.sleep(200);

                wordsData.push({
                    word: token,
                    range: [start, end],
                    translations: { en: wordEn, fa: wordFa }
                });
                cursor = end;
            }

            output = {
                type: 'sentence',
                source,
                words: wordsData,
                translations: { en: sentEn, fa: sentFa }
            };
        }

        outBox.textContent = JSON.stringify(output, null, 4);
    },

    testSpeech() {
        const txt = 'ทดสอบระบบเสียง';
        const utter = new SpeechSynthesisUtterance(txt);
        utter.lang = 'th-TH';
        if (this.state.media.voice) {
            const voice = this.cachedVoices.find(v => v.name === this.state.media.voice);
            if (voice) utter.voice = voice;
        }
        window.speechSynthesis.speak(utter);
        alert(this.state.translations.testing_msg || 'Testing Thai Speech...');
    },

    resetJsonState() {
        const btn = document.getElementById('btn-generate');
        const out = document.getElementById('json-output');
        if (btn) {
            btn.disabled = false;
            btn.style.opacity = '1';
        }
        if (out) out.style.display = 'none';
    },

    /* ------------------------------------------------------------------
       THEME & MENU
    ------------------------------------------------------------------ */
    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('localStorageTheme', this.state.theme);
        this.applyGlobalSettings();
        this.renderLayout();
        this.router();
    },

    toggleMenu(type) {
        const anchor = document.getElementById('overlay-anchor');
        if (anchor.innerHTML !== '') {
            anchor.innerHTML = '';
            return;
        }
        const options =
            type === 'lang'
                ? { en: 'English', fa: 'فارسی', th: 'ไทย' }
                : {
                    'font-standard': 'Standard (Sans)',
                    'font-serif': 'Classic (Serif)',
                    'font-thai-modern': 'Modern Thai (Loopless)',
                    'font-fa-vazir': 'Farsi Script (Vazir)'
                };
        let html = '<div class="overlay-menu card">';
        Object.entries(options).forEach(([k, v]) => {
            html += `<button onclick="App.updateSetting('${type}','${k}')">${v}</button>`;
        });
        html += '</div>';
        anchor.innerHTML = html;
    },

    async updateSetting(type, val) {
        if (type === 'lang') {
            this.state.lang = val;
            localStorage.setItem('localStorageLang', val);
            await this.loadTranslations();
        } else {
            this.state.font = val;
            localStorage.setItem('localStorageFont', val);
        }
        this.applyGlobalSettings();
        this.renderLayout();
        this.router();
    },

    /* ------------------------------------------------------------------
       QUIZ LOGIC
    ------------------------------------------------------------------ */
    /** Extract flat quiz items from a document (or a single section) */
    getQuizData(doc, sectionIdx = null, type = 'word') {
        const items = [];
        const sections =
            sectionIdx !== null ? [doc.sections[sectionIdx]] : doc.sections;
        const srcLang = doc.sourceLang || 'th';

        sections.forEach(sec => {
            sec.blocks.forEach(block => {
                if (type === 'multipleChoiceWord' && block.type === 'words') {
                    block.data.forEach(w => {
                        const langMap = { ...w.translations, [srcLang]: w.word };
                        items.push({ id: Math.random().toString(36), langMap });
                    });
                } else if (
                    type === 'multipleChoiceSentence' &&
                    block.type === 'paragraph'
                ) {
                    block.elements.forEach(el => {
                        if (el.type === 'sentence') {
                            const langMap = {
                                ...el.translations,
                                [srcLang]: el.source
                            };
                            items.push({ id: Math.random().toString(36), langMap });
                        }
                    });
                }
            });
        });
        return items;
    },

    /** Initialise a quiz from the URL hash */
    async initQuizFromHash(parts) {
        const docId = parts[1];
        const type = parts.length === 4 ? parts[3] : parts[2];
        const secIdx = parts.length === 4 ? parseInt(parts[2], 10) : null;

        // Ensure the document is loaded
        if (!this.state.currentDoc || this.state.currentDoc.documentId !== docId) {
            await this.handleDocumentSelection(docId, document.createElement('div'));
        }

        const data = this.getQuizData(this.state.currentDoc, secIdx, type);

        // Locate document metadata for language defaults
        let docMeta = null;
        this.state.manifest.learningObjects.forEach(lo => {
            const d = lo.documents.find(doc => doc.id === docId);
            if (d) docMeta = d;
        });

        this.state.quiz = {
            items: data.sort(() => Math.random() - 0.5),
            currentIndex: 0,
            score: 0,
            incorrect: [],
            qLang: docMeta?.sourceLang || 'th',
            aLang: docMeta?.targetLangs?.[0] || 'en',
            type,
            sectionIdx: secIdx,
            docId
        };

        this.renderQuiz();
    },

    /* ------------------------------------------------------------------
       MEDIA PLAYBACK (continued)
    ------------------------------------------------------------------ */
    /**
     * Speak a piece of text **outside** of the normal “play‑sequence”.
     * Used by the quiz UI (question preview, answer‑preview icons, etc.).
     *
     * @param {string} text – the string to be spoken
     * @param {string} lang – language code (e.g. 'th', 'en', 'fa')
     */
    playAudio(text, lang) {
        // Cancel any speech that might already be playing
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.localeFor(lang);
        utterance.rate = this.state.media.speed;
        utterance.pitch = this.state.media.pitch;

        // If the user has selected a specific voice (Thai voice handling)
        if (lang === 'th' && this.state.media.voice) {
            const voice = this.cachedVoices.find(v => v.name === this.state.media.voice);
            if (voice) utterance.voice = voice;
        }

        // Resolve the promise when speaking finishes (mirrors speakPromise)
        utterance.onend = () => {/* nothing special needed here */ };
        utterance.onerror = () => {/* swallow errors silently */ };

        window.speechSynthesis.speak(utterance);
    },

    /* ------------------------------------------------------------------
       QUIZ LOGIC – RENDERING & INTERACTION
    ------------------------------------------------------------------ */
    /** Render the current quiz question */
    renderQuiz() {
        const main = document.getElementById('main-content');
        const q = this.state.quiz;
        const t = this.state.translations;

        // Current quiz item
        const item = q.items[q.currentIndex];

        // ---------- Determine the heading ----------
        // If we are in a section‑level quiz, use the section title.
        // Otherwise fall back to the document title from the manifest.
        let heading = t.test_yourself || 'Test Yourself';
        if (typeof q.sectionIdx === 'number' && q.sectionIdx >= 0) {
            const sec = this.state.currentDoc.sections[q.sectionIdx];
            if (sec && sec.heading && sec.heading[this.state.lang]) {
                heading = sec.heading[this.state.lang];
            } else if (sec && sec.heading && sec.heading.en) {
                heading = sec.heading.en;
            }
        } else {
            // Document‑level quiz – look up the doc metadata
            const docMeta = (() => {
                let meta = null;
                this.state.manifest.learningObjects.forEach(lo => {
                    const d = lo.documents.find(doc => doc.id === q.docId);
                    if (d) meta = d;
                });
                return meta;
            })();
            if (docMeta && docMeta.title && docMeta.title[this.state.lang]) {
                heading = docMeta.title[this.state.lang];
            } else if (docMeta && docMeta.title && docMeta.title.en) {
                heading = docMeta.title.en;
            }
        }

        const scoreLabel = t.score || 'Score';
        const questionText = item.langMap[q.qLang] || 'N/A';
        const correctText = item.langMap[q.aLang] || 'N/A';

        // ---------- Build the four answer options ----------
        // 1 correct + up to 3 distractors (unique, random order)
        let distractors = q.items
            .map(i => i.langMap[q.aLang])
            .filter(txt => txt && txt !== correctText);
        distractors = [...new Set(distractors)]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        const options = [correctText, ...distractors].sort(() => Math.random() - 0.5);

        const availableLangs = Object.keys(item.langMap);
        const progress = ((q.currentIndex) / q.items.length) * 100;

        // ---------- Render the quiz UI ----------
        main.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-header">
                    <h2 lang="${this.state.lang}">${this.esc(heading)}</h2>
                    <div class="quiz-progress-container">
                        <div class="quiz-progress-fill"
                             style="width:${progress}%"></div>
                    </div>
                    <div class="quiz-lang-selectors">
                        <select onchange="App.state.quiz.qLang=this.value;App.renderQuiz()">
                            ${availableLangs
                .map(l => `<option value="${l}" ${l === q.qLang ? 'selected' : ''}>${l.toUpperCase()}</option>`)
                .join('')}
                        </select>
                        <span class="material-icons">arrow_forward</span>
                        <select onchange="App.state.quiz.aLang=this.value;App.renderQuiz()">
                            ${availableLangs
                .map(l => `<option value="${l}" ${l === q.aLang ? 'selected' : ''}>${l.toUpperCase()}</option>`)
                .join('')}
                        </select>
                    </div>
                    <div lang="${this.state.lang}">${scoreLabel}: ${q.score}</div>
                </div>

                <div class="quiz-question-card">
                    <span class="material-icons audio-preview-icon"
                          onclick="App.playAudio(\`${questionText.replace(/`/g, '\\`')}\`,
                                             '${q.qLang}')">
                        volume_up
                    </span>
                    <div class="quiz-question-text" lang="${q.qLang}">
                        ${this.esc(questionText)}
                    </div>
                </div>

                <div class="quiz-options-grid">
                    ${options
                .map(
                    opt => `
                        <button class="quiz-option-btn"
                                lang="${q.aLang}"
                                onclick="App.handleAnswer(this,
                                          \`${opt.replace(/`/g, '\\`')}\`,
                                          \`${correctText.replace(/`/g, '\\`')}\`)">
                            <span class="material-icons audio-preview-icon"
                                  onclick="event.stopPropagation();App.playAudio('\${opt.replace(/\\\`/g,'\\\\\\\`')}', '${q.aLang}')">
                                volume_up
                            </span>
                            <span>${this.esc(opt)}</span>
                        </button>`
                )
                .join('')}
                </div>
            </div>
        `;

        // Auto‑play the question when the UI appears
        this.playAudio(questionText, q.qLang);
    },

    /** Process a user's answer */
    handleAnswer(btn, selected, correct) {
        const q = this.state.quiz;
        const isCorrect = selected === correct;

        // Speak the selected answer immediately
        this.playAudio(selected, q.aLang);

        // Visual feedback
        if (isCorrect) {
            btn.classList.add('correct');
            q.score++;
        } else {
            btn.classList.add('incorrect');
            q.incorrect.push(q.items[q.currentIndex]);

            // Highlight the correct option so the learner can see it
            document
                .querySelectorAll('.quiz-option-btn')
                .forEach(b => {
                    if (b.innerText.includes(correct)) b.classList.add('correct');
                });
        }

        // Disable all options to prevent double‑clicks
        document
            .querySelectorAll('.quiz-option-btn')
            .forEach(b => (b.disabled = true));

        // Advance after a short pause (allows TTS to finish)
        setTimeout(() => {
            q.currentIndex++;
            if (q.currentIndex < q.items.length) {
                this.renderQuiz();
            } else {
                this.renderReview();
            }
        }, 2000);
    },

    /** Final review screen after the quiz ends */
    renderReview() {
        const main = document.getElementById('main-content');
        const q = this.state.quiz;
        const t = this.state.translations;

        main.innerHTML = `
            <div class="quiz-container">
                <h2 lang="${this.state.lang}">${t.review || 'Review'}</h2>
                <div class="card" lang="${this.state.lang}">
                    <h3>${t.score || 'Score'}: ${q.score} / ${q.items.length}</h3>
                </div>

                <div class="review-list">
                    ${q.incorrect
                .map(item => {
                    const qTxt = item.langMap[q.qLang];
                    const aTxt = item.langMap[q.aLang];
                    return `
                                <div class="card review-item"
                                     onclick="App.playAudio(\`${this.esc(qTxt).replace(/`/g, '\\`')}\`, '${q.qLang}')">
                                    <div>
                                        <strong lang="${q.qLang}">${this.esc(qTxt)}</strong> 
                                        <small lang="${q.aLang}">${this.esc(aTxt)}</small>
                                    </div>
                                </div>`;
                })
                .join('')}
                </div>

                <div class="quiz-footer-btns">
                    <button class="btn-activity btn-flex"
                            lang="${this.state.lang}"
                            onclick="location.hash='doc/${this.state.currentDoc.documentId}'">
                        ${t.finish || 'Finish'}
                    </button>
                    ${q.incorrect.length > 0
                ? `
                        <button class="btn-activity btn-flex"
                                lang="${this.state.lang}"
                                onclick="App.retryIncorrect()">
                            ${t.retry_incorrect || 'Retry Incorrect'}
                        </button>`
                : ''}
                </div>
            </div>
        `;
    },

    /** Restart the quiz using only the items the user got wrong */
    retryIncorrect() {
        this.state.quiz.items = [...this.state.quiz.incorrect].sort(
            () => Math.random() - 0.5
        );
        this.state.quiz.currentIndex = 0;
        this.state.quiz.score = 0;
        this.state.quiz.incorrect = [];
        this.renderQuiz();
    },

    /* ------------------------------------------------------------------
       APPLICATION ENTRY POINT
    ------------------------------------------------------------------ */
}; // End of App object

// Kick‑off the SPA
App.init();
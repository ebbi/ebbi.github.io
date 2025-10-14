// app/main.js
import { Router } from './router.js';
import { FONT_CATALOG, preloadFonts } from './fonts.js';

// -------------------- CONFIG --------------------
const SUPPORTED_LANGS = ['th', 'fa', 'zh', 'ja', 'es', 'en', 'hi', 'ar'];
const FALLBACK_LANG = 'en';
const LS_LANG_KEY = 'local_storage_lang';

// -----------------------------------------------------------------
// Languages that are written right‑to‑left.
// -----------------------------------------------------------------
const RTL_LANGS = ['ar', 'fa', 'ur', 'he'];
function isRTL(lang) { return RTL_LANGS.includes(lang); }

// Human‑readable labels for the language selector.
const LANGUAGE_LABELS = {
    th: 'TH - ไทย',
    fa: 'FA - فارسی',
    zh: 'ZH - 中文',
    ja: 'JA - 日本語',
    es: 'ES - Español',
    en: 'EN - English',
    hi: 'HI - हिन्दी',
    ar: 'AR - العربية'
};

// -------------------- STATE --------------------
let UI_LANG = getStoredLang();   // current UI language
let EXERCISES = [];               // master index (filled once)

// -------------------- HELPERS --------------------
function getStoredLang() {
    const stored = localStorage.getItem(LS_LANG_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

    // navigator.language may be undefined; fall back to navigator.languages[0] if present.
    const navLang = (typeof navigator !== 'undefined' && (
        navigator.language ||
        (Array.isArray(navigator.languages) && navigator.languages[0])
    )) || '';

    const candidate = navLang.slice(0, 2).toLowerCase();
    return SUPPORTED_LANGS.includes(candidate) ? candidate : FALLBACK_LANG;
}

/**
 * Switch UI language, persist it, and update the document direction.
 */
async function setLang(lang) {
    UI_LANG = lang;
    localStorage.setItem(LS_LANG_KEY, lang);
    const direction = isRTL(lang) ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', direction);
    document.body.setAttribute('dir', direction);
}

/**
 * Small wrapper around fetch that resolves to JSON or rejects.
 */
function loadJSON(url) {
    return fetch(url).then(r => (r.ok ? r.json() : Promise.reject(`❌ ${url}`)));
}

// -------------------- THEME --------------------
export function applySavedTheme() {
    const saved = localStorage.getItem('local_storage_theme') || 'light';
    document.documentElement.dataset.theme = saved;
}
function toggleTheme() {
    const root = document.documentElement;
    const cur = root.dataset.theme || 'light';
    const nxt = cur === 'light' ? 'dark' : 'light';
    root.dataset.theme = nxt;
    localStorage.setItem('local_storage_theme', nxt);
}

// -------------------- UI RENDERING --------------------
async function renderApp() {
    document.body.innerHTML = `
        <header id="toolbar" class="toolbar"></header>
        <main id="main" class="main"></main>
    `;
    renderToolbar();
    await renderMenu();
}

function renderToolbar() {
    const t = document.getElementById('toolbar');
    const loc = locales[UI_LANG];

    // Language selector options
    const optionsHTML = SUPPORTED_LANGS.map(code => {
        const selected = code === UI_LANG ? 'selected' : '';
        const label = LANGUAGE_LABELS[code] || code.toUpperCase();
        return `<option value="${code}" ${selected}>${label}</option>`;
    }).join('');

    // Build toolbar DOM (no innerHTML for dynamic data)
    const leftDiv = document.createElement('div');
    leftDiv.className = 'toolbar-left';
    const select = document.createElement('select');
    select.id = 'langSelect';
    select.className = 'toolbar-left';
    select.innerHTML = optionsHTML;
    leftDiv.appendChild(select);

    const themeBtn = document.createElement('button');
    themeBtn.id = 'themeToggle';
    themeBtn.className = 'toolbar-right';
    themeBtn.title = loc.toggleTheme;
    themeBtn.textContent = '🌙';

    t.appendChild(leftDiv);
    t.appendChild(themeBtn);

    // Handlers
    themeBtn.onclick = toggleTheme;
    select.onchange = ev => {
        const newLang = ev.target.value;
        if (newLang !== UI_LANG) router.navigate(`/${newLang}/`, true);
    };

    // Insert Settings panel
    renderSettingsPanel();
}

/**
 * Settings panel – <details> with a voice selector.
 */

function renderSettingsPanel() {
    const details = document.createElement('details');
    details.open = true;
    details.style.margin = '0.5rem 1rem';

    const summary = document.createElement('summary');
    summary.textContent = locales[UI_LANG].content.settings || 'Settings';
    details.appendChild(summary);

    // ---- Voice selector (unchanged) ----
    const voiceSelect = document.createElement('select');
    voiceSelect.id = 'voiceSelect';
    voiceSelect.style.marginTop = '0.5rem';
    voiceSelect.style.width = '100%';
    details.appendChild(voiceSelect);

    // ---- NEW: Font selector ----
    const fontSelect = document.createElement('select');
    fontSelect.id = 'fontSelect';
    fontSelect.style.marginTop = '0.5rem';
    fontSelect.style.width = '100%';
    details.appendChild(fontSelect);

    const toolbar = document.getElementById('toolbar');
    toolbar.parentNode.insertBefore(details, toolbar.nextSibling);

    // Populate both selectors
    populateVoiceList(voiceSelect);
    populateFontList(fontSelect);

    // ---- Event listeners ----
    voiceSelect.onchange = ev => {
        const chosen = ev.target.value;
        console.log('[Voice] Selected:', chosen);
        // (your existing voice‑handling logic stays here)
    };

    fontSelect.onchange = ev => {
        const chosenName = ev.target.value;
        const fontObj = FONT_CATALOG.find(f => f.name === chosenName);
        if (!fontObj) return;

        // Store the choice so it survives reloads
        localStorage.setItem('local_storage_font', fontObj.name);
        applyFontFamily(fontObj.family);
        console.info(`[Font] Applied ${fontObj.name}`);
    };
}

/**
 * Fill the font selector with the names from FONT_CATALOG.
 * Also restores the previously saved choice (if any).
 */
function populateFontList(selectEl) {
    // Build the <option> list
    const optionsHTML = FONT_CATALOG.map(f => {
        const selected = (localStorage.getItem('local_storage_font') === f.name) ? 'selected' : '';
        return `<option value="${f.name}" ${selected}>${f.name}</option>`;
    }).join('');
    selectEl.innerHTML = optionsHTML;

    // Apply the saved font immediately (so the UI reflects it on start‑up)
    const saved = FONT_CATALOG.find(f => f.name === localStorage.getItem('local_storage_font'));
    if (saved) applyFontFamily(saved.family);
}

/**
 * Apply a CSS `font-family` to the root element.
 * Using `document.documentElement` ensures *every* element inherits it
 * unless something overrides it locally.
 */
function applyFontFamily(cssFamily) {
    document.documentElement.style.fontFamily = cssFamily;
}
/**
 * Populate the voice selector with only voices that match the
 * languages supported by the app. Shows the modal if < 2 matches.
 */
function populateVoiceList(selectEl) {
    if (!('speechSynthesis' in window)) {
        console.warn('speechSynthesis API not available in this browser.');
        return;
    }

    function fillList() {
        const allVoices = speechSynthesis.getVoices();

        const matching = allVoices.filter(v => {
            const langCode = v.lang.slice(0, 2).toLowerCase();
            return SUPPORTED_LANGS.includes(langCode);
        });

        console.log('[Voice] Matching voices count:', matching.length);
        if (matching.length < 2) {
            console.log('[Voice] Not enough voices – showing modal.');
            showInstallModal();
        }

        selectEl.innerHTML = '';
        matching.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.name;
            opt.textContent = `${v.name} (${v.lang})`;
            selectEl.appendChild(opt);
        });

        if (selectEl.options.length > 0) selectEl.selectedIndex = 0;
    }

    speechSynthesis.addEventListener('voiceschanged', fillList);
    fillList(); // immediate attempt
}

/**
 * Returns a Promise that resolves to the localisation key for the current OS.
 *
 * Possible return values (all already used in the locale files):
 *   installStepsWindows
 *   installStepsMac
 *   installStepsIOS
 *   installStepsAndroid
 *   installStepsLinux
 *   installStepsChromeOS
 *   installStepsGeneric   // fallback
 */
function getOSInstructionKey() {
    // ---------- 1️⃣ Try the modern Client‑Hints API ----------
    if (navigator.userAgentData?.getHighEntropyValues) {
        return navigator.userAgentData
            .getHighEntropyValues(['platform'])
            .then(ua => {
                const platform = (ua.platform || '').toLowerCase();

                if (platform.includes('windows')) return 'installStepsWindows';
                if (platform.includes('mac')) return 'installStepsMac';
                if (platform.includes('ios')) return 'installStepsIOS';
                if (platform.includes('android')) return 'installStepsAndroid';
                if (platform.includes('linux')) return 'installStepsLinux';
                if (platform.includes('chromeos')) return 'installStepsChromeOS';

                console.warn('[OS Detection] Unknown platform via Client‑Hints → generic fallback');
                return 'installStepsGeneric';
            })
            .catch(err => {
                console.error('[OS Detection] Client‑Hints failed:', err);
                return detectViaUserAgent();          // fallback
            });
    }

    // ---------- 2️⃣ Classic UA string parsing (sync) ----------
    return Promise.resolve(detectViaUserAgent());

    // -----------------------------------------------------------------
    // Helper – the original regex‑based detection (unchanged logic)
    // -----------------------------------------------------------------
    function detectViaUserAgent() {
        const ua = navigator.userAgent || '';
        console.debug('[OS Detection] User‑Agent string:', ua);

        if (/Windows Phone|WPDesktop/.test(ua)) return 'installStepsWindows';
        if (/Win(dows)?/.test(ua)) return 'installStepsWindows';
        if (/CrOS/.test(ua)) return 'installStepsChromeOS';
        if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(ua)) return 'installStepsMac';
        if (/iPhone|iPad|iPod/.test(ua)) return 'installStepsIOS';
        if (/Android/.test(ua)) return 'installStepsAndroid';
        if (/Linux/.test(ua)) return 'installStepsLinux';

        // Edge‑on‑Android / Edge‑on‑iOS / Samsung Browser helpers
        if (/EdgA/.test(ua) && /Android/.test(ua)) return 'installStepsAndroid';
        if (/EdgiOS/.test(ua) && /iPhone|iPad/.test(ua)) return 'installStepsIOS';
        if (/SamsungBrowser/.test(ua) && /Android/.test(ua)) return 'installStepsAndroid';

        console.warn('[OS Detection] No OS matched → generic fallback');
        return 'installStepsGeneric';
    }
}

/**
 * Builds and displays the installation‑steps modal.
 * The function is now `async` and waits for the OS‑key before rendering.
 */
async function showInstallModal() {
    // ① Resolve the OS‑specific localisation key
    const instructionKey = await getOSInstructionKey();

    console.log('[Modal] UI_LANG:', UI_LANG);
    console.log('[Modal] Instruction key:', instructionKey);

    // ② Pull the localized strings (fallback chain preserved)
    const headline = locales[UI_LANG].installMessage ||
        'You need to install the languages you are learning.';
    const steps = locales[UI_LANG][instructionKey] ||
        locales[UI_LANG].installSteps ||
        'Please refer to your operating‑system documentation to install language packs and TTS voices.';

    console.log('[Modal] Raw steps string:', steps);

    // ③ Convert HTML line‑breaks to real newlines for the <pre> element
    const formattedSteps = steps.replace(/<br\s*\/?>/gi, '\n');

    // ④ Create the modal only once (re‑use on subsequent calls)
    let backdrop = document.getElementById('install-modal-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'install-modal-backdrop';
        backdrop.className = 'modal-backdrop';

        const modal = document.createElement('div');
        modal.className = 'modal';

        const title = document.createElement('h2');
        title.id = 'install-modal-title';
        modal.appendChild(title);

        const body = document.createElement('pre');
        body.id = 'install-modal-body';
        body.style.whiteSpace = 'pre-wrap';
        modal.appendChild(body);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.marginTop = '1rem';
        closeBtn.onclick = () => document.body.removeChild(backdrop);
        modal.appendChild(closeBtn);

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
    }

    // ⑤ Populate the modal with the freshly resolved content
    document.getElementById('install-modal-title').textContent = headline;
    document.getElementById('install-modal-body').textContent = formattedSteps;
}

/**
 * Render the exercise menu.
 */
async function renderMenu() {
    const container = document.getElementById('main');
    if (!container) {
        console.error('renderMenu: #main not found');
        return;
    }

    if (!EXERCISES.length) {
        try {
            EXERCISES = await loadJSON('/app/data/exercises.json');
        } catch (e) {
            const err = document.createElement('p');
            err.textContent = '❌ Unable to load exercises.';
            container.appendChild(err);
            return;
        }
    }

    populateMenu(container);
}

/**
 * Populate the menu list (title, summary) in the current language.
 */
function populateMenu(container) {
    const loc = locales[UI_LANG];

    const menuSection = document.createElement('section');
    menuSection.className = 'menu-section';

    const h2 = document.createElement('h2');
    h2.textContent = loc.menuTitle;
    menuSection.appendChild(h2);

    const ul = document.createElement('ul');
    ul.className = 'menu-list';

    EXERCISES.forEach(ex => {
        const li = document.createElement('li');
        li.className = 'menu-item';
        li.dataset.id = ex.id;

        const title = document.createElement('h3');
        title.textContent =
            (ex.title && ex.title[UI_LANG]) ||
            ex.title?.en ||
            'Untitled';
        li.appendChild(title);

        const summary = document.createElement('p');
        summary.className = 'summary';
        summary.textContent =
            (ex.summary && ex.summary[UI_LANG]) ||
            ex.summary?.en ||
            '';
        li.appendChild(summary);

        ul.appendChild(li);
    });

    ul.addEventListener('click', ev => {
        const item = ev.target.closest('.menu-item');
        if (!item) return;
        const id = item.dataset.id;
        router.navigate(`/${UI_LANG}/exercises/${id}`);
    });

    menuSection.appendChild(ul);
    container.appendChild(menuSection);

    const detail = document.createElement('section');
    detail.id = 'detail';
    detail.className = 'detail-section hidden';
    container.appendChild(detail);
}

/**
 * Load and display a single exercise.
 */
async function renderExerciseDetail(id) {
    const ex = EXERCISES.find(e => e.id === id);
    if (!ex) {
        showNotFound();
        return;
    }

    const detail = document.getElementById('detail');
    if (!detail) {
        console.error('renderExerciseDetail: #detail missing');
        return;
    }

    // Loading indicator (pure text)
    detail.classList.remove('hidden');
    detail.textContent = '';
    const loadingH2 = document.createElement('h2');
    loadingH2.textContent = ex.title;
    const loadingP = document.createElement('p');
    loadingP.textContent = 'Loading…';
    detail.appendChild(loadingH2);
    detail.appendChild(loadingP);

    try {
        const data = await loadJSON(`/app/${ex.folder}/${ex.file}`);
        const block = data.content[UI_LANG] || data.content[FALLBACK_LANG];

        const frag = document.createDocumentFragment();

        const h2 = document.createElement('h2');
        h2.textContent = ex.title;
        frag.appendChild(h2);

        const prompt = document.createElement('p');
        prompt.textContent = block.prompt;
        frag.appendChild(prompt);

        if (block.audio) {
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = block.audio;
            frag.appendChild(audio);
        }

        const answerPre = document.createElement('pre');
        answerPre.className = 'answer';
        answerPre.textContent = block.answer;
        frag.appendChild(answerPre);

        detail.innerHTML = '';
        detail.appendChild(frag);
    } catch (e) {
        detail.innerHTML = `<h2>${ex.title}</h2><p class="error">⚠️ Failed to load exercise.</p>`;
    }
}

/**
 * Show a 404 page.
 */
function showNotFound({ search = '', hash = '' } = {}) {
    const main = document.getElementById('main');
    if (!main) {
        console.error('showNotFound: #main missing');
        return;
    }

    const attempted = `${location.pathname}${search}${hash}`;

    const h2 = document.createElement('h2');
    h2.textContent = '🚫 Not found';
    const p1 = document.createElement('p');
    p1.innerHTML = `The page <code>${attempted}</code> does not exist.`;
    const p2 = document.createElement('p');
    p2.textContent = 'Use the menu above to navigate.';

    main.innerHTML = '';
    main.appendChild(h2);
    main.appendChild(p1);
    main.appendChild(p2);
}

// -------------------- LOCALISATION --------------------
let locales = {};
async function loadLocales() {
    const promises = SUPPORTED_LANGS.map(lang =>
        loadJSON(`/app/locales/${lang}.json`)
            .catch(() => {
                console.warn(`Locale "${lang}" not found – using empty fallback.`);
                return {};
            })
            .then(data => {
                locales[lang] = data;
                // Log a preview of the loaded locale (first 3 keys)
                const previewKeys = Object.keys(data).slice(0, 3);
                console.log(`[Locale] Loaded "${lang}" – keys:`, previewKeys);
            })
    );
    await Promise.all(promises);
}

// -------------------- ROUTE HANDLERS --------------------
async function homeHandler({ lang } = {}) {
    if (!lang) {
        router.navigate(`/${UI_LANG}/`, true);
        return;
    }
    if (!SUPPORTED_LANGS.includes(lang)) {
        router.navigate(`/${FALLBACK_LANG}/`, true);
        return;
    }
    if (lang !== UI_LANG) await setLang(lang);
    await renderApp();
}
async function exercisesHandler({ lang } = {}) {
    if (lang !== UI_LANG) await setLang(lang);
    await renderApp();
}
async function exerciseDetailHandler({ lang, id } = {}) {
    if (lang !== UI_LANG) await setLang(lang);
    await renderApp();
    await renderExerciseDetail(id);
}
async function settingsHandler({ lang } = {}) {
    if (lang !== UI_LANG) await setLang(lang);
    await renderApp();

    const main = document.getElementById('main');
    if (main) {
        main.innerHTML = `<h2>⚙️ Settings (${UI_LANG})</h2><p>TODO – add preferences.</p>`;
    }
}
async function notFoundHandler({ search, hash } = {}) {
    await renderApp();
    showNotFound({ search, hash });
}

// -------------------- INITIALISE --------------------
applySavedTheme(); // early theme (also called inline in <head>)

loadLocales()
    .then(async () => {
        // 1️⃣ Pre‑load all Google‑Font stylesheets
        await preloadFonts();               // <-- new line

        // 2️⃣ Create the router and start the app (unchanged)
        window.router = new Router([
            { path: '/', handler: homeHandler },
            { path: '/:lang', handler: homeHandler },
            { path: '/:lang/exercises', handler: exercisesHandler },
            { path: '/:lang/exercises/:id', handler: exerciseDetailHandler },
            { path: '/:lang/settings', handler: settingsHandler },
        ]);
        router.setNotFound(notFoundHandler);

        await setLang(UI_LANG);             // ensure direction is correct
        router.resolve();                  // process the current URL
    })
    .catch(err => console.error('Failed to initialise app:', err));
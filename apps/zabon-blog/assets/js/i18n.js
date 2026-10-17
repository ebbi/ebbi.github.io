/**
 * apps/blog/assets/js/i18n.js
 * Milestone 11-ui-i18n — Translate the UI CHROME.
 *
 * Owns exactly one thing: the DICTIONARY of chrome strings and the mechanism
 * that renders them in the CURRENT route language.
 * - Window surface: window.BlogI18n = { t, lang, setLang, apply, onChange }.
 * - A DICTIONARY { en, fa, th, ar } keyed by STABLE string KEYS
 *   (e.g. "settings.speed", "toolbar.play", "view.backToHome").
 * - t(key, lang?): the string for lang, falling back to en, then to the KEY
 *   itself — so a MISSING translation is VISIBLE (the key shows), never blank.
 * - apply(root): walk `[data-i18n]` (textContent) and `[data-i18n-aria]`
 *   (the named attribute) and set them for the CURRENT language. The FIXED
 *   markup in index.html stays ENGLISH (the source of truth); the runtime
 *   swaps the rendered text. This is the D-11i-2 strategy.
 * - Dynamic, JS-BUILT strings (speech-settings.js) read t() at BUILD time
 *   (guarded) rather than using data-i18n.
 *
 * SCOPE: chrome ONLY (drawer, toolbars, settings popover, view labels). It
 * NEVER touches post BODIES (that is 11b-b), the extraction seam, content/**,
 * feed.json or the renderer. See D-11i-6.
 *
 * ENDONYMS are NOT translated (D-11i-3): the language options render each
 * language in its OWN script (English / فارسی / ไทย / العربية). The toolbar
 * BRAND ("Zabon Blog") IS localized (D-11i-7, human-requested): it carries a
 * `data-i18n="brand.title"` so the header brand link shows the site name in
 * the current language. The list-panel display title ("Two Legs Bad", the
 * author's series name) is a proper noun and stays as-is.
 *
 * Routing note: this module does NOT resolve routes. router.js is the single
 * source of route state; app.js calls setLang(route.lang) on every route
 * change and re-runs apply(document) AFTER the view render (D-11i-4). This
 * module is loaded in <head> AFTER lang.js (the sibling pre-controller head
 * module) and has NO parse-time side effect.
 *
 * Graceful degradation (D-11i-5): an ABSENT BlogI18n or an UNKNOWN lang
 * leaves the (English) chrome fully functional; t() falls back en -> key and
 * apply() is a no-op when the module is missing (callers guard).
 */
window.BlogI18n = (function () {
  "use strict";

  // The content languages the app actually ships (nav.js LANGS / BlogLang
  // KNOWN). en is the SOURCE + the fallback; fa/th/ar are the translations.
  const LANGS = ["en", "fa", "th", "ar"];
  const DEFAULT_LANG = "en";

  // ---- DICTIONARY (D-11i-1) --------------------------------------------
  // `en` is the SOURCE OF TRUTH: every key MUST exist here. fa/th/ar may be
  // partial; a missing key falls back to en (then to the key itself). Keys
  // are namespaced by surface: settings.* / speed.* / drawer.* / theme.* /
  // font.* / toolbar.* / view.* / menu.* / lang.*.
  const DICTIONARY = {
    en: {
      // Settings popover
      "settings.speed": "Speed",
      "settings.fine": "Fine",
      "settings.pitch": "Pitch",
      "settings.naturalPitch": "Natural pitch",
      "settings.manual": "Manual",
      "settings.voice": "Voice",
      "settings.defaultVoice": "Default voice",
      "settings.voiceUnavailable": "Voice unavailable",
      "settings.testVoice": "Test voice",
      "settings.playbackSpeedAria": "Playback speed",
      "settings.speechPitchAria": "Speech pitch (manual)",
      // Speed named steps (D-12-1)
      "speed.slower": "Slower",
      "speed.slow": "Slow",
      "speed.normal": "Normal",
      "speed.fast": "Fast",
      "speed.faster": "Faster",
      "speed.custom": "Custom",
      // Drawer
      "drawer.menu": "Menu",
      "drawer.language": "Language",
      "drawer.theme": "Theme",
      "drawer.font": "Font",
      "theme.light": "Light",
      "theme.dark": "Dark",
      "theme.auto": "Auto",
      "font.default": "Default",
      "font.traditional": "Traditional",
      "font.modern": "Modern",
      "menu.open": "Open menu",
      "menu.close": "Close menu",
      // Toolbar (transport + icon aria-labels)
      "toolbar.playback": "Playback",
      "toolbar.play": "Play",
      "toolbar.pause": "Pause",
      "toolbar.stop": "Stop",
      "toolbar.settings": "Playback settings",
      "toolbar.language": "Language",
      "toolbar.cyclingFont": "Cycle reading font",
      // Views (fixed markup + JS-built view strings)
      "view.postNotFound": "Post not found.",
      "view.backToHome": "Back to home",
      "view.noPosts": "No posts found",
      "view.tryAnotherLanguage": "Try another language.",
      "view.loadError": "Failed to load blog data.",
      // Brand (toolbar site name; toolbar link; D-11i-7)
      "brand.title": "Zabon Blog",
      // Blog display title (list panel heading; D-11i-7)
      "brand.blogTitle": "Two Legs Bad",
      // Language menu (aria-label on the listbox / button)
      "lang.aria": "Language",
    },
    fa: {
      // Settings popover
      "settings.speed": "سرعت",
      "settings.fine": "تنظیم دقیق",
      "settings.pitch": "زیر و بم صدا",
      "settings.naturalPitch": "زیر و بم طبیعی",
      "settings.manual": "دستی",
      "settings.voice": "صدا",
      "settings.defaultVoice": "صدای پیش‌فرض",
      "settings.voiceUnavailable": "صدا در دسترس نیست",
      "settings.testVoice": "آزمایش صدا",
      "settings.playbackSpeedAria": "سرعت پخش",
      "settings.speechPitchAria": "زیر و بم گفتار (دستی)",
      // Speed named steps
      "speed.slower": "کندتر",
      "speed.slow": "کند",
      "speed.normal": "معمولی",
      "speed.fast": "سریع",
      "speed.faster": "سریع‌تر",
      "speed.custom": "سفارشی",
      // Drawer
      "drawer.menu": "منو",
      "drawer.language": "زبان",
      "drawer.theme": "پوسته",
      "drawer.font": "قلم",
      "theme.light": "روشن",
      "theme.dark": "تیره",
      "theme.auto": "خودکار",
      "font.default": "پیش‌فرض",
      "font.traditional": "سنتی",
      "font.modern": "مدرن",
      "menu.open": "باز کردن منو",
      "menu.close": "بستن منو",
      // Toolbar
      "toolbar.playback": "پخش",
      "toolbar.play": "پخش",
      "toolbar.pause": "توقف موقت",
      "toolbar.stop": "ایست",
      "toolbar.settings": "تنظیمات پخش",
      "toolbar.language": "زبان",
      "toolbar.cyclingFont": "تغییر قلم خواندن",
      // Views
      "view.postNotFound": "نوشته یافت نشد.",
      "view.backToHome": "بازگشت به خانه",
      "view.noPosts": "نوشته‌ای یافت نشد",
      "view.tryAnotherLanguage": "زبان دیگری را امتحان کنید.",
      "view.loadError": "بارگذاری داده‌های وبلاگ ناموفق بود.",
      // Brand
      "brand.title": "زبان بلاگ",
      "brand.blogTitle": "دو پا بد",
      "lang.aria": "زبان",
    },
    th: {
      // Settings popover
      "settings.speed": "ความเร็ว",
      "settings.fine": "ละเอียด",
      "settings.pitch": "ระดับเสียง",
      "settings.naturalPitch": "ระดับเสียงธรรมชาติ",
      "settings.manual": "กำหนดเอง",
      "settings.voice": "เสียง",
      "settings.defaultVoice": "เสียงเริ่มต้น",
      "settings.voiceUnavailable": "ไม่มีเสียงใช้งาน",
      "settings.testVoice": "ทดสอบเสียง",
      "settings.playbackSpeedAria": "ความเร็วการเล่น",
      "settings.speechPitchAria": "ระดับเสียงพูด (กำหนดเอง)",
      // Speed named steps
      "speed.slower": "ช้าลง",
      "speed.slow": "ช้า",
      "speed.normal": "ปกติ",
      "speed.fast": "เร็ว",
      "speed.faster": "เร็วขึ้น",
      "speed.custom": "กำหนดเอง",
      // Drawer
      "drawer.menu": "เมนู",
      "drawer.language": "ภาษา",
      "drawer.theme": "ธีม",
      "drawer.font": "ฟอนต์",
      "theme.light": "สว่าง",
      "theme.dark": "มืด",
      "theme.auto": "อัตโนมัติ",
      "font.default": "ค่าเริ่มต้น",
      "font.traditional": "ดั้งเดิม",
      "font.modern": "ทันสมัย",
      "menu.open": "เปิดเมนู",
      "menu.close": "ปิดเมนู",
      // Toolbar
      "toolbar.playback": "การเล่น",
      "toolbar.play": "เล่น",
      "toolbar.pause": "หยุดชั่วคราว",
      "toolbar.stop": "หยุด",
      "toolbar.settings": "ตั้งค่าการเล่น",
      "toolbar.language": "ภาษา",
      "toolbar.cyclingFont": "สลับฟอนต์อ่าน",
      // Views
      "view.postNotFound": "ไม่พบบทความ",
      "view.backToHome": "กลับสู่หน้าแรก",
      "view.noPosts": "ไม่พบบทความ",
      "view.tryAnotherLanguage": "ลองภาษาอื่น",
      "view.loadError": "โหลดข้อมูลบล็อกไม่สำเร็จ",
      // Brand
      "brand.title": "ซาบอน บล็อก",
      "brand.blogTitle": "สองขาแย่",
      "lang.aria": "ภาษา",
    },
    ar: {
      // Settings popover
      "settings.speed": "السرعة",
      "settings.fine": "ضبط دقيق",
      "settings.pitch": "حدة الصوت",
      "settings.naturalPitch": "حدة طبيعية",
      "settings.manual": "يدوي",
      "settings.voice": "الصوت",
      "settings.defaultVoice": "الصوت الافتراضي",
      "settings.voiceUnavailable": "الصوت غير متاح",
      "settings.testVoice": "اختبار الصوت",
      "settings.playbackSpeedAria": "سرعة التشغيل",
      "settings.speechPitchAria": "حدة الكلام (يدوي)",
      // Speed named steps
      "speed.slower": "أبطأ",
      "speed.slow": "بطيء",
      "speed.normal": "عادي",
      "speed.fast": "سريع",
      "speed.faster": "أسرع",
      "speed.custom": "مخصص",
      // Drawer
      "drawer.menu": "القائمة",
      "drawer.language": "اللغة",
      "drawer.theme": "السمة",
      "drawer.font": "الخط",
      "theme.light": "فاتح",
      "theme.dark": "داكن",
      "theme.auto": "تلقائي",
      "font.default": "افتراضي",
      "font.traditional": "تقليدي",
      "font.modern": "حديث",
      "menu.open": "فتح القائمة",
      "menu.close": "إغلاق القائمة",
      // Toolbar
      "toolbar.playback": "التشغيل",
      "toolbar.play": "تشغيل",
      "toolbar.pause": "إيقاف مؤقت",
      "toolbar.stop": "إيقاف",
      "toolbar.settings": "إعدادات التشغيل",
      "toolbar.language": "اللغة",
      "toolbar.cyclingFont": "تبديل خط القراءة",
      // Views
      "view.postNotFound": "لم يتم العثور على المقال.",
      "view.backToHome": "العودة إلى الرئيسية",
      "view.noPosts": "لا توجد مقالات",
      "view.tryAnotherLanguage": "جرّب لغة أخرى.",
      "view.loadError": "فشل تحميل بيانات المدونة.",
      // Brand
      "brand.title": "زبان بلوق",
      "brand.blogTitle": "سيئتان",
      "lang.aria": "اللغة",
    },
  };

  // The attribute names apply() walks. The `data-i18n-aria` value names the
  // attribute to set (e.g. `data-i18n-aria="aria-label"`); bare `data-i18n`
  // sets textContent.
  const TEXT_ATTR = "data-i18n";
  const ARIA_ATTR = "data-i18n-aria";

  // The current render language. Starts at the source language; app.js sets
  // it on every route change (D-11i-4).
  let currentLang = DEFAULT_LANG;

  // Listeners fired on setLang (for JS-built strings that must re-render).
  const listeners = [];

  /** @returns {boolean} true when `code` is a language we ship. */
  function known(code) {
    return LANGS.indexOf(code) !== -1;
  }

  /**
   * Resolve a string by key for a language.
   * Fallback chain (D-11i-1): lang -> en -> the KEY ITSELF (never blank).
   * @param {string} key
   * @param {string} [lang] target language; defaults to the current one
   * @returns {string}
   */
  function t(key, lang) {
    if (typeof key !== "string" || !key) return "";
    const useLang = known(lang) ? lang : currentLang;
    const table = DICTIONARY[useLang] || DICTIONARY[DEFAULT_LANG];
    let value = table ? table[key] : undefined;
    if (typeof value !== "string") {
      // Fall back to the EN source before exposing the raw key.
      value = DICTIONARY[DEFAULT_LANG][key];
    }
    return typeof value === "string" ? value : key;
  }

  /**
   * Apply the CURRENT language (or an explicit one) to every i18n-marked node
   * under `root`. Walks `[data-i18n]` (textContent) and `[data-i18n-aria]`
   * (the attribute it names). Static English markup is the source of truth;
   * this swaps the RENDERED values. Missing keys render their key (visible).
   * @param {Document|Element} [root] defaults to the document
   * @param {string} [lang] target language; defaults to the current one
   */
  function apply(root, lang) {
    const scope = root || (typeof document !== "undefined" ? document : null);
    if (!scope || typeof scope.querySelectorAll !== "function") return;
    const useLang = known(lang) ? lang : currentLang;

    const textNodes = scope.querySelectorAll("[" + TEXT_ATTR + "]");
    Array.prototype.forEach.call(textNodes, function (el) {
      const key = el.getAttribute(TEXT_ATTR);
      if (!key) return;
      el.textContent = t(key, useLang);
    });

    const ariaNodes = scope.querySelectorAll("[" + ARIA_ATTR + "]");
    Array.prototype.forEach.call(ariaNodes, function (el) {
      const attr = el.getAttribute(ARIA_ATTR);
      const key = el.getAttribute(TEXT_ATTR + "-key");
      // Convention: data-i18n-aria names the ATTRIBUTE; the KEY is supplied
      // by data-i18n-key (e.g. data-i18n-aria="aria-label"
      // data-i18n-key="menu.open"). This keeps the attribute name and the
      // string key independent (two facts, two attributes).
      const lookup = key || el.getAttribute("data-i18n-aria-key");
      if (!attr || !lookup) return;
      el.setAttribute(attr, t(lookup, useLang));
    });
  }

  /**
   * Set the CURRENT language and re-apply to the document. Fire onChange
   * listeners so JS-built strings (voice/rate option labels) re-render in the
   * new language. A no-op-equivalent for an unknown code (falls back to the
   * default in t()/apply()), so the app is always fully functional (D-11i-5).
   * @param {string} code
   * @returns {string} the language actually in effect
   */
  function setLang(code) {
    currentLang = known(code) ? code : DEFAULT_LANG;
    for (let i = 0; i < listeners.length; i += 1) {
      try {
        listeners[i](currentLang);
      } catch (err) {
        /* a listener must never break the module */
      }
    }
    return currentLang;
  }

  /**
   * Register a callback fired on every setLang with the new language. Fired
   * immediately with the current language so a late registrant starts in sync.
   * Idempotent per callback.
   * @param {(lang:string)=>void} cb
   */
  function onChange(cb) {
    if (typeof cb === "function" && listeners.indexOf(cb) === -1) {
      listeners.push(cb);
      try {
        cb(currentLang);
      } catch (err) {
        /* a listener must never break the module */
      }
    }
  }

  return {
    t: t,
    // `lang` is a live getter so callers read the CURRENT language.
    get lang() {
      return currentLang;
    },
    setLang: setLang,
    apply: apply,
    onChange: onChange,
    // Exposed for tests / inspection (read-only usage).
    _dictionary: DICTIONARY,
    _langs: LANGS,
  };
})();

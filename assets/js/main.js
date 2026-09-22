/* =========================================================
   Zabon — Toolbar, language, and theme logic
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Translations ---------- */
  const I18N = {
    en: {
      appName: "Zabon",
      settings: "Settings",
      language: "Language",
      appearance: "Appearance",
      day: "Day",
      night: "Night",
      auto: "Auto",
      appZabon: "Zabon",
      appZabonDesc:
        "Language agnostic App to learn Arabic, English, Spanish, Persian, Japanese, Thai, Chinese",
      appThai: "Zabon Thai",
      appThaiDesc: "Learn Thai (with English and Persian)",
      appBlog: "Blog",
      appBlogDesc: "Coming soon",
    },
    fa: {
      appName: "زبان",
      settings: "تنظیمات",
      language: "زبان",
      appearance: "ظاهر",
      day: "روز",
      night: "شب",
      auto: "خودکار",
      appZabon: "زبان",
      appZabonDesc:
        "اپلیکیشن مستقل از زبان برای یادگیری عربی، انگلیسی، اسپانیایی، فارسی، ژاپنی، تایلندی و چینی",
      appThai: "زبان تایلندی",
      appThaiDesc: "یادگیری زبان تایلندی (با انگلیسی و فارسی)",
      appBlog: "وبلاگ",
      appBlogDesc: "به زودی",
    },
    th: {
      appName: "ซาบอน",
      settings: "การตั้งค่า",
      language: "ภาษา",
      appearance: "รูปลักษณ์",
      day: "กลางวัน",
      night: "กลางคืน",
      auto: "อัตโนมัติ",
      appZabon: "ซาบอน",
      appZabonDesc:
        "แอปที่ไม่ขึ้นกับภาษา สำหรับเรียนภาษาอาหรับ อังกฤษ สเปน เปอร์เซีย ญี่ปุ่น ไทย และจีน",
      appThai: "ซาบอนไทย",
      appThaiDesc: "เรียนภาษาไทย (พร้อมอังกฤษและเปอร์เซีย)",
      appBlog: "บล็อก",
      appBlogDesc: "เร็ว ๆ นี้",
    },
    ar: {
      appName: "زابون",
      settings: "الإعدادات",
      language: "اللغة",
      appearance: "المظهر",
      day: "نهار",
      night: "ليل",
      auto: "تلقائي",
      appZabon: "زابون",
      appZabonDesc:
        "تطبيق مستقل عن اللغة لتعلم العربية والإنجليزية والإسبانية والفارسية واليابانية والتايلاندية والصينية",
      appThai: "زابون التايلاندي",
      appThaiDesc: "تعلم التايلاندية (مع الإنجليزية والفارسية)",
      appBlog: "المدونة",
      appBlogDesc: "قريباً",
    },
    my: {
      appName: "ဇာဘွန်",
      settings: "ဆက်တင်များ",
      language: "ဘာသာစကား",
      appearance: "အသွင်အပြင်",
      day: "နေ့",
      night: "ည",
      auto: "အလိုအလျောက်",
      appZabon: "ဇာဘွန်",
      appZabonDesc:
        "ဘာသာစကားမရွေး အသုံးပြုနိုင်သော အာရဗီ၊ အင်္ဂလိပ်၊ စပိန်၊ ပါရှန်၊ ဂျပန်၊ ထိုင်း နှင့် တရုတ် သင်ယူရန် အက်ပ်",
      appThai: "ဇာဘွန် ထိုင်း",
      appThaiDesc: "ထိုင်းဘာသာ သင်ယူရန် (အင်္ဂလိပ် နှင့် ပါရှန် အပါအဝင်)",
      appBlog: "ဘလော့ဂ်",
      appBlogDesc: "မကြာမီ လာမည်",
    },
    es: {
      appName: "Zabon",
      settings: "Ajustes",
      language: "Idioma",
      appearance: "Apariencia",
      day: "Día",
      night: "Noche",
      auto: "Automático",
      appZabon: "Zabon",
      appZabonDesc:
        "Aplicación independiente del idioma para aprender árabe, inglés, español, persa, japonés, tailandés y chino",
      appThai: "Zabon Tailandés",
      appThaiDesc: "Aprender tailandés (con inglés y persa)",
      appBlog: "Blog",
      appBlogDesc: "Próximamente",
    },
    ja: {
      appName: "ザボン",
      settings: "設定",
      language: "言語",
      appearance: "外観",
      day: "昼",
      night: "夜",
      auto: "自動",
      appZabon: "ザボン",
      appZabonDesc:
        "言語に依存しないアプリ — アラビア語、英語、スペイン語、ペルシア語、日本語、タイ語、中国語を学ぶ",
      appThai: "ザボン タイ語",
      appThaiDesc: "タイ語を学ぶ（英語とペルシア語付き）",
      appBlog: "ブログ",
      appBlogDesc: "近日公開",
    },
    zh: {
      appName: "Zabon",
      settings: "设置",
      language: "语言",
      appearance: "外观",
      day: "日间",
      night: "夜间",
      auto: "自动",
      appZabon: "Zabon",
      appZabonDesc:
        "语言无关的应用，用于学习阿拉伯语、英语、西班牙语、波斯语、日语、泰语和中文",
      appThai: "Zabon 泰语",
      appThaiDesc: "学习泰语（附英语和波斯语）",
      appBlog: "博客",
      appBlogDesc: "即将推出",
    },
  };

  const RTL_LANGS = ["fa", "ar"];
  const LANG_LABELS = {
    en: "English",
    fa: "فارسی",
    th: "ไทย",
    ar: "العربية",
    my: "မြန်မာ",
    es: "Español",
    ja: "日本語",
    zh: "中文",
  };
  const SUPPORTED_LANGS = ["en", "fa", "th", "ar", "my", "es", "ja", "zh"];

  function detectBrowserLanguage() {
    const candidates = [];
    if (Array.isArray(navigator.languages))
      candidates.push(...navigator.languages);
    if (navigator.language) candidates.push(navigator.language);
    if (navigator.userLanguage) candidates.push(navigator.userLanguage);

    for (const tag of candidates) {
      if (!tag) continue;
      const base = String(tag).toLowerCase().split("-")[0];
      if (SUPPORTED_LANGS.includes(base)) return base;
    }
    return "en";
  }

  function initialLanguage() {
    const saved = localStorage.getItem("zabon.lang");
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    return detectBrowserLanguage();
  }
  /* ---------- Element references ---------- */
  const html = document.documentElement;
  const menuToggle = document.getElementById("menuToggle");
  const panel = document.getElementById("sidePanel");
  const panelClose = document.getElementById("panelClose");
  const panelBackdrop = document.getElementById("panelBackdrop");
  const langToggle = document.getElementById("langToggle");
  const langList = document.getElementById("langList");
  const currentLang = document.getElementById("currentLangLabel");
  const langOptions = document.querySelectorAll(".lang-option");
  const themeOptions = document.querySelectorAll(".theme-option");
  const i18nNodes = document.querySelectorAll("[data-i18n]");

  /* ---------- Persistence helpers ---------- */
  const store = {
    get: (k, fallback) => {
      try {
        return localStorage.getItem(k) || fallback;
      } catch {
        return fallback;
      }
    },
    set: (k, v) => {
      try {
        localStorage.setItem(k, v);
      } catch {
        /* ignore */
      }
    },
  };

  /* ---------- Panel open/close ---------- */
  function openPanel() {
    panel.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }
  function closePanel() {
    panel.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
    collapseLang();
  }

  menuToggle.addEventListener("click", () => {
    panel.getAttribute("aria-hidden") === "true" ? openPanel() : closePanel();
  });
  panelClose.addEventListener("click", closePanel);
  panelBackdrop.addEventListener("click", closePanel);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.getAttribute("aria-hidden") === "false")
      closePanel();
  });

  /* ---------- Language sub-panel ---------- */
  function expandLang() {
    langList.hidden = false;
    langToggle.setAttribute("aria-expanded", "true");
  }
  function collapseLang() {
    langList.hidden = true;
    langToggle.setAttribute("aria-expanded", "false");
  }
  langToggle.addEventListener("click", () => {
    langList.hidden ? expandLang() : collapseLang();
  });

  /* ---------- Apply language ---------- */
  function applyLanguage(lang) {
    const dict = I18N[lang] || I18N.en;

    i18nNodes.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    html.setAttribute("lang", lang);
    html.setAttribute("dir", RTL_LANGS.includes(lang) ? "rtl" : "ltr");
    currentLang.textContent = LANG_LABELS[lang] || lang;

    langOptions.forEach((btn) => {
      btn.setAttribute(
        "aria-current",
        btn.dataset.lang === lang ? "true" : "false",
      );
    });

    store.set("zabon.lang", lang);
  }

  langOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLanguage(btn.dataset.lang);
      collapseLang();
    });
  });

  /* ---------- Theme handling ---------- */
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function resolvedTheme(mode) {
    if (mode === "auto") return media.matches ? "night" : "day";
    return mode;
  }

  function applyTheme(mode) {
    const resolved = resolvedTheme(mode);
    html.setAttribute("data-theme", resolved);
    html.setAttribute("data-theme-mode", mode);

    themeOptions.forEach((btn) => {
      btn.setAttribute(
        "aria-checked",
        btn.dataset.theme === mode ? "true" : "false",
      );
    });

    store.set("zabon.theme", mode);
  }

  themeOptions.forEach((btn) => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
  });

  /* React to OS theme changes while in auto mode */
  media.addEventListener("change", () => {
    if (html.getAttribute("data-theme-mode") === "auto") applyTheme("auto");
  });

  /* ---------- Initialise from saved preferences ---------- */
  applyLanguage(initialLanguage());
  applyTheme(store.get("zabon.theme", "auto"));
})();

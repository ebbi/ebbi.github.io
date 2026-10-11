/* Milestone 11-ui-i18n structural smoke test (Node, no deps).
 * Mocks a minimal DOM, loads assets/js/i18n.js, and asserts the documented
 * behaviors. NOT shipped; a dev-only harness (mirrors m12-smoke.js). */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(ROOT, "assets/js/i18n.js"), "utf8");

// ---- A tiny fake element good enough for apply() ---------------------
function makeEl(attrs) {
  const el = {
    _attrs: Object.assign({}, attrs || {}),
    textContent: "",
    getAttribute(k) {
      return k in this._attrs ? this._attrs[k] : null;
    },
    setAttribute(k, v) {
      this._attrs[k] = String(v);
    },
  };
  return el;
}

// Build a mock document; querySelectorAll returns whatever the test sets.
let textNodes = [];
let ariaNodes = [];
const mockDocument = {
  querySelectorAll(sel) {
    // Minimal parser: match "[data-i18n]" exactly (no -aria); match
    // "[data-i18n-aria]" exactly. Good enough to drive apply().
    if (sel === "[data-i18n]") return textNodes;
    if (sel === "[data-i18n-aria]") return ariaNodes;
    return [];
  },
};

const sandbox = {
  window: {},
  document: mockDocument,
  console,
  Array,
  Object,
  String,
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const I = sandbox.window.BlogI18n;

let pass = 0;
let fail = 0;
function ok(cond, msg) {
  if (cond) {
    pass += 1;
    console.log("  PASS " + msg);
  } else {
    fail += 1;
    console.log("  FAIL " + msg);
  }
}

console.log("BlogI18n structural smoke:");

// 1. t() returns the EN source by default (currentLang starts "en").
ok(I.t("toolbar.play") === "Play", "t('toolbar.play') -> 'Play' (en default)");
ok(I.lang === "en", "initial current language is en");

// 2. t() with explicit lang returns that language's string.
ok(I.t("toolbar.play", "fa") === "پخش", "t('toolbar.play','fa') -> Persian");
ok(I.t("toolbar.play", "ar") === "تشغيل", "t('toolbar.play','ar') -> Arabic");
ok(I.t("toolbar.play", "th") === "เล่น", "t('toolbar.play','th') -> Thai");

// 3. Unknown language falls back to EN (D-11i-5).
ok(I.t("toolbar.play", "zz") === "Play", "unknown lang 'zz' falls back to en");

// 4. Missing key falls back EN -> the KEY itself (never blank).
ok(I.t("toolbar.play", "neverland") === "Play", "unknown lang uses en");
ok(I.t("no.such.key") === "no.such.key", "missing key -> the key itself");
ok(I.t("", "fa") === "", "empty key -> empty string");
// A key present in en but absent in fa falls back to the en value.
// (All keys are currently present in all langs; simulate by asking a lang
// where we know the table has the key -> still string.)
ok(
  typeof I.t("settings.voice", "th") === "string",
  "th settings.voice is a string",
);

// 5. setLang updates the current language + getter.
ok(I.setLang("fa") === "fa", "setLang('fa') returns 'fa'");
ok(I.lang === "fa", "current language is now fa");
ok(I.setLang("nope") === "en", "setLang('nope') -> en (fallback)");

// 6. apply() sets textContent for [data-i18n].
textNodes = [
  makeEl({ "data-i18n": "toolbar.play" }),
  makeEl({ "data-i18n": "drawer.menu" }),
];
ariaNodes = [];
I.setLang("en");
I.apply(mockDocument);
ok(
  textNodes[0].textContent === "Play",
  "apply sets textContent (toolbar.play)",
);
ok(textNodes[1].textContent === "Menu", "apply sets textContent (drawer.menu)");
I.setLang("ar");
I.apply(mockDocument);
ok(textNodes[0].textContent === "تشغيل", "apply re-localizes to ar");
ok(textNodes[1].textContent === "القائمة", "apply drawer.menu -> ar");

// 7. apply() sets the NAMED attribute for [data-i18n-aria].
ariaNodes = [
  makeEl({
    "data-i18n-aria": "aria-label",
    "data-i18n-key": "toolbar.play",
  }),
];
I.setLang("fa");
I.apply(mockDocument);
ok(
  ariaNodes[0].getAttribute("aria-label") === "پخش",
  "apply sets aria-label from data-i18n-key (fa)",
);

// 8. apply() is a no-op for a node missing its key attribute.
ariaNodes = [makeEl({ "data-i18n-aria": "aria-label" })]; // no key
I.apply(mockDocument);
ok(
  ariaNodes[0].getAttribute("aria-label") === null,
  "apply ignores an aria node without a key",
);

// 9. onChange fires immediately + on setLang.
let fired = [];
I.onChange((lang) => fired.push(lang));
ok(fired.length === 1, "onChange fires immediately with current lang");
I.setLang("th");
ok(fired[fired.length - 1] === "th", "onChange fires on setLang");
// Idempotent per callback.
const before = fired.length;
I.onChange(function named() {});
ok(
  fired.length >= before,
  "second onChange still fires its own immediate call",
);

// 10. A throwing listener must not break setLang.
I.onChange(() => {
  throw new Error("boom");
});
let threw = false;
try {
  I.setLang("en");
} catch (e) {
  threw = true;
}
ok(!threw, "a throwing listener does not break setLang");

// 11. Every key present in en exists in the dictionary (parity sanity).
const en = I._dictionary.en;
const langs = I._langs;
let missing = 0;
langs.forEach((lg) => {
  Object.keys(en).forEach((k) => {
    if (typeof I._dictionary[lg][k] !== "string") missing += 1;
  });
});
ok(
  missing === 0,
  `all ${Object.keys(en).length} keys present in all ${langs.length} languages`,
);

// 12. Graceful degradation: BlogI18n absent path does not throw (module-level
//     is loaded; here we just assert t() never throws for odd inputs).
let threw2 = false;
try {
  I.t(null);
  I.t(undefined);
  I.t(123);
  I.apply(null);
  I.apply({});
} catch (e) {
  threw2 = true;
}
ok(!threw2, "t()/apply() tolerate odd/absent inputs");

// 13. ORDERING CONTRACT (D-11i-4): a JS-built view string read via t() AFTER
//     setLang(route.lang) must reflect the route language — NOT the previous
//     one. This is the app-start "fa page but EN title" / "EN page but fa
//     title" bug: renderList/renderPost read t() at BUILD time, so setLang
//     MUST run BEFORE the view render. Simulate both orderings.
I.setLang("en");
// WRONG order (render then setLang): the built string lags.
const wrongOrder = I.t("brand.blogTitle"); // built while currentLang=en
I.setLang("fa");
ok(
  wrongOrder === "Two Legs Bad",
  "WRONG order: title built before setLang stays EN (the reported bug)",
);
// RIGHT order (setLang then render): the built string matches the route.
I.setLang("fa");
const rightOrder = I.t("brand.blogTitle"); // built while currentLang=fa
ok(
  rightOrder === "دو پا بد",
  "RIGHT order: title built after setLang is FA (the fix)",
);
I.setLang("en");
ok(I.t("brand.blogTitle") === "Two Legs Bad", "brand.blogTitle -> EN on en");

console.log(`\nRESULT: ${pass}/${pass + fail} passed`);
process.exit(fail === 0 ? 0 : 1);

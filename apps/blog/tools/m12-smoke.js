/* Milestone 12 structural smoke test (Node, no deps).
 * Mocks a minimal DOM + Web Speech API, loads speech-settings.js, and
 * asserts the documented behaviors. NOT shipped; a dev-only harness. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const src = fs.readFileSync(
  path.join(ROOT, "assets/js/speech-settings.js"),
  "utf8",
);

// ---- Mock voices ----
const VOICES = [
  {
    name: "Google US English",
    lang: "en-US",
    localService: false,
    default: true,
    voiceURI: "en-us-google",
  },
  {
    name: "English (US) local",
    lang: "en-US",
    localService: true,
    default: false,
    voiceURI: "en-us-local",
  },
  {
    name: "Microsoft David",
    lang: "en-GB",
    localService: true,
    default: false,
    voiceURI: "en-gb-ms",
  },
  {
    name: "English",
    lang: "en",
    localService: true,
    default: false,
    voiceURI: "en-bare",
  },
  {
    name: "Persian Natural",
    lang: "fa-IR",
    localService: false,
    default: false,
    voiceURI: "fa-natural",
  },
  {
    name: "Persian local",
    lang: "fa-IR",
    localService: true,
    default: false,
    voiceURI: "fa-local",
  },
];

let voicesChangedHandler = null;
const spoken = [];

function makeElement(id) {
  return {
    id,
    _attrs: {},
    _value: "",
    _options: [],
    value: "",
    disabled: false,
    innerHTML: "",
    textContent: "",
    contains() {
      return false;
    },
    appendChild(child) {
      this._options.push(child);
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    addEventListener() {},
    removeAttribute(k) {
      delete this._attrs[k];
    },
    setAttribute(k, v) {
      this._attrs[k] = String(v);
    },
    getAttribute(k) {
      return k in this._attrs ? this._attrs[k] : null;
    },
    focus() {},
    classList: { add() {}, remove() {} },
  };
}

const elements = {};
function getEl(id) {
  if (!elements[id]) elements[id] = makeElement(id);
  return elements[id];
}
// Pre-create the controls so init() resolves them.
[
  "tts-settings-btn",
  "tts-settings",
  "tts-rate-select",
  "tts-rate-range",
  "tts-pitch-mode",
  "tts-pitch-range",
  "tts-voice-select",
  "tts-test-btn",
  "tts-lang-btn",
  "tts-lang-menu",
  "tts-font-btn",
].forEach(getEl);

const storage = {};
const sandbox = {
  window: {},
  document: {
    getElementById: (id) => elements[id] || null,
    querySelectorAll: () => [],
    createElement: (tag) => makeElement(tag),
    addEventListener: () => {},
  },
  localStorage: {
    getItem: (k) => (k in storage ? storage[k] : null),
    setItem: (k, v) => {
      storage[k] = String(v);
    },
    removeItem: (k) => {
      delete storage[k];
    },
  },
  console,
  isFinite,
  parseFloat,
  JSON,
  Array,
  Object,
  String,
  Math,
};
sandbox.window = sandbox;
sandbox.window.speechSynthesis = {
  getVoices: () => VOICES.slice(),
  addEventListener: (evt, cb) => {
    if (evt === "voiceschanged") voicesChangedHandler = cb;
  },
  cancel: () => {},
  speak: (u) => spoken.push(u),
  paused: false,
};
sandbox.window.SpeechSynthesisUtterance = function (text) {
  this.text = text;
};
sandbox.SpeechSynthesisUtterance = sandbox.window.SpeechSynthesisUtterance;
sandbox.window.localStorage = sandbox.localStorage;

vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const S = sandbox.window.BlogSpeech;

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

console.log("BlogSpeech structural smoke:");

S.init();

// 1. Voice ranking: fa -> the top-ranked must be the LOCAL Persian (local
//    beats remote; both have the same name markers).
const fa = S.voicesFor("fa");
ok(fa.length === 2, "voicesFor(fa) returns 2 voices");
ok(
  fa[0].voiceURI === "fa-local",
  "top fa voice = local Persian (localService preferred)",
);

// 2. en ranking: a LOCAL voice beats the remote Google voice (the meaningful
//    contract); among the locals the curated name marker breaks the tie.
const en = S.voicesFor("en");
ok(en.length === 4, "voicesFor(en) returns 4 voices");
ok(
  en[0].localService === true,
  "top en voice is local (localService preferred)",
);
ok(
  en[en.length - 1].voiceURI === "en-us-google",
  "remote Google voice ranks LAST for en",
);

// 3. topVoiceFor
ok(S.topVoiceFor("fa").voiceURI === "fa-local", "topVoiceFor(fa) = fa-local");
ok(S.topVoiceFor("zz") === null, "topVoiceFor(zz) = null (no match)");

// 4. Rate: named steps map to values; getRate reflects.
S.setRate(1.6);
ok(S.getRate() === 1.6, "setRate(1.6) -> getRate 1.6");
S.setRate(99);
ok(S.getRate() === 2.0, "setRate clamps to max 2.0");
S.setRate(0.1);
ok(S.getRate() === 0.5, "setRate clamps to min 0.5");

// 5. Pitch auto curve: pitch rises slightly above 1 at high rate.
S.setPitchMode("auto");
S.setRate(2.0);
const pAutoHigh = S.effectivePitch(S.getRate());
ok(pAutoHigh > 1.0 && pAutoHigh <= 1.5, "auto pitch > 1 at high rate, clamped");
S.setRate(1.0);
ok(Math.abs(S.effectivePitch(1.0) - 1.0) < 1e-9, "auto pitch = 1 at rate 1.0");

// 6. Manual pitch: verbatim.
S.setPitchMode("manual");
S.setPitch(1.3);
ok(S.effectivePitch(2.0) === 1.3, "manual pitch verbatim (ignores rate)");
S.setPitch(5);
ok(S.getPitch() === 1.5, "manual pitch clamps to max 1.5");

// 7. Per-language voice memory.
S.setVoice("fa", "fa-natural");
ok(S.getVoice("fa") === "fa-natural", "remember voice for fa");
ok(S.getVoice("en") === null, "no voice remembered for en");
S.setVoice("fa", "");
ok(S.getVoice("fa") === null, "clearing fa voice falls back");

// 8. Persistence across re-load (fresh module instance, same storage).
ok(storage["zabon-blog-tts-rate"] === "1", "rate persisted to storage");
ok(storage["zabon-blog-tts-pitch"] === "1.5", "pitch persisted");

// 9. Async voiceschanged repopulation fires listeners.
let fired = 0;
S.onVoicesChanged(() => {
  fired += 1;
});
ok(fired === 1, "onVoicesChanged fires immediately with current list");
if (voicesChangedHandler) {
  voicesChangedHandler();
  ok(fired === 2, "voiceschanged event fires listeners");
} else {
  ok(false, "voiceschanged handler registered");
}

// 10. setLang updates the lang button mirror.
S.setLang("fa");
ok(
  getEl("tts-lang-btn").getAttribute("data-lang") === "fa",
  "setLang mirrors data-lang on the language button",
);

// 11. Graceful degradation: no speechSynthesis -> inert, no throw.
const sandbox2 = Object.assign({}, sandbox);
const src2 = src;
const ctx2 = {
  window: {},
  document: {
    getElementById: () => null,
    querySelectorAll: () => [],
    createElement: () => makeElement("x"),
    addEventListener: () => {},
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  },
  console,
  isFinite,
  parseFloat,
  JSON,
  Array,
  Object,
  String,
  Math,
};
ctx2.window = ctx2;
ctx2.window.localStorage = ctx2.localStorage;
vm.createContext(ctx2);
let threw = false;
try {
  vm.runInContext(src2, ctx2);
  ctx2.window.BlogSpeech.init();
  ctx2.window.BlogSpeech.getRate();
  ctx2.window.BlogSpeech.topVoiceFor("en");
} catch (err) {
  threw = true;
}
ok(!threw, "graceful no-API path does not throw");
ok(ctx2.window.BlogSpeech.getRate() === 1.0, "no-API getRate defaults to 1.0");
void sandbox2;

console.log(`\nRESULT: ${pass}/${pass + fail} passed`);
process.exit(fail === 0 ? 0 : 1);

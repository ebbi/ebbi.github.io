/**
 * apps/blog/assets/js/speech-settings.js
 * Milestone 12 — TTS player settings (speed, pitch, voice) +
 * on-toolbar Language & Font icons.
 *
 * Owns exactly one thing: the READER'S SPEECH PREFERENCES and the
 * toolbar controls that set them. It does NOT own playback: tts.js still
 * owns the speechSynthesis lifecycle and READS its settings from here when
 * it builds an utterance (D-12-6). There is NO route awareness inside this
 * module — app.js passes the CURRENT route language in (setLang) so the
 * voice list can be filtered + ranked for it.
 *
 * Window surface: window.BlogSpeech = { init, getRate, setRate, getPitch,
 * setPitch, getPitchMode, setPitchMode, effectivePitch, voicesFor,
 * topVoiceFor, getVoice, setVoice, onVoicesChanged, setLang }.
 *
 * Storage (ONE localStorage key per preference; theme.js/font.js pattern):
 *   "zabon-blog-tts-rate"       number (0.5..2.0)
 *   "zabon-blog-tts-pitch"      number (0.5..1.5) — the MANUAL pitch
 *   "zabon-blog-tts-pitch-mode" "auto" | "manual"
 *   "zabon-blog-tts-voice"      JSON map lang -> voiceURI
 * A storage failure (private mode) degrades gracefully: the value applies for
 * the session but simply is not persisted (font.js pattern).
 *
 * Speed (D-12-1): `utterance.rate`. Five NAMED steps (Slower 0.6 / Slow 0.8 /
 * Normal 1.0 / Fast 1.25 / Faster 1.6) AND a continuous slider 0.5..2.0. The
 * slider snaps to the nearest named step within a small epsilon; otherwise it
 * is a CUSTOM rate. The 0.5..2.0 range is chosen because `rate` beyond ~2 is
 * unintelligible across engines (documented).
 *
 * Pitch (D-12-2): `utterance.pitch` in 0.5..1.5. TWO modes:
 *   "auto" (DEFAULT)  — the DOCUMENTED "natural pitch" heuristic: a SMALL
 *                        upward compensation at the extreme rates, because
 *                        engines tend to sound dull/compressed at high rate
 *                        and sluggish at low rate. This is a CURVE, NOT a
 *                        claim of engine-quality improvement.
 *   "manual"          — the reader's pitch slider value, verbatim.
 *
 * Voice (D-12-3): voices come from `speechSynthesis.getVoices()` FILTERED by
 * the current route language's BCP-47 PREFIX (en/fa/ar/th/...). They are
 * RANKED by a DOCUMENTED heuristic (see rankVoices): localService preferred;
 * then a curated NAME allow-list ("Natural"/"Neural"/"Online"/"Google"/
 * "Microsoft"); then the default flag; then regional specificity; then stable
 * order. The top-ranked voice AUTO-selects; the reader may override; the
 * choice is remembered PER LANGUAGE. The voice list is ASYNC in many engines
 * (empty until `voiceschanged` fires), so init() waits for it.
 *
 * Graceful degradation (D-12-7): if speechSynthesis/getVoices are
 * unavailable the new controls are inert/disabled and the app is unaffected.
 * Every read tts.js makes of BlogSpeech is GUARDED, so tts.js alone behaves
 * byte-identically when BlogSpeech is absent.
 *
 * Idempotent: init() is safe to call more than once (a second call is a
 * no-op).
 */
window.BlogSpeech = (function () {
  "use strict";

  const RATE_KEY = "zabon-blog-tts-rate";
  const PITCH_KEY = "zabon-blog-tts-pitch";
  const PITCH_MODE_KEY = "zabon-blog-tts-pitch-mode";
  const VOICE_KEY = "zabon-blog-tts-voice";

  // Named speed steps (D-12-1). `value` is the utterance.rate.
  const RATE_STEPS = [
    { key: "slower", label: "Slower", value: 0.6 },
    { key: "slow", label: "Slow", value: 0.8 },
    { key: "normal", label: "Normal", value: 1.0 },
    { key: "fast", label: "Fast", value: 1.25 },
    { key: "faster", label: "Faster", value: 1.6 },
  ];
  const RATE_MIN = 0.5;
  const RATE_MAX = 2.0;
  const RATE_DEFAULT = 1.0;
  // Slider snaps to a named step when within this epsilon of it.
  const RATE_EPSILON = 0.02;

  const PITCH_MIN = 0.5;
  const PITCH_MAX = 1.5;
  const PITCH_DEFAULT = 1.0;
  // Natural-pitch AUTO curve gain: pitch = 1 + GAIN * (rate - 1), clamped.
  // A SMALL upward-ish compensation at the extremes; documented, not a claim.
  const NATURAL_PITCH_GAIN = 0.12;

  // Curated voice-name markers (D-12-3), highest first. Matched
  // case-insensitively as substrings of the voice `name`.
  const NAME_MARKERS = ["natural", "neural", "online", "google", "microsoft"];

  // --- module state ---
  let initialized = false;
  let currentLang = "en";
  let rate = RATE_DEFAULT;
  let pitch = PITCH_DEFAULT;
  let pitchMode = "auto";
  let voicesByLang = {}; // lang -> voiceURI (the remembered choices)

  let settingsBtn = null;
  let settingsPopover = null;
  let rateSelect = null;
  let rateRange = null;
  let pitchModeInput = null;
  let pitchRange = null;
  let voiceSelect = null;
  let testBtn = null;
  let langBtn = null;
  let langMenu = null;
  let fontBtn = null;

  const voicesChangedListeners = [];

  // ---------------------------------------------------------------
  // Small utilities
  // ---------------------------------------------------------------

  /** @returns {boolean} true when the Web Speech API is usable here. */
  function supported() {
    return (
      typeof window.speechSynthesis !== "undefined" &&
      typeof window.speechSynthesis.getVoices === "function"
    );
  }

  /**
   * Read the raw voice list, guarding every failure to [].
   * @returns {SpeechSynthesisVoice[]}
   */
  function rawVoices() {
    if (!supported()) return [];
    try {
      const list = window.speechSynthesis.getVoices();
      return Array.isArray(list) ? list : [];
    } catch (err) {
      return [];
    }
  }

  /** Clamp n into [lo, hi]. */
  function clamp(n, lo, hi) {
    if (!isFinite(n)) return lo;
    return Math.max(lo, Math.min(hi, n));
  }

  /** Read a localStorage key, returning null on any failure. */
  function readStore(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  /** Write a localStorage key; a failure is non-fatal (session-only apply). */
  function writeStore(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
      /* non-fatal: the value still applies for this session */
    }
  }

  // ---------------------------------------------------------------
  // Rate (D-12-1)
  // ---------------------------------------------------------------

  /** @returns {number} the persisted effective rate (0.5..2.0). */
  function readRate() {
    const stored = parseFloat(readStore(RATE_KEY));
    if (isFinite(stored)) return clamp(stored, RATE_MIN, RATE_MAX);
    return RATE_DEFAULT;
  }

  /** @returns {number} the resolved effective rate. */
  function getRate() {
    return rate;
  }

  /**
   * The nearest named step to `value`, or null when `value` is not within
   * RATE_EPSILON of any named step (a custom rate).
   * @param {number} value
   * @returns {string|null} the step value as a string, or null
   */
  function nearestStepValue(value) {
    let best = null;
    let bestDist = Infinity;
    for (let i = 0; i < RATE_STEPS.length; i += 1) {
      const d = Math.abs(RATE_STEPS[i].value - value);
      if (d < bestDist) {
        bestDist = d;
        best = RATE_STEPS[i].value;
      }
    }
    return bestDist <= RATE_EPSILON ? String(best) : null;
  }

  /** Persist + apply a rate; mirror it onto both controls. */
  function setRate(value) {
    rate = clamp(value, RATE_MIN, RATE_MAX);
    writeStore(RATE_KEY, String(rate));
    mirrorRate();
  }

  // ---------------------------------------------------------------
  // Pitch (D-12-2)
  // ---------------------------------------------------------------

  /** @returns {number} the persisted MANUAL pitch (0.5..1.5). */
  function readPitch() {
    const stored = parseFloat(readStore(PITCH_KEY));
    if (isFinite(stored)) return clamp(stored, PITCH_MIN, PITCH_MAX);
    return PITCH_DEFAULT;
  }

  /** @returns {number} the resolved effective manual pitch. */
  function getPitch() {
    return pitch;
  }

  /** Persist + apply a manual pitch; mirror it onto the slider. */
  function setPitch(value) {
    pitch = clamp(value, PITCH_MIN, PITCH_MAX);
    writeStore(PITCH_KEY, String(pitch));
    if (pitchRange) pitchRange.value = String(pitch);
  }

  /** @returns {"auto"|"manual"} the persisted pitch mode. */
  function readPitchMode() {
    const stored = readStore(PITCH_MODE_KEY);
    return stored === "manual" ? "manual" : "auto";
  }

  /** @returns {"auto"|"manual"} the current pitch mode. */
  function getPitchMode() {
    return pitchMode;
  }

  /** Persist + apply the pitch mode; mirror it onto the control group. */
  function setPitchMode(mode) {
    pitchMode = mode === "manual" ? "manual" : "auto";
    writeStore(PITCH_MODE_KEY, pitchMode);
    mirrorPitchMode();
  }

  /**
   * The pitch an utterance at `rate` gets (D-12-2).
   * - "auto":   a SMALL upward compensation at the extreme rates —
   *             1 + GAIN * (rate - 1), clamped to [PITCH_MIN, PITCH_MAX].
   *             DOCUMENTED as a heuristic, NOT an engine-quality claim:
   *             engines tend to sound dull/compressed at high rate and
   *             sluggish at low rate; this nudges pitch accordingly.
   * - "manual": the reader's pitch slider, verbatim.
   * @param {number} rate
   * @returns {number}
   */
  function effectivePitch(rateValue) {
    if (pitchMode === "manual") return pitch;
    const r = isFinite(rateValue) ? rateValue : RATE_DEFAULT;
    const p = 1 + NATURAL_PITCH_GAIN * (r - 1);
    return clamp(p, PITCH_MIN, PITCH_MAX);
  }

  // ---------------------------------------------------------------
  // Voice (D-12-3)
  // ---------------------------------------------------------------

  /**
   * The BCP-47 PREFIX a voice must carry to count as a match for `lang`
   * (e.g. "fa" matches "fa", "fa-IR"). Case-insensitive.
   * @param {string} lang
   * @returns {string}
   */
  function langPrefix(lang) {
    return String(lang || "en").toLowerCase();
  }

  /**
   * Rank a single voice for `lang` (D-12-3). LOWER is better. The score is a
   * tuple flattened to a number so the sort is a plain numeric compare and
   * the ordering is TOTAL and STABLE-able via the original index.
   *
   * 1. localService preference: a local (on-device) voice beats a remote one
   *    (avoids network latency/dependence; documented heuristic).
   * 2. the platform `default` flag.
   * 3. regional specificity: a voice whose tag EXACTLY equals the language
   *    prefix is preferred over a bare tag, matching the convention that a
   *    region-qualified voice is the intended one for that locale.
   * 4. curated NAME allow-list: "natural"/"neural"/"online"/"google"/
   *    "microsoft" markers, in that order (documented heuristic; the Web
   *    Speech API exposes NO quality score — this is NOT ground truth). Kept
   *    LAST because a recognizable NAME must not override a better-fitting
   *    locale.
   * 5. stable order: the original list index breaks any remaining tie.
   *
   * @param {SpeechSynthesisVoice} v
   * @param {string} lang
   * @returns {number} a small integer score (lower is better)
   */
  function rankScore(v, lang) {
    const prefix = langPrefix(lang);
    let score = 0;

    // 1) localService preferred (false sorts before true)
    score = score * 2 + (v && v.localService ? 0 : 1);

    // 2) the default flag (true sorts before false)
    score = score * 2 + (v && v.default ? 0 : 1);

    // 3) regional specificity: a region-qualified tag ("fa-IR") is preferred
    //    over a bare tag ("fa")
    const tag = String((v && v.lang) || "").toLowerCase();
    const hasRegion = tag.length > prefix.length && tag.indexOf(prefix) === 0;
    score = score * 2 + (hasRegion ? 0 : 1);

    // 4) curated name markers, first match wins (lowest priority)
    const name = String((v && v.name) || "").toLowerCase();
    let markerRank = NAME_MARKERS.length; // "no marker" ranks last
    for (let i = 0; i < NAME_MARKERS.length; i += 1) {
      if (name.indexOf(NAME_MARKERS[i]) !== -1) {
        markerRank = i;
        break;
      }
    }
    score = score * (NAME_MARKERS.length + 1) + markerRank;

    return score;
  }

  /**
   * The voices for `lang`, filtered by the BCP-47 prefix and SORTED by the
   * documented ranking (D-12-3). Ties break on the original list order.
   * @param {string} lang
   * @returns {SpeechSynthesisVoice[]}
   */
  function voicesFor(lang) {
    const prefix = langPrefix(lang);
    const all = rawVoices();
    const matches = [];
    for (let i = 0; i < all.length; i += 1) {
      const v = all[i];
      if (v && v.lang && v.lang.toLowerCase().indexOf(prefix) === 0) {
        matches.push({ v: v, i: i });
      }
    }
    matches.sort(function (a, b) {
      const sa = rankScore(a.v, lang);
      const sb = rankScore(b.v, lang);
      if (sa !== sb) return sa - sb;
      return a.i - b.i; // stable: original order
    });
    return matches.map(function (m) {
      return m.v;
    });
  }

  /**
   * The top-ranked voice for `lang`, or null when none match (D-12-3).
   * @param {string} lang
   * @returns {SpeechSynthesisVoice|null}
   */
  function topVoiceFor(lang) {
    const list = voicesFor(lang);
    return list.length ? list[0] : null;
  }

  /** @returns {object} the remembered lang -> voiceURI map. */
  function readVoiceMap() {
    try {
      const parsed = JSON.parse(readStore(VOICE_KEY));
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (err) {
      return {};
    }
  }

  /**
   * The selected voiceURI for `lang`, or null when the reader has not chosen
   * one (the caller then falls back to topVoiceFor).
   * @param {string} lang
   * @returns {string|null}
   */
  function getVoice(lang) {
    const map = readVoiceMap();
    const uri = map[langPrefix(lang)];
    return typeof uri === "string" && uri ? uri : null;
  }

  /**
   * Persist a per-language voice choice (D-12-3). Passing a falsy voiceURI
   * CLEARS the choice for that language (revert to the auto-selected top).
   * @param {string} lang
   * @param {string} voiceURI
   */
  function setVoice(lang, voiceURI) {
    const key = langPrefix(lang);
    const map = readVoiceMap();
    if (voiceURI) {
      map[key] = String(voiceURI);
    } else {
      delete map[key];
    }
    writeStore(VOICE_KEY, JSON.stringify(map));
    voicesByLang = map; // keep the in-memory mirror in sync
  }

  /**
   * Register a callback fired whenever the platform voice list (re)populates
   * (the async `voiceschanged` case, D-12-3). Fired immediately with the
   * current list so a late registrant starts in sync. Idempotent per cb.
   * @param {() => void} cb
   */
  function onVoicesChanged(cb) {
    if (typeof cb === "function" && voicesChangedListeners.indexOf(cb) === -1) {
      voicesChangedListeners.push(cb);
      try {
        cb();
      } catch (err) {
        /* a listener must never break the module */
      }
    }
  }

  /** Fire the registered voices-changed listeners. */
  function emitVoicesChanged() {
    for (let i = 0; i < voicesChangedListeners.length; i += 1) {
      try {
        voicesChangedListeners[i]();
      } catch (err) {
        /* a listener must never break the module */
      }
    }
  }

  /**
   * Repopulate the voice <select> for the CURRENT language (D-12-3). The
   * remembered choice wins; else the top-ranked voice is PRE-SELECTED.
   */
  function populateVoices() {
    if (!voiceSelect) return;
    const list = voicesFor(currentLang);
    voiceSelect.innerHTML = "";

    if (!list.length) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = supported() ? "Default voice" : "Voice unavailable";
      voiceSelect.appendChild(opt);
      voiceSelect.value = "";
      voiceSelect.disabled = true;
      return;
    }
    voiceSelect.disabled = false;

    const chosenURI = getVoice(currentLang);
    const top = list[0];
    let selectedURI = chosenURI;
    // A remembered choice that is no longer present falls back to the top.
    if (
      selectedURI &&
      !list.some(function (v) {
        return v.voiceURI === selectedURI;
      })
    ) {
      selectedURI = null;
    }
    if (!selectedURI) selectedURI = top ? top.voiceURI : "";

    list.forEach(function (v) {
      const opt = document.createElement("option");
      opt.value = v.voiceURI;
      // Show the name; append the tag when it adds information.
      opt.textContent =
        v.lang && v.name.indexOf("(") === -1
          ? v.name + " (" + v.lang + ")"
          : v.name;
      if (v.voiceURI === selectedURI) opt.selected = true;
      voiceSelect.appendChild(opt);
    });
    voiceSelect.value = selectedURI;
  }

  // ---------------------------------------------------------------
  // Route language (passed in by app.js — NO route awareness here)
  // ---------------------------------------------------------------

  /**
   * Set the CURRENT route language and refresh the language-dependent
   * controls (the voice list + the language icon mirror). Called by app.js on
   * init + every route change (D-12-6).
   * @param {string} lang
   */
  function setLang(lang) {
    currentLang = langPrefix(lang || "en");
    mirrorLangButton();
    populateVoices();
  }

  // ---------------------------------------------------------------
  // Control mirroring
  // ---------------------------------------------------------------

  /** Mirror `rate` onto the named-step <select> and the range slider. */
  function mirrorRate() {
    if (rateRange) rateRange.value = String(rate);
    if (rateSelect) {
      const step = nearestStepValue(rate);
      // A custom rate shows as an extra option so the select never lies.
      if (step === null) {
        const custom = rateSelect.querySelector('option[value="__custom"]');
        if (custom) custom.remove();
        const opt = document.createElement("option");
        opt.value = "__custom";
        opt.textContent = "Custom (" + String(rate) + ")";
        rateSelect.appendChild(opt);
        rateSelect.value = "__custom";
      } else {
        const existing = rateSelect.querySelector('option[value="__custom"]');
        if (existing) existing.remove();
        rateSelect.value = step;
      }
    }
  }

  /** Mirror the pitch mode onto the radio group; enable the slider only in
   *  "manual" mode (in "auto" the slider is inert, showing the auto value). */
  function mirrorPitchMode() {
    if (pitchModeInput) pitchModeInput.checked = pitchMode !== "manual";
    const manualRadio = document.getElementById("tts-pitch-mode-manual");
    if (manualRadio) manualRadio.checked = pitchMode === "manual";
    if (pitchRange) {
      if (pitchMode === "manual") {
        pitchRange.value = String(pitch);
        pitchRange.disabled = false;
      } else {
        pitchRange.value = String(effectivePitch(rate));
        pitchRange.disabled = true;
      }
    }
  }

  /** Mirror the CURRENT language onto the toolbar language icon. */
  function mirrorLangButton() {
    if (langBtn) {
      const codes = ["en", "fa", "th", "ar"];
      langBtn.setAttribute("data-lang", currentLang);
      langBtn.setAttribute(
        "aria-label",
        "Language: " + currentLang.toUpperCase(),
      );
      if (langMenu) {
        Array.prototype.forEach.call(
          langMenu.querySelectorAll("[data-lang]"),
          function (item) {
            const on = item.getAttribute("data-lang") === currentLang;
            item.setAttribute("aria-current", on ? "true" : "false");
          },
        );
      }
      void codes; // (kept for clarity; membership handled in wiring)
    }
  }

  // ---------------------------------------------------------------
  // Control wiring
  // ---------------------------------------------------------------

  /** Open/close the settings popover, keeping aria-expanded in sync. */
  function setPopoverOpen(open) {
    if (!settingsBtn || !settingsPopover) return;
    settingsBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      settingsPopover.removeAttribute("hidden");
    } else {
      settingsPopover.setAttribute("hidden", "");
    }
  }

  /** Open/close the language menu, keeping aria-expanded in sync. */
  function setLangMenuOpen(open) {
    if (!langBtn || !langMenu) return;
    langBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      langMenu.removeAttribute("hidden");
    } else {
      langMenu.setAttribute("hidden", "");
    }
  }

  /**
   * Speak a short sample with the current settings, so the reader can PREVIEW
   * the chosen speed/pitch/voice without playing the post (the "Test voice"
   * button). Guards every failure.
   */
  function testVoice() {
    if (!supported()) return;
    try {
      window.speechSynthesis.cancel();
      const u = new window.SpeechSynthesisUtterance("This is a test.");
      u.lang = currentLang;
      u.rate = getRate();
      u.pitch = effectivePitch(getRate());
      const voiceURI = getVoice(currentLang);
      let voice = null;
      if (voiceURI) {
        voice = rawVoices().find(function (v) {
          return v.voiceURI === voiceURI;
        });
      }
      if (!voice) voice = topVoiceFor(currentLang);
      if (voice) u.voice = voice;
      window.speechSynthesis.speak(u);
    } catch (err) {
      /* non-fatal: a preview must never break the page */
    }
  }

  /**
   * Wire all the Milestone-12 controls. Idempotent — a second call is a
   * no-op.
   */
  function init() {
    if (initialized) return;

    // Resolve the resolved preference values.
    rate = readRate();
    pitch = readPitch();
    pitchMode = readPitchMode();
    voicesByLang = readVoiceMap();

    settingsBtn = document.getElementById("tts-settings-btn");
    settingsPopover = document.getElementById("tts-settings");
    rateSelect = document.getElementById("tts-rate-select");
    rateRange = document.getElementById("tts-rate-range");
    pitchModeInput = document.getElementById("tts-pitch-mode");
    pitchRange = document.getElementById("tts-pitch-range");
    voiceSelect = document.getElementById("tts-voice-select");
    testBtn = document.getElementById("tts-test-btn");
    langBtn = document.getElementById("tts-lang-btn");
    langMenu = document.getElementById("tts-lang-menu");
    fontBtn = document.getElementById("tts-font-btn");

    const anyControl =
      settingsBtn ||
      rateSelect ||
      rateRange ||
      voiceSelect ||
      langBtn ||
      fontBtn;
    if (!anyControl) {
      // No toolbar controls present (list-only or a stripped page): nothing
      // to wire. Still mark initialized so init() stays idempotent.
      initialized = true;
      return;
    }

    // --- Settings popover toggle (aria-expanded + `hidden`; 10b convention)
    if (settingsBtn) {
      settingsBtn.addEventListener("click", function () {
        const open = settingsBtn.getAttribute("aria-expanded") === "true";
        setPopoverOpen(!open);
      });
    }

    // --- Speed named steps
    if (rateSelect) {
      rateSelect.addEventListener("change", function () {
        const val = rateSelect.value;
        if (val === "__custom") return; // no-op; pick via the slider
        const num = parseFloat(val);
        if (isFinite(num)) setRate(num);
      });
    }

    // --- Speed slider (snaps to a named step when near one)
    if (rateRange) {
      rateRange.addEventListener("input", function () {
        const num = parseFloat(rateRange.value);
        if (isFinite(num)) setRate(num);
      });
    }

    // --- Pitch mode (auto | manual) — listen on BOTH radios in the group.
    if (pitchModeInput) {
      const manualRadio = document.getElementById("tts-pitch-mode-manual");
      const onModeChange = function () {
        const mode = manualRadio && manualRadio.checked ? "manual" : "auto";
        setPitchMode(mode);
        mirrorPitchMode();
      };
      if (!pitchModeInput._wired) {
        pitchModeInput.addEventListener("change", onModeChange);
        pitchModeInput._wired = true;
      }
      if (manualRadio && !manualRadio._wired) {
        manualRadio.addEventListener("change", onModeChange);
        manualRadio._wired = true;
      }
    }

    // --- Pitch slider (manual override)
    if (pitchRange) {
      pitchRange.addEventListener("input", function () {
        const num = parseFloat(pitchRange.value);
        if (isFinite(num)) {
          // Moving the slider implies manual intent.
          setPitch(num);
          if (pitchMode !== "manual") setPitchMode("manual");
        }
      });
    }

    // --- Voice picker (per-language memory)
    if (voiceSelect) {
      voiceSelect.addEventListener("change", function () {
        setVoice(currentLang, voiceSelect.value);
      });
    }

    // --- Test voice
    if (testBtn) {
      testBtn.addEventListener("click", testVoice);
    }

    // --- Language icon: a small menu; items navigate via the SAME href rule
    //     (app.js sets data-href using BlogNav.buildLangHref semantics).
    if (langBtn) {
      langBtn.addEventListener("click", function () {
        const open = langBtn.getAttribute("aria-expanded") === "true";
        setLangMenuOpen(!open);
      });
    }
    if (langMenu) {
      langMenu.addEventListener("click", function (event) {
        const item = event.target.closest
          ? event.target.closest("[data-href]")
          : null;
        if (!item) return;
        const href = item.getAttribute("data-href");
        if (href) window.location.hash = href; // single source: app.js builds it
        setLangMenuOpen(false);
      });
    }

    // --- Font icon: cycles the family via BlogFont.set (font.js owns it)
    if (fontBtn) {
      fontBtn.addEventListener("click", cycleFont);
    }

    // Close the popover / menu on outside click or Escape.
    document.addEventListener("click", function (event) {
      if (
        settingsPopover &&
        settingsBtn &&
        settingsBtn.getAttribute("aria-expanded") === "true" &&
        !settingsPopover.contains(event.target) &&
        !settingsBtn.contains(event.target)
      ) {
        setPopoverOpen(false);
      }
      if (
        langMenu &&
        langBtn &&
        langBtn.getAttribute("aria-expanded") === "true" &&
        !langMenu.contains(event.target) &&
        !langBtn.contains(event.target)
      ) {
        setLangMenuOpen(false);
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        if (
          settingsBtn &&
          settingsBtn.getAttribute("aria-expanded") === "true"
        ) {
          setPopoverOpen(false);
          settingsBtn.focus();
        }
        if (langBtn && langBtn.getAttribute("aria-expanded") === "true") {
          setLangMenuOpen(false);
          langBtn.focus();
        }
      }
    });

    // --- Async voice list: repopulate when the platform list arrives.
    if (supported()) {
      try {
        window.speechSynthesis.addEventListener("voiceschanged", function () {
          populateVoices();
          emitVoicesChanged();
        });
      } catch (err) {
        // Older engines expose onvoiceschanged instead of addEventListener.
        try {
          window.speechSynthesis.onvoiceschanged = function () {
            populateVoices();
            emitVoicesChanged();
          };
        } catch (err2) {
          /* non-fatal: an empty voice list is handled gracefully */
        }
      }
    }

    // Initial mirrors.
    mirrorRate();
    mirrorPitchMode();
    mirrorLangButton();
    populateVoices();

    initialized = true;
  }

  /**
   * Cycle the reading family via BlogFont.set (D-12-5). font.js remains the
   * single owner of the family + its persistence; this DELEGATES only.
   */
  function cycleFont() {
    const order = ["", "traditional", "modern"];
    const current =
      window.BlogFont && typeof window.BlogFont.get === "function"
        ? window.BlogFont.get()
        : "";
    const idx = order.indexOf(current);
    const next = order[(idx + 1) % order.length];
    if (window.BlogFont && typeof window.BlogFont.set === "function") {
      window.BlogFont.set(next);
    }
  }

  return {
    init: init,
    getRate: getRate,
    setRate: setRate,
    getPitch: getPitch,
    setPitch: setPitch,
    getPitchMode: getPitchMode,
    setPitchMode: setPitchMode,
    effectivePitch: effectivePitch,
    voicesFor: voicesFor,
    topVoiceFor: topVoiceFor,
    getVoice: getVoice,
    setVoice: setVoice,
    onVoicesChanged: onVoicesChanged,
    // Milestone 12: app.js passes the current route language in (no route
    // awareness lives here); setLang refreshes the language-dependent UI.
    setLang: setLang,
    // Exposed so app.js can rebuild the language-icon menu hrefs using the
    // SAME buildLangHref semantics as the drawer switcher (D-12-4).
    _steps: RATE_STEPS,
  };
})();

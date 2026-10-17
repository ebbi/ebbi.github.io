/**
 * apps/blog/assets/js/tts.js
 * Milestone TTS — Text-to-speech for the bottom-toolbar transport buttons.
 *
 * Owns exactly one thing: the speechSynthesis lifecycle for the CURRENT post.
 * - Window surface: window.BlogTTS = { init, speak, pause, resume, stop,
 *   setEnabled }.
 * - No route awareness inside this module; app.js decides WHEN to speak/stop.
 * - The transport buttons' disabled state is the single source of transport
 *   availability (X-3): app.js drives the per-view state via setEnabled.
 *
 * Engine (X-1): the platform Web Speech API (window.speechSynthesis +
 * SpeechSynthesisUtterance). No audio files, no server pipeline, no assets.
 *
 * SENTENCE CHUNKING (pause-reliability fix). Many engines (notably desktop
 * Chrome) do NOT honour speechSynthesis.pause()/resume() while a single long
 * utterance is playing — the reported defect. So this module splits the post
 * text into SENTENCES and speaks them ONE AT A TIME, queueing the next in the
 * previous utterance's onend. Pause therefore acts at a sentence boundary and
 * Resume continues from the SAME sentence instead of restarting the post.
 *
 * WORD-PRECISE RESUME (best-effort). To avoid replaying a whole sentence after
 * a mid-sentence pause, the module also listens for `onboundary` and records
 * the last charIndex within the current sentence. On resume it re-speaks the
 * sentence SLICED from that offset, so speech continues near the exact word.
 * `onboundary` is engine-dependent (Chrome desktop emits it; some engines do
 * not); where it is absent the offset stays 0 and resume replays the sentence
 * head — a graceful fallback, never a regression.
 *
 * GENERATION TOKEN (cancellation correctness). speechSynthesis.cancel() causes
 * the cancelled utterance to fire onend/onerror asynchronously on real engines.
 * Those "echo" events must NOT advance the queue (that caused Play-after-Pause
 * to skip to the NEXT sentence). Every chunk captures the generation `gen` at
 * creation; pause()/stop()/speak() bump `gen`, so any handler whose captured
 * generation is stale is ignored. A naturally-completed chunk leaves `gen`
 * unchanged, so its onend still advances to the next sentence.
 *
 * Graceful degradation (X-5): if speechSynthesis is unavailable, init() is a
 * no-op, the buttons stay inert, and every method is a safe no-op.
 *
 * Idempotent: init() is safe to call more than once (a second call is a no-op).
 */
window.BlogTTS = (function () {
  const PLAY_ID = "tts-play-btn";
  const PAUSE_ID = "tts-pause-btn";
  const STOP_ID = "tts-stop-btn";

  let playEl = null;
  let pauseEl = null;
  let stopEl = null;
  let initialized = false;

  // Playback state.
  let sentences = []; // string[] — the post text split into sentences
  let index = 0; // the index of the sentence to (re)speak next
  let status = "idle"; // "idle" | "speaking" | "paused"
  let gen = 0; // generation token; bumped on pause/stop/speak (see header)

  // TTS2: per-sentence PROGRESS signal. `currentIndex` is the sentence being
  // SPOKEN (or -1 when there is no active sentence: idle/paused/stopped/end).
  // Listeners are app-owned callbacks fired as each sentence BEGINS so the app
  // can map the index to a DOM node and highlight it. tts.js NEVER touches the
  // post DOM (the app owns the mapping); see D-TTS2-1.
  let currentIndex = -1;
  const sentenceListeners = [];

  // TTS2: the app-owned resolver mapping a sentence index to a DOM node (or
  // null). tts.js only CALLS it from highlightTarget(); the mapping lives in
  // app.js (D-TTS2-6). Defaults to "no target".
  let resolveTarget = null;

  // Word-precision bookkeeping (best-effort; see onboundary below).
  // `charOffset` is the character offset WITHIN the CURRENT sentence that the
  // last `onboundary` reported — i.e. where the reader had got to when pause()
  // was pressed. 0 means "no boundary seen yet for this sentence": resume then
  // replays the sentence head (the graceful fallback).
  // `baseOffset` is the slice offset the current utterance was started at
  // (nonzero only after a word-precise resume), so an absolute position is
  // `baseOffset + event.charIndex`.
  let charOffset = 0;
  let baseOffset = 0;

  /**
   * @returns {boolean} true when the Web Speech API is usable here.
   */
  function supported() {
    return (
      typeof window.speechSynthesis !== "undefined" &&
      typeof window.SpeechSynthesisUtterance === "function"
    );
  }

  /**
   * Split text into sentences on . ! ? … (and the same followed by a quote or
   * bracket), keeping the terminator with the sentence; newlines are also
   * boundaries. Whitespace-only results are dropped. Heuristic (it may split
   * after abbreviations like "Dr."); intentionally simple and recorded as such.
   * @param {string} text
   * @returns {string[]}
   */
  function splitSentences(text) {
    const body =
      typeof text === "string" ? text.replace(/\s+/g, " ").trim() : "";
    if (!body) return [];
    const parts = body
      .split(/(?<=[.!?\u2026][)"'\u201d\u2019\]]?)\s+|\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.length ? parts : [body];
  }

  /**
   * Enable/disable the three transport buttons. `disabled` is the single
   * source of transport availability (X-3). Passing no argument disables all.
   * @param {{play?:boolean, pause?:boolean, stop?:boolean, all?:boolean}=} state
   */
  function setEnabled(state) {
    const s = state || { all: true };
    if (playEl) playEl.disabled = s.all === true ? true : !s.play;
    if (pauseEl) pauseEl.disabled = s.all === true ? true : !s.pause;
    if (stopEl) stopEl.disabled = s.all === true ? true : !s.stop;
  }

  /**
   * TTS2: fire the registered progress listeners with the current active
   * sentence. `index === -1` is the NO-ACTIVE-SENTENCE signal (idle / paused /
   * stopped / end); the app uses it to CLEAR the highlight (D-TTS2-3).
   * @param {number} idx sentence index, or -1 for "no active sentence"
   */
  function emitSentence(idx) {
    currentIndex = idx;
    for (let i = 0; i < sentenceListeners.length; i += 1) {
      try {
        sentenceListeners[i](idx, sentences.length);
      } catch (err) {
        /* a listener must never break playback */
      }
    }
  }

  /** Idle (post view, not speaking): Play enabled, Pause/Stop disabled. */
  function setIdle() {
    status = "idle";
    setEnabled({ play: true, pause: false, stop: false });
  }

  /** Speaking: Pause+Stop enabled, Play disabled. */
  function setSpeaking() {
    status = "speaking";
    setEnabled({ play: false, pause: true, stop: true });
  }

  /** Paused: Play(resume)+Stop enabled, Pause disabled. */
  function setPaused() {
    status = "paused";
    setEnabled({ play: true, pause: false, stop: true });
  }

  /**
   * Build a SpeechSynthesisUtterance for `text`, with a voice matching the
   * document language when one exists (X-1).
   * Milestone 12 (ADDITIVE, D-12-6): after setting `lang`/`voice`, ALSO apply
   * the current BlogSpeech settings — rate, pitch, and the reader's chosen
   * (or top-ranked) voice. Every read of BlogSpeech is GUARDED so that when
   * window.BlogSpeech is ABSENT the behavior here is byte-identical to before
   * (rate/pitch default to 1; the voice falls back to the existing lang-prefix
   * match). The chunked engine is UNCHANGED: settings are read fresh per
   * utterance, so a change takes effect at the NEXT sentence boundary.
   * @param {string} text
   * @returns {SpeechSynthesisUtterance}
   */
  function makeUtterance(text) {
    const u = new window.SpeechSynthesisUtterance(text);
    const wantLang = document.documentElement.getAttribute("lang") || undefined;
    if (wantLang) u.lang = wantLang;

    // Milestone 12: speed + pitch (guarded; default 1 when BlogSpeech absent).
    if (window.BlogSpeech && typeof window.BlogSpeech === "object") {
      try {
        if (typeof window.BlogSpeech.getRate === "function") {
          const r = window.BlogSpeech.getRate();
          if (typeof r === "number" && isFinite(r)) u.rate = r;
        }
        if (typeof window.BlogSpeech.effectivePitch === "function") {
          const p = window.BlogSpeech.effectivePitch(u.rate);
          if (typeof p === "number" && isFinite(p)) u.pitch = p;
        }
      } catch (err) {
        /* non-fatal: fall back to the engine defaults for rate/pitch */
      }
    }

    try {
      const voices =
        typeof window.speechSynthesis.getVoices === "function"
          ? window.speechSynthesis.getVoices()
          : [];

      // Milestone 12: prefer the reader's remembered voice for this language,
      // then BlogSpeech's top-ranked voice, then the existing lang-prefix
      // match (the current fallback). Every step guarded.
      let chosen = null;
      if (window.BlogSpeech && typeof window.BlogSpeech === "object") {
        try {
          const langKey = wantLang || "en";
          let uri = null;
          if (typeof window.BlogSpeech.getVoice === "function") {
            uri = window.BlogSpeech.getVoice(langKey);
          }
          if (uri) {
            chosen =
              voices.find(function (v) {
                return v && v.voiceURI === uri;
              }) || null;
          }
          if (!chosen && typeof window.BlogSpeech.topVoiceFor === "function") {
            chosen = window.BlogSpeech.topVoiceFor(langKey) || null;
          }
        } catch (err) {
          /* non-fatal: fall through to the lang-prefix match */
        }
      }

      if (!chosen) {
        chosen =
          voices.find(
            (v) => v.lang && wantLang && v.lang.indexOf(wantLang) === 0,
          ) || null;
      }
      if (chosen) u.voice = chosen;
    } catch (err) {
      /* non-fatal: fall back to the default voice */
    }
    return u;
  }
  /**
   * Speak the sentence at the current `index`, then queue the next on onend.
   * All handlers are guarded by the generation token so cancellation echoes do
   * not advance the queue (see the module header).
   */
  function speakCurrent() {
    if (!supported() || status === "paused") return;
    if (index >= sentences.length) {
      // Done: reset to the top so the next Play restarts the post.
      index = 0;
      charOffset = 0;
      baseOffset = 0;
      setIdle();
      emitSentence(-1); // end of post -> clear the highlight (D-TTS2-3)
      return;
    }

    const sentence = sentences[index];
    // Resume part-way into the sentence when we have a boundary offset.
    const startAt = Math.max(0, Math.min(charOffset, sentence.length - 1));
    const text = sentence.slice(startAt);

    const u = makeUtterance(text);
    const myGen = gen;
    baseOffset = startAt;
    // The utterance we are about to speak covers the sentence from `startAt`
    // onward; the resume point resets to the slice base until onboundary moves.
    charOffset = 0;
    setSpeaking();
    // TTS2: announce the sentence that is BEGINNING so the app can highlight
    // it (D-TTS2-1). Fired before speak() so the highlight leads the audio.
    emitSentence(index);

    // Best-effort word tracking: Chrome desktop fires onboundary with a
    // charIndex into the CURRENT utterance; others do not.
    u.onboundary = function (event) {
      if (gen !== myGen) return; // stale chunk (cancelled)
      const ci = event && event.charIndex != null ? event.charIndex : 0;
      const abs = baseOffset + ci;
      if (abs > charOffset) charOffset = abs;
    };
    u.onend = function () {
      if (gen !== myGen) return; // cancellation echo — do NOT advance
      index += 1;
      charOffset = 0;
      baseOffset = 0;
      speakCurrent();
    };
    u.onerror = function () {
      if (gen !== myGen) return; // cancellation echo — ignore
      setIdle();
    };

    try {
      window.speechSynthesis.speak(u);
    } catch (err) {
      setIdle();
    }
  }

  /**
   * Start speaking the given text from `opts.start` (default 0). Cancels any
   * current speech first (no overlap). Accepts a pre-split array of sentences
   * or a plain string (split internally).
   * @param {string|string[]} text
   * @param {{start?:number}=} [opts]
   */
  function speak(text, opts) {
    if (!supported()) return;
    const list = Array.isArray(text)
      ? text.filter(Boolean)
      : splitSentences(text);
    if (!list.length) return;

    // Cancel anything in-flight so chunks never overlap; bump the generation
    // so the cancelled utterance's echo events are ignored.
    gen += 1;
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      /* non-fatal */
    }

    sentences = list;
    const start = opts && Number.isInteger(opts.start) ? opts.start : 0;
    index = Math.max(0, Math.min(start, sentences.length - 1));
    charOffset = 0; // fresh start: begin the sentence from its head
    baseOffset = 0;
    status = "speaking";
    speakCurrent();
  }

  /**
   * Pause at the current word (best-effort) or sentence boundary. We cancel the
   * in-flight chunk (so speech truly stops even on engines that ignore pause())
   * and RETAIN `index` + `charOffset`, so Resume continues from the same
   * sentence — at the last word boundary where supported, else its head.
   */
  function pause() {
    if (!supported() || status !== "speaking") return;
    // Best-effort native pause (honoured by some engines between utterances).
    try {
      if (!window.speechSynthesis.paused) window.speechSynthesis.pause();
    } catch (err) {
      /* non-fatal */
    }
    // Bump the generation FIRST so the cancellation echo (onend/onerror) of the
    // chunk we are about to cancel cannot advance `index`.
    gen += 1;
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      /* non-fatal */
    }
    // `index` + `charOffset` are deliberately NOT reset: they are the resume
    // point (same sentence; word-precise where onboundary fired).
    setPaused();
    // TTS2: no sentence is being spoken while paused -> clear the highlight
    // (D-TTS2-3). `resume()` re-emits the same index, restoring it.
    emitSentence(-1);
  }

  /**
   * Resume from the SAME position (never restarts the post, never skips ahead).
   * Continues near the word where it stopped on engines that emit onboundary,
   * else from the sentence head.
   */
  function resume() {
    if (!supported() || status !== "paused") return;
    status = "speaking";
    speakCurrent();
  }

  /**
   * Cancel the current speech and reset to idle. Safe to call any time. Clears
   * the queue so the next Play starts from the top of the post.
   *
   * Leaves the transport in the POST-IDLE button state (Play enabled,
   * Pause/Stop disabled) so the reader can start playing again after a Stop.
   * On a route change, handleRouteChange follows with renderList/renderPost,
   * whose setEnabled() sets the final per-view state (list -> all disabled).
   */
  function stop() {
    if (!supported()) return;
    gen += 1; // ignore the cancellation echo of the current chunk
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      /* non-fatal */
    }
    sentences = [];
    index = 0;
    charOffset = 0;
    baseOffset = 0;
    setIdle();
    emitSentence(-1); // stopped -> clear the highlight (D-TTS2-3)
  }

  /**
   * TTS2: register a per-sentence progress listener. Called as each sentence
   * BEGINS with `(index, total)`, and with `index === -1` on the
   * no-active-sentence signal (idle / paused / stopped / end) so the app can
   * clear the highlight. The listener is invoked immediately with the current
   * state so a late registrant starts in sync. Idempotent per callback.
   * @param {(index:number, total:number)=>void} cb
   */
  function onSentence(cb) {
    if (typeof cb === "function" && sentenceListeners.indexOf(cb) === -1) {
      sentenceListeners.push(cb);
      // Sync the new listener with the CURRENT state (D-TTS2-1).
      try {
        cb(currentIndex, sentences.length);
      } catch (err) {
        /* a listener must never break playback */
      }
    }
  }

  /**
   * TTS2: register the app-owned resolver that maps a sentence index to the
   * DOM node that produced it (or null). tts.js only CALLS this from
   * highlightTarget(); the mapping is built and owned by app.js (D-TTS2-6).
   * @param {(index:number)=>Element|null} fn
   */
  function adviseResolver(fn) {
    resolveTarget = typeof fn === "function" ? fn : null;
  }

  /**
   * TTS2: the DOM element currently associated with the active sentence, or
   * null. Delegates to the app-owned resolver; tts.js never inspects the post
   * DOM itself (D-TTS2-6). Returns null when there is no active sentence.
   * @returns {Element|null}
   */
  function highlightTarget() {
    if (currentIndex < 0 || typeof resolveTarget !== "function") return null;
    try {
      return resolveTarget(currentIndex) || null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Wire the transport buttons + the Play button's text provider.
   * Idempotent — a second call is a no-op.
   * @param {{ getText?: () => (string|string[]) }} [opts] `getText` returns the
   *   CURRENT post's readable text (string or pre-split sentence array).
   */
  function init(opts) {
    if (initialized) return;

    playEl = document.getElementById(PLAY_ID);
    pauseEl = document.getElementById(PAUSE_ID);
    stopEl = document.getElementById(STOP_ID);

    // When the API is unavailable, leave the buttons inert and bail.
    if (!supported()) {
      setEnabled({ all: true });
      initialized = true;
      return;
    }

    const getText =
      opts && typeof opts.getText === "function" ? opts.getText : null;

    if (playEl) {
      playEl.addEventListener("click", function () {
        // Resume when paused; otherwise start (or restart) from the top.
        if (status === "paused") {
          resume();
          return;
        }
        if (status === "speaking") return; // already reading; Play is disabled
        const text = getText ? getText() : sentences;
        speak(text);
      });
    }
    if (pauseEl) {
      pauseEl.addEventListener("click", pause);
    }
    if (stopEl) {
      stopEl.addEventListener("click", stop);
    }

    // Start inert: all disabled until a post view enables Play (X-3).
    setEnabled({ all: true });
    initialized = true;
  }

  return {
    init: init,
    speak: speak,
    pause: pause,
    resume: resume,
    stop: stop,
    // Public so app.js can drive the per-view transport state (X-3).
    setEnabled: setEnabled,
    // TTS2: progress signal + highlight surface (app owns the DOM mapping).
    onSentence: onSentence,
    highlightTarget: highlightTarget,
    adviseResolver: adviseResolver,
    // TTS2: the SAME sentence-splitting rule app.js must use so the spoken
    // sentence list and the app's sentence->node list stay 1:1 (D-TTS2-2).
    splitSentences: splitSentences,
  };
})();

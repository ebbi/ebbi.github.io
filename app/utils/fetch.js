// app/utils/fetch.js
/**
 * Load a JSON document with a built‑in timeout.
 *
 * @param {string} url                – URL to fetch.
 * @param {object} [options]          – Optional config.
 * @param {number} [options.timeout] – Timeout in milliseconds (default 10 000 ms).
 *
 * @returns {Promise<any>} Resolves with the parsed JSON payload.
 *
 * @throws Will reject with an Error if:
 *   • the HTTP response is not ok (status ≥ 400)
 *   • the request times out
 *   • the network fails for any other reason
 *
 * The function is deliberately tiny – it does **not** retry, it does not
 * transform the payload, and it preserves the original error‑message format
 * (`❌ ${url} – …`) so the rest of the codebase continues to work unchanged.
 */
export function loadJSON(url, { timeout = 10000 } = {}) {
    // -------------------------------------------------------------
    // 1️⃣  Create an AbortController that will cancel the request
    //     after the specified timeout.
    // -------------------------------------------------------------
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    // -------------------------------------------------------------
    // 2️⃣  Perform the fetch with the abort signal attached.
    // -------------------------------------------------------------
    return fetch(url, { signal: controller.signal })
        .then(resp => {
            // -------------------------------------------------
            // 3️⃣  Clean up the timer – we got a response.
            // -------------------------------------------------
            clearTimeout(timer);

            if (!resp.ok) {
                // Preserve the original error format used throughout the app.
                throw new Error(`❌ ${url} – ${resp.statusText}`);
            }
            return resp.json();
        })
        .catch(err => {
            // -------------------------------------------------
            // 4️⃣  Distinguish a timeout (AbortError) from other failures.
            // -------------------------------------------------
            if (err.name === 'AbortError') {
                throw new Error(`❌ ${url} – request timed out after ${timeout} ms`);
            }
            // Re‑throw any other error (network failure, JSON parse error, …)
            throw err;
        });
}
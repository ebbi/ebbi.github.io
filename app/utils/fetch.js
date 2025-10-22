// app/utils/fetch.js
/**
 * Fetch a URL and resolve with parsed JSON.
 * Rejects with a readable message if the response is not OK.
 */
export function loadJSON(url) {
    return fetch(url).then(resp => {
        if (!resp.ok) throw new Error(`❌ ${url} – ${resp.statusText}`);
        return resp.json();
    });
}
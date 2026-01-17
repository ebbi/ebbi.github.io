/**
 * Fetch a URL and resolve with parsed JSON.
 * Robust version to prevent NetworkErrors in SPAs.
 */
export async function loadJSON(url) {
    // 1. Force the URL to be absolute from the root origin
    // This stops the browser from looking in /en/exercises/app/data/...
    let finalUrl = url;
    if (!url.startsWith('http')) {
        const cleanPath = url.startsWith('/') ? url.slice(1) : url;
        finalUrl = `${window.location.origin}/${cleanPath}`;
    }

    console.log(`[fetch] Requesting: ${finalUrl}`);

    try {
        const resp = await fetch(finalUrl, {
            mode: 'cors', // Explicitly allow cross-origin logic if localhost/127 mismatch exists
            cache: 'no-cache', // Prevents the browser from serving a "broken" cached version
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status} - ${resp.statusText}`);
        }

        return await resp.json();
    } catch (err) {
        console.error(`[loadJSON Error] Failed for: ${finalUrl}`, err);
        // Throw a specific error we can catch in routes.js
        throw err;
    }
}
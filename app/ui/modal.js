// app/ui/modal.js
/**
 * Show a custom, non‑blocking modal with arbitrary HTML content.
 * The function creates the modal only once and re‑uses it on subsequent calls.
 *
 * @param {string} title   – heading text
 * @param {string} bodyHTML – raw HTML (or plain text) for the body
 */
export function showModal(title, bodyHTML) {
    let backdrop = document.getElementById('custom-modal-backdrop');

    // First call → build the DOM structure
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'custom-modal-backdrop';
        backdrop.className = 'modal-backdrop';

        const modal = document.createElement('div');
        modal.className = 'modal';

        const h2 = document.createElement('h2');
        h2.id = 'custom-modal-title';
        modal.appendChild(h2);

        const body = document.createElement('div');
        body.id = 'custom-modal-body';
        modal.appendChild(body);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.marginTop = '1rem';
        closeBtn.onclick = () => document.body.removeChild(backdrop);
        modal.appendChild(closeBtn);

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
    }

    // Populate the modal
    document.getElementById('custom-modal-title').textContent = title;
    // Sanitize bodyHTML to prevent XSS
    document.getElementById('custom-modal-body').innerHTML = DOMPurify.sanitize(bodyHTML);
}
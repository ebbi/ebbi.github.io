// app/ui/renderHeader.js
import { renderToolbar } from './toolbar.js';
import { applyDirection } from '../utils/rtl.js';
import { getStoredLang } from '../utils/storage.js';

export async function renderHeader(lang) {
    applyDirection(lang || getStoredLang());

    // Only create the absolute essentials
    document.body.innerHTML = `
        <div id="toolbarContainer"></div>
        <main id="main" class="main"></main>
    `;

    renderToolbar(document.getElementById('toolbarContainer'));

    return document.getElementById('main');
}
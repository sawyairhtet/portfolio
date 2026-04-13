/**
 * Screenshot Tool - GNOME 49 Screenshot Toolbar
 * Floating pill toolbar triggered by keyboard shortcut
 */

import { showToast } from './notifications.js';

/** @type {HTMLElement | null} */
let toolbar = null;
let isVisible = false;

/**
 * Initialize the screenshot tool keyboard listener
 */
export function setupScreenshotTool() {
    createToolbarDOM();

    document.addEventListener('keydown', e => {
        // Shift + PrintScreen or Ctrl+Shift+S as fallback
        if (
            (e.shiftKey && e.key === 'PrintScreen') ||
            (e.ctrlKey && e.shiftKey && e.key === 'S')
        ) {
            e.preventDefault();
            toggleToolbar();
        }

        if (e.key === 'Escape' && isVisible) {
            hideToolbar();
        }
    });
}

function createToolbarDOM() {
    if (document.getElementById('screenshot-toolbar')) {
        return;
    }

    const el = document.createElement('div');
    el.id = 'screenshot-toolbar';
    el.className = 'screenshot-toolbar';
    el.setAttribute('role', 'toolbar');
    el.setAttribute('aria-label', 'Screenshot tool');

    const modes = [
        { id: 'fullscreen', icon: 'fa-desktop', label: 'Full Screen', title: 'Capture full screen' },
        { id: 'window', icon: 'fa-window-maximize', label: 'Window', title: 'Capture window' },
        { id: 'selection', icon: 'fa-crop-alt', label: 'Selection', title: 'Capture selection' },
    ];

    const modeGroup = document.createElement('div');
    modeGroup.className = 'screenshot-modes';

    modes.forEach((mode, i) => {
        const btn = document.createElement('button');
        btn.className = 'screenshot-mode-btn' + (i === 0 ? ' active' : '');
        btn.dataset.mode = mode.id;
        btn.setAttribute('aria-label', mode.title);
        btn.setAttribute('title', mode.title);
        btn.innerHTML =
            '<i class="fas ' + mode.icon + '" aria-hidden="true"></i>' +
            '<span>' + mode.label + '</span>';
        btn.addEventListener('click', () => {
            modeGroup.querySelectorAll('.screenshot-mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
        modeGroup.appendChild(btn);
    });

    const captureBtn = document.createElement('button');
    captureBtn.className = 'screenshot-capture-btn';
    captureBtn.setAttribute('aria-label', 'Take screenshot');
    captureBtn.innerHTML = '<i class="fas fa-camera" aria-hidden="true"></i>';
    captureBtn.addEventListener('click', takeScreenshot);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'screenshot-close-btn';
    closeBtn.setAttribute('aria-label', 'Close screenshot tool');
    closeBtn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
    closeBtn.addEventListener('click', hideToolbar);

    el.appendChild(modeGroup);
    el.appendChild(captureBtn);
    el.appendChild(closeBtn);

    document.body.appendChild(el);
    toolbar = el;
}

function toggleToolbar() {
    if (isVisible) {
        hideToolbar();
    } else {
        showToolbar();
    }
}

function showToolbar() {
    if (!toolbar) {
        return;
    }
    isVisible = true;
    toolbar.classList.add('visible');
}

function hideToolbar() {
    if (!toolbar) {
        return;
    }
    isVisible = false;
    toolbar.classList.remove('visible');
}

function takeScreenshot() {
    const activeMode = toolbar?.querySelector('.screenshot-mode-btn.active');
    const mode = /** @type {HTMLElement | null} */ (activeMode)?.dataset.mode || 'fullscreen';

    // Simulate screenshot capture with visual feedback
    const flash = document.createElement('div');
    flash.className = 'screenshot-flash';
    document.body.appendChild(flash);

    requestAnimationFrame(() => {
        flash.classList.add('active');
        setTimeout(() => {
            flash.remove();
        }, 400);
    });

    hideToolbar();

    const modeLabels = {
        fullscreen: 'Full screen',
        window: 'Window',
        selection: 'Selection',
    };
    showToast(`Screenshot captured (${modeLabels[mode] || mode})`, 'fa-camera');
}

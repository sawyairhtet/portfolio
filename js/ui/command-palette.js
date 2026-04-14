/**
 * Command Palette (Ctrl+K / Cmd+K)
 * Spotlight-style quick actions for the OS metaphor
 */

import { openWindow, closeAllWindows } from '../core/window-manager.js';
import { lock } from './lock-screen.js';
import { executeTerminalCommand, addTerminalOutput } from '../apps/terminal.js';

const COMMANDS = [
    { id: 'about', label: 'Open About', icon: 'fa-user-circle', category: 'Apps', action: () => openWindow('about', getOS()) },
    { id: 'skills', label: 'Open Skills', icon: 'fa-tools', category: 'Apps', action: () => openWindow('skills', getOS()) },
    { id: 'projects', label: 'Open Projects', icon: 'fa-folder', category: 'Apps', action: () => openWindow('projects', getOS()) },
    { id: 'contact', label: 'Open Contact', icon: 'fa-envelope', category: 'Apps', action: () => openWindow('contact', getOS()) },
    { id: 'links', label: 'Open Links', icon: 'fa-link', category: 'Apps', action: () => openWindow('links', getOS()) },
    { id: 'terminal', label: 'Open Terminal', icon: 'fa-terminal', category: 'Apps', action: () => openWindow('terminal', getOS()) },
    { id: 'settings', label: 'Open Settings', icon: 'fa-cog', category: 'Apps', action: () => openWindow('settings', getOS()) },
    { id: 'focus-mode', label: 'Open Focus Mode', icon: 'fa-eye', category: 'Apps', action: () => openWindow('focus-mode', getOS()) },
    { id: 'close-all', label: 'Close All Windows', icon: 'fa-times-circle', category: 'Actions', action: () => closeAllWindows() },
    { id: 'theme-toggle', label: 'Toggle Dark Mode', icon: 'fa-moon', category: 'Actions', action: () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        if (isDark) {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        const toggle = /** @type {HTMLInputElement | null} */ (document.getElementById('theme-toggle'));
        if (toggle) { toggle.checked = !isDark; }
    }},
    { id: 'lock-screen', label: 'Lock Screen', icon: 'fa-lock', category: 'Actions', action: () => lock() },
    { id: 'clear-terminal', label: 'Clear Terminal', icon: 'fa-eraser', category: 'Actions', action: () => {
        const output = document.getElementById('terminal-output');
        if (output) { output.innerHTML = ''; }
    }},
    { id: 'neofetch', label: 'Run Neofetch', icon: 'fa-info-circle', category: 'Actions', action: () => {
        openWindow('terminal', getOS());
        setTimeout(() => {
            const result = executeTerminalCommand('neofetch');
            addTerminalOutput('neofetch', result);
        }, 150);
    }},
    { id: 'github', label: 'Visit GitHub', icon: 'fa-github', category: 'Links', action: () => window.open('https://github.com/sawyairhtet', '_blank') },
    { id: 'linkedin', label: 'Visit LinkedIn', icon: 'fa-linkedin', category: 'Links', action: () => window.open('https://www.linkedin.com/in/saw-ye-htet-the-man-who-code/', '_blank') },
    { id: 'resume', label: 'Download Resume', icon: 'fa-download', category: 'Actions', action: () => { const a = document.querySelector('a[download]'); if (a) (/** @type {HTMLElement} */ (a)).click(); } },
];

let paletteEl = null;
let inputEl = null;
let listEl = null;
let selectedIndex = 0;
let filteredCommands = [...COMMANDS];
let isOpen = false;

function getOS() {
    const w = window.innerWidth;
    return w <= 767 ? 'mobile' : w <= 1024 ? 'tablet' : 'desktop';
}

function createPalette() {
    if (paletteEl) {return;}

    paletteEl = document.createElement('div');
    paletteEl.className = 'command-palette-overlay';
    paletteEl.innerHTML = `
        <div class="command-palette">
            <div class="command-palette-input-wrap">
                <i class="fas fa-search" aria-hidden="true"></i>
                <input type="text" class="command-palette-input" placeholder="Type a command..." aria-label="Command palette search" autocomplete="off" spellcheck="false" />
            </div>
            <div class="command-palette-list" role="listbox"></div>
            <div class="command-palette-footer">
                <span><kbd>↑↓</kbd> navigate</span>
                <span><kbd>Enter</kbd> select</span>
                <span><kbd>Esc</kbd> close</span>
            </div>
        </div>`;

    document.body.appendChild(paletteEl);

    inputEl = paletteEl.querySelector('.command-palette-input');
    listEl = paletteEl.querySelector('.command-palette-list');

    inputEl.addEventListener('input', () => {
        filterCommands(inputEl.value);
    });

    inputEl.addEventListener('keydown', /** @param {KeyboardEvent} e */ e => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, filteredCommands.length - 1);
            renderList();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            renderList();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            executeSelected();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closePalette();
        }
    });

    paletteEl.addEventListener('click', e => {
        if (e.target === paletteEl) {
            closePalette();
        }
    });
}

function filterCommands(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
        filteredCommands = [...COMMANDS];
    } else {
        filteredCommands = COMMANDS.filter(cmd =>
            cmd.label.toLowerCase().includes(q) ||
            cmd.category.toLowerCase().includes(q) ||
            cmd.id.toLowerCase().includes(q)
        );
    }
    selectedIndex = 0;
    renderList();
}

function renderList() {
    if (!listEl) {return;}

    listEl.innerHTML = filteredCommands.map((cmd, i) => {
        const iconPrefix = cmd.icon.startsWith('fa-github') || cmd.icon.startsWith('fa-linkedin') ? 'fab' : 'fas';
        return `<div class="command-palette-item ${i === selectedIndex ? 'selected' : ''}" data-index="${i}" role="option" aria-selected="${i === selectedIndex}">
            <i class="${iconPrefix} ${cmd.icon}" aria-hidden="true"></i>
            <span class="command-palette-label">${cmd.label}</span>
            <span class="command-palette-category">${cmd.category}</span>
        </div>`;
    }).join('');

    if (filteredCommands.length === 0) {
        listEl.innerHTML = '<div class="command-palette-empty">No commands found</div>';
    }

    // Click handlers
    listEl.querySelectorAll('.command-palette-item').forEach(item => {
        item.addEventListener('click', () => {
            selectedIndex = parseInt(/** @type {HTMLElement} */ (item).dataset.index);
            executeSelected();
        });
        item.addEventListener('mouseenter', () => {
            selectedIndex = parseInt(/** @type {HTMLElement} */ (item).dataset.index);
            renderList();
        });
    });

    // Scroll selected into view
    const selected = listEl.querySelector('.selected');
    if (selected) {
        selected.scrollIntoView({ block: 'nearest' });
    }
}

function executeSelected() {
    if (filteredCommands[selectedIndex]) {
        const cmd = filteredCommands[selectedIndex];
        closePalette();
        cmd.action();
    }
}

export function openPalette() {
    if (isOpen) {return;}
    createPalette();
    isOpen = true;
    filteredCommands = [...COMMANDS];
    selectedIndex = 0;

    requestAnimationFrame(() => {
        paletteEl.classList.add('visible');
        inputEl.value = '';
        renderList();
        inputEl.focus();
    });
}

export function closePalette() {
    if (!isOpen || !paletteEl) {return;}
    isOpen = false;
    paletteEl.classList.remove('visible');
}

export function setupCommandPalette() {
    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (isOpen) {
                closePalette();
            } else {
                openPalette();
            }
        }
    });
}

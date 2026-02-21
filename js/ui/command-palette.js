/**
 * Command Palette
 * Spotlight-style quick actions
 */

import { openWindow } from '../core/window-manager.js';
import { executeTerminalCommand } from '../apps/terminal.js';

const COMMANDS = [
    { id: 'open-about', label: 'Open About', icon: '👤', action: () => openWindow('about') },
    { id: 'open-skills', label: 'Open Skills', icon: '🎯', action: () => openWindow('skills') },
    {
        id: 'open-projects',
        label: 'Open Projects',
        icon: '📁',
        action: () => openWindow('projects'),
    },
    { id: 'open-contact', label: 'Open Contact', icon: '✉️', action: () => openWindow('contact') },
    { id: 'open-links', label: 'Open Links', icon: '🔗', action: () => openWindow('links') },
    {
        id: 'open-terminal',
        label: 'Open Terminal',
        icon: '💻',
        action: () => openWindow('terminal'),
    },
    {
        id: 'open-settings',
        label: 'Open Settings',
        icon: '⚙️',
        action: () => openWindow('settings'),
    },
    { id: 'toggle-theme', label: 'Toggle Dark Mode', icon: '🌓', action: toggleTheme },
    {
        id: 'clear-terminal',
        label: 'Clear Terminal',
        icon: '🧹',
        action: () => executeTerminalCommand('clear'),
    },
    {
        id: 'run-neofetch',
        label: 'Run Neofetch',
        icon: '🐧',
        action: () => executeTerminalCommand('neofetch'),
    },
    {
        id: 'go-github',
        label: 'Go to GitHub',
        icon: '🐙',
        action: () => window.open('https://github.com/sawyairhtet', '_blank'),
    },
    {
        id: 'go-linkedin',
        label: 'Go to LinkedIn',
        icon: '💼',
        action: () =>
            window.open('https://www.linkedin.com/in/saw-ye-htet-the-man-who-code/', '_blank'),
    },
    { id: 'download-resume', label: 'Download Resume', icon: '📄', action: downloadResume },
];

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

function downloadResume() {
    const link = document.createElement('a');
    link.href = 'resume/SYH_resume.pdf';
    link.download = 'SawYeHtet_Resume.pdf';
    link.click();
}

class CommandPalette {
    constructor() {
        this.isOpen = false;
        this.selectedIndex = 0;
        this.filteredCommands = [...COMMANDS];
        this.element = null;
        this.setupKeyboard();
    }

    setupKeyboard() {
        document.addEventListener('keydown', e => {
            // Cmd/Ctrl + K to open
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }

            // Escape to close
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }

            if (!this.isOpen) {
                return;
            }

            // Navigation
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectedIndex = (this.selectedIndex + 1) % this.filteredCommands.length;
                this.updateSelection();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectedIndex =
                    (this.selectedIndex - 1 + this.filteredCommands.length) %
                    this.filteredCommands.length;
                this.updateSelection();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.executeSelected();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (this.isOpen) {
            return;
        }

        this.isOpen = true;
        this.selectedIndex = 0;
        this.filteredCommands = [...COMMANDS];

        this.element = document.createElement('div');
        this.element.className = 'command-palette-overlay';
        this.element.innerHTML = `
            <div class="command-palette">
                <div class="command-palette-input-wrapper">
                    <span class="command-palette-search-icon">🔍</span>
                    <input type="text" class="command-palette-input" placeholder="Type a command or search...">
                    <span class="command-palette-shortcut">ESC to close</span>
                </div>
                <div class="command-palette-list">
                    ${this.renderCommands()}
                </div>
            </div>
        `;

        document.body.appendChild(this.element);

        // Focus input
        const input = /** @type {HTMLInputElement} */ (
            this.element.querySelector('.command-palette-input')
        );
        input.focus();

        // Handle input
        input.addEventListener('input', e => {
            this.filter(/** @type {HTMLInputElement} */ (e.target).value);
        });

        // Close on backdrop click
        this.element.addEventListener('click', e => {
            if (e.target === this.element) {
                this.close();
            }
        });

        this.updateSelection();
    }

    close() {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.element?.remove();
        this.element = null;
    }

    filter(query) {
        const lower = query.toLowerCase();
        this.filteredCommands = COMMANDS.filter(
            cmd => cmd.label.toLowerCase().includes(lower) || cmd.id.includes(lower)
        );
        this.selectedIndex = 0;

        const list = this.element.querySelector('.command-palette-list');
        list.innerHTML = this.renderCommands();
        this.updateSelection();
    }

    renderCommands() {
        if (this.filteredCommands.length === 0) {
            return '<div class="command-palette-empty">No commands found</div>';
        }

        return this.filteredCommands
            .map(
                (cmd, i) => `
            <div class="command-palette-item ${i === this.selectedIndex ? 'selected' : ''}" data-index="${i}">
                <span class="command-palette-item-icon">${cmd.icon}</span>
                <span class="command-palette-item-label">${cmd.label}</span>
            </div>
        `
            )
            .join('');
    }

    updateSelection() {
        const items = this.element?.querySelectorAll('.command-palette-item');
        items?.forEach((item, i) => {
            item.classList.toggle('selected', i === this.selectedIndex);
            if (i === this.selectedIndex) {
                item.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    executeSelected() {
        const cmd = this.filteredCommands[this.selectedIndex];
        if (cmd) {
            this.close();
            cmd.action();
        }
    }
}

export const commandPalette = new CommandPalette();

// Add styles
const style = document.createElement('style');
style.textContent = `
    .command-palette-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 100000;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 15vh;
        animation: fade-in 0.15s ease-out;
    }
    
    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .command-palette {
        width: 90%;
        max-width: 600px;
        background: var(--color-window-body-bg);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg), 0 24px 80px rgba(0,0,0,0.4);
        overflow: hidden;
        animation: slide-down 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    @keyframes slide-down {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .command-palette-input-wrapper {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid var(--color-border);
        gap: 12px;
    }
    
    .command-palette-search-icon {
        font-size: 20px;
        opacity: 0.6;
    }
    
    .command-palette-input {
        flex: 1;
        background: none;
        border: none;
        color: var(--color-text-light);
        font-size: 16px;
        font-family: inherit;
        outline: none;
    }
    
    .command-palette-input::placeholder {
        color: var(--color-text-dark);
        opacity: 0.6;
    }
    
    .command-palette-shortcut {
        font-size: 12px;
        opacity: 0.5;
        background: var(--color-card-bg);
        padding: 4px 8px;
        border-radius: 4px;
    }
    
    .command-palette-list {
        max-height: 400px;
        overflow-y: auto;
    }
    
    .command-palette-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 20px;
        cursor: pointer;
        transition: background 0.15s ease;
    }
    
    .command-palette-item:hover,
    .command-palette-item.selected {
        background: var(--color-card-bg);
    }
    
    .command-palette-item-icon {
        font-size: 20px;
        width: 32px;
        text-align: center;
    }
    
    .command-palette-item-label {
        font-size: 14px;
        color: var(--color-text-light);
    }
    
    .command-palette-empty {
        padding: 40px;
        text-align: center;
        opacity: 0.6;
    }
`;
document.head.appendChild(style);

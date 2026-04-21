/**
 * Theme Manager
 * Handles dark/light mode via data-theme attribute
 */

const ThemeManager = {
    init() {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (saved === 'light') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            // No saved preference — auto-detect from OS (prefers-color-scheme)
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        }

        // Listen for OS theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                }
                this.updateUI();
            }
        });
    },

    updateUI() {
        // Sync toggle switch if present
        const toggle = /** @type {HTMLInputElement | null} */ (document.getElementById('theme-toggle'));
        if (toggle) {
            toggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
        }
    },

    toggle() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        this.updateUI();
    },

    setupListeners() {
        // No-op: listeners are handled in setupSettingsPanel()
    },
};

export default ThemeManager;

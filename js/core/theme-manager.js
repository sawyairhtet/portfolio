/**
 * Theme Manager
 * Handles dark/light mode via data-theme attribute
 */

const ThemeManager = {
    init() {
        // Restore saved theme preference
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
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

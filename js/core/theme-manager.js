/**
 * Theme Manager
 * Light mode only - dark mode has been removed
 */

const ThemeManager = {
    init() {
        // Ensure light mode is always active
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    },

    updateUI() {
        // No-op: dark mode removed
    },

    toggle() {
        // No-op: dark mode removed
    },

    setupListeners() {
        // No-op: dark mode removed
    },
};

export default ThemeManager;

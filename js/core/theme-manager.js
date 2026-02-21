/**
 * Theme Manager
 * Handles dark/light mode toggling and persistence
 */

const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            this.updateUI(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.updateUI(true);
        }
    },

    updateUI(isDark) {
        const themeToggle = /** @type {HTMLInputElement} */ (
            document.getElementById('theme-toggle')
        );
        const quickToggle = document.getElementById('quick-theme-toggle');

        if (themeToggle) {
            themeToggle.checked = isDark;
            themeToggle.setAttribute('aria-pressed', String(isDark));
        }
        if (quickToggle) {
            const icon = quickToggle.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            quickToggle.setAttribute('aria-pressed', String(isDark));
        }
    },

    toggle() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            this.updateUI(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            this.updateUI(true);
        }
    },

    setupListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        const quickToggle = document.getElementById('quick-theme-toggle');

        if (themeToggle) {
            themeToggle.addEventListener('change', () => this.toggle());
        }

        if (quickToggle) {
            quickToggle.addEventListener('click', () => this.toggle());
        }
    },
};

export default ThemeManager;

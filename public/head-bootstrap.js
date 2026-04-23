(function () {
    try {
        const savedTheme = window.localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
        }
    } catch {
        // Ignore storage access failures and keep the default dark theme.
    }
})();
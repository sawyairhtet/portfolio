(function () {
    try {
        const savedTheme = window.localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    } catch {
        // Ignore storage access failures and keep the default dark theme.
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

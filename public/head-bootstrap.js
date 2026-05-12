(function () {
    try {
        const savedTheme = window.localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    } catch {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

window.addEventListener('load', function () {
    var link = document.querySelector('link[href*="JetBrains+Mono"]');
    if (link) link.media = 'all';
});

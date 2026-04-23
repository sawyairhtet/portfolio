const SOCIAL_LINKS = [
    { href: 'https://github.com/sawyairhtet', icon: 'fab fa-github', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/saw-ye-htet-the-man-who-code/', icon: 'fab fa-linkedin', label: 'LinkedIn' },
    { href: 'https://x.com/saulyehtet_', icon: 'fab fa-x-twitter', label: 'X' },
];

export function LinksApp() {
    return (
        <>
            <h2>Social Links</h2>
            <div className="links-list">
                {SOCIAL_LINKS.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <i className={link.icon} aria-hidden="true" /> {link.label}
                    </a>
                ))}
            </div>
        </>
    );
}

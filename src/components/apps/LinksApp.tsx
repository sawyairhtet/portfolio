const SOCIAL_LINKS = [
    {
        href: 'https://github.com/sawyairhtet',
        icon: 'fab fa-github',
        label: 'GitHub',
        handle: '@sawyairhtet',
        domain: 'github.com',
    },
    {
        href: 'https://www.linkedin.com/in/saw-ye-htet-the-man-who-code/',
        icon: 'fab fa-linkedin',
        label: 'LinkedIn',
        handle: 'Saw Ye Htet',
        domain: 'linkedin.com',
    },
    {
        href: 'https://x.com/saulyehtet_',
        icon: 'fab fa-x-twitter',
        label: 'X',
        handle: '@saulyehtet_',
        domain: 'x.com',
    },
];

export function LinksApp() {
    return (
        <>
            <h2>Links</h2>
            <div className="links-list polished-links">
                {SOCIAL_LINKS.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <span className="social-link-icon">
                            <i className={link.icon} aria-hidden="true" />
                        </span>
                        <span className="social-link-copy">
                            <strong>{link.label}</strong>
                            <small>{link.handle} / {link.domain}</small>
                        </span>
                        <i className="fas fa-arrow-up-right-from-square social-link-external" aria-hidden="true" />
                    </a>
                ))}
            </div>
        </>
    );
}

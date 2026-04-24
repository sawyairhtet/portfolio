import { SOCIAL_LINKS } from '../../config/profile';

export function LinksApp() {
    return (
        <>
            <h2>Links</h2>
            <div className="links-list polished-links">
                {SOCIAL_LINKS.map(link => (
                    <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <span className="social-link-icon">
                            {link.label === 'X' ? (
                                <span className="x-logo-mark" aria-hidden="true">
                                    X
                                </span>
                            ) : (
                                <i className={link.icon} aria-hidden="true" />
                            )}
                        </span>
                        <span className="social-link-copy">
                            <strong>{link.label}</strong>
                            <small>
                                {link.handle} / {link.domain}
                            </small>
                        </span>
                        <i
                            className="fas fa-arrow-up-right-from-square social-link-external"
                            aria-hidden="true"
                        />
                    </a>
                ))}
            </div>
        </>
    );
}

import { SOCIAL_LINKS } from '../../config/profile';

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="ed-footer">
            <div className="ed-footer-inner ed-container">
                <div>
                    <p className="ed-footer-word">
                        Saw Ye Htet<span className="dot">.</span>
                    </p>
                    <p className="ed-footer-tag">
                        IT Support &amp; Operations Specialist — built from scratch in React +
                        TypeScript. Prefer the interactive desktop version?{' '}
                        <a className="ed-footer-link" href="/desktop" style={{ display: 'inline' }}>
                            Launch it ↗
                        </a>
                    </p>
                </div>

                <nav className="ed-footer-col" aria-label="Elsewhere">
                    <span className="ed-side-label">Elsewhere</span>
                    {SOCIAL_LINKS.map(link => (
                        <a
                            key={link.label}
                            className="ed-footer-link"
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link.label} ↗
                        </a>
                    ))}
                </nav>
            </div>

            <div className="ed-footer-bar ed-container">
                <span>© {year} Saw Ye Htet · Singapore</span>
                <a className="ed-totop" href="#top">
                    Back to top ↑
                </a>
            </div>
        </footer>
    );
}

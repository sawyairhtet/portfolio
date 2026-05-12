import { SOCIAL_LINKS } from '../../config/profile';

const githubLink = SOCIAL_LINKS.find(link => link.label === 'GitHub') ?? SOCIAL_LINKS[0];

export function BrowserApp() {
    return (
        <div className="browser-app">
            <div className="browser-toolbar" aria-label="Firefox toolbar">
                <button type="button" aria-label="Back" disabled>
                    <i className="fas fa-arrow-left" aria-hidden="true" />
                </button>
                <button type="button" aria-label="Forward" disabled>
                    <i className="fas fa-arrow-right" aria-hidden="true" />
                </button>
                <button type="button" aria-label="Reload">
                    <i className="fas fa-rotate-right" aria-hidden="true" />
                </button>
                <div className="browser-location" role="textbox" aria-label="Address">
                    <i className="fas fa-lock" aria-hidden="true" />
                    <span>{githubLink.href}</span>
                </div>
                <a
                    className="browser-open-link"
                    href={githubLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open GitHub in a new tab"
                >
                    <i className="fas fa-up-right-from-square" aria-hidden="true" />
                </a>
            </div>
            <div className="browser-frame-wrap">
                <iframe
                    title="Saw Ye Htet GitHub"
                    src={githubLink.href}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
                />
                <div className="browser-frame-fallback">
                    <i className="fab fa-github" aria-hidden="true" />
                    <strong>{githubLink.handle}</strong>
                    <span>GitHub may block embedding in some browsers.</span>
                    <a href={githubLink.href} target="_blank" rel="noopener noreferrer">
                        Open GitHub
                    </a>
                </div>
            </div>
        </div>
    );
}

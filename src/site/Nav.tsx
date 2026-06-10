import { Link } from 'react-router-dom';
import { hasPublishedPosts } from './blog/posts';

// Shared editorial chrome. Minimal by design: the wordmark returns to the front
// door (/, the portfolio), and the links are the About section, the writing feed
// (/writing) and the RSS feed (shown once a post is published). About points at
// /#about (a native anchor) so it works from any page — on the portfolio it just
// scrolls, from /writing or a post it loads the front door and jumps to the section.
export function Nav() {
    return (
        <header className="ed-nav">
            <div className="ed-nav-inner ed-container">
                <a className="ed-wordmark" href="/">
                    Saw Ye Htet<span className="dot">.</span>
                </a>
                <nav className="ed-nav-links" aria-label="Primary">
                    <a className="ed-nav-link" href="/#about">
                        About
                    </a>
                    <Link className="ed-nav-link" to="/writing">
                        Writing
                    </Link>
                    {hasPublishedPosts && (
                        <a
                            className="ed-nav-link"
                            href="/rss.xml"
                            title="RSS feed — paste this URL into a reader app to follow new posts"
                        >
                            RSS
                        </a>
                    )}
                </nav>
                <span className="ed-nav-status">
                    <span className="ed-status-dot" />
                    Open to work
                </span>
            </div>
        </header>
    );
}

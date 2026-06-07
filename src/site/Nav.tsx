import { Link } from 'react-router-dom';
import { hasPublishedPosts } from './blog/posts';

// Shared editorial chrome. Minimal by design: the wordmark returns to the front
// door (/, the portfolio), and the only links are the writing feed (/writing) and
// the RSS feed (shown once a post is published). Section navigation lives on the
// portfolio page itself.
export function Nav() {
    return (
        <header className="ed-nav">
            <div className="ed-nav-inner ed-container">
                <Link className="ed-wordmark" to="/">
                    Saw Ye Htet<span className="dot">.</span>
                </Link>
                <nav className="ed-nav-links" aria-label="Primary">
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

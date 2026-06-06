import { Link } from 'react-router-dom';
import { hasPublishedPosts } from './blog/posts';

// Shared editorial chrome for the writing-first site. Minimal by design: the
// wordmark returns to the feed (/), and the only links are the portfolio (/work)
// and the RSS feed (shown once a post is published). Section navigation lives on
// the /work page itself.
export function Nav() {
    return (
        <header className="ed-nav">
            <div className="ed-nav-inner ed-container">
                <Link className="ed-wordmark" to="/">
                    Saw Ye Htet<span className="dot">.</span>
                </Link>
                <nav className="ed-nav-links" aria-label="Primary">
                    <Link className="ed-nav-link" to="/work">
                        Work
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

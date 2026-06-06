import { Link } from 'react-router-dom';
import { hasPublishedPosts } from './blog/posts';

// Shared editorial chrome — used by the homepage and the blog pages so they read
// as the same site. Section anchors are root-anchored (`/#about`) so they work
// from `/blog` as well as from `/`. The "Writing" link only appears once at
// least one non-draft post exists.
export function Nav() {
    return (
        <header className="ed-nav">
            <div className="ed-nav-inner ed-container">
                <a className="ed-wordmark" href="/#top">
                    Saw Ye Htet<span className="dot">.</span>
                </a>
                <nav className="ed-nav-links" aria-label="Primary">
                    <a className="ed-nav-link" href="/#about">
                        About
                    </a>
                    <a className="ed-nav-link" href="/#experience">
                        Experience
                    </a>
                    <a className="ed-nav-link" href="/#projects">
                        Projects
                    </a>
                    <a className="ed-nav-link" href="/#skills">
                        Skills
                    </a>
                    {hasPublishedPosts && (
                        <Link className="ed-nav-link" to="/blog">
                            Writing
                        </Link>
                    )}
                    <a className="ed-nav-link" href="/#contact">
                        Contact
                    </a>
                </nav>
                <span className="ed-nav-status">
                    <span className="ed-status-dot" />
                    Open to work
                </span>
            </div>
        </header>
    );
}

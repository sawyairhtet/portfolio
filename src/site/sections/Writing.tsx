import { Link } from 'react-router-dom';
import { PUBLISHED_POSTS, formatPostDate } from '../blog/posts';

// The three newest published posts, surfaced on the work page (the front door)
// so the writing cadence stays visible. Each post links to its clean root slug
// (/<slug>); the section links out to the full feed at /writing. Renders nothing
// until at least one post is published — mirrors the Projects section's empty
// guard, and keeps it safely last in the numbered run (see WorkPage.tsx).
const RECENT_COUNT = 3;

export function Writing() {
    if (PUBLISHED_POSTS.length === 0) return null;

    const recent = PUBLISHED_POSTS.slice(0, RECENT_COUNT);

    return (
        <section className="ed-section ed-container" id="writing">
            <div className="ed-section-head">
                <span className="ed-section-num">07</span>
                <h2 className="ed-section-title">Writing</h2>
                <span className="ed-section-meta">Notes &amp; essays</span>
            </div>

            <ul className="ed-blog-list">
                {recent.map(({ meta }) => (
                    <li className="ed-blog-item" key={meta.slug}>
                        <Link className="ed-blog-link" to={`/${meta.slug}`}>
                            <span className="ed-blog-meta">
                                <span className="ed-blog-date">{formatPostDate(meta.date)}</span>
                                <span className="ed-blog-readtime">
                                    {meta.readingMinutes} min read
                                </span>
                            </span>
                            <span className="ed-blog-titlewrap">
                                <span className="ed-blog-title">{meta.title}</span>
                                {meta.summary && (
                                    <span className="ed-blog-summary">{meta.summary}</span>
                                )}
                            </span>
                            <span className="ed-blog-arrow">↗</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <Link className="ed-blog-back" to="/writing">
                All writing →
            </Link>
        </section>
    );
}

import { Link } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './sections/Footer';
import { PUBLISHED_POSTS, formatPostDate } from './blog/posts';

// Blog index at /blog. Lists published posts newest-first; shows a quiet empty
// state when nothing is published yet (drafts never appear here).
export function Blog() {
    return (
        <div className="ed">
            <title>Writing — Saw Ye Htet</title>
            <meta
                name="description"
                content="Writing by Saw Ye Htet — notes on IT support, troubleshooting, and building things."
            />
            <Nav />
            <main id="main-content">
                <section className="ed-section ed-container" id="writing">
                    <div className="ed-section-head ed-reveal">
                        <span className="ed-section-num">—</span>
                        <h1 className="ed-section-title">Writing</h1>
                        <span className="ed-section-meta">Notes &amp; field reports</span>
                    </div>

                    {PUBLISHED_POSTS.length === 0 ? (
                        <p className="ed-blog-empty">
                            No posts published yet — writing in progress.
                        </p>
                    ) : (
                        <ul className="ed-blog-list">
                            {PUBLISHED_POSTS.map(post => (
                                <li className="ed-blog-item" key={post.meta.slug}>
                                    <Link className="ed-blog-link" to={`/blog/${post.meta.slug}`}>
                                        <span className="ed-blog-date">
                                            {formatPostDate(post.meta.date)}
                                        </span>
                                        <span className="ed-blog-titlewrap">
                                            <span className="ed-blog-title">{post.meta.title}</span>
                                            <span className="ed-blog-summary">
                                                {post.meta.summary}
                                            </span>
                                        </span>
                                        <span className="ed-blog-arrow">↗</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}

import './editorial.css';
import { Link } from 'react-router-dom';
import { PROFILE } from '../config/profile';
import { Nav } from './Nav';
import { Footer } from './sections/Footer';
import { PUBLISHED_POSTS, FEATURED_POSTS, formatPostDate, type BlogPost } from './blog/posts';

// The front door is now a writing feed: a compact masthead over the newest-first
// list of published posts. The portfolio (About/Experience/Projects/Skills/
// Résumé/Contact) lives at /work. Posts link to clean root slugs (/<slug>).

// Featured cluster only appears once the archive is deep enough that pinning a
// post adds signal — below 3 published posts it would just echo the feed.
const FEATURED_MIN_POSTS = 3;

function Masthead() {
    return (
        <header className="ed-masthead ed-container" id="top">
            <span className="ed-eyebrow">Writing · Singapore</span>
            <h1 className="ed-masthead-name">
                {PROFILE.name}
                <span className="dot">.</span>
            </h1>
            <p className="ed-masthead-tagline">{PROFILE.tagline}</p>
            {/* Placeholder intro — Saw to rewrite in his own voice. */}
            <p className="ed-masthead-intro">
                I build software and write here about what I&apos;m working through, technical and
                otherwise.
            </p>
            <Link className="ed-home-cta" to="/work">
                My experience and projects are on the <strong>work page</strong>
                <span className="a">→</span>
            </Link>
        </header>
    );
}

function PostList({ posts }: { posts: BlogPost[] }) {
    return (
        <ul className="ed-blog-list">
            {posts.map(({ meta }) => (
                <li className="ed-blog-item" key={meta.slug}>
                    <Link className="ed-blog-link" to={`/${meta.slug}`}>
                        <span className="ed-blog-meta">
                            <span className="ed-blog-date">{formatPostDate(meta.date)}</span>
                            <span className="ed-blog-readtime">{meta.readingMinutes} min read</span>
                        </span>
                        <span className="ed-blog-titlewrap">
                            <span className="ed-blog-title">{meta.title}</span>
                            {meta.summary && (
                                <span className="ed-blog-summary">{meta.summary}</span>
                            )}
                            {meta.tags.length > 0 && (
                                <ul className="ed-tags">
                                    {meta.tags.map(tag => (
                                        <li className="ed-tag" key={tag}>
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </span>
                        <span className="ed-blog-arrow">↗</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export function Home() {
    const hasPosts = PUBLISHED_POSTS.length > 0;
    const showFeatured = PUBLISHED_POSTS.length >= FEATURED_MIN_POSTS && FEATURED_POSTS.length > 0;

    return (
        <div className="ed">
            <title>Saw Ye Htet — Writing</title>
            <meta
                name="description"
                content="Writing by Saw Ye Htet — notes on IT support, troubleshooting, and building software. Portfolio at /work."
            />
            <Nav />
            <main id="main-content">
                <Masthead />

                <section className="ed-feed ed-container" aria-labelledby="ed-feed-label">
                    {showFeatured && (
                        <div className="ed-featured">
                            <h2 className="ed-feed-label">Featured</h2>
                            <PostList posts={FEATURED_POSTS} />
                        </div>
                    )}

                    <h2 id="ed-feed-label" className="ed-feed-label">
                        {showFeatured ? 'Recent' : 'Writing'}
                    </h2>

                    {hasPosts ? (
                        <PostList posts={PUBLISHED_POSTS} />
                    ) : (
                        <div className="ed-feed-empty">
                            <p>No posts published yet — writing in progress.</p>
                            <Link className="ed-home-cta" to="/work">
                                Meanwhile, see the work
                                <span className="a">→</span>
                            </Link>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}

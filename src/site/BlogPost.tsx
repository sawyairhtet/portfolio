import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Nav } from './Nav';
import { Footer } from './sections/Footer';
import { getPublishedPost, formatPostDate } from './blog/posts';

// Single post at a clean root slug (/<slug>). Only *published* posts resolve — a
// draft (or unknown) slug shows the not-found state, never the draft content.
// This file carries react-markdown, so it is lazy-loaded from App.tsx to keep it
// off the front-door bundle.
export function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const post = getPublishedPost(slug);

    if (!post) {
        return (
            <div className="ed">
                <title>Post not found — Saw Ye Htet</title>
                <Nav />
                <main id="main-content">
                    <section className="ed-section ed-container">
                        <div className="ed-section-head ed-reveal">
                            <span className="ed-section-num">—</span>
                            <h1 className="ed-section-title">Not found</h1>
                            <span className="ed-section-meta">No such post</span>
                        </div>
                        <p className="ed-blog-empty">
                            That post doesn&apos;t exist or hasn&apos;t been published yet.
                        </p>
                        <Link className="ed-blog-back" to="/writing">
                            ← Back to writing
                        </Link>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="ed">
            <title>{`${post.meta.title} — Saw Ye Htet`}</title>
            {post.meta.summary && <meta name="description" content={post.meta.summary} />}
            <Nav />
            <main id="main-content">
                <article className="ed-section ed-container ed-post">
                    <header className="ed-post-head ed-reveal" id="top">
                        <span className="ed-post-meta">
                            {formatPostDate(post.meta.date)} · {post.meta.readingMinutes} min read
                        </span>
                        <h1 className="ed-post-title">{post.meta.title}</h1>
                        {post.meta.summary && (
                            <p className="ed-post-summary">{post.meta.summary}</p>
                        )}
                        {post.meta.tags.length > 0 && (
                            <ul className="ed-tags ed-post-tags">
                                {post.meta.tags.map(tag => (
                                    <li className="ed-tag" key={tag}>
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </header>

                    <div className="ed-prose">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                a({ href, children }) {
                                    const external =
                                        typeof href === 'string' && /^https?:\/\//.test(href);
                                    return external ? (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {children}
                                        </a>
                                    ) : (
                                        <a href={href}>{children}</a>
                                    );
                                },
                            }}
                        >
                            {post.body}
                        </ReactMarkdown>
                    </div>

                    <Link className="ed-blog-back" to="/writing">
                        ← Back to writing
                    </Link>
                </article>
            </main>
            <Footer />
        </div>
    );
}

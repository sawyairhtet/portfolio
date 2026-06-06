import { Link } from 'react-router-dom';
import { PUBLISHED_POSTS, hasPublishedPosts, formatPostDate } from '../blog/posts';

// Homepage teaser (section 06 · Writing). Renders nothing until at least one
// post is published, so the homepage is visually unchanged while the blog is
// still a draft-only skeleton.
export function BlogTeaser() {
    if (!hasPublishedPosts) return null;

    const recent = PUBLISHED_POSTS.slice(0, 2);

    return (
        <section className="ed-section ed-container" id="writing">
            <div className="ed-section-head">
                <span className="ed-section-num">06</span>
                <h2 className="ed-section-title">Writing</h2>
                <span className="ed-section-meta">From the blog</span>
            </div>

            <ul className="ed-blog-list">
                {recent.map(post => (
                    <li className="ed-blog-item" key={post.meta.slug}>
                        <Link className="ed-blog-link" to={`/blog/${post.meta.slug}`}>
                            <span className="ed-blog-date">{formatPostDate(post.meta.date)}</span>
                            <span className="ed-blog-titlewrap">
                                <span className="ed-blog-title">{post.meta.title}</span>
                                <span className="ed-blog-summary">{post.meta.summary}</span>
                            </span>
                            <span className="ed-blog-arrow">↗</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <Link className="ed-link ed-blog-readall" to="/blog">
                Read the blog
                <span className="a">↗</span>
            </Link>
        </section>
    );
}

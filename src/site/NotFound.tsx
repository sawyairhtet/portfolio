import './editorial.css';
import { Link } from 'react-router-dom';
import { Nav } from './Nav';
import { Footer } from './sections/Footer';

// Editorial 404 for the catch-all route. Unknown single-segment paths resolve to
// BlogPost's own not-found (via /:slug); this handles everything else.
export function NotFound() {
    return (
        <div className="ed">
            <title>Not found — Saw Ye Htet</title>
            <Nav />
            <main id="main-content">
                <section className="ed-section ed-container" id="top">
                    <div className="ed-section-head">
                        <span className="ed-section-num">404</span>
                        <h1 className="ed-section-title">Not found</h1>
                        <span className="ed-section-meta">No such page</span>
                    </div>
                    <p className="ed-blog-empty">
                        That page doesn&apos;t exist. Try the writing on the{' '}
                        <Link to="/">home page</Link> or head to the{' '}
                        <Link to="/work">work page</Link>.
                    </p>
                    <Link className="ed-blog-back" to="/">
                        ← Back home
                    </Link>
                </section>
            </main>
            <Footer />
        </div>
    );
}

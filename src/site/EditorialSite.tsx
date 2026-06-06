import './editorial.css';
import { PROFILE } from '../config/profile';
import { Experience } from './sections/Experience';
import { Work } from './sections/Work';
import { Skills } from './sections/Skills';
import { Resume } from './sections/Resume';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';

const FOCUS_AREAS = [
    'Application & Production Support',
    'Incident Triage & Escalation',
    'Log Analysis & Troubleshooting',
    'SQL Debugging & Querying',
    'API Testing & QA',
    'IT Service Management (ITIL)',
];

function Nav() {
    return (
        <header className="ed-nav">
            <div className="ed-nav-inner ed-container">
                <a className="ed-wordmark" href="#top">
                    Saw Ye Htet<span className="dot">.</span>
                </a>
                <nav className="ed-nav-links" aria-label="Primary">
                    <a className="ed-nav-link" href="#about">
                        About
                    </a>
                    <a className="ed-nav-link" href="#experience">
                        Experience
                    </a>
                    <a className="ed-nav-link" href="#projects">
                        Projects
                    </a>
                    <a className="ed-nav-link" href="#skills">
                        Skills
                    </a>
                    <a className="ed-nav-link" href="#contact">
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

function Hero() {
    return (
        <section className="ed-hero ed-container" id="top">
            <div className="ed-hero-top ed-reveal">
                <span className="ed-eyebrow">Portfolio — 2026</span>
                <span className="ed-eyebrow">Singapore · Remote-friendly</span>
            </div>

            <h1 className="ed-hero-head ed-reveal" data-d="1">
                <span>IT Support &amp;</span>
                <span className="accent">Operations</span>
                <span>
                    Specialist<span className="arrow">↘</span>
                </span>
            </h1>

            <div className="ed-hero-foot ed-reveal" data-d="2">
                <div>
                    <p className="ed-hero-lead">
                        Recent Singapore Polytechnic IT graduate who{' '}
                        <strong>troubleshoots methodically</strong>, reads the logs, and documents
                        the fix. Targeting application support, production support, and technical
                        analyst roles.
                    </p>
                    <div className="ed-cta-row">
                        <a
                            className="ed-btn ed-btn-primary"
                            href={PROFILE.resumePath}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Résumé <span className="ed-btn-arrow">↗</span>
                        </a>
                        <a className="ed-btn ed-btn-ghost" href="#contact">
                            Get in touch
                        </a>
                    </div>
                </div>

                <dl className="ed-spec">
                    <div className="ed-spec-row">
                        <dt className="ed-spec-key">Focus</dt>
                        <dd className="ed-spec-val">Application &amp; Production Support</dd>
                    </div>
                    <div className="ed-spec-row">
                        <dt className="ed-spec-key">Stack</dt>
                        <dd className="ed-spec-val">SQL · Linux · Python · React</dd>
                    </div>
                    <div className="ed-spec-row">
                        <dt className="ed-spec-key">Status</dt>
                        <dd className="ed-spec-val">
                            <span className="live">Open to opportunities</span>
                        </dd>
                    </div>
                </dl>
            </div>
        </section>
    );
}

function About() {
    return (
        <section className="ed-section ed-container" id="about">
            <div className="ed-section-head">
                <span className="ed-section-num">01</span>
                <h2 className="ed-section-title">About</h2>
                <span className="ed-section-meta">Who I am</span>
            </div>

            <div className="ed-about-grid">
                <div>
                    <figure className="ed-portrait">
                        <img src="/images/profile-picture.webp" alt="Saw Ye Htet" />
                        <figcaption className="ed-portrait-tag">Saw Ye Htet</figcaption>
                    </figure>
                    <dl className="ed-spec ed-about-meta">
                        <div className="ed-spec-row">
                            <dt className="ed-spec-key">Role</dt>
                            <dd className="ed-spec-val">IT Support &amp; Ops</dd>
                        </div>
                        <div className="ed-spec-row">
                            <dt className="ed-spec-key">Based</dt>
                            <dd className="ed-spec-val">Singapore</dd>
                        </div>
                        <div className="ed-spec-row">
                            <dt className="ed-spec-key">Study</dt>
                            <dd className="ed-spec-val">Dip. IT — Singapore Poly, 2026</dd>
                        </div>
                    </dl>
                </div>

                <div>
                    <p className="ed-lead">
                        I turn rough problems into{' '}
                        <span className="accent">documented, repeatable fixes</span>.
                    </p>
                    <div className="ed-prose">
                        <p>
                            I'm comfortable in SQL, Linux, and Python, and I gravitate toward the work
                            most people avoid: reading stack traces, tailing logs, and chasing a bug
                            to its actual root cause instead of patching the symptom.
                        </p>
                        <p>
                            My target is application or production support at a consultancy or
                            product team — somewhere systematic troubleshooting, clear documentation,
                            and attention to detail are the job, not an afterthought.
                        </p>
                    </div>

                    <div className="ed-focus">
                        <div className="ed-focus-label">Focus areas</div>
                        <ul className="ed-focus-list">
                            {FOCUS_AREAS.map((area, i) => (
                                <li key={area}>
                                    <span className="n">{String(i + 1).padStart(2, '0')}</span>
                                    <span>{area}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function EditorialSite() {
    return (
        <div className="ed">
            <Nav />
            <main id="main-content">
                <Hero />
                <About />
                <Experience />
                <Work />
                <Skills />
                <Resume />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}

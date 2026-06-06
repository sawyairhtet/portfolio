import { PROFILE } from '../../config/profile';

export function Resume() {
    return (
        <section className="ed-section ed-container" id="resume">
            <div className="ed-section-head">
                <span className="ed-section-num">05</span>
                <h2 className="ed-section-title">Résumé</h2>
                <span className="ed-section-meta">PDF · source of truth</span>
            </div>

            <div className="ed-resume-grid">
                <div>
                    <p className="ed-resume-statement">
                        The full résumé lives as a{' '}
                        <span className="accent">one-page PDF</span> — education, coursework, and the
                        proof, ready to forward.
                    </p>
                    <p className="ed-resume-note">
                        Built and maintained by hand, kept current for application support,
                        production support, and technical analyst roles.
                    </p>
                    <div className="ed-cta-row">
                        <a
                            className="ed-btn ed-btn-primary"
                            href={PROFILE.resumePath}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download PDF <span className="ed-btn-arrow">↗</span>
                        </a>
                        <a className="ed-btn ed-btn-ghost" href="#contact">
                            Ask a question
                        </a>
                    </div>
                </div>

                <dl className="ed-spec">
                    <div className="ed-spec-row">
                        <dt className="ed-spec-key">Education</dt>
                        <dd className="ed-spec-val">
                            Diploma in Information Technology — Singapore Polytechnic, 2026
                        </dd>
                    </div>
                    <div className="ed-spec-row">
                        <dt className="ed-spec-key">Target</dt>
                        <dd className="ed-spec-val">{PROFILE.roleTarget}</dd>
                    </div>
                    <div className="ed-spec-row">
                        <dt className="ed-spec-key">Stack</dt>
                        <dd className="ed-spec-val">{PROFILE.primaryStack.join(' · ')}</dd>
                    </div>
                    <div className="ed-spec-row">
                        <dt className="ed-spec-key">Based</dt>
                        <dd className="ed-spec-val">{PROFILE.location}</dd>
                    </div>
                    <div className="ed-spec-row">
                        <dt className="ed-spec-key">Status</dt>
                        <dd className="ed-spec-val">
                            <span className="live">{PROFILE.availability}</span>
                        </dd>
                    </div>
                </dl>
            </div>
        </section>
    );
}

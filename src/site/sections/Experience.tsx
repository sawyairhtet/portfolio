import { EXPERIENCE } from '../../config/editorial-data';

export function Experience() {
    return (
        <section className="ed-section ed-section--tint ed-container" id="experience">
            <div className="ed-section-head">
                <span className="ed-section-num">02</span>
                <h2 className="ed-section-title">Experience</h2>
                <span className="ed-section-meta">Where I have worked</span>
            </div>

            <div className="ed-exp-list">
                {EXPERIENCE.map(item => (
                    <article className="ed-exp-item" key={`${item.org}-${item.period}`}>
                        <header className="ed-exp-head">
                            <div className="ed-exp-titlewrap">
                                <h3 className="ed-exp-org">{item.org}</h3>
                                <p className="ed-exp-role">
                                    <span>{item.role}</span>
                                    {item.location && (
                                        <>
                                            <span className="sep">/</span>
                                            <span>{item.location}</span>
                                        </>
                                    )}
                                </p>
                            </div>
                            <span className="ed-exp-period">{item.period}</span>
                        </header>

                        <ul className="ed-exp-bullets">
                            {item.bullets.map(bullet => (
                                <li key={bullet}>{bullet}</li>
                            ))}
                        </ul>

                        {item.stack && item.stack.length > 0 && (
                            <div className="ed-exp-stack">
                                <span className="ed-side-label">Stack</span>
                                <div className="ed-chip-row">
                                    {item.stack.map(tech => (
                                        <span key={tech} className="ed-chip">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
}

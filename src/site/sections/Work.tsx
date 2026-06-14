import { PROJECTS } from '../../config/editorial-data';

const isExternal = (href: string) => href.startsWith('http');

export function Work() {
    if (PROJECTS.length === 0) return null;

    return (
        <section className="ed-section ed-container" id="projects">
            <div className="ed-section-head">
                <span className="ed-section-num">03</span>
                <h2 className="ed-section-title">Projects</h2>
                <span className="ed-section-meta">Selected work</span>
            </div>

            <div className="ed-work-list">
                {PROJECTS.map(project => (
                    <article className="ed-work-item" key={project.id}>
                        <div className="ed-work-head">
                            <div className="ed-work-titlewrap">
                                <h3 className="ed-work-title">{project.title}</h3>
                                <p className="ed-work-sub">
                                    <span>{project.role}</span>
                                    <span className="sep">/</span>
                                    <span>{project.platform}</span>
                                </p>
                            </div>
                            <div className="ed-link-row">
                                {project.links.map(link => (
                                    <a
                                        key={link.href}
                                        className="ed-link"
                                        href={link.href}
                                        target={isExternal(link.href) ? '_blank' : undefined}
                                        rel={
                                            isExternal(link.href)
                                                ? 'noopener noreferrer'
                                                : undefined
                                        }
                                    >
                                        {link.label}
                                        <span className="a">↗</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {project.media && (
                            <figure className="ed-work-shot">
                                <img
                                    src={project.media.src}
                                    alt={project.media.alt}
                                    loading="lazy"
                                />
                                <figcaption>{project.platform}</figcaption>
                            </figure>
                        )}

                        <div className="ed-work-grid">
                            <div className="ed-narrative">
                                <div className="ed-narr-row">
                                    <span className="ed-narr-key">Problem</span>
                                    <p>{project.problem}</p>
                                </div>
                                <div className="ed-narr-row">
                                    <span className="ed-narr-key">Approach</span>
                                    <p>{project.solution}</p>
                                </div>
                                <div className="ed-narr-row">
                                    <span className="ed-narr-key">Outcome</span>
                                    <p>{project.impact}</p>
                                </div>
                            </div>

                            <div className="ed-work-side">
                                <div>
                                    <div className="ed-side-label">Built with</div>
                                    <div className="ed-chip-row">
                                        {project.techStack.map(tech => (
                                            <span key={tech} className="ed-chip">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="ed-side-label">What it proves</div>
                                    <ul className="ed-proof">
                                        {project.proofPoints.map((point, i) => (
                                            <li key={point}>
                                                <span className="n">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

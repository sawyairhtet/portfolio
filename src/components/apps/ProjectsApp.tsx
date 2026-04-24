import { PROJECTS } from '../../config/data';

export function ProjectsApp() {
    const featured = PROJECTS.find(project => project.featured);
    const supporting = PROJECTS.filter(project => !project.featured);

    return (
        <div className="projects-app">
            {featured && (
                <article className="featured-project-panel">
                    <div className="project-media-frame">
                        {featured.media ? (
                            <img src={featured.media.src} alt={featured.media.alt} />
                        ) : (
                            <div className="project-media-fallback">
                                <i className={featured.icon} aria-hidden="true" />
                                <span>{featured.platform}</span>
                            </div>
                        )}
                    </div>
                    <div className="project-detail">
                        <span className="project-badge">Featured</span>
                        <h2>{featured.title}</h2>
                        <p className="project-role">
                            {featured.role} / {featured.platform}
                        </p>
                        <p>{featured.summary}</p>
                        <div className="tech-stack">
                            {featured.techStack.map(tech => (
                                <span key={tech} className="tech-badge">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <ul className="proof-list">
                            {featured.proofPoints.map(point => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                        <div className="project-actions">
                            {featured.links.map(link => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    target={link.href.startsWith('http') ? '_blank' : undefined}
                                    rel={
                                        link.href.startsWith('http')
                                            ? 'noopener noreferrer'
                                            : undefined
                                    }
                                    className={`project-action${link.primary ? ' primary' : ''}`}
                                >
                                    <i className={link.icon} aria-hidden="true" />
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </article>
            )}

            <div className="projects-grid">
                {supporting.map(project => (
                    <article key={project.id} className="project-card">
                        <div className="project-preview">
                            {project.media ? (
                                <img src={project.media.src} alt={project.media.alt} />
                            ) : (
                                <i className={project.icon} aria-hidden="true" />
                            )}
                        </div>
                        <h3>{project.title}</h3>
                        <p className="project-role">
                            {project.role} / {project.platform}
                        </p>
                        <p>{project.summary}</p>
                        <div className="tech-stack">
                            {project.techStack.map(tech => (
                                <span key={tech} className="tech-badge">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <ul className="proof-list compact">
                            {project.proofPoints.slice(0, 2).map(point => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                        <div className="project-actions">
                            {project.links.map(link => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    target={link.href.startsWith('http') ? '_blank' : undefined}
                                    rel={
                                        link.href.startsWith('http')
                                            ? 'noopener noreferrer'
                                            : undefined
                                    }
                                    className={`project-action${link.primary ? ' primary' : ''}`}
                                >
                                    <i className={link.icon} aria-hidden="true" />
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

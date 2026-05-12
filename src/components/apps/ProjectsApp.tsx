import { useEffect } from 'react';
import { PROJECTS } from '../../config/data';
import type { Project } from '../../types';

function ProjectLinks({ project }: { project: Project }) {
    return (
        <div className="adw-project-actions">
            {project.links.map(link => (
                <a
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`adw-btn${link.primary ? ' adw-btn-suggested' : ''}`}
                >
                    <i className={link.icon} aria-hidden="true" />
                    {link.label}
                </a>
            ))}
        </div>
    );
}

function ProjectBrief({ project, compact = false }: { project: Project; compact?: boolean }) {
    const items = [
        { label: 'Problem', value: project.problem, icon: 'fas fa-circle-question' },
        { label: 'Solution', value: project.solution, icon: 'fas fa-screwdriver-wrench' },
        { label: 'Impact', value: project.impact, icon: 'fas fa-bullseye' },
    ];

    return (
        <div
            className={`adw-project-brief${compact ? ' adw-project-brief-compact' : ''}`}
            aria-label={`${project.title} project brief`}
        >
            {items.map(item => (
                <div key={item.label} className="adw-project-brief-item">
                    <span className="adw-project-brief-label">
                        <i className={item.icon} aria-hidden="true" />
                        {item.label}
                    </span>
                    <p>{item.value}</p>
                </div>
            ))}
        </div>
    );
}

function FeaturedProject({ project }: { project: Project }) {
    return (
        <article
            className="adw-featured-project"
            data-project={project.id}
            aria-labelledby={`featured-${project.id}-title`}
        >
            <div className="adw-featured-media">
                {project.media ? (
                    <img src={project.media.src} alt={project.media.alt} loading="lazy" />
                ) : (
                    <div className="adw-featured-media-fallback">
                        <i className={project.icon} aria-hidden="true" />
                        <span>{project.platform}</span>
                    </div>
                )}
                <span className="adw-featured-pill">
                    <i className="fas fa-star" aria-hidden="true" />
                    Featured Project
                </span>
            </div>
            <div className="adw-featured-content">
                <header className="adw-featured-header">
                    <h3 id={`featured-${project.id}-title`}>{project.title}</h3>
                    <p className="adw-featured-role">
                        <span>{project.role}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.platform}</span>
                    </p>
                </header>

                <p className="adw-featured-summary">{project.summary}</p>

                <ProjectBrief project={project} />

                <div className="adw-impact-callout">
                    <div className="adw-impact-icon">
                        <i className="fas fa-code-branch" aria-hidden="true" />
                    </div>
                    <div className="adw-impact-text">
                        <span className="adw-impact-label">Proof</span>
                        <p>Concrete implementation details, not inflated claims.</p>
                    </div>
                </div>

                <ul className="adw-proof-list">
                    {project.proofPoints.map(point => (
                        <li key={point}>
                            <i className="fas fa-check" aria-hidden="true" />
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>

                <div className="adw-tech-stack">
                    {project.techStack.map(tech => (
                        <span key={tech} className="adw-tech-tag">
                            {tech}
                        </span>
                    ))}
                </div>

                <ProjectLinks project={project} />
            </div>
        </article>
    );
}

function ProjectCard({ project }: { project: Project }) {
    return (
        <article
            className="adw-project-card"
            data-project={project.id}
            aria-labelledby={`card-${project.id}-title`}
        >
            <div className="adw-project-card-media">
                {project.media ? (
                    <img src={project.media.src} alt={project.media.alt} loading="lazy" />
                ) : (
                    <div className="adw-project-card-media-fallback">
                        <i className={project.icon} aria-hidden="true" />
                    </div>
                )}
                <span className="adw-project-card-platform">{project.platform}</span>
                {project.status === 'wip' && (
                    <span className="adw-wip-badge">
                        <i className="fas fa-hammer" aria-hidden="true" />
                        Work in Progress
                    </span>
                )}
            </div>
            <div className="adw-project-card-body">
                <h3 id={`card-${project.id}-title`}>{project.title}</h3>
                <p className="adw-project-card-role">{project.role}</p>
                <p className="adw-project-card-summary">{project.summary}</p>

                <ProjectBrief project={project} compact />

                <div className="adw-tech-stack adw-tech-stack-compact">
                    {project.techStack.slice(0, 4).map(tech => (
                        <span key={tech} className="adw-tech-tag">
                            {tech}
                        </span>
                    ))}
                    {project.techStack.length > 4 && (
                        <span className="adw-tech-tag adw-tech-tag-more">
                            +{project.techStack.length - 4}
                        </span>
                    )}
                </div>

                <ProjectLinks project={project} />
            </div>
        </article>
    );
}

export function ProjectsApp() {
    const featured = PROJECTS.find(project => project.featured);
    const supporting = PROJECTS.filter(project => !project.featured);
    const totalTech = new Set(PROJECTS.flatMap(p => p.techStack)).size;

    useEffect(() => {
        const projectId = sessionStorage.getItem('portfolioProjectFocus');
        if (!projectId) return;

        sessionStorage.removeItem('portfolioProjectFocus');

        const frame = requestAnimationFrame(() => {
            const target = document.querySelector<HTMLElement>(`[data-project="${projectId}"]`);
            if (!target) return;

            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            target.scrollIntoView({
                block: 'nearest',
                behavior: reduceMotion ? 'auto' : 'smooth',
            });
            target.classList.add('project-search-focus');
            window.setTimeout(() => target.classList.remove('project-search-focus'), 1600);
        });

        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div className="adw-page projects-page">
            {/* Status header — Adwaita compact */}
            <header className="adw-status-header">
                <div className="adw-status-row">
                    <div className="adw-status-icon adw-icon-blue">
                        <i className="fas fa-folder-open" aria-hidden="true" />
                    </div>
                    <div className="adw-status-text">
                        <h2>Projects</h2>
                        <p>
                            Problem, solution, stack, and impact for {PROJECTS.length} project
                            {PROJECTS.length !== 1 ? 's' : ''} · {totalTech} technologies
                        </p>
                    </div>
                </div>
            </header>

            {featured && (
                <section className="adw-section" aria-label="Featured project">
                    <FeaturedProject project={featured} />
                </section>
            )}

            {supporting.length > 0 && (
                <section className="adw-section">
                    <h3 className="adw-section-title">More Projects</h3>
                    <div className="adw-project-grid">
                        {supporting.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

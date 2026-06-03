import { memo, useEffect, useRef } from 'react';
import { Icon } from '../ui/Icon';
import { PROJECTS } from '../../config/data';
import type { Project } from '../../types';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Star,
    CheckCircle,
    ArrowSquareOut,
    GithubLogo,
    Hammer,
    GlobeSimple,
} from '@phosphor-icons/react';

// The featured project is this live site; analytics domain doubles as the canonical URL.
const LIVE_SITE_URL = 'sawyehtet.com';

const TECH_BRAND_COLORS: Record<string, string> = {
    Java: '#ED8B00',
    React: '#61DAFB',
    TypeScript: '#3178C6',
    JavaScript: '#F7DF1E',
    Python: '#3776AB',
    SQL: '#336791',
    PostgreSQL: '#336791',
    Vite: '#646CFF',
    CSS: '#264DE4',
    HTML: '#E34F26',
    Docker: '#2496ED',
    Git: '#F05032',
    Tailwind: '#06B6D4',
};

const TECH_BRAND_COLOR_MAP = new Map(Object.entries(TECH_BRAND_COLORS));

function TechChip({ tech }: { tech: string }) {
    const color = TECH_BRAND_COLOR_MAP.get(tech);
    const style = color
        ? {
              background: `color-mix(in srgb, ${color} 15%, transparent)`,
              borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
              color,
          }
        : undefined;

    return (
        <span className="project-tech-chip" style={style}>
            {tech}
        </span>
    );
}

function ProjectLinks({ project }: { project: Project }) {
    return (
        <div className="project-links-v2">
            {project.links.map(link => (
                <a
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`project-link-btn${link.primary ? ' primary' : ''}`}
                >
                    {link.label.toLowerCase().includes('github') ? (
                        <GithubLogo weight="bold" size={15} />
                    ) : (
                        <ArrowSquareOut weight="bold" size={15} />
                    )}
                    {link.label}
                </a>
            ))}
        </div>
    );
}

function FeaturedProject({ project }: { project: Project }) {
    const reduced = useReducedMotion();

    return (
        <motion.article
            className="project-featured-v2"
            data-project={project.id}
            aria-labelledby={`featured-${project.id}-title`}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
        >
            <div className="project-browser">
                <div className="project-browser-bar">
                    <span className="project-browser-dots" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                    </span>
                    <span className="project-browser-url">
                        <GlobeSimple weight="bold" size={12} />
                        {LIVE_SITE_URL}
                    </span>
                </div>
                <div className="project-browser-screen">
                    {project.media ? (
                        <img src={project.media.src} alt={project.media.alt} loading="lazy" />
                    ) : (
                        <div className="project-featured-fallback">
                            <Icon name={project.icon} />
                            <span>{project.platform}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="project-featured-info">
                <header>
                    <div className="project-title-row">
                        <h2 id={`featured-${project.id}-title`}>{project.title}</h2>
                        <span className="project-featured-chip">
                            <Star weight="fill" size={11} />
                            Featured
                        </span>
                    </div>
                    <p className="project-featured-role">
                        <span>{project.role}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.platform}</span>
                    </p>
                </header>

                <p className="project-featured-summary">{project.summary}</p>

                <div className="project-featured-block">
                    <h3 className="project-subsection-label">Highlights</h3>
                    <ul className="project-proof-list">
                        {project.proofPoints.map(point => (
                            <li key={point}>
                                <CheckCircle weight="fill" size={14} className="proof-check" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="project-featured-block">
                    <h3 className="project-subsection-label">Built with</h3>
                    <div className="project-tech-row">
                        {project.techStack.map(tech => (
                            <TechChip key={tech} tech={tech} />
                        ))}
                    </div>
                </div>

                <ProjectLinks project={project} />
            </div>
        </motion.article>
    );
}

function ProjectCard({ project }: { project: Project }) {
    const reduced = useReducedMotion();

    return (
        <motion.article
            className="project-card-v3"
            data-project={project.id}
            aria-labelledby={`card-${project.id}-title`}
            whileHover={reduced ? undefined : { y: -3 }}
            transition={{ duration: 0.2 }}
        >
            <div className="project-card-v3-media">
                {project.media ? (
                    <img src={project.media.src} alt={project.media.alt} loading="lazy" />
                ) : (
                    <div className="project-card-v3-fallback">
                        <Icon name={project.icon} />
                    </div>
                )}
                <span className="project-card-platform">{project.platform}</span>
                {project.status === 'wip' && (
                    <span className="project-wip-badge">
                        <Hammer weight="bold" size={10} />
                        WIP
                    </span>
                )}
            </div>
            <div className="project-card-v3-body">
                <h3 id={`card-${project.id}-title`}>{project.title}</h3>
                <p className="project-card-v3-summary">{project.summary}</p>
                <div className="project-tech-row project-tech-compact">
                    {project.techStack.slice(0, 4).map(tech => (
                        <TechChip key={tech} tech={tech} />
                    ))}
                    {project.techStack.length > 4 && (
                        <span className="project-tech-chip project-tech-more">
                            +{project.techStack.length - 4}
                        </span>
                    )}
                </div>
                <ProjectLinks project={project} />
            </div>
        </motion.article>
    );
}

export const ProjectsApp = memo(function ProjectsApp() {
    const featured = PROJECTS.find(project => project.featured);
    const supporting = PROJECTS.filter(project => !project.featured);
    const scrollRef = useRef<HTMLDivElement>(null);

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
        <div className="projects-redesign">
            <h1 className="sr-only">Projects</h1>
            {featured && (
                <section aria-label="Featured project">
                    <FeaturedProject project={featured} />
                </section>
            )}

            {supporting.length > 0 && (
                <section className="projects-other-section">
                    <h2 className="projects-section-label">More Projects</h2>
                    <div className="projects-card-grid" ref={scrollRef}>
                        {supporting.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
});

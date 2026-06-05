import { useState } from 'react';
import { PROFILE, SOCIAL_LINKS } from '../../config/profile';
import { SKILL_CATEGORIES, PROJECTS } from '../../config/data';
import { useTheme } from '../../context/ThemeContext';
import { Icon } from '../ui/Icon';

const LEVEL_DOTS: Record<string, number> = {
    proficient: 3,
    intermediate: 2,
    learning: 1,
};

function SkillMeter({ level }: { level: string }) {
    // eslint-disable-next-line security/detect-object-injection -- level is a static data enum, not user input
    const filled = LEVEL_DOTS[level] ?? 0;
    return (
        <span
            className={`mobile-skill-meter level-${level}`}
            role="img"
            aria-label={`${level} proficiency`}
        >
            {[0, 1, 2].map(i => (
                <span key={i} className={`dot${i < filled ? ' filled' : ''}`} />
            ))}
        </span>
    );
}

export function MobileShell() {
    const { isDark, toggle } = useTheme();
    const [forceDesktop, setForceDesktop] = useState(false);

    if (forceDesktop) {
        localStorage.setItem('forceDesktop', 'true');
        window.location.reload();
        return null;
    }

    return (
        <div className="mobile-shell">
            <div className="mobile-topbar">
                <span className="mobile-topbar-brand">
                    <Icon name="fedora" />
                    {PROFILE.name}
                </span>
                <button
                    type="button"
                    className="mobile-theme-toggle"
                    onClick={toggle}
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    title={isDark ? 'Light mode' : 'Dark mode'}
                >
                    <Icon name={isDark ? 'sun' : 'moon'} />
                </button>
            </div>

            <header className="mobile-hero">
                <div className="mobile-avatar-ring">
                    <img
                        className="mobile-avatar"
                        src="/images/profile-picture.webp"
                        alt={PROFILE.name}
                        width={96}
                        height={96}
                        loading="eager"
                    />
                </div>
                <h1>{PROFILE.name}</h1>
                <p className="mobile-role">{PROFILE.role}</p>
                <p className="mobile-tagline">{PROFILE.headline}</p>
                <div className="mobile-actions">
                    <a href={PROFILE.resumePath} className="mobile-btn primary" download>
                        <Icon name="file-pdf" />
                        Resume PDF
                    </a>
                    <a href={`mailto:${PROFILE.email}`} className="mobile-btn">
                        <Icon name="envelope" />
                        Email
                    </a>
                </div>
                <div className="mobile-meta">
                    <span className="mobile-meta-chip available">
                        <span className="mobile-status-dot" />
                        {PROFILE.availability}
                    </span>
                    <span className="mobile-meta-chip">{PROFILE.location}</span>
                </div>
            </header>

            <section className="mobile-card" id="mobile-about">
                <div className="mobile-card-head">
                    <span className="mobile-card-icon">
                        <Icon name="user-circle" />
                    </span>
                    <h2>About</h2>
                </div>
                <p className="mobile-lead">{PROFILE.summary}</p>
                <dl className="mobile-info-grid">
                    <div>
                        <dt>Education</dt>
                        <dd>{PROFILE.education}</dd>
                    </div>
                    <div>
                        <dt>Target roles</dt>
                        <dd>{PROFILE.roleTarget}</dd>
                    </div>
                    <div>
                        <dt>Location</dt>
                        <dd>{PROFILE.location}</dd>
                    </div>
                    <div>
                        <dt>Availability</dt>
                        <dd>{PROFILE.availability}</dd>
                    </div>
                </dl>
            </section>

            <section className="mobile-card" id="mobile-skills">
                <div className="mobile-card-head">
                    <span className="mobile-card-icon">
                        <Icon name="bolt" />
                    </span>
                    <h2>Skills</h2>
                </div>
                <div className="mobile-skill-groups">
                    {SKILL_CATEGORIES.map(cat => (
                        <div key={cat.title} className="mobile-skill-category">
                            <h3>
                                <Icon name={cat.icon} />
                                {cat.title}
                            </h3>
                            <ul className="mobile-skill-list">
                                {cat.skills.map(skill => (
                                    <li key={skill.name} className="mobile-skill-row">
                                        <div className="mobile-skill-top">
                                            <span className="mobile-skill-name">{skill.name}</span>
                                            <SkillMeter level={skill.level} />
                                        </div>
                                        <p className="mobile-skill-context">{skill.context}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mobile-card" id="mobile-projects">
                <div className="mobile-card-head">
                    <span className="mobile-card-icon">
                        <Icon name="folder" />
                    </span>
                    <h2>Projects</h2>
                </div>
                <div className="mobile-projects">
                    {PROJECTS.map(project => (
                        <article key={project.id} className="mobile-project-card">
                            {project.media && (
                                <img
                                    className="mobile-project-media"
                                    src={project.media.src}
                                    alt={project.media.alt}
                                    loading="lazy"
                                />
                            )}
                            <div className="mobile-project-body">
                                <div className="mobile-project-title-row">
                                    <h3>{project.title}</h3>
                                    {project.status === 'wip' && (
                                        <span className="mobile-badge wip">In progress</span>
                                    )}
                                </div>
                                <p className="mobile-project-role">
                                    {project.role} · {project.platform}
                                </p>
                                <p className="mobile-project-summary">{project.summary}</p>
                                <div className="mobile-tech-chips">
                                    {project.techStack.map(tech => (
                                        <span key={tech} className="mobile-tech-chip">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <div className="mobile-project-links">
                                    {project.links.map(link => (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`mobile-btn${link.primary ? ' primary' : ''}`}
                                        >
                                            <Icon name={link.icon} />
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mobile-card" id="mobile-contact">
                <div className="mobile-card-head">
                    <span className="mobile-card-icon">
                        <Icon name="envelope" />
                    </span>
                    <h2>Contact</h2>
                </div>
                <a href={`mailto:${PROFILE.email}`} className="mobile-contact-email">
                    <Icon name="envelope" />
                    <span>{PROFILE.email}</span>
                </a>
                <div className="mobile-social-grid">
                    {SOCIAL_LINKS.map(link => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mobile-social-btn"
                        >
                            <Icon name={link.icon} />
                            <span className="mobile-social-label">{link.label}</span>
                            <span className="mobile-social-handle">{link.handle}</span>
                        </a>
                    ))}
                </div>
            </section>

            <footer className="mobile-footer">
                <button
                    type="button"
                    className="mobile-btn desktop-toggle"
                    onClick={() => setForceDesktop(true)}
                >
                    <Icon name="desktop" />
                    Switch to Desktop View
                </button>
                <p>
                    &copy; {new Date().getFullYear()} {PROFILE.name}
                </p>
            </footer>
        </div>
    );
}

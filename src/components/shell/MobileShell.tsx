import { useState } from 'react';
import { PROFILE, SOCIAL_LINKS } from '../../config/profile';
import { SKILL_CATEGORIES, PROJECTS } from '../../config/data';
import { useTheme } from '../../context/ThemeContext';
import { Icon } from '../ui/Icon';

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
            <button
                type="button"
                className="mobile-theme-toggle"
                onClick={toggle}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Light mode' : 'Dark mode'}
            >
                <Icon name={isDark ? 'sun' : 'moon'} />
            </button>

            <header className="mobile-hero">
                <h1>{PROFILE.name}</h1>
                <p className="mobile-role">{PROFILE.role}</p>
                <p className="mobile-bio">{PROFILE.summary}</p>
                <div className="mobile-actions">
                    <a href={PROFILE.resumePath} className="mobile-btn primary">
                        Resume PDF
                    </a>
                    <a href={`mailto:${PROFILE.email}`} className="mobile-btn">
                        Email
                    </a>
                </div>
            </header>

            <section className="mobile-section" id="mobile-about">
                <h2>About</h2>
                <p>{PROFILE.summary}</p>
                <p>
                    <strong>Education:</strong> {PROFILE.education}
                </p>
                <p>
                    <strong>Target:</strong> {PROFILE.roleTarget}
                </p>
                <p>
                    <strong>Location:</strong> {PROFILE.location}
                </p>
                <p>
                    <strong>Availability:</strong> {PROFILE.availability}
                </p>
                <div className="mobile-social">
                    {SOCIAL_LINKS.map(link => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mobile-btn"
                        >
                            <Icon name={link.icon} />
                            {link.label}
                        </a>
                    ))}
                </div>
            </section>

            <section className="mobile-section" id="mobile-skills">
                <h2>Skills</h2>
                {SKILL_CATEGORIES.map(cat => (
                    <div key={cat.title} className="mobile-skill-category">
                        <h3>{cat.title}</h3>
                        <ul>
                            {cat.skills.map(skill => (
                                <li key={skill.name}>
                                    <strong>{skill.name}</strong>
                                    <span className={`mobile-skill-level level-${skill.level}`}>
                                        {skill.level}
                                    </span>
                                    <br />
                                    <small>{skill.context}</small>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            <section className="mobile-section" id="mobile-projects">
                <h2>Projects</h2>
                {PROJECTS.map(project => (
                    <div key={project.id} className="mobile-project-card">
                        <h3>{project.title}</h3>
                        <p className="mobile-project-role">
                            {project.role} · {project.platform}
                        </p>
                        <p>{project.summary}</p>
                        <div className="mobile-tech-chips">
                            {project.techStack.map(tech => (
                                <span key={tech} className="mobile-tech-chip">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        {project.links.map(link => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mobile-btn"
                            >
                                <Icon name={link.icon} />
                                {link.label}
                            </a>
                        ))}
                    </div>
                ))}
            </section>

            <section className="mobile-section" id="mobile-contact">
                <h2>Contact</h2>
                <p>
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                </p>
                <p>
                    <strong>Location:</strong> {PROFILE.location}
                </p>
                <p>
                    <strong>Status:</strong> {PROFILE.availability}
                </p>
                <div className="mobile-social">
                    {SOCIAL_LINKS.map(link => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mobile-btn"
                        >
                            <Icon name={link.icon} />
                            {link.label}
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
                    Switch to Desktop View
                </button>
                <p>&copy; {new Date().getFullYear()} {PROFILE.name}</p>
            </footer>
        </div>
    );
}

import { useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PROJECTS, APP_DEFINITIONS } from '../../config/data';
import { PROFILE } from '../../config/profile';
import { useWindowManager } from '../../context/WindowManagerContext';
import {
    Package,
    DownloadSimple,
    ArrowSquareOut,
    GithubLogo,
    FolderOpen,
    Wrench,
    Globe,
    Circle,
    Check,
    MagnifyingGlass,
    CaretDown,
    CaretUp,
} from '@phosphor-icons/react';

type ProjectStatus = 'all' | 'completed' | 'wip';

const CATEGORIES = [
    { id: 'all' as const, label: 'All', icon: Package },
    { id: 'completed' as const, label: 'Completed', icon: Check },
    { id: 'wip' as const, label: 'In Progress', icon: Wrench },
];

export function SoftwareApp() {
    const reduced = useReducedMotion();
    const { openWindow } = useWindowManager();
    const [activeCategory, setActiveCategory] = useState<ProjectStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [installedIds, setInstalledIds] = useState<Set<string>>(
        () => new Set(PROJECTS.filter(p => p.featured).map(p => p.id))
    );

    const toggleInstall = useCallback((id: string) => {
        setInstalledIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const toggleExpanded = useCallback((id: string) => {
        setExpandedId(prev => (prev === id ? null : id));
    }, []);

    const filteredProjects = PROJECTS.filter(project => {
        const matchesCategory = activeCategory === 'all' || project.status === activeCategory;
        const matchesSearch = !searchQuery ||
            [project.title, project.summary, project.platform, ...project.techStack]
                .join(' ')
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="software-app">
            <div className="software-header">
                <div className="software-banner">
                    <div className="software-banner-glow" aria-hidden="true" />
                    <Package weight="duotone" size={28} />
                    <div className="software-banner-text">
                        <h2>Explore Software</h2>
                        <p>Browse projects as installable applications. Each one is a real codebase you can explore, clone, and contribute to.</p>
                    </div>
                </div>
            </div>

            <div className="software-controls">
                <div className="software-search">
                    <MagnifyingGlass weight="bold" size={16} />
                    <input
                        type="text"
                        placeholder="Search software..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        aria-label="Search software"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            aria-label="Clear search"
                            onClick={() => setSearchQuery('')}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    )}
                </div>
                <div className="software-categories" role="radiogroup" aria-label="Filter by status">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            role="radio"
                            aria-checked={activeCategory === cat.id}
                            className={`software-category ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <cat.icon weight="duotone" size={14} />
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="software-grid" role="list" aria-label="Projects">
                {filteredProjects.length === 0 ? (
                    <div className="software-empty">
                        <Package weight="duotone" size={48} />
                        <strong>No matching software</strong>
                        <p>Try a different category or search term.</p>
                    </div>
                ) : (
                    filteredProjects.map((project, i) => {
                        const isExpanded = expandedId === project.id;
                        const isInstalled = installedIds.has(project.id);
                        const projectApp = APP_DEFINITIONS.find(app =>
                            app.aliases.includes(project.id) || app.id === 'projects'
                        );

                        return (
                            <motion.div
                                key={project.id}
                                className={`software-card ${isExpanded ? 'expanded' : ''} ${isInstalled ? 'installed' : ''}`}
                                role="listitem"
                                initial={reduced ? undefined : { opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04, duration: 0.3 }}
                                layout
                            >
                                <div className="software-card-main">
                                    <div
                                        className="software-card-icon"
                                        style={{ background: projectApp?.gradient || 'linear-gradient(135deg, var(--blue-3), var(--accent-blue))' }}
                                    >
                                        {isInstalled && <Check weight="fill" size={12} className="software-installed-badge" />}
                                        <FolderOpen weight="duotone" size={28} />
                                    </div>
                                    <div className="software-card-content" onClick={() => toggleExpanded(project.id)}>
                                        <div className="software-card-header">
                                            <div className="software-card-title-row">
                                                <h3>{project.title}</h3>
                                                {project.status === 'wip' && (
                                                    <span className="software-wip-badge">WIP</span>
                                                )}
                                            </div>
                                            <span className="software-card-platform">
                                                <Globe weight="bold" size={12} />
                                                {project.platform}
                                            </span>
                                        </div>
                                        <p className="software-card-summary">{project.summary}</p>
                                        <div className="software-card-tech">
                                            {project.techStack.map(tech => (
                                                <span key={tech} className="software-tech-chip">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="software-card-actions">
                                        {project.links[0] && (
                                            <motion.a
                                                href={project.links[0].href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="software-install-btn primary"
                                                whileHover={reduced ? undefined : { scale: 1.04 }}
                                                whileTap={reduced ? undefined : { scale: 0.96 }}
                                                aria-label={`View ${project.title} on GitHub`}
                                            >
                                                <GithubLogo weight="bold" size={16} />
                                                <span>Source</span>
                                            </motion.a>
                                        )}
                                        <motion.button
                                            type="button"
                                            className={`software-install-btn ${isInstalled ? 'installed-state' : ''}`}
                                            onClick={() => toggleInstall(project.id)}
                                            whileHover={reduced ? undefined : { scale: 1.04 }}
                                            whileTap={reduced ? undefined : { scale: 0.96 }}
                                            aria-label={isInstalled ? `Uninstall ${project.title}` : `Install ${project.title}`}
                                        >
                                            {isInstalled ? (
                                                <>
                                                    <Check weight="bold" size={14} />
                                                    <span>Installed</span>
                                                </>
                                            ) : (
                                                <>
                                                    <DownloadSimple weight="bold" size={14} />
                                                    <span>Install</span>
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                    <button
                                        type="button"
                                        className="software-expand-toggle"
                                        onClick={() => toggleExpanded(project.id)}
                                        aria-expanded={isExpanded}
                                        aria-label={isExpanded ? 'Show less' : 'Show more'}
                                    >
                                        {isExpanded ? <CaretUp weight="bold" size={14} /> : <CaretDown weight="bold" size={14} />}
                                    </button>
                                </div>

                                {isExpanded && (
                                    <motion.div
                                        className="software-card-details"
                                        initial={reduced ? undefined : { opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={reduced ? undefined : { opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="software-detail-section">
                                            <h4>Problem</h4>
                                            <p>{project.problem}</p>
                                        </div>
                                        <div className="software-detail-section">
                                            <h4>Solution</h4>
                                            <p>{project.solution}</p>
                                        </div>
                                        <div className="software-detail-section">
                                            <h4>Impact</h4>
                                            <p>{project.impact}</p>
                                        </div>
                                        <div className="software-detail-section">
                                            <h4>Proof Points</h4>
                                            <ul>
                                                {project.proofPoints.map((point, idx) => (
                                                    <li key={idx}>
                                                        <Circle weight="fill" size={6} />
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="software-detail-links">
                                            {project.links.map(link => (
                                                <motion.a
                                                    key={link.href}
                                                    href={link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`software-link-btn ${link.primary ? 'primary' : ''}`}
                                                    whileHover={reduced ? undefined : { scale: 1.02 }}
                                                    whileTap={reduced ? undefined : { scale: 0.97 }}
                                                >
                                                    <ArrowSquareOut weight="bold" size={14} />
                                                    <span>{link.label}</span>
                                                </motion.a>
                                            ))}
                                            <button
                                                type="button"
                                                className="software-link-btn"
                                                onClick={() => openWindow('projects')}
                                            >
                                                <FolderOpen weight="bold" size={14} />
                                                <span>View in Projects</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })
                )}
            </div>

            <div className="software-footer">
                <div className="software-stats">
                    <div className="software-stat">
                        <strong>{PROJECTS.length}</strong>
                        <span>Packages</span>
                    </div>
                    <div className="software-stat">
                        <strong>{installedIds.size}</strong>
                        <span>Installed</span>
                    </div>
                    <div className="software-stat">
                        <strong>{PROJECTS.filter(p => p.status === 'wip').length}</strong>
                        <span>In Progress</span>
                    </div>
                    <div className="software-stat">
                        <strong>{PROFILE.education.split(',')[0]}</strong>
                        <span>Developer</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

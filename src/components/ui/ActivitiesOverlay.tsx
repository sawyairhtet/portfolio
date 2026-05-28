import {
    useState,
    useCallback,
    useMemo,
    useEffect,
    useRef,
    type MouseEvent,
    type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { APP_DEFINITIONS, PROJECTS } from '../../config/data';
import type { AppId, Project } from '../../types';

interface ActivitiesOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    workspaceIndex?: number;
}

export function ActivitiesOverlay({ isOpen, onClose, workspaceIndex = 0 }: ActivitiesOverlayProps) {
    const { openWindow, windows } = useWindowManager();
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Focus search on open, restore previous focus on close
    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            const previousFocus = document.activeElement as HTMLElement | null;
            setTimeout(() => inputRef.current?.focus(), 100);
            return () => {
                previousFocus?.focus();
            };
        }
    }, [isOpen]);

    // Focus trap: keep Tab inside the overlay while open
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            const overlay = overlayRef.current;
            if (!overlay) return;

            const focusable = Array.from(
                overlay.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
                )
            ).filter(el => el.offsetParent !== null);

            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const normalizedSearch = searchQuery.trim().toLowerCase();

    const filteredApps = useMemo(() => {
        if (!normalizedSearch) return APP_DEFINITIONS;
        const q = searchQuery.toLowerCase();
        return APP_DEFINITIONS.filter(app => {
            const searchable = [app.label, app.description, ...app.aliases].join(' ').toLowerCase();
            return searchable.includes(q);
        });
    }, [normalizedSearch, searchQuery]);

    const openWindowEntries = useMemo(() => {
        return Array.from(windows.entries())
            .filter(([, w]) => w.isOpen)
            .map(([id, windowInfo]) => ({
                id,
                windowInfo,
                app: APP_DEFINITIONS.find(app => app.id === id),
            }));
    }, [windows]);

    const filteredWindows = useMemo(() => {
        if (!normalizedSearch) return openWindowEntries;
        return openWindowEntries.filter(({ id, app }) => {
            const searchable = [app?.label ?? id, app?.description ?? '', ...(app?.aliases ?? [])]
                .join(' ')
                .toLowerCase();
            return searchable.includes(normalizedSearch);
        });
    }, [normalizedSearch, openWindowEntries]);

    const handleAppClick = useCallback(
        (appId: AppId) => {
            openWindow(appId);
            onClose();
        },
        [openWindow, onClose]
    );

    const filteredProjects = useMemo(() => {
        if (!normalizedSearch) return [];

        return PROJECTS.filter(project => {
            const searchable = [
                project.title,
                project.role,
                project.summary,
                project.impact,
                project.platform,
                ...project.techStack,
                ...project.proofPoints,
            ]
                .join(' ')
                .toLowerCase();

            return searchable.includes(normalizedSearch);
        });
    }, [normalizedSearch]);

    const handleProjectClick = useCallback(
        (project: Project) => {
            sessionStorage.setItem('portfolioProjectFocus', project.id);
            openWindow('projects');
            onClose();
        },
        [openWindow, onClose]
    );

    const focusResult = useCallback((direction: 'next' | 'previous' | 'first' | 'last') => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        const results = Array.from(
            overlay.querySelectorAll<HTMLElement>('[data-activities-result="true"]')
        ).filter(el => el.offsetParent !== null);

        if (results.length === 0) return;

        const activeIndex = results.findIndex(el => el === document.activeElement);
        let nextIndex = 0;

        if (direction === 'last') {
            nextIndex = results.length - 1;
        } else if (direction === 'previous') {
            nextIndex = activeIndex <= 0 ? results.length - 1 : activeIndex - 1;
        } else if (direction === 'next') {
            nextIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % results.length;
        }

        results[nextIndex]?.focus();
    }, []);

    const handleOverlayClick = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            const target = event.target as HTMLElement;

            if (
                target.closest('.activities-search, .activities-window-thumb, .activities-app-grid')
            ) {
                return;
            }

            onClose();
        },
        [onClose]
    );

    const handleOverlayKeyDown = useCallback(
        (event: ReactKeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                focusResult('next');
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                focusResult('previous');
            }

            if (event.key === 'Home' && !event.ctrlKey && !event.metaKey) {
                event.preventDefault();
                focusResult('first');
            }

            if (event.key === 'End' && !event.ctrlKey && !event.metaKey) {
                event.preventDefault();
                focusResult('last');
            }
        },
        [focusResult]
    );

    return (
        <div
            ref={overlayRef}
            className={`activities-overlay${isOpen ? ' visible' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Activities overview"
            aria-hidden={!isOpen}
            inert={!isOpen || undefined}
            onClick={handleOverlayClick}
            onKeyDown={handleOverlayKeyDown}
        >
            <div className="activities-search">
                <i className="fas fa-search activities-search-icon" aria-hidden="true" />
                <input
                    ref={inputRef}
                    type="text"
                    className="activities-search-input"
                    placeholder="Search apps and projects…"
                    aria-label="Search apps and projects"
                    autoComplete="off"
                    spellCheck={false}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Escape') onClose();
                        if (e.key === 'Enter' && filteredApps.length > 0) {
                            handleAppClick(filteredApps[0].id);
                        }
                        if (
                            e.key === 'Enter' &&
                            filteredApps.length === 0 &&
                            filteredProjects.length > 0
                        ) {
                            handleProjectClick(filteredProjects[0]);
                        }
                    }}
                />
                {searchQuery && (
                    <button
                        type="button"
                        className="activities-search-clear"
                        aria-label="Clear search"
                        onClick={() => {
                            setSearchQuery('');
                            inputRef.current?.focus();
                        }}
                    >
                        <i className="fas fa-times" aria-hidden="true" />
                    </button>
                )}
            </div>

            <div className="activities-stage">
                <div className="activities-main">
                    <div className="activities-windows">
                        {filteredWindows.length === 0 ? (
                            <div className="activities-no-windows">
                                <i
                                    className={
                                        normalizedSearch
                                            ? 'fas fa-magnifying-glass'
                                            : 'fas fa-window-maximize'
                                    }
                                    aria-hidden="true"
                                />
                                <strong>
                                    {normalizedSearch ? 'No matching windows' : 'No open windows'}
                                </strong>
                                <span>
                                    {normalizedSearch
                                        ? 'Open an app below or refine your search.'
                                        : 'Launch an app from the grid.'}
                                </span>
                            </div>
                        ) : (
                            filteredWindows.map(({ id, app, windowInfo }) => (
                                <button
                                    key={id}
                                    type="button"
                                    className="activities-window-thumb"
                                    data-activities-result="true"
                                    onClick={() => {
                                        openWindow(id);
                                        onClose();
                                    }}
                                    aria-label={`Switch to ${app?.label || id}`}
                                >
                                    <span className="activities-window-preview" aria-hidden="true">
                                        <span className="activities-window-header" />
                                        <span className="activities-window-content">
                                            <i
                                                className={app?.icon || 'fas fa-window-maximize'}
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </span>
                                    <span className="activities-thumb-title">
                                        {app?.label || id}
                                    </span>
                                    <small>{windowInfo.isMinimized ? 'Minimized' : 'Open'}</small>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <aside className="activities-workspace-switcher" aria-label="Workspaces">
                    {[0, 1, 2].map(i => (
                        <div
                            key={i}
                            className={`activities-workspace${i === workspaceIndex ? ' active' : ''}`}
                            aria-hidden="true"
                            tabIndex={-1}
                        >
                            <span />
                        </div>
                    ))}
                </aside>
            </div>


            <div className="activities-results" aria-label="Search results and applications">
                <section className="activities-section" aria-label="Applications">
                    <div className="activities-section-header">
                        <span>Applications</span>
                        <small>{filteredApps.length}</small>
                    </div>
                    <div className="activities-app-grid">
                        {filteredApps.length === 0 ? (
                            <div className="activities-empty-search" role="status">
                                <i className="fas fa-box-open" aria-hidden="true" />
                                <strong>No matching apps</strong>
                            </div>
                        ) : (
                            filteredApps.map((app, i) => (
                                <button
                                    key={app.id}
                                    type="button"
                                    className="activities-app-item"
                                    style={{ '--i': i } as React.CSSProperties}
                                    data-app={app.id}
                                    data-activities-result="true"
                                    aria-label={`Open ${app.label}`}
                                    onClick={() => handleAppClick(app.id)}
                                >
                                    <div
                                        className="activities-app-icon"
                                        style={{ background: app.gradient }}
                                    >
                                        <i className={app.icon} aria-hidden="true" />
                                    </div>
                                    <span className="activities-app-label">{app.label}</span>
                                </button>
                            ))
                        )}
                    </div>
                </section>

                {normalizedSearch && (
                    <section className="activities-section" aria-label="Projects">
                        <div className="activities-section-header">
                            <span>Projects</span>
                            <small>{filteredProjects.length}</small>
                        </div>
                        {filteredProjects.length === 0 ? (
                            <div className="activities-empty-search activities-empty-card">
                                <i className="fas fa-folder-open" aria-hidden="true" />
                                <strong>No matching projects</strong>
                                <span>Try a technology, platform, or project title.</span>
                            </div>
                        ) : (
                            <div className="activities-project-results">
                                {filteredProjects.map(project => (
                                    <button
                                        key={project.id}
                                        type="button"
                                        className="activities-project-result"
                                        data-activities-result="true"
                                        aria-label={`Open project ${project.title}`}
                                        onClick={() => handleProjectClick(project)}
                                    >
                                        <span className="activities-project-icon">
                                            <i className={project.icon} aria-hidden="true" />
                                        </span>
                                        <span className="activities-project-copy">
                                            <strong>{project.title}</strong>
                                            <span>{project.platform}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}

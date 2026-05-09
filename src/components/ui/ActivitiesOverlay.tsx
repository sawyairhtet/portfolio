import { useState, useCallback, useMemo, useEffect, useRef, type MouseEvent } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { APP_DEFINITIONS } from '../../config/data';
import type { AppId } from '../../types';

interface ActivitiesOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ActivitiesOverlay({ isOpen, onClose }: ActivitiesOverlayProps) {
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

    const dashApps = useMemo(() => APP_DEFINITIONS.filter(app => app.desktopDock), []);

    const handleAppClick = useCallback(
        (appId: AppId) => {
            openWindow(appId);
            onClose();
        },
        [openWindow, onClose]
    );

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

    return (
        <div
            ref={overlayRef}
            className={`activities-overlay${isOpen ? ' visible' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Activities overview"
            aria-hidden={!isOpen}
            hidden={!isOpen}
            onClick={handleOverlayClick}
        >
            <div className="activities-search">
                <input
                    ref={inputRef}
                    type="text"
                    className="activities-search-input"
                    placeholder="Type to search apps…"
                    aria-label="Search apps"
                    autoComplete="off"
                    spellCheck={false}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Escape') onClose();
                        if (e.key === 'Enter' && filteredApps.length > 0) {
                            handleAppClick(filteredApps[0].id);
                        }
                    }}
                />
            </div>

            <div className="activities-stage">
                <div className="activities-main">
                    <div className="activities-windows">
                        {filteredWindows.length === 0 ? (
                            <div className="activities-no-windows">
                                {normalizedSearch ? 'No matching windows' : 'No open windows'}
                            </div>
                        ) : (
                            filteredWindows.map(({ id, app, windowInfo }) => (
                                <button
                                    key={id}
                                    type="button"
                                    className="activities-window-thumb"
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
                    <button
                        type="button"
                        className="activities-workspace active"
                        aria-current="true"
                    >
                        <span />
                    </button>
                    <button type="button" className="activities-workspace">
                        <span />
                    </button>
                    <button type="button" className="activities-workspace">
                        <span />
                    </button>
                </aside>
            </div>

            <div className="activities-dash" role="toolbar" aria-label="Dash">
                {dashApps.map(app => {
                    const isActive = windows.get(app.id)?.isOpen ?? false;
                    return (
                        <button
                            key={app.id}
                            type="button"
                            className={`activities-dash-item${isActive ? ' active' : ''}`}
                            data-app={app.id}
                            aria-label={app.label}
                            onClick={() => handleAppClick(app.id)}
                        >
                            <span style={{ background: app.gradient }}>
                                <i className={app.icon} aria-hidden="true" />
                            </span>
                        </button>
                    );
                })}
                <button
                    type="button"
                    className="activities-dash-item show-apps active"
                    aria-label="Show Apps"
                >
                    <span>
                        <i className="fas fa-grip" aria-hidden="true" />
                    </span>
                </button>
            </div>

            <div className="activities-app-grid">
                {filteredApps.length === 0 ? (
                    <div className="activities-empty-search" role="status">
                        No matching apps
                    </div>
                ) : (
                    filteredApps.map(app => (
                        <button
                            key={app.id}
                            type="button"
                            className="activities-app-item"
                            data-app={app.id}
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
        </div>
    );
}

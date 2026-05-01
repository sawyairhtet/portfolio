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

    const filteredApps = useMemo(() => {
        if (!searchQuery.trim()) return APP_DEFINITIONS;
        const q = searchQuery.toLowerCase();
        return APP_DEFINITIONS.filter(app => {
            const searchable = [app.label, app.description, ...app.aliases].join(' ').toLowerCase();
            return searchable.includes(q);
        });
    }, [searchQuery]);

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

    // Window thumbnails for activities view
    const openWindowIds = Array.from(windows.entries())
        .filter(([, w]) => w.isOpen)
        .map(([id]) => id);

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

            <div className="activities-main">
                <div className="activities-windows">
                    {openWindowIds.length === 0 ? (
                        <div className="activities-no-windows">No open windows</div>
                    ) : (
                        openWindowIds.map(id => {
                            const app = APP_DEFINITIONS.find(a => a.id === id);
                            return (
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
                                    <i
                                        className={app?.icon || 'fas fa-window-maximize'}
                                        aria-hidden="true"
                                    />
                                    <span className="activities-thumb-title">
                                        {app?.label || id}
                                    </span>
                                    <small>
                                        {windows.get(id)?.isMinimized ? 'Minimized' : 'Open'}
                                    </small>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="activities-app-grid">
                {filteredApps.map(app => (
                    <button
                        key={app.id}
                        type="button"
                        className="activities-app-item"
                        data-app={app.id}
                        onClick={() => handleAppClick(app.id)}
                    >
                        <div className="activities-app-icon" style={{ background: app.gradient }}>
                            <i className={app.icon} aria-hidden="true" />
                        </div>
                        <span className="activities-app-label">{app.label}</span>
                    </button>
                ))}
                {filteredApps.length === 0 && (
                    <div className="activities-empty-search" role="status">
                        No matching apps
                    </div>
                )}
            </div>
        </div>
    );
}

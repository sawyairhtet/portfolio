import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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

    // Focus search on open
    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const filteredApps = useMemo(() => {
        if (!searchQuery.trim()) return APP_DEFINITIONS;
        const q = searchQuery.toLowerCase();
        return APP_DEFINITIONS.filter((app) => {
            const searchable = [
                app.label,
                app.description,
                ...app.aliases,
            ].join(' ').toLowerCase();
            return searchable.includes(q);
        });
    }, [searchQuery]);

    const handleAppClick = useCallback(
        (appId: AppId) => {
            openWindow(appId);
            onClose();
        },
        [openWindow, onClose],
    );

    // Window thumbnails for activities view
    const openWindowIds = Array.from(windows.entries())
        .filter(([, w]) => w.isOpen)
        .map(([id]) => id);

    return (
        <div
            className={`activities-overlay${isOpen ? ' visible' : ''}`}
            role="dialog"
            aria-modal="false"
            aria-label="Activities overview"
            aria-hidden={!isOpen}
        >
            <div className="activities-search">
                <input
                    ref={inputRef}
                    type="text"
                    className="activities-search-input"
                    placeholder="Type to search apps…"
                    autoComplete="off"
                    spellCheck={false}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
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
                        <div className="activities-no-windows">
                            No open windows
                        </div>
                    ) : (
                        openWindowIds.map((id) => {
                            const app = APP_DEFINITIONS.find((a) => a.id === id);
                            return (
                                <button
                                    key={id}
                                    className="activities-window-thumb"
                                    onClick={() => { openWindow(id); onClose(); }}
                                    aria-label={`Switch to ${app?.label || id}`}
                                >
                                    <i className={app?.icon || 'fas fa-window-maximize'} aria-hidden="true" />
                                    <span className="activities-thumb-title">{app?.label || id}</span>
                                    <small>{windows.get(id)?.isMinimized ? 'Minimized' : 'Open'}</small>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="activities-app-grid">
                {filteredApps.map((app) => (
                    <button
                        key={app.id}
                        className="activities-app-item"
                        data-app={app.id}
                        onClick={() => handleAppClick(app.id)}
                    >
                        <div className="activities-app-icon" style={{ background: app.gradient }}>
                            <i className={app.icon} aria-hidden="true" />
                        </div>
                        <span className="activities-app-label">{app.label}</span>
                        <span className="activities-app-description">{app.description}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

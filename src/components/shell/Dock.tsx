import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    useRef,
    type MouseEvent,
    type KeyboardEvent,
} from 'react';
import { Icon } from '../ui/Icon';
import { useWindowManager } from '../../context/WindowManagerContext';
import { DOCK_APPS, MOBILE_DOCK_APPS, MOBILE_LAUNCHER_APPS } from '../../config/data';
import { useDevice } from '../../context/DeviceContext';
import type { AppId } from '../../types';

interface DockProps {
    onShowApps?: () => void;
}

export function Dock({ onShowApps }: DockProps) {
    const { openWindow, bringToFront, windows } = useWindowManager();
    const { device } = useDevice();
    const [launchingApp, setLaunchingApp] = useState<AppId | null>(null);
    const [launcherOpen, setLauncherOpen] = useState(false);
    const [mobileSearchQuery, setMobileSearchQuery] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(0);
    const dockRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLInputElement>(null);
    const isMobileShell = device !== 'desktop';

    const handleDockClick = useCallback(
        (appId: AppId, event?: MouseEvent<HTMLButtonElement>) => {
            const win = windows.get(appId);
            const rect = event?.currentTarget.getBoundingClientRect();
            const launchOrigin = rect
                ? {
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                  }
                : undefined;

            if (win?.isOpen) {
                bringToFront(appId);
            } else {
                openWindow(appId, launchOrigin);
            }

            setLauncherOpen(false);
            setMobileSearchQuery('');
            setLaunchingApp(appId);
            setTimeout(() => setLaunchingApp(null), 360);
        },
        [windows, openWindow, bringToFront]
    );

    // Split dock apps: main apps and utility apps (after separator)
    const mainApps = DOCK_APPS.filter(a => !['terminal', 'settings'].includes(a.id));
    const utilityApps = DOCK_APPS.filter(a => ['terminal', 'settings'].includes(a.id));

    // All focusable items in desktop dock (main apps + utility apps + Show Apps)
    const allDockItems = [
        ...mainApps,
        ...utilityApps,
        { id: 'show-apps' as const, label: 'Show Apps' },
    ];

    const filteredMobileLauncherApps = useMemo(() => {
        const query = mobileSearchQuery.trim().toLowerCase();
        if (!query) return MOBILE_LAUNCHER_APPS;

        return MOBILE_LAUNCHER_APPS.filter(app => {
            const searchable = [app.label, app.description, ...app.aliases].join(' ').toLowerCase();
            return searchable.includes(query);
        });
    }, [mobileSearchQuery]);

    useEffect(() => {
        if (!launcherOpen) return;

        const timer = window.setTimeout(() => mobileSearchRef.current?.focus(), 80);
        return () => window.clearTimeout(timer);
    }, [launcherOpen]);

    const handleDockKeyDown = useCallback(
        (e: KeyboardEvent<HTMLDivElement>) => {
            const total = allDockItems.length;
            let nextIndex = focusedIndex;

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    nextIndex = (focusedIndex + 1) % total;
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    nextIndex = (focusedIndex - 1 + total) % total;
                    break;
                case 'Home':
                    e.preventDefault();
                    nextIndex = 0;
                    break;
                case 'End':
                    e.preventDefault();
                    nextIndex = total - 1;
                    break;
                default:
                    return;
            }

            setFocusedIndex(nextIndex);
            const dock = dockRef.current;
            if (dock) {
                const buttons = Array.from(dock.querySelectorAll<HTMLElement>('button.dock-item'));
                buttons.at(nextIndex)?.focus();
            }
        },
        [focusedIndex, allDockItems.length]
    );

    if (isMobileShell) {
        return (
            <>
                <div className="dock visible mobile-dock" id="dock" aria-label="Mobile app dock">
                    {MOBILE_DOCK_APPS.map(app => {
                        const isActive = windows.get(app.id)?.isOpen ?? false;
                        return (
                            <button
                                key={app.id}
                                className={`dock-item${launchingApp === app.id ? ' launching' : ''}${isActive ? ' active' : ''}`}
                                data-app={app.id}
                                aria-label={app.label}
                                aria-describedby={`dock-tip-mobile-${app.id}`}
                                onClick={event => handleDockClick(app.id, event)}
                            >
                                <Icon name={app.icon} />
                                <span
                                    className="dock-tooltip"
                                    id={`dock-tip-mobile-${app.id}`}
                                    role="tooltip"
                                >
                                    {app.dockTooltip}
                                </span>
                            </button>
                        );
                    })}
                    <button
                        className={`dock-item mobile-apps-btn${launcherOpen ? ' active' : ''}`}
                        data-app="apps"
                        aria-label="Apps"
                        aria-expanded={launcherOpen}
                        aria-haspopup="dialog"
                        aria-controls="mobile-app-launcher"
                        onClick={() => {
                            setLauncherOpen(open => !open);
                            setMobileSearchQuery('');
                        }}
                    >
                        <Icon name="grip" />
                        <span className="dock-tooltip" id="dock-tip-mobile-apps" role="tooltip">
                            Apps
                        </span>
                    </button>
                </div>
                <div
                    id="mobile-app-launcher"
                    className={`mobile-launcher${launcherOpen ? ' visible' : ''}`}
                    role="dialog"
                    aria-label="More apps"
                    hidden={!launcherOpen}
                    onKeyDown={event => {
                        if (event.key === 'Escape') {
                            setLauncherOpen(false);
                            setMobileSearchQuery('');
                        }
                    }}
                >
                    <div className="mobile-launcher-header">
                        <span>Applications</span>
                        <small>Fedora mobile launcher</small>
                    </div>
                    <label className="mobile-launcher-search">
                        <Icon name="search" />
                        <input
                            ref={mobileSearchRef}
                            type="search"
                            value={mobileSearchQuery}
                            onChange={event => setMobileSearchQuery(event.target.value)}
                            placeholder="Search apps"
                            aria-label="Search mobile apps"
                        />
                    </label>
                    <div className="mobile-launcher-grid">
                        {filteredMobileLauncherApps.length === 0 ? (
                            <div className="mobile-launcher-empty" role="status">
                                <Icon name="box-open" />
                                <span>No matching apps</span>
                            </div>
                        ) : (
                            filteredMobileLauncherApps.map(app => (
                                <button
                                    key={app.id}
                                    className="mobile-launcher-item"
                                    data-app={app.id}
                                    aria-label={`${app.label}: ${app.description}`}
                                    onClick={event => handleDockClick(app.id, event)}
                                >
                                    <span
                                        className="mobile-launcher-icon"
                                        style={{ background: app.gradient }}
                                    >
                                        <Icon name={app.icon} />
                                    </span>
                                    <span>
                                        <strong>{app.label}</strong>
                                        <small>{app.description}</small>
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </>
        );
    }

    return (
        <div
            ref={dockRef}
            className="dock"
            id="dock"
            role="toolbar"
            aria-label="App launcher dash"
            onKeyDown={handleDockKeyDown}
        >
            {mainApps.map((app, idx) => {
                const isActive = windows.get(app.id)?.isOpen ?? false;
                return (
                    <button
                        key={app.id}
                        className={`dock-item${launchingApp === app.id ? ' launching' : ''}${isActive ? ' active' : ''}`}
                        data-app={app.id}
                        aria-label={app.label}
                        aria-describedby={`dock-tip-${app.id}`}
                        tabIndex={focusedIndex === idx ? 0 : -1}
                        onClick={event => handleDockClick(app.id, event)}
                        onFocus={() => setFocusedIndex(idx)}
                    >
                        <Icon name={app.icon} />
                        <span className="dock-tooltip" id={`dock-tip-${app.id}`} role="tooltip">
                            {app.dockTooltip}
                        </span>
                    </button>
                );
            })}
            <div className="dock-separator" role="separator" aria-hidden="true" />
            {utilityApps.map((app, idx) => {
                const globalIdx = mainApps.length + idx;
                const isActive = windows.get(app.id)?.isOpen ?? false;
                return (
                    <button
                        key={app.id}
                        className={`dock-item${launchingApp === app.id ? ' launching' : ''}${isActive ? ' active' : ''}`}
                        data-app={app.id}
                        aria-label={app.label}
                        aria-describedby={`dock-tip-${app.id}`}
                        tabIndex={focusedIndex === globalIdx ? 0 : -1}
                        onClick={event => handleDockClick(app.id, event)}
                        onFocus={() => setFocusedIndex(globalIdx)}
                    >
                        <Icon name={app.icon} />
                        <span className="dock-tooltip" id={`dock-tip-${app.id}`} role="tooltip">
                            {app.dockTooltip}
                        </span>
                    </button>
                );
            })}
            <button
                className="dock-item show-apps-btn"
                data-app="apps"
                aria-label="Show Apps"
                tabIndex={focusedIndex === allDockItems.length - 1 ? 0 : -1}
                onClick={onShowApps}
                onFocus={() => setFocusedIndex(allDockItems.length - 1)}
            >
                <Icon name="grip" />
                <span className="dock-tooltip" id="dock-tip-show-apps" role="tooltip">
                    Show Apps
                </span>
            </button>
        </div>
    );
}

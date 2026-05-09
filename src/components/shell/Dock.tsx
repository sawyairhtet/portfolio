import { useCallback, useState, type MouseEvent } from 'react';
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
            setLaunchingApp(appId);
            setTimeout(() => setLaunchingApp(null), 360);
        },
        [windows, openWindow, bringToFront]
    );

    // Split dock apps: main apps and utility apps (after separator)
    const mainApps = DOCK_APPS.filter(a => !['terminal', 'settings'].includes(a.id));
    const utilityApps = DOCK_APPS.filter(a => ['terminal', 'settings'].includes(a.id));

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
                                <i className={app.icon} aria-hidden="true" />
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
                        onClick={() => setLauncherOpen(open => !open)}
                    >
                        <i className="fas fa-grip" aria-hidden="true" />
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
                        }
                    }}
                >
                    {MOBILE_LAUNCHER_APPS.map(app => (
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
                                <i className={app.icon} aria-hidden="true" />
                            </span>
                            <span>
                                <strong>{app.label}</strong>
                            </span>
                        </button>
                    ))}
                </div>
            </>
        );
    }

    return (
        <div className="dock" id="dock" aria-label="App launcher dash">
            {mainApps.map(app => {
                const isActive = windows.get(app.id)?.isOpen ?? false;
                return (
                    <button
                        key={app.id}
                        className={`dock-item${launchingApp === app.id ? ' launching' : ''}${isActive ? ' active' : ''}`}
                        data-app={app.id}
                        aria-label={app.label}
                        aria-describedby={`dock-tip-${app.id}`}
                        onClick={event => handleDockClick(app.id, event)}
                    >
                        <i className={app.icon} aria-hidden="true" />
                        <span className="dock-tooltip" id={`dock-tip-${app.id}`} role="tooltip">
                            {app.dockTooltip}
                        </span>
                    </button>
                );
            })}
            <div className="dock-separator" />
            {utilityApps.map(app => {
                const isActive = windows.get(app.id)?.isOpen ?? false;
                return (
                    <button
                        key={app.id}
                        className={`dock-item${launchingApp === app.id ? ' launching' : ''}${isActive ? ' active' : ''}`}
                        data-app={app.id}
                        aria-label={app.label}
                        aria-describedby={`dock-tip-${app.id}`}
                        onClick={event => handleDockClick(app.id, event)}
                    >
                        <i className={app.icon} aria-hidden="true" />
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
                onClick={onShowApps}
            >
                <i className="fas fa-grip" aria-hidden="true" />
                <span className="dock-tooltip" id="dock-tip-show-apps" role="tooltip">
                    Show Apps
                </span>
            </button>
        </div>
    );
}

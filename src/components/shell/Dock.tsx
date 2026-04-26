import { useCallback, useState } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { DOCK_APPS, MOBILE_DOCK_APPS, MOBILE_LAUNCHER_APPS } from '../../config/data';
import { useDevice } from '../../context/DeviceContext';
import type { AppId } from '../../types';

export function Dock() {
    const { openWindow, bringToFront, windows } = useWindowManager();
    const { device } = useDevice();
    const [launchingApp, setLaunchingApp] = useState<AppId | null>(null);
    const [launcherOpen, setLauncherOpen] = useState(false);
    const isMobileShell = device !== 'desktop';

    const handleDockClick = useCallback(
        (appId: AppId) => {
            const win = windows.get(appId);
            if (win?.isOpen) {
                bringToFront(appId);
            } else {
                openWindow(appId);
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
                                onClick={() => handleDockClick(app.id)}
                            >
                                <i className={app.icon} aria-hidden="true" />
                                <span className="dock-tooltip">{app.dockTooltip}</span>
                            </button>
                        );
                    })}
                    <button
                        className={`dock-item mobile-apps-btn${launcherOpen ? ' active' : ''}`}
                        data-app="apps"
                        aria-label="Apps"
                        aria-expanded={launcherOpen}
                        aria-haspopup="dialog"
                        onClick={() => setLauncherOpen(open => !open)}
                    >
                        <i className="fas fa-grip" aria-hidden="true" />
                        <span className="dock-tooltip">Apps</span>
                    </button>
                </div>
                <div
                    className={`mobile-launcher${launcherOpen ? ' visible' : ''}`}
                    role="dialog"
                    aria-label="More apps"
                >
                    {MOBILE_LAUNCHER_APPS.map(app => (
                        <button
                            key={app.id}
                            className="mobile-launcher-item"
                            data-app={app.id}
                            onClick={() => handleDockClick(app.id)}
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
                        onClick={() => handleDockClick(app.id)}
                    >
                        <i className={app.icon} aria-hidden="true" />
                        <span className="dock-tooltip">{app.dockTooltip}</span>
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
                        onClick={() => handleDockClick(app.id)}
                    >
                        <i className={app.icon} aria-hidden="true" />
                        <span className="dock-tooltip">{app.dockTooltip}</span>
                    </button>
                );
            })}
        </div>
    );
}

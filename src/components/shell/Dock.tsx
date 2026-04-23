import { useCallback, useState } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { DOCK_APPS } from '../../config/data';
import type { AppId } from '../../types';

export function Dock() {
    const { openWindow, closeWindow, bringToFront, windows, currentZIndex } = useWindowManager();
    const [launchingApp, setLaunchingApp] = useState<AppId | null>(null);

    const handleDockClick = useCallback(
        (appId: AppId) => {
            const win = windows.get(appId);
            if (win?.isOpen) {
                if (win.zIndex === currentZIndex) {
                    closeWindow(appId);
                } else {
                    bringToFront(appId);
                }
            } else {
                openWindow(appId);
            }

            // Trigger launch animation
            setLaunchingApp(appId);
            setTimeout(() => setLaunchingApp(null), 420);
        },
        [windows, currentZIndex, openWindow, closeWindow, bringToFront],
    );

    // Split dock apps: main apps and utility apps (after separator)
    const mainApps = DOCK_APPS.filter((a) => !['terminal', 'settings'].includes(a.id));
    const utilityApps = DOCK_APPS.filter((a) => ['terminal', 'settings'].includes(a.id));

    return (
        <div className="dock visible" id="dock">
            {mainApps.map((app) => {
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
            {utilityApps.map((app) => {
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

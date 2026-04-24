import { useState, useEffect, useCallback } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { usePreferences } from '../../context/PreferencesContext';

interface MenuPosition {
    x: number;
    y: number;
}

export function ContextMenu() {
    const { openWindow } = useWindowManager();
    const { resetStickyNotes } = usePreferences();
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });

    const handleContextMenu = useCallback((e: MouseEvent) => {
        // Only show on main content / wallpaper area
        const target = e.target;
        if (!(target instanceof Element)) return;

        if (
            target.closest('.window') ||
            target.closest('.dock') ||
            target.closest('.mobile-launcher') ||
            target.closest('.top-bar') ||
            target.closest('.quick-settings-panel') ||
            target.closest('.notification-center') ||
            target.closest('.activities-overlay')
        ) {
            return;
        }

        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
        setVisible(true);
    }, []);

    const handleClick = useCallback(() => {
        setVisible(false);
    }, []);

    useEffect(() => {
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('click', handleClick);
        };
    }, [handleContextMenu, handleClick]);

    return (
        <div
            className={`context-menu${visible ? ' visible' : ''}`}
            style={{ top: position.y, left: position.x, position: 'fixed' }}
            role="menu"
            aria-hidden={!visible}
        >
            <div
                className="context-menu-item"
                role="menuitem"
                tabIndex={-1}
                onClick={() => { setVisible(false); }}
            >
                <i className="fas fa-sync-alt" aria-hidden="true" /> Refresh
            </div>
            <div
                className="context-menu-item"
                role="menuitem"
                tabIndex={-1}
                onClick={() => { openWindow('terminal'); setVisible(false); }}
            >
                <i className="fas fa-terminal" aria-hidden="true" /> Open Terminal
            </div>
            <div className="context-menu-separator" />
            <div
                className="context-menu-item"
                role="menuitem"
                tabIndex={-1}
                onClick={() => { resetStickyNotes(); setVisible(false); }}
            >
                <i className="fas fa-note-sticky" aria-hidden="true" /> Reset Notes
            </div>
            <div
                className="context-menu-item"
                role="menuitem"
                tabIndex={-1}
                onClick={() => { openWindow('settings'); setVisible(false); }}
            >
                <i className="fas fa-cog" aria-hidden="true" /> Settings
            </div>
        </div>
    );
}

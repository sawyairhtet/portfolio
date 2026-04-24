import { useState, useEffect, useCallback } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';

interface MenuPosition {
    x: number;
    y: number;
}

export function ContextMenu() {
    const { openWindow } = useWindowManager();
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });

    const handleContextMenu = useCallback((e: MouseEvent) => {
        // Only show on main content / wallpaper area
        const target = e.target;
        if (!(target instanceof Element)) return;

        const isBlankDesktop = Boolean(target.closest('.main-content, .wallpaper'));

        if (
            !isBlankDesktop ||
            target.closest('.window') ||
            target.closest('.dock') ||
            target.closest('.context-menu') ||
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
                onClick={() => {
                    openWindow('settings');
                    window.setTimeout(() => {
                        window.dispatchEvent(
                            new CustomEvent('portfolio:settings-panel', {
                                detail: 'appearance',
                            })
                        );
                    }, 0);
                    setVisible(false);
                }}
            >
                <i className="fas fa-image" aria-hidden="true" /> Change Background
            </div>
        </div>
    );
}

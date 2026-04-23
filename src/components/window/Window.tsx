import { useRef, useCallback, useEffect, type ReactNode } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useDevice } from '../../context/DeviceContext';
import type { AppId } from '../../types';

interface WindowProps {
    appId: AppId;
    title: string;
    children: ReactNode;
    className?: string;
}

export function Window({ appId, title, children, className = '' }: WindowProps) {
    const {
        windows,
        closeWindow,
        minimizeWindow,
        toggleMaximize,
        bringToFront,
        updateWindowPosition,
    } = useWindowManager();
    const { device } = useDevice();
    const windowRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const win = windows.get(appId);
    if (!win || !win.isOpen) return null;

    const windowId = `${appId}-window`;

    const snapClass = win.snapState !== 'none' ? ` snapped-${win.snapState}` : '';
    const maximizedClass = win.isMaximized ? ' snapped-maximized' : '';

    useEffect(() => {
        const element = windowRef.current;
        if (!element) return;

        element.style.zIndex = String(win.zIndex);

        if (device === 'desktop' && !win.isMaximized && win.snapState === 'none') {
            element.style.top = win.position.top;
            element.style.left = win.position.left;
            element.style.width = win.size.width;
            element.style.height = win.size.height;
            return;
        }

        element.style.removeProperty('top');
        element.style.removeProperty('left');
        element.style.removeProperty('width');
        element.style.removeProperty('height');
    }, [device, win.isMaximized, win.position.left, win.position.top, win.size.height, win.size.width, win.snapState, win.zIndex]);

    // Drag handlers (desktop only)
    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (device !== 'desktop') return;
            if ((e.target as HTMLElement).closest('.window-control, .close-btn-mobile')) return;

            e.preventDefault();
            isDragging.current = true;
            const rect = windowRef.current?.getBoundingClientRect();
            if (rect) {
                dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            }
            bringToFront(appId);

            const handleMouseMove = (ev: MouseEvent) => {
                if (!isDragging.current) return;
                const newLeft = ev.clientX - dragOffset.current.x;
                const newTop = ev.clientY - dragOffset.current.y;
                updateWindowPosition(appId, `${newTop}px`, `${newLeft}px`);
            };

            const handleMouseUp = () => {
                isDragging.current = false;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },
        [device, appId, bringToFront, updateWindowPosition],
    );

    // Double-click to maximize
    const handleDoubleClick = useCallback(() => {
        if (device === 'desktop') {
            toggleMaximize(appId);
        }
    }, [device, appId, toggleMaximize]);

    // Click anywhere on window to bring to front
    const handleWindowClick = useCallback(() => {
        bringToFront(appId);
    }, [appId, bringToFront]);

    // Mobile swipe gestures
    const touchStart = useRef({ x: 0, y: 0 });

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
    }, []);

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            const diffY = e.changedTouches[0].clientY - touchStart.current.y;
            const diffX = e.changedTouches[0].clientX - touchStart.current.x;

            if (diffY > 80 && Math.abs(diffX) < 50) {
                closeWindow(appId);
            }
        },
        [appId, closeWindow],
    );

    return (
        <div
            ref={windowRef}
            className={`window active${snapClass}${maximizedClass}${win.isMinimized ? ' is-minimized' : ''} ${className}`}
            id={windowId}
            data-app={appId}
            role="dialog"
            aria-labelledby={`${appId}-window-title`}
            onMouseDown={handleWindowClick}
        >
            <div
                className="window-header"
                onMouseDown={handleMouseDown}
                onDoubleClick={handleDoubleClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="window-title" id={`${appId}-window-title`}>
                    {title}
                </div>
                <button
                    className="close-btn-mobile"
                    aria-label="Close"
                    onClick={() => closeWindow(appId)}
                >
                    <i className="fas fa-times" aria-hidden="true" />
                </button>
                <div className="window-controls">
                    <button
                        className="window-control minimize"
                        aria-label="Minimize"
                        onClick={() => minimizeWindow(appId)}
                    >
                        <i className="fas fa-minus" aria-hidden="true" />
                    </button>
                    <button
                        className="window-control maximize"
                        aria-label="Maximize"
                        onClick={() => toggleMaximize(appId)}
                    >
                        <i className="fas fa-expand" aria-hidden="true" />
                    </button>
                    <button
                        className="window-control close"
                        aria-label="Close"
                        onClick={() => closeWindow(appId)}
                    >
                        <i className="fas fa-times" aria-hidden="true" />
                    </button>
                </div>
            </div>
            <div className={`window-body${appId === 'terminal' ? ' terminal-body' : ''}${appId === 'settings' ? ' settings-body' : ''}`}>
                {children}
            </div>
        </div>
    );
}

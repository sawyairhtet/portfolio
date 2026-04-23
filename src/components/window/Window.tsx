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
    const isOpen = Boolean(win?.isOpen);
    const snapState = win?.snapState ?? 'none';
    const isMaximized = Boolean(win?.isMaximized);
    const isMinimized = Boolean(win?.isMinimized);
    const zIndex = win?.zIndex ?? 0;
    const positionTop = win?.position.top;
    const positionLeft = win?.position.left;
    const sizeWidth = win?.size.width;
    const sizeHeight = win?.size.height;

    const windowId = `${appId}-window`;

    const snapClass = snapState !== 'none' ? ` snapped-${snapState}` : '';
    const maximizedClass = isMaximized ? ' snapped-maximized' : '';

    useEffect(() => {
        if (!isOpen || !win) return;
        const element = windowRef.current;
        if (!element) return;

        element.style.zIndex = String(zIndex);

        if (device === 'desktop' && !isMaximized && snapState === 'none' && positionTop && positionLeft && sizeWidth && sizeHeight) {
            element.style.top = positionTop;
            element.style.left = positionLeft;
            element.style.width = sizeWidth;
            element.style.height = sizeHeight;
            return;
        }

        element.style.removeProperty('top');
        element.style.removeProperty('left');
        element.style.removeProperty('width');
        element.style.removeProperty('height');
    }, [device, isMaximized, isOpen, positionLeft, positionTop, sizeHeight, sizeWidth, snapState, win, zIndex]);

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

    if (!isOpen || !win) return null;

    return (
        <div
            ref={windowRef}
            className={`window active${snapClass}${maximizedClass}${isMinimized ? ' is-minimized' : ''} ${className}`}
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

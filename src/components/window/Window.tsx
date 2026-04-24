import { useRef, useCallback, useEffect, useState, type ReactNode } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useDevice } from '../../context/DeviceContext';
import { usePreferences } from '../../context/PreferencesContext';
import { SWIPE_CLOSE_MAX_X, SWIPE_CLOSE_THRESHOLD_Y } from '../../config/data';
import type { AppId } from '../../types';

interface WindowProps {
    appId: AppId;
    title: string;
    children: ReactNode;
    className?: string;
}

type SnapPreview = 'left' | 'right' | 'maximize' | null;
type ResizeDirection =
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';

const RESIZE_DIRECTIONS: ResizeDirection[] = [
    'top',
    'right',
    'bottom',
    'left',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
];

function getTopbarHeight(): number {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--topbar-height');
    return Number.parseInt(raw, 10) || 32;
}

export function Window({ appId, title, children, className = '' }: WindowProps) {
    const {
        windows,
        closeWindow,
        minimizeWindow,
        toggleMaximize,
        bringToFront,
        updateWindowPosition,
        updateWindowSize,
        setSnapState,
    } = useWindowManager();
    const { device } = useDevice();
    const { preferences } = usePreferences();
    const windowRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const snapPreviewRef = useRef<SnapPreview>(null);
    const [snapPreview, setSnapPreview] = useState<SnapPreview>(null);

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

    const updateSnapPreview = useCallback((next: SnapPreview) => {
        snapPreviewRef.current = next;
        setSnapPreview(next);
    }, []);

    useEffect(() => {
        if (!isOpen || !win) return;
        const element = windowRef.current;
        if (!element) return;

        element.style.zIndex = String(zIndex);

        if (
            device === 'desktop' &&
            !isMaximized &&
            snapState === 'none' &&
            positionTop &&
            positionLeft &&
            sizeWidth &&
            sizeHeight
        ) {
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
    }, [
        device,
        isMaximized,
        isOpen,
        positionLeft,
        positionTop,
        sizeHeight,
        sizeWidth,
        snapState,
        win,
        zIndex,
    ]);

    // Drag handlers (desktop only)
    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (device !== 'desktop') return;
            if (
                (e.target as HTMLElement).closest(
                    '.window-control, .close-btn-mobile, .resize-handle'
                )
            )
                return;

            e.preventDefault();
            isDragging.current = true;
            const rect = windowRef.current?.getBoundingClientRect();
            if (rect) {
                dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            }
            bringToFront(appId);
            if (snapState !== 'none') {
                setSnapState(appId, 'none');
            }
            if (isMaximized) {
                toggleMaximize(appId);
            }

            const handleMouseMove = (ev: MouseEvent) => {
                if (!isDragging.current) return;
                const newLeft = ev.clientX - dragOffset.current.x;
                const newTop = ev.clientY - dragOffset.current.y;
                updateWindowPosition(appId, `${newTop}px`, `${newLeft}px`);

                if (!preferences.enableSnap) {
                    updateSnapPreview(null);
                    return;
                }

                const edge = 18;
                const topbarHeight = getTopbarHeight();
                if (ev.clientY <= topbarHeight + 8) {
                    updateSnapPreview('maximize');
                } else if (ev.clientX <= edge) {
                    updateSnapPreview('left');
                } else if (ev.clientX >= window.innerWidth - edge) {
                    updateSnapPreview('right');
                } else {
                    updateSnapPreview(null);
                }
            };

            const handleMouseUp = () => {
                isDragging.current = false;
                const preview = snapPreviewRef.current;
                if (preview === 'left' || preview === 'right') {
                    setSnapState(appId, preview);
                } else if (preview === 'maximize' && !isMaximized) {
                    toggleMaximize(appId);
                }
                updateSnapPreview(null);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },
        [
            device,
            appId,
            bringToFront,
            updateWindowPosition,
            preferences.enableSnap,
            updateSnapPreview,
            setSnapState,
            snapState,
            isMaximized,
            toggleMaximize,
        ]
    );

    const handleResizeMouseDown = useCallback(
        (direction: ResizeDirection, e: React.MouseEvent<HTMLDivElement>) => {
            if (
                device !== 'desktop' ||
                !preferences.enableResize ||
                isMaximized ||
                snapState !== 'none'
            )
                return;

            e.preventDefault();
            e.stopPropagation();
            bringToFront(appId);

            const rect = windowRef.current?.getBoundingClientRect();
            if (!rect) return;

            const startX = e.clientX;
            const startY = e.clientY;
            const start = {
                width: rect.width,
                height: rect.height,
                left: rect.left,
                top: rect.top,
            };
            const minWidth = 320;
            const minHeight = 240;
            const maxWidth = Math.max(minWidth, window.innerWidth - 24);
            const maxHeight = Math.max(minHeight, window.innerHeight - getTopbarHeight() - 24);

            const handleMouseMove = (ev: MouseEvent) => {
                const dx = ev.clientX - startX;
                const dy = ev.clientY - startY;
                let nextWidth = start.width;
                let nextHeight = start.height;
                let nextLeft = start.left;
                let nextTop = start.top;

                if (direction.includes('right')) {
                    nextWidth = start.width + dx;
                }
                if (direction.includes('left')) {
                    nextWidth = start.width - dx;
                    nextLeft = start.left + dx;
                }
                if (direction.includes('bottom')) {
                    nextHeight = start.height + dy;
                }
                if (direction.includes('top')) {
                    nextHeight = start.height - dy;
                    nextTop = start.top + dy;
                }

                if (nextWidth < minWidth && direction.includes('left')) {
                    nextLeft -= minWidth - nextWidth;
                }
                if (nextHeight < minHeight && direction.includes('top')) {
                    nextTop -= minHeight - nextHeight;
                }

                nextWidth = Math.min(maxWidth, Math.max(minWidth, nextWidth));
                nextHeight = Math.min(maxHeight, Math.max(minHeight, nextHeight));
                nextLeft = Math.min(window.innerWidth - minWidth - 8, Math.max(8, nextLeft));
                nextTop = Math.min(
                    window.innerHeight - minHeight - 8,
                    Math.max(getTopbarHeight() + 8, nextTop)
                );

                updateWindowSize(
                    appId,
                    `${Math.round(nextWidth)}px`,
                    `${Math.round(nextHeight)}px`
                );
                updateWindowPosition(
                    appId,
                    `${Math.round(nextTop)}px`,
                    `${Math.round(nextLeft)}px`
                );
            };

            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },
        [
            device,
            preferences.enableResize,
            isMaximized,
            snapState,
            bringToFront,
            appId,
            updateWindowSize,
            updateWindowPosition,
        ]
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

            if (diffY > SWIPE_CLOSE_THRESHOLD_Y && Math.abs(diffX) < SWIPE_CLOSE_MAX_X) {
                closeWindow(appId);
            }
        },
        [appId, closeWindow]
    );

    if (!isOpen || !win) return null;

    return (
        <>
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
                        />
                        <button
                            className="window-control maximize"
                            aria-label="Maximize"
                            onClick={() => toggleMaximize(appId)}
                        />
                        <button
                            className="window-control close"
                            aria-label="Close"
                            onClick={() => closeWindow(appId)}
                        />
                    </div>
                </div>
                <div
                    className={`window-body${appId === 'terminal' ? ' terminal-body' : ''}${appId === 'settings' ? ' settings-body' : ''}`}
                >
                    {children}
                </div>
                {device === 'desktop' &&
                    preferences.enableResize &&
                    !isMaximized &&
                    snapState === 'none' &&
                    RESIZE_DIRECTIONS.map(direction => (
                        <div
                            key={direction}
                            className={`resize-handle ${direction}`}
                            onMouseDown={e => handleResizeMouseDown(direction, e)}
                            aria-hidden="true"
                        />
                    ))}
            </div>
            <div
                className={`snap-preview${snapPreview ? ` visible snap-${snapPreview}` : ''}`}
                aria-hidden="true"
            />
        </>
    );
}

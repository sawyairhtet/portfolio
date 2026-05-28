import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AppId, LaunchOrigin, WindowInfo } from '../types';

interface WindowManagerContextValue {
    windows: Map<AppId, WindowInfo>;
    openWindow: (appId: AppId, launchOrigin?: LaunchOrigin) => void;
    closeWindow: (appId: AppId) => void;
    minimizeWindow: (appId: AppId) => void;
    toggleMaximize: (appId: AppId) => void;
    bringToFront: (appId: AppId) => void;
    focusedApp: AppId | null;
    updateWindowPosition: (appId: AppId, top: string, left: string) => void;
    updateWindowSize: (appId: AppId, width: string, height: string) => void;
    setSnapState: (appId: AppId, snap: 'none' | 'left' | 'right') => void;
}

const WindowManagerContext = createContext<WindowManagerContextValue>({
    windows: new Map(),
    openWindow: () => {},
    closeWindow: () => {},
    minimizeWindow: () => {},
    toggleMaximize: () => {},
    bringToFront: () => {},
    focusedApp: null,
    updateWindowPosition: () => {},
    updateWindowSize: () => {},
    setSnapState: () => {},
});

const DEFAULT_POSITIONS: Record<AppId, { top: string; left: string }> = {
    about: { top: '8%', left: 'calc(50% - 360px)' },
    browser: { top: '6%', left: 'calc(50% - 430px)' },
    files: { top: '7%', left: 'calc(50% - 390px)' },
    resume: { top: '8%', left: 'calc(50% - 350px)' },
    skills: { top: '10%', left: 'calc(50% - 325px)' },
    projects: { top: '8%', left: 'calc(50% - 390px)' },
    contact: { top: '12%', left: 'calc(50% - 275px)' },
    links: { top: '14%', left: 'calc(50% - 200px)' },
    terminal: { top: '10%', left: 'calc(50% - 350px)' },
    settings: { top: '8%', left: 'calc(50% - 375px)' },
    'text-editor': { top: '9%', left: 'calc(50% - 360px)' },
    'focus-mode': { top: '10%', left: 'calc(50% - 430px)' },
};

const DEFAULT_SIZES: Record<AppId, { width: string; height: string }> = {
    about: { width: '720px', height: '600px' },
    browser: { width: '860px', height: '620px' },
    files: { width: '780px', height: '560px' },
    resume: { width: '700px', height: '600px' },
    skills: { width: '650px', height: '550px' },
    projects: { width: '780px', height: '580px' },
    contact: { width: '550px', height: '560px' },
    links: { width: '400px', height: '350px' },
    terminal: { width: '700px', height: '450px' },
    settings: { width: '750px', height: '550px' },
    'text-editor': { width: '720px', height: '560px' },
    'focus-mode': { width: '860px', height: '560px' },
};

function normalizeZIndices(windowsMap: Map<AppId, WindowInfo>, activeAppId?: AppId): Map<AppId, WindowInfo> {
    const next = new Map(windowsMap);
    const openWindows = Array.from(next.values())
        .filter(w => w.isOpen)
        .sort((a, b) => a.zIndex - b.zIndex);

    if (activeAppId) {
        const activeIdx = openWindows.findIndex(w => w.appId === activeAppId);
        if (activeIdx !== -1) {
            const [activeWin] = openWindows.splice(activeIdx, 1);
            openWindows.push(activeWin);
        }
    }

    openWindows.forEach((win, index) => {
        next.set(win.appId, {
            ...win,
            zIndex: 100 + index,
        });
    });

    return next;
}

function createWindowInfo(appId: AppId, zIndex: number, launchOrigin?: LaunchOrigin): WindowInfo {
    return {
        appId,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex,
        position: DEFAULT_POSITIONS[appId] || { top: '10%', left: '10%' },
        size: DEFAULT_SIZES[appId] || { width: '600px', height: '450px' },
        snapState: 'none',
        launchOrigin,
    };
}

function getTopVisibleWindowId(windows: Map<AppId, WindowInfo>): AppId | null {
    const topWindow = Array.from(windows.entries())
        .filter(([, win]) => win.isOpen && !win.isMinimized)
        .sort(([, a], [, b]) => b.zIndex - a.zIndex)[0];

    return topWindow?.[0] ?? null;
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
    const [managerState, setManagerState] = useState({
        windows: new Map<AppId, WindowInfo>(),
        currentZIndex: 100,
    });
    const [focusedApp, setFocusedApp] = useState<AppId | null>(null);
    const { windows } = managerState;

    const openWindow = useCallback((appId: AppId, launchOrigin?: LaunchOrigin) => {
        setManagerState(prev => {
            const next = new Map(prev.windows);
            const existing = next.get(appId);

            if (existing) {
                next.set(appId, {
                    ...existing,
                    isOpen: true,
                    isMinimized: false,
                    launchOrigin,
                });
            } else {
                next.set(appId, createWindowInfo(appId, 9999, launchOrigin));
            }

            const normalized = normalizeZIndices(next, appId);
            return { windows: normalized, currentZIndex: 100 + normalized.size };
        });
        setFocusedApp(appId);
    }, []);

    const closeWindow = useCallback(
        (appId: AppId) => {
            setManagerState(prev => {
                const next = new Map(prev.windows);
                next.delete(appId);
                const normalized = normalizeZIndices(next);
                return { windows: normalized, currentZIndex: 100 + normalized.size };
            });
            setFocusedApp(current => {
                if (current !== appId) return current;
                const next = new Map(windows);
                next.delete(appId);
                return getTopVisibleWindowId(next);
            });
        },
        [windows]
    );

    const minimizeWindow = useCallback(
        (appId: AppId) => {
            setManagerState(prev => {
                const next = new Map(prev.windows);
                const win = next.get(appId);
                if (win) {
                    next.set(appId, { ...win, isMinimized: true });
                }
                const normalized = normalizeZIndices(next);
                return { windows: normalized, currentZIndex: 100 + normalized.size };
            });
            setFocusedApp(current => {
                if (current !== appId) return current;
                const next = new Map(windows);
                const win = next.get(appId);
                if (win) {
                    next.set(appId, { ...win, isMinimized: true });
                }
                return getTopVisibleWindowId(next);
            });
        },
        [windows]
    );

    const toggleMaximize = useCallback((appId: AppId) => {
        setManagerState(prev => {
            const next = new Map(prev.windows);
            const win = next.get(appId);
            if (!win) {
                return prev;
            }

            const isMaximizing = !win.isMaximized;

            next.set(appId, {
                ...win,
                isMaximized: isMaximizing,
                snapState: 'none',
            });

            const normalized = normalizeZIndices(next, appId);
            return { windows: normalized, currentZIndex: 100 + normalized.size };
        });
        setFocusedApp(appId);
    }, []);

    const bringToFront = useCallback((appId: AppId) => {
        setManagerState(prev => {
            const next = new Map(prev.windows);
            const win = next.get(appId);
            if (!win) {
                return prev;
            }

            next.set(appId, { ...win, isMinimized: false });
            const normalized = normalizeZIndices(next, appId);
            return { windows: normalized, currentZIndex: 100 + normalized.size };
        });
        setFocusedApp(appId);
    }, []);

    const updateWindowPosition = useCallback((appId: AppId, top: string, left: string) => {
        setManagerState(prev => {
            const next = new Map(prev.windows);
            const win = next.get(appId);
            if (win) {
                next.set(appId, { ...win, position: { top, left } });
            }
            return { ...prev, windows: next };
        });
    }, []);

    const updateWindowSize = useCallback((appId: AppId, width: string, height: string) => {
        setManagerState(prev => {
            const next = new Map(prev.windows);
            const win = next.get(appId);
            if (win) {
                next.set(appId, { ...win, size: { width, height } });
            }
            return { ...prev, windows: next };
        });
    }, []);

    const setSnapState = useCallback((appId: AppId, snap: 'none' | 'left' | 'right') => {
        setManagerState(prev => {
            const next = new Map(prev.windows);
            const win = next.get(appId);
            if (win) {
                next.set(appId, { ...win, snapState: snap, isMaximized: false });
            }
            return { ...prev, windows: next };
        });
    }, []);

    return (
        <WindowManagerContext.Provider
            value={{
                windows,
                openWindow,
                closeWindow,
                minimizeWindow,
                toggleMaximize,
                bringToFront,
                focusedApp,
                updateWindowPosition,
                updateWindowSize,
                setSnapState,
            }}
        >
            {children}
        </WindowManagerContext.Provider>
    );
}

export function useWindowManager(): WindowManagerContextValue {
    return useContext(WindowManagerContext);
}

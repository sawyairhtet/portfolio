import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AppId, WindowInfo } from '../types';

interface WindowManagerContextValue {
    windows: Map<AppId, WindowInfo>;
    openWindow: (appId: AppId) => void;
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
    about: { top: '8%', left: '60px' },
    skills: { top: '10%', left: '20%' },
    projects: { top: '8%', left: '15%' },
    contact: { top: '12%', left: 'calc(50% + 20px)' },
    links: { top: '12%', left: '25%' },
    terminal: { top: '10%', left: '10%' },
    settings: { top: '8%', left: '18%' },
    'focus-mode': { top: '10%', left: '20%' },
};

const DEFAULT_SIZES: Record<AppId, { width: string; height: string }> = {
    about: { width: '720px', height: '680px' },
    skills: { width: '650px', height: '550px' },
    projects: { width: '700px', height: '500px' },
    contact: { width: '550px', height: '600px' },
    links: { width: '400px', height: '350px' },
    terminal: { width: '700px', height: '450px' },
    settings: { width: '750px', height: '550px' },
    'focus-mode': { width: '500px', height: '450px' },
};

const MAXIMIZED_Z_FLOOR = 1050;

function createWindowInfo(appId: AppId, zIndex: number): WindowInfo {
    return {
        appId,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex,
        position: DEFAULT_POSITIONS[appId] || { top: '10%', left: '10%' },
        size: DEFAULT_SIZES[appId] || { width: '600px', height: '450px' },
        snapState: 'none',
    };
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
    const [managerState, setManagerState] = useState({
        windows: new Map<AppId, WindowInfo>(),
        currentZIndex: 100,
    });
    const [focusedApp, setFocusedApp] = useState<AppId | null>(null);
    const { windows } = managerState;

    const openWindow = useCallback((appId: AppId) => {
        setManagerState(prev => {
            const nextZ = prev.currentZIndex + 1;
            const next = new Map(prev.windows);
            const existing = next.get(appId);

            if (existing) {
                // Already open: bring to front and unminimize.
                next.set(appId, {
                    ...existing,
                    isOpen: true,
                    isMinimized: false,
                    zIndex: nextZ,
                });
            } else {
                next.set(appId, createWindowInfo(appId, nextZ));
            }

            return { windows: next, currentZIndex: nextZ };
        });
        setFocusedApp(appId);
    }, []);

    const closeWindow = useCallback((appId: AppId) => {
        setManagerState(prev => {
            const next = new Map(prev.windows);
            next.delete(appId);
            return { ...prev, windows: next };
        });
        setFocusedApp(prev => (prev === appId ? null : prev));
    }, []);

    const minimizeWindow = useCallback((appId: AppId) => {
        setManagerState(prev => {
            const next = new Map(prev.windows);
            const win = next.get(appId);
            if (win) {
                next.set(appId, { ...win, isMinimized: true });
            }
            return { ...prev, windows: next };
        });
        setFocusedApp(prev => (prev === appId ? null : prev));
    }, []);

    const toggleMaximize = useCallback((appId: AppId) => {
        setManagerState(prev => {
            const next = new Map(prev.windows);
            const win = next.get(appId);
            if (!win) {
                return prev;
            }

            const isMaximizing = !win.isMaximized;
            const nextZ = isMaximizing
                ? Math.max(prev.currentZIndex + 1, MAXIMIZED_Z_FLOOR)
                : prev.currentZIndex;

            next.set(appId, {
                ...win,
                isMaximized: isMaximizing,
                snapState: 'none',
                zIndex: isMaximizing ? nextZ : win.zIndex,
            });

            return { windows: next, currentZIndex: nextZ };
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

            const nextZ = prev.currentZIndex + 1;
            next.set(appId, { ...win, zIndex: nextZ, isMinimized: false });
            return { windows: next, currentZIndex: nextZ };
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

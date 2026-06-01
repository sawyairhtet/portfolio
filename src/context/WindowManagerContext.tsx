import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { AppId, LaunchOrigin, WindowInfo } from '../types';
import { useSound } from './SoundContext';

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
    activeWorkspace: number;
    setActiveWorkspace: (index: number) => void;
    totalWorkspaces: number;
    moveWindowToWorkspace: (appId: AppId, workspaceIndex: number) => void;
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
    activeWorkspace: 0,
    setActiveWorkspace: () => {},
    totalWorkspaces: 1,
    moveWindowToWorkspace: () => {},
});

const DEFAULT_POSITION = { top: '10%', left: '10%' };
const DEFAULT_SIZE = { width: '600px', height: '450px' };
const MIN_WORKSPACES = 1;

const DEFAULT_POSITIONS = new Map<AppId, { top: string; left: string }>([
    ['about', { top: '8%', left: 'calc(50% - 360px)' }],
    ['browser', { top: '6%', left: 'calc(50% - 430px)' }],
    ['files', { top: '7%', left: 'calc(50% - 390px)' }],
    ['resume', { top: '8%', left: 'calc(50% - 350px)' }],
    ['skills', { top: '10%', left: 'calc(50% - 325px)' }],
    ['projects', { top: '8%', left: 'calc(50% - 390px)' }],
    ['contact', { top: '12%', left: 'calc(50% - 275px)' }],
    ['terminal', { top: '10%', left: 'calc(50% - 350px)' }],
    ['settings', { top: '8%', left: 'calc(50% - 375px)' }],
    ['text-editor', { top: '9%', left: 'calc(50% - 360px)' }],
    ['focus-mode', { top: '10%', left: 'calc(50% - 430px)' }],
    ['calendar', { top: '10%', left: 'calc(50% - 325px)' }],
    ['image-viewer', { top: '8%', left: 'calc(50% - 375px)' }],
    ['software', { top: '6%', left: 'calc(50% - 410px)' }],
]);

const DEFAULT_SIZES = new Map<AppId, { width: string; height: string }>([
    ['about', { width: '720px', height: '600px' }],
    ['browser', { width: '860px', height: '620px' }],
    ['files', { width: '780px', height: '560px' }],
    ['resume', { width: '700px', height: '600px' }],
    ['skills', { width: '650px', height: '550px' }],
    ['projects', { width: '780px', height: '580px' }],
    ['contact', { width: '550px', height: '560px' }],
    ['terminal', { width: '700px', height: '450px' }],
    ['settings', { width: '750px', height: '550px' }],
    ['text-editor', { width: '720px', height: '560px' }],
    ['focus-mode', { width: '860px', height: '560px' }],
    ['calendar', { width: '650px', height: '520px' }],
    ['image-viewer', { width: '750px', height: '540px' }],
    ['software', { width: '820px', height: '600px' }],
]);

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

function createWindowInfo(appId: AppId, zIndex: number, workspaceIndex: number, launchOrigin?: LaunchOrigin): WindowInfo {
    return {
        appId,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex,
        position: DEFAULT_POSITIONS.get(appId) ?? DEFAULT_POSITION,
        size: DEFAULT_SIZES.get(appId) ?? DEFAULT_SIZE,
        snapState: 'none',
        launchOrigin,
        workspaceIndex,
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
    const [activeWorkspace, setActiveWorkspaceState] = useState(0);
    const [totalWorkspaces, setTotalWorkspaces] = useState(1);
    const [focusedApp, setFocusedApp] = useState<AppId | null>(null);
    const { windows } = managerState;
    const { playMinimizeSound, playRestoreSound } = useSound();

    const windowsRef = useRef(windows);
    windowsRef.current = windows;

    const setActiveWorkspace = useCallback((index: number) => {
        const clamped = Math.max(0, index);
        setActiveWorkspaceState(clamped);
        setTotalWorkspaces(prev => Math.max(prev, clamped + 2, MIN_WORKSPACES));
    }, []);

    const openWindow = useCallback((appId: AppId, launchOrigin?: LaunchOrigin) => {
        const win = windowsRef.current.get(appId);
        if (win && win.isMinimized) {
            playRestoreSound();
        } else if (!win || !win.isOpen) {
            playRestoreSound();
        }
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
                next.set(appId, createWindowInfo(appId, 9999, activeWorkspace, launchOrigin));
            }

            const normalized = normalizeZIndices(next, appId);
            return { windows: normalized, currentZIndex: 100 + normalized.size };
        });
        setFocusedApp(appId);

        setTotalWorkspaces(prev => {
            const maxWs = Math.max(
                MIN_WORKSPACES,
                activeWorkspace + 2,
                prev,
                ...Array.from(windowsRef.current.values())
                    .filter(w => w.isOpen && w.workspaceIndex !== undefined)
                    .map(w => (w.workspaceIndex ?? 0) + 2)
            );
            return maxWs;
        });
    }, [activeWorkspace, playRestoreSound]);

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
                const next = new Map(windowsRef.current);
                next.delete(appId);
                return getTopVisibleWindowId(next);
            });
        },
        []
    );

    const minimizeWindow = useCallback(
        (appId: AppId) => {
            const win = windowsRef.current.get(appId);
            if (win && !win.isMinimized) {
                playMinimizeSound();
            }
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
                const next = new Map(windowsRef.current);
                const win = next.get(appId);
                if (win) {
                    next.set(appId, { ...win, isMinimized: true });
                }
                return getTopVisibleWindowId(next);
            });
        },
        [playMinimizeSound]
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
        const win = windowsRef.current.get(appId);
        if (win && win.isMinimized) {
            playRestoreSound();
        }
        setManagerState(prev => {
            const next = new Map(prev.windows);
            const win = next.get(appId);
            if (!win) {
                return prev;
            }

            next.set(appId, {
                ...win,
                isMinimized: false,
                workspaceIndex: activeWorkspace,
            });
            const normalized = normalizeZIndices(next, appId);
            return { windows: normalized, currentZIndex: 100 + normalized.size };
        });
        setFocusedApp(appId);
    }, [activeWorkspace, playRestoreSound]);

    const moveWindowToWorkspace = useCallback((appId: AppId, workspaceIndex: number) => {
        setManagerState(prev => {
            const next = new Map(prev.windows);
            const win = next.get(appId);
            if (win) {
                next.set(appId, { ...win, workspaceIndex });
            }
            return { ...prev, windows: next };
        });

        setTotalWorkspaces(prev => Math.max(prev, workspaceIndex + 2, MIN_WORKSPACES));
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
                activeWorkspace,
                setActiveWorkspace,
                totalWorkspaces,
                moveWindowToWorkspace,
            }}
        >
            {children}
        </WindowManagerContext.Provider>
    );
}

export function useWindowManager(): WindowManagerContextValue {
    return useContext(WindowManagerContext);
}

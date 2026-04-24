import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { PortfolioPreferences } from '../types';

const STORAGE_KEY = 'portfolioPreferences';

const DEFAULT_PREFERENCES: PortfolioPreferences = {
    wallpaperId: 'default',
    brightness: 80,
    showWindowButtons: false,
    enableSnap: true,
    enableResize: true,
    focusDim: true,
    fastBoot: true,
};

interface PreferencesContextValue {
    preferences: PortfolioPreferences;
    updatePreferences: (patch: Partial<PortfolioPreferences>) => void;
    resetStickyNotes: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue>({
    preferences: DEFAULT_PREFERENCES,
    updatePreferences: () => {},
    resetStickyNotes: () => {},
});

function readPreferences(): PortfolioPreferences {
    const legacyWallpaper = localStorage.getItem('portfolioWallpaper');
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return {
            ...DEFAULT_PREFERENCES,
            wallpaperId: legacyWallpaper || DEFAULT_PREFERENCES.wallpaperId,
        };
    }

    try {
        const parsed = JSON.parse(saved) as Partial<PortfolioPreferences>;
        return {
            ...DEFAULT_PREFERENCES,
            ...parsed,
            wallpaperId: legacyWallpaper || parsed.wallpaperId || DEFAULT_PREFERENCES.wallpaperId,
        };
    } catch {
        return {
            ...DEFAULT_PREFERENCES,
            wallpaperId: legacyWallpaper || DEFAULT_PREFERENCES.wallpaperId,
        };
    }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
    const [preferences, setPreferences] = useState<PortfolioPreferences>(readPreferences);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        localStorage.setItem('portfolioWallpaper', preferences.wallpaperId);
        document.body.classList.toggle('show-window-buttons', preferences.showWindowButtons);
        document.documentElement.style.setProperty('--desktop-brightness', String(preferences.brightness));
    }, [preferences]);

    const updatePreferences = useCallback((patch: Partial<PortfolioPreferences>) => {
        setPreferences((prev) => ({ ...prev, ...patch }));
    }, []);

    const resetStickyNotes = useCallback(() => {
        localStorage.removeItem('stickyNotePositions');
        window.dispatchEvent(new CustomEvent('portfolio:reset-sticky-notes'));
    }, []);

    const value = useMemo(
        () => ({ preferences, updatePreferences, resetStickyNotes }),
        [preferences, updatePreferences, resetStickyNotes],
    );

    return (
        <PreferencesContext.Provider value={value}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences(): PreferencesContextValue {
    return useContext(PreferencesContext);
}

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface ThemeContextValue {
    isDark: boolean;
    toggle: () => void;
    accentColor: string;
    setAccentColor: (color: string) => void;
}

const DEFAULT_ACCENT_COLOR = 'var(--accent-blue)';

const ThemeContext = createContext<ThemeContextValue>({
    isDark: true,
    toggle: () => {},
    accentColor: DEFAULT_ACCENT_COLOR,
    setAccentColor: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState<boolean>(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return document.documentElement.getAttribute('data-theme') === 'dark';
    });

    const [accentColor, setAccentColorState] = useState<string>(() => {
        return localStorage.getItem('portfolioAccent') || DEFAULT_ACCENT_COLOR;
    });

    // Sync data-theme attribute with state
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    // Sync accent color CSS custom properties
    useEffect(() => {
        document.documentElement.style.setProperty('--accent-bg-color', accentColor);
        document.documentElement.style.setProperty('--accent', 'var(--accent-bg-color)');
        document.documentElement.style.setProperty(
            '--accent-glow',
            'color-mix(in srgb, var(--accent-bg-color) 35%, transparent)'
        );
        document.documentElement.style.setProperty(
            '--accent-subtle',
            'color-mix(in srgb, var(--accent-bg-color) 12%, transparent)'
        );
        document.documentElement.style.setProperty(
            '--accent-surface',
            'color-mix(in srgb, var(--accent-bg-color) 8%, transparent)'
        );
        localStorage.setItem('portfolioAccent', accentColor);
    }, [accentColor]);

    const toggle = useCallback(() => setIsDark(prev => !prev), []);
    const setAccentColor = useCallback((color: string) => setAccentColorState(color), []);

    return (
        <ThemeContext.Provider value={{ isDark, toggle, accentColor, setAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    return useContext(ThemeContext);
}

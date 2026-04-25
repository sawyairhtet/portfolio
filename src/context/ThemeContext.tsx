import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface ThemeContextValue {
    isDark: boolean;
    toggle: () => void;
    accentColor: string;
    setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    isDark: true,
    toggle: () => {},
    accentColor: '#3584e4',
    setAccentColor: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState<boolean>(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return document.documentElement.getAttribute('data-theme') === 'dark';
    });

    const [accentColor, setAccentColorState] = useState<string>(() => {
        return localStorage.getItem('portfolioAccent') || '#3584e4';
    });

    // Sync data-theme attribute with state
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    // Sync accent color CSS custom properties
    useEffect(() => {
        document.documentElement.style.setProperty('--fedora-blue', accentColor);
        document.documentElement.style.setProperty('--color-primary', accentColor);
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

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

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const normalized = hex.trim().replace('#', '');
    if (!/^[0-9a-f]{6}$/i.test(normalized)) {
        return null;
    }

    return {
        r: Number.parseInt(normalized.slice(0, 2), 16),
        g: Number.parseInt(normalized.slice(2, 4), 16),
        b: Number.parseInt(normalized.slice(4, 6), 16),
    };
}

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
        const rgb = hexToRgb(accentColor);
        document.documentElement.style.setProperty('--accent', accentColor);
        if (rgb) {
            document.documentElement.style.setProperty(
                '--accent-glow',
                `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`
            );
            document.documentElement.style.setProperty(
                '--accent-subtle',
                `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`
            );
            document.documentElement.style.setProperty(
                '--accent-surface',
                `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`
            );
        }
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

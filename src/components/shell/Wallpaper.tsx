import { useEffect, useRef } from 'react';
import { useDevice } from '../../context/DeviceContext';
import type { WallpaperOption } from '../../types';
import { WALLPAPERS } from '../../config/data';
import { usePreferences } from '../../context/PreferencesContext';
import { useTheme } from '../../context/ThemeContext';

export function Wallpaper() {
    const { device } = useDevice();
    const { preferences } = usePreferences();
    const { isDark } = useTheme();
    const wallpaperRef = useRef<HTMLDivElement>(null);
    const selectedWallpaper: WallpaperOption =
        WALLPAPERS.find(w => w.id === preferences.wallpaperId) ?? WALLPAPERS[0];
    const customWallpaper = selectedWallpaper.id === 'default' ? null : selectedWallpaper;

    // Sync wallpaper dark/light with theme toggle
    useEffect(() => {
        if (isDark) {
            document.body.setAttribute('data-wallpaper-mode', 'dark');
        } else {
            document.body.setAttribute('data-wallpaper-mode', 'light');
        }
    }, [isDark]);

    // Parallax effect (desktop only)
    useEffect(() => {
        if (device !== 'desktop') return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
        if (reduceMotion || !hasFinePointer) return;

        const el = wallpaperRef.current;
        if (!el) return;

        let rafId: number | null = null;
        let idleTimeout: ReturnType<typeof setTimeout> | null = null;

        const handleMouseMove = (e: MouseEvent) => {
            if (rafId) return;

            if (idleTimeout) clearTimeout(idleTimeout);
            idleTimeout = setTimeout(() => {
                el.style.willChange = 'auto';
            }, 500);

            rafId = requestAnimationFrame(() => {
                el.style.willChange = 'transform';
                const x = (e.clientX / window.innerWidth - 0.5) * 2;
                const y = (e.clientY / window.innerHeight - 0.5) * 2;
                el.style.setProperty('--mouse-x', x.toFixed(3));
                el.style.setProperty('--mouse-y', y.toFixed(3));
                el.style.setProperty('--wallpaper-shift-x', `${(-x * 6).toFixed(2)}px`);
                el.style.setProperty('--wallpaper-shift-y', `${(-y * 6).toFixed(2)}px`);
                rafId = null;
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (rafId) cancelAnimationFrame(rafId);
            if (idleTimeout) clearTimeout(idleTimeout);
        };
    }, [device]);

    const style: Record<string, string> = {};
    const customWallpaperImage =
        customWallpaper && isDark && customWallpaper.darkImage
            ? customWallpaper.darkImage
            : customWallpaper?.image;
    const customWallpaperBackground =
        customWallpaper?.gradient ??
        (customWallpaperImage ? `url("${customWallpaperImage}") center / cover no-repeat` : null);

    if (customWallpaperBackground) {
        style['--custom-wallpaper-bg'] = customWallpaperBackground;
    }

    return (
        <div
            ref={wallpaperRef}
            className={`wallpaper${customWallpaperBackground ? ' custom-wallpaper' : ''}`}
            style={style}
        />
    );
}

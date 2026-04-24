import { useEffect, useRef, useState } from 'react';
import { useDevice } from '../../context/DeviceContext';
import type { WallpaperOption } from '../../types';
import { WALLPAPERS } from '../../config/data';
import { usePreferences } from '../../context/PreferencesContext';

export function Wallpaper() {
    const { device } = useDevice();
    const { preferences } = usePreferences();
    const wallpaperRef = useRef<HTMLDivElement>(null);
    const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
    const customWallpaper: WallpaperOption | null =
        WALLPAPERS.find(w => w.id === preferences.wallpaperId && w.gradient) ?? null;

    // Time-of-day detection
    useEffect(() => {
        const hour = new Date().getHours();
        setTimeOfDay(hour >= 6 && hour < 18 ? 'day' : 'night');
    }, []);

    // Set body data-time attribute
    useEffect(() => {
        document.body.setAttribute('data-time', timeOfDay);
    }, [timeOfDay]);

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

            el.style.willChange = 'transform';
            if (idleTimeout) clearTimeout(idleTimeout);
            idleTimeout = setTimeout(() => {
                el.style.willChange = 'auto';
            }, 500);

            rafId = requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 2;
                const y = (e.clientY / window.innerHeight - 0.5) * 2;
                el.style.setProperty('--mouse-x', x.toFixed(3));
                el.style.setProperty('--mouse-y', y.toFixed(3));
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
    if (customWallpaper?.gradient) {
        style['--custom-wallpaper-bg'] = customWallpaper.gradient;
    }

    return (
        <div
            ref={wallpaperRef}
            className={`wallpaper${customWallpaper?.gradient ? ' custom-wallpaper' : ''}`}
            style={style}
        />
    );
}

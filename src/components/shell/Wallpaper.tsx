import { useEffect, useRef } from 'react';
import { useDevice } from '../../context/DeviceContext';
import { usePreferences } from '../../context/PreferencesContext';
import { useTimeOfDay } from '../../lib/useTimeOfDay';
import type { WallpaperOption } from '../../types';
import { WALLPAPERS } from '../../config/data';

export function Wallpaper() {
    const { device } = useDevice();
    const { preferences } = usePreferences();
    const wallpaperRef = useRef<HTMLDivElement>(null);
    const { timeOfDay, crossfadeProgress } = useTimeOfDay();
    const selectedWallpaper: WallpaperOption =
        WALLPAPERS.find(w => w.id === preferences.wallpaperId) ?? WALLPAPERS[0];
    const isDefaultWallpaper = selectedWallpaper.id === 'default';
    const useTimeBased = preferences.wallpaperTimeOfDay && isDefaultWallpaper;

    useEffect(() => {
        const mode = timeOfDay === 'day' || timeOfDay === 'dawn' ? 'light' : 'dark';
        document.body.setAttribute('data-wallpaper-mode', mode);
    }, [timeOfDay]);

    useEffect(() => {
        if (!useTimeBased) return;
        document.documentElement.style.setProperty(
            '--wallpaper-crossfade',
            String(crossfadeProgress)
        );
    }, [crossfadeProgress, useTimeBased]);

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

    const imageSrc = selectedWallpaper.image;
    const darkImageSrc = selectedWallpaper.darkImage;
    const isCustomWallpaper = !isDefaultWallpaper;

    return (
        <div
            ref={wallpaperRef}
            className={`wallpaper${isCustomWallpaper ? ' custom-wallpaper' : ''}${useTimeBased ? ' time-based' : ''}`}
            style={
                isCustomWallpaper && imageSrc
                    ? {
                          '--custom-wallpaper-bg': `url("${imageSrc}") center / cover no-repeat`,
                      } as React.CSSProperties
                    : {}
            }
        >
            {useTimeBased && darkImageSrc && (
                <div
                    className="wallpaper-night-layer"
                    style={{
                        backgroundImage: `url("${darkImageSrc}")`,
                        opacity: timeOfDay === 'night' ? 1 : crossfadeProgress,
                    }}
                    aria-hidden="true"
                />
            )}
            {isCustomWallpaper && darkImageSrc && (
                <div
                    className="wallpaper-night-layer theme-driven"
                    style={{
                        backgroundImage: `url("${darkImageSrc}")`,
                    }}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}

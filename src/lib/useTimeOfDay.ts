import { useState, useEffect } from 'react';

export type WallpaperTimeOfDay = 'day' | 'dusk' | 'night' | 'dawn';

const DUSK_START_HOUR = 17;
const DUSK_END_HOUR = 19;
const DAWN_START_HOUR = 5;
const DAWN_END_HOUR = 7;

function getTimeOfDay(hour: number): WallpaperTimeOfDay {
    if (hour >= DAWN_END_HOUR && hour < DUSK_START_HOUR) return 'day';
    if (hour >= DUSK_START_HOUR && hour < DUSK_END_HOUR) return 'dusk';
    if (hour >= DUSK_END_HOUR || hour < DAWN_START_HOUR) return 'night';
    return 'dawn';
}

function getCrossfadeProgress(hour: number, minutes: number): number {
    const totalMinutes = hour * 60 + minutes;
    const duskStart = DUSK_START_HOUR * 60;
    const duskEnd = DUSK_END_HOUR * 60;
    const dawnStart = DAWN_START_HOUR * 60;
    const dawnEnd = DAWN_END_HOUR * 60;

    if (totalMinutes >= duskStart && totalMinutes < duskEnd) {
        return (totalMinutes - duskStart) / (duskEnd - duskStart);
    }
    if (totalMinutes >= dawnStart && totalMinutes < dawnEnd) {
        return (totalMinutes - dawnStart) / (dawnEnd - dawnStart);
    }
    return 0;
}

export function useTimeOfDay() {
    const [timeOfDay, setTimeOfDay] = useState<WallpaperTimeOfDay>(() => {
        const hour = new Date().getHours();
        return getTimeOfDay(hour);
    });
    const [crossfadeProgress, setCrossfadeProgress] = useState<number>(() => {
        const now = new Date();
        return getCrossfadeProgress(now.getHours(), now.getMinutes());
    });

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const hour = now.getHours();
            const minutes = now.getMinutes();
            setTimeOfDay(getTimeOfDay(hour));
            setCrossfadeProgress(getCrossfadeProgress(hour, minutes));
        };

        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, []);

    return { timeOfDay, crossfadeProgress };
}

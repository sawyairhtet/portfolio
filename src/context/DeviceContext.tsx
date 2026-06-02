import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { DeviceType } from '../types';

interface DeviceContextValue {
    device: DeviceType;
    isTouch: boolean;
}

const DeviceContext = createContext<DeviceContextValue>({ device: 'desktop', isTouch: false });

function detectDevice(): DeviceType {
    const width = window.innerWidth;
    if (width <= 767) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
}

function detectTouch(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function DeviceProvider({ children }: { children: ReactNode }) {
    const [device, setDevice] = useState<DeviceType>(detectDevice);
    const [isTouch] = useState(detectTouch);

    const handleResize = useCallback(() => {
        setDevice(detectDevice());
    }, []);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | null = null;

        const debouncedResize = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(handleResize, 300);
        };

        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            if (timeout) clearTimeout(timeout);
        };
    }, [handleResize]);

    return <DeviceContext.Provider value={{ device, isTouch }}>{children}</DeviceContext.Provider>;
}

export function useDevice(): DeviceContextValue {
    return useContext(DeviceContext);
}

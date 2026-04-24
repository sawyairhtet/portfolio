import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { DeviceType } from '../types';

interface DeviceContextValue {
    device: DeviceType;
}

const DeviceContext = createContext<DeviceContextValue>({ device: 'desktop' });

function detectDevice(): DeviceType {
    const width = window.innerWidth;
    if (width <= 767) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
}

export function DeviceProvider({ children }: { children: ReactNode }) {
    const [device, setDevice] = useState<DeviceType>(detectDevice);

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

    return <DeviceContext.Provider value={{ device }}>{children}</DeviceContext.Provider>;
}

export function useDevice(): DeviceContextValue {
    return useContext(DeviceContext);
}

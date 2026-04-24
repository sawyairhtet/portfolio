import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { Notification, Toast } from '../types';
import { DEFAULT_NOTIFICATIONS } from '../config/data';

interface NotificationContextValue {
    notifications: Notification[];
    toasts: Toast[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    dismissNotification: (id: string) => void;
    clearAllNotifications: () => void;
    showToast: (message: string, icon?: string) => void;
    isDnd: boolean;
    setDnd: (dnd: boolean) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
    notifications: [],
    toasts: [],
    addNotification: () => {},
    dismissNotification: () => {},
    clearAllNotifications: () => {},
    showToast: () => {},
    isDnd: false,
    setDnd: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isDnd, setIsDnd] = useState(() => localStorage.getItem('portfolioDnd') === 'true');
    const toastIdRef = useRef(0);

    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        if (isDnd) return;
        const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setNotifications((prev) => [{ ...notification, id }, ...prev]);
    }, [isDnd]);

    const dismissNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const showToast = useCallback((message: string, icon = 'fas fa-info-circle') => {
        if (isDnd) return;

        const id = `toast-${toastIdRef.current++}`;
        const toast: Toast = { id, message, icon };
        setToasts((prev) => [...prev, toast]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, [isDnd]);

    const setDnd = useCallback((dnd: boolean) => {
        setIsDnd(dnd);
        localStorage.setItem('portfolioDnd', String(dnd));
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                toasts,
                addNotification,
                dismissNotification,
                clearAllNotifications,
                showToast,
                isDnd,
                setDnd,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications(): NotificationContextValue {
    return useContext(NotificationContext);
}

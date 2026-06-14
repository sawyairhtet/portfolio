import type { Notification } from '../types';

// Default notifications. Kept in its own module so the eager NotificationProvider
// (mounted on every route, including the editorial front door at /) does not pull
// the desktop-only ./data.ts module into the front-door bundle. Consumed by
// src/context/NotificationContext.tsx; the desktop reads it through that provider.
export const DEFAULT_NOTIFICATIONS: Notification[] = [
    {
        id: 'welcome',
        title: 'Welcome to Saw Ye Htet',
        body: 'IT support & operations specialist. Open the resume, projects, or contact app for the quick path.',
        icon: 'desktop',
        iconBg: 'linear-gradient(135deg, var(--accent-color), var(--accent-bg-color))',
        time: 'Just now',
        group: 'System',
        action: {
            label: 'View Resume',
            appId: 'resume',
        },
    },
];

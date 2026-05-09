import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWindowManager } from '../../context/WindowManagerContext';
import type { AppId } from '../../types';
import { DesktopShell } from './DesktopShell';

const VALID_APPS: AppId[] = [
    'about',
    'browser',
    'files',
    'skills',
    'projects',
    'contact',
    'links',
    'terminal',
    'settings',
    'text-editor',
    'focus-mode',
];

export function DeepLinkHandler() {
    const { appId } = useParams<{ appId: string }>();
    const { openWindow } = useWindowManager();
    const navigate = useNavigate();

    useEffect(() => {
        if (appId && VALID_APPS.includes(appId as AppId)) {
            openWindow(appId as AppId);
        } else {
            navigate('/', { replace: true });
        }
    }, [appId, openWindow, navigate]);

    return <DesktopShell />;
}

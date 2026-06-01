import { useState, useEffect, useCallback } from 'react';
import { Icon } from '../ui/Icon';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useDevice } from '../../context/DeviceContext';
import { APP_DEFINITIONS } from '../../config/data';

interface TopBarProps {
    onActivitiesToggle: () => void;
    onQuickSettingsToggle: () => void;
    onClockClick: () => void;
    isActivitiesOpen: boolean;
    isQuickSettingsOpen: boolean;
    isNotificationCenterOpen: boolean;
}

export function TopBar({
    onActivitiesToggle,
    onQuickSettingsToggle,
    onClockClick,
    isActivitiesOpen,
    isQuickSettingsOpen,
    isNotificationCenterOpen,
}: TopBarProps) {
    const [clockText, setClockText] = useState('');
    const [statusTime, setStatusTime] = useState('');
    const { focusedApp } = useWindowManager();
    const { device } = useDevice();

    const updateClock = useCallback(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const day = now.toLocaleDateString('en-US', { weekday: 'short' });
        setClockText(`${day} ${hours}:${minutes}`);
        setStatusTime(`${hours}:${minutes}`);
    }, []);

    useEffect(() => {
        updateClock();
        const interval = setInterval(updateClock, 60000);
        return () => clearInterval(interval);
    }, [updateClock]);

    const focusedAppDefinition = focusedApp
        ? APP_DEFINITIONS.find(app => app.id === focusedApp)
        : undefined;
    const focusedAppName = focusedAppDefinition?.label ?? '';

    return (
        <div className="top-bar">
            {/* GNOME Panel Left - Activities */}
            <div className="menu-bar-left">
                <button
                    className={`activities-btn pill${isActivitiesOpen ? ' active' : ''}`}
                    title="Activities (Super)"
                    aria-label="Activities overview"
                    aria-expanded={isActivitiesOpen}
                    aria-haspopup="dialog"
                    onClick={onActivitiesToggle}
                >
                    Activities
                </button>
                <span className="focused-app-name" aria-label="Focused application name">
                    {focusedAppDefinition && <Icon name={focusedAppDefinition.icon} />}
                    {focusedAppName}
                </span>
            </div>

            {/* Mobile Status Bar Items */}
            {device !== 'desktop' && (
                <div
                    className="status-bar"
                    role="presentation"
                    aria-label="Status bar (decorative)"
                >
                    <div className="status-time" aria-hidden="true">
                        {statusTime}
                    </div>
                    <div className="status-icons" aria-hidden="true">
                        <Icon name="signal" />
                        <Icon name="wifi" />
                        <Icon name="battery-three-quarters" />
                    </div>
                </div>
            )}

            {/* GNOME Panel Center - Clock */}
            <div className="menu-bar-center">
                <button
                    className="menu-clock pill"
                    onClick={onClockClick}
                    aria-label="Open notification center"
                    aria-expanded={isNotificationCenterOpen}
                    aria-haspopup="dialog"
                >
                    {clockText}
                </button>
            </div>

            {/* GNOME Panel Right - Quick Settings */}
            <div className="menu-bar-right">
                <button
                    className="status-menu pill"
                    aria-label="Quick Settings"
                    aria-expanded={isQuickSettingsOpen}
                    aria-haspopup="dialog"
                    title="Quick Settings"
                    onClick={onQuickSettingsToggle}
                >
                    <Icon name="wifi" />
                    <Icon name="volume-up" />
                    <Icon name="battery-three-quarters" />
                </button>
            </div>
        </div>
    );
}

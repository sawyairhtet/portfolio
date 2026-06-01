import { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '../ui/Icon';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useDevice } from '../../context/DeviceContext';
import { APP_DEFINITIONS } from '../../config/data';

type BatteryIcon = 'battery-empty' | 'battery-quarter' | 'battery-half' | 'battery-three-quarters' | 'battery-full' | 'battery-charging';

function getBatteryState(): { level: number; charging: boolean } {
    const now = Date.now();
    const minute = new Date(now).getMinutes();
    // Simulate: even minutes = discharging (level goes 100->60), odd minutes = charging
    const cyclePos = minute % 20;
    if (cyclePos < 10) {
        return { level: 100 - cyclePos * 4, charging: false };
    }
    return { level: Math.min(100, cyclePos * 4 - 20), charging: true };
}

function getBatteryIcon(level: number, charging: boolean): BatteryIcon {
    if (charging) return 'battery-charging';
    if (level <= 20) return 'battery-empty';
    if (level <= 40) return 'battery-quarter';
    if (level <= 60) return 'battery-half';
    if (level <= 80) return 'battery-three-quarters';
    return 'battery-full';
}

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
    const [batteryIcon, setBatteryIcon] = useState<BatteryIcon>(() => {
        const { level, charging } = getBatteryState();
        return getBatteryIcon(level, charging);
    });
    const batteryRef = useRef<BatteryIcon>(batteryIcon);
    batteryRef.current = batteryIcon;

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
        const clockInterval = setInterval(updateClock, 60000);
        const batteryInterval = setInterval(() => {
            const { level, charging } = getBatteryState();
            setBatteryIcon(getBatteryIcon(level, charging));
        }, 30000);
        return () => {
            clearInterval(clockInterval);
            clearInterval(batteryInterval);
        };
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
                        <Icon name={batteryIcon} />
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
                    <Icon name={batteryIcon} />
                </button>
            </div>
        </div>
    );
}

import { useState, useCallback, useEffect, useRef, type KeyboardEvent } from 'react';
import { Icon } from './Icon';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useSound } from '../../context/SoundContext';
import { usePreferences } from '../../context/PreferencesContext';

interface QuickSettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function QuickSettingsPanel({ isOpen, onClose }: QuickSettingsPanelProps) {
    const { isDark, toggle } = useTheme();
    const { isDnd, setDnd } = useNotifications();
    const { openWindow } = useWindowManager();
    const { volume, setVolume } = useSound();
    const { preferences, updatePreferences } = usePreferences();
    const [wifiOn, setWifiOn] = useState(true);
    const [btOn, setBtOn] = useState(false);
    const [powerProfile, setPowerProfile] = useState<'balanced' | 'performance' | 'power-saver'>(
        'balanced'
    );
    const [nightLight, setNightLight] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const handleSettings = useCallback(() => {
        openWindow('settings');
        onClose();
    }, [openWindow, onClose]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Escape') {
                onClose();
            }
        },
        [onClose]
    );

    // Focus trap while panel is open
    useEffect(() => {
        if (!isOpen) return;

        const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        window.setTimeout(() => firstFocusable?.focus(), 50);

        const handleTabTrap = (e: globalThis.KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            const panel = panelRef.current;
            if (!panel) return;

            const focusable = Array.from(
                panel.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ).filter(el => el.offsetParent !== null);

            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleTabTrap);
        return () => document.removeEventListener('keydown', handleTabTrap);
    }, [isOpen]);

    return (
        <div
            ref={panelRef}
            className={`quick-settings-panel${isOpen ? ' visible' : ''}`}
            role="dialog"
            aria-label="Quick Settings"
            aria-modal="true"
            aria-hidden={!isOpen}
            inert={!isOpen || undefined}
            onKeyDown={handleKeyDown}
        >
            <div className="qs-header">
                <span>Quick Settings</span>
                <small>Fedora Workstation</small>
            </div>
            <div className="qs-tiles">
                <button
                    type="button"
                    className={`qs-tile${wifiOn ? ' active' : ''}`}
                    aria-pressed={wifiOn}
                    aria-label="Wi-Fi"
                    onClick={() => setWifiOn(p => !p)}
                >
                    <div className="qs-tile-icon">
                        <Icon name="wifi" />
                    </div>
                    <div className="qs-tile-label">Wi-Fi</div>
                </button>
                <button
                    type="button"
                    className={`qs-tile${btOn ? ' active' : ''}`}
                    aria-pressed={btOn}
                    aria-label="Bluetooth"
                    onClick={() => setBtOn(p => !p)}
                >
                    <div className="qs-tile-icon">
                        <Icon name="bluetooth-b" />
                    </div>
                    <div className="qs-tile-label">Bluetooth</div>
                </button>
                <button
                    type="button"
                    className={`qs-tile${powerProfile !== 'balanced' ? ' active' : ''}`}
                    aria-pressed={powerProfile !== 'balanced'}
                    aria-label="Power Profile"
                    onClick={() => {
                        const profiles: Array<'balanced' | 'performance' | 'power-saver'> = [
                            'balanced',
                            'performance',
                            'power-saver',
                        ];
                        const idx = profiles.indexOf(powerProfile);
                        setPowerProfile(profiles[(idx + 1) % profiles.length]);
                    }}
                >
                    <div className="qs-tile-icon">
                        <Icon name="bolt" />
                    </div>
                    <div className="qs-tile-label">
                        {powerProfile === 'balanced'
                            ? 'Balanced'
                            : powerProfile === 'performance'
                              ? 'Performance'
                              : 'Power Saver'}
                    </div>
                </button>
                <button
                    type="button"
                    className={`qs-tile${isDark ? ' active' : ''}`}
                    aria-pressed={isDark}
                    aria-label="Dark Style"
                    onClick={toggle}
                >
                    <div className="qs-tile-icon">
                        <Icon name="moon" />
                    </div>
                    <div className="qs-tile-label">Dark Style</div>
                </button>
                <button
                    type="button"
                    className={`qs-tile${nightLight ? ' active' : ''}`}
                    aria-pressed={nightLight}
                    aria-label="Night Light"
                    onClick={() => setNightLight(p => !p)}
                >
                    <div className="qs-tile-icon">
                        <Icon name="lightbulb" />
                    </div>
                    <div className="qs-tile-label">Night Light</div>
                </button>
                <button
                    type="button"
                    className={`qs-tile${isDnd ? ' active' : ''}`}
                    aria-pressed={isDnd}
                    aria-label="Do Not Disturb"
                    onClick={() => setDnd(!isDnd)}
                >
                    <div className="qs-tile-icon">
                        <Icon name="bell-slash" />
                    </div>
                    <div className="qs-tile-label">Do Not Disturb</div>
                </button>
            </div>

            <div className="qs-sliders">
                <div className="qs-slider-row">
                    <Icon name="sun" className="qs-slider-icon" />
                    <input
                        type="range"
                        className="qs-slider"
                        min={20}
                        max={100}
                        step={5}
                        value={preferences.brightness}
                        onChange={e => updatePreferences({ brightness: Number(e.target.value) })}
                        aria-label="Brightness"
                    />
                </div>
                <div className="qs-slider-row">
                    <Icon name="volume-up" className="qs-slider-icon" />
                    <input
                        type="range"
                        className="qs-slider"
                        min={0}
                        max={100}
                        step={5}
                        value={volume}
                        onChange={e => setVolume(Number(e.target.value))}
                        aria-label="Volume"
                    />
                </div>
            </div>

            <div className="qs-footer">
                <button
                    type="button"
                    className="qs-footer-btn"
                    aria-label="Open Settings"
                    onClick={handleSettings}
                >
                    <Icon name="cog" />
                    <span>Settings</span>
                </button>
                <button
                    type="button"
                    className="qs-footer-btn"
                    aria-label="Lock Screen"
                    onClick={onClose}
                >
                    <Icon name="lock" />
                    <span>Lock</span>
                </button>
                <button
                    type="button"
                    className="qs-footer-btn"
                    aria-label="Power options"
                    onClick={onClose}
                >
                    <Icon name="power-off" />
                    <span>Power</span>
                </button>
            </div>
        </div>
    );
}

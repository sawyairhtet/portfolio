import { useState, useCallback } from 'react';
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
    const { isMuted, toggleMute, volume, setVolume } = useSound();
    const { preferences, updatePreferences } = usePreferences();
    const [wifiOn, setWifiOn] = useState(true);
    const [btOn, setBtOn] = useState(false);

    const handleSettings = useCallback(() => {
        openWindow('settings');
        onClose();
    }, [openWindow, onClose]);

    return (
        <div
            className={`quick-settings-panel${isOpen ? ' visible' : ''}`}
            role="dialog"
            aria-label="Quick Settings"
            aria-modal="false"
            aria-hidden={!isOpen}
        >
            <div className="qs-tiles">
                <button
                    className={`qs-tile${wifiOn ? ' active' : ''}`}
                    aria-pressed={wifiOn}
                    aria-label="Wi-Fi"
                    onClick={() => setWifiOn(p => !p)}
                >
                    <div className="qs-tile-icon">
                        <i className="fas fa-wifi" aria-hidden="true" />
                    </div>
                    <div className="qs-tile-label">Wi-Fi</div>
                </button>
                <button
                    className={`qs-tile${btOn ? ' active' : ''}`}
                    aria-pressed={btOn}
                    aria-label="Bluetooth"
                    onClick={() => setBtOn(p => !p)}
                >
                    <div className="qs-tile-icon">
                        <i className="fab fa-bluetooth-b" aria-hidden="true" />
                    </div>
                    <div className="qs-tile-label">Bluetooth</div>
                </button>
                <button
                    className={`qs-tile${isDark ? ' active' : ''}`}
                    aria-pressed={isDark}
                    aria-label="Dark Mode"
                    onClick={toggle}
                >
                    <div className="qs-tile-icon">
                        <i className="fas fa-moon" aria-hidden="true" />
                    </div>
                    <div className="qs-tile-label">Dark Mode</div>
                </button>
                <button
                    className={`qs-tile${isMuted ? ' active' : ''}`}
                    aria-pressed={isMuted}
                    aria-label="Mute"
                    onClick={toggleMute}
                >
                    <div className="qs-tile-icon">
                        <i
                            className={isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'}
                            aria-hidden="true"
                        />
                    </div>
                    <div className="qs-tile-label">{isMuted ? 'Muted' : 'Sound'}</div>
                </button>
                <button
                    className={`qs-tile${isDnd ? ' active' : ''}`}
                    aria-pressed={isDnd}
                    aria-label="Do Not Disturb"
                    onClick={() => setDnd(!isDnd)}
                >
                    <div className="qs-tile-icon">
                        <i className="fas fa-bell-slash" aria-hidden="true" />
                    </div>
                    <div className="qs-tile-label">Do Not Disturb</div>
                </button>
            </div>

            <div className="qs-sliders">
                <div className="qs-slider-row">
                    <i className="fas fa-sun qs-slider-icon" aria-hidden="true" />
                    <input
                        type="range"
                        className="qs-slider"
                        min={20}
                        max={100}
                        value={preferences.brightness}
                        onChange={e => updatePreferences({ brightness: Number(e.target.value) })}
                        aria-label="Brightness"
                    />
                </div>
                <div className="qs-slider-row">
                    <i className="fas fa-volume-up qs-slider-icon" aria-hidden="true" />
                    <input
                        type="range"
                        className="qs-slider"
                        min={0}
                        max={100}
                        value={volume}
                        onChange={e => setVolume(Number(e.target.value))}
                        aria-label="Volume"
                    />
                </div>
            </div>

            <div className="qs-footer">
                <button
                    className="qs-footer-btn"
                    aria-label="Open Settings"
                    onClick={handleSettings}
                >
                    <i className="fas fa-cog" aria-hidden="true" />
                    <span>Settings</span>
                </button>
                <button className="qs-footer-btn" aria-label="Lock Screen" onClick={onClose}>
                    <i className="fas fa-lock" aria-hidden="true" />
                    <span>Lock</span>
                </button>
                <button className="qs-footer-btn" aria-label="Power options" onClick={onClose}>
                    <i className="fas fa-power-off" aria-hidden="true" />
                    <span>Power</span>
                </button>
            </div>
        </div>
    );
}

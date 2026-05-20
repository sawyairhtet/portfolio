import { useState, useCallback, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { useNotifications } from '../../context/NotificationContext';
import { usePreferences } from '../../context/PreferencesContext';
import { WALLPAPERS, ACCENT_COLORS } from '../../config/data';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Palette,
    SpeakerHigh,
    AppWindow,
    Info,
    Moon,
    SpeakerSimpleHigh,
    BellSlash,
    Columns,
    ArrowsOutSimple,
    Gauge,
} from '@phosphor-icons/react';

type SettingsPanel = 'appearance' | 'sound' | 'windows' | 'about';

const NAV_ITEMS: { id: SettingsPanel; label: string; icon: React.ReactNode }[] = [
    { id: 'appearance', label: 'Appearance', icon: <Palette weight="duotone" size={16} /> },
    { id: 'sound', label: 'Sound', icon: <SpeakerHigh weight="duotone" size={16} /> },
    { id: 'windows', label: 'Windows', icon: <AppWindow weight="duotone" size={16} /> },
    { id: 'about', label: 'About', icon: <Info weight="duotone" size={16} /> },
];

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            className={`adw-toggle${checked ? ' on' : ''}`}
            onClick={() => onChange(!checked)}
        >
            <span className="adw-toggle-thumb" />
        </button>
    );
}

export function SettingsApp() {
    const { isDark, toggle, accentColor, setAccentColor } = useTheme();
    const { isMuted, toggleMute, volume, setVolume } = useSound();
    const { isDnd, setDnd } = useNotifications();
    const { preferences, updatePreferences } = usePreferences();
    const [activePanel, setActivePanel] = useState<SettingsPanel>('appearance');
    const reduced = useReducedMotion();

    useEffect(() => {
        const handleSettingsPanelRequest = (event: Event) => {
            const panel = (event as CustomEvent<SettingsPanel>).detail;
            if (['appearance', 'sound', 'windows', 'about'].includes(panel)) {
                setActivePanel(panel);
            }
        };

        window.addEventListener('portfolio:settings-panel', handleSettingsPanelRequest);
        return () => {
            window.removeEventListener('portfolio:settings-panel', handleSettingsPanelRequest);
        };
    }, []);

    const handleWallpaperChange = useCallback(
        (id: string) => {
            updatePreferences({ wallpaperId: id });
        },
        [updatePreferences]
    );

    return (
        <>
            <div className="settings-sidebar">
                <div className="settings-sidebar-header">
                    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" className="settings-fedora-logo">
                        <circle cx="24" cy="24" r="22" fill="var(--accent-bg-color)" opacity="0.2" />
                        <text x="24" y="30" textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--accent-bg-color)">F</text>
                    </svg>
                    <span className="settings-sidebar-label">Settings</span>
                </div>
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        className={`settings-nav-item${activePanel === item.id ? ' active' : ''}`}
                        aria-pressed={activePanel === item.id}
                        onClick={() => setActivePanel(item.id)}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </div>
            <div className="settings-content">
                {activePanel === 'appearance' && (
                    <div className="settings-panel active">
                        <h2>Appearance</h2>
                        <div className="settings-card">
                            <h3>Background</h3>
                            <div className="wallpaper-grid">
                                {WALLPAPERS.map(wp => (
                                    <button
                                        key={wp.id}
                                        className={`wallpaper-option${preferences.wallpaperId === wp.id ? ' active' : ''}`}
                                        data-wallpaper={wp.id}
                                        style={{
                                            background:
                                                wp.gradient ||
                                                (isDark && wp.darkImage
                                                    ? `url("${wp.darkImage}") center / cover no-repeat`
                                                    : wp.image
                                                      ? `url("${wp.image}") center / cover no-repeat`
                                                      : undefined),
                                        }}
                                        aria-label={wp.label}
                                        title={wp.label}
                                        onClick={() => handleWallpaperChange(wp.id)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="settings-card">
                            <h3>Accent Color</h3>
                            <div className="accent-color-options">
                                {ACCENT_COLORS.map(ac => (
                                    <motion.button
                                        key={ac.color}
                                        className={`accent-swatch${accentColor === ac.color ? ' active' : ''}`}
                                        style={{ background: ac.color }}
                                        aria-label={ac.label}
                                        title={ac.label}
                                        onClick={() => setAccentColor(ac.color)}
                                        whileHover={reduced ? undefined : { scale: 1.2 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="settings-card">
                            <h3>Style</h3>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <Moon weight="duotone" size={16} />
                                    <span>Dark Mode</span>
                                </span>
                                <ToggleSwitch checked={isDark} onChange={toggle} label="Dark mode" />
                            </div>
                        </div>
                    </div>
                )}

                {activePanel === 'sound' && (
                    <div className="settings-panel active">
                        <h2>Sound</h2>
                        <div className="settings-card">
                            <h3>System Sounds</h3>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <SpeakerSimpleHigh weight="duotone" size={16} />
                                    <span>Sound Effects</span>
                                </span>
                                <ToggleSwitch checked={!isMuted} onChange={toggleMute} label="Sound effects" />
                            </div>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <SpeakerHigh weight="duotone" size={16} />
                                    <span>Volume</span>
                                </span>
                                <input
                                    type="range"
                                    className="settings-slider"
                                    min={0}
                                    max={100}
                                    value={volume}
                                    onChange={event => setVolume(Number(event.target.value))}
                                    aria-label="Sound volume"
                                />
                            </div>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <BellSlash weight="duotone" size={16} />
                                    <span>Do Not Disturb</span>
                                </span>
                                <ToggleSwitch checked={isDnd} onChange={v => setDnd(v)} label="Do Not Disturb" />
                            </div>
                        </div>
                    </div>
                )}

                {activePanel === 'windows' && (
                    <div className="settings-panel active">
                        <h2>Windows</h2>
                        <div className="settings-card">
                            <h3>Titlebar</h3>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <AppWindow weight="duotone" size={16} />
                                    <span>Show minimize and maximize</span>
                                </span>
                                <ToggleSwitch
                                    checked={preferences.showWindowButtons}
                                    onChange={v => updatePreferences({ showWindowButtons: v })}
                                    label="Show minimize and maximize buttons"
                                />
                            </div>
                            <p className="settings-row-desc">Display window control buttons in the titlebar.</p>
                        </div>
                        <div className="settings-card">
                            <h3>Window Management</h3>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <Columns weight="duotone" size={16} />
                                    <span>Edge snap</span>
                                </span>
                                <ToggleSwitch
                                    checked={preferences.enableSnap}
                                    onChange={v => updatePreferences({ enableSnap: v })}
                                    label="Edge snap"
                                />
                            </div>
                            <p className="settings-row-desc">Snap windows to screen edges by dragging.</p>

                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <ArrowsOutSimple weight="duotone" size={16} />
                                    <span>Resize handles</span>
                                </span>
                                <ToggleSwitch
                                    checked={preferences.enableResize}
                                    onChange={v => updatePreferences({ enableResize: v })}
                                    label="Resize handles"
                                />
                            </div>
                            <p className="settings-row-desc">Allow resizing windows from their edges.</p>

                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <Moon weight="duotone" size={16} />
                                    <span>Dim other windows during focus</span>
                                </span>
                                <ToggleSwitch
                                    checked={preferences.focusDim}
                                    onChange={v => updatePreferences({ focusDim: v })}
                                    label="Dim other windows during focus"
                                />
                            </div>
                            <p className="settings-row-desc">Reduce distraction by dimming inactive windows.</p>

                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <Gauge weight="duotone" size={16} />
                                    <span>Fast boot after first visit</span>
                                </span>
                                <ToggleSwitch
                                    checked={preferences.fastBoot}
                                    onChange={v => updatePreferences({ fastBoot: v })}
                                    label="Fast boot after first visit"
                                />
                            </div>
                            <p className="settings-row-desc">Skip the boot animation on subsequent visits.</p>
                        </div>
                    </div>
                )}

                {activePanel === 'about' && (
                    <div className="settings-panel active">
                        <h2>About</h2>
                        <div className="settings-card about-system-card">
                            <div className="about-system-logo">
                                <svg width="64" height="64" viewBox="0 0 48 48" aria-hidden="true">
                                    <circle cx="24" cy="24" r="22" fill="var(--accent-bg-color)" opacity="0.15" />
                                    <text x="24" y="31" textAnchor="middle" fontSize="24" fontWeight="800" fill="var(--accent-bg-color)">F</text>
                                </svg>
                            </div>
                            <h3>Saw Ye Htet Portfolio Workstation</h3>
                            <div className="about-system-info">
                                {[
                                    ['Role', 'Java-focused Software Developer'],
                                    ['Primary Stack', 'Java, Spring Boot, SQL, React, TypeScript'],
                                    ['Interface', 'Fedora/GNOME-inspired web desktop'],
                                    ['Runtime', 'React 19 + TypeScript + Vite'],
                                    ['Hardware', 'Browser-hosted portfolio'],
                                    ['Developer', 'Saw Ye Htet'],
                                ].map(([label, value]) => (
                                    <div key={label} className="about-info-row">
                                        <span className="about-info-label">{label}</span>
                                        <span className="about-info-value">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

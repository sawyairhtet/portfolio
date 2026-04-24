import { useState, useCallback, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { useNotifications } from '../../context/NotificationContext';
import { usePreferences } from '../../context/PreferencesContext';
import { WALLPAPERS, ACCENT_COLORS } from '../../config/data';

type SettingsPanel = 'appearance' | 'sound' | 'windows' | 'about';

export function SettingsApp() {
    const { isDark, toggle, accentColor, setAccentColor } = useTheme();
    const { isMuted, toggleMute, volume, setVolume } = useSound();
    const { isDnd, setDnd } = useNotifications();
    const { preferences, updatePreferences } = usePreferences();
    const [activePanel, setActivePanel] = useState<SettingsPanel>('appearance');

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
                <button
                    className={`settings-nav-item${activePanel === 'appearance' ? ' active' : ''}`}
                    onClick={() => setActivePanel('appearance')}
                >
                    <i className="fas fa-palette" aria-hidden="true" /> Appearance
                </button>
                <button
                    className={`settings-nav-item${activePanel === 'sound' ? ' active' : ''}`}
                    onClick={() => setActivePanel('sound')}
                >
                    <i className="fas fa-volume-up" aria-hidden="true" /> Sound
                </button>
                <button
                    className={`settings-nav-item${activePanel === 'windows' ? ' active' : ''}`}
                    onClick={() => setActivePanel('windows')}
                >
                    <i className="fas fa-window-restore" aria-hidden="true" /> Windows
                </button>
                <button
                    className={`settings-nav-item${activePanel === 'about' ? ' active' : ''}`}
                    onClick={() => setActivePanel('about')}
                >
                    <i className="fas fa-info-circle" aria-hidden="true" /> About
                </button>
            </div>
            <div className="settings-content">
                {/* Appearance Panel */}
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
                                        style={{ background: wp.gradient || undefined }}
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
                                    <button
                                        key={ac.color}
                                        className={`accent-swatch${accentColor === ac.color ? ' active' : ''}`}
                                        style={{ background: ac.color }}
                                        aria-label={ac.label}
                                        title={ac.label}
                                        onClick={() => setAccentColor(ac.color)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="settings-card">
                            <h3>Style</h3>
                            <div className="settings-row">
                                <span>
                                    <i className="fas fa-moon" aria-hidden="true" /> Dark Mode
                                </span>
                                <input
                                    type="checkbox"
                                    className="toggle-switch"
                                    checked={isDark}
                                    onChange={toggle}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Sound Panel */}
                {activePanel === 'sound' && (
                    <div className="settings-panel active">
                        <h2>Sound</h2>
                        <div className="settings-card">
                            <h3>System Sounds</h3>
                            <div className="settings-row">
                                <span>
                                    <i className="fas fa-volume-up" aria-hidden="true" /> Sound
                                    Effects
                                </span>
                                <input
                                    type="checkbox"
                                    className="toggle-switch"
                                    checked={!isMuted}
                                    onChange={toggleMute}
                                />
                            </div>
                            <div className="settings-row">
                                <span>
                                    <i className="fas fa-volume-high" aria-hidden="true" /> Volume
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
                                <span>
                                    <i className="fas fa-bell-slash" aria-hidden="true" /> Do Not
                                    Disturb
                                </span>
                                <input
                                    type="checkbox"
                                    className="toggle-switch"
                                    checked={isDnd}
                                    onChange={event => setDnd(event.target.checked)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Windows Panel */}
                {activePanel === 'windows' && (
                    <div className="settings-panel active">
                        <h2>Windows</h2>
                        <div className="settings-card">
                            <h3>Titlebar</h3>
                            <div className="settings-row">
                                <span>
                                    <i className="fas fa-window-minimize" aria-hidden="true" /> Show
                                    minimize and maximize
                                </span>
                                <input
                                    type="checkbox"
                                    className="toggle-switch"
                                    checked={preferences.showWindowButtons}
                                    onChange={event =>
                                        updatePreferences({
                                            showWindowButtons: event.target.checked,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="settings-card">
                            <h3>Window Management</h3>
                            <div className="settings-row">
                                <span>
                                    <i className="fas fa-table-columns" aria-hidden="true" /> Edge
                                    snap
                                </span>
                                <input
                                    type="checkbox"
                                    className="toggle-switch"
                                    checked={preferences.enableSnap}
                                    onChange={event =>
                                        updatePreferences({ enableSnap: event.target.checked })
                                    }
                                />
                            </div>
                            <div className="settings-row">
                                <span>
                                    <i
                                        className="fas fa-up-right-and-down-left-from-center"
                                        aria-hidden="true"
                                    />{' '}
                                    Resize handles
                                </span>
                                <input
                                    type="checkbox"
                                    className="toggle-switch"
                                    checked={preferences.enableResize}
                                    onChange={event =>
                                        updatePreferences({ enableResize: event.target.checked })
                                    }
                                />
                            </div>
                            <div className="settings-row">
                                <span>
                                    <i className="fas fa-moon" aria-hidden="true" /> Dim other
                                    windows during focus
                                </span>
                                <input
                                    type="checkbox"
                                    className="toggle-switch"
                                    checked={preferences.focusDim}
                                    onChange={event =>
                                        updatePreferences({ focusDim: event.target.checked })
                                    }
                                />
                            </div>
                            <div className="settings-row">
                                <span>
                                    <i className="fas fa-gauge-high" aria-hidden="true" /> Fast boot
                                    after first visit
                                </span>
                                <input
                                    type="checkbox"
                                    className="toggle-switch"
                                    checked={preferences.fastBoot}
                                    onChange={event =>
                                        updatePreferences({ fastBoot: event.target.checked })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* About Panel */}
                {activePanel === 'about' && (
                    <div className="settings-panel active">
                        <h2>About</h2>
                        <div className="settings-card about-system-card">
                            <div className="about-system-logo">
                                <i className="fab fa-fedora" aria-hidden="true" />
                            </div>
                            <h3>Fedora Linux 43 (Workstation Edition)</h3>
                            <div className="about-system-info">
                                {[
                                    ['OS Name', 'Fedora Linux 43'],
                                    ['GNOME Version', '49'],
                                    ['Windowing System', 'Wayland'],
                                    ['Kernel', '6.11.4-301.fc43.x86_64'],
                                    ['Hardware', 'Portfolio Virtual Machine'],
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

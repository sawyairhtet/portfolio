import { useState, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { WALLPAPERS, ACCENT_COLORS } from '../../config/data';

type SettingsPanel = 'appearance' | 'sound' | 'about';

export function SettingsApp() {
    const { isDark, toggle, accentColor, setAccentColor } = useTheme();
    const { isMuted, toggleMute } = useSound();
    const [activePanel, setActivePanel] = useState<SettingsPanel>('appearance');
    const [selectedWallpaper, setSelectedWallpaper] = useState(() => {
        return localStorage.getItem('portfolioWallpaper') || 'default';
    });

    const handleWallpaperChange = useCallback((id: string) => {
        setSelectedWallpaper(id);
        localStorage.setItem('portfolioWallpaper', id);
        // Trigger a storage event for Wallpaper component
        window.dispatchEvent(new Event('storage'));
    }, []);

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
                            <h3>Style</h3>
                            <div className="settings-row">
                                <span><i className="fas fa-moon" aria-hidden="true" /> Dark Mode</span>
                                <input
                                    type="checkbox"
                                    className="toggle-switch"
                                    checked={isDark}
                                    onChange={toggle}
                                />
                            </div>
                        </div>
                        <div className="settings-card">
                            <h3>Accent Color</h3>
                            <div className="accent-color-options">
                                {ACCENT_COLORS.map((ac) => (
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
                            <h3>Background</h3>
                            <div className="wallpaper-grid">
                                {WALLPAPERS.map((wp) => (
                                    <button
                                        key={wp.id}
                                        className={`wallpaper-option${selectedWallpaper === wp.id ? ' active' : ''}`}
                                        style={{ background: wp.gradient || undefined }}
                                        aria-label={wp.label}
                                        title={wp.label}
                                        onClick={() => handleWallpaperChange(wp.id)}
                                    />
                                ))}
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
                                <span><i className="fas fa-volume-up" aria-hidden="true" /> Sound Effects</span>
                                <input
                                    type="checkbox"
                                    className="toggle-switch"
                                    checked={!isMuted}
                                    onChange={toggleMute}
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
                            <div className="about-system-logo"><i className="fab fa-fedora" aria-hidden="true" /></div>
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

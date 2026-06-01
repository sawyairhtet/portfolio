import { memo, useState, useCallback, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { useNotifications } from '../../context/NotificationContext';
import { usePreferences } from '../../context/PreferencesContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { WALLPAPERS, ACCENT_COLORS } from '../../config/data';
import { PROFILE } from '../../config/profile';
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
    Monitor,
    Globe,
    Clock,
    Keyboard,
    PersonArmsSpread,
} from '@phosphor-icons/react';

type SettingsPanel = 'appearance' | 'sound' | 'windows' | 'display' | 'network' | 'keyboard' | 'accessibility' | 'about';

const NAV_ITEMS: { id: SettingsPanel; label: string; icon: React.ReactNode }[] = [
    { id: 'appearance', label: 'Appearance', icon: <Palette weight="duotone" size={16} /> },
    { id: 'sound', label: 'Sound', icon: <SpeakerHigh weight="duotone" size={16} /> },
    { id: 'windows', label: 'Windows', icon: <AppWindow weight="duotone" size={16} /> },
    { id: 'display', label: 'Displays', icon: <Monitor weight="duotone" size={16} /> },
    { id: 'network', label: 'Network', icon: <Globe weight="duotone" size={16} /> },
    { id: 'keyboard', label: 'Keyboard', icon: <Keyboard weight="duotone" size={16} /> },
    { id: 'accessibility', label: 'Accessibility', icon: <PersonArmsSpread weight="duotone" size={16} /> },
    { id: 'about', label: 'About', icon: <Info weight="duotone" size={16} /> },
];

function ToggleSwitch({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
}) {
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

export const SettingsApp = memo(function SettingsApp() {
    const { isDark, toggle, accentColor, setAccentColor } = useTheme();
    const { isMuted, toggleMute, volume, setVolume } = useSound();
    const { isDnd, setDnd } = useNotifications();
    const { preferences, updatePreferences } = usePreferences();
    const { activeWorkspace, setActiveWorkspace } = useWindowManager();
    const [activePanel, setActivePanel] = useState<SettingsPanel>('appearance');
    const reduced = useReducedMotion();

    const [desktopScale, setDesktopScale] = useState(100);
    const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [pingLogs, setPingLogs] = useState<string[]>([]);

    const testPingConnection = () => {
        setPingStatus('testing');
        setPingLogs(['PING sawyehtet.com (192.168.1.42) 56(84) bytes of data.']);
        let counter = 0;
        const interval = setInterval(() => {
            counter++;
            const time = (Math.random() * 8 + 3).toFixed(1);
            setPingLogs(prev => [
                ...prev,
                `64 bytes from 192.168.1.42: icmp_seq=${counter} ttl=64 time=${time} ms`,
            ]);
            if (counter >= 3) {
                clearInterval(interval);
                setPingLogs(prev => [
                    ...prev,
                    '--- sawyehtet.com ping statistics ---',
                    '3 packets transmitted, 3 received, 0% packet loss, time 2004ms',
                    'rtt min/avg/max = 3.2/5.4/8.1 ms',
                ]);
                setPingStatus('success');
            }
        }, 500);
    };

    useEffect(() => {
        const handleSettingsPanelRequest = (event: Event) => {
            const panel = (event as CustomEvent<SettingsPanel>).detail;
            if (['appearance', 'sound', 'windows', 'display', 'network', 'keyboard', 'accessibility', 'about'].includes(panel)) {
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
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                        className="settings-fedora-logo"
                    >
                        <circle
                            cx="24"
                            cy="24"
                            r="22"
                            fill="var(--accent-bg-color)"
                            opacity="0.2"
                        />
                        <text
                            x="24"
                            y="30"
                            textAnchor="middle"
                            fontSize="22"
                            fontWeight="800"
                            fill="var(--accent-bg-color)"
                        >
                            F
                        </text>
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
                            <h3>Time of Day</h3>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <Clock weight="duotone" size={16} />
                                    <span>Automatic wallpaper</span>
                                </span>
                                <ToggleSwitch
                                    checked={preferences.wallpaperTimeOfDay}
                                    onChange={v => updatePreferences({ wallpaperTimeOfDay: v })}
                                    label="Use time-of-day wallpaper"
                                />
                            </div>
                            <p className="settings-row-desc">
                                Crossfade between day and night wallpapers based on your local
                                clock.
                            </p>
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
                                <ToggleSwitch
                                    checked={isDark}
                                    onChange={toggle}
                                    label="Dark mode"
                                />
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
                                <ToggleSwitch
                                    checked={!isMuted}
                                    onChange={toggleMute}
                                    label="Sound effects"
                                />
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
                                <ToggleSwitch
                                    checked={isDnd}
                                    onChange={v => setDnd(v)}
                                    label="Do Not Disturb"
                                />
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
                            <p className="settings-row-desc">
                                Display window control buttons in the titlebar.
                            </p>
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
                            <p className="settings-row-desc">
                                Snap windows to screen edges by dragging.
                            </p>

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
                            <p className="settings-row-desc">
                                Allow resizing windows from their edges.
                            </p>

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
                            <p className="settings-row-desc">
                                Reduce distraction by dimming inactive windows.
                            </p>

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
                            <p className="settings-row-desc">
                                Skip the boot animation on subsequent visits.
                            </p>
                        </div>
                    </div>
                )}

                {activePanel === 'display' && (
                    <div className="settings-panel active">
                        <h2>Displays</h2>
                        <div className="settings-card">
                            <h3>Scale</h3>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <Monitor weight="duotone" size={16} />
                                    <span>Scale Options</span>
                                </span>
                                <div className="linked">
                                    {[100, 125, 150].map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            className={`headerbar-btn${desktopScale === s ? ' active' : ''}`}
                                            onClick={() => {
                                                setDesktopScale(s);
                                                document.documentElement.style.setProperty(
                                                    '--desktop-scale',
                                                    `${s / 100}`
                                                );
                                            }}
                                            style={{
                                                background:
                                                    desktopScale === s
                                                        ? 'var(--active-toggle-bg-color)'
                                                        : 'transparent',
                                                color:
                                                    desktopScale === s
                                                        ? 'var(--active-toggle-fg-color)'
                                                        : 'inherit',
                                                fontWeight: 'bold',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                            }}
                                        >
                                            {s}%
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="settings-row-desc">
                                Adjust the scale of interface fonts and window elements.
                            </p>
                        </div>
                        <div className="settings-card">
                            <h3>Workspaces</h3>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <Columns weight="duotone" size={16} />
                                    <span>Current Active Workspace</span>
                                </span>
                                <div className="linked">
                                    {[0, 1, 2].map(idx => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={`headerbar-btn${activeWorkspace === idx ? ' active' : ''}`}
                                            onClick={() => setActiveWorkspace(idx)}
                                            style={{
                                                background:
                                                    activeWorkspace === idx
                                                        ? 'var(--active-toggle-bg-color)'
                                                        : 'transparent',
                                                color:
                                                    activeWorkspace === idx
                                                        ? 'var(--active-toggle-fg-color)'
                                                        : 'inherit',
                                                fontWeight: 'bold',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                            }}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="settings-row-desc">
                                Quickly toggle between desktop virtual workspaces.
                            </p>
                        </div>
                    </div>
                )}

                {activePanel === 'network' && (
                    <div className="settings-panel active">
                        <h2>Network</h2>
                        <div className="settings-card">
                            <h3>Connection Status</h3>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <Globe weight="duotone" size={16} />
                                    <span>Wi-Fi Connection</span>
                                </span>
                                <span
                                    style={{ fontWeight: 'bold', color: 'var(--success-bg-color)' }}
                                >
                                    Connected
                                </span>
                            </div>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <span>Hardware Speed</span>
                                </span>
                                <span>1000 Mbps (Simulated Gigabit Ethernet)</span>
                            </div>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <span>IPv4 Address</span>
                                </span>
                                <span>192.168.1.42</span>
                            </div>
                        </div>

                        <div className="settings-card">
                            <h3>Diagnostics</h3>
                            <div
                                className="settings-row"
                                style={{ minHeight: 'auto', marginBottom: '8px' }}
                            >
                                <span className="settings-row-label">
                                    <span>Network Ping Test</span>
                                </span>
                                <button
                                    type="button"
                                    onClick={testPingConnection}
                                    disabled={pingStatus === 'testing'}
                                    className="about-cta-v2 active"
                                    style={{
                                        background: 'var(--accent-bg-color)',
                                        color: 'var(--accent-fg-color)',
                                        border: 'none',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {pingStatus === 'testing' ? 'Testing...' : 'Run Ping Test'}
                                </button>
                            </div>
                            {pingLogs.length > 0 && (
                                <pre
                                    style={{
                                        background: 'var(--surface-1)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '12px',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '11px',
                                        lineHeight: '1.4',
                                        overflowX: 'auto',
                                        color: 'var(--text-primary)',
                                        margin: '8px 0 0 0',
                                    }}
                                >
                                    {pingLogs.join('\n')}
                                </pre>
                            )}
                        </div>
                    </div>
                )}

                {activePanel === 'keyboard' && (
                    <div className="settings-panel active">
                        <h2>Keyboard</h2>
                        <div className="settings-card">
                            <h3>Keyboard Shortcuts</h3>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {([
                                    ['Super', 'Toggle Activities Overview'],
                                    ['Alt+Tab', 'Switch between windows'],
                                    ['Super+Left/Right', 'Tile window to side'],
                                    ['Super+Up', 'Maximize window'],
                                    ['Super+Down', 'Restore window'],
                                    ['Super+PageUp/Down', 'Switch workspace'],
                                    ['Super+1…9', 'Open dock app'],
                                    ['Ctrl+Alt+←/→', 'Switch workspace'],
                                    ['Esc', 'Close top window or overlay'],
                                    ['/', 'Open Settings'],
                                    ['?', 'Show all shortcuts'],
                                ] as const).map(([keys, desc]) => (
                                    <div key={keys} className="settings-row">
                                        <kbd style={{
                                            padding: '3px 8px',
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'var(--surface-3)',
                                            border: '1px solid var(--border-color)',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: 'var(--font-size-xs)',
                                            fontWeight: 700,
                                        }}>{keys}</kbd>
                                        <span>{desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activePanel === 'accessibility' && (
                    <div className="settings-panel active">
                        <h2>Accessibility</h2>
                        <div className="settings-card">
                            <h3>Motion</h3>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <span>Reduce Motion</span>
                                </span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                                    {window.matchMedia('(prefers-reduced-motion: reduce)').matches
                                        ? 'Enabled (system preference)'
                                        : 'Disabled (system preference)'}
                                </span>
                            </div>
                            <p className="settings-row-desc">
                                This site respects your system reduced-motion setting. Animations
                                are disabled when your OS requests it.
                            </p>
                        </div>
                        <div className="settings-card">
                            <h3>Contrast</h3>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <span>High Contrast</span>
                                </span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                                    {window.matchMedia('(prefers-contrast: more)').matches
                                        ? 'Enabled (system preference)'
                                        : 'Disabled (system preference)'}
                                </span>
                            </div>
                        </div>
                        <div className="settings-card">
                            <h3>Color Scheme</h3>
                            <div className="settings-row">
                                <span className="settings-row-label">
                                    <span>Dark Mode Preference</span>
                                </span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                                    {window.matchMedia('(prefers-color-scheme: dark)').matches
                                        ? 'Dark'
                                        : 'Light'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {activePanel === 'about' && (
                    <div className="settings-panel active">
                        <h2>About</h2>
                        <div className="settings-card about-system-card">
                            <div className="about-system-logo">
                                <svg width="64" height="64" viewBox="0 0 48 48" aria-hidden="true">
                                    <circle
                                        cx="24"
                                        cy="24"
                                        r="22"
                                        fill="var(--accent-bg-color)"
                                        opacity="0.15"
                                    />
                                    <text
                                        x="24"
                                        y="31"
                                        textAnchor="middle"
                                        fontSize="24"
                                        fontWeight="800"
                                        fill="var(--accent-bg-color)"
                                    >
                                        F
                                    </text>
                                </svg>
                            </div>
                            <h3>Saw Ye Htet Portfolio Workstation</h3>
                            <div className="about-system-info">
                                {[
                                    ['Role', PROFILE.role],
                                    ['Target', PROFILE.roleTarget],
                                    ['Primary Stack', PROFILE.primaryStack.join(', ')],
                                    ['Interface', 'Fedora/GNOME-inspired web desktop'],
                                    ['Runtime', 'React 19 + TypeScript + Vite'],
                                    ['Hardware', 'Browser-hosted portfolio'],
                                    ['Developer', PROFILE.name],
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
});

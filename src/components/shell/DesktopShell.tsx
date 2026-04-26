import { useState, useCallback, useEffect } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useSound } from '../../context/SoundContext';
import { usePreferences } from '../../context/PreferencesContext';
import { useDevice } from '../../context/DeviceContext';
import { TopBar } from './TopBar';
import { Dock } from './Dock';
import { Wallpaper } from './Wallpaper';
import { BootScreen } from './BootScreen';
import { Window } from '../window/Window';
import { AboutApp } from '../apps/AboutApp';
import { SkillsApp } from '../apps/SkillsApp';
import { ProjectsApp } from '../apps/ProjectsApp';
import { ContactApp } from '../apps/ContactApp';
import { LinksApp } from '../apps/LinksApp';
import { TerminalApp } from '../apps/TerminalApp';
import { SettingsApp } from '../apps/SettingsApp';
import { FocusModeApp } from '../apps/FocusModeApp';
import { ActivitiesOverlay } from '../ui/ActivitiesOverlay';
import { QuickSettingsPanel } from '../ui/QuickSettingsPanel';
import { NotificationCenter } from '../ui/NotificationCenter';
import { ToastContainer } from '../ui/ToastContainer';
import { ContextMenu } from '../ui/ContextMenu';
import { PROFILE } from '../../config/profile';

export function DesktopShell() {
    const { openWindow, windows } = useWindowManager();
    const { playStartupDrum } = useSound();
    const { preferences } = usePreferences();
    const { device } = useDevice();

    const [booted, setBooted] = useState(false);
    const [activitiesOpen, setActivitiesOpen] = useState(false);
    const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
    const [notifCenterOpen, setNotifCenterOpen] = useState(false);
    const hasVisibleWindows = Array.from(windows.values()).some(
        win => win.isOpen && !win.isMinimized
    );

    // Track load time for uptime command
    useEffect(() => {
        (window as unknown as Record<string, unknown>).__portfolioLoadTime = Date.now();
    }, []);

    // Register service worker
    useEffect(() => {
        if (!('serviceWorker' in navigator)) {
            return;
        }

        if (import.meta.env.DEV) {
            navigator.serviceWorker
                .getRegistrations()
                .then(registrations => {
                    registrations.forEach(registration => {
                        registration.unregister().catch(() => {});
                    });
                })
                .catch(() => {});
            return;
        }

        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }, []);

    // Show dock once shell is active
    useEffect(() => {
        document.body.classList.add('show-dock');
        return () => document.body.classList.remove('show-dock');
    }, []);

    const handleBootComplete = useCallback(() => {
        const isFirstVisit = !localStorage.getItem('hasVisitedBefore');
        setBooted(true);
        localStorage.setItem('hasVisitedBefore', 'true');

        // Auto-open About window on first visit so visitors immediately know who this is
        if (isFirstVisit) {
            setTimeout(() => openWindow('about'), 600);
        }

        // Startup sound on first interaction
        const playOnce = () => {
            playStartupDrum();
            document.removeEventListener('click', playOnce);
            document.removeEventListener('keydown', playOnce);
        };
        document.addEventListener('click', playOnce, { once: true });
        document.addEventListener('keydown', playOnce, { once: true });
    }, [playStartupDrum, openWindow]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Super key → Activities
            if (e.key === 'Super' || (e.key === 'Meta' && !e.ctrlKey && !e.altKey && !e.shiftKey)) {
                e.preventDefault();
                setActivitiesOpen(prev => !prev);
            }

            // Escape → close overlays
            if (e.key === 'Escape') {
                setActivitiesOpen(false);
                setQuickSettingsOpen(false);
                setNotifCenterOpen(false);
            }

            // Alt+1/2/3 for quick access
            if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                if (e.key === '1') {
                    e.preventDefault();
                    openWindow('projects');
                }
                if (e.key === '2') {
                    e.preventDefault();
                    openWindow('contact');
                }
                if (e.key === '3') {
                    e.preventDefault();
                    window.open(PROFILE.resumePath, '_blank', 'noopener,noreferrer');
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [openWindow]);

    return (
        <>
            {/* Skip Link */}
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>

            {/* Boot Screen */}
            {!booted && <BootScreen onBootComplete={handleBootComplete} />}

            {/* Top Bar */}
            <TopBar
                onActivitiesToggle={() => setActivitiesOpen(p => !p)}
                onQuickSettingsToggle={() => {
                    setQuickSettingsOpen(p => !p);
                    setNotifCenterOpen(false);
                }}
                onClockClick={() => {
                    setNotifCenterOpen(p => !p);
                    setQuickSettingsOpen(false);
                }}
                isActivitiesOpen={activitiesOpen}
                isQuickSettingsOpen={quickSettingsOpen}
                isNotificationCenterOpen={notifCenterOpen}
            />

            {/* Quick Settings Panel */}
            <QuickSettingsPanel
                isOpen={quickSettingsOpen}
                onClose={() => setQuickSettingsOpen(false)}
            />

            {/* Notification Center */}
            <NotificationCenter
                isOpen={notifCenterOpen}
                onClose={() => setNotifCenterOpen(false)}
            />

            {/* Main Content */}
            <main id="main-content" className="main-content" role="main">
                <h1 className="sr-only">
                    Saw Ye Htet — Java Software Engineer | Fedora 43 Desktop Portfolio
                </h1>
                <Wallpaper />
                {booted && !hasVisibleWindows && !activitiesOpen && (
                    <section className="desktop-welcome" aria-label="Portfolio welcome">
                        <span className="desktop-welcome-kicker">sawyehtet.com · Fedora 43</span>
                        <h2>{PROFILE.name}</h2>
                        <p>Java Software Engineer</p>
                        <p className="desktop-welcome-stack">Java · Spring Boot · SQL · React · TypeScript</p>
                        <button
                            className="desktop-welcome-hint"
                            onClick={() => openWindow('about')}
                            aria-label="Open About window"
                        >
                            {device === 'desktop'
                                ? 'Interactive Fedora desktop — click apps in the dock to explore ↓'
                                : 'Interactive Fedora desktop — tap apps in the dock below ↓'}
                        </button>
                        <div className="desktop-welcome-shortcuts">
                            <span className="shortcut-pill">
                                <kbd>Alt+1</kbd> Projects
                            </span>
                            <span className="shortcut-pill">
                                <kbd>Alt+2</kbd> Contact
                            </span>
                            <span className="shortcut-pill">
                                <kbd>Alt+3</kbd> Resume
                            </span>
                        </div>
                    </section>
                )}
            </main>

            <div
                className="desktop-dim-effect"
                aria-hidden="true"
                style={{
                    opacity: Math.max(0, Math.min(0.55, (100 - preferences.brightness) / 140)),
                }}
            />

            {/* Activities Overlay */}
            <ActivitiesOverlay isOpen={activitiesOpen} onClose={() => setActivitiesOpen(false)} />

            {/* Windows */}
            <Window appId="about" title="About">
                <AboutApp />
            </Window>
            <Window appId="skills" title="Skills">
                <SkillsApp />
            </Window>
            <Window appId="projects" title="Projects">
                <ProjectsApp />
            </Window>
            <Window appId="contact" title="Contact">
                <ContactApp />
            </Window>
            <Window appId="links" title="Links">
                <LinksApp />
            </Window>
            <Window appId="terminal" title="Terminal">
                <TerminalApp />
            </Window>
            <Window appId="settings" title="Settings">
                <SettingsApp />
            </Window>
            <Window appId="focus-mode" title="Focus Mode">
                <FocusModeApp />
            </Window>

            {/* Dock */}
            <Dock />

            {/* Context Menu */}
            <ContextMenu />

            {/* Toast Notifications */}
            <ToastContainer />
        </>
    );
}

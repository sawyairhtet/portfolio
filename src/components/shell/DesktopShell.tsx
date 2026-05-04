import { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useSound } from '../../context/SoundContext';
import { usePreferences } from '../../context/PreferencesContext';
import { useDevice } from '../../context/DeviceContext';
import { TopBar } from './TopBar';
import { Dock } from './Dock';
import { Wallpaper } from './Wallpaper';
import { BootScreen } from './BootScreen';
import { Window } from '../window/Window';
import { ActivitiesOverlay } from '../ui/ActivitiesOverlay';
import { QuickSettingsPanel } from '../ui/QuickSettingsPanel';
import { NotificationCenter } from '../ui/NotificationCenter';
import { ToastContainer } from '../ui/ToastContainer';
import { ContextMenu } from '../ui/ContextMenu';
import { PROFILE } from '../../config/profile';
import type { AppId } from '../../types';

const AboutApp = lazy(() =>
    import('../apps/AboutApp').then(module => ({ default: module.AboutApp }))
);
const SkillsApp = lazy(() =>
    import('../apps/SkillsApp').then(module => ({ default: module.SkillsApp }))
);
const ProjectsApp = lazy(() =>
    import('../apps/ProjectsApp').then(module => ({ default: module.ProjectsApp }))
);
const ContactApp = lazy(() =>
    import('../apps/ContactApp').then(module => ({ default: module.ContactApp }))
);
const LinksApp = lazy(() =>
    import('../apps/LinksApp').then(module => ({ default: module.LinksApp }))
);
const TerminalApp = lazy(() =>
    import('../apps/TerminalApp').then(module => ({ default: module.TerminalApp }))
);
const SettingsApp = lazy(() =>
    import('../apps/SettingsApp').then(module => ({ default: module.SettingsApp }))
);
const FocusModeApp = lazy(() =>
    import('../apps/FocusModeApp').then(module => ({ default: module.FocusModeApp }))
);

type WelcomeAction =
    | { label: string; appId: AppId; icon: string; primary?: boolean }
    | { label: string; href: string; icon: string; download?: boolean };

const WELCOME_ACTIONS: WelcomeAction[] = [
    { label: 'About', appId: 'about', icon: 'fas fa-user-circle', primary: true },
    { label: 'Projects', appId: 'projects', icon: 'fas fa-folder-open' },
    { label: 'Resume', href: PROFILE.resumePath, icon: 'fas fa-file-arrow-down', download: true },
    { label: 'Contact', appId: 'contact', icon: 'fas fa-envelope' },
];

function WindowFallback() {
    return (
        <div className="window-loading" role="status" aria-live="polite">
            <i className="fas fa-spinner fa-spin" aria-hidden="true" />
            <span>Loading</span>
        </div>
    );
}

export function DesktopShell() {
    const { openWindow, windows } = useWindowManager();
    const { playStartupDrum } = useSound();
    const { preferences } = usePreferences();
    const { device } = useDevice();

    const [booted, setBooted] = useState(false);
    const [activitiesOpen, setActivitiesOpen] = useState(false);
    const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
    const [notifCenterOpen, setNotifCenterOpen] = useState(false);
    const [showDockTip, setShowDockTip] = useState(false);
    const hasVisibleWindows = Array.from(windows.values()).some(
        win => win.isOpen && !win.isMinimized
    );

    // Track load time for uptime command
    useEffect(() => {
        window.__portfolioLoadTime = Date.now();
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

    // Show dock once shell is active (mobile only — desktop dock is always visible)
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
            setTimeout(() => setShowDockTip(true), 1800);
            setTimeout(() => setShowDockTip(false), 8000);
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
            <main id="main-content" className="main-content">
                <h1 className="sr-only">
                    Saw Ye Htet — Java Software Engineer | Fedora 43 Desktop Portfolio
                </h1>
                <Wallpaper />
                {booted && !hasVisibleWindows && !activitiesOpen && (
                    <section className="desktop-welcome" aria-label="Portfolio welcome">
                        <span className="desktop-welcome-kicker">sawyehtet.com · Fedora 43</span>
                        <h2>{PROFILE.name}</h2>
                        <p>Java Software Engineer</p>
                        <p className="desktop-welcome-stack">
                            Java · Spring Boot · SQL · React · TypeScript
                        </p>
                        <button
                            className="desktop-welcome-hint"
                            onClick={() => openWindow('about')}
                            aria-label="Open About window"
                        >
                            {device === 'desktop'
                                ? 'Interactive Fedora desktop — click apps in the dock to explore ↓'
                                : 'Interactive Fedora desktop — tap apps in the dock below ↓'}
                        </button>
                        <div className="desktop-welcome-actions" aria-label="Quick portfolio apps">
                            {WELCOME_ACTIONS.map(action =>
                                'appId' in action ? (
                                    <button
                                        key={action.appId}
                                        type="button"
                                        className={`desktop-welcome-action${action.primary ? ' primary' : ''}`}
                                        onClick={() => openWindow(action.appId)}
                                    >
                                        <i className={action.icon} aria-hidden="true" />
                                        <span>{action.label}</span>
                                    </button>
                                ) : (
                                    <a
                                        key={action.href}
                                        className="desktop-welcome-action"
                                        href={action.href}
                                        download={action.download}
                                    >
                                        <i className={action.icon} aria-hidden="true" />
                                        <span>{action.label}</span>
                                    </a>
                                )
                            )}
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
                <Suspense fallback={<WindowFallback />}>
                    <AboutApp />
                </Suspense>
            </Window>
            <Window appId="skills" title="Skills">
                <Suspense fallback={<WindowFallback />}>
                    <SkillsApp />
                </Suspense>
            </Window>
            <Window appId="projects" title="Projects">
                <Suspense fallback={<WindowFallback />}>
                    <ProjectsApp />
                </Suspense>
            </Window>
            <Window appId="contact" title="Contact">
                <Suspense fallback={<WindowFallback />}>
                    <ContactApp />
                </Suspense>
            </Window>
            <Window appId="links" title="Links">
                <Suspense fallback={<WindowFallback />}>
                    <LinksApp />
                </Suspense>
            </Window>
            <Window appId="terminal" title="Terminal">
                <Suspense fallback={<WindowFallback />}>
                    <TerminalApp />
                </Suspense>
            </Window>
            <Window appId="settings" title="Settings">
                <Suspense fallback={<WindowFallback />}>
                    <SettingsApp />
                </Suspense>
            </Window>
            <Window appId="focus-mode" title="Focus Mode">
                <Suspense fallback={<WindowFallback />}>
                    <FocusModeApp />
                </Suspense>
            </Window>

            {/* Dock — always visible on desktop, mobile: always visible */}
            <Dock />

            {/* Dock onboarding tooltip for first-time visitors */}
            {showDockTip && !hasVisibleWindows && (
                <div className="dock-onboarding-tip" aria-live="polite">
                    <span>Try clicking the dock icons to explore</span>
                    <button
                        type="button"
                        className="dock-tip-dismiss"
                        aria-label="Dismiss tip"
                        onClick={() => setShowDockTip(false)}
                    >
                        <i className="fas fa-times" aria-hidden="true" />
                    </button>
                </div>
            )}

            {/* Context Menu */}
            <ContextMenu />

            {/* Toast Notifications */}
            <ToastContainer />
        </>
    );
}

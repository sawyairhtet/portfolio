import { lazy, Suspense, useState, useCallback, useEffect, useRef } from 'react';
import { Icon } from '../ui/Icon';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useSound } from '../../context/SoundContext';
import { usePreferences } from '../../context/PreferencesContext';
import { useDevice } from '../../context/DeviceContext';
import { useNotifications } from '../../context/NotificationContext';
import { TopBar } from './TopBar';
import { Dock } from './Dock';
import { Wallpaper } from './Wallpaper';
import { BootScreen } from './BootScreen';
import { Window } from '../window/Window';
import { ErrorBoundary } from '../ErrorBoundary';
import { ActivitiesOverlay } from '../ui/ActivitiesOverlay';
import { QuickSettingsPanel } from '../ui/QuickSettingsPanel';
import { NotificationCenter } from '../ui/NotificationCenter';
import { ToastContainer } from '../ui/ToastContainer';
import { ContextMenu } from '../ui/ContextMenu';
import { DOCK_APPS } from '../../config/data';
import { PROFILE } from '../../config/profile';
import type { AppId } from '../../types';

const AboutApp = lazy(() =>
    import('../apps/AboutApp').then(module => ({ default: module.AboutApp }))
);
const BrowserApp = lazy(() =>
    import('../apps/BrowserApp').then(module => ({ default: module.BrowserApp }))
);
const FilesApp = lazy(() =>
    import('../apps/FilesApp').then(module => ({ default: module.FilesApp }))
);
const ResumeApp = lazy(() =>
    import('../apps/ResumeApp').then(module => ({ default: module.ResumeApp }))
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
const TerminalApp = lazy(() =>
    import('../apps/TerminalApp').then(module => ({ default: module.TerminalApp }))
);
const TextEditorApp = lazy(() =>
    import('../apps/TextEditorApp').then(module => ({ default: module.TextEditorApp }))
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
    { label: 'About', appId: 'about', icon: 'user-circle', primary: true },
    { label: 'Projects', appId: 'projects', icon: 'folder-open' },
    { label: 'Resume', href: PROFILE.resumePath, icon: 'file-arrow-down', download: true },
    { label: 'Contact', appId: 'contact', icon: 'envelope' },
];

function AdwaitaSkeleton() {
    return (
        <div className="adw-page" role="status" aria-live="polite" aria-label="Loading">
            <header className="adw-status-header">
                <div className="adw-status-row">
                    <div className="window-skeleton-icon" aria-hidden="true" />
                    <div className="adw-status-text">
                        <span
                            className="window-skeleton-bar window-skeleton-bar-lg"
                            aria-hidden="true"
                        />
                        <span
                            className="window-skeleton-bar window-skeleton-bar-md"
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </header>
            <section className="adw-section">
                <div className="adw-boxed-list">
                    {[0, 1, 2].map(i => (
                        <div className="adw-row" key={i}>
                            <div className="window-skeleton-icon" aria-hidden="true" />
                            <div className="adw-row-text">
                                <span
                                    className="window-skeleton-bar window-skeleton-bar-md"
                                    aria-hidden="true"
                                />
                                <span
                                    className="window-skeleton-bar window-skeleton-bar-sm"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <span className="sr-only">Loading…</span>
        </div>
    );
}

function TerminalSkeleton() {
    return (
        <div
            className="terminal-skeleton"
            role="status"
            aria-live="polite"
            aria-label="Loading terminal"
        >
            <div className="terminal-skeleton-line" aria-hidden="true" />
            <div className="terminal-skeleton-line" aria-hidden="true" />
            <div className="terminal-skeleton-line" aria-hidden="true" />
            <div className="terminal-skeleton-line" aria-hidden="true" />
            <span className="sr-only">Loading terminal…</span>
        </div>
    );
}

const SHORTCUTS_DATA = [
    ['Super', 'Activities Overview'],
    ['Alt+Tab', 'Switch Windows'],
    ['Ctrl+Alt+←/→', 'Switch Workspace'],
    ['Super+1…9', 'Open Dock App'],
    ['Esc', 'Close Top Window'],
    ['/', 'Open Settings'],
    ['?', 'Show Shortcuts'],
] as const;

function ShortcutsDialog({ onClose }: { onClose: () => void }) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    // Auto-focus close button on mount
    useEffect(() => {
        closeBtnRef.current?.focus();
    }, []);

    // Focus trap
    useEffect(() => {
        const handleTabTrap = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            const dialog = dialogRef.current;
            if (!dialog) return;

            const focusable = Array.from(
                dialog.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
    }, []);

    return (
        <div
            ref={dialogRef}
            className="shortcuts-cheatsheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
        >
            <header>
                <h2 id="shortcuts-title">Keyboard Shortcuts</h2>
                <button ref={closeBtnRef} type="button" aria-label="Close" onClick={onClose}>
                    <Icon name="times" />
                </button>
            </header>
            <div>
                {SHORTCUTS_DATA.map(([keys, label]) => (
                    <p key={keys}>
                        <kbd>{keys}</kbd>
                        <span>{label}</span>
                    </p>
                ))}
            </div>
        </div>
    );
}

export function DesktopShell() {
    const { openWindow, closeWindow, bringToFront, windows } = useWindowManager();
    const { playStartupDrum } = useSound();
    const { preferences } = usePreferences();
    const { device } = useDevice();
    const { showToast } = useNotifications();

    const [booted, setBooted] = useState(false);
    const [activitiesOpen, setActivitiesOpen] = useState(false);
    const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
    const [notifCenterOpen, setNotifCenterOpen] = useState(false);
    const [showDockTip, setShowDockTip] = useState(false);
    const [altTabOpen, setAltTabOpen] = useState(false);
    const [altTabIndex, setAltTabIndex] = useState(0);
    const [shortcutsOpen, setShortcutsOpen] = useState(false);
    const [workspaceIndex, setWorkspaceIndex] = useState(0);
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

    // Toggle body class for activities overview
    useEffect(() => {
        if (activitiesOpen) {
            document.body.classList.add('activities-open');
        } else {
            document.body.classList.remove('activities-open');
        }
        return () => {
            document.body.classList.remove('activities-open');
        };
    }, [activitiesOpen]);

    const handleBootComplete = useCallback(() => {
        const isFirstVisit = !localStorage.getItem('hasVisitedBefore');
        setBooted(true);
        localStorage.setItem('hasVisitedBefore', 'true');

        // Auto-open About window on first visit so visitors immediately know who this is
        if (isFirstVisit) {
            setTimeout(() => openWindow('about'), 600);
            setTimeout(
                () =>
                    showToast('Welcome to Saw Ye Htet', 'desktop', {
                        label: 'View Resume',
                        appId: 'text-editor',
                    }),
                1000
            );
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
    }, [playStartupDrum, openWindow, showToast]);

    // Keyboard shortcuts
    useEffect(() => {
        const isTypingTarget = (target: EventTarget | null) => {
            const element = target as HTMLElement | null;
            return Boolean(
                element?.closest('input, textarea, select, [contenteditable="true"], .xterm')
            );
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const openWindowIds = Array.from(windows.entries())
                .filter(([, win]) => win.isOpen)
                .sort(([, a], [, b]) => b.zIndex - a.zIndex)
                .map(([id]) => id);

            // Super key → Activities
            if (e.key === 'Super' || (e.key === 'Meta' && !e.ctrlKey && !e.altKey && !e.shiftKey)) {
                e.preventDefault();
                setActivitiesOpen(prev => !prev);
            }

            if (e.metaKey && /^[1-9]$/.test(e.key)) {
                e.preventDefault();
                const app = DOCK_APPS[Number(e.key) - 1];
                if (app) {
                    const win = windows.get(app.id);
                    if (win?.isOpen) bringToFront(app.id);
                    else openWindow(app.id);
                }
            }

            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
                if (openWindowIds.length > 0) {
                    const nextIndex = (altTabIndex + 1) % openWindowIds.length;
                    setAltTabIndex(nextIndex);
                    setAltTabOpen(true);
                    const nextWindowId = openWindowIds.at(nextIndex);
                    if (nextWindowId) bringToFront(nextWindowId);
                    window.setTimeout(() => setAltTabOpen(false), 900);
                }
            }

            if (e.ctrlKey && e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
                e.preventDefault();
                setWorkspaceIndex(current =>
                    e.key === 'ArrowRight' ? Math.min(2, current + 1) : Math.max(0, current - 1)
                );
            }

            // Escape → close overlays
            if (e.key === 'Escape') {
                if (shortcutsOpen || activitiesOpen || quickSettingsOpen || notifCenterOpen) {
                    setShortcutsOpen(false);
                    setActivitiesOpen(false);
                    setQuickSettingsOpen(false);
                    setNotifCenterOpen(false);
                    e.stopPropagation();
                    return;
                }

                const topWindow = openWindowIds[0];
                if (topWindow) {
                    closeWindow(topWindow);
                    e.stopPropagation();
                    return;
                }
            }

            if (!isTypingTarget(e.target) && e.key === '/' && !e.shiftKey) {
                e.preventDefault();
                openWindow('settings');
            }

            if (!isTypingTarget(e.target) && (e.key === '?' || (e.key === '/' && e.shiftKey))) {
                e.preventDefault();
                setShortcutsOpen(true);
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
    }, [
        activitiesOpen,
        altTabIndex,
        bringToFront,
        closeWindow,
        notifCenterOpen,
        openWindow,
        quickSettingsOpen,
        shortcutsOpen,
        windows,
    ]);

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
                    Saw Ye Htet - IT Support & Operations Specialist portfolio
                </h1>
                <Wallpaper />
                {booted && !hasVisibleWindows && !activitiesOpen && (
                    <section className="desktop-welcome" aria-label="Portfolio welcome">
                        <span className="desktop-welcome-kicker">
                            sawyehtet.com · recruiter quick path
                        </span>
                        <h2>{PROFILE.name}</h2>
                        <p>{PROFILE.role}</p>
                        <p className="desktop-welcome-stack">
                            {PROFILE.primaryStack.join(' · ')}
                        </p>
                        <button
                            className="desktop-welcome-hint"
                            onClick={() => openWindow('about')}
                            aria-label="Open About window"
                        >
                            {device === 'desktop'
                                ? 'Open About, Projects, Resume, or Contact below'
                                : 'Tap About, Projects, Resume, or Contact below'}
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
                                        <Icon name={action.icon} />
                                        <span>{action.label}</span>
                                    </button>
                                ) : (
                                    <a
                                        key={action.href}
                                        className="desktop-welcome-action"
                                        href={action.href}
                                        download={action.download}
                                    >
                                        <Icon name={action.icon} />
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

            {/* Activities Overlay (with dock on desktop) */}
            <ActivitiesOverlay
                isOpen={activitiesOpen}
                onClose={() => setActivitiesOpen(false)}
                workspaceIndex={workspaceIndex}
            />

            {altTabOpen && (
                <div className="alt-tab-switcher" role="status" aria-live="polite">
                    {Array.from(windows.entries())
                        .filter(([, win]) => win.isOpen)
                        .sort(([, a], [, b]) => b.zIndex - a.zIndex)
                        .map(([id], index) => (
                            <div
                                key={id}
                                className={`alt-tab-item${index === altTabIndex ? ' active' : ''}`}
                            >
                                <Icon name={ DOCK_APPS.find(app => app.id === id)?.icon || 'window-maximize' } />
                                <span>{DOCK_APPS.find(app => app.id === id)?.label || id}</span>
                            </div>
                        ))}
                </div>
            )}

            {shortcutsOpen && <ShortcutsDialog onClose={() => setShortcutsOpen(false)} />}

            <span className="sr-only" aria-live="polite">
                Workspace {workspaceIndex + 1}
            </span>

            {/* Windows — conditionally rendered to avoid wasted reconciliation */}
            {windows.get('about')?.isOpen && (
                <Window appId="about" title="About">
                    <ErrorBoundary level="window" appId="about">
                        <Suspense fallback={<AdwaitaSkeleton />}>
                            <AboutApp />
                        </Suspense>
                    </ErrorBoundary>
                </Window>
            )}
            {windows.get('browser')?.isOpen && (
                <Window appId="browser" title="Firefox">
                    <ErrorBoundary level="window" appId="browser">
                        <Suspense fallback={<AdwaitaSkeleton />}>
                            <BrowserApp />
                        </Suspense>
                    </ErrorBoundary>
                </Window>
            )}
            {windows.get('files')?.isOpen && (
                <Window appId="files" title="Files">
                    <ErrorBoundary level="window" appId="files">
                        <Suspense fallback={<AdwaitaSkeleton />}>
                            <FilesApp />
                        </Suspense>
                    </ErrorBoundary>
                </Window>
            )}
            {windows.get('skills')?.isOpen && (
                <Window appId="skills" title="Skills">
                    <ErrorBoundary level="window" appId="skills">
                        <Suspense fallback={<AdwaitaSkeleton />}>
                            <SkillsApp />
                        </Suspense>
                    </ErrorBoundary>
                </Window>
            )}
            {windows.get('projects')?.isOpen && (
                <Window appId="projects" title="Projects">
                    <ErrorBoundary level="window" appId="projects">
                        <Suspense fallback={<AdwaitaSkeleton />}>
                            <ProjectsApp />
                        </Suspense>
                    </ErrorBoundary>
                </Window>
            )}
            {windows.get('contact')?.isOpen && (
                <Window appId="contact" title="Contact">
                    <ErrorBoundary level="window" appId="contact">
                        <Suspense fallback={<AdwaitaSkeleton />}>
                            <ContactApp />
                        </Suspense>
                    </ErrorBoundary>
                </Window>
            )}
            {windows.get('terminal')?.isOpen && (
                <Window appId="terminal" title="Terminal">
                    <ErrorBoundary level="window" appId="terminal">
                        <Suspense fallback={<TerminalSkeleton />}>
                            <TerminalApp />
                        </Suspense>
                    </ErrorBoundary>
                </Window>
            )}
            {windows.get('text-editor')?.isOpen && (
                <Window appId="text-editor" title="Text Editor">
                    <ErrorBoundary level="window" appId="text-editor">
                        <Suspense fallback={<AdwaitaSkeleton />}>
                            <TextEditorApp />
                        </Suspense>
                    </ErrorBoundary>
                </Window>
            )}
            {windows.get('resume')?.isOpen && (
                <Window appId="resume" title="Document Viewer">
                    <ErrorBoundary level="window" appId="resume">
                        <Suspense fallback={<AdwaitaSkeleton />}>
                            <ResumeApp />
                        </Suspense>
                    </ErrorBoundary>
                </Window>
            )}
            {windows.get('settings')?.isOpen && (
                <Window appId="settings" title="Settings">
                    <ErrorBoundary level="window" appId="settings">
                        <Suspense fallback={<AdwaitaSkeleton />}>
                            <SettingsApp />
                        </Suspense>
                    </ErrorBoundary>
                </Window>
            )}
            {windows.get('focus-mode')?.isOpen && (
                <Window appId="focus-mode" title="Focus Mode">
                    <ErrorBoundary level="window" appId="focus-mode">
                        <Suspense fallback={<AdwaitaSkeleton />}>
                            <FocusModeApp />
                        </Suspense>
                    </ErrorBoundary>
                </Window>
            )}

            {/* Dock — always visible (Dash-to-Dock style) */}
            <Dock onShowApps={() => setActivitiesOpen(p => !p)} />

            {/* Dock onboarding tooltip for first-time visitors */}
            {showDockTip && !hasVisibleWindows && (
                <div className="dock-onboarding-tip" aria-live="polite">
                    <span>Click "Activities" or press Super to find apps</span>
                    <button
                        type="button"
                        className="dock-tip-dismiss"
                        aria-label="Dismiss tip"
                        onClick={() => setShowDockTip(false)}
                    >
                        <Icon name="times" />
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

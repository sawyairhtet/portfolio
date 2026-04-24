import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect, useRef, type ReactNode } from 'react';
import { describe, expect, it, beforeEach } from 'vitest';
import { ActivitiesOverlay } from '../components/ui/ActivitiesOverlay';
import { Dock } from '../components/shell/Dock';
import { SettingsApp } from '../components/apps/SettingsApp';
import { Wallpaper } from '../components/shell/Wallpaper';
import { FocusModeApp } from '../components/apps/FocusModeApp';
import { TerminalApp } from '../components/apps/TerminalApp';
import { DeviceProvider } from '../context/DeviceContext';
import { ThemeProvider } from '../context/ThemeContext';
import { PreferencesProvider } from '../context/PreferencesContext';
import { SoundProvider } from '../context/SoundContext';
import { NotificationProvider } from '../context/NotificationContext';
import { WindowManagerProvider, useWindowManager } from '../context/WindowManagerContext';

function setViewport(width: number) {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
    });
}

function Providers({ children }: { children: ReactNode }) {
    return (
        <DeviceProvider>
            <ThemeProvider>
                <PreferencesProvider>
                    <SoundProvider>
                        <WindowManagerProvider>
                            <NotificationProvider>
                                {children}
                            </NotificationProvider>
                        </WindowManagerProvider>
                    </SoundProvider>
                </PreferencesProvider>
            </ThemeProvider>
        </DeviceProvider>
    );
}

function DockStateHarness() {
    const { openWindow, windows } = useWindowManager();
    const didOpen = useRef(false);

    useEffect(() => {
        if (didOpen.current) return;
        didOpen.current = true;
        openWindow('about');
    }, [openWindow]);

    return (
        <>
            <Dock />
            <div data-testid="about-window-state">{windows.get('about')?.isOpen ? 'open' : 'closed'}</div>
        </>
    );
}

function TerminalHarness() {
    const { windows } = useWindowManager();

    return (
        <>
            <TerminalApp />
            <div data-testid="projects-window-state">{windows.get('projects')?.isOpen ? 'open' : 'closed'}</div>
        </>
    );
}

describe('Portfolio React interactions', () => {
    beforeEach(() => {
        localStorage.clear();
        setViewport(1440);
        document.body.className = '';
    });

    it('uses visible classes for Activities overlay state', () => {
        const { rerender } = render(
            <Providers>
                <ActivitiesOverlay isOpen={false} onClose={() => {}} />
            </Providers>,
        );

        expect(document.querySelector('.activities-overlay')).not.toHaveClass('visible');

        rerender(
            <Providers>
                <ActivitiesOverlay isOpen onClose={() => {}} />
            </Providers>,
        );

        expect(screen.getByRole('dialog', { name: /activities overview/i })).toHaveClass('visible');
    });

    it('dock clicks restore or focus open apps without closing them', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <DockStateHarness />
            </Providers>,
        );

        await waitFor(() => expect(screen.getByTestId('about-window-state')).toHaveTextContent('open'));
        await user.click(screen.getByRole('button', { name: 'About' }));
        await user.click(screen.getByRole('button', { name: 'About' }));

        expect(screen.getByTestId('about-window-state')).toHaveTextContent('open');
    });

    it('renders mobile dock with primary apps and an Apps launcher', async () => {
        const user = userEvent.setup();
        setViewport(390);

        render(
            <Providers>
                <Dock />
            </Providers>,
        );

        expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Projects' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Skills' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Contact' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Apps' }));

        expect(screen.getByRole('dialog', { name: /more apps/i })).toHaveClass('visible');
        expect(screen.getByRole('button', { name: /Terminal/i })).toBeInTheDocument();
    });

    it('switches Settings panels and updates wallpaper immediately', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <SettingsApp />
                <Wallpaper />
            </Providers>,
        );

        await user.click(screen.getByRole('button', { name: /Windows/i }));
        expect(screen.getByRole('heading', { name: 'Windows' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Appearance' }));
        await user.click(screen.getByRole('button', { name: 'Adwaita Dark' }));

        expect(document.querySelector('.wallpaper')).toHaveClass('custom-wallpaper');
    });

    it('pauses and resumes Focus sessions without resetting the timer label', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <FocusModeApp />
            </Providers>,
        );

        expect(screen.getByText('25:00')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: /Start/i }));
        await user.click(screen.getByRole('button', { name: /Pause/i }));

        expect(screen.getByText('Paused')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Resume/i })).toBeInTheDocument();
        expect(screen.getByText('25:00')).toBeInTheDocument();
    });

    it('runs Terminal portfolio commands and opens apps', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalHarness />
            </Providers>,
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'projects{Enter}');

        expect(await screen.findByText('Opened Projects.')).toBeInTheDocument();
        expect(screen.getByTestId('projects-window-state')).toHaveTextContent('open');
    });
});

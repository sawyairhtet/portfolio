import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect, useRef, type ReactNode } from 'react';
import { describe, expect, it, beforeEach } from 'vitest';
import { ActivitiesOverlay } from '../components/ui/ActivitiesOverlay';
import { QuickSettingsPanel } from '../components/ui/QuickSettingsPanel';
import { Dock } from '../components/shell/Dock';
import { Window } from '../components/window/Window';
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
                            <NotificationProvider>{children}</NotificationProvider>
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
            <div data-testid="about-window-state">
                {windows.get('about')?.isOpen ? 'open' : 'closed'}
            </div>
        </>
    );
}

function OpenWindowIdentityHarness() {
    const { openWindow, windows } = useWindowManager();
    const initialOpenWindow = useRef(openWindow);

    useEffect(() => {
        openWindow('about');
    }, [openWindow]);

    return (
        <div data-testid="open-window-identity">
            {windows.get('about')?.isOpen
                ? String(initialOpenWindow.current === openWindow)
                : 'pending'}
        </div>
    );
}

function TerminalHarness() {
    const { windows } = useWindowManager();

    return (
        <>
            <TerminalApp />
            <div data-testid="projects-window-state">
                {windows.get('projects')?.isOpen ? 'open' : 'closed'}
            </div>
        </>
    );
}

function WindowEscapeHarness() {
    const { openWindow, windows } = useWindowManager();
    const didOpen = useRef(false);

    useEffect(() => {
        if (didOpen.current) return;
        didOpen.current = true;
        openWindow('about');
    }, [openWindow]);

    return (
        <>
            <Window appId="about" title="About">
                <button type="button">Inside window</button>
            </Window>
            <div data-testid="about-window-state">
                {windows.get('about')?.isOpen ? 'open' : 'closed'}
            </div>
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
            </Providers>
        );

        expect(document.querySelector('.activities-overlay')).not.toHaveClass('visible');

        rerender(
            <Providers>
                <ActivitiesOverlay isOpen onClose={() => {}} />
            </Providers>
        );

        expect(screen.getByRole('dialog', { name: /activities overview/i })).toHaveClass('visible');
    });

    it('dock clicks restore or focus open apps without closing them', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <DockStateHarness />
            </Providers>
        );

        await waitFor(() =>
            expect(screen.getByTestId('about-window-state')).toHaveTextContent('open')
        );
        await user.click(screen.getByRole('button', { name: 'About' }));
        await user.click(screen.getByRole('button', { name: 'About' }));

        expect(screen.getByTestId('about-window-state')).toHaveTextContent('open');
    });

    it('keeps the openWindow callback stable after opening an app', async () => {
        render(
            <Providers>
                <OpenWindowIdentityHarness />
            </Providers>
        );

        await waitFor(() =>
            expect(screen.getByTestId('open-window-identity')).toHaveTextContent('true')
        );
    });

    it('renders mobile dock with primary apps and an Apps launcher', async () => {
        const user = userEvent.setup();
        setViewport(390);

        render(
            <Providers>
                <Dock />
            </Providers>
        );

        expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Projects' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Skills' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Contact' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Terminal/i })).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Apps' }));

        expect(screen.getByRole('dialog', { name: /more apps/i })).toHaveClass('visible');
        expect(screen.getByRole('button', { name: /Terminal/i })).toBeInTheDocument();
    });

    it('keeps closed Quick Settings out of the accessible tree', () => {
        const { rerender } = render(
            <Providers>
                <QuickSettingsPanel isOpen={false} onClose={() => {}} />
            </Providers>
        );

        expect(screen.queryByRole('button', { name: 'Wi-Fi' })).not.toBeInTheDocument();

        rerender(
            <Providers>
                <QuickSettingsPanel isOpen onClose={() => {}} />
            </Providers>
        );

        expect(screen.getByRole('button', { name: 'Wi-Fi' })).toBeInTheDocument();
    });

    it('switches Settings panels and updates wallpaper immediately', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <SettingsApp />
                <Wallpaper />
            </Providers>
        );

        await user.click(screen.getByRole('button', { name: /Windows/i }));
        expect(screen.getByRole('heading', { name: 'Windows' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Appearance' }));
        await user.click(screen.getByRole('button', { name: 'GNOME Dark' }));

        expect(document.querySelector('.wallpaper')).toHaveClass('custom-wallpaper');
    });

    it('updates the live accent token when a color swatch changes', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <SettingsApp />
            </Providers>
        );

        await user.click(screen.getByRole('button', { name: 'Green' }));

        await waitFor(() =>
            expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#2ec27e')
        );
    });

    it('closes a focused window with Escape', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <WindowEscapeHarness />
            </Providers>
        );

        const dialog = await screen.findByRole('dialog', { name: 'About' });
        dialog.focus();
        await user.keyboard('{Escape}');

        expect(screen.getByTestId('about-window-state')).toHaveTextContent('closed');
    });

    it('pauses and resumes Focus sessions without resetting the timer label', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <FocusModeApp />
            </Providers>
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
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'projects{Enter}');

        expect(await screen.findByText('Opened Projects.')).toBeInTheDocument();
        expect(screen.getByTestId('projects-window-state')).toHaveTextContent('open');
    });
});

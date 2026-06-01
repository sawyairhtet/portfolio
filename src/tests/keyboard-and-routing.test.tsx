import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect, useRef, type ReactNode } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, expect, it, beforeEach } from 'vitest';
import { Window } from '../components/window/Window';
import { DeepLinkHandler } from '../components/shell/DeepLinkHandler';
import { DesktopShell } from '../components/shell/DesktopShell';
import { DeviceProvider } from '../context/DeviceContext';
import { ThemeProvider } from '../context/ThemeContext';
import { PreferencesProvider } from '../context/PreferencesContext';
import { SoundProvider } from '../context/SoundContext';
import { NotificationProvider } from '../context/NotificationContext';
import { WindowManagerProvider, useWindowManager } from '../context/WindowManagerContext';

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

function RoutedApp({ initialPath }: { initialPath: string }) {
    return (
        <MemoryRouter initialEntries={[initialPath]}>
            <Providers>
                <Routes>
                    <Route path="/" element={<DesktopShell />} />
                    <Route path="/app/:appId" element={<DeepLinkHandler />} />
                    <Route path="*" element={<DesktopShell />} />
                </Routes>
            </Providers>
        </MemoryRouter>
    );
}

function WindowLifecycleHarness() {
    const { openWindow, closeWindow, windows } = useWindowManager();
    const didOpen = useRef(false);

    useEffect(() => {
        if (didOpen.current) return;
        didOpen.current = true;
        openWindow('about');
    }, [openWindow]);

    return (
        <>
            <Window appId="about" title="About">
                <p>About content</p>
            </Window>
            <button type="button" data-testid="close-about" onClick={() => closeWindow('about')}>
                Close
            </button>
            <div data-testid="about-state">{windows.get('about')?.isOpen ? 'open' : 'closed'}</div>
        </>
    );
}

function TwoWindowHarness() {
    const { openWindow, windows } = useWindowManager();
    const didOpen = useRef(false);

    useEffect(() => {
        if (didOpen.current) return;
        didOpen.current = true;
        openWindow('about');
        openWindow('skills');
    }, [openWindow]);

    return (
        <>
            <Window appId="about" title="About">
                <p>About content</p>
            </Window>
            <Window appId="skills" title="Skills">
                <p>Skills content</p>
            </Window>
            <div data-testid="about-state">{windows.get('about')?.isOpen ? 'open' : 'closed'}</div>
            <div data-testid="skills-state">
                {windows.get('skills')?.isOpen ? 'open' : 'closed'}
            </div>
        </>
    );
}

describe('Deep link routing', () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem('hasVisitedBefore', 'true');
    });

    it('opens About window when navigating to /app/about', async () => {
        render(<RoutedApp initialPath="/app/about" />);

        await waitFor(() => {
            expect(screen.getByRole('dialog', { name: 'About' })).toBeInTheDocument();
        });
    });

    it('opens Calendar window when navigating to /app/calendar', async () => {
        render(<RoutedApp initialPath="/app/calendar" />);

        await waitFor(() => {
            expect(screen.getByRole('dialog', { name: 'Calendar' })).toBeInTheDocument();
        });
    });

    it('opens Image Viewer window when navigating to /app/image-viewer', async () => {
        render(<RoutedApp initialPath="/app/image-viewer" />);

        await waitFor(() => {
            expect(screen.getByRole('dialog', { name: 'Image Viewer' })).toBeInTheDocument();
        });
    });

    it('redirects to / for invalid deep links', async () => {
        render(<RoutedApp initialPath="/app/banana" />);

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });
});

describe('Window lifecycle', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('tracks open and close state correctly', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <WindowLifecycleHarness />
            </Providers>
        );

        await waitFor(() => {
            expect(screen.getByTestId('about-state')).toHaveTextContent('open');
        });
        expect(screen.getByRole('dialog', { name: 'About' })).toBeInTheDocument();

        await user.click(screen.getByTestId('close-about'));

        await waitFor(() => {
            expect(screen.getByTestId('about-state')).toHaveTextContent('closed');
        });
    });

    it('Escape closes only the top-most window when two are open', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TwoWindowHarness />
            </Providers>
        );

        await waitFor(() => {
            expect(screen.getByTestId('skills-state')).toHaveTextContent('open');
            expect(screen.getByTestId('about-state')).toHaveTextContent('open');
        });

        const skillsDialog = screen.getByRole('dialog', { name: 'Skills' });
        skillsDialog.focus();
        await user.keyboard('{Escape}');

        await waitFor(() => {
            expect(screen.getByTestId('skills-state')).toHaveTextContent('closed');
        });
        expect(screen.getByTestId('about-state')).toHaveTextContent('open');
    });
});

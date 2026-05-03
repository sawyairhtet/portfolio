import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ContactApp } from '../components/apps/ContactApp';
import { BootScreen } from '../components/shell/BootScreen';
import { DeviceProvider } from '../context/DeviceContext';
import { ThemeProvider } from '../context/ThemeContext';
import { PreferencesProvider } from '../context/PreferencesContext';
import { SoundProvider } from '../context/SoundContext';
import { NotificationProvider } from '../context/NotificationContext';
import { WindowManagerProvider } from '../context/WindowManagerContext';

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

describe('ContactApp form validation', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renders all primary contact actions', () => {
        render(
            <Providers>
                <ContactApp />
            </Providers>
        );

        expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /copy email/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument();
    });

    it('shows validation errors when submitting empty form', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <ContactApp />
            </Providers>
        );

        await user.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
    });

    it('shows invalid email error for bad email', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <ContactApp />
            </Providers>
        );

        await user.type(screen.getByRole('textbox', { name: /name/i }), 'Test User');
        await user.type(screen.getByRole('textbox', { name: /email/i }), 'not-an-email');
        await user.type(screen.getByRole('textbox', { name: /message/i }), 'Hello, this is a test message for validation.');
        await user.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
        });
    });

    it('sets aria-invalid on fields with errors', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <ContactApp />
            </Providers>
        );

        await user.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: /name/i })).toHaveAttribute('aria-invalid', 'true');
            expect(screen.getByRole('textbox', { name: /email/i })).toHaveAttribute('aria-invalid', 'true');
            expect(screen.getByRole('textbox', { name: /message/i })).toHaveAttribute('aria-invalid', 'true');
        });
    });
});

describe('BootScreen skip behavior', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('calls onBootComplete when user presses a key to skip', async () => {
        const user = userEvent.setup();
        const onBootComplete = vi.fn();

        render(
            <Providers>
                <BootScreen onBootComplete={onBootComplete} />
            </Providers>
        );

        expect(screen.getByRole('status', { name: /system booting/i })).toBeInTheDocument();

        await user.keyboard(' ');

        await waitFor(() => {
            expect(onBootComplete).toHaveBeenCalledTimes(1);
        });
    });

    it('skips boot immediately for returning visitors with fastBoot', () => {
        localStorage.setItem('hasVisitedBefore', 'true');
        const onBootComplete = vi.fn();

        render(
            <Providers>
                <BootScreen onBootComplete={onBootComplete} />
            </Providers>
        );

        // fastBoot defaults to true, so returning visitors skip boot
        expect(onBootComplete).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('status', { name: /system booting/i })).not.toBeInTheDocument();
    });

    it('shows skip hint during boot', () => {
        localStorage.clear();
        const onBootComplete = vi.fn();

        render(
            <Providers>
                <BootScreen onBootComplete={onBootComplete} />
            </Providers>
        );

        expect(screen.getByText(/press any key or click to skip/i)).toBeInTheDocument();
    });
});

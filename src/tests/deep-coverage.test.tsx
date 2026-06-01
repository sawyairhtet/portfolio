import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { TerminalApp } from '../components/apps/TerminalApp';
import { ContactApp } from '../components/apps/ContactApp';
import { ErrorBoundary } from '../components/ErrorBoundary';
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

describe('ErrorBoundary resilience', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('renders error UI when a child component always throws', () => {
        function AlwaysThrows(): ReactNode {
            throw new Error('Crash');
        }

        render(
            <Providers>
                <ErrorBoundary level="window" appId="terminal">
                    <AlwaysThrows />
                </ErrorBoundary>
            </Providers>
        );

        expect(screen.getByText('This app encountered an error')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('keeps showing error UI on repeated retry attempts after persistent failures', () => {
        function AlwaysThrows(): ReactNode {
            throw new Error('Always crashes');
        }

        render(
            <Providers>
                <ErrorBoundary level="window" appId="about">
                    <AlwaysThrows />
                </ErrorBoundary>
            </Providers>
        );

        expect(screen.getByText('This app encountered an error')).toBeInTheDocument();

        for (let i = 0; i < 3; i++) {
            act(() => {
                screen.getByRole('button', { name: 'Retry' }).click();
            });
            expect(screen.getByText('This app encountered an error')).toBeInTheDocument();
        }
    });

    it('app-level boundary renders reload screen with Reload button', () => {
        function AlwaysThrows(): ReactNode {
            throw new Error('Always crashes');
        }

        render(
            <ErrorBoundary level="app">
                <AlwaysThrows />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    });

    it('renders children normally when no error occurs', () => {
        render(
            <Providers>
                <ErrorBoundary level="window" appId="test">
                    <p>Everything works fine</p>
                </ErrorBoundary>
            </Providers>
        );

        expect(screen.getByText('Everything works fine')).toBeInTheDocument();
    });
});

describe('Terminal command parsing', () => {
    beforeEach(() => {
        localStorage.clear();
        window.__portfolioLoadTime = Date.now();
    });

    it('shows help output when help command is entered', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'help{Enter}');

        await waitFor(() => {
            expect(screen.getByText('Available commands:')).toBeInTheDocument();
        });
        expect(
            screen.getByText(/whoami\/date\/uptime\/echo\/neofetch\/tree/)
        ).toBeInTheDocument();
    });

    it('outputs username for whoami', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'whoami{Enter}');

        await waitFor(() => {
            expect(screen.getByText('sawyehtet')).toBeInTheDocument();
        });
    });

    it('displays system info for neofetch', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'neofetch{Enter}');

        await waitFor(() => {
            expect(screen.getByText(/Fedora Linux 43/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/Linux 6.19/i)).toBeInTheDocument();
        expect(screen.getByText(/GNOME 49/i)).toBeInTheDocument();
    });

    it('shows uptime after portfolio load', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'uptime{Enter}');

        await waitFor(() => {
            expect(screen.getByText(/up \d+m \d+s/)).toBeInTheDocument();
        });
    });

    it('lists directory contents with ls', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'ls{Enter}');

        await waitFor(() => {
            const output = screen.getByLabelText('Terminal output');
            expect(output.textContent).toMatch(/resume\.md|projects|skills|about|contact/i);
        });
    });

    it('navigates directories with cd and ls', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'cd projects{Enter}');
        await user.clear(input);
        await user.type(input, 'ls{Enter}');

        await waitFor(() => {
            const output = screen.getByLabelText('Terminal output');
            expect(output.textContent).toMatch(/portfolio|README\.md/i);
        });
    });

    it('reads files with cat', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'cat resume.md{Enter}');

        await waitFor(() => {
            const output = screen.getByLabelText('Terminal output');
            expect(output.textContent).toMatch(/Saw Ye Htet/i);
        });
    });

    it('shows present working directory with pwd', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'pwd{Enter}');

        await waitFor(() => {
            expect(screen.getByText('/home/sawyehtet')).toBeInTheDocument();
        });
    });

    it('clears the terminal with clear', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');

        // First run a command that adds output
        await user.type(input, 'whoami{Enter}');
        await waitFor(() => {
            expect(screen.getByText('sawyehtet')).toBeInTheDocument();
        });

        // Clear
        await user.clear(input);
        await user.type(input, 'clear{Enter}');

        await waitFor(() => {
            expect(screen.queryByText('sawyehtet')).not.toBeInTheDocument();
        });
    });

    it('outputs a fortune message', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'fortune{Enter}');

        await waitFor(() => {
            const output = screen.getByLabelText('Terminal output');
            expect(output.textContent).toBeTruthy();
        });
    });

    it('outputs a joke', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'joke{Enter}');

        await waitFor(() => {
            const output = screen.getByLabelText('Terminal output');
            expect(output.textContent).toBeTruthy();
        });
    });

    it('echoes input back', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'echo hello world{Enter}');

        await waitFor(() => {
            expect(screen.getByText('hello world')).toBeInTheDocument();
        });
    });

    it('shows date for date command', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'date{Enter}');

        await waitFor(() => {
            const output = screen.getByLabelText('Terminal output');
            expect(output.textContent).toBeTruthy();
        });
    });

    it('shows desktop shortcuts', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <TerminalApp />
            </Providers>
        );

        const input = screen.getByLabelText('Terminal command input');
        await user.type(input, 'shortcuts{Enter}');

        await waitFor(() => {
            expect(screen.getByText(/Activities overview/i)).toBeInTheDocument();
        });
    });
});

describe('Contact form rate limiting', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    it('shows rate limit message when too many submissions attempted', async () => {
        const user = userEvent.setup();

        // Simulate 3 prior submissions within 5 minutes
        const now = Date.now();
        sessionStorage.setItem(
            'contact_submit_ts',
            JSON.stringify([now - 10000, now - 20000, now - 30000])
        );

        render(
            <Providers>
                <ContactApp />
            </Providers>
        );

        // Fill form with valid data
        await user.type(screen.getByRole('textbox', { name: /name/i }), 'Test User');
        await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com');
        await user.type(
            screen.getByRole('textbox', { name: /message/i }),
            'This is a valid test message that should be rate limited.'
        );
        await user.click(screen.getByRole('button', { name: /send message/i }));

        await waitFor(() => {
            expect(screen.getByText(/too many messages/i)).toBeInTheDocument();
        });
    });

    it('allows submission when rate limit window has expired', async () => {
        const user = userEvent.setup();

        // Simulate 3 submissions but the last one is outside the 5-min window
        const now = Date.now();
        sessionStorage.setItem(
            'contact_submit_ts',
            JSON.stringify([now - 301000, now - 302000, now - 303000])
        );

        render(
            <Providers>
                <ContactApp />
            </Providers>
        );

        await user.type(screen.getByRole('textbox', { name: /name/i }), 'Test User');
        await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com');
        await user.type(
            screen.getByRole('textbox', { name: /message/i }),
            'This is a valid test message that should not be rate limited.'
        );

        // The button should not be disabled solely by rate limiting when the window expired
        const submitBtn = screen.getByRole('button', { name: /send message/i });
        expect(submitBtn).not.toBeDisabled();
    });
});



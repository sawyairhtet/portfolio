import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactNode } from 'react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
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

function ThrowOnce({ shouldThrow }: { shouldThrow: boolean }) {
    if (shouldThrow) throw new Error('Test crash');
    return <p>App recovered</p>;
}

function WindowErrorHarness() {
    const [broken, setBroken] = useState(true);

    return (
        <>
            <ErrorBoundary level="window" appId="about">
                <ThrowOnce shouldThrow={broken} />
            </ErrorBoundary>
            <button type="button" data-testid="fix" onClick={() => setBroken(false)}>
                Fix
            </button>
        </>
    );
}

describe('ErrorBoundary', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('renders window-level error UI when a child throws', () => {
        render(
            <Providers>
                <ErrorBoundary level="window" appId="about">
                    <ThrowOnce shouldThrow={true} />
                </ErrorBoundary>
            </Providers>
        );

        expect(screen.getByText('This app encountered an error')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('renders app-level crash screen with Reload button', () => {
        render(
            <ErrorBoundary level="app">
                <ThrowOnce shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    });

    it('recovers when Retry is clicked after fixing the error source', async () => {
        const user = userEvent.setup();

        render(
            <Providers>
                <WindowErrorHarness />
            </Providers>
        );

        expect(screen.getByText('This app encountered an error')).toBeInTheDocument();

        await user.click(screen.getByTestId('fix'));
        await user.click(screen.getByRole('button', { name: 'Retry' }));

        await waitFor(() => {
            expect(screen.getByText('App recovered')).toBeInTheDocument();
        });
    });

    it('passes children through when no error occurs', () => {
        render(
            <Providers>
                <ErrorBoundary level="window" appId="terminal">
                    <p>Normal content</p>
                </ErrorBoundary>
            </Providers>
        );

        expect(screen.getByText('Normal content')).toBeInTheDocument();
        expect(screen.queryByText('This app encountered an error')).not.toBeInTheDocument();
    });
});

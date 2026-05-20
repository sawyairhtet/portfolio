import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
    level: 'app' | 'window';
    appId?: string;
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error(`[ErrorBoundary:${this.props.level}]`, error, info.componentStack);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        if (this.props.level === 'app') {
            return (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#1e1e1e',
                        color: '#fff',
                        fontFamily: "'Adwaita Sans', 'Cantarell', sans-serif",
                    }}
                >
                    <div
                        style={{
                            textAlign: 'center',
                            maxWidth: 400,
                            background: '#2e2e32',
                            borderRadius: 12,
                            padding: '48px 36px',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                        }}
                    >
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                background: '#c01c28',
                                color: '#fff',
                                fontSize: 28,
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                            }}
                        >
                            !
                        </div>
                        <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>
                            Something went wrong
                        </h1>
                        <p
                            style={{
                                fontSize: 14,
                                opacity: 0.7,
                                margin: '0 0 24px',
                                lineHeight: 1.5,
                            }}
                        >
                            The application encountered an unexpected error.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '10px 32px',
                                borderRadius: 8,
                                background: '#3584e4',
                                color: '#fff',
                                border: 'none',
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Reload
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: 12,
                    padding: 24,
                    color: 'var(--window-fg-color, #fff)',
                    fontFamily: "'Adwaita Sans', 'Cantarell', sans-serif",
                }}
            >
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'var(--error-bg-color, #c01c28)',
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    !
                </div>
                <p style={{ fontSize: 14, opacity: 0.8, textAlign: 'center' }}>
                    This app encountered an error
                </p>
                <button
                    onClick={() => this.setState({ hasError: false })}
                    style={{
                        padding: '8px 24px',
                        borderRadius: 8,
                        background: 'var(--accent-bg-color, #3584e4)',
                        color: '#fff',
                        border: 'none',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }
}

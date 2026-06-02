import { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '../ui/Icon';
import { PROFILE } from '../../config/profile';
import { useTheme } from '../../context/ThemeContext';
import { usePreferences } from '../../context/PreferencesContext';

interface GdmLoginProps {
    onLogin: () => void;
}

export function GdmLogin({ onLogin }: GdmLoginProps) {
    const { isDark } = useTheme();
    const { preferences } = usePreferences();
    const [visible, setVisible] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [clockTime, setClockTime] = useState('');
    const loginBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setClockTime(
                now.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })
            );
        };
        update();
        const interval = setInterval(update, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (visible) {
            loginBtnRef.current?.focus();
        }
    }, [visible]);

    const handleLogin = useCallback(() => {
        setFadeOut(true);
        setTimeout(onLogin, 600);
    }, [onLogin]);

    return (
        <div className={`gdm-login ${visible ? 'visible' : ''} ${fadeOut ? 'fade-out' : ''}`}>
            <div className="gdm-background" aria-hidden="true">
                <div
                    className="gdm-wallpaper-blur"
                    style={
                        preferences.wallpaperId === 'default' && !isDark
                            ? {
                                  backgroundImage:
                                      "url('/images/wallpapers/fedora-43/f43-day.webp')",
                              }
                            : undefined
                    }
                />
            </div>
            <div className="gdm-content">
                <div className="gdm-clock">
                    <span className="gdm-time">{clockTime}</span>
                    <span className="gdm-date">
                        {new Date().toLocaleDateString([], {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </span>
                </div>
                <div className="gdm-login-card">
                    <div className="gdm-avatar">
                        <div className="gdm-avatar-circle">
                            <Icon name="user-circle" />
                        </div>
                    </div>
                    <div className="gdm-user-info">
                        <strong>{PROFILE.name}</strong>
                        <span>{PROFILE.role}</span>
                    </div>
                    <div className="gdm-form">
                        <div className="gdm-password-group">
                            <input
                                type="password"
                                className="gdm-password-input"
                                placeholder="Password"
                                aria-label="Enter password to login"
                                autoFocus
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleLogin();
                                }}
                            />
                        </div>
                        <button
                            ref={loginBtnRef}
                            type="button"
                            className="gdm-login-btn"
                            onClick={handleLogin}
                        >
                            Sign In
                        </button>
                    </div>
                    <span className="gdm-hint">Press Enter or click Sign In to continue</span>
                    <button type="button" className="gdm-skip-btn" onClick={handleLogin}>
                        Skip to Desktop
                    </button>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '../ui/Icon';
import { PROFILE } from '../../config/profile';
import { useTheme } from '../../context/ThemeContext';
import { usePreferences } from '../../context/PreferencesContext';

interface GdmLoginProps {
    onLogin: () => void;
}

export function GdmLogin({ onLogin }: GdmLoginProps) {
    const reduced = useReducedMotion();
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
                <motion.div
                    className="gdm-login-card"
                    initial={reduced ? undefined : { opacity: 0, y: 20 }}
                    animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: [0.2, 0, 0, 1] }}
                >
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
                        <motion.button
                            ref={loginBtnRef}
                            type="button"
                            className="gdm-login-btn"
                            onClick={handleLogin}
                            whileHover={reduced ? undefined : { scale: 1.02 }}
                            whileTap={reduced ? undefined : { scale: 0.97 }}
                        >
                            Sign In
                        </motion.button>
                    </div>
                    <span className="gdm-hint">Press Enter or click Sign In to continue</span>
                    <button type="button" className="gdm-skip-btn" onClick={handleLogin}>
                        Skip to Desktop
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

import { useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useWindowManager } from '../../context/WindowManagerContext';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
    const { notifications, dismissNotification, clearAllNotifications, isDnd, setDnd } =
        useNotifications();
    const { openWindow } = useWindowManager();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Auto-focus first focusable element on open
    useEffect(() => {
        if (!isOpen) return;
        const panel = panelRef.current;
        if (!panel) return;

        const firstFocusable = panel.querySelector<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        setTimeout(() => firstFocusable?.focus(), 50);
    }, [isOpen]);

    // Focus trap while panel is open
    useEffect(() => {
        if (!isOpen) return;

        const handleTabTrap = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            const panel = panelRef.current;
            if (!panel) return;

            const focusable = Array.from(
                panel.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
    }, [isOpen]);

    if (!isOpen) return null;

    // Group notifications
    const grouped = notifications.reduce<Record<string, typeof notifications>>((acc, n) => {
        if (!acc[n.group]) acc[n.group] = [];
        acc[n.group].push(n);
        return acc;
    }, {});

    return (
        <div
            ref={panelRef}
            className="notification-center visible"
            role="dialog"
            aria-label="Notification Center"
            aria-modal="true"
        >
            <div className="notification-header">
                <span className="notification-header-title">Notifications</span>
                <div className="notification-header-actions">
                    <button
                        type="button"
                        className={`dnd-toggle${isDnd ? ' active' : ''}`}
                        aria-pressed={isDnd}
                        aria-label={isDnd ? 'Do Not Disturb: on' : 'Do Not Disturb: off'}
                        onClick={() => setDnd(!isDnd)}
                    >
                        <i className="fas fa-bell-slash" aria-hidden="true" />
                        DND
                    </button>
                    <button
                        type="button"
                        className="clear-all-btn"
                        aria-label="Clear all notifications"
                        onClick={clearAllNotifications}
                    >
                        Clear All
                    </button>
                </div>
            </div>
            <div className="notification-list">
                {Object.keys(grouped).length === 0 ? (
                    <div className="notification-empty">
                        <i
                            className={isDnd ? 'fas fa-bell-slash' : 'fas fa-bell'}
                            aria-hidden="true"
                        />
                        <span>{isDnd ? 'Do Not Disturb is on' : 'No notifications'}</span>
                        <small>
                            {isDnd
                                ? 'Toasts and new notifications are paused.'
                                : 'You are all caught up.'}
                        </small>
                    </div>
                ) : (
                    Object.entries(grouped).map(([group, items]) => (
                        <div key={group} className="notification-group">
                            <div className="notification-group-header">
                                <span className="notification-group-name">{group}</span>
                                <span className="notification-group-count">{items.length}</span>
                            </div>
                            <div className="notification-group-items">
                                {items.map(item => (
                                    <div key={item.id} className="notification-item">
                                        <div
                                            className={`notification-item-icon${item.iconBg.includes('--fedora-green') ? ' notification-item-icon-success' : ' notification-item-icon-info'}`}
                                        >
                                            <i className={item.icon} aria-hidden="true" />
                                        </div>
                                        <div className="notification-item-content">
                                            <div className="notification-item-title">
                                                {item.title}
                                            </div>
                                            <div className="notification-item-body">
                                                {item.body}
                                            </div>
                                            <div className="notification-item-time">
                                                {item.time}
                                            </div>
                                            {item.action && (
                                                <button
                                                    type="button"
                                                    className="notification-action"
                                                    onClick={() => {
                                                        if (item.action?.appId) {
                                                            openWindow(item.action.appId);
                                                        }
                                                        if (item.action?.href) {
                                                            window.open(
                                                                item.action.href,
                                                                '_blank',
                                                                'noopener,noreferrer'
                                                            );
                                                        }
                                                        onClose();
                                                    }}
                                                >
                                                    {item.action.label}
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="notification-item-dismiss"
                                            aria-label="Dismiss notification"
                                            onClick={() => dismissNotification(item.id)}
                                        >
                                            <i className="fas fa-times" aria-hidden="true" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

import { useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
    const { notifications, dismissNotification, clearAllNotifications } = useNotifications();

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

    if (!isOpen) return null;

    // Group notifications
    const grouped = notifications.reduce<Record<string, typeof notifications>>((acc, n) => {
        if (!acc[n.group]) acc[n.group] = [];
        acc[n.group].push(n);
        return acc;
    }, {});

    return (
        <div
            className="notification-center visible"
            role="dialog"
            aria-label="Notification Center"
            aria-modal="false"
        >
            <div className="notification-header">
                <span className="notification-header-title">Notifications</span>
                <div className="notification-header-actions">
                    <button
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
                        <span>No notifications</span>
                    </div>
                ) : (
                    Object.entries(grouped).map(([group, items]) => (
                        <div key={group} className="notification-group">
                            <div className="notification-group-header">
                                <span className="notification-group-name">{group}</span>
                                <span className="notification-group-count">{items.length}</span>
                            </div>
                            <div className="notification-group-items">
                                {items.map((item) => (
                                    <div key={item.id} className="notification-item">
                                        <div
                                            className={`notification-item-icon${item.iconBg.includes('--fedora-green') ? ' notification-item-icon-success' : ' notification-item-icon-info'}`}
                                        >
                                            <i className={item.icon} aria-hidden="true" />
                                        </div>
                                        <div className="notification-item-content">
                                            <div className="notification-item-title">{item.title}</div>
                                            <div className="notification-item-body">{item.body}</div>
                                            <div className="notification-item-time">{item.time}</div>
                                        </div>
                                        <button
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

import { useNotifications } from '../../context/NotificationContext';
import { useWindowManager } from '../../context/WindowManagerContext';

export function ToastContainer() {
    const { toasts } = useNotifications();
    const { openWindow } = useWindowManager();

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container" aria-live="polite">
            {toasts.map(toast => (
                <div key={toast.id} className="toast-notification show">
                    <i className={toast.icon} aria-hidden="true" />
                    <span>{toast.message}</span>
                    {toast.action && (
                        <button
                            type="button"
                            onClick={() => {
                                if (toast.action?.appId) {
                                    openWindow(toast.action.appId);
                                }
                                if (toast.action?.href) {
                                    window.open(toast.action.href, '_blank', 'noopener,noreferrer');
                                }
                            }}
                        >
                            {toast.action.label}
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

import { useNotifications } from '../../context/NotificationContext';

export function ToastContainer() {
    const { toasts } = useNotifications();

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container" aria-live="polite">
            {toasts.map(toast => (
                <div key={toast.id} className="toast-notification show">
                    <i className={toast.icon} aria-hidden="true" />
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}

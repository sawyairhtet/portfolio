/**
 * Notifications - Toast messages
 */

export function showToast(message, icon = 'fa-info-circle') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    // Create icon element safely (avoid innerHTML XSS)
    const iconEl = document.createElement('i');
    iconEl.className = `fas ${icon}`;
    toast.appendChild(iconEl);

    // Create text node to safely escape message content
    toast.appendChild(document.createTextNode(' ' + message));

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('visible');
    });

    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

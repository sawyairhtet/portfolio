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
    // Support full class strings (e.g. 'fab fa-fedora') as well as bare icon names (e.g. 'fa-check')
    iconEl.className = /^fa[bsrd] /.test(icon) ? icon : `fas ${icon}`;
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

/** @returns {void} */
export function setupNotificationCenter() {
    const panel = document.getElementById('notification-center');
    const clock = document.querySelector('.menu-clock');
    const clearAll = document.getElementById('nc-clear-all');

    if (!panel || !clock) {
        return;
    }

    let isOpen = false;

    function openNC() {
        isOpen = true;
        panel.classList.add('visible');
        panel.setAttribute('aria-modal', 'true');
        clock.setAttribute('aria-expanded', 'true');
        // Close Quick Settings if open
        const qs = document.getElementById('quick-settings-panel');
        if (qs && qs.classList.contains('visible')) {
            qs.classList.remove('visible');
            const qsBtn = document.getElementById('quick-settings-btn');
            if (qsBtn) {
                qsBtn.setAttribute('aria-expanded', 'false');
            }
        }
    }

    function closeNC() {
        isOpen = false;
        panel.classList.remove('visible');
        panel.setAttribute('aria-modal', 'false');
        clock.setAttribute('aria-expanded', 'false');
    }

    // Clock click toggles notification center (GNOME 49 behaviour)
    clock.setAttribute('role', 'button');
    clock.setAttribute('tabindex', '0');
    clock.setAttribute('aria-label', 'Clock — click to open notifications');
    clock.setAttribute('aria-expanded', 'false');
    /** @type {HTMLElement} */ (clock).style.cursor = 'pointer';

    clock.addEventListener('click', e => {
        e.stopPropagation();
        if (isOpen) {
            closeNC();
        } else {
            openNC();
        }
    });

    clock.addEventListener('keydown', e => {
        const ke = /** @type {KeyboardEvent} */ (e);
        if (ke.key === 'Enter' || ke.key === ' ') {
            ke.preventDefault();
            if (isOpen) {
                closeNC();
            } else {
                openNC();
            }
        }
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (isOpen && !panel.contains(/** @type {Node} */ (e.target)) && e.target !== clock) {
            closeNC();
        }
    });

    // Escape closes
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isOpen) {
            closeNC();
        }
    });

    // Dismiss individual notifications
    document.querySelectorAll('.notification-item-dismiss').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const item = /** @type {HTMLElement} */ (btn).closest('.notification-item');
            if (item) {
                /** @type {HTMLElement} */ (item).style.animation = 'notificationSlideOut 0.2s ease forwards';
                setTimeout(() => {
                    item.remove();
                    updateNotificationCount();
                }, 200);
            }
        });
    });

    // Clear all
    if (clearAll) {
        clearAll.addEventListener('click', e => {
            e.stopPropagation();
            const list = document.getElementById('notification-list');
            if (list) {
                list.innerHTML = '<div class="notification-empty"><i class="fas fa-bell-slash" aria-hidden="true"></i><span>No notifications</span></div>';
            }
        });
    }

    function updateNotificationCount() {
        document.querySelectorAll('.notification-group').forEach(group => {
            const items = group.querySelectorAll('.notification-item');
            const countEl = group.querySelector('.notification-group-count');
            if (countEl) {
                countEl.textContent = String(items.length);
            }
            if (items.length === 0) {
                group.remove();
            }
        });
        const list = document.getElementById('notification-list');
        if (list && list.querySelectorAll('.notification-item').length === 0) {
            list.innerHTML = '<div class="notification-empty"><i class="fas fa-bell-slash" aria-hidden="true"></i><span>No notifications</span></div>';
        }
    }
}

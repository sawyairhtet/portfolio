/**
 * Notifications - Toast messages & GNOME 49 Notification Center
 */

/** @type {{ notifications: Array<{id: number, app: string, icon: string, title: string, body: string, time: Date}>, dnd: boolean, counter: number }} */
const ncState = {
    notifications: [],
    dnd: false,
    counter: 0,
};

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

    // Also add to notification center
    addNotification('System', icon, message, '');
}

/**
 * Add a notification to the center
 * @param {string} app - App group name
 * @param {string} icon - FontAwesome icon class
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 */
export function addNotification(app, icon, title, body) {
    if (ncState.dnd) {
        return;
    }

    ncState.counter++;
    ncState.notifications.unshift({
        id: ncState.counter,
        app,
        icon: icon || 'fa-bell',
        title,
        body,
        time: new Date(),
    });

    // Keep max 50 notifications
    if (ncState.notifications.length > 50) {
        ncState.notifications.pop();
    }

    renderNotificationList();
}

/**
 * Setup the notification center panel
 */
export function setupNotificationCenter() {
    if (document.getElementById('notification-center')) {
        return;
    }

    const panel = document.createElement('div');
    panel.id = 'notification-center';
    panel.className = 'notification-center';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Notification center');

    // Header
    const header = document.createElement('div');
    header.className = 'notification-header';

    const titleEl = document.createElement('span');
    titleEl.className = 'notification-header-title';
    titleEl.textContent = 'Notifications';

    const actions = document.createElement('div');
    actions.className = 'notification-header-actions';

    const dndBtn = document.createElement('button');
    dndBtn.className = 'dnd-toggle';
    dndBtn.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i> DND';
    dndBtn.addEventListener('click', () => {
        ncState.dnd = !ncState.dnd;
        dndBtn.classList.toggle('active', ncState.dnd);
        showToast(ncState.dnd ? 'Do Not Disturb on' : 'Do Not Disturb off', 'fa-moon');
    });

    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-all-btn';
    clearBtn.textContent = 'Clear all';
    clearBtn.addEventListener('click', () => {
        ncState.notifications = [];
        renderNotificationList();
    });

    actions.appendChild(dndBtn);
    actions.appendChild(clearBtn);
    header.appendChild(titleEl);
    header.appendChild(actions);

    // List container
    const list = document.createElement('div');
    list.className = 'notification-list';
    list.id = 'notification-list';

    panel.appendChild(header);
    panel.appendChild(list);
    document.body.appendChild(panel);

    renderNotificationList();

    // Toggle notification center on clock click
    const menuClock = /** @type {HTMLElement | null} */ (document.querySelector('.menu-clock'));
    if (menuClock) {
        menuClock.style.cursor = 'pointer';
        menuClock.addEventListener('click', () => {
            panel.classList.toggle('visible');
        });
    }

    // Close when clicking outside
    document.addEventListener('click', e => {
        const target = /** @type {HTMLElement} */ (e.target);
        if (
            panel.classList.contains('visible') &&
            !panel.contains(target) &&
            !target.closest('.menu-clock')
        ) {
            panel.classList.remove('visible');
        }
    });
}

function renderNotificationList() {
    const list = document.getElementById('notification-list');
    if (!list) {
        return;
    }

    list.innerHTML = '';

    if (ncState.notifications.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'notification-empty';
        empty.innerHTML =
            '<i class="fas fa-bell-slash" aria-hidden="true"></i>' +
            '<span>No notifications</span>';
        list.appendChild(empty);
        return;
    }

    // Group by app
    /** @type {Map<string, typeof ncState.notifications>} */
    const groups = new Map();
    ncState.notifications.forEach(n => {
        if (!groups.has(n.app)) {
            groups.set(n.app, []);
        }
        groups.get(n.app).push(n);
    });

    groups.forEach((items, appName) => {
        const group = document.createElement('div');
        group.className = 'notification-group';

        const groupHeader = document.createElement('div');
        groupHeader.className = 'notification-group-header';

        const nameEl = document.createElement('span');
        nameEl.className = 'notification-group-name';
        nameEl.textContent = appName;

        const countEl = document.createElement('span');
        countEl.className = 'notification-group-count';
        countEl.textContent = String(items.length);

        groupHeader.appendChild(nameEl);
        groupHeader.appendChild(countEl);

        // Toggle collapse
        groupHeader.addEventListener('click', () => {
            group.classList.toggle('collapsed');
        });

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'notification-group-items';

        items.forEach(n => {
            const item = document.createElement('div');
            item.className = 'notification-item';

            const iconDiv = document.createElement('div');
            iconDiv.className = 'notification-item-icon';
            const iconI = document.createElement('i');
            iconI.className = `fas ${n.icon}`;
            iconI.setAttribute('aria-hidden', 'true');
            iconDiv.appendChild(iconI);

            const content = document.createElement('div');
            content.className = 'notification-item-content';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'notification-item-title';
            titleDiv.textContent = n.title;

            content.appendChild(titleDiv);

            if (n.body) {
                const bodyDiv = document.createElement('div');
                bodyDiv.className = 'notification-item-body';
                bodyDiv.textContent = n.body;
                content.appendChild(bodyDiv);
            }

            const timeDiv = document.createElement('div');
            timeDiv.className = 'notification-item-time';
            timeDiv.textContent = formatTime(n.time);
            content.appendChild(timeDiv);

            const dismissBtn = document.createElement('button');
            dismissBtn.className = 'notification-item-dismiss';
            dismissBtn.setAttribute('aria-label', 'Dismiss');
            const dismissIcon = document.createElement('i');
            dismissIcon.className = 'fas fa-times';
            dismissIcon.setAttribute('aria-hidden', 'true');
            dismissBtn.appendChild(dismissIcon);
            dismissBtn.addEventListener('click', e => {
                e.stopPropagation();
                ncState.notifications = ncState.notifications.filter(x => x.id !== n.id);
                renderNotificationList();
            });

            item.appendChild(iconDiv);
            item.appendChild(content);
            item.appendChild(dismissBtn);
            itemsContainer.appendChild(item);
        });

        group.appendChild(groupHeader);
        group.appendChild(itemsContainer);
        list.appendChild(group);
    });
}

/** @param {Date} date */
function formatTime(date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
        return 'Just now';
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours}h ago`;
    }
    return date.toLocaleDateString();
}

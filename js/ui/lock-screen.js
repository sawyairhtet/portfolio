/**
 * Lock Screen - GNOME 49 Lock Screen
 * Blurred desktop overlay with clock and media card
 */

/** @type {{ isLocked: boolean, idleTimeout: number | null, idleDelay: number, lastActivity: number }} */
const lockState = {
    isLocked: false,
    idleTimeout: null,
    idleDelay: 5 * 60 * 1000, // 5 minutes
    lastActivity: Date.now(),
};

/** @type {number | null} */
let clockInterval = null;

/**
 * Initialize lock screen and idle detection
 */
export function setupLockScreen() {
    createLockScreenDOM();
    setupIdleDetection();
    setupManualLock();
}

function createLockScreenDOM() {
    // Don't recreate if already exists
    if (document.getElementById('lock-screen')) {
        return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'lock-screen';
    overlay.className = 'lock-screen';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Lock screen');

    overlay.innerHTML =
        '<div class="lock-screen-content">' +
            '<div class="lock-clock">' +
                '<div class="lock-time" id="lock-time"></div>' +
                '<div class="lock-date" id="lock-date"></div>' +
            '</div>' +
            '<div class="lock-media-card">' +
                '<div class="lock-media-icon"><i class="fas fa-music" aria-hidden="true"></i></div>' +
                '<div class="lock-media-info">' +
                    '<div class="lock-media-title">Lo-fi Focus Beats</div>' +
                    '<div class="lock-media-artist">Coding Radio</div>' +
                '</div>' +
                '<div class="lock-media-controls">' +
                    '<button class="lock-media-btn" aria-label="Previous"><i class="fas fa-step-backward" aria-hidden="true"></i></button>' +
                    '<button class="lock-media-btn lock-media-play" aria-label="Play"><i class="fas fa-play" aria-hidden="true"></i></button>' +
                    '<button class="lock-media-btn" aria-label="Next"><i class="fas fa-step-forward" aria-hidden="true"></i></button>' +
                '</div>' +
            '</div>' +
            '<div class="lock-unlock-hint">' +
                '<i class="fas fa-lock" aria-hidden="true"></i>' +
                '<span>Click or press any key to unlock</span>' +
            '</div>' +
        '</div>';

    document.body.appendChild(overlay);

    // Unlock on click or keypress
    overlay.addEventListener('click', unlock);
    overlay.addEventListener('keydown', e => {
        if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
            return;
        }
        unlock();
    });
}

/**
 * Lock the screen
 */
export function lock() {
    if (lockState.isLocked) {
        return;
    }

    lockState.isLocked = true;
    const overlay = document.getElementById('lock-screen');
    if (!overlay) {
        return;
    }

    updateLockClock();
    clockInterval = setInterval(updateLockClock, 1000);

    overlay.classList.add('visible');
    overlay.setAttribute('tabindex', '0');
    overlay.focus();
}

/**
 * Unlock the screen
 */
function unlock() {
    if (!lockState.isLocked) {
        return;
    }

    lockState.isLocked = false;
    lockState.lastActivity = Date.now();

    const overlay = document.getElementById('lock-screen');
    if (overlay) {
        overlay.classList.remove('visible');
        overlay.removeAttribute('tabindex');
    }

    if (clockInterval) {
        clearInterval(clockInterval);
        clockInterval = null;
    }
}

function updateLockClock() {
    const now = new Date();

    const timeEl = document.getElementById('lock-time');
    if (timeEl) {
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        timeEl.textContent = `${displayHours}:${minutes} ${ampm}`;
    }

    const dateEl = document.getElementById('lock-date');
    if (dateEl) {
        const options = /** @type {Intl.DateTimeFormatOptions} */ ({
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
}

function setupIdleDetection() {
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

    const resetIdle = () => {
        lockState.lastActivity = Date.now();
    };

    activityEvents.forEach(event => {
        document.addEventListener(event, resetIdle, { passive: true });
    });

    // Check for idle every 30 seconds
    setInterval(() => {
        if (lockState.isLocked) {
            return;
        }
        const elapsed = Date.now() - lockState.lastActivity;
        if (elapsed >= lockState.idleDelay) {
            lock();
        }
    }, 30000);
}

function setupManualLock() {
    // Super+L keyboard shortcut
    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
            e.preventDefault();
            lock();
        }
    });

    // Add lock option to system tray power button
    const powerBtn = document.querySelector('.status-menu .fa-power-off');
    if (powerBtn) {
        const parentBtn = powerBtn.closest('.status-menu');
        if (parentBtn) {
            parentBtn.addEventListener('click', () => {
                lock();
            });
        }
    }
}

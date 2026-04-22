/**
 * Portfolio Application - Main Entry Point
 * Coordinates all modules and initializes the application
 */

// Core modules
import SoundManager from './core/sound-manager.js';
import ThemeManager from './core/theme-manager.js';
import {
    openWindow,
    closeWindow,
    closeAllWindows,
    bringToFront,
    makeDraggable,
    makeResizable,
    setupWindowControls,
    getActiveWindows,
    getCurrentZIndex,
} from './core/window-manager.js';

// App modules
import { setupTerminal, setupTerminalMobileFix } from './apps/terminal.js';
import { setupFocusMode } from './apps/focus-mode.js';

// UI modules
import { setupContextMenu } from './ui/context-menu.js';
import { showToast, setupNotificationCenter } from './ui/notifications.js';
import { initMicroInteractions } from './ui/micro-interactions.js';
import { setupCommandPalette } from './ui/command-palette.js';
import { setupLockScreen } from './ui/lock-screen.js';
import { setupScreenshotTool } from './ui/screenshot-tool.js';


// Config
import { BOOT_LOG_MESSAGES, stickyNotesData } from './config/data.js';

// Track load time for uptime command
/** @type {any} */ (window).__portfolioLoadTime = Date.now();

// ============================================
// CONSTANTS
// ============================================

// Gesture thresholds for mobile swipe detection
const SWIPE_CLOSE_THRESHOLD_Y = 80; // Minimum vertical distance to close window
const SWIPE_CLOSE_MAX_X = 50; // Maximum horizontal deviation for vertical swipe
const SWIPE_SWITCH_THRESHOLD_X = 100; // Minimum horizontal distance to switch windows
const SWIPE_SWITCH_MAX_Y = 50; // Maximum vertical deviation for horizontal swipe

// Boot screen timing
const BOOT_LINE_INTERVAL_MS = 80;
const PLYMOUTH_DURATION_MS = 2000;

// ============================================
// STATE
// ============================================

let currentOS = 'desktop';

// ============================================
// DEVICE DETECTION
// ============================================

function detectOS() {
    const width = window.innerWidth;
    if (width <= 767) {
        return 'mobile';
    } else if (width <= 1024) {
        return 'tablet';
    } else {
        return 'desktop';
    }
}

function updateOS() {
    const newOS = detectOS();
    if (newOS !== currentOS) {
        currentOS = newOS;
        closeAllWindows();
    }
}

// ============================================
// APP ICONS & DOCK
// ============================================

function handleAppIconClick(appName) {
    if (!appName) {
        return;
    }

    const windowId = `${appName}-window`;
    const windowEl = document.getElementById(windowId);

    if (!windowEl) {
        return;
    }

    const activeWindows = getActiveWindows();

    if (activeWindows.has(windowId)) {
        const zIndex = parseInt(windowEl.style.zIndex || '0');

        if (zIndex === getCurrentZIndex()) {
            closeWindow(windowId);
        } else {
            openWindow(appName, currentOS);
        }
    } else {
        openWindow(appName, currentOS);
    }
}

function setupAppIcons() {
    const appIcons = document.querySelectorAll('.app-icon');
    appIcons.forEach(icon => {
        icon.addEventListener('click', e => {
            e.preventDefault();
            const appName = /** @type {HTMLElement} */ (icon).dataset.app;
            handleAppIconClick(appName);
        });
    });

    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const appName = /** @type {HTMLElement} */ (item).dataset.app;
            if (appName) {
                handleAppIconClick(appName);
            }
        });
    });
}

// ============================================
// MOBILE GESTURES
// ============================================

function setupMobileGestures() {
    if (currentOS === 'desktop') {
        return;
    }

    let touchStartY = 0;
    let touchStartX = 0;
    let currentWindowEl = null;

    document.querySelectorAll('.window-header').forEach(header => {
        header.addEventListener(
            'touchstart',
            e => {
                const te = /** @type {TouchEvent} */ (e);
                touchStartY = te.touches[0].clientY;
                touchStartX = te.touches[0].clientX;
                currentWindowEl = header.closest('.window');
            },
            { passive: true }
        );

        header.addEventListener(
            'touchend',
            e => {
                if (!currentWindowEl) {
                    return;
                }

                const te = /** @type {TouchEvent} */ (e);
                const touchEndY = te.changedTouches[0].clientY;
                const touchEndX = te.changedTouches[0].clientX;
                const diffY = touchEndY - touchStartY;
                const diffX = touchEndX - touchStartX;

                if (diffY > SWIPE_CLOSE_THRESHOLD_Y && Math.abs(diffX) < SWIPE_CLOSE_MAX_X) {
                    closeWindow(currentWindowEl.id);
                } else if (
                    Math.abs(diffX) > SWIPE_SWITCH_THRESHOLD_X &&
                    Math.abs(diffY) < SWIPE_SWITCH_MAX_Y
                ) {
                    const activeWindows = getActiveWindows();
                    const windowsArray = Array.from(activeWindows);
                    if (windowsArray.length <= 1) {
                        return;
                    }

                    const currentIndex = windowsArray.indexOf(currentWindowEl.id);
                    let newIndex;

                    if (diffX > 0) {
                        newIndex = currentIndex > 0 ? currentIndex - 1 : windowsArray.length - 1;
                    } else {
                        newIndex = currentIndex < windowsArray.length - 1 ? currentIndex + 1 : 0;
                    }

                    const nextWindowId = windowsArray[newIndex];
                    const nextWindowEl = document.getElementById(nextWindowId);
                    if (nextWindowEl) {
                        bringToFront(nextWindowEl);
                    }
                }

                currentWindowEl = null;
            },
            { passive: true }
        );
    });
}

// ============================================
// CLOCK
// ============================================

/** Update system clock in top bar — GNOME 49 format: Mon 12:00 */
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const day = now.toLocaleDateString('en-US', { weekday: 'short' });

    const menuClock = document.querySelector('.menu-clock');
    if (menuClock) {
        menuClock.textContent = `${day} ${hours}:${minutes}`;
    }

    const statusTime = document.querySelector('.status-time');
    if (statusTime) {
        statusTime.textContent = `${hours}:${minutes}`;
    }
}

/** Update focused app name in top bar (GNOME shows focused app name left of center) */
function updateFocusedAppName(appName) {
    const el = document.getElementById('focused-app-name');
    if (el) {
        const newText = appName ? appName.charAt(0).toUpperCase() + appName.slice(1) : '';
        if (el.textContent !== newText) {
            el.textContent = newText;
        }
    }
}

// ============================================
// BOOT SCREEN
// ============================================

function initBootScreen() {
    const bootScreen = document.getElementById('boot-screen');
    const bootLog = document.getElementById('boot-log');
    const plymouthSplash = document.getElementById('plymouth-splash');
    if (!bootScreen || !bootLog) {
        return;
    }

    let lineIndex = 0;
    let bootInterval = null;
    let isSkipped = false;

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReturningVisitor = localStorage.getItem('hasVisitedBefore');

    if (mediaQuery.matches || isReturningVisitor) {
        bootScreen.remove();
        localStorage.setItem('hasVisitedBefore', 'true');
        if (currentOS === 'desktop') {
            const aboutWin = document.getElementById('about-window');
            if (aboutWin) {
                aboutWin.style.top = '15%';
                aboutWin.style.left = '60px';
            }
            const contactWin = document.getElementById('contact-window');
            if (contactWin) {
                contactWin.style.top = '15%';
                contactWin.style.left = '700px';
            }
            openWindow('contact', currentOS);
        }
        openWindow('about', currentOS);
        return;
    }

    // Function to complete boot and show desktop
    function completeBoot() {
        if (isSkipped) {
            return;
        }
        isSkipped = true;

        if (bootInterval) {
            clearTimeout(bootInterval);
        }

        document.removeEventListener('keydown', skipBoot);
        bootScreen.removeEventListener('click', skipBoot);

        bootScreen.classList.add('fade-out');
        localStorage.setItem('hasVisitedBefore', 'true');
        setTimeout(() => {
            bootScreen.remove();

            if (currentOS === 'desktop') {
                const aboutWin = document.getElementById('about-window');
                if (aboutWin) {
                    aboutWin.style.top = '15%';
                    aboutWin.style.left = '60px';
                }
            }
            openWindow('about', currentOS);

            if (currentOS === 'desktop') {
                setTimeout(() => {
                    const contactWin = document.getElementById('contact-window');
                    if (contactWin) {
                        contactWin.style.top = '15%';
                        contactWin.style.left = '700px';
                    }
                    openWindow('contact', currentOS);
                }, 200);
            }

            // Show welcome notification after boot
            setTimeout(() => {
                showToast('Welcome to Fedora 43 Desktop', 'fa-fedora fab');
            }, 800);

            const playDrumOnce = () => {
                SoundManager.playStartupDrum();
                document.removeEventListener('click', playDrumOnce);
                document.removeEventListener('keydown', playDrumOnce);
            };
            document.addEventListener('click', playDrumOnce, { once: true });
            document.addEventListener('keydown', playDrumOnce, { once: true });
        }, 300);
    }

    function skipBoot(e) {
        if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
            return;
        }
        completeBoot();
    }

    document.addEventListener('keydown', skipBoot);
    bootScreen.addEventListener('click', skipBoot);

    // Phase 1: Plymouth splash (Fedora logo + spinner)
    // Phase 2: After PLYMOUTH_DURATION_MS, fade to text boot log
    function startTextBoot() {
        if (isSkipped) {
            return;
        }
        if (plymouthSplash) {
            plymouthSplash.classList.add('fade-out');
            setTimeout(() => {
                plymouthSplash.style.display = 'none';
                bootLog.style.display = '';
                addLine();
            }, 500);
        } else {
            bootLog.style.display = '';
            addLine();
        }
    }

    setTimeout(startTextBoot, PLYMOUTH_DURATION_MS);

    function addLine() {
        if (isSkipped) {
            return;
        }

        if (lineIndex < BOOT_LOG_MESSAGES.length) {
            const line = BOOT_LOG_MESSAGES[lineIndex];
            const lineEl = document.createElement('div');

            if (line.startsWith('[ OK ]')) {
                lineEl.innerHTML = '<span class="ok">[ OK ]</span>' + line.substring(6);
            } else if (line.startsWith('[')) {
                lineEl.innerHTML = '<span class="info">' + line + '</span>';
            } else {
                lineEl.textContent = line;
            }

            bootLog.appendChild(lineEl);
            bootLog.scrollTop = bootLog.scrollHeight;
            lineIndex++;
            bootInterval = setTimeout(addLine, BOOT_LINE_INTERVAL_MS);
        } else {
            setTimeout(completeBoot, 500);
        }
    }
}

// ============================================
// STICKY NOTES
// ============================================

// Generate stable key from note text (#27)
function getNoteKey(noteText) {
    return noteText.slice(0, 30).replace(/\s+/g, '_');
}

function createStickyNotes() {
    if (currentOS !== 'desktop') {
        return;
    }

    const container = document.getElementById('sticky-notes');
    if (!container) {
        return;
    }

    let savedPositions = {};
    try {
        savedPositions = JSON.parse(localStorage.getItem('stickyNotePositions_v3') || '{}');
    } catch (e) {
        console.error('Failed to load sticky note positions:', e);
        savedPositions = {};
    }

    stickyNotesData.forEach(note => {
        const noteEl = document.createElement('div');
        noteEl.className = `sticky-note ${note.color !== 'yellow' ? note.color : ''}`;
        noteEl.style.transform = `rotate(${note.rotation}deg)`;

        const noteKey = getNoteKey(note.text);
        const saved = savedPositions[noteKey];
        if (saved) {
            noteEl.style.top = saved.top;
            noteEl.style.left = saved.left;
            noteEl.style.right = 'auto';
        } else {
            noteEl.style.right = `${100 - note.x}%`;
            noteEl.style.top = `${note.y}%`;
        }

        noteEl.textContent = note.text;
        noteEl.setAttribute('data-note-key', noteKey);

        // Accessibility: add role, label, and tabindex for keyboard users
        noteEl.setAttribute('role', 'note');
        noteEl.setAttribute('tabindex', '0');
        const preview = note.text.substring(0, 50) + (note.text.length > 50 ? '...' : '');
        noteEl.setAttribute('aria-label', `Sticky note: ${preview}. Use arrow keys to move.`);

        makeStickyDraggable(noteEl);
        makeStickyKeyboardAccessible(noteEl);

        container.appendChild(noteEl);
    });
}

function makeStickyDraggable(element) {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    element.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        element.classList.add('dragging');
        element.style.zIndex = 999;

        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('mousemove', elementDrag);
    }

    function elementDrag(e) {
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        element.style.top = element.offsetTop - pos2 + 'px';
        element.style.left = element.offsetLeft - pos1 + 'px';
        element.style.right = 'auto';
    }

    function closeDragElement() {
        element.classList.remove('dragging');
        element.style.zIndex = 50;
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);

        // Use text-based key instead of numeric index (#27)
        const noteKey = element.getAttribute('data-note-key');
        if (noteKey) {
            const savedPositions = JSON.parse(
                localStorage.getItem('stickyNotePositions_v3') || '{}'
            );
            savedPositions[noteKey] = {
                top: element.style.top,
                left: element.style.left,
            };
            localStorage.setItem('stickyNotePositions_v3', JSON.stringify(savedPositions));
        }
    }
}

// Keyboard accessibility for sticky notes
function makeStickyKeyboardAccessible(element) {
    const MOVE_STEP = 10; // pixels to move per keypress

    element.addEventListener('keydown', e => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            return;
        }

        e.preventDefault();

        // Ensure element has computed position
        if (!element.style.left || element.style.left === 'auto') {
            element.style.left = element.offsetLeft + 'px';
        }
        if (!element.style.top) {
            element.style.top = element.offsetTop + 'px';
        }
        element.style.right = 'auto';

        const currentTop = parseInt(element.style.top) || 0;
        const currentLeft = parseInt(element.style.left) || 0;

        switch (e.key) {
            case 'ArrowUp':
                element.style.top = Math.max(0, currentTop - MOVE_STEP) + 'px';
                break;
            case 'ArrowDown':
                element.style.top =
                    Math.min(window.innerHeight - 100, currentTop + MOVE_STEP) + 'px';
                break;
            case 'ArrowLeft':
                element.style.left = Math.max(0, currentLeft - MOVE_STEP) + 'px';
                break;
            case 'ArrowRight':
                element.style.left =
                    Math.min(window.innerWidth - 100, currentLeft + MOVE_STEP) + 'px';
                break;
        }

        // Save position after keyboard move
        const noteKey = element.getAttribute('data-note-key');
        if (noteKey) {
            const savedPositions = JSON.parse(
                localStorage.getItem('stickyNotePositions_v3') || '{}'
            );
            savedPositions[noteKey] = {
                top: element.style.top,
                left: element.style.left,
            };
            localStorage.setItem('stickyNotePositions_v3', JSON.stringify(savedPositions));
        }
    });
}

// ============================================
// DOCK INTELLIHIDE
// ============================================

function setupDockIntellihide() {
    if (currentOS !== 'desktop') return;

    const dock = document.getElementById('dock');
    const trigger = document.getElementById('dock-trigger');
    if (!dock || !trigger) return;

    let hideTimeout = null;

    function showDock() {
        if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
        dock.classList.add('visible');
    }

    function scheduleDockHide() {
        hideTimeout = setTimeout(() => {
            dock.classList.remove('visible');
        }, 400);
    }

    trigger.addEventListener('mouseenter', showDock);
    dock.addEventListener('mouseenter', showDock);
    dock.addEventListener('mouseleave', scheduleDockHide);
    trigger.addEventListener('mouseleave', scheduleDockHide);
}

// ============================================
// PARALLAX WALLPAPER
// ============================================

function setupParallaxWallpaper() {
    if (currentOS !== 'desktop') {
        return;
    }

    const wallpaper = /** @type {HTMLElement} */ (document.querySelector('.wallpaper'));
    if (!wallpaper) {
        return;
    }

    let rafId = null;
    let idleTimeout = null;

    document.addEventListener('mousemove', e => {
        if (rafId) {
            return;
        }

        // Promote to GPU layer only while actively moving
        wallpaper.style.willChange = 'transform';
        if (idleTimeout) {
            clearTimeout(idleTimeout);
        }
        idleTimeout = setTimeout(() => {
            wallpaper.style.willChange = 'auto';
        }, 500);

        rafId = requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            wallpaper.style.setProperty('--mouse-x', x.toFixed(3));
            wallpaper.style.setProperty('--mouse-y', y.toFixed(3));

            rafId = null;
        });
    });
}

// ============================================
// NAVIGATION HINTS
// ============================================

function setupNavigationHint() {
    const navHint = document.getElementById('nav-hint');
    const dismissBtn = document.getElementById('nav-hint-dismiss');

    if (!navHint || !dismissBtn) {
        return;
    }

    const hasSeenHint = localStorage.getItem('hasSeenNavHint');

    if (!hasSeenHint && currentOS === 'desktop') {
        setTimeout(() => {
            navHint.classList.add('visible');
        }, 4000);
    }

    dismissBtn.addEventListener('click', () => {
        navHint.classList.remove('visible');
        localStorage.setItem('hasSeenNavHint', 'true');
    });

    document.querySelectorAll('.app-icon, .dock-item').forEach(el => {
        el.addEventListener(
            'click',
            () => {
                if (navHint.classList.contains('visible')) {
                    navHint.classList.remove('visible');
                    localStorage.setItem('hasSeenNavHint', 'true');
                }
            },
            { once: true }
        );
    });
}

function setupSwipeHint() {
    if (currentOS === 'desktop') {
        return;
    }

    const hasSeenSwipeHint = localStorage.getItem('hasSeenSwipeHint');
    if (hasSeenSwipeHint) {
        return;
    }

    const swipeHint = document.createElement('div');
    swipeHint.className = 'swipe-hint';
    swipeHint.innerHTML =
        '<i class="fas fa-hand-pointer"></i> Swipe down on window header to close';
    document.body.appendChild(swipeHint);

    let windowOpenCount = 0;

    document.querySelectorAll('.app-icon, .dock-item').forEach(el => {
        el.addEventListener(
            'click',
            () => {
                windowOpenCount++;
                if (windowOpenCount === 1 && !hasSeenSwipeHint) {
                    setTimeout(() => {
                        swipeHint.classList.add('visible');
                        setTimeout(() => {
                            swipeHint.classList.remove('visible');
                            localStorage.setItem('hasSeenSwipeHint', 'true');
                        }, 5000);
                    }, 1000);
                }
            },
            { once: true }
        );
    });
}

// ============================================
// SOUND TOGGLE
// ============================================

function setupSoundToggle() {
    const soundToggle = /** @type {HTMLInputElement} */ (document.getElementById('sound-toggle'));
    if (!soundToggle) {
        return;
    }

    soundToggle.checked = !SoundManager.isMuted();
    soundToggle.setAttribute('aria-checked', String(!SoundManager.isMuted()));

    soundToggle.addEventListener('change', () => {
        const isMuted = !soundToggle.checked;
        SoundManager.setMuted(isMuted);

        soundToggle.setAttribute('aria-checked', String(!isMuted));

        if (isMuted) {
            showToast('Sound effects muted', 'fa-volume-mute');
        } else {
            showToast('Sound effects enabled', 'fa-volume-up');
        }
    });
}

// ============================================
// CONTACT FORM (Formspree)
// ============================================

function setupContactForm() {
    const form = /** @type {HTMLFormElement | null} */ (document.getElementById('contact-form'));
    if (!form) {
        return;
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = /** @type {HTMLButtonElement} */ (document.getElementById('contact-submit-btn'));
        const status = document.getElementById('form-status');
        if (!btn || !status) {
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        status.textContent = '';
        status.className = 'form-status';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(/** @type {HTMLFormElement} */ (form)),
                headers: { Accept: 'application/json' },
            });

            if (response.ok) {
                status.textContent = 'Message sent! I\'ll get back to you soon.';
                status.classList.add('success');
                /** @type {HTMLFormElement} */ (form).reset();
                showToast('Message sent successfully!', 'fa-check-circle');
            } else {
                throw new Error('Form submission failed');
            }
        } catch {
            status.textContent = 'Oops! Something went wrong. Try emailing me directly.';
            status.classList.add('error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    });
}

// ============================================
// WALLPAPER TIME-OF-DAY
// ============================================

function setWallpaperByTime() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
        document.body.setAttribute('data-time', 'day');
    } else {
        document.body.setAttribute('data-time', 'night');
    }
}

// ============================================
// ACTIVITIES OVERVIEW (GNOME 49)
// ============================================

function setupActivities() {
    const activitiesBtn = document.getElementById('activities-btn');
    const overlay = document.getElementById('activities-overlay');
    const searchInput = /** @type {HTMLInputElement | null} */ (document.getElementById('activities-search-input'));
    const windowsContainer = document.getElementById('activities-windows');
    const appItems = document.querySelectorAll('.activities-app-item');

    if (!activitiesBtn || !overlay) {
        return;
    }

    let isOpen = false;

    function openActivities() {
        if (isOpen) {
            return;
        }
        isOpen = true;
        overlay.classList.add('visible');
        activitiesBtn.classList.add('active');
        updateWindowThumbnails();
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
    }

    function closeActivities() {
        if (!isOpen) {
            return;
        }
        isOpen = false;
        overlay.classList.remove('visible');
        activitiesBtn.classList.remove('active');
        if (searchInput) {
            searchInput.value = '';
            filterApps('');
        }
    }

    function toggleActivities() {
        if (isOpen) {
            closeActivities();
        } else {
            openActivities();
        }
    }

    // Build window thumbnails from currently open windows
    function updateWindowThumbnails() {
        if (!windowsContainer) {
            return;
        }
        windowsContainer.innerHTML = '';

        const activeWindows = getActiveWindows();
        if (activeWindows.size === 0) {
            const noWin = document.createElement('div');
            noWin.className = 'activities-no-windows';
            noWin.textContent = 'No open windows';
            windowsContainer.appendChild(noWin);
            return;
        }

        activeWindows.forEach(winId => {
            const winEl = document.getElementById(winId);
            if (!winEl) {
                return;
            }
            const appName = winEl.dataset.app || '';
            const title = winEl.querySelector('.window-title');
            const titleText = title ? title.textContent : appName;

            // Get the icon from the dock item for this app
            const dockItem = document.querySelector(`.dock-item[data-app="${appName}"] i`);
            const iconClass = dockItem ? dockItem.className : 'fas fa-window-maximize';

            const thumb = document.createElement('div');
            thumb.className = 'activities-window-thumb';
            thumb.setAttribute('role', 'button');
            thumb.setAttribute('aria-label', `Switch to ${titleText}`);

            const header = document.createElement('div');
            header.className = 'activities-thumb-header';
            header.textContent = titleText;

            const body = document.createElement('div');
            body.className = 'activities-thumb-body';
            const icon = document.createElement('i');
            icon.className = iconClass;
            body.appendChild(icon);

            const closeBtn = document.createElement('button');
            closeBtn.className = 'activities-thumb-close';
            closeBtn.setAttribute('aria-label', `Close ${titleText}`);
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';

            closeBtn.addEventListener('click', e => {
                e.stopPropagation();
                closeWindow(winId);
                updateWindowThumbnails();
            });

            thumb.addEventListener('click', () => {
                bringToFront(winEl);
                closeActivities();
            });

            thumb.appendChild(closeBtn);
            thumb.appendChild(header);
            thumb.appendChild(body);
            windowsContainer.appendChild(thumb);
        });
    }

    // Filter apps by search
    function filterApps(query) {
        const q = query.toLowerCase().trim();
        appItems.forEach(item => {
            const label = item.querySelector('.activities-app-label');
            const name = label ? label.textContent.toLowerCase() : '';
            if (q === '' || name.includes(q)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    // Event listeners
    activitiesBtn.addEventListener('click', toggleActivities);

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isOpen) {
            closeActivities();
        }
    });

    // Close when clicking overlay background (not children)
    overlay.addEventListener('click', e => {
        if (e.target === overlay) {
            closeActivities();
        }
    });

    // Search filtering
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filterApps(searchInput.value);
        });
    }

    // App grid items in Activities
    appItems.forEach(item => {
        item.addEventListener('click', () => {
            const appName = /** @type {HTMLElement} */ (item).dataset.app;
            if (appName) {
                closeActivities();
                handleAppIconClick(appName);
            }
        });
    });

    // Hot corner: move mouse to top-left to trigger Activities
    let hotCornerTimeout = null;
    document.addEventListener('mousemove', e => {
        if (e.clientX <= 1 && e.clientY <= 1) {
            if (!hotCornerTimeout) {
                hotCornerTimeout = setTimeout(() => {
                    if (!isOpen) {
                        openActivities();
                    }
                    hotCornerTimeout = null;
                }, 200);
            }
        } else if (hotCornerTimeout) {
            clearTimeout(hotCornerTimeout);
            hotCornerTimeout = null;
        }
    });
}

// ============================================
// WALLPAPER CUSTOMIZATION
// ============================================

const WALLPAPERS = [
    { id: 'default', label: 'Fedora 43 (Time)', gradient: null },
    { id: 'adwaita-dark', label: 'Adwaita Dark', gradient: 'linear-gradient(135deg, #242424 0%, #303030 50%, #242424 100%)' },
    { id: 'gnome-blobs', label: 'GNOME Blobs', gradient: 'radial-gradient(ellipse at 20% 50%, #3584e4 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #9141ac 0%, transparent 40%), radial-gradient(ellipse at 70% 80%, #2ec27e 0%, transparent 45%), linear-gradient(135deg, #242424 0%, #303030 100%)' },
    { id: 'fedora-dark', label: 'Fedora Dark', gradient: 'linear-gradient(160deg, #0d1b2a 0%, #1b2838 30%, #303030 60%, #242424 100%)' },
    { id: 'aurora', label: 'Aurora', gradient: 'linear-gradient(135deg, #0d2137 0%, #9141ac 40%, #3584e4 70%, #2ec27e 100%)' },
    { id: 'ocean', label: 'Ocean Blue', gradient: 'linear-gradient(135deg, #0c3547 0%, #1a6b8a 50%, #11998e 100%)' },
    { id: 'midnight', label: 'Midnight', gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
];

function setupSettingsPanel() {
    // ── Sidebar navigation ──
    const navItems = document.querySelectorAll('.settings-nav-item');
    const panels = document.querySelectorAll('.settings-panel');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const panelId = /** @type {HTMLElement} */ (item).dataset.panel;
            navItems.forEach(n => n.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            item.classList.add('active');
            const target = document.getElementById(`settings-panel-${panelId}`);
            if (target) {
                target.classList.add('active');
            }
        });
    });

    // ── Wallpaper grid ──
    const wallpaperGrid = document.getElementById('wallpaper-grid');
    if (wallpaperGrid) {
        WALLPAPERS.forEach(w => {
            const btn = document.createElement('button');
            btn.className = 'wallpaper-option';
            btn.dataset.wallpaper = w.id;
            btn.setAttribute('aria-label', w.label);
            btn.setAttribute('title', w.label);

            if (w.gradient) {
                btn.style.background = w.gradient;
            } else {
                // Default Fedora 43 time-based wallpaper preview
                btn.style.background = 'var(--gradient-wallpaper)';
            }

            btn.addEventListener('click', () => {
                applyWallpaper(w);
                localStorage.setItem('portfolioWallpaper', w.id);
                showToast(`Wallpaper: ${w.label}`, 'fa-image');
                wallpaperGrid.querySelectorAll('.wallpaper-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
            wallpaperGrid.appendChild(btn);
        });

        // Load saved wallpaper
        const savedWallpaper = localStorage.getItem('portfolioWallpaper');
        if (savedWallpaper) {
            const wp = WALLPAPERS.find(w => w.id === savedWallpaper);
            if (wp) {
                applyWallpaper(wp);
            }
        }

        const currentId = savedWallpaper || 'default';
        const activeBtn = wallpaperGrid.querySelector(`[data-wallpaper="${currentId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // ── Accent color picker ──
    const accentOptions = document.getElementById('accent-color-options');
    if (accentOptions) {
        const savedAccent = localStorage.getItem('portfolioAccent');
        if (savedAccent) {
            document.documentElement.style.setProperty('--fedora-blue', savedAccent);
            document.documentElement.style.setProperty('--color-primary', savedAccent);
        }

        accentOptions.querySelectorAll('.accent-swatch').forEach(swatch => {
            // Mark saved as active
            if (savedAccent && /** @type {HTMLElement} */ (swatch).dataset.accent === savedAccent) {
                accentOptions.querySelectorAll('.accent-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
            }

            swatch.addEventListener('click', () => {
                const color = /** @type {HTMLElement} */ (swatch).dataset.accent;
                if (!color) {
                    return;
                }
                document.documentElement.style.setProperty('--fedora-blue', color);
                document.documentElement.style.setProperty('--color-primary', color);
                localStorage.setItem('portfolioAccent', color);
                accentOptions.querySelectorAll('.accent-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                showToast('Accent color updated', 'fa-palette');
            });
        });
    }

    // ── Window Buttons toggle (GNOME Tweaks) ──
    const windowBtnsToggle = /** @type {HTMLInputElement | null} */ (document.getElementById('show-window-buttons'));
    if (windowBtnsToggle) {
        const savedWB = localStorage.getItem('showWindowButtons') === 'true';
        windowBtnsToggle.checked = savedWB;
        if (savedWB) document.body.classList.add('show-window-buttons');

        windowBtnsToggle.addEventListener('change', () => {
            document.body.classList.toggle('show-window-buttons', windowBtnsToggle.checked);
            localStorage.setItem('showWindowButtons', String(windowBtnsToggle.checked));
            showToast(windowBtnsToggle.checked ? 'Window buttons enabled' : 'Window buttons hidden', 'fa-window-maximize');
        });
    }

    // ── Dock visibility toggle ──
    const dockToggle = /** @type {HTMLInputElement | null} */ (document.getElementById('show-dock-toggle'));
    if (dockToggle) {
        const savedDock = localStorage.getItem('showDock') === 'true';
        dockToggle.checked = savedDock;
        if (savedDock) document.body.classList.add('show-dock');

        dockToggle.addEventListener('change', () => {
            document.body.classList.toggle('show-dock', dockToggle.checked);
            localStorage.setItem('showDock', String(dockToggle.checked));
            showToast(dockToggle.checked ? 'Dock always visible' : 'Dock auto-hides', 'fa-grip-lines-vertical');
        });
    }

    // ── Dark mode toggle ──
    const themeToggle = /** @type {HTMLInputElement | null} */ (document.getElementById('theme-toggle'));
    if (themeToggle) {
        // Sync with actual attribute (respects HTML default + localStorage)
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeToggle.checked = isDark;

        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                showToast('Dark mode enabled', 'fa-moon');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                showToast('Light mode enabled', 'fa-sun');
            }
        });
    }
}

function applyWallpaper(wp) {
    const wallpaperEl = document.querySelector('.wallpaper');
    if (!wallpaperEl) {
        return;
    }

    if (wp.gradient) {
        // Custom gradient wallpaper — override time-based images
        wallpaperEl.classList.add('custom-wallpaper');
        /** @type {HTMLElement} */ (wallpaperEl).style.setProperty('--custom-wallpaper-bg', wp.gradient);
    } else {
        // Default: restore Fedora 43 time-based wallpaper
        wallpaperEl.classList.remove('custom-wallpaper');
        /** @type {HTMLElement} */ (wallpaperEl).style.removeProperty('--custom-wallpaper-bg');
    }
}

// ============================================
// SKILL BAR ANIMATION
// ============================================

function setupSkillBarAnimation() {
    // Use IntersectionObserver to animate bars when visible
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-progress-bar').forEach(bar => {
        observer.observe(bar);
    });
}


// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Boot sequence
    initBootScreen();

    // Detect initial OS
    updateOS();

    // Initialize theme
    ThemeManager.init();
    ThemeManager.setupListeners();

    // Setup all interactions
    setupAppIcons();
    setupWindowControls();
    setupTerminal();
    setupTerminalMobileFix();
    setupSoundToggle();
    setupContextMenu(currentOS);
    setupMobileGestures();

    // Setup dock intellihide (desktop only)
    setupDockIntellihide();

    // Create sticky notes (desktop only)
    createStickyNotes();

    // Setup parallax wallpaper effect (desktop only)
    setupParallaxWallpaper();

    // Setup navigation hints
    setupNavigationHint();
    setupSwipeHint();

    // Initialize micro-interactions
    initMicroInteractions();

    // Initialize command palette (Ctrl+K)
    setupCommandPalette();

    // Setup contact form
    setupContactForm();

    // Set wallpaper based on time of day (6am–5:59pm = day, else night)
    setWallpaperByTime();

    // Setup wallpaper customization (new Settings panel)
    setupSettingsPanel();

    // Animate skill progress bars when skills window opens
    setupSkillBarAnimation();

    // GNOME 49 Activities overview
    setupActivities();

    // Phase 2 — GNOME 49 Features
    setupFocusMode();
    setupLockScreen();
    setupScreenshotTool();
    setupNotificationCenter();

    // Mark all Font Awesome icons as decorative for screen readers
    document.querySelectorAll('.fas, .fab, .far').forEach(icon => {
        icon.setAttribute('aria-hidden', 'true');
    });

    // Make all windows draggable and resizable
    document.querySelectorAll('.window').forEach(win => {
        const windowEl = /** @type {HTMLElement} */ (win);
        makeDraggable(windowEl, currentOS);
        makeResizable(windowEl, currentOS);

        windowEl.addEventListener('mousedown', () => {
            bringToFront(windowEl);
            updateFocusedAppName(windowEl.dataset.app || '');
        });
    });

    // Update focused app name when windows open/close
    const docObserver = new MutationObserver((mutations) => {
        // Ignore mutations that are only from the parallax wallpaper to prevent CPU drain
        const isOnlyWallpaper = mutations.every(m => 
            m.target && m.target.classList && m.target.classList.contains('wallpaper')
        );
        if (isOnlyWallpaper) return;

        // Find topmost visible window
        let topWindow = /** @type {HTMLElement | null} */ (null);
        let maxZ = -1;
        getActiveWindows().forEach(id => {
            const el = document.getElementById(id);
            if (el && el.style.display !== 'none') {
                const z = parseInt(el.style.zIndex || '0');
                if (z > maxZ) { maxZ = z; topWindow = el; }
            }
        });
        updateFocusedAppName(topWindow ? (topWindow.dataset.app || '') : '');
    });
    docObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    // Update clock - only needs 60s interval since we display hours:minutes only
    updateClock();
    const clockIntervalId = setInterval(updateClock, 60000);

    // Clear interval on page unload for code hygiene (#49)
    window.addEventListener('beforeunload', () => {
        clearInterval(clockIntervalId);
    });

    // Listen for window resize (debounced to avoid excessive closeAllWindows calls)
    let resizeTimeout = null;
    window.addEventListener('resize', () => {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(() => {
            updateOS();
            resizeTimeout = null;
        }, 300);
    });
});

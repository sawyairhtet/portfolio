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
    updateDockActiveStates,
    makeDraggable,
    makeResizable,
    setupWindowControls,
    getActiveWindows,
    getCurrentZIndex
} from './core/window-manager.js';

// App modules
import { setupTerminal, setupTerminalMobileFix } from './apps/terminal.js';

// UI modules
import { setupContextMenu } from './ui/context-menu.js';
import { showToast } from './ui/notifications.js';

// Config
import { BOOT_LOG_MESSAGES, stickyNotesData } from './config/data.js';

// ============================================
// CONSTANTS
// ============================================

// Gesture thresholds for mobile swipe detection
const SWIPE_CLOSE_THRESHOLD_Y = 80;  // Minimum vertical distance to close window
const SWIPE_CLOSE_MAX_X = 50;        // Maximum horizontal deviation for vertical swipe
const SWIPE_SWITCH_THRESHOLD_X = 100; // Minimum horizontal distance to switch windows
const SWIPE_SWITCH_MAX_Y = 50;        // Maximum vertical deviation for horizontal swipe

// Boot screen timing
const BOOT_LINE_INTERVAL_MS = 80;
const BOOT_FADE_DELAY_MS = 500;

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
    if (!appName) return;

    const windowId = `${appName}-window`;
    const windowEl = document.getElementById(windowId);

    if (!windowEl) return;

    const activeWindows = getActiveWindows();
    
    if (activeWindows.has(windowId)) {
        const zIndex = parseInt(windowEl.style.zIndex || 0);
        
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
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const appName = icon.dataset.app;
            handleAppIconClick(appName);
        });
    });

    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const appName = item.dataset.app;
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
    if (currentOS === 'desktop') return;

    let touchStartY = 0;
    let touchStartX = 0;
    let currentWindowEl = null;

    document.querySelectorAll('.window-header').forEach(header => {
        header.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            currentWindowEl = header.closest('.window');
        }, { passive: true });

        header.addEventListener('touchend', (e) => {
            if (!currentWindowEl) return;

            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const diffY = touchEndY - touchStartY;
            const diffX = touchEndX - touchStartX;

            if (diffY > SWIPE_CLOSE_THRESHOLD_Y && Math.abs(diffX) < SWIPE_CLOSE_MAX_X) {
                closeWindow(currentWindowEl.id);
            }
            else if (Math.abs(diffX) > SWIPE_SWITCH_THRESHOLD_X && Math.abs(diffY) < SWIPE_SWITCH_MAX_Y) {
                const activeWindows = getActiveWindows();
                const windowsArray = Array.from(activeWindows);
                if (windowsArray.length <= 1) return;

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
        }, { passive: true });
    });
}

// ============================================
// CLOCK
// ============================================

/** Update system clock in top bar. NOTE: DUPLICATED in 404.html (standalone page) */
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    const menuClock = document.querySelector('.menu-clock');
    if (menuClock) {
        menuClock.textContent = `${displayHours}:${minutes} ${ampm}`;
    }

    const statusTime = document.querySelector('.status-time');
    if (statusTime) {
        statusTime.textContent = `${displayHours}:${minutes}`;
    }
}

// ============================================
// BOOT SCREEN
// ============================================

function initBootScreen() {
    const bootScreen = document.getElementById('boot-screen');
    const bootLog = document.getElementById('boot-log');
    if (!bootScreen || !bootLog) return;

    let lineIndex = 0;
    let bootInterval = null;
    let isSkipped = false;

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
        bootScreen.remove();
        // Immediately open default windows
        if (currentOS === 'desktop') {
             const aboutWin = document.getElementById('about-window');
             if (aboutWin) {
                 aboutWin.style.top = '15%';
                 aboutWin.style.left = '120px';
             }
             const contactWin = document.getElementById('contact-window');
             if (contactWin) {
                 contactWin.style.top = '15%';
                 contactWin.style.left = '750px';
             }
             openWindow('contact', currentOS);
        }
        openWindow('about', currentOS);
        return;
    }

    // Function to complete boot and show desktop
    function completeBoot() {
        if (isSkipped) return;
        isSkipped = true;
        
        // Clear any pending interval
        if (bootInterval) {
            clearTimeout(bootInterval);
        }
        
        // Remove skip listeners
        document.removeEventListener('keydown', skipBoot);
        bootScreen.removeEventListener('click', skipBoot);
        
        bootScreen.classList.add('fade-out');
        setTimeout(() => {
            bootScreen.remove();
            
            // Open About Window - Positioned Left
            if (currentOS === 'desktop') {
                const aboutWin = document.getElementById('about-window');
                if (aboutWin) {
                    aboutWin.style.top = '15%';
                    aboutWin.style.left = '120px';
                }
            }
            openWindow('about', currentOS);
            
            if (currentOS === 'desktop') {
                // Open Contact Window - Positioned Right
                setTimeout(() => {
                    const contactWin = document.getElementById('contact-window');
                    if (contactWin) {
                        contactWin.style.top = '15%';
                        contactWin.style.left = '750px';
                    }
                    openWindow('contact', currentOS);
                }, 200);
            }
            
            // Defer startup drum to first user gesture to comply with autoplay policy (#24)
            const playDrumOnce = () => {
                SoundManager.playStartupDrum();
                document.removeEventListener('click', playDrumOnce);
                document.removeEventListener('keydown', playDrumOnce);
            };
            document.addEventListener('click', playDrumOnce, { once: true });
            document.addEventListener('keydown', playDrumOnce, { once: true });
        }, 300);
    }

    // Skip handler for key press or click
    function skipBoot(e) {
        // Ignore modifier keys alone
        if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
            return;
        }
        completeBoot();
    }

    // Add skip listeners
    document.addEventListener('keydown', skipBoot);
    bootScreen.addEventListener('click', skipBoot);

    function addLine() {
        if (isSkipped) return;
        
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

    addLine();
}

// ============================================
// STICKY NOTES
// ============================================

// Generate stable key from note text (#27)
function getNoteKey(noteText) {
    return noteText.slice(0, 30).replace(/\s+/g, '_');
}

function createStickyNotes() {
    if (currentOS !== 'desktop') return;

    const container = document.getElementById('sticky-notes');
    if (!container) return;

    let savedPositions = {};
    try {
        savedPositions = JSON.parse(localStorage.getItem('stickyNotePositions_v3') || '{}');
    } catch (e) {
        console.error('Failed to load sticky note positions:', e);
        savedPositions = {};
    }

    stickyNotesData.forEach((note) => {
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
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

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
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
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
            const savedPositions = JSON.parse(localStorage.getItem('stickyNotePositions_v3') || '{}');
            savedPositions[noteKey] = {
                top: element.style.top,
                left: element.style.left
            };
            localStorage.setItem('stickyNotePositions_v3', JSON.stringify(savedPositions));
        }
    }
}

// Keyboard accessibility for sticky notes
function makeStickyKeyboardAccessible(element) {
    const MOVE_STEP = 10; // pixels to move per keypress
    
    element.addEventListener('keydown', (e) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
        
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
                element.style.top = Math.min(window.innerHeight - 100, currentTop + MOVE_STEP) + 'px';
                break;
            case 'ArrowLeft':
                element.style.left = Math.max(0, currentLeft - MOVE_STEP) + 'px';
                break;
            case 'ArrowRight':
                element.style.left = Math.min(window.innerWidth - 100, currentLeft + MOVE_STEP) + 'px';
                break;
        }
        
        // Save position after keyboard move
        const noteKey = element.getAttribute('data-note-key');
        if (noteKey) {
            const savedPositions = JSON.parse(localStorage.getItem('stickyNotePositions_v3') || '{}');
            savedPositions[noteKey] = {
                top: element.style.top,
                left: element.style.left
            };
            localStorage.setItem('stickyNotePositions_v3', JSON.stringify(savedPositions));
        }
    });
}

// ============================================
// PARALLAX WALLPAPER
// ============================================

function setupParallaxWallpaper() {
    if (currentOS !== 'desktop') return;
    
    const wallpaper = document.querySelector('.wallpaper');
    if (!wallpaper) return;
    
    let rafId = null;
    
    document.addEventListener('mousemove', (e) => {
        if (rafId) return;
        
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
    
    if (!navHint || !dismissBtn) return;
    
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
        el.addEventListener('click', () => {
            if (navHint.classList.contains('visible')) {
                navHint.classList.remove('visible');
                localStorage.setItem('hasSeenNavHint', 'true');
            }
        }, { once: true });
    });
}

function setupSwipeHint() {
    if (currentOS === 'desktop') return;
    
    const hasSeenSwipeHint = localStorage.getItem('hasSeenSwipeHint');
    if (hasSeenSwipeHint) return;
    
    const swipeHint = document.createElement('div');
    swipeHint.className = 'swipe-hint';
    swipeHint.innerHTML = '<i class="fas fa-hand-pointer"></i> Swipe down on window header to close';
    document.body.appendChild(swipeHint);
    
    let windowOpenCount = 0;
    
    document.querySelectorAll('.app-icon, .dock-item').forEach(el => {
        el.addEventListener('click', () => {
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
        }, { once: true });
    });
}

// ============================================
// SOUND TOGGLE
// ============================================

function setupSoundToggle() {
    const soundToggle = document.getElementById('sound-toggle');
    if (!soundToggle) return;

    soundToggle.checked = !SoundManager.isMuted();
    soundToggle.setAttribute('aria-pressed', !SoundManager.isMuted());

    soundToggle.addEventListener('change', () => {
        const isMuted = !soundToggle.checked;
        SoundManager.setMuted(isMuted);
        
        soundToggle.setAttribute('aria-pressed', !isMuted);
        
        if (isMuted) {
            showToast('Sound effects muted', 'fa-volume-mute');
        } else {
            showToast('Sound effects enabled', 'fa-volume-up');
        }
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

    // Create sticky notes (desktop only)
    createStickyNotes();

    // Setup parallax wallpaper effect (desktop only)
    setupParallaxWallpaper();
    
    // Setup navigation hints
    setupNavigationHint();
    setupSwipeHint();
    
    // Make all windows draggable and resizable
    document.querySelectorAll('.window').forEach(win => {
        makeDraggable(win, currentOS);
        makeResizable(win, currentOS);

        win.addEventListener('mousedown', () => {
            bringToFront(win);
        });
    });

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

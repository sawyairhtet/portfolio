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
import { injectDialogStyles } from './ui/dialog.js';
import { showToast } from './ui/notifications.js';

// Config
import { BOOT_LOG_MESSAGES, stickyNotesData } from './config/data.js';

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
        console.log(`OS changed to: ${currentOS}`);
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

            if (diffY > 80 && Math.abs(diffX) < 50) {
                closeWindow(currentWindowEl.id);
            }
            else if (Math.abs(diffX) > 100 && Math.abs(diffY) < 50) {
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
    const interval = 80;

    function addLine() {
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
            setTimeout(addLine, interval);
        } else {
            setTimeout(() => {
                bootScreen.classList.add('fade-out');
                setTimeout(() => {
                    bootScreen.remove();
                    openWindow('about', currentOS);
                    SoundManager.playStartupDrum();
                }, 500);
            }, 500);
        }
    }

    addLine();
}

// ============================================
// STICKY NOTES
// ============================================

function createStickyNotes() {
    if (currentOS !== 'desktop') return;

    const container = document.getElementById('sticky-notes');
    if (!container) return;

    let savedPositions = {};
    try {
        savedPositions = JSON.parse(localStorage.getItem('stickyNotePositions_v2') || '{}');
    } catch (e) {
        console.error('Failed to load sticky note positions:', e);
        savedPositions = {};
    }

    stickyNotesData.forEach((note, index) => {
        const noteEl = document.createElement('div');
        noteEl.className = `sticky-note ${note.color !== 'yellow' ? note.color : ''}`;
        noteEl.style.transform = `rotate(${note.rotation}deg)`;

        const saved = savedPositions[index];
        if (saved) {
            noteEl.style.top = saved.top;
            noteEl.style.left = saved.left;
            noteEl.style.right = 'auto';
        } else {
            noteEl.style.right = `${100 - note.x}%`;
            noteEl.style.top = `${note.y}%`;
        }

        noteEl.textContent = note.text;
        noteEl.setAttribute('data-note-index', index);

        makeStickyDraggable(noteEl);

        container.appendChild(noteEl);
    });
}

function makeStickyDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        element.classList.add('dragging');
        element.style.zIndex = 999;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
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
        document.onmouseup = null;
        document.onmousemove = null;

        const noteIndex = element.getAttribute('data-note-index');
        if (noteIndex !== null) {
            const savedPositions = JSON.parse(localStorage.getItem('stickyNotePositions_v2') || '{}');
            savedPositions[noteIndex] = {
                top: element.style.top,
                left: element.style.left
            };
            localStorage.setItem('stickyNotePositions_v2', JSON.stringify(savedPositions));
        }
    }
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
    soundToggle.setAttribute('aria-expanded', !SoundManager.isMuted());

    soundToggle.addEventListener('change', () => {
        const isMuted = !soundToggle.checked;
        SoundManager.setMuted(isMuted);
        
        soundToggle.setAttribute('aria-expanded', !isMuted);
        
        if (isMuted) {
            showToast('Sound effects muted', 'fa-volume-mute');
        } else {
            showToast('Sound effects enabled', 'fa-volume-up');
        }
    });
}

// ============================================
// ANIMATIONS
// ============================================

function injectAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Boot sequence
    initBootScreen();

    // Detect initial OS
    updateOS();

    // Inject styles
    injectAnimations();
    injectDialogStyles();

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

    // Update clock
    updateClock();
    setInterval(updateClock, 1000);

    // Listen for window resize
    window.addEventListener('resize', () => {
        updateOS();
    });
});

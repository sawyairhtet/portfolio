/**
 * Window Manager
 * Handles opening, closing, dragging, resizing, and snapping windows
 */

import SoundManager from './sound-manager.js';

// State
let currentZIndex = 1100;
let activeWindows = new Set();
const windowSnapState = new Map();
const minimizedWindows = new Map();
let lastFocusedElement = null; // Track element that opened window for focus restoration
let currentFocusTrap = null; // Track active focus trap handler
let cascadeCounter = 0; // Static counter for window cascade positioning (#22)

// Cache CSS variable to avoid reading on every drag call (#20)
let cachedDockWidth = 60;
function updateCachedDockWidth() {
    cachedDockWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dock-width')) || 60;
}
// Update on load and resize
if (typeof window !== 'undefined') {
    updateCachedDockWidth();
    window.addEventListener('resize', updateCachedDockWidth);
}

// Getters for external access
export function getActiveWindows() {
    return activeWindows;
}

export function getCurrentZIndex() {
    return currentZIndex;
}

// ============================================
// WINDOW OPERATIONS
// ============================================

function updateAriaModal() {
    const activeIds = Array.from(activeWindows);
    const backgroundElements = document.querySelectorAll('.main-content, .dock, .top-bar');
    
    // Hide/show background elements from screen readers
    if (activeIds.length === 0) {
        backgroundElements.forEach(el => el.removeAttribute('aria-hidden'));
        return;
    }
    
    // Hide background when any window is open
    backgroundElements.forEach(el => el.setAttribute('aria-hidden', 'true'));

    // Find window with highest Z-index
    let topWindow = null;
    let maxZ = -1;

    activeIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.removeAttribute('aria-modal');
            el.setAttribute('aria-hidden', 'true'); // Hide others from screen readers
            const z = parseInt(el.style.zIndex || 0);
            if (z > maxZ) {
                maxZ = z;
                topWindow = el;
            }
        }
    });

    if (topWindow) {
        topWindow.setAttribute('aria-modal', 'true');
        topWindow.removeAttribute('aria-hidden');
    }
}

export function openWindow(appName, currentOS = 'desktop') {
    const windowId = `${appName}-window`;
    const windowEl = document.getElementById(windowId);

    if (!windowEl) return;

    if (activeWindows.has(windowId)) {
        bringToFront(windowEl);
        return;
    }

    // Store element that triggered the open for focus restoration
    lastFocusedElement = document.activeElement;

    windowEl.style.display = 'flex';
    activeWindows.add(windowId);
    bringToFront(windowEl);
    
    // Apply cascade offset for desktop (only for new windows, use static counter #22)
    if (currentOS === 'desktop' && !windowEl.style.top) {
        cascadeCounter++;
        const cascadeOffset = (cascadeCounter % 10) * 25; // Reset after 10 to prevent going too far
        const randomX = Math.floor(Math.random() * 30) - 15;
        const randomY = Math.floor(Math.random() * 20) - 10;
        windowEl.style.top = `calc(15% + ${cascadeOffset + randomY}px)`;
        windowEl.style.left = `calc(var(--dock-width) + 10% + ${cascadeOffset + randomX}px)`;
    }

    SoundManager.playClick();
    updateDockActiveStates();

    windowEl.classList.remove('closing');
    windowEl.classList.add('opening');

    setTimeout(() => {
        windowEl.classList.remove('opening');
    }, 400);

    // Setup focus trap and auto-focus
    setTimeout(() => {
        setupFocusTrap(windowEl);
        // Focus first focusable element or terminal input
        if (appName === 'terminal') {
            const terminalInput = document.getElementById('terminal-input');
            if (terminalInput) terminalInput.focus();
        } else {
            const firstFocusable = getFocusableElements(windowEl)[0];
            if (firstFocusable) firstFocusable.focus();
        }
    }, 100);
}

export function closeWindow(windowId) {
    const windowEl = document.getElementById(windowId);
    if (!windowEl) return;

    SoundManager.playWhoosh();
    
    // Remove focus trap
    removeFocusTrap();

    windowEl.classList.remove('opening');
    windowEl.classList.add('closing');

    setTimeout(() => {
        windowEl.style.display = 'none';
        windowEl.classList.remove('closing');
        activeWindows.delete(windowId);
        
        // Clean up snap and minimize state (#23)
        windowSnapState.delete(windowId);
        minimizedWindows.delete(windowId);
        
        updateDockActiveStates();
        updateAriaModal(); // Update modal state after closing
        
        // Restore focus to element that opened the window
        if (activeWindows.size === 0 && lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }, 250);
}

export function closeAllWindows() {
    activeWindows.forEach(windowId => {
        closeWindow(windowId);
    });
}

export function bringToFront(element) {
    currentZIndex++;
    element.style.zIndex = currentZIndex;
    updateAriaModal(); // Update modal state when focus changes
}

export function minimizeWindow(windowId) {
    const windowEl = document.getElementById(windowId);
    if (!windowEl) return;

    SoundManager.playWhoosh();

    minimizedWindows.set(windowId, {
        top: windowEl.style.top,
        left: windowEl.style.left
    });

    windowEl.classList.add('minimizing');
    windowEl.classList.remove('opening');

    setTimeout(() => {
        windowEl.style.display = 'none';
        windowEl.classList.remove('minimizing');
        activeWindows.delete(windowId);
        updateDockActiveStates();
        updateAriaModal(); // Update modal state after minimizing
    }, 350);
}

export function restoreWindow(appName) {
    const windowId = `${appName}-window`;
    const windowEl = document.getElementById(windowId);
    
    if (!windowEl) return;
    
    if (minimizedWindows.has(windowId)) {
        windowEl.style.display = 'flex';
        windowEl.classList.add('restoring');
        
        SoundManager.playClick();
        
        activeWindows.add(windowId);
        bringToFront(windowEl);
        updateDockActiveStates();
        
        setTimeout(() => {
            windowEl.classList.remove('restoring');
        }, 350);
        
        minimizedWindows.delete(windowId);
    } else {
        openWindow(appName);
    }
}

// ============================================
// DOCK ACTIVE STATE
// ============================================

export function updateDockActiveStates() {
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        const appName = item.dataset.app;
        if (appName) {
            const windowId = `${appName}-window`;
            if (activeWindows.has(windowId)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
}

// ============================================
// DRAGGABLE WINDOWS
// ============================================

export function makeDraggable(element, currentOS) {
    if (currentOS !== 'desktop') return;

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = element.querySelector('.window-header');
    const snapPreview = document.getElementById('snap-preview');

    if (!header) return;

    header.addEventListener('mousedown', dragMouseDown);
    // Touch support for tablets (#48)
    header.addEventListener('touchstart', dragTouchStart, { passive: false });

    // Helper to get client coordinates from mouse or touch event
    function getEventCoords(e) {
        if (e.touches && e.touches.length > 0) {
            return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
        }
        return { clientX: e.clientX, clientY: e.clientY };
    }

    function dragMouseDown(e) {
        if (currentOS !== 'desktop') return;
        if (e.target.closest('.window-control')) return;

        // Use standard event object
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        handleDragStart(e);

        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('mousemove', elementDrag);
    }

    function dragTouchStart(e) {
        if (currentOS !== 'desktop') return;
        if (e.target.closest('.window-control')) return;

        e.preventDefault();
        const coords = getEventCoords(e);
        pos3 = coords.clientX;
        pos4 = coords.clientY;

        handleDragStart(e);

        document.addEventListener('touchend', closeDragTouch, { passive: false });
        document.addEventListener('touchmove', elementDragTouch, { passive: false });
    }

    function handleDragStart(e) {
        // Unsnap if snapped
        if (element.classList.contains('snapped-left') || 
            element.classList.contains('snapped-right') ||
            element.classList.contains('snapped-maximized')) {
            
            const originalState = windowSnapState.get(element.id);
            if (originalState) {
                element.classList.remove('snapped-left', 'snapped-right', 'snapped-maximized');
                element.style.width = originalState.width;
                element.style.height = originalState.height;
                element.style.left = (pos3 - parseInt(originalState.width) / 2) + 'px';
                element.style.top = pos4 + 'px';
            }
        }

        bringToFront(element);
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        doElementDrag(e.clientX, e.clientY);
    }

    function elementDragTouch(e) {
        e.preventDefault();
        const coords = getEventCoords(e);
        doElementDrag(coords.clientX, coords.clientY);
    }

    function doElementDrag(clientX, clientY) {
        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;

        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;

        const minY = 28;
        const minX = 0;
        const maxY = window.innerHeight - 50;
        // Fix #21: account for window width so it can't be dragged mostly off-screen
        const maxX = window.innerWidth - element.offsetWidth + 100;

        newTop = Math.max(minY, Math.min(newTop, maxY));
        newLeft = Math.max(minX, Math.min(newLeft, maxX));

        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";

        // Snap detection (using cached dock width #20)
        const snapThreshold = 50;

        snapPreview.classList.remove('visible', 'snap-left', 'snap-right', 'snap-maximize');

        if (clientX <= cachedDockWidth + snapThreshold) {
            snapPreview.classList.add('visible', 'snap-left');
        } else if (clientX >= window.innerWidth - snapThreshold) {
            snapPreview.classList.add('visible', 'snap-right');
        } else if (clientY <= 28 + snapThreshold / 2) {
            snapPreview.classList.add('visible', 'snap-maximize');
        }
    }

    function closeDragElement(e) {
        doCloseDrag(e?.clientX, e?.clientY);
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
    }

    function closeDragTouch(e) {
        const coords = e.changedTouches ? 
            { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY } : 
            { clientX: 0, clientY: 0 };
        doCloseDrag(coords.clientX, coords.clientY);
        document.removeEventListener('touchend', closeDragTouch);
        document.removeEventListener('touchmove', elementDragTouch);
    }

    function doCloseDrag(clientX, clientY) {
        // Using cached dock width (#20)
        const snapThreshold = 50;

        if (!windowSnapState.has(element.id)) {
            windowSnapState.set(element.id, {
                width: element.style.width || getComputedStyle(element).width,
                height: element.style.height || getComputedStyle(element).height,
                top: element.style.top,
                left: element.style.left
            });
        }

        // Clear inline styles for position/size before applying snap class (#33)
        // This allows CSS rules to take effect without !important
        function clearInlinePositionStyles(el) {
            el.style.top = '';
            el.style.left = '';
            el.style.width = '';
            el.style.height = '';
        }

        if (clientX && clientX <= cachedDockWidth + snapThreshold) {
            clearInlinePositionStyles(element);
            element.classList.add('snapped-left');
        } else if (clientX && clientX >= window.innerWidth - snapThreshold) {
            clearInlinePositionStyles(element);
            element.classList.add('snapped-right');
        } else if (clientY && clientY <= 28 + snapThreshold / 2) {
            clearInlinePositionStyles(element);
            element.classList.add('snapped-maximized');
        }

        snapPreview.classList.remove('visible', 'snap-left', 'snap-right', 'snap-maximize');
    }
}

// ============================================
// RESIZABLE WINDOWS
// ============================================

export function makeResizable(element, currentOS) {
    if (currentOS !== 'desktop') return;

    const minWidth = 400;
    const minHeight = 300;

    const handles = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
    handles.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${pos}`;
        handle.dataset.direction = pos;
        element.appendChild(handle);

        handle.addEventListener('mousedown', initResize);
    });

    let startX, startY, startWidth, startHeight, startTop, startLeft;
    let currentHandle = null;

    function initResize(e) {
        e.preventDefault();
        e.stopPropagation();

        element.classList.remove('snapped-left', 'snapped-right', 'snapped-maximized');

        currentHandle = e.target.dataset.direction;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;
        startTop = element.offsetTop;
        startLeft = element.offsetLeft;

        bringToFront(element);

        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);
    }

    function doResize(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newTop = startTop;
        let newLeft = startLeft;

        if (currentHandle.includes('right')) {
            newWidth = Math.max(minWidth, startWidth + dx);
        }
        if (currentHandle.includes('left')) {
            newWidth = Math.max(minWidth, startWidth - dx);
            if (newWidth > minWidth) {
                newLeft = startLeft + dx;
            }
        }
        if (currentHandle.includes('bottom')) {
            newHeight = Math.max(minHeight, startHeight + dy);
        }
        if (currentHandle.includes('top')) {
            newHeight = Math.max(minHeight, startHeight - dy);
            if (newHeight > minHeight) {
                newTop = startTop + dy;
            }
        }

        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';
        element.style.top = newTop + 'px';
        element.style.left = newLeft + 'px';
        element.style.maxWidth = 'none';
        element.style.maxHeight = 'none';
    }

    function stopResize() {
        currentHandle = null;
        document.removeEventListener('mousemove', doResize);
        document.removeEventListener('mouseup', stopResize);
    }
}

// ============================================
// WINDOW CONTROLS SETUP
// ============================================

export function setupWindowControls() {
    // Close buttons
    document.querySelectorAll('.window-control.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const windowEl = btn.closest('.window');
            if (windowEl) closeWindow(windowEl.id);
        });
    });

    // Minimize buttons
    document.querySelectorAll('.window-control.minimize').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const windowEl = btn.closest('.window');
            if (windowEl) minimizeWindow(windowEl.id);
        });
    });

    // Maximize buttons
    document.querySelectorAll('.window-control.maximize').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const windowEl = btn.closest('.window');
            if (windowEl) {
                if (windowEl.classList.contains('snapped-maximized')) {
                    windowEl.classList.remove('snapped-maximized');
                    const state = windowSnapState.get(windowEl.id);
                    if (state) {
                        windowEl.style.width = state.width;
                        windowEl.style.height = state.height;
                        windowEl.style.top = state.top;
                        windowEl.style.left = state.left;
                    }
                } else {
                    if (!windowSnapState.has(windowEl.id)) {
                        windowSnapState.set(windowEl.id, {
                            width: windowEl.style.width || getComputedStyle(windowEl).width,
                            height: windowEl.style.height || getComputedStyle(windowEl).height,
                            top: windowEl.style.top,
                            left: windowEl.style.left
                        });
                    }
                    windowEl.classList.add('snapped-maximized');
                }
            }
        });
    });

    // Mobile close buttons
    document.querySelectorAll('.close-btn-mobile').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const windowEl = btn.closest('.window');
            if (windowEl) closeWindow(windowEl.id);
        });
    });

    // Escape key to close topmost window
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeWindows.size > 0) {
            // Find the topmost window (highest z-index)
            let topmostWindow = null;
            let highestZ = 0;
            
            activeWindows.forEach(windowId => {
                const windowEl = document.getElementById(windowId);
                if (windowEl) {
                    const zIndex = parseInt(windowEl.style.zIndex || 0);
                    if (zIndex > highestZ) {
                        highestZ = zIndex;
                        topmostWindow = windowEl;
                    }
                }
            });
            
            if (topmostWindow) {
                closeWindow(topmostWindow.id);
            }
        }
        
        // Ctrl+Tab to cycle through active windows (#46)
        if (e.key === 'Tab' && e.ctrlKey && activeWindows.size > 1) {
            e.preventDefault();
            
            // Get windows sorted by z-index
            const windowsArray = Array.from(activeWindows).map(id => {
                const el = document.getElementById(id);
                return { id, zIndex: parseInt(el?.style.zIndex || 0), el };
            }).sort((a, b) => b.zIndex - a.zIndex);
            
            // Find current topmost and bring next to front
            if (windowsArray.length > 1) {
                // Shift+Ctrl+Tab goes backwards
                const nextIndex = e.shiftKey ? 0 : windowsArray.length - 1;
                const nextWindow = windowsArray[nextIndex];
                if (nextWindow?.el) {
                    bringToFront(nextWindow.el);
                    SoundManager.playClick();
                }
            }
        }
    });
}

// ============================================
// FOCUS TRAP (Accessibility)
// ============================================

function getFocusableElements(container) {
    const focusableSelectors = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
    ].join(', ');
    
    return Array.from(container.querySelectorAll(focusableSelectors))
        .filter(el => el.offsetParent !== null); // Only visible elements
}

function setupFocusTrap(windowEl) {
    removeFocusTrap(); // Clear any existing trap
    
    currentFocusTrap = (e) => {
        if (e.key !== 'Tab') return;
        
        const focusable = getFocusableElements(windowEl);
        if (focusable.length === 0) return;
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        if (e.shiftKey) {
            // Shift+Tab: if on first element, wrap to last
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            // Tab: if on last element, wrap to first
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };
    
    document.addEventListener('keydown', currentFocusTrap);
}

function removeFocusTrap() {
    if (currentFocusTrap) {
        document.removeEventListener('keydown', currentFocusTrap);
        currentFocusTrap = null;
    }
}

export default {
    openWindow,
    closeWindow,
    closeAllWindows,
    bringToFront,
    minimizeWindow,
    restoreWindow,
    updateDockActiveStates,
    makeDraggable,
    makeResizable,
    setupWindowControls,
    getActiveWindows,
    getCurrentZIndex
};

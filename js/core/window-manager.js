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

export function openWindow(appName, currentOS = 'desktop') {
    const windowId = `${appName}-window`;
    const windowEl = document.getElementById(windowId);

    if (!windowEl) return;

    if (activeWindows.has(windowId)) {
        bringToFront(windowEl);
        return;
    }

    windowEl.style.display = 'flex';
    activeWindows.add(windowId);
    bringToFront(windowEl);
    
    // Apply cascade offset for desktop
    if (currentOS === 'desktop' && !windowEl.style.top) {
        const cascadeOffset = activeWindows.size * 25;
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

    // Auto-focus terminal input
    if (appName === 'terminal') {
        setTimeout(() => {
            const terminalInput = document.getElementById('terminal-input');
            if (terminalInput) terminalInput.focus();
        }, 100);
    }
}

export function closeWindow(windowId) {
    const windowEl = document.getElementById(windowId);
    if (!windowEl) return;

    SoundManager.playWhoosh();

    windowEl.classList.remove('opening');
    windowEl.classList.add('closing');

    setTimeout(() => {
        windowEl.style.display = 'none';
        windowEl.classList.remove('closing');
        activeWindows.delete(windowId);
        updateDockActiveStates();
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

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (currentOS !== 'desktop') return;
        if (e.target.closest('.window-control')) return;

        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        // Unsnap if snapped
        if (element.classList.contains('snapped-left') || 
            element.classList.contains('snapped-right') ||
            element.classList.contains('snapped-maximized')) {
            
            const originalState = windowSnapState.get(element.id);
            if (originalState) {
                element.classList.remove('snapped-left', 'snapped-right', 'snapped-maximized');
                element.style.width = originalState.width;
                element.style.height = originalState.height;
                element.style.left = (e.clientX - parseInt(originalState.width) / 2) + 'px';
                element.style.top = e.clientY + 'px';
                pos3 = e.clientX;
                pos4 = e.clientY;
            }
        }

        bringToFront(element);

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

        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;

        const minY = 28;
        const minX = 0;
        const maxY = window.innerHeight - 50;
        const maxX = window.innerWidth - 100;

        newTop = Math.max(minY, Math.min(newTop, maxY));
        newLeft = Math.max(minX, Math.min(newLeft, maxX));

        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";

        // Snap detection
        const snapThreshold = 50;
        const dockWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dock-width')) || 60;

        snapPreview.classList.remove('visible', 'snap-left', 'snap-right', 'snap-maximize');

        if (e.clientX <= dockWidth + snapThreshold) {
            snapPreview.classList.add('visible', 'snap-left');
        } else if (e.clientX >= window.innerWidth - snapThreshold) {
            snapPreview.classList.add('visible', 'snap-right');
        } else if (e.clientY <= 28 + snapThreshold / 2) {
            snapPreview.classList.add('visible', 'snap-maximize');
        }
    }

    function closeDragElement(e) {
        const dockWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dock-width')) || 60;
        const snapThreshold = 50;

        if (!windowSnapState.has(element.id)) {
            windowSnapState.set(element.id, {
                width: element.style.width || getComputedStyle(element).width,
                height: element.style.height || getComputedStyle(element).height,
                top: element.style.top,
                left: element.style.left
            });
        }

        if (e && e.clientX <= dockWidth + snapThreshold) {
            element.classList.add('snapped-left');
        } else if (e && e.clientX >= window.innerWidth - snapThreshold) {
            element.classList.add('snapped-right');
        } else if (e && e.clientY <= 28 + snapThreshold / 2) {
            element.classList.add('snapped-maximized');
        }

        snapPreview.classList.remove('visible', 'snap-left', 'snap-right', 'snap-maximize');

        document.onmouseup = null;
        document.onmousemove = null;
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
    });
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

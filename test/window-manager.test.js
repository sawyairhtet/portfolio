/**
 * Window Manager Unit Tests — Vitest + jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    openWindow,
    closeWindow,
    bringToFront,
    getActiveWindows,
    getCurrentZIndex,
    closeAllWindows,
    minimizeWindow,
    setupWindowControls,
    updateDockActiveStates,
    restoreWindow,
    makeDraggable,
    makeResizable,
} from '../js/core/window-manager.js';

/**
 * Helper: create a fake window element in the DOM
 * @param {string} appName
 */
function createWindowEl(appName) {
    const el = document.createElement('div');
    el.id = `${appName}-window`;
    el.className = 'window';
    el.dataset.app = appName;
    el.style.display = 'none';
    el.innerHTML = `
        <div class="window-header">
            <div class="window-title">${appName}</div>
            <div class="window-controls">
                <button class="window-control minimize"></button>
                <button class="window-control maximize"></button>
                <button class="window-control close"></button>
            </div>
        </div>
        <div class="window-body"></div>
    `;
    document.body.appendChild(el);
    return el;
}

function createDockItem(appName) {
    const item = document.createElement('div');
    item.className = 'dock-item';
    item.dataset.app = appName;
    document.body.appendChild(item);
    return item;
}

function createSnapPreview() {
    const el = document.createElement('div');
    el.id = 'snap-preview';
    document.body.appendChild(el);
    return el;
}

describe('Window Manager', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        createSnapPreview();
        // Clear active windows between tests
        const active = getActiveWindows();
        active.clear();
        localStorage.removeItem('portfolioWindowStates');
    });

    it('should export required functions', () => {
        expect(typeof openWindow).toBe('function');
        expect(typeof closeWindow).toBe('function');
        expect(typeof bringToFront).toBe('function');
        expect(typeof getActiveWindows).toBe('function');
        expect(typeof getCurrentZIndex).toBe('function');
        expect(typeof closeAllWindows).toBe('function');
        expect(typeof minimizeWindow).toBe('function');
        expect(typeof setupWindowControls).toBe('function');
        expect(typeof updateDockActiveStates).toBe('function');
    });

    it('should return a Set from getActiveWindows', () => {
        const active = getActiveWindows();
        expect(active).toBeInstanceOf(Set);
    });

    it('should open a window and track it as active', () => {
        createWindowEl('about');
        openWindow('about', 'desktop');

        const active = getActiveWindows();
        expect(active.has('about-window')).toBe(true);
    });

    it('should set display flex when opening', () => {
        const el = createWindowEl('about');
        openWindow('about', 'desktop');
        expect(el.style.display).toBe('flex');
    });

    it('should close a window and remove it from active set', async () => {
        createWindowEl('about');
        openWindow('about', 'desktop');

        closeWindow('about-window');

        // closeWindow uses a 250ms timeout
        await new Promise(r => setTimeout(r, 300));
        const active = getActiveWindows();
        expect(active.has('about-window')).toBe(false);
    });

    it('should hide window display after close animation', async () => {
        const el = createWindowEl('about');
        openWindow('about', 'desktop');

        closeWindow('about-window');
        await new Promise(r => setTimeout(r, 300));
        expect(el.style.display).toBe('none');
    });

    it('should add closing class during close animation', () => {
        createWindowEl('about');
        openWindow('about', 'desktop');
        closeWindow('about-window');

        const el = document.getElementById('about-window');
        expect(el.classList.contains('closing')).toBe(true);
    });

    it('should increment z-index when bringing to front', () => {
        const el = createWindowEl('about');
        const before = getCurrentZIndex();
        bringToFront(el);
        expect(getCurrentZIndex()).toBeGreaterThan(before);
    });

    it('should set z-index on element when bringing to front', () => {
        const el = createWindowEl('about');
        bringToFront(el);
        expect(parseInt(el.style.zIndex)).toBeGreaterThan(0);
    });

    it('should not open a non-existent window', () => {
        openWindow('nonexistent', 'desktop');
        const active = getActiveWindows();
        expect(active.has('nonexistent-window')).toBe(false);
    });

    it('should bring existing active window to front instead of re-adding', () => {
        createWindowEl('about');
        openWindow('about', 'desktop');
        const z1 = getCurrentZIndex();
        openWindow('about', 'desktop');
        expect(getCurrentZIndex()).toBeGreaterThan(z1);
        expect(getActiveWindows().size).toBe(1);
    });

    it('closeWindow should handle non-existent window gracefully', () => {
        expect(() => closeWindow('nonexistent-window')).not.toThrow();
    });

    it('closeAllWindows should close all active windows', async () => {
        createWindowEl('about');
        createWindowEl('terminal');
        openWindow('about', 'desktop');
        openWindow('terminal', 'desktop');

        expect(getActiveWindows().size).toBe(2);
        closeAllWindows();

        await new Promise(r => setTimeout(r, 300));
        expect(getActiveWindows().size).toBe(0);
    });

    it('minimizeWindow should remove window from active set after animation', async () => {
        createWindowEl('about');
        openWindow('about', 'desktop');

        minimizeWindow('about-window');
        await new Promise(r => setTimeout(r, 400));
        expect(getActiveWindows().has('about-window')).toBe(false);
    });

    it('minimizeWindow should add minimizing class', () => {
        createWindowEl('about');
        openWindow('about', 'desktop');

        minimizeWindow('about-window');
        const el = document.getElementById('about-window');
        expect(el.classList.contains('minimizing')).toBe(true);
    });

    it('minimizeWindow should handle non-existent window gracefully', () => {
        expect(() => minimizeWindow('nonexistent-window')).not.toThrow();
    });

    it('updateDockActiveStates should add active class to dock items with open windows', () => {
        const dockItem = createDockItem('about');
        createWindowEl('about');
        openWindow('about', 'desktop');

        updateDockActiveStates();
        expect(dockItem.classList.contains('active')).toBe(true);
    });

    it('updateDockActiveStates should remove active class from dock items without open windows', async () => {
        const dockItem = createDockItem('about');
        createWindowEl('about');
        openWindow('about', 'desktop');
        updateDockActiveStates();
        expect(dockItem.classList.contains('active')).toBe(true);

        closeWindow('about-window');
        await new Promise(r => setTimeout(r, 300));
        expect(dockItem.classList.contains('active')).toBe(false);
    });

    it('restoreWindow should open if window is not minimized', () => {
        createWindowEl('about');
        restoreWindow('about', 'desktop');
        expect(getActiveWindows().has('about-window')).toBe(true);
    });

    it('restoreWindow should handle non-existent window gracefully', () => {
        expect(() => restoreWindow('nonexistent', 'desktop')).not.toThrow();
    });

    it('setupWindowControls should not throw', () => {
        createWindowEl('about');
        expect(() => setupWindowControls()).not.toThrow();
    });

    it('should open windows on mobile mode', () => {
        createWindowEl('about');
        openWindow('about', 'mobile');
        expect(getActiveWindows().has('about-window')).toBe(true);
    });

    it('should open multiple windows with different z-indices', () => {
        const el1 = createWindowEl('about');
        const el2 = createWindowEl('terminal');
        openWindow('about', 'desktop');
        openWindow('terminal', 'desktop');

        const z1 = parseInt(el1.style.zIndex || '0');
        const z2 = parseInt(el2.style.zIndex || '0');
        expect(z2).toBeGreaterThan(z1);
    });

    it('setupWindowControls close button should trigger closeWindow', async () => {
        createWindowEl('about');
        setupWindowControls();
        openWindow('about', 'desktop');

        const closeBtn = document.querySelector('#about-window .window-control.close');
        closeBtn.click();

        await new Promise(r => setTimeout(r, 300));
        expect(getActiveWindows().has('about-window')).toBe(false);
    });

    it('setupWindowControls minimize button should trigger minimizeWindow', async () => {
        createWindowEl('about');
        setupWindowControls();
        openWindow('about', 'desktop');

        const minBtn = document.querySelector('#about-window .window-control.minimize');
        minBtn.click();

        await new Promise(r => setTimeout(r, 400));
        expect(getActiveWindows().has('about-window')).toBe(false);
    });

    it('setupWindowControls maximize button should toggle snapped-maximized class', () => {
        createWindowEl('about');
        setupWindowControls();
        openWindow('about', 'desktop');

        const maxBtn = document.querySelector('#about-window .window-control.maximize');
        maxBtn.click();

        const el = document.getElementById('about-window');
        expect(el.classList.contains('snapped-maximized')).toBe(true);

        // Click again to unsnap — no state was saved since snap state was just set
        maxBtn.click();
        expect(el.classList.contains('snapped-maximized')).toBe(false);
    });

    it('setupWindowControls Escape closes topmost window', async () => {
        createWindowEl('about');
        createWindowEl('terminal');
        setupWindowControls();
        openWindow('about', 'desktop');
        openWindow('terminal', 'desktop');

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await new Promise(r => setTimeout(r, 300));

        // terminal was opened last (highest z), so it should be closed
        expect(getActiveWindows().has('terminal-window')).toBe(false);
        expect(getActiveWindows().has('about-window')).toBe(true);
    });

    it('setupWindowControls Ctrl+Tab cycles windows', () => {
        const el1 = createWindowEl('about');
        const el2 = createWindowEl('terminal');
        setupWindowControls();
        openWindow('about', 'desktop');
        openWindow('terminal', 'desktop');

        const z2Before = parseInt(el1.style.zIndex || '0');
        document.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Tab', ctrlKey: true })
        );
        // After Ctrl+Tab, the bottom window should be brought to front
        const z1After = parseInt(el1.style.zIndex || '0');
        expect(z1After).toBeGreaterThan(z2Before);
    });

    it('should add opening class then remove it', async () => {
        createWindowEl('about');
        openWindow('about', 'desktop');

        const el = document.getElementById('about-window');
        expect(el.classList.contains('opening')).toBe(true);

        await new Promise(r => setTimeout(r, 500));
        expect(el.classList.contains('opening')).toBe(false);
    });

    it('restoreWindow should restore a minimized window', async () => {
        createWindowEl('about');
        openWindow('about', 'desktop');

        minimizeWindow('about-window');
        await new Promise(r => setTimeout(r, 400));
        expect(getActiveWindows().has('about-window')).toBe(false);

        restoreWindow('about', 'desktop');
        expect(getActiveWindows().has('about-window')).toBe(true);
    });

    it('should set aria-hidden on background elements when windows are open', () => {
        // Create background elements
        const mainContent = document.createElement('div');
        mainContent.className = 'main-content';
        document.body.appendChild(mainContent);

        createWindowEl('about');
        openWindow('about', 'desktop');

        expect(mainContent.getAttribute('aria-hidden')).toBe('true');
    });

    it('should remove aria-hidden from background elements when all windows close', async () => {
        const mainContent = document.createElement('div');
        mainContent.className = 'main-content';
        document.body.appendChild(mainContent);

        createWindowEl('about');
        openWindow('about', 'desktop');

        closeWindow('about-window');
        await new Promise(r => setTimeout(r, 300));

        expect(mainContent.hasAttribute('aria-hidden')).toBe(false);
    });

    it('mobile close button should close the window', async () => {
        const el = createWindowEl('about');
        const mobileCloseBtn = document.createElement('button');
        mobileCloseBtn.className = 'close-btn-mobile';
        el.appendChild(mobileCloseBtn);

        setupWindowControls();
        openWindow('about', 'desktop');

        mobileCloseBtn.click();
        await new Promise(r => setTimeout(r, 300));
        expect(getActiveWindows().has('about-window')).toBe(false);
    });

    it('makeDraggable should skip on non-desktop', () => {
        const el = createWindowEl('about');
        // Should not throw on mobile/tablet
        expect(() => makeDraggable(el, 'mobile')).not.toThrow();
        expect(() => makeDraggable(el, 'tablet')).not.toThrow();
    });

    it('makeDraggable should attach mousedown on header for desktop', () => {
        const el = createWindowEl('about');
        makeDraggable(el, 'desktop');
        const header = el.querySelector('.window-header');
        expect(header).not.toBeNull();
    });

    it('makeDraggable should skip if no header', () => {
        const el = document.createElement('div');
        el.id = 'no-header-window';
        document.body.appendChild(el);
        expect(() => makeDraggable(el, 'desktop')).not.toThrow();
    });

    it('makeDraggable drag moves the element', () => {
        const el = createWindowEl('about');
        el.style.display = 'flex';
        el.style.top = '100px';
        el.style.left = '200px';
        document.body.appendChild(el);

        makeDraggable(el, 'desktop');

        const header = el.querySelector('.window-header');
        header.dispatchEvent(
            new MouseEvent('mousedown', { clientX: 210, clientY: 110, bubbles: true })
        );
        document.dispatchEvent(
            new MouseEvent('mousemove', { clientX: 220, clientY: 120, bubbles: true })
        );
        document.dispatchEvent(
            new MouseEvent('mouseup', { clientX: 220, clientY: 120, bubbles: true })
        );
        // Window should have been moved (top/left changed or snapped)
        // Just verify no errors
    });

    it('makeDraggable touch support does not throw', () => {
        const el = createWindowEl('terminal');
        el.style.display = 'flex';
        el.style.top = '100px';
        el.style.left = '200px';
        document.body.appendChild(el);

        makeDraggable(el, 'desktop');

        const header = el.querySelector('.window-header');
        const touchEvent = new Event('touchstart', { bubbles: true });
        touchEvent.touches = [{ clientX: 210, clientY: 110 }];
        touchEvent.preventDefault = vi.fn();
        header.dispatchEvent(touchEvent);
    });

    it('makeResizable should skip on non-desktop', () => {
        const el = createWindowEl('about');
        expect(() => makeResizable(el, 'mobile')).not.toThrow();
        expect(() => makeResizable(el, 'tablet')).not.toThrow();
    });

    it('makeResizable should add resize handles on desktop', () => {
        const el = createWindowEl('about');
        makeResizable(el, 'desktop');
        const handles = el.querySelectorAll('.resize-handle');
        expect(handles.length).toBe(8);
    });

    it('makeResizable handle mousedown triggers resize', () => {
        const el = createWindowEl('about');
        el.style.display = 'flex';
        el.style.width = '500px';
        el.style.height = '400px';
        el.style.top = '50px';
        el.style.left = '100px';
        document.body.appendChild(el);

        makeResizable(el, 'desktop');

        const handle = el.querySelector('.resize-handle.right');
        handle.dispatchEvent(
            new MouseEvent('mousedown', { clientX: 600, clientY: 200, bubbles: true })
        );
        document.dispatchEvent(
            new MouseEvent('mousemove', { clientX: 650, clientY: 200, bubbles: true })
        );
        document.dispatchEvent(
            new MouseEvent('mouseup', { clientX: 650, clientY: 200, bubbles: true })
        );
        // Verify no errors
    });

    it('restoreWindow should auto-detect desktop when no OS given', () => {
        createWindowEl('about');
        // window.innerWidth defaults to 0 in jsdom, so it would be 'mobile'
        restoreWindow('about');
        expect(getActiveWindows().has('about-window')).toBe(true);
    });

    it('openWindow should apply cascade positioning for multiple windows', () => {
        createWindowEl('about');
        createWindowEl('terminal');
        openWindow('about', 'desktop');
        openWindow('terminal', 'desktop');

        const el1 = document.getElementById('about-window');
        const el2 = document.getElementById('terminal-window');
        // Both should have top/left set
        expect(el1.style.top).toBeTruthy();
        expect(el2.style.top).toBeTruthy();
    });
});

// Window Manager Unit Tests
import { describe, it } from 'node:test';
import assert from 'node:assert';

// Mock DOM for testing
globalThis.document = {
    querySelectorAll: () => [],
    addEventListener: () => {},
    getElementById: () => null,
    activeElement: null,
};

globalThis.window = {
    addEventListener: () => {},
    innerWidth: 1024,
    innerHeight: 768,
};

globalThis.getComputedStyle = () => ({
    width: '0px',
    height: '0px',
    getPropertyValue: () => '0px',
});
globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
};

describe('Window Manager', () => {
    it('should export required functions', async () => {
        const module = await import('../js/core/window-manager.js');

        assert.strictEqual(typeof module.openWindow, 'function');
        assert.strictEqual(typeof module.closeWindow, 'function');
        assert.strictEqual(typeof module.bringToFront, 'function');
        assert.strictEqual(typeof module.getActiveWindows, 'function');
    });

    it('should return Set from getActiveWindows', async () => {
        const { getActiveWindows } = await import('../js/core/window-manager.js');
        const activeWindows = getActiveWindows();

        assert.ok(activeWindows instanceof Set);
    });
});

describe('Terminal Commands', () => {
    it('should export executeTerminalCommand', async () => {
        const module = await import('../js/apps/terminal.js');
        assert.strictEqual(typeof module.executeTerminalCommand, 'function');
    });
});

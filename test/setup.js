/**
 * Vitest global setup — polyfill localStorage for jsdom
 */

const store = {};

const localStorageMock = {
    getItem(key) {
        return store[key] ?? null;
    },
    setItem(key, value) {
        store[key] = String(value);
    },
    removeItem(key) {
        delete store[key];
    },
    clear() {
        for (const key of Object.keys(store)) {
            delete store[key];
        }
    },
    get length() {
        return Object.keys(store).length;
    },
    key(index) {
        return Object.keys(store)[index] ?? null;
    },
};

Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
});

import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

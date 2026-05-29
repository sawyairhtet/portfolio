import '@testing-library/jest-dom';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    }),
});

// Mock AudioContext
class MockAudioContext {
    currentTime = 0;
    createOscillator() {
        return {
            type: 'sine',
            frequency: { value: 0 },
            connect: () => {},
            start: () => {},
            stop: () => {},
        };
    }
    createGain() {
        return {
            gain: { value: 0, exponentialRampToValueAtTime: () => {} },
            connect: () => {},
        };
    }
    get destination() {
        return {};
    }
}

Object.defineProperty(window, 'AudioContext', {
    value: MockAudioContext,
    writable: true,
    configurable: true,
});

// Mock localStorage
const storage = new Map<string, string>();
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
            storage.set(key, value);
        },
        removeItem: (key: string) => {
            storage.delete(key);
        },
        clear: () => {
            storage.clear();
        },
        get length() {
            return storage.size;
        },
        key: (i: number) => Array.from(storage.keys()).at(i) ?? null,
    },
});

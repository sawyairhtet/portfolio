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
const storage: Record<string, string> = {};
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: (key: string) => storage[key] ?? null,
        setItem: (key: string, value: string) => {
            storage[key] = value;
        },
        removeItem: (key: string) => {
            delete storage[key];
        },
        clear: () => {
            Object.keys(storage).forEach(k => delete storage[k]);
        },
        get length() {
            return Object.keys(storage).length;
        },
        key: (i: number) => Object.keys(storage)[i] ?? null,
    },
});

/**
 * Sound Manager Unit Tests — Vitest + jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock AudioContext before importing module
function createMockOscillator() {
    return {
        connect: vi.fn(),
        frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        start: vi.fn(),
        stop: vi.fn(),
    };
}

function createMockGain() {
    return {
        connect: vi.fn(),
        gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    };
}

function createMockFilter() {
    return {
        connect: vi.fn(),
        type: '',
        frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    };
}

function createMockAudioContext() {
    return {
        currentTime: 0,
        sampleRate: 44100,
        destination: {},
        createOscillator: vi.fn(() => createMockOscillator()),
        createGain: vi.fn(() => createMockGain()),
        createBiquadFilter: vi.fn(() => createMockFilter()),
        createBuffer: vi.fn((channels, length, sampleRate) => ({
            getChannelData: vi.fn(() => new Float32Array(length)),
        })),
        createBufferSource: vi.fn(() => ({
            connect: vi.fn(),
            buffer: null,
            start: vi.fn(),
        })),
    };
}

globalThis.AudioContext = function MockAudioContext() {
    return createMockAudioContext();
};

const { default: SoundManager } = await import('../js/core/sound-manager.js');

describe('Sound Manager', () => {
    beforeEach(() => {
        SoundManager.audioContext = null;
        SoundManager.muted = false;
        localStorage.removeItem('soundMuted');
    });

    it('should export required methods', () => {
        expect(typeof SoundManager.init).toBe('function');
        expect(typeof SoundManager.setMuted).toBe('function');
        expect(typeof SoundManager.isMuted).toBe('function');
        expect(typeof SoundManager.playClick).toBe('function');
        expect(typeof SoundManager.playWhoosh).toBe('function');
        expect(typeof SoundManager.playStartupDrum).toBe('function');
    });

    it('init should create AudioContext and return it', () => {
        const ctx = SoundManager.init();
        expect(ctx).toBeDefined();
        expect(SoundManager.audioContext).toBe(ctx);
    });

    it('init should not create a second AudioContext', () => {
        const ctx1 = SoundManager.init();
        const ctx2 = SoundManager.init();
        expect(ctx1).toBe(ctx2);
    });

    it('init should load muted preference from localStorage', () => {
        localStorage.setItem('soundMuted', 'true');
        SoundManager.audioContext = null;
        SoundManager.init();
        expect(SoundManager.isMuted()).toBe(true);
    });

    it('setMuted should update state and persist to localStorage', () => {
        SoundManager.setMuted(true);
        expect(SoundManager.isMuted()).toBe(true);
        expect(localStorage.getItem('soundMuted')).toBe('true');

        SoundManager.setMuted(false);
        expect(SoundManager.isMuted()).toBe(false);
        expect(localStorage.getItem('soundMuted')).toBe('false');
    });

    it('isMuted should return current muted state', () => {
        expect(SoundManager.isMuted()).toBe(false);
        SoundManager.muted = true;
        expect(SoundManager.isMuted()).toBe(true);
    });

    it('playClick should not play when muted', () => {
        SoundManager.setMuted(true);
        SoundManager.init();
        const ctx = SoundManager.audioContext;
        SoundManager.playClick();
        expect(ctx.createOscillator).not.toHaveBeenCalled();
    });

    it('playClick should create oscillator and gain when not muted', () => {
        SoundManager.init();
        const ctx = SoundManager.audioContext;
        SoundManager.playClick();
        expect(ctx.createOscillator).toHaveBeenCalled();
        expect(ctx.createGain).toHaveBeenCalled();
    });

    it('playWhoosh should not play when muted', () => {
        SoundManager.setMuted(true);
        SoundManager.init();
        const ctx = SoundManager.audioContext;
        SoundManager.playWhoosh();
        expect(ctx.createBufferSource).not.toHaveBeenCalled();
    });

    it('playWhoosh should create buffer source and filter when not muted', () => {
        SoundManager.init();
        const ctx = SoundManager.audioContext;
        SoundManager.playWhoosh();
        expect(ctx.createBuffer).toHaveBeenCalled();
        expect(ctx.createBufferSource).toHaveBeenCalled();
        expect(ctx.createBiquadFilter).toHaveBeenCalled();
        expect(ctx.createGain).toHaveBeenCalled();
    });

    it('playStartupDrum should not play when muted', () => {
        SoundManager.setMuted(true);
        SoundManager.init();
        const ctx = SoundManager.audioContext;
        SoundManager.playStartupDrum();
        expect(ctx.createOscillator).not.toHaveBeenCalled();
    });

    it('playStartupDrum should create oscillator when not muted', () => {
        SoundManager.init();
        const ctx = SoundManager.audioContext;
        SoundManager.playStartupDrum();
        expect(ctx.createOscillator).toHaveBeenCalled();
        expect(ctx.createGain).toHaveBeenCalled();
    });

    it('play methods should handle errors gracefully', () => {
        SoundManager.init();
        SoundManager.audioContext.createOscillator = vi.fn(() => {
            throw new Error('Audio error');
        });
        // Should not throw
        expect(() => SoundManager.playClick()).not.toThrow();
        expect(() => SoundManager.playStartupDrum()).not.toThrow();
    });
});

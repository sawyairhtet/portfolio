/**
 * Transitions Unit Tests — Vitest + jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createRipple } from '../js/core/transitions.js';

describe('Transitions', () => {
    /** @type {HTMLElement} */
    let container;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        container.style.width = '200px';
        container.style.height = '100px';
        document.body.appendChild(container);
    });

    it('should export createRipple function', () => {
        expect(typeof createRipple).toBe('function');
    });

    it('should append a span element to the target element', () => {
        const event = new MouseEvent('click', { clientX: 100, clientY: 50 });
        createRipple(event, container);

        const ripple = container.querySelector('span');
        expect(ripple).not.toBeNull();
    });

    it('should set position relative and overflow hidden on element', () => {
        const event = new MouseEvent('click', { clientX: 100, clientY: 50 });
        createRipple(event, container);

        expect(container.style.position).toBe('relative');
        expect(container.style.overflow).toBe('hidden');
    });

    it('should set ripple styles including border-radius and animation', () => {
        const event = new MouseEvent('click', { clientX: 100, clientY: 50 });
        createRipple(event, container);

        const ripple = container.querySelector('span');
        expect(ripple.style.position).toBe('absolute');
        expect(ripple.style.borderRadius).toBe('50%');
        expect(ripple.style.pointerEvents).toBe('none');
    });

    it('should remove ripple after 600ms', () => {
        vi.useFakeTimers();

        const event = new MouseEvent('click', { clientX: 100, clientY: 50 });
        createRipple(event, container);

        expect(container.querySelector('span')).not.toBeNull();

        vi.advanceTimersByTime(600);
        expect(container.querySelector('span')).toBeNull();

        vi.useRealTimers();
    });

    it('should handle multiple ripples on the same element', () => {
        const event1 = new MouseEvent('click', { clientX: 50, clientY: 25 });
        const event2 = new MouseEvent('click', { clientX: 150, clientY: 75 });
        createRipple(event1, container);
        createRipple(event2, container);

        expect(container.querySelectorAll('span').length).toBe(2);
    });
});

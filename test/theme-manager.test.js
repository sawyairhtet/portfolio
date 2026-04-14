/**
 * Theme Manager Tests — Vitest + jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import ThemeManager from '../js/core/theme-manager.js';

describe('Theme Manager', () => {
    beforeEach(() => {
        document.documentElement.removeAttribute('data-theme');
        localStorage.removeItem('theme');
    });

    it('should export init, toggle, and updateUI', () => {
        expect(typeof ThemeManager.init).toBe('function');
        expect(typeof ThemeManager.toggle).toBe('function');
        expect(typeof ThemeManager.updateUI).toBe('function');
    });

    it('should start in light mode by default', () => {
        ThemeManager.init();
        expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    });

    it('should restore dark mode from localStorage', () => {
        localStorage.setItem('theme', 'dark');
        ThemeManager.init();
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should toggle to dark mode', () => {
        ThemeManager.init();
        ThemeManager.toggle();
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should toggle back to light mode', () => {
        localStorage.setItem('theme', 'dark');
        ThemeManager.init();
        ThemeManager.toggle();
        expect(document.documentElement.getAttribute('data-theme')).toBeNull();
        expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should sync toggle checkbox via updateUI', () => {
        const toggle = document.createElement('input');
        toggle.id = 'theme-toggle';
        toggle.type = 'checkbox';
        document.body.appendChild(toggle);

        document.documentElement.setAttribute('data-theme', 'dark');
        ThemeManager.updateUI();
        expect(toggle.checked).toBe(true);

        document.documentElement.removeAttribute('data-theme');
        ThemeManager.updateUI();
        expect(toggle.checked).toBe(false);
    });
});

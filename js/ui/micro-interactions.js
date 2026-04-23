/**
 * Micro-interactions System
 * Adds delightful details throughout the UI
 */

import { createRipple } from '../core/transitions.js';
import SoundManager from '../core/sound-manager.js';

/**
 * Initialize all micro-interactions
 */
export function initMicroInteractions() {
    setupRippleEffects();
    setupHoverSounds();
    setupMagneticButtons();
    setupSkillBarAnimations();
}

/**
 * Animate skill bars when scrolled into view
 */
function setupSkillBarAnimations() {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll('.skill-card').forEach(card => {
        observer.observe(card);
    });
}

/**
 * Add ripple effects to interactive elements
 */
function setupRippleEffects() {
    const elements = document.querySelectorAll(
        '.app-icon, .dock-item, .project-card, .social-link, .resume-download-btn'
    );

    elements.forEach(el => {
        el.addEventListener('click', e => {
            createRipple(/** @type {MouseEvent} */ (e), /** @type {HTMLElement} */ (el));
        });
    });
}

/**
 * Subtle hover sounds for interactive elements
 */
function setupHoverSounds() {
    // Only on desktop - don't annoy mobile users
    if (window.matchMedia('(pointer: coarse)').matches) {
        return;
    }

    const elements = document.querySelectorAll('.dock-item, .app-icon');

    elements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            // Very subtle hover sound - different from click
            if (!SoundManager.isMuted()) {
                playHoverSound();
            }
        });
    });
}

function playHoverSound() {
    try {
        const ctx = SoundManager.init();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.03);

        gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.03);
    } catch {
        // Silent fail
    }
}

/**
 * Magnetic button effect - buttons subtly follow cursor
 */
function setupMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) {
        return;
    }

    const buttons = document.querySelectorAll('.dock-item, .window-control');

    buttons.forEach(btn => {
        const b = /** @type {HTMLElement} */ (btn);
        b.addEventListener('mousemove', e => {
            const me = /** @type {MouseEvent} */ (e);
            const rect = b.getBoundingClientRect();
            const x = me.clientX - rect.left - rect.width / 2;
            const y = me.clientY - rect.top - rect.height / 2;

            b.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        b.addEventListener('mouseleave', () => {
            b.style.transform = '';
        });
    });
}



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
    setupTiltEffect();
    setupTypingIndicator();
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

/**
 * 3D tilt effect for cards
 */
function setupTiltEffect() {
    if (window.matchMedia('(pointer: coarse)').matches) {
        return;
    }

    const cards = document.querySelectorAll('.project-card, .skill-card');

    cards.forEach(card => {
        const c = /** @type {HTMLElement} */ (card);
        c.addEventListener('mousemove', e => {
            const me = /** @type {MouseEvent} */ (e);
            const rect = c.getBoundingClientRect();
            const x = me.clientX - rect.left;
            const y = me.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            c.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        c.addEventListener('mouseleave', () => {
            c.style.transform = '';
        });
    });
}

/**
 * Typing indicator for terminal
 */
function setupTypingIndicator() {
    const terminalInput = /** @type {HTMLInputElement} */ (
        document.getElementById('terminal-input')
    );
    const output = document.getElementById('terminal-output');

    if (!terminalInput || !output) {
        return;
    }

    let typingTimeout;
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    indicator.style.cssText = `
        display: none;
        gap: 4px;
        padding: 8px 0;
    `;

    const style = document.createElement('style');
    style.textContent = `
        .typing-indicator {
            display: flex;
            align-items: center;
        }
        .typing-indicator span {
            width: 6px;
            height: 6px;
            background: var(--color-primary);
            border-radius: 50%;
            animation: typing-bounce 1.4s ease-in-out infinite both;
        }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing-bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    terminalInput.addEventListener('input', () => {
        clearTimeout(typingTimeout);

        if (terminalInput.value.length > 0) {
            typingTimeout = setTimeout(() => {
                // Could show suggestions here
            }, 500);
        }
    });
}

/**
 * Celebrate achievements with confetti
 * @param {HTMLElement} element - Element to celebrate at
 */
export function celebrate(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const colors = ['#E95420', '#77216F', '#5E2750', '#FF6B3D', '#FFFFFF'];

    for (let i = 0; i < 30; i++) {
        createConfetti(centerX, centerY, colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfetti(x, y, color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${color};
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 99999;
        border-radius: 2px;
    `;

    document.body.appendChild(confetti);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 5 + Math.random() * 10;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 10;

    let posX = x;
    let posY = y;
    let rotation = 0;
    const rotationSpeed = (Math.random() - 0.5) * 20;

    const animate = () => {
        posX += vx;
        posY += vy + 5; // gravity
        rotation += rotationSpeed;

        confetti.style.left = `${posX}px`;
        confetti.style.top = `${posY}px`;
        confetti.style.transform = `rotate(${rotation}deg)`;
        confetti.style.opacity = String(parseFloat(confetti.style.opacity || '1') - 0.02);

        if (posY < window.innerHeight && parseFloat(confetti.style.opacity) > 0) {
            requestAnimationFrame(animate);
        } else {
            confetti.remove();
        }
    };

    requestAnimationFrame(animate);
}

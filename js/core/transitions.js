/**
 * View Transitions API Integration
 * Smooth transitions between states
 */

/**
 * Execute a view transition if supported
 * @param {() => void | Promise<void>} callback - The state update function
 * @returns {Promise<void>}
 */
export async function viewTransition(callback) {
    if (!document.startViewTransition) {
        callback();
        return;
    }

    const transition = document.startViewTransition(callback);
    await transition.finished;
}

/**
 * Animate an element with FLIP technique
 * @param {HTMLElement} element - Element to animate
 * @param {DOMRect} first - Initial position
 * @param {DOMRect} last - Final position
 * @param {number} duration - Animation duration in ms
 */
export function flipAnimate(element, first, last, duration = 300) {
    const deltaX = first.left - last.left;
    const deltaY = first.top - last.top;
    const deltaW = first.width / last.width;
    const deltaH = first.height / last.height;

    element.animate(
        [
            {
                transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`,
            },
            {
                transform: 'translate(0, 0) scale(1, 1)',
            },
        ],
        {
            duration,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            fill: 'both',
        }
    );
}

/**
 * Stagger animation for multiple elements
 * @param {NodeListOf<HTMLElement>} elements - Elements to animate
 * @param {KeyframeAnimationOptions & {keyframes: Keyframe[] | PropertyIndexedKeyframes | null}} options - Animation options
 * @param {number} staggerDelay - Delay between each element
 */
export function staggerAnimation(elements, options, staggerDelay = 50) {
    elements.forEach((el, i) => {
        el.style.animationDelay = `${i * staggerDelay}ms`;
        el.animate(/** @type {any} */ (options).keyframes, {
            ...options,
            delay: i * staggerDelay,
        });
    });
}

/**
 * Create a ripple effect on click
 * @param {MouseEvent} e - Click event
 * @param {HTMLElement} element - Element to add ripple to
 */
export function createRipple(e, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-effect 0.6s ease-out;
        pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation to CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-effect {
        to {
            transform: scale(2.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

/**
 * Security Utilities
 * XSS prevention and input sanitization
 */

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Raw text input
 * @returns {string} Escaped HTML string
 */
export function escapeHtml(text) {
    if (typeof text !== 'string') {
        return '';
    }

    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
    };

    return text.replace(/[&<>"'`/]/g, char => htmlEscapes[char]);
}

/**
 * Sanitize terminal output to prevent injection
 * @param {string} output - Terminal output text
 * @returns {string} Sanitized output
 */
export function sanitizeTerminalOutput(output) {
    if (typeof output !== 'string') {
        return '';
    }

    // Allow ANSI color codes but escape HTML
    return (
        escapeHtml(output)
            .replace(/&lt;(\/?)(span|b|i|u|code|pre)(.*?)&gt;/g, '<$1$2$3>') // Allow safe HTML
            // eslint-disable-next-line no-control-regex
            .replace(/\x1b\[(\d+)m/g, '')
    ); // Strip ANSI codes (or convert to HTML colors)
}

/**
 * Validate file/directory names
 * @param {string} name - File or directory name
 * @returns {boolean} Whether the name is valid
 */
export function isValidFileName(name) {
    if (typeof name !== 'string') {
        return false;
    }

    // Prevent directory traversal and invalid characters
    // eslint-disable-next-line no-control-regex
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
    const reservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

    return (
        name.length > 0 &&
        name.length <= 255 &&
        !invalidChars.test(name) &&
        !reservedNames.test(name) &&
        !name.includes('..') &&
        name !== '.' &&
        name !== '..'
    );
}

/**
 * Rate limiter for function calls
 * @param {Function} fn - Function to rate limit
 * @param {number} delay - Minimum delay between calls in ms
 * @returns {Function} Rate-limited function
 */
export function rateLimit(fn, delay = 1000) {
    let lastCall = 0;

    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return fn.apply(this, args);
        }
        console.warn('Rate limited: too many calls');
    };
}

/**
 * Content Security Policy nonce generator
 * @returns {string} Random nonce
 */
export function generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
}

/**
 * Verify localStorage integrity
 * @param {string} key - localStorage key
 * @returns {boolean} Whether data is valid
 */
export function verifyStorageIntegrity(key) {
    try {
        const data = localStorage.getItem(key);
        if (!data) {
            return true;
        }

        // Check for suspicious patterns
        const suspicious = [/<script/i, /javascript:/i, /on\w+\s*=/i, /eval\s*\(/i];

        return !suspicious.some(pattern => pattern.test(data));
    } catch {
        return false;
    }
}

/**
 * Safe JSON parse with fallback
 * @param {string} json - JSON string
 * @param {*} fallback - Fallback value if parse fails
 * @returns {*} Parsed object or fallback
 */
export function safeJsonParse(json, fallback = null) {
    try {
        return JSON.parse(json);
    } catch (e) {
        console.warn('JSON parse error:', e);
        return fallback;
    }
}

/**
 * Clear all potentially sensitive data
 */
export function clearSensitiveData() {
    const keysToKeep = ['theme', 'soundMuted', 'hasSeenNavHint', 'hasSeenSwipeHint'];

    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
        }
    }
}

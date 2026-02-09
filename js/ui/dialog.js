/**
 * Custom Dialog - Replacement for browser's prompt()
 * Creates a themed input dialog that matches the OS style
 */

/**
 * Escape HTML entities to prevent XSS attacks
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for HTML insertion
 */
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

export function showInputDialog(title, placeholder = '') {
    return new Promise((resolve) => {
        // Escape user-provided inputs to prevent XSS
        const safeTitle = escapeHtml(title);
        const safePlaceholder = escapeHtml(placeholder);

        // Remove existing dialog if any
        const existing = document.getElementById('custom-input-dialog');
        if (existing) existing.remove();

        // Create dialog elements
        const overlay = document.createElement('div');
        overlay.id = 'custom-input-dialog';
        overlay.className = 'dialog-overlay';
        overlay.innerHTML = `
            <div class="dialog-window">
                <div class="dialog-header">
                    <span class="dialog-title">${safeTitle}</span>
                    <button class="dialog-close" aria-label="Close"><i class="fas fa-times"></i></button>
                </div>
                <div class="dialog-body">
                    <input type="text" class="dialog-input" placeholder="${safePlaceholder}" autofocus />
                </div>
                <div class="dialog-footer">
                    <button class="dialog-btn dialog-cancel">Cancel</button>
                    <button class="dialog-btn dialog-confirm">OK</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Get elements
        const input = overlay.querySelector('.dialog-input');
        const confirmBtn = overlay.querySelector('.dialog-confirm');
        const cancelBtn = overlay.querySelector('.dialog-cancel');
        const closeBtn = overlay.querySelector('.dialog-close');

        // Focus input
        setTimeout(() => input.focus(), 50);

        // Event handlers
        function submit() {
            const value = input.value.trim();
            cleanup();
            resolve(value || null);
        }

        function cancel() {
            cleanup();
            resolve(null);
        }

        function cleanup() {
            overlay.classList.add('closing');
            setTimeout(() => overlay.remove(), 200);
        }

        confirmBtn.addEventListener('click', submit);
        cancelBtn.addEventListener('click', cancel);
        closeBtn.addEventListener('click', cancel);

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') cancel();
        });

        // Click outside to cancel
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cancel();
        });

        // Animate in
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
        });
    });
}

export default { showInputDialog };

/**
 * Custom Dialog - Replacement for browser's prompt()
 * Creates a themed input dialog that matches the OS style
 * Uses safe DOM APIs (createElement/textContent) to prevent XSS
 */

/**
 * Helper to create an element with optional className, attributes, and text
 */
function createEl(tag, className, textContent) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent) el.textContent = textContent;
    return el;
}

export function showInputDialog(title, placeholder = '') {
    return new Promise((resolve) => {
        // Remove existing dialog if any
        const existing = document.getElementById('custom-input-dialog');
        if (existing) existing.remove();

        // Build dialog DOM safely with createElement (no innerHTML)
        const overlay = createEl('div', 'dialog-overlay');
        overlay.id = 'custom-input-dialog';

        const dialogWindow = createEl('div', 'dialog-window');

        // Header
        const header = createEl('div', 'dialog-header');
        const titleSpan = createEl('span', 'dialog-title', title);
        const closeBtn = createEl('button', 'dialog-close');
        closeBtn.setAttribute('aria-label', 'Close');
        const closeIcon = createEl('i', 'fas fa-times');
        closeBtn.appendChild(closeIcon);
        header.appendChild(titleSpan);
        header.appendChild(closeBtn);

        // Body
        const body = createEl('div', 'dialog-body');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'dialog-input';
        input.placeholder = placeholder;
        input.autofocus = true;
        body.appendChild(input);

        // Footer
        const footer = createEl('div', 'dialog-footer');
        const cancelBtn = createEl('button', 'dialog-btn dialog-cancel', 'Cancel');
        const confirmBtn = createEl('button', 'dialog-btn dialog-confirm', 'OK');
        footer.appendChild(cancelBtn);
        footer.appendChild(confirmBtn);

        // Assemble
        dialogWindow.appendChild(header);
        dialogWindow.appendChild(body);
        dialogWindow.appendChild(footer);
        overlay.appendChild(dialogWindow);
        document.body.appendChild(overlay);

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

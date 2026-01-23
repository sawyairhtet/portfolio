/**
 * Custom Dialog - Replacement for browser's prompt()
 * Creates a themed input dialog that matches the OS style
 */

let dialogResolve = null;

export function showInputDialog(title, placeholder = '') {
    return new Promise((resolve) => {
        dialogResolve = resolve;

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
                    <span class="dialog-title">${title}</span>
                    <button class="dialog-close" aria-label="Close"><i class="fas fa-times"></i></button>
                </div>
                <div class="dialog-body">
                    <input type="text" class="dialog-input" placeholder="${placeholder}" autofocus />
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
            dialogResolve = null;
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

// Inject dialog styles if not already present
export function injectDialogStyles() {
    if (document.getElementById('dialog-styles')) return;

    const style = document.createElement('style');
    style.id = 'dialog-styles';
    style.textContent = `
        .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        
        .dialog-overlay.visible {
            opacity: 1;
        }
        
        .dialog-overlay.closing {
            opacity: 0;
        }
        
        .dialog-window {
            background: var(--color-window-body-bg, #fff);
            border-radius: var(--radius-md, 8px);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
            min-width: 320px;
            max-width: 90%;
            transform: scale(0.9);
            transition: transform 0.2s ease;
        }
        
        .dialog-overlay.visible .dialog-window {
            transform: scale(1);
        }
        
        .dialog-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: var(--color-header-bg, #e0e0e0);
            border-radius: var(--radius-md, 8px) var(--radius-md, 8px) 0 0;
        }
        
        .dialog-title {
            font-weight: 600;
            font-size: 14px;
            color: var(--color-header-text, #333);
        }
        
        .dialog-close {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: var(--color-header-text, #333);
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        
        .dialog-close:hover {
            opacity: 1;
        }
        
        .dialog-body {
            padding: 20px 16px;
        }
        
        .dialog-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--color-border, #ccc);
            border-radius: var(--radius-sm, 6px);
            font-size: 14px;
            font-family: inherit;
            background: var(--color-card-bg, #f5f5f5);
            color: var(--color-window-body-text, #333);
            outline: none;
            transition: border-color 0.2s;
        }
        
        .dialog-input:focus {
            border-color: var(--color-primary, #E95420);
        }
        
        .dialog-footer {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            padding: 12px 16px;
            border-top: 1px solid var(--color-border, #ccc);
        }
        
        .dialog-btn {
            padding: 8px 16px;
            border-radius: var(--radius-sm, 6px);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            font-family: inherit;
        }
        
        .dialog-cancel {
            background: var(--color-card-bg, #e0e0e0);
            color: var(--color-window-body-text, #333);
        }
        
        .dialog-cancel:hover {
            background: var(--color-border, #ccc);
        }
        
        .dialog-confirm {
            background: var(--color-primary, #E95420);
            color: #fff;
        }
        
        .dialog-confirm:hover {
            filter: brightness(1.1);
        }
    `;
    document.head.appendChild(style);
}

export default { showInputDialog, injectDialogStyles };

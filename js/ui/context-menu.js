/**
 * Context Menu
 * Handles right-click context menu on desktop
 */

import { showInputDialog } from './dialog.js';
import { terminalCommands } from '../apps/terminal.js';
import { openWindow } from '../core/window-manager.js';

export function setupContextMenu(currentOS) {
    const contextMenu = document.getElementById('context-menu');
    if (!contextMenu) return;

    // Accessibility: Add ARIA roles
    contextMenu.setAttribute('role', 'menu');
    contextMenu.setAttribute('aria-hidden', 'true');
    
    const menuItems = contextMenu.querySelectorAll('.context-menu-item');
    menuItems.forEach(item => {
        item.setAttribute('role', 'menuitem');
        item.setAttribute('tabindex', '-1'); // Manage focus manually
    });

    document.querySelector('.main-content').addEventListener('contextmenu', (e) => {
        if (currentOS !== 'desktop') return;
        
        if (e.target.closest('.window') || e.target.closest('.app-icon') || e.target.closest('.dock')) {
            return;
        }

        e.preventDefault();

        let x = e.clientX;
        let y = e.clientY;

        const menuWidth = 180;
        const menuHeight = 200;
        if (x + menuWidth > window.innerWidth) x -= menuWidth;
        if (y + menuHeight > window.innerHeight) y -= menuHeight;

        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.add('visible');
        contextMenu.setAttribute('aria-hidden', 'false');

        // Accessibility: Focus first item
        const firstItem = contextMenu.querySelector('.context-menu-item');
        if (firstItem) {
            firstItem.focus();
        }
    });

    const closeMenu = () => {
        contextMenu.classList.remove('visible');
        contextMenu.setAttribute('aria-hidden', 'true');
    };

    document.addEventListener('click', closeMenu);
    document.addEventListener('scroll', closeMenu);

    // Keyboard Navigation
    contextMenu.addEventListener('keydown', (e) => {
        const items = Array.from(contextMenu.querySelectorAll('.context-menu-item'));
        const currentIndex = items.indexOf(document.activeElement);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % items.length;
            items[nextIndex].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + items.length) % items.length;
            items[prevIndex].focus();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeMenu();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentIndex !== -1) {
                items[currentIndex].click();
            }
        }
    });

    menuItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            e.stopPropagation();
            const action = item.dataset.action;
            await handleContextMenuAction(action);
            closeMenu();
        });
        
        // Allow triggering via Enter key (if standard button behavior doesn't catch it)
        // But the container keydown handles 'Enter' for menuitems mostly.
    });
}

async function handleContextMenuAction(action) {
    switch (action) {
        case 'new-folder':
            const folderName = await showInputDialog('Create New Folder', 'Enter folder name...');
            if (folderName && folderName.trim()) {
                terminalCommands.mkdir([folderName.trim()]);
            }
            break;
        case 'new-file':
            const fileName = await showInputDialog('Create New File', 'Enter file name...');
            if (fileName && fileName.trim()) {
                terminalCommands.touch([fileName.trim()]);
            }
            break;
        case 'refresh':
            window.location.reload();
            break;
        case 'terminal':
            openWindow('terminal');
            break;
        case 'settings':
            openWindow('settings');
            break;
        default:
            break;
    }
}

export default { setupContextMenu };

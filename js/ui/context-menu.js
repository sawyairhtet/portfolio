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
    });

    document.addEventListener('click', () => {
        contextMenu.classList.remove('visible');
    });

    document.addEventListener('scroll', () => {
        contextMenu.classList.remove('visible');
    });

    contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.stopPropagation();
            const action = item.dataset.action;
            await handleContextMenuAction(action);
            contextMenu.classList.remove('visible');
        });
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

/**
 * Terminal Application
 * Handles all terminal commands and filesystem operations
 */

import { startMatrixEffect } from './matrix.js';
import {
    DEFAULT_FILE_SYSTEM,
    terminalFortunes,
    terminalJokes,
    terminalGreetings,
} from '../config/data.js';
import { escapeHtml, isValidFileName, safeJsonParse } from '../core/security.js';

// State
const terminalHistory = [];
let historyIndex = -1;
let currentPath = '/home/visitor';

// Load filesystem from localStorage or use default
let fileSystem;
try {
    const stored = localStorage.getItem('portfolioFileSystem');
    fileSystem = safeJsonParse(stored, null) || JSON.parse(JSON.stringify(DEFAULT_FILE_SYSTEM));
} catch (e) {
    console.error('Failed to load filesystem from localStorage:', e);
    fileSystem = JSON.parse(JSON.stringify(DEFAULT_FILE_SYSTEM));
}

function saveFileSystem() {
    try {
        localStorage.setItem('portfolioFileSystem', JSON.stringify(fileSystem));
    } catch (e) {
        console.error('Failed to save filesystem:', e);
        // Import showToast dynamically to avoid circular dependency
        import('../ui/notifications.js').then(module => {
            module.showToast('Unable to save changes - storage full', 'fa-exclamation-triangle');
        });
    }
}

function resetFileSystem() {
    fileSystem = JSON.parse(JSON.stringify(DEFAULT_FILE_SYSTEM));
    saveFileSystem();
}

function resolvePath(inputPath) {
    if (!inputPath) {
        return currentPath;
    }

    let path = inputPath;

    if (path === '~') {
        return '/home/visitor';
    }
    if (path.startsWith('~/')) {
        path = '/home/visitor' + path.slice(1);
    }

    if (!path.startsWith('/')) {
        path = currentPath + '/' + path;
    }

    const parts = path.split('/').filter(p => p !== '' && p !== '.');
    const stack = [];

    for (const part of parts) {
        if (part === '..') {
            stack.pop();
        } else {
            stack.push(part);
        }
    }

    return '/' + stack.join('/') || '/';
}

// Terminal Commands
const terminalCommands = {
    help: () => {
        return `Available commands:
  ls [dir]      - List directory contents
  cd <dir>      - Change directory
  pwd           - Print working directory
  cat <file>    - View file contents
  touch <file>  - Create an empty file
  mkdir <dir>   - Create a directory
  rm <file>     - Remove a file
  rmdir <dir>   - Remove an empty directory
  whoami        - Display bio information
  contact       - Show contact information
  projects      - List all projects
  skills        - Display technical skills
  echo [text]   - Echo back your text
  clear         - Clear terminal output
  date          - Show current date/time
  help          - Show this help message
  
  // Easter eggs:
  cowsay, fortune, joke, flip, unflip,
  sudo, matrix, hello, neofetch`;
    },

    pwd: () => currentPath,

    ls: args => {
        const targetPath = resolvePath(args[0]);
        const node = fileSystem[targetPath];

        if (!node) {
            return `ls: cannot access '${args[0] || targetPath}': No such file or directory`;
        }

        if (node.type === 'file') {
            return args[0] || targetPath.split('/').pop();
        }

        if (!node.children || node.children.length === 0) {
            return '';
        }

        return node.children
            .map(child => {
                const childPath = targetPath === '/' ? '/' + child : targetPath + '/' + child;
                const childNode = fileSystem[childPath];
                if (childNode && childNode.type === 'dir') {
                    return '📁 ' + child + '/';
                } else {
                    return '📄 ' + child;
                }
            })
            .join('\n');
    },

    cd: args => {
        if (!args[0] || args[0] === '~') {
            currentPath = '/home/visitor';
            return '';
        }

        const targetPath = resolvePath(args[0]);
        const node = fileSystem[targetPath];

        if (!node) {
            return `cd: ${args[0]}: No such file or directory`;
        }

        if (node.type !== 'dir') {
            return `cd: ${args[0]}: Not a directory`;
        }

        currentPath = targetPath;
        return '';
    },

    cat: args => {
        if (!args[0]) {
            return 'Usage: cat <filename>';
        }

        const targetPath = resolvePath(args[0]);
        const node = fileSystem[targetPath];

        if (!node) {
            return `cat: ${args[0]}: No such file or directory`;
        }

        if (node.type === 'dir') {
            return `cat: ${args[0]}: Is a directory`;
        }

        return node.content;
    },

    whoami: () => {
        return `Saw Ye Htet
IT Student & Software Engineer

I'm an IT Student at Singapore Polytechnic passionate about software 
engineering, VR development, and creating meaningful digital solutions.

Currently available for opportunities!`;
    },

    contact: () => {
        return `Contact Information:
─────────────────────
Email:    minwn2244@gmail.com
LinkedIn: linkedin.com/in/saw-ye-htet-the-man-who-code/
GitHub:   github.com/sawyairhtet
X:        x.com/saulyehtet_`;
    },

    projects: () => {
        return `Projects:
─────────────────────
1. Jewelry Shop Robbery VR  - VR heist game for Meta Quest with hand tracking
2. Ubuntu Portfolio         - This website! GNOME-styled portfolio

Type 'cat /home/visitor/projects/README.md' for more details.`;
    },

    skills: () => {
        return `Technical Skills:
─────────────────────
Languages:    JavaScript ES6+, Python 3.x, C# .NET, SQL
Frontend:     HTML5, CSS3, React, Next.js, Tailwind CSS
Backend:      Node.js, Flask, RESTful APIs
Tools:        Git, VS Code, Unity, Figma
Specialties:  VR Development, Responsive Web Design, UI/UX`;
    },

    echo: args => args.join(' ') || 'Usage: echo [text]',

    clear: () => {
        const output = document.getElementById('terminal-output');
        if (output) {
            output.innerHTML = '';
        }
        return '';
    },

    date: () => new Date().toString(),

    // File operations
    touch: args => {
        if (!args[0]) {
            return 'Usage: touch <filename>';
        }

        if (!isValidFileName(args[0])) {
            return `touch: invalid filename '${args[0]}'`;
        }

        const targetPath = resolvePath(args[0]);
        const fileName = targetPath.split('/').pop();
        const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/')) || '/';
        const parentNode = fileSystem[parentPath];

        if (fileSystem[targetPath]) {
            return `touch: cannot create '${args[0]}': File exists`;
        }

        if (!parentNode || parentNode.type !== 'dir') {
            return `touch: cannot create '${args[0]}': No such directory`;
        }

        fileSystem[targetPath] = { type: 'file', content: '' };
        parentNode.children.push(fileName);
        saveFileSystem();

        return `Created file: ${fileName}`;
    },

    mkdir: args => {
        if (!args[0]) {
            return 'Usage: mkdir <dirname>';
        }

        if (!isValidFileName(args[0])) {
            return `mkdir: invalid directory name '${args[0]}'`;
        }

        const targetPath = resolvePath(args[0]);
        const dirName = targetPath.split('/').pop();
        const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/')) || '/';
        const parentNode = fileSystem[parentPath];

        if (fileSystem[targetPath]) {
            return `mkdir: cannot create directory '${args[0]}': File exists`;
        }

        if (!parentNode || parentNode.type !== 'dir') {
            return `mkdir: cannot create directory '${args[0]}': No such directory`;
        }

        fileSystem[targetPath] = { type: 'dir', children: [] };
        parentNode.children.push(dirName);
        saveFileSystem();

        return `Created directory: ${dirName}`;
    },

    rm: args => {
        if (!args[0]) {
            return 'Usage: rm <filename>';
        }

        const targetPath = resolvePath(args[0]);
        const node = fileSystem[targetPath];

        if (!node) {
            return `rm: cannot remove '${args[0]}': No such file or directory`;
        }

        if (node.type === 'dir') {
            return `rm: cannot remove '${args[0]}': Is a directory (use rmdir)`;
        }

        if (!targetPath.startsWith('/home/visitor/')) {
            return `rm: cannot remove '${args[0]}': Permission denied`;
        }

        const fileName = targetPath.split('/').pop();
        const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/'));
        const parentNode = fileSystem[parentPath];

        if (parentNode && parentNode.children) {
            parentNode.children = parentNode.children.filter(c => c !== fileName);
        }

        delete fileSystem[targetPath];
        saveFileSystem();

        return `Removed: ${args[0]}`;
    },

    rmdir: args => {
        if (!args[0]) {
            return 'Usage: rmdir <dirname>';
        }

        const targetPath = resolvePath(args[0]);
        const node = fileSystem[targetPath];

        if (!node) {
            return `rmdir: failed to remove '${args[0]}': No such file or directory`;
        }

        if (node.type !== 'dir') {
            return `rmdir: failed to remove '${args[0]}': Not a directory`;
        }

        if (node.children && node.children.length > 0) {
            return `rmdir: failed to remove '${args[0]}': Directory not empty`;
        }

        if (!targetPath.startsWith('/home/visitor/') || targetPath === '/home/visitor') {
            return `rmdir: failed to remove '${args[0]}': Permission denied`;
        }

        const dirName = targetPath.split('/').pop();
        const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/'));
        const parentNode = fileSystem[parentPath];

        if (parentNode && parentNode.children) {
            parentNode.children = parentNode.children.filter(c => c !== dirName);
        }

        delete fileSystem[targetPath];
        saveFileSystem();

        return `Removed directory: ${args[0]}`;
    },

    'reset-fs': () => {
        resetFileSystem();
        return 'Filesystem reset to default.\nAll user-created files and folders have been removed.';
    },

    'reset-icons': () => {
        localStorage.removeItem('appIconPositions');
        localStorage.removeItem('stickyNotePositions_v3');
        return 'Desktop icons reset to default positions.\nRefresh the page to see changes.';
    },

    // Easter eggs
    sudo: () => `Nice try! 😏\n\nBut you're not root here. Maybe ask nicely?`,

    matrix: () => {
        startMatrixEffect();
        return 'Entering the Matrix... (Press any key to exit)';
    },

    hello: () => terminalGreetings[Math.floor(Math.random() * terminalGreetings.length)],

    neofetch: () => `
         .............'cdddl,.
        .,;:::::::::,'..;oooooc.
       .coooooooooool' .,oooooooc.
       coooooooooooooc. .;loooooool.
      .cooooooooooooooc;;;:cloooooooc.
      :ooooooooooooooooooooooooooooool.
      cooooooooooooooool;'',;coooooool'
     .cooooooooooooool;.   .,looooooo:
      coooooooooooool,  ...';cooooool.
      .:oooooooooooo:   .:looooooooo.    visitor@portfolio
       .cooooooooool.  .coooooooooc'    ─────────────────
        ;ooooooooooo:. ;oooooooool.     OS: Ubuntu 24.04 LTS
         cooooooooooo:,cooooooooc       Host: Saw Ye Htet's Portfolio
          ,looooooooooooooooool.        Uptime: Since you landed here
           .:looooooooooooool,.         Shell: JavaScript ES6+
             .,:cloooooolc:'.           Theme: Yaru (Dark)
                ..,,,,,...              Memory: Lots of dreams`,

    cowsay: args => {
        const message = args.join(' ') || 'Moo!';
        const line = '─'.repeat(Math.min(message.length + 2, 40));
        return `
 ${line}
< ${message} >
 ${line}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
    },

    fortune: () => terminalFortunes[Math.floor(Math.random() * terminalFortunes.length)],

    joke: () => terminalJokes[Math.floor(Math.random() * terminalJokes.length)],

    flip: () => '(╯°□°)╯︵ ┻━┻',

    unflip: () => '┬─┬ノ( º _ ºノ)',
};

export function executeTerminalCommand(input) {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
        return '';
    }

    // Check for output redirect (#26): echo "text" > file
    const redirectMatch = trimmedInput.match(/^(.+?)\s*>\s*(.+)$/);
    if (redirectMatch) {
        const [, commandPart, filePath] = redirectMatch;
        const [cmd, ...args] = commandPart.trim().split(' ');
        const command = cmd.toLowerCase();

        // Only echo supports redirect for now
        if (command === 'echo') {
            const content = args.join(' ').replace(/^["']|["']$/g, ''); // Remove quotes
            const resolvedPath = resolvePath(filePath.trim());
            const fileName = resolvedPath.split('/').pop();
            const parentPath = resolvedPath.substring(0, resolvedPath.lastIndexOf('/')) || '/';
            const parentNode = fileSystem[parentPath];

            // Check parent directory exists
            if (!parentNode || parentNode.type !== 'dir') {
                return `No such directory: ${parentPath}`;
            }

            // Write file using flat path key
            if (!fileSystem[resolvedPath]) {
                // New file - add to parent's children
                fileSystem[resolvedPath] = { type: 'file', content: content };
                if (!parentNode.children.includes(fileName)) {
                    parentNode.children.push(fileName);
                }
            } else if (fileSystem[resolvedPath].type === 'file') {
                // Overwrite existing file
                fileSystem[resolvedPath].content = content;
            } else {
                return `Cannot write to directory: ${resolvedPath}`;
            }

            saveFileSystem();
            return ''; // No output on success
        }
    }

    const [cmd, ...args] = trimmedInput.split(' ');
    const command = cmd.toLowerCase();

    if (terminalCommands[command]) {
        return terminalCommands[command](args);
    }

    return `Command not found: ${cmd}
Type 'help' for available commands.`;
}

export function addTerminalOutput(command, output) {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) {
        return;
    }

    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line terminal-command';
    commandLine.textContent = `visitor@portfolio:~$ ${escapeHtml(command)}`;
    terminalOutput.appendChild(commandLine);

    if (output) {
        // Use pre element for ASCII art preservation (#25)
        const outputEl = document.createElement('pre');
        outputEl.className = 'terminal-line';
        outputEl.style.margin = '0';
        outputEl.style.fontFamily = 'inherit';
        outputEl.textContent = output; // Output is already escaped by individual commands
        terminalOutput.appendChild(outputEl);
    }

    terminalOutput.parentElement.scrollTop = terminalOutput.parentElement.scrollHeight;
}

export function setupTerminal() {
    const terminalInput = /** @type {HTMLInputElement} */ (
        document.getElementById('terminal-input')
    );
    const terminalSubmit = document.getElementById('terminal-submit');
    if (!terminalInput) {
        return;
    }

    function runCommand() {
        const command = terminalInput.value;
        const output = executeTerminalCommand(command);

        if (command.trim()) {
            addTerminalOutput(command, output);
            terminalHistory.push(command);
            historyIndex = terminalHistory.length;
        }

        terminalInput.value = '';
    }

    terminalInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            runCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = terminalHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < terminalHistory.length - 1) {
                historyIndex++;
                terminalInput.value = terminalHistory[historyIndex];
            } else {
                historyIndex = terminalHistory.length;
                terminalInput.value = '';
            }
        }
    });

    if (terminalSubmit) {
        terminalSubmit.addEventListener('click', () => {
            runCommand();
            terminalInput.focus();
        });
    }
}

export function setupTerminalMobileFix() {
    const terminalInput = /** @type {HTMLInputElement} */ (
        document.getElementById('terminal-input')
    );
    const terminalWindow = document.getElementById('terminal-window');

    if (!terminalInput || !terminalWindow) {
        return;
    }

    terminalInput.addEventListener('focus', () => {
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                terminalWindow.querySelector('.window-body').scrollTop =
                    terminalWindow.querySelector('.window-body').scrollHeight;
                terminalWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    });
}

// Export terminal commands for context menu use
export { terminalCommands };

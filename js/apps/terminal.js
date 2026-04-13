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

// State
const terminalHistory = [];
let historyIndex = -1;
let currentPath = '/home/visitor';

// Load filesystem from localStorage or use default
let fileSystem;
try {
    fileSystem =
        JSON.parse(localStorage.getItem('portfolioFileSystem')) ||
        JSON.parse(JSON.stringify(DEFAULT_FILE_SYSTEM));
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
  history       - Show command history
  uptime        - Show session uptime
  man <cmd>     - Read the manual
  ping <host>   - Ping a host
  ssh <target>  - Connect to a service
  git log       - View commit history
  help          - Show this help message
  
  // Easter eggs:
  cowsay, fortune, joke, flip, unflip,
  sudo, matrix, hello, neofetch

  // Hidden commands exist... try to find them all!`;
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
            output.replaceChildren();
        }
        return '';
    },

    date: () => new Date().toString(),

    // File operations
    touch: args => {
        if (!args[0]) {
            return 'Usage: touch <filename>';
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

    // New immersive commands
    history: () => {
        if (terminalHistory.length === 0) {
            return 'No commands in history.';
        }
        return terminalHistory.map((cmd, i) => `  ${String(i + 1).padStart(4)}  ${cmd}`).join('\n');
    },

    uptime: () => {
        const now = Date.now();
        const start = /** @type {any} */ (window).__portfolioLoadTime || now;
        const diff = Math.floor((now - start) / 1000);
        const mins = Math.floor(diff / 60);
        const secs = diff % 60;
        return ` ${new Date().toLocaleTimeString()} up ${mins} min ${secs} sec,  1 user,  load average: 0.42, 0.15, 0.08`;
    },

    man: args => {
        if (!args[0]) {
            return 'What manual page do you want?\nUsage: man <command>';
        }
        const manPages = {
            ls: 'ls - list directory contents\n\nSYNOPSIS: ls [dir]\n\nDESCRIPTION:\n  List information about files in the current directory or the specified directory.',
            cat: 'cat - concatenate files and print on the standard output\n\nSYNOPSIS: cat <file>\n\nDESCRIPTION:\n  Read file contents. Try: cat resume.txt',
            cd: 'cd - change the working directory\n\nSYNOPSIS: cd <dir>\n\nDESCRIPTION:\n  Change the current directory. Use ~ for home.',
            ssh: 'ssh - OpenSSH remote login client\n\nSYNOPSIS: ssh <target>\n\nAVAILABLE TARGETS:\n  github, linkedin, twitter',
            sudo: 'sudo - execute a command as another user\n\nDESCRIPTION:\n  Nice try reading the manual for sudo.\n  Try: sudo hire me',
        };
        return manPages[args[0]] || `No manual entry for ${args[0]}`;
    },

    ping: args => {
        if (!args[0]) {
            return 'Usage: ping <host>';
        }
        const host = args[0];
        const ms = () => (Math.random() * 30 + 5).toFixed(1);
        return `PING ${host} (127.0.0.1) 56(84) bytes of data.
64 bytes from ${host}: icmp_seq=1 ttl=64 time=${ms()} ms
64 bytes from ${host}: icmp_seq=2 ttl=64 time=${ms()} ms
64 bytes from ${host}: icmp_seq=3 ttl=64 time=${ms()} ms

--- ${host} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss
rtt min/avg/max = ${ms()}/${ms()}/${ms()} ms`;
    },

    ssh: args => {
        if (!args[0]) {
            return 'Usage: ssh <target>\nAvailable: github, linkedin, twitter';
        }
        const targets = {
            github: 'https://github.com/sawyairhtet',
            linkedin: 'https://www.linkedin.com/in/saw-ye-htet-the-man-who-code/',
            twitter: 'https://x.com/saulyehtet_',
            x: 'https://x.com/saulyehtet_',
        };
        const url = targets[args[0].toLowerCase()];
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
            return `Connecting to ${args[0]}... Connection established.\nOpened in new tab.`;
        }
        return `ssh: Could not resolve hostname ${args[0]}: Name or service not known\nAvailable: github, linkedin, twitter`;
    },

    git: args => {
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'log' || (sub === 'log' && args[1] === '--oneline')) {
            return `\x1b[33mf4a2c1e\x1b[0m add wallpaper customization to settings
\x1b[33m3b1d7f2\x1b[0m finally fix that one CSS bug (attempt #47)
\x1b[33m7c5b3a1\x1b[0m implement command palette (ctrl+k supremacy)
\x1b[33m2f8d6e9\x1b[0m 3am commit: "it works, don't ask how"
\x1b[33me1c4a7b\x1b[0m refactor terminal to feel like a real shell
\x1b[33m8d2f5c3\x1b[0m add VR project showcase
\x1b[33m5a9b1d4\x1b[0m initial commit: the ubuntu dream begins
\x1b[33mc3e7f2a\x1b[0m README: "it's not a bug, it's a feature"`.replace(/\x1b\[\d+m/g, '');
        }
        if (sub === 'status') {
            return `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
(but there's always something to improve)`;
        }
        if (sub === 'blame') {
            return `It was Saw Ye Htet. It's always Saw Ye Htet.`;
        }
        return `git: '${args[0] || ''}' is not a git command.\nTry: git log, git status, git blame`;
    },

    // Easter eggs
    sudo: args => {
        const subCommand = args.join(' ').toLowerCase();
        if (subCommand === 'hire me') {
            return `
╔═══════════════════════════════════════════════╗
║                                               ║
║   🎉  SUDO HIRE ME - ACCESS GRANTED  🎉      ║
║                                               ║
║   Name:   Saw Ye Htet                         ║
║   Role:   Software Engineer / VR Developer    ║
║   Email:  minwn2244@gmail.com                 ║
║   Status: Available & Ready to Ship Code      ║
║                                               ║
║   Strengths:                                  ║
║   ✓ Builds VR games with hand tracking        ║
║   ✓ Makes portfolio sites that are entire OSes║
║   ✓ Writes clean, documented code             ║
║   ✓ Debugs at 3am fueled by Coke Light        ║
║                                               ║
╚═══════════════════════════════════════════════╝`;
        }
        if (subCommand === 'rm -rf /') {
            return '🚨 Nice try! This portfolio is indestructible.\n(But I appreciate the chaos energy)';
        }
        if (subCommand === 'apt install talent') {
            return 'talent is already the newest version (99.9.9).\n0 upgraded, 0 newly installed, 0 to remove.';
        }
        return `[sudo] password for visitor: \nSorry, try again. 😏\n\nHint: try "sudo hire me"`;
    },

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
             .,:cloooooolc:'.           Theme: Yaru (Light)
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

            // Security: restrict writes to /home/visitor/ to prevent path traversal
            if (!resolvedPath.startsWith('/home/visitor/')) {
                return `Permission denied: cannot write outside /home/visitor/`;
            }

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
    commandLine.textContent = `visitor@portfolio:~$ ${command}`;
    terminalOutput.appendChild(commandLine);

    if (output) {
        // Use pre element for ASCII art preservation (#25)
        const outputEl = document.createElement('pre');
        outputEl.className = 'terminal-line';
        outputEl.style.margin = '0';
        outputEl.style.fontFamily = 'inherit';
        outputEl.textContent = output;
        terminalOutput.appendChild(outputEl);
    }

    const terminalBody = terminalOutput.parentElement;
    if (terminalBody) {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
}

export function setupTerminal() {
    /** @type {any} */
    const terminalInput = document.getElementById('terminal-input');
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
    /** @type {any} */
    const terminalInput = document.getElementById('terminal-input');
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

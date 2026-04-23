/**
 * Terminal Application
 * Handles all terminal commands and filesystem operations
 */

import { showToast } from '../ui/notifications.js';
import {
    DEFAULT_FILE_SYSTEM,
    BOOT_LOG_MESSAGES,
    terminalFortunes,
    terminalJokes,
} from '../config/data.js';

// State
const terminalHistory = [];
let historyIndex = -1;
let currentPath = '/home/sawyehtet';

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

/** @returns {void} */
function saveFileSystem() {
    try {
        localStorage.setItem('portfolioFileSystem', JSON.stringify(fileSystem));
    } catch (e) {
        console.error('Failed to save filesystem:', e);
        showToast('Unable to save changes - storage full', 'fa-exclamation-triangle');
    }
}

/** @returns {void} */
function resetFileSystem() {
    fileSystem = JSON.parse(JSON.stringify(DEFAULT_FILE_SYSTEM));
    saveFileSystem();
}

/**
 * Resolves a relative or special path to an absolute filesystem path.
 * @param {string} [inputPath]
 * @returns {string}
 */
function resolvePath(inputPath) {
    if (!inputPath) {return currentPath;}

    let path = inputPath;

    if (path === '~') {return '/home/sawyehtet';}
    if (path.startsWith('~/')) {path = '/home/sawyehtet' + path.slice(1);}

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

  Navigation:
    ls [dir]        List directory contents
    cd <dir>        Change directory
    pwd             Print working directory
    cat <file>      View file contents

  File Operations:
    touch <file>    Create an empty file
    mkdir <dir>     Create a directory
    rm <file>       Remove a file
    rmdir <dir>     Remove an empty directory

  Identity:
    whoami          Display bio information
    hostname        Show hostname
    id              Show user ID info
    contact         Show contact information

  System:
    uname [-a|-r|-o]  System information
    neofetch        System info with ASCII art
    df -h           Disk usage
    free -h         Memory usage
    ps aux          Process list
    systemctl status  Service status
    uptime          Show uptime
    date            Current date/time

  Package Manager:
    dnf --version   DNF version
    dnf list        List packages
    dnf search <q>  Search packages

  Dev Tools:
    python3 --version  Python version
    node --version     Node.js version
    git --version      Git version
    git log --oneline  Commit history
    git status         Repo status

  Portfolio:
    projects        List all projects
    skills          Display technical skills
    ssh github      Open GitHub profile
    man <cmd>       Manual page for command
    echo [text]     Echo text
    clear           Clear terminal
    reboot          Restart the desktop

    Easter Eggs:
        fortune, joke, sudo hire me`;
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
            currentPath = '/home/sawyehtet';
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
2. Fedora Portfolio         - This website! GNOME 49-styled portfolio

Type 'cat /home/sawyehtet/projects/README.md' for more details.`;
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

    echo: args => {
        if (!args || args.length === 0) {return 'Usage: echo [text]';}
        const text = args.join(' ');
        const envVars = {
            '$SHELL': '/bin/bash',
            '$USER': 'sawyehtet',
            '$DESKTOP_SESSION': 'gnome-wayland',
            '$XDG_SESSION_TYPE': 'wayland',
            '$HOME': '/home/sawyehtet',
            '$TERM': 'xterm-256color',
            '$LANG': 'en_US.UTF-8',
            '$PATH': '/usr/local/bin:/usr/bin:/bin',
        };
        // Direct env var lookup
        if (envVars[text]) {return envVars[text];}
        // Replace env vars in text
        return text.replace(/\$[A-Z_]+/g, match => envVars[match] || match);
    },

    clear: () => {
        const output = document.getElementById('terminal-output');
        if (output) {output.innerHTML = '';}
        return '';
    },

    date: () => new Date().toString(),

    // File operations
    touch: args => {
        if (!args[0]) {return 'Usage: touch <filename>';}

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
        if (!args[0]) {return 'Usage: mkdir <dirname>';}

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
        if (!args[0]) {return 'Usage: rm <filename>';}

        const targetPath = resolvePath(args[0]);
        const node = fileSystem[targetPath];

        if (!node) {
            return `rm: cannot remove '${args[0]}': No such file or directory`;
        }

        if (node.type === 'dir') {
            return `rm: cannot remove '${args[0]}': Is a directory (use rmdir)`;
        }

        if (!targetPath.startsWith('/home/sawyehtet/')) {
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
        if (!args[0]) {return 'Usage: rmdir <dirname>';}

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

        if (!targetPath.startsWith('/home/sawyehtet/') || targetPath === '/home/sawyehtet') {
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
    hostname: () => 'fedora',

    id: () => 'uid=1000(sawyehtet) gid=1000(sawyehtet) groups=1000(sawyehtet),10(wheel)',

    uname: args => {
        if (!args || args.length === 0) {
            return 'Linux';
        }
        const flag = args[0];
        if (flag === '-a') {
            return 'Linux fedora 6.11.4-301.fc43.x86_64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
        }
        if (flag === '-r') {
            return '6.11.4-301.fc43.x86_64';
        }
        if (flag === '-o') {
            return 'GNU/Linux';
        }
        if (flag === '-s') {
            return 'Linux';
        }
        if (flag === '-n') {
            return 'fedora';
        }
        return 'Linux';
    },

    uptime: () => {
        const loadTime = /** @type {any} */ (window).__portfolioLoadTime || Date.now();
        const diff = Date.now() - loadTime;
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        if (hours > 0) {
            return `up ${hours} hour${hours !== 1 ? 's' : ''}, ${mins} min${mins !== 1 ? 's' : ''}`;
        }
        return `up ${mins} min${mins !== 1 ? 's' : ''}`;
    },

    'df': args => {
        if (args && args[0] === '-h') {
            return `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       256G   42G  201G  18% /
tmpfs           7.8G  1.2M  7.8G   1% /tmp
/dev/sda2       512G  128G  384G  25% /home`;
        }
        return `Filesystem     1K-blocks     Used Available Use% Mounted on
/dev/sda1      268435456 44040192 210567168  18% /
tmpfs            8177664     1228   8176436   1% /tmp
/dev/sda2      536870912 134217728 402653184  25% /home`;
    },

    'free': args => {
        if (args && args[0] === '-h') {
            return `              total        used        free      shared  buff/cache   available
Mem:           15Gi       4.2Gi       7.1Gi       512Mi       4.1Gi        10Gi
Swap:         8.0Gi          0B       8.0Gi`;
        }
        return `              total        used        free      shared  buff/cache   available
Mem:       16384000     4404000     7462000      524288     4518000    10752000
Swap:       8388608           0     8388608`;
    },

    'ps': () => {
        return `USER       PID %CPU %MEM    VSZ   RSS TTY STAT START   TIME COMMAND
root         1  0.0  0.1 169340 13264 ?   Ss   09:00   0:01 /usr/lib/systemd/systemd
root       412  0.0  0.2 456780 18920 ?   Ss   09:00   0:00 /usr/sbin/NetworkManager
gdm        623  0.1  1.2 983456 98720 ?   Ssl  09:00   0:03 /usr/bin/gnome-shell
sawyehtet  801  0.3  2.1 1245680 172032 ? Ssl  09:01   0:12 /usr/bin/gnome-shell
sawyehtet  912  0.0  0.4 567890 32456 ?   Sl   09:01   0:00 /usr/bin/mutter
sawyehtet 1024  0.1  0.3 234560 24680 ?   Sl   09:01   0:02 /usr/bin/pipewire
sawyehtet 1156  0.0  0.1  12340  8920 pts/0 Ss  09:02   0:00 bash
sawyehtet 1200  0.0  0.0   8456  3120 pts/0 R+  09:05   0:00 ps aux`;
    },

    'systemctl': args => {
        if (args && args[0] === 'status') {
            return `● fedora
    State: running
     Jobs: 0 queued
   Failed: 0 units
    Since: ${new Date().toISOString().split('T')[0]}; ${terminalCommands.uptime()}
   CGroup: /
           ├─user.slice
           │ └─user-1000.slice
           │   ├─session-1.scope
           │   │ └─gnome-shell
           │   └─pipewire.service
           └─system.slice
             ├─NetworkManager.service
             └─gdm.service`;
        }
        return 'Usage: systemctl status';
    },

    'journalctl': args => {
        if (args && args[0] === '-b') {
            return BOOT_LOG_MESSAGES.join('\n');
        }
        return 'Usage: journalctl -b (show boot log)';
    },

    'dnf': args => {
        if (!args || args.length === 0) {
            return 'usage: dnf5 [options] <command> [<args>...]\n\nCommands: install, remove, update, search, list, info';
        }
        if (args[0] === '--version') {
            return 'dnf5 version 5.2.6\n  - libdnf5 version 5.2.6';
        }
        if (args[0] === 'list') {
            return `Last metadata expiration check: 0:42:15 ago.
Installed Packages
bash.x86_64                    5.2.21-1.fc43        @anaconda
fedora-release.noarch          43-1                 @anaconda
gnome-shell.x86_64             49.0-1.fc43          @updates
mutter.x86_64                  49.0-1.fc43          @updates
pipewire.x86_64                1.0.7-1.fc43         @updates
firefox.x86_64                 131.0-1.fc43         @updates`;
        }
        if (args[0] === 'search') {
            const query = args.slice(1).join(' ') || '';
            return `Last metadata expiration check: 0:42:15 ago on ${new Date().toDateString()}.\n${query ? `Matched: ${query}-devel.x86_64 : Development files for ${query}` : 'Usage: dnf search <query>'}`;
        }
        return `dnf5: unknown command: ${args[0]}`;
    },

    'apt': () => 'bash: apt: command not found. This is Fedora — use: dnf',

    'apt-get': () => 'bash: apt-get: command not found. This is Fedora — use: dnf',

    'python3': args => {
        if (args && args[0] === '--version') {
            return 'Python 3.14.0';
        }
        return 'Python 3.14.0 (default, Oct 2025)\nType "help", "copyright" for more information.\n>>> (interactive mode not supported)';
    },

    'node': args => {
        if (args && args[0] === '--version') {
            return 'v22.11.0';
        }
        return 'v22.11.0';
    },

    'git': args => {
        if (!args || args.length === 0) {
            return 'usage: git <command> [<args>]\n\nCommon commands: status, log, diff, add, commit, push, pull';
        }
        if (args[0] === '--version') {
            return 'git version 2.46.0';
        }
        if (args[0] === 'status') {
            return `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`;
        }
        if (args[0] === 'log' && args[1] === '--oneline') {
            return `a1b2c3d feat: add GNOME 49 Focus Mode with Pomodoro timer
e4f5g6h fix: window snapping on Wayland display
i7j8k9l style: migrate color tokens to Adwaita
m0n1o2p feat: implement command palette (Ctrl+K)
q3r4s5t refactor: replace Yaru theme with Fedora 43
u6v7w8x feat: add interactive terminal with filesystem
y9z0a1b chore: initial commit — portfolio scaffolding`;
        }
        if (args[0] === 'log') {
            return `commit a1b2c3d4e5f6 (HEAD -> main, origin/main)
Author: Saw Ye Htet <minwn2244@gmail.com>
Date:   ${new Date().toDateString()}

    feat: add GNOME 49 Focus Mode with Pomodoro timer`;
        }
        return `git: '${args[0]}' is not a git command.`;
    },

    'ssh': args => {
        if (args && args[0] === 'github') {
            setTimeout(() => {
                window.open('https://github.com/sawyairhtet', '_blank');
            }, 800);
            return `Connecting to github.com...
Authenticated as sawyairhtet.
Opening profile in browser...`;
        }
        return `usage: ssh <host>\nTry: ssh github`;
    },

    'man': args => {
        if (!args || args.length === 0) {
            return 'What manual page do you want?\nUsage: man <command>';
        }
        const manPages = {
            'ls': 'LS(1)\n\nNAME\n    ls - list directory contents\n\nSYNOPSIS\n    ls [dir]\n\nDESCRIPTION\n    List information about files in the current directory or specified directory.',
            'cd': 'CD(1)\n\nNAME\n    cd - change the working directory\n\nSYNOPSIS\n    cd [dir]\n\nDESCRIPTION\n    Change the current directory to dir. With no arguments, changes to home directory.',
            'cat': 'CAT(1)\n\nNAME\n    cat - concatenate files and print on standard output\n\nSYNOPSIS\n    cat <file>\n\nDESCRIPTION\n    Concatenate FILE(s) to standard output.',
            'neofetch': 'NEOFETCH(1)\n\nNAME\n    neofetch - display system information with ASCII art\n\nSYNOPSIS\n    neofetch\n\nDESCRIPTION\n    Displays system information alongside an ASCII art logo of your OS.',
            'whoami': 'WHOAMI(1)\n\nNAME\n    whoami - print effective user name\n\nSYNOPSIS\n    whoami\n\nDESCRIPTION\n    Print the user name associated with the current effective user ID.',
            'help': 'HELP(1)\n\nNAME\n    help - display available commands\n\nSYNOPSIS\n    help\n\nDESCRIPTION\n    Show a list of all available terminal commands.',
        };
        return manPages[args[0]] || `No manual entry for ${args[0]}`;
    },

    reboot: () => {
        setTimeout(() => {
            localStorage.removeItem('hasVisitedBefore');
            location.reload();
        }, 500);
        return 'Rebooting...';
    },

    sudo: args => {
        if (args && args.join(' ').toLowerCase() === 'hire me') {
            return `
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🎉  CONGRATULATIONS!  You've unlocked the     ║
║       secret hiring command!                     ║
║                                                  ║
║   I'm Saw Ye Htet, and I'd love to work with    ║
║   you! Let's build something amazing together.   ║
║                                                  ║
║   📧  minwn2244@gmail.com                        ║
║   🔗  linkedin.com/in/saw-ye-htet-the-man-who-code/  ║
║   💻  github.com/sawyairhtet                     ║
║                                                  ║
║   Status: Open to opportunities! 🚀             ║
║                                                  ║
╚══════════════════════════════════════════════════╝`;
        }
        if (args && args[0] === 'dnf' && args[1] === 'update') {
            return `[sudo] password for sawyehtet: ****
Last metadata expiration check: 0:42:15 ago.
Dependencies resolved.
=====================================
 Package          Arch    Version          Repo      Size
=====================================
Upgrading:
 gnome-shell      x86_64  49.0-2.fc43      updates   2.1 M
 mutter           x86_64  49.0-2.fc43      updates   1.8 M

Transaction Summary
=====================================
Upgrade  2 Packages

Total download size: 3.9 M
Downloading... ████████████████████ 100%
Complete!`;
        }
        return 'Nice try! 😏\n\nBut you\'re not root here.\nHint: try "sudo hire me"';
    },

    neofetch: () => {
        const uptimeStr = terminalCommands.uptime();
        return `        /:-------------:\\           sawyehtet@fedora
       :-------------------::        ────────────────
     :-----------/shhOHbmp---:\\      OS: Fedora Linux 43 (Workstation Edition)
   /-----------omMMMNNNMMD  ---:     Kernel: 6.11.4-301.fc43.x86_64
  :-----------sMMMMNMNMP.    ---:    Uptime: ${uptimeStr}
 :-----------:MMMdP-------    ---\\   Shell: bash 5.2.21
,------------:MMMd--------    ---:   DE: GNOME 49
:------------:MMMd-------    .---:   WM: Mutter (Wayland)
:----    oNMMMMMMMMMNho     .----:   Theme: Adwaita [GTK4]
:--     .+shhhMMMMonP'    .------:   Icons: Adwaita [GTK4]
:-    -------:MMMd--------------:   Terminal: Portfolio Terminal
:-   --------/MMMd-------------;    Display: Wayland (Triple Buffering)
:-    ------/hMMMy------------:     Python: 3.14.0
:-- :dMNdhhdNMMNo------------;      Packages: dnf5
:---:sdNMMMMNds:------------:
:------:://:-------------::`;
    },
    fortune: () => terminalFortunes[Math.floor(Math.random() * terminalFortunes.length)],

    joke: () => terminalJokes[Math.floor(Math.random() * terminalJokes.length)],
};

/**
 * Executes a terminal command string and returns the output.
 * @param {string} input - The raw command string from the user
 * @returns {string}
 */
export function executeTerminalCommand(input) {
    const trimmedInput = input.trim();
    if (!trimmedInput) {return '';}

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

/**
 * Appends a command and its output to the terminal DOM.
 * @param {string} command - The command that was executed
 * @param {string} output - The command output text
 * @returns {void}
 */
export function addTerminalOutput(command, output) {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) {return;}

    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line terminal-command';
    commandLine.textContent = `[sawyehtet@fedora ~]$ ${command}`;
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

    terminalOutput.parentElement.scrollTop = terminalOutput.parentElement.scrollHeight;
}

/**
 * Wires up the terminal input for command execution and history navigation.
 * @returns {void}
 */
export function setupTerminal() {
    const terminalInput = /** @type {HTMLInputElement | null} */ (document.getElementById('terminal-input'));
    const terminalSubmit = document.getElementById('terminal-submit');
    if (!terminalInput) {return;}

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

/**
 * Applies mobile keyboard scroll fix to the terminal window.
 * @returns {void}
 */
export function setupTerminalMobileFix() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalWindow = document.getElementById('terminal-window');

    if (!terminalInput || !terminalWindow) {return;}

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

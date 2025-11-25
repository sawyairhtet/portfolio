// Z-Index Management
let highestZ = 100;

function bringToFront(element) {
    highestZ++;
    element.style.zIndex = highestZ;
}

// Open/Close Logic
function openWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.style.display = 'flex';
        bringToFront(win);
    }
}

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (win) {
        win.style.display = 'none';
    }
}

// Draggable Logic
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = element.querySelector('.window-header');

    if (header) {
        // if present, the header is where you move the DIV from:
        header.onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Bring to front when dragging starts
        bringToFront(element);

        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Make all windows draggable
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        makeDraggable(win);
        
        // Also add click listener to body to bring to front even if not dragging
        win.addEventListener('mousedown', () => {
            bringToFront(win);
        });
    });

    // Mobile Check (Optional extra enforcement)
    // Mobile Check with Dismissal
    const warning = document.getElementById('mobile-warning');
    const desktop = document.getElementById('desktop');
    const dismissBtn = document.getElementById('dismiss-warning');

    function checkMobile() {
        const isMobile = window.innerWidth < 768;
        const isDismissed = sessionStorage.getItem('mobileWarningDismissed') === 'true';

        if (isMobile && !isDismissed) {
            if (warning) warning.style.display = 'flex';
            // We don't hide desktop anymore, CSS handles layout, 
            // and warning is an overlay.
        } else {
            if (warning) warning.style.display = 'none';
        }
    }

    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            if (warning) warning.style.display = 'none';
            sessionStorage.setItem('mobileWarningDismissed', 'true');
        });
    }

    window.addEventListener('resize', checkMobile);
    checkMobile(); // Run on load

    // Background is static CSS now

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const htmlElement = document.documentElement;

    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }


    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                // Switch to Light
                htmlElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            } else {
                // Switch to Dark
                htmlElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            }
        });
    }

    // Project Icon Double-Click Handlers
    const projectIcons = document.querySelectorAll('.file-icon');
    projectIcons.forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const projectId = icon.getAttribute('data-project');
            openProjectDetail(projectId);
        });
        
        // Make project detail windows draggable
        const projectWindow = document.getElementById(`project-${projectId}`);
        if (projectWindow) {
            makeDraggable(projectWindow);
            projectWindow.addEventListener('mousedown', () => {
                bringToFront(projectWindow);
            });
        }
    });
});

// Open Project Detail Window
function openProjectDetail(projectId) {
    const windowId = `project-${projectId}`;
    const win = document.getElementById(windowId);
    if (win) {
        win.style.display = 'flex';
        bringToFront(win);
    }
}

// ============================================
// TERMINAL SYSTEM
// ============================================

let terminalHistory = [];
let historyIndex = -1;

// Terminal Commands
const terminalCommands = {
    help: () => {
        return `Available commands:
  whoami      - Display bio information
  contact     - Show contact information
  projects    - List all projects
  skills      - Display technical skills
  echo [text] - Echo back your text
  clear       - Clear terminal output
  help        - Show this help message`;
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
Twitter:  x.com/saulyehtet_`;
    },
    
    projects: () => {
        return `Projects:
─────────────────────
1. Finance        - Financial management web application
2. Orizon         - Modern banking interface
3. Fundo          - Creative design portfolio
4. Brawlhalla     - Game statistics tracking app
5. DSM            - Design system management tool
6. MetaSpark      - Metaverse platform design
7. Summary        - Text summarization tool
8. Task Manager   - Productivity application
9. Arrival        - Technology startup landing page

Tip: Double-click projects in the Projects window for details!`;
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
    
    echo: (args) => {
        return args.join(' ') || 'Usage: echo [text]';
    },
    
    clear: () => {
        const output = document.getElementById('terminal-output');
        if (output) {
            output.innerHTML = '';
        }
        return '';
    }
};

// Execute terminal command
function executeTerminalCommand(input) {
    const trimmedInput = input.trim();
    if (!trimmedInput) return '';
    
    const [cmd, ...args] = trimmedInput.split(' ');
    const command = cmd.toLowerCase();
    
    if (terminalCommands[command]) {
        return terminalCommands[command](args);
    }
    
    return `Command not found: ${cmd}
Type 'help' for available commands.`;
}

// Add output to terminal
function addTerminalOutput(command, output) {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) return;
    
    // Add command line
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line terminal-command';
    commandLine.textContent = `visitor@portfolio:~$ ${command}`;
    terminalOutput.appendChild(commandLine);
    
    // Add output
    if (output) {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'terminal-line';
        outputDiv.textContent = output;
        terminalOutput.appendChild(outputDiv);
    }
    
    // Auto-scroll to bottom
    terminalOutput.parentElement.scrollTop = terminalOutput.parentElement.scrollHeight;
}

// Initialize terminal when opening
function initializeTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    if (!terminalInput) return;
    
    // Focus input when terminal opens
    setTimeout(() => terminalInput.focus(), 100);
    
    // Handle Enter key
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value;
            const output = executeTerminalCommand(command);
            
            if (command.trim()) {
                addTerminalOutput(command, output);
                terminalHistory.push(command);
                historyIndex = terminalHistory.length;
            }
            
            terminalInput.value = '';
        }
        
        // Handle Up arrow (previous command)
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = terminalHistory[historyIndex];
            }
        }
        
        // Handle Down arrow (next command)
        else if (e.key === 'ArrowDown') {
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
    
    // Keep focus on input when clicking terminal window
    const terminalBody = document.querySelector('.terminal-body');
    if (terminalBody) {
        terminalBody.addEventListener('click', () => {
            terminalInput.focus();
        });
    }
}

// Initialize terminal on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initializeTerminal();
});

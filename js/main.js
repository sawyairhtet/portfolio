// ============================================
// STATE MANAGEMENT
// ============================================

let currentOS = 'desktop'; // desktop, tablet, or mobile
let currentZIndex = 100;
let activeWindows = new Set();

// ============================================
// DEVICE DETECTION
// ============================================

function detectOS() {
    const width = window.innerWidth;
    if (width <= 767) {
        return 'mobile';
    } else if (width <= 1024) {
        return 'tablet';
    } else {
        return 'desktop';
    }
}

function updateOS() {
    const newOS = detectOS();
    if (newOS !== currentOS) {
        currentOS = newOS;
        console.log(`OS changed to: ${currentOS}`);
        // Close all windows on OS change
        closeAllWindows();
    }
}

// ============================================
// WINDOW MANAGEMENT
// ============================================

function openWindow(appName) {
    const windowId = `${appName}-window`;
    const windowEl = document.getElementById(windowId);
    
    if (!windowEl) return;
    
    // Close existing window if already open
    if (activeWindows.has(windowId)) {
        closeWindow(windowId);
        return;
    }
    
    windowEl.style.display = 'flex';
    activeWindows.add(windowId);
    bringToFront(windowEl);
    
    // Add animation based on OS
    if (currentOS === 'mobile') {
        // Slide up animation for mobile
        windowEl.style.animation = 'slideUp 0.3s ease-out';
    } else if (currentOS === 'tablet') {
        // Fade in for tablet
        windowEl.style.animation = 'fadeIn 0.2s ease-out';
    } else {
        // Scale in for desktop
        windowEl.style.animation = 'scaleIn 0.2s ease-out';
    }
}

function closeWindow(windowId) {
    const windowEl = document.getElementById(windowId);
    if (!windowEl) return;
    
    windowEl.style.display = 'none';
    activeWindows.delete(windowId);
}

function closeAllWindows() {
    activeWindows.forEach(windowId => {
        closeWindow(windowId);
    });
}

function bringToFront(element) {
    currentZIndex++;
    element.style.zIndex = currentZIndex;
}

// ============================================
// DRAGGABLE WINDOWS (Desktop Only)
// ============================================

function makeDraggable(element) {
    if (currentOS !== 'desktop') return;
    
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = element.querySelector('.window-header');
    
    if (!header) return;
    
    header.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        if (currentOS !== 'desktop') return;
        
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        bringToFront(element);
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// ============================================
// APP ICONS & DOCK INTERACTION
// ============================================

function setupAppIcons() {
    // App icons from grid
    const appIcons = document.querySelectorAll('.app-icon');
    appIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const appName = icon.dataset.app;
            openWindow(appName);
        });
    });
    
    // Dock items
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        item.addEventListener('click', () => {
            const appName = item.dataset.app;
            if (appName) {
                openWindow(appName);
            }
        });
    });
}

// ============================================
// TRAFFIC LIGHTS (Desktop Only)
// ============================================

function setupTrafficLights() {
    document.querySelectorAll('.traffic-light.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const windowEl = btn.closest('.window');
            if (windowEl) {
                closeWindow(windowEl.id);
            }
        });
    });
    
    // Minimize and maximize can be added here
}

// ============================================
// MOBILE CLOSE BUTTONS
// ============================================

function setupMobileCloseButtons() {
    document.querySelectorAll('.close-btn-mobile').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const windowEl = btn.closest('.window');
            if (windowEl) {
                closeWindow(windowEl.id);
            }
        });
    });
}

// ============================================
// CLOCK & TIME
// ============================================

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    // Menu bar clock (desktop)
    const menuClock = document.querySelector('.menu-clock');
    if (menuClock) {
        menuClock.textContent = `${displayHours}:${minutes} ${ampm}`;
    }
    
    // Status bar time (mobile/tablet)
    const statusTime = document.querySelector('.status-time');
    if (statusTime) {
        statusTime.textContent = `${displayHours}:${minutes}`;
    }
}

// ============================================
// TERMINAL
// ============================================

let terminalHistory = [];
let historyIndex = -1;

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
5. MetaSpark      - Metaverse platform design
6. Summary        - Text summarization tool`;
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

function addTerminalOutput(command, output) {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) return;
    
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line terminal-command';
    commandLine.textContent = `visitor@portfolio:~$ ${command}`;
    terminalOutput.appendChild(commandLine);
    
    if (output) {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'terminal-line';
        outputDiv.textContent = output;
        terminalOutput.appendChild(outputDiv);
    }
    
    terminalOutput.parentElement.scrollTop = terminalOutput.parentElement.scrollHeight;
}

function setupTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    if (!terminalInput) return;
    
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
}

// ============================================
// THEME TOGGLE
// ============================================

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
    
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });
}

// ============================================
// ANIMATIONS (CSS Keyframes in JS for dynamic injection)
// ============================================

function injectAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from {
                transform: translateY(100%);
            }
            to {
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        @keyframes scaleIn {
            from {
                transform: scale(0.9);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Detect initial OS
    updateOS();
    
    // Inject animations
    injectAnimations();
    
    // Setup all interactions
    setupAppIcons();
    setupTrafficLights();
    setupMobileCloseButtons();
    setupTerminal();
    setupThemeToggle();
    
    // Make all windows draggable (will be disabled on mobile/tablet)
    document.querySelectorAll('.window').forEach(win => {
        makeDraggable(win);
        
        // Bring to front on click
        win.addEventListener('mousedown', () => {
            bringToFront(win);
        });
    });
    
    // Update clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Listen for window resize
    window.addEventListener('resize', () => {
        updateOS();
    });
});

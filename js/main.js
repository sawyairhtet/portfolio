// ============================================
// STATE MANAGEMENT
// ============================================

let currentOS = 'desktop'; // desktop, tablet, or mobile
let currentZIndex = 100;
let activeWindows = new Set();

// ============================================
// STICKY NOTES DATA (Humanization)
// ============================================

const stickyNotesData = [
    { text: "I like coke but \ncoke light is better 🥤", color: "yellow", rotation: -3, x: 75, y: 15 },
    { text: "Roses are red.\nViolets are blue.\nUnexpected error in line 52.", color: "pink", rotation: 2, x: 82, y: 35 },
    { text: 'System.out.println\n("Hi Mom! I love you.");', color: "blue", rotation: -1, x: 78, y: 55 }
];

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
    
    // Update dock active states
    updateDockActiveStates();
    
    // Bounce animation for organic feel
    windowEl.classList.remove('closing');
    windowEl.classList.add('opening');
    
    // Remove animation class after it completes
    setTimeout(() => {
        windowEl.classList.remove('opening');
    }, 400);
    
    // Auto-focus terminal input when terminal window opens
    if (appName === 'terminal') {
        setTimeout(() => {
            const terminalInput = document.getElementById('terminal-input');
            if (terminalInput) terminalInput.focus();
        }, 100);
    }
}

function closeWindow(windowId) {
    const windowEl = document.getElementById(windowId);
    if (!windowEl) return;
    
    // Add closing animation
    windowEl.classList.remove('opening');
    windowEl.classList.add('closing');
    
    // Hide after animation completes
    setTimeout(() => {
        windowEl.style.display = 'none';
        windowEl.classList.remove('closing');
        activeWindows.delete(windowId);
        
        // Update dock active states
        updateDockActiveStates();
    }, 250);
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
// DOCK ACTIVE STATE MANAGEMENT
// ============================================

function updateDockActiveStates() {
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        const appName = item.dataset.app;
        if (appName) {
            const windowId = `${appName}-window`;
            if (activeWindows.has(windowId)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
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
        
        // Calculate new position
        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;
        
        // Boundary clamping - prevent window from going off-screen
        const minY = 28; // Top bar height
        const minX = 0;
        const maxY = window.innerHeight - 50; // Leave some visible area
        const maxX = window.innerWidth - 100; // Leave window partially visible
        
        newTop = Math.max(minY, Math.min(newTop, maxY));
        newLeft = Math.max(minX, Math.min(newLeft, maxX));
        
        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// ============================================
// DRAGGABLE APP ICONS (Desktop Only) - Grid-Based
// ============================================

// ============================================
// DRAGGABLE APP ICONS (Sparse Grid System)
// ============================================

let draggedIcon = null;
let dragClone = null;
let placeholder = null;
const GRID_CELL_WIDTH = 100;  // Matches CSS grid-template-columns
const GRID_CELL_HEIGHT = 110; // Matches CSS grid-template-rows
const GRID_GAP = 16;         // Matches CSS var(--spacing-md)

function setupDraggableAppIcons() {
    const appGrid = document.querySelector('.app-grid');
    if (!appGrid) return;
    
    // Load saved PROPER grid positions {appName: {row, col}}
    const savedGridPositions = JSON.parse(localStorage.getItem('appGridPositions') || '{}');
    const appIcons = Array.from(document.querySelectorAll('.app-icon'));
    
    // Initialize positions
    appIcons.forEach((icon, index) => {
        const appName = icon.dataset.app;
        let pos = savedGridPositions[appName];
        
        if (!pos) {
            // Default sequential layout for new/reset icons
            // 6 columns max assumption for default layout
            const defaultCols = 6; 
            pos = {
                col: (index % defaultCols) + 1,
                row: Math.floor(index / defaultCols) + 1
            };
        }
        
        // Apply Grid Position
        setGridPosition(icon, pos.row, pos.col);
    });
    
    // Create placeholder
    placeholder = document.createElement('div');
    placeholder.className = 'app-icon-placeholder';
    placeholder.style.display = 'none';
    appGrid.appendChild(placeholder);
    
    // Setup handlers
    appIcons.forEach(icon => setupIconDragHandlers(icon));
}

function setGridPosition(element, row, col) {
    element.style.gridRowStart = row;
    element.style.gridColumnStart = col;
    // Store in dataset for easy reading
    element.dataset.row = row;
    element.dataset.col = col;
}

function setupIconDragHandlers(icon) {
    let isDragging = false;
    let startX, startY;
    const dragThreshold = 10;
    
    // Mouse events
    icon.addEventListener('mousedown', onPointerDown);
    // Touch events
    icon.addEventListener('touchstart', onTouchStart, { passive: false });
    
    function getEventCoords(e) {
        if (e.touches && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: e.clientX, y: e.clientY };
    }
    
    function onTouchStart(e) {
        if(e.target.closest('.close-btn')) return; // Allow interaction with proper elements if any
        
        const coords = getEventCoords(e);
        startX = coords.x;
        startY = coords.y;
        isDragging = false;
        draggedIcon = icon;
        
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
    }
    
    function onTouchMove(e) {
        const coords = getEventCoords(e);
        const deltaX = Math.abs(coords.x - startX);
        const deltaY = Math.abs(coords.y - startY);
        
        if (!isDragging && (deltaX > dragThreshold || deltaY > dragThreshold)) {
            isDragging = true;
            e.preventDefault(); // Prevent scrolling only when actually dragging
            startDrag();
        }
        
        if (isDragging) {
            e.preventDefault();
            updateDrag(coords.x, coords.y);
        }
    }
    
    function onTouchEnd(e) {
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        
        if (isDragging) {
            endDrag();
        } else {
            // Tap interaction
             const appName = icon.dataset.app;
             openWindow(appName);
        }
        isDragging = false;
        draggedIcon = null;
    }
    
    function onPointerDown(e) {
        if(e.button !== 0) return; // Only left click
        e.preventDefault();
        
        startX = e.clientX;
        startY = e.clientY;
        isDragging = false;
        draggedIcon = icon;
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
    function onMouseMove(e) {
        const deltaX = Math.abs(e.clientX - startX);
        const deltaY = Math.abs(e.clientY - startY);
        
        if (!isDragging && (deltaX > dragThreshold || deltaY > dragThreshold)) {
            isDragging = true;
            startDrag();
        }
        
        if (isDragging) {
            updateDrag(e.clientX, e.clientY);
        }
    }
    
    function onMouseUp(e) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        if (isDragging) {
            endDrag();
        } else {
             const appName = icon.dataset.app;
             openWindow(appName);
        }
        isDragging = false;
        draggedIcon = null;
    }
}

function startDrag() {
    const appGrid = document.querySelector('.app-grid');
    if (!appGrid || !draggedIcon) return;
    
    const rect = draggedIcon.getBoundingClientRect();
    
    // Create visual clone
    dragClone = draggedIcon.cloneNode(true);
    dragClone.className = 'app-icon drag-clone';
    dragClone.style.position = 'fixed';
    dragClone.style.left = rect.left + 'px';
    dragClone.style.top = rect.top + 'px';
    dragClone.style.width = rect.width + 'px';
    dragClone.style.height = rect.height + 'px';
    dragClone.style.pointerEvents = 'none';
    dragClone.style.zIndex = '9999';
    document.body.appendChild(dragClone);
    
    // Configure placeholder
    placeholder.style.display = 'flex';
    placeholder.style.gridRowStart = draggedIcon.dataset.row;
    placeholder.style.gridColumnStart = draggedIcon.dataset.col;
    
    // Hide original
    draggedIcon.classList.add('dragging-original');
}

function updateDrag(clientX, clientY) {
    if (!dragClone || !placeholder) return;
    
    const appGrid = document.querySelector('.app-grid');
    const gridRect = appGrid.getBoundingClientRect();
    
    // Move clone
    dragClone.style.left = (clientX - dragClone.offsetWidth / 2) + 'px';
    dragClone.style.top = (clientY - dragClone.offsetHeight / 2) + 'px';
    
    // Calculate Grid Coordinate based on mouse position relative to container
    // We add half gap to center the snap point
    const relativeX = clientX - gridRect.left;
    const relativeY = clientY - gridRect.top;
    
    let targetCol = Math.ceil((relativeX) / (GRID_CELL_WIDTH + GRID_GAP));
    let targetRow = Math.ceil((relativeY) / (GRID_CELL_HEIGHT + GRID_GAP));
    
    // Boundaries
    if (targetCol < 1) targetCol = 1;
    if (targetRow < 1) targetRow = 1;
    
    // Update placeholder position
    placeholder.style.gridColumnStart = targetCol;
    placeholder.style.gridRowStart = targetRow;
}

function endDrag() {
    if (dragClone) {
        dragClone.remove();
        dragClone = null;
    }
    
    const targetRow = placeholder.style.gridRowStart;
    const targetCol = placeholder.style.gridColumnStart;
    
    // Check if slot is occupied by ANOTHER icon
    const existingIcon = document.querySelector(`.app-icon[data-row="${targetRow}"][data-col="${targetCol}"]:not(.dragging-original)`);
    
    if (existingIcon) {
        // SWAP: Move existing icon to dragged icon's old position
        const oldRow = draggedIcon.dataset.row;
        const oldCol = draggedIcon.dataset.col;
        setGridPosition(existingIcon, oldRow, oldCol);
    }
    
    // Move dragged icon to new position
    setGridPosition(draggedIcon, targetRow, targetCol);
    
    draggedIcon.classList.remove('dragging-original');
    placeholder.style.display = 'none';
    
    saveGridPositions();
}

function saveGridPositions() {
    const savedPositions = {};
    document.querySelectorAll('.app-icon').forEach(icon => {
        savedPositions[icon.dataset.app] = {
            row: parseInt(icon.dataset.row),
            col: parseInt(icon.dataset.col)
        };
    });
    localStorage.setItem('appGridPositions', JSON.stringify(savedPositions));
}

function resetAppIconPositions() {
    localStorage.removeItem('appGridPositions');
    location.reload();
}

// ============================================
// APP ICONS & DOCK INTERACTION
// ============================================

function setupAppIcons() {
    // App icons now handled by setupDraggableAppIcons for desktop
    // This only handles non-desktop or dock items
    
    if (currentOS !== 'desktop') {
        // On mobile/tablet, use simple click handlers
        const appIcons = document.querySelectorAll('.app-icon');
        appIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                const appName = icon.dataset.app;
                openWindow(appName);
            });
        });
    }
    
    // Dock items (all platforms)
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
  reset-icons - Reset app icons to default positions
  help        - Show this help message
  
  // Easter eggs:
  milk, sudo, matrix, hello`;
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
    },

    'reset-icons': () => {
        resetAppIconPositions();
        return 'Desktop icons reset to default positions.\nRefresh the page to see changes.';
    },

    // === EASTER EGG COMMANDS ===
    milk: () => {
        return `
    .------.
   /        \\
   |  MILK  |
   |        |
   |________|
    \\      /
     '----'

Pouring some fresh milk... 🥛
Fun fact: Milk builds strong bones for those long coding sessions!`;
    },

    sudo: () => {
        return `Nice try! 😏

But you're not root here. Maybe ask nicely?`;
    },

    matrix: () => {
        return `Wake up, Neo...
The Matrix has you...
Follow the white rabbit. 🐇

01001000 01100101 01101100 01101100 01101111`;
    },

    hello: () => {
        const greetings = [
            "Hey there! 👋 Welcome to my corner of the internet.",
            "Hi! Thanks for exploring. Feel free to poke around!",
            "Hi Mom! 💙 (This one's for you)",
            "Greetings, traveler! You've found the secret hello."
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    },

    date: () => {
        return new Date().toString();
    },

    neofetch: () => {
        return `
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
                ..,,,,,...              Memory: Lots of dreams`;
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

// ============================================
// BOOT SCREEN - Linux Boot Log
// ============================================

const bootLogMessages = [
    '[    0.000000] Linux version 6.8.0-45-generic (buildd@lcy02-amd64-056)',
    '[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-6.8.0-45-generic',
    '[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable',
    '[    0.000000] ACPI: RSDP 0x00000000000F05B0 000024 (v02 LENOVO)',
    '[    0.045632] CPU: AMD Ryzen 9 9900X @ 5.60GHz',
    '[    0.076234] Memory: 32GB DDR5 CL30',
    '[ OK ] Started Journal Service.',
    '[ OK ] Reached target Basic System.',
    '[ OK ] Started D-Bus System Message Bus.',
    '[ OK ] Started Network Manager.',
    '[ OK ] Reached target Network.',
    '[ OK ] Started GNOME Display Manager.',
    '[ OK ] Started User Manager for UID 1000.',
    '[ OK ] Started Session Service of user visitor.',
    '[ OK ] Reached target Graphical Interface.',
    '',
    'Ubuntu 24.04 LTS portfolio tty1',
    '',
    'portfolio login: visitor',
    'Password: ********',
    'Welcome to Saw Ye Htet\'s Portfolio!',
    ''
];

function initBootScreen() {
    const bootScreen = document.getElementById('boot-screen');
    const bootLog = document.getElementById('boot-log');
    if (!bootScreen || !bootLog) return;

    let lineIndex = 0;
    const interval = 80; // ms per line
    
    function addLine() {
        if (lineIndex < bootLogMessages.length) {
            const line = bootLogMessages[lineIndex];
            const lineEl = document.createElement('div');
            
            // Style [ OK ] in green
            if (line.startsWith('[ OK ]')) {
                lineEl.innerHTML = '<span class="ok">[ OK ]</span>' + line.substring(6);
            } else if (line.startsWith('[')) {
                lineEl.innerHTML = '<span class="info">' + line + '</span>';
            } else {
                lineEl.textContent = line;
            }
            
            bootLog.appendChild(lineEl);
            bootLog.scrollTop = bootLog.scrollHeight;
            lineIndex++;
            setTimeout(addLine, interval);
        } else {
            // Boot complete, fade out
            setTimeout(() => {
                bootScreen.classList.add('fade-out');
                setTimeout(() => {
                    bootScreen.remove();
                    openWindow('about');
                }, 500);
            }, 500);
        }
    }
    
    addLine();
}

// ============================================
// STICKY NOTES (Humanization)
// ============================================

function createStickyNotes() {
    if (currentOS !== 'desktop') return; // Only show on desktop
    
    const container = document.getElementById('sticky-notes');
    if (!container) return;
    
    // Load saved positions from localStorage
    const savedPositions = JSON.parse(localStorage.getItem('stickyNotePositions_v2') || '{}');

    stickyNotesData.forEach((note, index) => {
        const noteEl = document.createElement('div');
        noteEl.className = `sticky-note ${note.color !== 'yellow' ? note.color : ''}`;
        noteEl.style.transform = `rotate(${note.rotation}deg)`;
        
        // Use saved position if available, otherwise use default
        const saved = savedPositions[index];
        if (saved) {
            noteEl.style.top = saved.top;
            noteEl.style.left = saved.left;
            noteEl.style.right = 'auto';
        } else {
            noteEl.style.right = `${100 - note.x}%`;
            noteEl.style.top = `${note.y}%`;
        }
        
        noteEl.textContent = note.text;
        noteEl.setAttribute('data-note-index', index);

        // Make sticky notes draggable
        makeStickyDraggable(noteEl);
        
        container.appendChild(noteEl);
    });
}

function makeStickyDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    element.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        element.classList.add('dragging');
        element.style.zIndex = 999;
        
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
        element.style.right = 'auto'; // Switch from right to left positioning
    }
    
    function closeDragElement() {
        element.classList.remove('dragging');
        element.style.zIndex = 50;
        document.onmouseup = null;
        document.onmousemove = null;
        
        // Save position to localStorage
        const noteIndex = element.getAttribute('data-note-index');
        if (noteIndex !== null) {
            const savedPositions = JSON.parse(localStorage.getItem('stickyNotePositions_v2') || '{}');
            savedPositions[noteIndex] = {
                top: element.style.top,
                left: element.style.left
            };
            localStorage.setItem('stickyNotePositions_v2', JSON.stringify(savedPositions));
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Show boot screen first
    initBootScreen();
    
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
    
    // Create sticky notes (desktop only)
    createStickyNotes();
    
    // Setup draggable app icons (desktop only)
    setupDraggableAppIcons();
    
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

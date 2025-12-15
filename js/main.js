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

let draggedIcon = null;
let dragClone = null;
let placeholder = null;
let iconOrder = []; // Stores the order of app icons

function setupDraggableAppIcons() {
    // Works on all devices now (desktop, tablet, mobile)
    
    const appGrid = document.querySelector('.app-grid');
    if (!appGrid) return;
    
    // Load saved order from localStorage
    const savedOrder = JSON.parse(localStorage.getItem('appIconOrder') || '[]');
    
    // Get all app icons
    const appIcons = Array.from(document.querySelectorAll('.app-icon'));
    
    // If we have a saved order, reorder the icons
    if (savedOrder.length > 0) {
        const orderedIcons = [];
        savedOrder.forEach(appName => {
            const icon = appIcons.find(ic => ic.dataset.app === appName);
            if (icon) orderedIcons.push(icon);
        });
        // Add any new icons not in saved order
        appIcons.forEach(icon => {
            if (!orderedIcons.includes(icon)) orderedIcons.push(icon);
        });
        // Reorder in DOM
        orderedIcons.forEach(icon => appGrid.appendChild(icon));
    }
    
    // Store current order
    iconOrder = Array.from(appGrid.querySelectorAll('.app-icon')).map(ic => ic.dataset.app);
    
    // Create placeholder element
    placeholder = document.createElement('div');
    placeholder.className = 'app-icon-placeholder';
    placeholder.style.display = 'none';
    appGrid.appendChild(placeholder);
    
    // Setup drag handlers for each icon
    appGrid.querySelectorAll('.app-icon').forEach(icon => {
        setupIconDragHandlers(icon);
    });
}

function setupIconDragHandlers(icon) {
    let isDragging = false;
    let startX, startY;
    const dragThreshold = 10;
    let touchTimer = null;
    
    // Mouse events
    icon.addEventListener('mousedown', onPointerDown);
    
    // Touch events for mobile
    icon.addEventListener('touchstart', onTouchStart, { passive: false });
    
    function getEventCoords(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }
    
    function onTouchStart(e) {
        e.preventDefault();
        const coords = getEventCoords(e);
        startX = coords.x;
        startY = coords.y;
        isDragging = false;
        draggedIcon = icon;
        
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
        document.addEventListener('touchcancel', onTouchEnd);
    }
    
    function onTouchMove(e) {
        e.preventDefault();
        const coords = getEventCoords(e);
        const deltaX = Math.abs(coords.x - startX);
        const deltaY = Math.abs(coords.y - startY);
        
        if (!isDragging && (deltaX > dragThreshold || deltaY > dragThreshold)) {
            isDragging = true;
            startDrag({ clientX: coords.x, clientY: coords.y });
        }
        
        if (isDragging) {
            updateDrag({ clientX: coords.x, clientY: coords.y });
        }
    }
    
    function onTouchEnd(e) {
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        document.removeEventListener('touchcancel', onTouchEnd);
        
        if (isDragging) {
            endDrag();
        } else {
            // It was a tap, not a drag
            const appName = icon.dataset.app;
            openWindow(appName);
        }
        
        isDragging = false;
        draggedIcon = null;
    }
    
    function onPointerDown(e) {
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
        
        // Start dragging if moved beyond threshold
        if (!isDragging && (deltaX > dragThreshold || deltaY > dragThreshold)) {
            isDragging = true;
            startDrag(e);
        }
        
        if (isDragging) {
            updateDrag(e);
        }
    }
    
    function onMouseUp(e) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        if (isDragging) {
            endDrag();
        } else {
            // It was a click, not a drag
            const appName = icon.dataset.app;
            openWindow(appName);
        }
        
        isDragging = false;
        draggedIcon = null;
    }
}

function startDrag(e) {
    const appGrid = document.querySelector('.app-grid');
    if (!appGrid || !draggedIcon) return;
    
    // Get original icon position
    const rect = draggedIcon.getBoundingClientRect();
    
    // Create a clone that follows the mouse
    dragClone = draggedIcon.cloneNode(true);
    dragClone.className = 'app-icon drag-clone';
    dragClone.style.position = 'fixed';
    dragClone.style.left = rect.left + 'px';
    dragClone.style.top = rect.top + 'px';
    dragClone.style.width = rect.width + 'px';
    dragClone.style.pointerEvents = 'none';
    dragClone.style.zIndex = '9999';
    dragClone.style.opacity = '0.9';
    dragClone.style.transform = 'scale(1.1)';
    dragClone.style.transition = 'none';
    document.body.appendChild(dragClone);
    
    // Show placeholder in original position
    placeholder.style.display = 'flex';
    placeholder.style.width = draggedIcon.offsetWidth + 'px';
    placeholder.style.height = draggedIcon.offsetHeight + 'px';
    appGrid.insertBefore(placeholder, draggedIcon);
    
    // Hide original icon
    draggedIcon.classList.add('dragging-original');
}

function updateDrag(e) {
    if (!dragClone || !draggedIcon) return;
    
    const appGrid = document.querySelector('.app-grid');
    if (!appGrid) return;
    
    // Move clone with mouse
    const cloneWidth = dragClone.offsetWidth;
    const cloneHeight = dragClone.offsetHeight;
    dragClone.style.left = (e.clientX - cloneWidth / 2) + 'px';
    dragClone.style.top = (e.clientY - cloneHeight / 2) + 'px';
    
    // Find which icon we're hovering over
    const icons = Array.from(appGrid.querySelectorAll('.app-icon:not(.dragging-original)'));
    let targetIcon = null;
    let insertBefore = true;
    
    for (const icon of icons) {
        const rect = icon.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Check if mouse is within this icon's area
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
            targetIcon = icon;
            // Determine if we should insert before or after
            insertBefore = e.clientX < centerX || e.clientY < centerY;
            break;
        }
    }
    
    // Move placeholder to new position
    if (targetIcon && targetIcon !== placeholder.nextElementSibling && targetIcon !== placeholder.previousElementSibling) {
        if (insertBefore) {
            appGrid.insertBefore(placeholder, targetIcon);
        } else {
            appGrid.insertBefore(placeholder, targetIcon.nextElementSibling);
        }
    }
}

function endDrag() {
    const appGrid = document.querySelector('.app-grid');
    if (!appGrid) return;
    
    // Remove clone
    if (dragClone) {
        dragClone.remove();
        dragClone = null;
    }
    
    // Move original icon to placeholder position
    if (draggedIcon && placeholder) {
        appGrid.insertBefore(draggedIcon, placeholder);
        draggedIcon.classList.remove('dragging-original');
    }
    
    // Hide placeholder
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    // Save new order
    saveIconOrder();
}

function saveIconOrder() {
    const appGrid = document.querySelector('.app-grid');
    if (!appGrid) return;
    
    const order = Array.from(appGrid.querySelectorAll('.app-icon')).map(icon => icon.dataset.app);
    localStorage.setItem('appIconOrder', JSON.stringify(order));
    iconOrder = order;
}

function resetAppIconPositions() {
    localStorage.removeItem('appIconOrder');
    // Reload to reset order
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

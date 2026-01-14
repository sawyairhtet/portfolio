// ============================================
// STATE MANAGEMENT
// ============================================

let currentOS = 'desktop'; // desktop, tablet, or mobile
let currentZIndex = 1100;
let activeWindows = new Set();

// ============================================
// SOUND MANAGER - WebAudio Synthesis
// ============================================

const SoundManager = {
    audioContext: null,
    muted: localStorage.getItem('soundMuted') === 'true',

    init() {
        // Create audio context lazily (requires user gesture)
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    },

    setMuted(muted) {
        this.muted = muted;
        localStorage.setItem('soundMuted', muted.toString());
    },

    isMuted() {
        return this.muted;
    },

    // Synthesize a click sound
    playClick() {
        if (this.muted) return;
        try {
            const ctx = this.init();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(800, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.05);
        } catch (e) {
            console.log('Sound playback failed:', e);
        }
    },

    // Synthesize a whoosh sound for window close/minimize
    playWhoosh() {
        if (this.muted) return;
        try {
            const ctx = this.init();
            
            // Create noise for whoosh effect
            const bufferSize = ctx.sampleRate * 0.15;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(3000, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
            
            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
            
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            noise.start(ctx.currentTime);
        } catch (e) {
            console.log('Sound playback failed:', e);
        }
    },

    // Synthesize Ubuntu drum sound (simplified)
    playStartupDrum() {
        if (this.muted) return;
        try {
            const ctx = this.init();
            
            // Bass drum
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
            
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
            
            // Second hit
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                
                osc2.frequency.setValueAtTime(120, ctx.currentTime);
                osc2.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
                
                gain2.gain.setValueAtTime(0.25, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
                
                osc2.start(ctx.currentTime);
                osc2.stop(ctx.currentTime + 0.25);
            }, 200);
        } catch (e) {
            console.log('Sound playback failed:', e);
        }
    }
};

// ============================================
// STICKY NOTES DATA (Humanization)
// ============================================

const stickyNotesData = [
    { text: "I like coke but \ncoke light is better 🥤", color: "yellow", rotation: -3, x: 75, y: 15 },
    { text: "Roses are red.\nViolets are blue.\nUnexpected error in line 52.", color: "pink", rotation: 2, x: 82, y: 35 },
    { text: 'System.out.println\n("Hi Mom! I love you.");', color: "blue", rotation: -1, x: 78, y: 55 }
];

// ============================================
// CONFIGURATION & DATA
// ============================================

const BOOT_LOG_MESSAGES = [
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

const DEFAULT_FILE_SYSTEM = {
    '/': {
        type: 'dir',
        children: ['home', 'etc', 'var']
    },
    '/home': {
        type: 'dir',
        children: ['visitor']
    },
    '/home/visitor': {
        type: 'dir',
        children: ['projects', 'documents', 'resume.txt', '.bashrc']
    },
    '/home/visitor/projects': {
        type: 'dir',
        children: ['jewelry-vr', 'portfolio', 'README.md']
    },
    '/home/visitor/projects/jewelry-vr': {
        type: 'dir',
        children: ['main.cs', 'HandTracking.cs']
    },
    '/home/visitor/projects/jewelry-vr/main.cs': {
        type: 'file',
        content: '// Unity VR Game - Main Entry Point\nusing UnityEngine;\n\npublic class JewelryHeist : MonoBehaviour {\n    void Start() {\n        Debug.Log("Welcome to Jewelry Shop Robbery VR!");\n    }\n}'
    },
    '/home/visitor/projects/jewelry-vr/HandTracking.cs': {
        type: 'file',
        content: '// Meta Quest Hand Tracking Integration\nusing Oculus.Interaction;\n\npublic class HandGrabber : MonoBehaviour {\n    // Grab gems with your bare hands!\n}'
    },
    '/home/visitor/projects/portfolio': {
        type: 'dir',
        children: ['index.html', 'main.css', 'main.js']
    },
    '/home/visitor/projects/portfolio/index.html': {
        type: 'file',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <title>Saw Ye Htet - Portfolio</title>\n</head>\n<body>\n    <!-- You are here! -->\n</body>\n</html>'
    },
    '/home/visitor/projects/portfolio/main.css': {
        type: 'file',
        content: '/* Ubuntu Yaru Theme */\n:root {\n    --color-primary: #E95420;\n    --color-bg: #2C001E;\n}\n/* ... 1000+ more lines of CSS magic */'
    },
    '/home/visitor/projects/portfolio/main.js': {
        type: 'file',
        content: '// The very code running this terminal!\n// Written with ❤️ by Saw Ye Htet\nconsole.log("Hello, curious visitor!");'
    },
    '/home/visitor/projects/README.md': {
        type: 'file',
        content: '# My Projects\n\nWelcome to my project folder!\n\n- **jewelry-vr**: VR Heist Game for Meta Quest\n- **portfolio**: This website!\n\nFeel free to explore with `cd` and `cat`.'
    },
    '/home/visitor/documents': {
        type: 'dir',
        children: ['notes.txt', 'ideas.md']
    },
    '/home/visitor/documents/notes.txt': {
        type: 'file',
        content: 'TODO:\n- Finish VR project\n- Update portfolio\n- Learn more about AI\n- Call mom 💙'
    },
    '/home/visitor/documents/ideas.md': {
        type: 'file',
        content: '# Future Project Ideas\n\n1. AI-powered code reviewer\n2. Multiplayer VR escape room\n3. Personal finance tracker with ML predictions'
    },
    '/home/visitor/resume.txt': {
        type: 'file',
        content: '╔═══════════════════════════════════════╗\n║         SAW YE HTET - RESUME          ║\n╠═══════════════════════════════════════╣\n║ Education: Singapore Polytechnic      ║\n║ Major: Information Technology         ║\n║ Skills: Unity, C#, JavaScript, Python ║\n║ Focus: VR Development, Full-Stack     ║\n╚═══════════════════════════════════════╝\n\nContact: minwn2244@gmail.com'
    },
    '/home/visitor/.bashrc': {
        type: 'file',
        content: '# ~/.bashrc\nexport PS1="visitor@portfolio:~$ "\nalias ll="ls -la"\nalias cls="clear"\n\n# Secret: You found the hidden config!'
    },
    '/etc': {
        type: 'dir',
        children: ['hostname', 'os-release']
    },
    '/etc/hostname': {
        type: 'file',
        content: 'portfolio'
    },
    '/etc/os-release': {
        type: 'file',
        content: 'NAME="Ubuntu"\nVERSION="24.04 LTS (Noble Numbat)"\nID=ubuntu\nPRETTY_NAME="Saw Ye Htet Portfolio OS"'
    },
    '/var': {
        type: 'dir',
        children: ['log']
    },
    '/var/log': {
        type: 'dir',
        children: ['visitor.log']
    },
    '/var/log/visitor.log': {
        type: 'file',
        content: '[INFO] Visitor connected to portfolio\n[INFO] Terminal session started\n[INFO] Thanks for exploring! 🎉'
    }
};

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

    // If already open, just bring to front
    if (activeWindows.has(windowId)) {
        bringToFront(windowEl);
        return;
    }

    windowEl.style.display = 'flex';
    activeWindows.add(windowId);
    bringToFront(windowEl);
    
    // Apply cascade offset for desktop (random small offset based on window count)
    if (currentOS === 'desktop' && !windowEl.style.top) {
        const cascadeOffset = activeWindows.size * 25;
        const randomX = Math.floor(Math.random() * 30) - 15; // ±15px
        const randomY = Math.floor(Math.random() * 20) - 10; // ±10px
        windowEl.style.top = `calc(15% + ${cascadeOffset + randomY}px)`;
        windowEl.style.left = `calc(var(--dock-width) + 10% + ${cascadeOffset + randomX}px)`;
    }

    // Play open sound
    SoundManager.playClick();

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

    // Play close sound
    SoundManager.playWhoosh();

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
// DRAGGABLE WINDOWS (Desktop Only) + SNAP DETECTION
// ============================================

// Store original window positions before snapping (for un-snap)
const windowSnapState = new Map();

function makeDraggable(element) {
    if (currentOS !== 'desktop') return;

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;
    const header = element.querySelector('.window-header');
    const snapPreview = document.getElementById('snap-preview');

    if (!header) return;

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (currentOS !== 'desktop') return;
        // Don't drag if clicking on window controls
        if (e.target.closest('.window-control')) return;

        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        isDragging = true;

        // If window is snapped, unsnap it first and reposition under cursor
        if (element.classList.contains('snapped-left') || 
            element.classList.contains('snapped-right') ||
            element.classList.contains('snapped-maximized')) {
            
            const originalState = windowSnapState.get(element.id);
            if (originalState) {
                element.classList.remove('snapped-left', 'snapped-right', 'snapped-maximized');
                element.style.width = originalState.width;
                element.style.height = originalState.height;
                // Center window under cursor
                element.style.left = (e.clientX - parseInt(originalState.width) / 2) + 'px';
                element.style.top = e.clientY + 'px';
                pos3 = e.clientX;
                pos4 = e.clientY;
            }
        }

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
        const maxY = window.innerHeight - 50;
        const maxX = window.innerWidth - 100;

        newTop = Math.max(minY, Math.min(newTop, maxY));
        newLeft = Math.max(minX, Math.min(newLeft, maxX));

        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";

        // Snap detection zones
        const snapThreshold = 50;
        const dockWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dock-width')) || 60;

        // Clear previous snap preview
        snapPreview.classList.remove('visible', 'snap-left', 'snap-right', 'snap-maximize');

        // Check for snap zones
        if (e.clientX <= dockWidth + snapThreshold) {
            // Left edge snap
            snapPreview.classList.add('visible', 'snap-left');
        } else if (e.clientX >= window.innerWidth - snapThreshold) {
            // Right edge snap
            snapPreview.classList.add('visible', 'snap-right');
        } else if (e.clientY <= 28 + snapThreshold / 2) {
            // Top edge = maximize
            snapPreview.classList.add('visible', 'snap-maximize');
        }
    }

    function closeDragElement(e) {
        isDragging = false;
        const dockWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--dock-width')) || 60;
        const snapThreshold = 50;

        // Save original state before snapping
        if (!windowSnapState.has(element.id)) {
            windowSnapState.set(element.id, {
                width: element.style.width || getComputedStyle(element).width,
                height: element.style.height || getComputedStyle(element).height,
                top: element.style.top,
                left: element.style.left
            });
        }

        // Apply snap if in snap zone
        if (e && e.clientX <= dockWidth + snapThreshold) {
            element.classList.add('snapped-left');
        } else if (e && e.clientX >= window.innerWidth - snapThreshold) {
            element.classList.add('snapped-right');
        } else if (e && e.clientY <= 28 + snapThreshold / 2) {
            element.classList.add('snapped-maximized');
        }

        // Hide snap preview
        snapPreview.classList.remove('visible', 'snap-left', 'snap-right', 'snap-maximize');

        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// ============================================
// RESIZABLE WINDOWS (Desktop Only)
// ============================================

function makeResizable(element) {
    if (currentOS !== 'desktop') return;

    const minWidth = 400;
    const minHeight = 300;

    // Create resize handles
    const handles = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
    handles.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${pos}`;
        handle.dataset.direction = pos;
        element.appendChild(handle);

        handle.addEventListener('mousedown', initResize);
    });

    let startX, startY, startWidth, startHeight, startTop, startLeft;
    let currentHandle = null;

    function initResize(e) {
        e.preventDefault();
        e.stopPropagation();

        // Remove any snap classes when manually resizing
        element.classList.remove('snapped-left', 'snapped-right', 'snapped-maximized');

        currentHandle = e.target.dataset.direction;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;
        startTop = element.offsetTop;
        startLeft = element.offsetLeft;

        bringToFront(element);

        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);
    }

    function doResize(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newTop = startTop;
        let newLeft = startLeft;

        // Handle each direction
        if (currentHandle.includes('right')) {
            newWidth = Math.max(minWidth, startWidth + dx);
        }
        if (currentHandle.includes('left')) {
            newWidth = Math.max(minWidth, startWidth - dx);
            if (newWidth > minWidth) {
                newLeft = startLeft + dx;
            }
        }
        if (currentHandle.includes('bottom')) {
            newHeight = Math.max(minHeight, startHeight + dy);
        }
        if (currentHandle.includes('top')) {
            newHeight = Math.max(minHeight, startHeight - dy);
            if (newHeight > minHeight) {
                newTop = startTop + dy;
            }
        }

        // Apply new dimensions
        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';
        element.style.top = newTop + 'px';
        element.style.left = newLeft + 'px';

        // Update max-width/max-height to allow resizing beyond defaults
        element.style.maxWidth = 'none';
        element.style.maxHeight = 'none';
    }

    function stopResize() {
        currentHandle = null;
        document.removeEventListener('mousemove', doResize);
        document.removeEventListener('mouseup', stopResize);
    }
}

// ============================================
// DRAGGABLE APP ICONS (Desktop Only) - Grid-Based
// ============================================

// ============================================
// APP ICONS & DOCK INTERACTION
// ============================================

function handleAppIconClick(appName) {
    if (!appName) return;

    const windowId = `${appName}-window`;
    const windowEl = document.getElementById(windowId);

    if (!windowEl) return;

    // Check if window is currently active/open
    if (activeWindows.has(windowId)) {
        // It is open. Check if it is the TOP most window.
        // We compare zIndex. currentZIndex holds the value of the topmost window.
        const zIndex = parseInt(windowEl.style.zIndex || 0);
        
        if (zIndex === currentZIndex) {
            // It is the top window, so toggle it OFF (close it)
            closeWindow(windowId);
        } else {
            // It is open but in background, so bring to front
            openWindow(appName);
        }
    } else {
        // Not open, so open it
        openWindow(appName);
    }
}

function setupAppIcons() {
    // App icons (all platforms)
    const appIcons = document.querySelectorAll('.app-icon');
    appIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            // Prevent double firing if needed, though click is usually fine
            e.preventDefault();
            const appName = icon.dataset.app;
            handleAppIconClick(appName);
        });
    });

    // Dock items (all platforms)
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const appName = item.dataset.app;
            if (appName) {
                handleAppIconClick(appName);
            }
        });
    });
}

// ============================================
// WINDOW CONTROLS
// ============================================

// Track minimized windows
const minimizedWindows = new Map();

function setupTrafficLights() { // Keeping function name to avoid breaking calls, or could rename
    // Close button
    document.querySelectorAll('.window-control.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const windowEl = btn.closest('.window');
            if (windowEl) {
                closeWindow(windowEl.id);
            }
        });
    });

    // Minimize button with genie effect
    document.querySelectorAll('.window-control.minimize').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const windowEl = btn.closest('.window');
            if (windowEl) {
                minimizeWindow(windowEl.id);
            }
        });
    });

    // Maximize button
    document.querySelectorAll('.window-control.maximize').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const windowEl = btn.closest('.window');
            if (windowEl) {
                if (windowEl.classList.contains('snapped-maximized')) {
                    // Restore from maximize
                    windowEl.classList.remove('snapped-maximized');
                    const state = windowSnapState.get(windowEl.id);
                    if (state) {
                        windowEl.style.width = state.width;
                        windowEl.style.height = state.height;
                        windowEl.style.top = state.top;
                        windowEl.style.left = state.left;
                    }
                } else {
                    // Maximize
                    if (!windowSnapState.has(windowEl.id)) {
                        windowSnapState.set(windowEl.id, {
                            width: windowEl.style.width || getComputedStyle(windowEl).width,
                            height: windowEl.style.height || getComputedStyle(windowEl).height,
                            top: windowEl.style.top,
                            left: windowEl.style.left
                        });
                    }
                    windowEl.classList.add('snapped-maximized');
                }
            }
        });
    });
}

function minimizeWindow(windowId) {
    const windowEl = document.getElementById(windowId);
    if (!windowEl) return;

    // Play minimize sound
    SoundManager.playWhoosh();

    // Store window state
    minimizedWindows.set(windowId, {
        top: windowEl.style.top,
        left: windowEl.style.left
    });

    // Add minimizing animation class
    windowEl.classList.add('minimizing');
    windowEl.classList.remove('opening');

    // Hide after animation
    setTimeout(() => {
        windowEl.style.display = 'none';
        windowEl.classList.remove('minimizing');
        activeWindows.delete(windowId);
        updateDockActiveStates();
    }, 350);
}

function restoreWindow(appName) {
    const windowId = `${appName}-window`;
    const windowEl = document.getElementById(windowId);
    
    if (!windowEl) return;
    
    // Check if minimized
    if (minimizedWindows.has(windowId)) {
        const state = minimizedWindows.get(windowId);
        
        windowEl.style.display = 'flex';
        windowEl.classList.add('restoring');
        
        // Play restore sound
        SoundManager.playClick();
        
        activeWindows.add(windowId);
        bringToFront(windowEl);
        updateDockActiveStates();
        
        setTimeout(() => {
            windowEl.classList.remove('restoring');
        }, 350);
        
        minimizedWindows.delete(windowId);
    } else {
        // Normal open
        openWindow(appName);
    }
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
// MOBILE GESTURES  
// ============================================

function setupMobileGestures() {
    if (currentOS === 'desktop') return;

    let touchStartY = 0;
    let touchStartX = 0;
    let currentWindowEl = null;

    document.querySelectorAll('.window-header').forEach(header => {
        header.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            currentWindowEl = header.closest('.window');
        }, { passive: true });

        header.addEventListener('touchend', (e) => {
            if (!currentWindowEl) return;

            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const diffY = touchEndY - touchStartY;
            const diffX = touchEndX - touchStartX;

            // Swipe down = close
            if (diffY > 80 && Math.abs(diffX) < 50) {
                closeWindow(currentWindowEl.id);
            }
            // Swipe left/right = switch apps
            else if (Math.abs(diffX) > 100 && Math.abs(diffY) < 50) {
                const windowsArray = Array.from(activeWindows);
                if (windowsArray.length <= 1) return;

                const currentIndex = windowsArray.indexOf(currentWindowEl.id);
                let newIndex;

                if (diffX > 0) {
                    // Swipe right = previous app
                    newIndex = currentIndex > 0 ? currentIndex - 1 : windowsArray.length - 1;
                } else {
                    // Swipe left = next app
                    newIndex = currentIndex < windowsArray.length - 1 ? currentIndex + 1 : 0;
                }

                const nextWindowId = windowsArray[newIndex];
                const nextWindowEl = document.getElementById(nextWindowId);
                if (nextWindowEl) {
                    bringToFront(nextWindowEl);
                }
            }

            currentWindowEl = null;
        }, { passive: true });
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

// Fake Filesystem - Now with persistence!
let currentPath = '/home/visitor';

// (Moved to top of file as DEFAULT_FILE_SYSTEM)

// Load filesystem from localStorage or use default
let fileSystem;
try {
    fileSystem = JSON.parse(localStorage.getItem('portfolioFileSystem')) || JSON.parse(JSON.stringify(DEFAULT_FILE_SYSTEM));
} catch (e) {
    console.error('Failed to load filesystem from localStorage:', e);
    fileSystem = JSON.parse(JSON.stringify(DEFAULT_FILE_SYSTEM));
}

// Save filesystem to localStorage
function saveFileSystem() {
    localStorage.setItem('portfolioFileSystem', JSON.stringify(fileSystem));
}

// Reset filesystem to default
function resetFileSystem() {
    fileSystem = JSON.parse(JSON.stringify(DEFAULT_FILE_SYSTEM));
    saveFileSystem();
}

function resolvePath(inputPath) {
    if (!inputPath) return currentPath;

    let path = inputPath;

    // Handle home shortcut
    if (path === '~') return '/home/visitor';
    if (path.startsWith('~/')) path = '/home/visitor' + path.slice(1);

    // Handle relative paths
    if (!path.startsWith('/')) {
        path = currentPath + '/' + path;
    }

    // Normalize path (handle .. and .)
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
  reset-icons   - Reset app icons to default positions
  reset-fs      - Reset filesystem to default
  help          - Show this help message
  
  // Easter eggs:
  milk, sudo, matrix, hello, neofetch`;
    },

    pwd: () => {
        return currentPath;
    },

    ls: (args) => {
        const targetPath = resolvePath(args[0]);
        const node = fileSystem[targetPath];

        if (!node) {
            return `ls: cannot access '${args[0] || targetPath}': No such file or directory`;
        }

        if (node.type === 'file') {
            return args[0] || targetPath.split('/').pop();
        }

        if (!node.children || node.children.length === 0) {
            return ''; // Empty directory
        }

        // Format output with colors (using unicode symbols)
        return node.children.map(child => {
            const childPath = targetPath === '/' ? '/' + child : targetPath + '/' + child;
            const childNode = fileSystem[childPath];
            if (childNode && childNode.type === 'dir') {
                return '📁 ' + child + '/';
            } else {
                return '📄 ' + child;
            }
        }).join('\n');
    },

    cd: (args) => {
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

    cat: (args) => {
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
3. AI Image Generator       - Web-based AI image generation (Coming Soon)
4. Smart Task Manager       - AI-powered task management app (Coming Soon)

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

    // === FILE SYSTEM COMMANDS ===
    touch: (args) => {
        if (!args[0]) {
            return 'Usage: touch <filename>';
        }

        const targetPath = resolvePath(args[0]);
        const fileName = targetPath.split('/').pop();
        const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/')) || '/';
        const parentNode = fileSystem[parentPath];

        // Check if file already exists
        if (fileSystem[targetPath]) {
            return `touch: cannot create '${args[0]}': File exists`;
        }

        // Check if parent directory exists
        if (!parentNode || parentNode.type !== 'dir') {
            return `touch: cannot create '${args[0]}': No such directory`;
        }

        // Create the file
        fileSystem[targetPath] = {
            type: 'file',
            content: ''
        };
        parentNode.children.push(fileName);
        saveFileSystem();

        return `Created file: ${fileName}`;
    },

    mkdir: (args) => {
        if (!args[0]) {
            return 'Usage: mkdir <dirname>';
        }

        const targetPath = resolvePath(args[0]);
        const dirName = targetPath.split('/').pop();
        const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/')) || '/';
        const parentNode = fileSystem[parentPath];

        // Check if already exists
        if (fileSystem[targetPath]) {
            return `mkdir: cannot create directory '${args[0]}': File exists`;
        }

        // Check if parent directory exists
        if (!parentNode || parentNode.type !== 'dir') {
            return `mkdir: cannot create directory '${args[0]}': No such directory`;
        }

        // Create the directory
        fileSystem[targetPath] = {
            type: 'dir',
            children: []
        };
        parentNode.children.push(dirName);
        saveFileSystem();

        return `Created directory: ${dirName}`;
    },

    rm: (args) => {
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

        // Prevent deleting system files
        if (!targetPath.startsWith('/home/visitor/')) {
            return `rm: cannot remove '${args[0]}': Permission denied`;
        }

        const fileName = targetPath.split('/').pop();
        const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/'));
        const parentNode = fileSystem[parentPath];

        // Remove from parent's children
        if (parentNode && parentNode.children) {
            parentNode.children = parentNode.children.filter(c => c !== fileName);
        }

        // Delete the file
        delete fileSystem[targetPath];
        saveFileSystem();

        return `Removed: ${args[0]}`;
    },

    rmdir: (args) => {
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

        // Prevent deleting system directories
        if (!targetPath.startsWith('/home/visitor/') || targetPath === '/home/visitor') {
            return `rmdir: failed to remove '${args[0]}': Permission denied`;
        }

        const dirName = targetPath.split('/').pop();
        const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/'));
        const parentNode = fileSystem[parentPath];

        // Remove from parent's children
        if (parentNode && parentNode.children) {
            parentNode.children = parentNode.children.filter(c => c !== dirName);
        }

        // Delete the directory
        delete fileSystem[targetPath];
        saveFileSystem();

        return `Removed directory: ${args[0]}`;
    },

    'reset-fs': () => {
        resetFileSystem();
        return 'Filesystem reset to default.\nAll user-created files and folders have been removed.';
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
    const quickToggle = document.getElementById('quick-theme-toggle');
    
    // Function to update UI based on theme
    function updateThemeUI(isDark) {
        if (themeToggle) {
            themeToggle.checked = isDark;
            themeToggle.setAttribute('aria-expanded', isDark);
        }
        if (quickToggle) {
            const icon = quickToggle.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            quickToggle.setAttribute('aria-expanded', isDark);
        }
    }
    
    // Function to toggle theme
    function toggleTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            updateThemeUI(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateThemeUI(true);
        }
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeUI(true);
    } else {
        // Set initial aria-expanded state for light mode
        updateThemeUI(false);
    }

    // Settings toggle handler
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            toggleTheme();
        });
    }
    
    // Quick toggle handler
    if (quickToggle) {
        quickToggle.addEventListener('click', () => {
            toggleTheme();
        });
    }
}

// ============================================
// SOUND TOGGLE
// ============================================

// Toast notification helper
function showToast(message, icon = 'fa-info-circle') {
    // Remove any existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    document.body.appendChild(toast);

    // Show toast
    requestAnimationFrame(() => {
        toast.classList.add('visible');
    });

    // Hide and remove after 2 seconds
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function setupSoundToggle() {
    const soundToggle = document.getElementById('sound-toggle');
    if (!soundToggle) return;

    // Set initial state from SoundManager
    soundToggle.checked = !SoundManager.isMuted();
    // Set aria-expanded for accessibility
    soundToggle.setAttribute('aria-expanded', !SoundManager.isMuted());

    soundToggle.addEventListener('change', () => {
        const isMuted = !soundToggle.checked;
        SoundManager.setMuted(isMuted);
        
        // Update aria-expanded
        soundToggle.setAttribute('aria-expanded', !isMuted);
        
        // Show toast notification
        if (isMuted) {
            showToast('Sound effects muted', 'fa-volume-mute');
        } else {
            showToast('Sound effects enabled', 'fa-volume-up');
        }
    });
}

// ============================================
// CONTEXT MENU
// ============================================

function setupContextMenu() {
    const contextMenu = document.getElementById('context-menu');
    if (!contextMenu) return;

    // Show context menu on right-click on desktop (main-content or wallpaper)
    document.querySelector('.main-content').addEventListener('contextmenu', (e) => {
        // Only show context menu on desktop
        if (currentOS !== 'desktop') return;
        
        // Don't show if clicking on a window or app icon
        if (e.target.closest('.window') || e.target.closest('.app-icon') || e.target.closest('.dock')) {
            return;
        }

        e.preventDefault();

        // Position the menu
        let x = e.clientX;
        let y = e.clientY;

        // Ensure menu doesn't go off-screen
        const menuWidth = 180;
        const menuHeight = 200;
        if (x + menuWidth > window.innerWidth) x -= menuWidth;
        if (y + menuHeight > window.innerHeight) y -= menuHeight;

        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.add('visible');
    });

    // Hide context menu on click anywhere
    document.addEventListener('click', () => {
        contextMenu.classList.remove('visible');
    });

    // Hide on scroll
    document.addEventListener('scroll', () => {
        contextMenu.classList.remove('visible');
    });

    // Handle context menu item clicks
    contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = item.dataset.action;
            handleContextMenuAction(action);
            contextMenu.classList.remove('visible');
        });
    });
}

function handleContextMenuAction(action) {
    switch (action) {
        case 'new-folder':
            const folderName = prompt('Enter folder name:');
            if (folderName && folderName.trim()) {
                const result = terminalCommands.mkdir([folderName.trim()]);
                console.log(result);
            }
            break;
        case 'new-file':
            const fileName = prompt('Enter file name:');
            if (fileName && fileName.trim()) {
                const result = terminalCommands.touch([fileName.trim()]);
                console.log(result);
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
            console.log('Unknown action:', action);
    }
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

// (Moved to top of file as BOOT_LOG_MESSAGES)

function initBootScreen() {
    const bootScreen = document.getElementById('boot-screen');
    const bootLog = document.getElementById('boot-log');
    if (!bootScreen || !bootLog) return;

    let lineIndex = 0;
    const interval = 80; // ms per line

    function addLine() {
        if (lineIndex < BOOT_LOG_MESSAGES.length) {
            const line = BOOT_LOG_MESSAGES[lineIndex];
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
                    // Try to play startup sound (might be blocked by browser policy without interaction)
                    SoundManager.playStartupDrum();
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
    let savedPositions = {};
    try {
        savedPositions = JSON.parse(localStorage.getItem('stickyNotePositions_v2') || '{}');
    } catch (e) {
        console.error('Failed to load sticky note positions:', e);
        savedPositions = {};
    }

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
// PARALLAX WALLPAPER EFFECT
// ============================================

function setupParallaxWallpaper() {
    if (currentOS !== 'desktop') return;
    
    const wallpaper = document.querySelector('.wallpaper');
    if (!wallpaper) return;
    
    let rafId = null;
    
    document.addEventListener('mousemove', (e) => {
        // Throttle with requestAnimationFrame
        if (rafId) return;
        
        rafId = requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
            const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
            
            wallpaper.style.setProperty('--mouse-x', x.toFixed(3));
            wallpaper.style.setProperty('--mouse-y', y.toFixed(3));
            
            rafId = null;
        });
    });
}

// ============================================
// SMOOTH SCROLL FOR WINDOW BODIES
// ============================================

function setupSmoothScroll() {
    document.querySelectorAll('.window-body').forEach(body => {
        body.style.scrollBehavior = 'smooth';
    });
}

// ============================================
// FIRST-VISIT NAVIGATION HINT
// ============================================

function setupNavigationHint() {
    const navHint = document.getElementById('nav-hint');
    const dismissBtn = document.getElementById('nav-hint-dismiss');
    
    if (!navHint || !dismissBtn) return;
    
    // Check if user has seen the hint before
    const hasSeenHint = localStorage.getItem('hasSeenNavHint');
    
    if (!hasSeenHint && currentOS === 'desktop') {
        // Show hint after boot animation completes
        setTimeout(() => {
            navHint.classList.add('visible');
        }, 4000); // Wait for boot animation
    }
    
    // Dismiss button handler
    dismissBtn.addEventListener('click', () => {
        navHint.classList.remove('visible');
        localStorage.setItem('hasSeenNavHint', 'true');
    });
    
    // Also dismiss on any app icon click
    document.querySelectorAll('.app-icon, .dock-item').forEach(el => {
        el.addEventListener('click', () => {
            if (navHint.classList.contains('visible')) {
                navHint.classList.remove('visible');
                localStorage.setItem('hasSeenNavHint', 'true');
            }
        }, { once: true });
    });
}

// ============================================
// MOBILE SWIPE GESTURE HINT
// ============================================

function setupSwipeHint() {
    if (currentOS === 'desktop') return;
    
    const hasSeenSwipeHint = localStorage.getItem('hasSeenSwipeHint');
    if (hasSeenSwipeHint) return;
    
    // Create swipe hint element
    const swipeHint = document.createElement('div');
    swipeHint.className = 'swipe-hint';
    swipeHint.innerHTML = '<i class="fas fa-hand-pointer"></i> Swipe down on window header to close';
    document.body.appendChild(swipeHint);
    
    // Show hint after first window opens
    let windowOpenCount = 0;
    
    // Listen for first window open on mobile
    document.querySelectorAll('.app-icon, .dock-item').forEach(el => {
        el.addEventListener('click', () => {
            windowOpenCount++;
            if (windowOpenCount === 1 && !hasSeenSwipeHint) {
                setTimeout(() => {
                    swipeHint.classList.add('visible');
                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        swipeHint.classList.remove('visible');
                        localStorage.setItem('hasSeenSwipeHint', 'true');
                    }, 5000);
                }, 1000);
            }
        }, { once: true });
    });
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
    setupTerminalMobileFix();
    setupThemeToggle();
    setupSoundToggle();
    setupContextMenu();
    setupMobileGestures();

    // Create sticky notes (desktop only)
    createStickyNotes();

    // Setup parallax wallpaper effect (desktop only)
    setupParallaxWallpaper();
    
    // Setup smooth scroll for window bodies
    setupSmoothScroll();
    
    // Setup first-visit navigation hint
    setupNavigationHint();
    
    // Setup mobile swipe gesture hint
    setupSwipeHint();
    
    // Make all windows draggable and resizable (will be disabled on mobile/tablet)
    document.querySelectorAll('.window').forEach(win => {
        makeDraggable(win);
        makeResizable(win);

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

// ============================================
// MOBILE TERMINAL INPUT FIX
// ============================================

function setupTerminalMobileFix() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalWindow = document.getElementById('terminal-window');
    
    if (!terminalInput || !terminalWindow) return;
    
    // When input gets focus (keyboard opens), scroll window to ensure input is visible
    terminalInput.addEventListener('focus', () => {
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                terminalWindow.querySelector('.window-body').scrollTop = terminalWindow.querySelector('.window-body').scrollHeight;
                // Also scroll window itself into view if needed
                terminalWindow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300); // Delay for keyboard animation
        }
    });
}


import type {
    StickyNote,
    FileSystem,
    AppDefinition,
    WallpaperOption,
    AccentColor,
    Notification,
} from '../types';

// ============================================
// APP DEFINITIONS
// ============================================

export const APP_DEFINITIONS: AppDefinition[] = [
    { id: 'about', label: 'About', icon: 'fas fa-user-circle', dockTooltip: 'About Me', gradient: 'linear-gradient(135deg, var(--fedora-blue-light) 0%, var(--fedora-blue) 100%)' },
    { id: 'skills', label: 'Skills', icon: 'fas fa-tools', dockTooltip: 'Skills', gradient: 'linear-gradient(135deg, #c061cb 0%, var(--fedora-purple) 100%)' },
    { id: 'projects', label: 'Projects', icon: 'fas fa-folder', dockTooltip: 'Projects', gradient: 'linear-gradient(135deg, #5b9bd5 0%, var(--fedora-blue-dark) 100%)' },
    { id: 'contact', label: 'Contact', icon: 'fas fa-envelope', dockTooltip: 'Contact', gradient: 'linear-gradient(135deg, #c061cb 0%, var(--fedora-purple) 100%)' },
    { id: 'links', label: 'Links', icon: 'fas fa-link', dockTooltip: 'Links', gradient: 'linear-gradient(135deg, var(--fedora-blue-light) 0%, var(--fedora-teal) 100%)' },
    { id: 'terminal', label: 'Terminal', icon: 'fas fa-terminal', dockTooltip: 'Terminal', gradient: 'linear-gradient(135deg, #57e389 0%, var(--fedora-green) 100%)' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog', dockTooltip: 'Settings', gradient: 'linear-gradient(135deg, #c0bfbc 0%, #9a9996 100%)' },
    { id: 'focus-mode', label: 'Focus', icon: 'fas fa-clock', dockTooltip: 'Focus Mode', gradient: 'linear-gradient(135deg, #ff7800 0%, #e5611a 100%)' },
];

export const DOCK_APPS: AppDefinition[] = APP_DEFINITIONS.filter(
    (app) => app.id !== 'focus-mode',
);

// ============================================
// BOOT LOG MESSAGES
// ============================================

export const BOOT_LOG_MESSAGES: string[] = [
    '[    0.000000] Linux version 6.11.4-301.fc43.x86_64 (mockbuild@fedora)',
    '[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-6.11.4-301.fc43.x86_64 root=/dev/sda1',
    '[    0.183421] ACPI: Core revision 20230628',
    '[    0.541209] PCI: Using configuration type 1 for base access',
    '[    0.891234] systemd[1]: Fedora Linux 43 (Workstation Edition)',
    '[    1.021445] systemd[1]: Detected virtualization none.',
    '[  OK  ] Started systemd-journald.service - Journal Service',
    '[  OK  ] Started systemd-udevd.service - Rule-based Manager',
    '[  OK  ] Started NetworkManager.service - Network Manager',
    '[  OK  ] Started pipewire.service - PipeWire Multimedia Service',
    '[  OK  ] Started pipewire-pulse.service - PipeWire PulseAudio',
    '[  OK  ] Started flatpak-system-helper.service',
    '[  OK  ] Started gdm.service - GNOME Display Manager',
    '[  OK  ] Reached target graphical.target - Graphical Interface',
    '',
    '         Fedora Linux 43 (Workstation Edition)',
    '         Kernel 6.11.4-301.fc43.x86_64 on Wayland',
    '',
    "Welcome to Saw Ye Htet's Portfolio!",
    '',
];

// ============================================
// STICKY NOTES DATA
// ============================================

export const stickyNotesData: StickyNote[] = [
    { text: 'I like coke but \ncoke light is better \u{1F964}', color: 'yellow', rotation: -3, x: 75, y: 15 },
    { text: 'Roses are red.\nViolets are blue.\nUnexpected error in line 52.', color: 'pink', rotation: 2, x: 82, y: 35 },
    { text: 'System.out.println\n("Hi Mom! I love you.");', color: 'blue', rotation: -1, x: 78, y: 55 },
    { text: 'Press Ctrl+Tab \nto cycle windows! \u{1F4BB}', color: 'green', rotation: 3, x: 70, y: 75 },
];

// ============================================
// FILE SYSTEM DATA
// ============================================

export const DEFAULT_FILE_SYSTEM: FileSystem = {
    '/': { type: 'dir', children: ['home', 'etc', 'var'] },
    '/home': { type: 'dir', children: ['sawyehtet'] },
    '/home/sawyehtet': { type: 'dir', children: ['projects', 'documents', 'resume.txt', '.bashrc'] },
    '/home/sawyehtet/projects': { type: 'dir', children: ['jewelry-vr', 'portfolio', 'README.md'] },
    '/home/sawyehtet/projects/jewelry-vr': { type: 'dir', children: ['main.cs', 'HandTracking.cs'] },
    '/home/sawyehtet/projects/jewelry-vr/main.cs': {
        type: 'file',
        content: '// Unity VR Game - Main Entry Point\nusing UnityEngine;\n\npublic class JewelryHeist : MonoBehaviour {\n    void Start() {\n        Debug.Log("Welcome to Jewelry Shop Robbery VR!");\n    }\n}',
    },
    '/home/sawyehtet/projects/jewelry-vr/HandTracking.cs': {
        type: 'file',
        content: '// Meta Quest Hand Tracking Integration\nusing Oculus.Interaction;\n\npublic class HandGrabber : MonoBehaviour {\n    // Grab gems with your bare hands!\n}',
    },
    '/home/sawyehtet/projects/portfolio': { type: 'dir', children: ['index.html', 'main.css', 'main.js'] },
    '/home/sawyehtet/projects/portfolio/index.html': {
        type: 'file',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <title>Saw Ye Htet - Portfolio</title>\n</head>\n<body>\n    <!-- You are here! -->\n</body>\n</html>',
    },
    '/home/sawyehtet/projects/portfolio/main.css': {
        type: 'file',
        content: '/* Fedora 43 / Adwaita Theme */\n:root {\n    --fedora-blue: #3584e4;\n    --surface-0: #ffffff;\n}\n/* ... 1000+ more lines of CSS magic */',
    },
    '/home/sawyehtet/projects/portfolio/main.js': {
        type: 'file',
        content: '// The very code running this terminal!\n// Written with \u2764\uFE0F by Saw Ye Htet\nconsole.log("Hello, curious visitor!");',
    },
    '/home/sawyehtet/projects/README.md': {
        type: 'file',
        content: '# My Projects\n\nWelcome to my project folder!\n\n- **jewelry-vr**: VR Heist Game for Meta Quest\n- **portfolio**: This website!\n\nFeel free to explore with `cd` and `cat`.',
    },
    '/home/sawyehtet/documents': { type: 'dir', children: ['notes.txt', 'ideas.md'] },
    '/home/sawyehtet/documents/notes.txt': {
        type: 'file',
        content: 'TODO:\n- Finish VR project\n- Update portfolio\n- Master Godot Engine\n- Call mom \u{1F499}',
    },
    '/home/sawyehtet/documents/ideas.md': {
        type: 'file',
        content: '# Future Project Ideas\n\n1. Multiplayer VR escape room\n2. Indie game with procedural generation\n3. Open-source developer tools',
    },
    '/home/sawyehtet/resume.txt': {
        type: 'file',
        content: '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557\n\u2551         SAW YE HTET - RESUME          \u2551\n\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563\n\u2551 Education: Singapore Polytechnic      \u2551\n\u2551 Major: Information Technology         \u2551\n\u2551 Skills: Unity, C#, JavaScript, Python \u2551\n\u2551 Focus: VR Development, Full-Stack     \u2551\n\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D\n\nContact: minwn2244@gmail.com',
    },
    '/home/sawyehtet/.bashrc': {
        type: 'file',
        content: '# ~/.bashrc\nexport PS1="sawyehtet@fedora:~$ "\nalias ll="ls -la"\nalias cls="clear"\n\n# Secret: You found the hidden config!',
    },
    '/etc': { type: 'dir', children: ['hostname', 'os-release'] },
    '/etc/hostname': { type: 'file', content: 'fedora' },
    '/etc/os-release': {
        type: 'file',
        content: 'NAME="Fedora Linux"\nVERSION="43 (Workstation Edition)"\nID=fedora\nPRETTY_NAME="Fedora Linux 43 (Workstation Edition)"',
    },
    '/var': { type: 'dir', children: ['log'] },
    '/var/log': { type: 'dir', children: ['visitor.log'] },
    '/var/log/visitor.log': {
        type: 'file',
        content: '[INFO] Visitor connected to portfolio\n[INFO] Terminal session started\n[INFO] Thanks for exploring! \u{1F389}',
    },
};

// ============================================
// TERMINAL EASTER EGG RESPONSES
// ============================================

export const terminalFortunes: string[] = [
    'A bug in the code is worth two in the documentation.',
    'Today is a good day to commit and push.',
    'You will solve that tricky bug before lunch.',
    'Someone will appreciate your clean code today.',
    "The semicolon you're missing is on line 42.",
    'Your next project will be your best yet.',
    'Coffee + Code = Success',
    'Remember: It works on my machine is not a valid excuse.',
];

export const terminalJokes: string[] = [
    'Why do programmers prefer dark mode?\nBecause light attracts bugs.',
    "A SQL query walks into a bar, walks up to two tables and asks...\n'Can I join you?'",
    "Why do Java developers wear glasses?\nBecause they don't C#.",
    "!false - It's funny because it's true.",
    "A programmer's wife tells him: 'Go to the store and buy a loaf of bread. If they have eggs, buy a dozen.'\nHe comes home with 12 loaves of bread.",
    "There are only 10 types of people in the world:\nThose who understand binary and those who don't.",
];

export const terminalGreetings: string[] = [
    'Hey there! \u{1F44B} Welcome to my corner of the internet.',
    'Hi! Thanks for exploring. Feel free to poke around!',
    "Hi Mom! \u{1F499} (This one's for you)",
    "Greetings, traveler! You've found the secret hello.",
];

// ============================================
// WALLPAPERS
// ============================================

export const WALLPAPERS: WallpaperOption[] = [
    { id: 'default', label: 'Fedora 43 (Time)', gradient: null },
    { id: 'adwaita-dark', label: 'Adwaita Dark', gradient: 'linear-gradient(135deg, #242424 0%, #303030 50%, #242424 100%)' },
    { id: 'gnome-blobs', label: 'GNOME Blobs', gradient: 'radial-gradient(ellipse at 20% 50%, #3584e4 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #9141ac 0%, transparent 40%), radial-gradient(ellipse at 70% 80%, #2ec27e 0%, transparent 45%), linear-gradient(135deg, #242424 0%, #303030 100%)' },
    { id: 'fedora-dark', label: 'Fedora Dark', gradient: 'linear-gradient(160deg, #0d1b2a 0%, #1b2838 30%, #303030 60%, #242424 100%)' },
    { id: 'aurora', label: 'Aurora', gradient: 'linear-gradient(135deg, #0d2137 0%, #9141ac 40%, #3584e4 70%, #2ec27e 100%)' },
    { id: 'ocean', label: 'Ocean Blue', gradient: 'linear-gradient(135deg, #0c3547 0%, #1a6b8a 50%, #11998e 100%)' },
    { id: 'midnight', label: 'Midnight', gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
];

// ============================================
// ACCENT COLORS
// ============================================

export const ACCENT_COLORS: AccentColor[] = [
    { color: '#3584e4', label: 'Blue' },
    { color: '#2ec27e', label: 'Green' },
    { color: '#e5a50a', label: 'Yellow' },
    { color: '#e01b24', label: 'Red' },
    { color: '#9141ac', label: 'Purple' },
    { color: '#2190a4', label: 'Teal' },
    { color: '#ff7800', label: 'Orange' },
    { color: '#d971b0', label: 'Pink' },
    { color: '#8c8c8c', label: 'Slate' },
];

// ============================================
// DEFAULT NOTIFICATIONS
// ============================================

export const DEFAULT_NOTIFICATIONS: Notification[] = [
    {
        id: 'welcome',
        title: 'Fedora 43 Desktop',
        body: 'Welcome! Click any app icon in the dock to get started.',
        icon: 'fab fa-fedora',
        iconBg: 'linear-gradient(135deg, var(--fedora-blue-light), var(--fedora-blue))',
        time: 'Just now',
        group: 'System',
    },
    {
        id: 'updated',
        title: 'System Updated',
        body: 'Fedora 43 is up to date. All packages are current.',
        icon: 'fas fa-check-circle',
        iconBg: 'linear-gradient(135deg, var(--fedora-green), var(--fedora-teal))',
        time: '2 min ago',
        group: 'System',
    },
];

// ============================================
// BOOT TIMING CONSTANTS
// ============================================

export const BOOT_LINE_INTERVAL_MS = 80;
export const PLYMOUTH_DURATION_MS = 2000;

// ============================================
// GESTURE THRESHOLDS
// ============================================

export const SWIPE_CLOSE_THRESHOLD_Y = 80;
export const SWIPE_CLOSE_MAX_X = 50;
export const SWIPE_SWITCH_THRESHOLD_X = 100;
export const SWIPE_SWITCH_MAX_Y = 50;

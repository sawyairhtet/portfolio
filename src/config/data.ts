import type {
    FileSystem,
    AppDefinition,
    WallpaperOption,
    AccentColor,
    Notification,
    Project,
    SkillCategory,
} from '../types';
import { PROFILE } from './profile';

// ============================================
// APP DEFINITIONS
// ============================================

export const APP_DEFINITIONS: AppDefinition[] = [
    {
        id: 'about',
        label: 'About',
        icon: 'fas fa-user-circle',
        dockTooltip: 'About Me',
        gradient: 'linear-gradient(135deg, var(--fedora-blue-light) 0%, var(--fedora-blue) 100%)',
        description: 'Recruiter summary, graduation, Java focus, and personality.',
        aliases: ['bio', 'profile', 'summary', 'saw'],
        desktopDock: true,
        mobileDock: true,
    },
    {
        id: 'skills',
        label: 'Skills',
        icon: 'fas fa-tools',
        dockTooltip: 'Skills',
        gradient: 'linear-gradient(135deg, #33d17a 0%, var(--fedora-teal) 100%)',
        description: 'Technical stack with practical context and project usage.',
        aliases: ['stack', 'tools', 'technologies', 'tech'],
        desktopDock: true,
        mobileDock: true,
    },
    {
        id: 'projects',
        label: 'Projects',
        icon: 'fas fa-folder',
        dockTooltip: 'Projects',
        gradient: 'linear-gradient(135deg, #5b9bd5 0%, var(--fedora-blue-dark) 100%)',
        description: 'Featured work, proof points, tech, platforms, and source links.',
        aliases: ['work', 'portfolio', 'case studies', 'github'],
        desktopDock: true,
        mobileDock: true,
    },
    {
        id: 'contact',
        label: 'Contact',
        icon: 'fas fa-envelope',
        dockTooltip: 'Contact',
        gradient: 'linear-gradient(135deg, #c061cb 0%, var(--fedora-purple) 100%)',
        description: 'Email, resume, availability, and a contact form.',
        aliases: ['email', 'hire', 'resume', 'availability'],
        desktopDock: true,
        mobileDock: true,
    },
    {
        id: 'links',
        label: 'Links',
        icon: 'fas fa-link',
        dockTooltip: 'Links',
        gradient: 'linear-gradient(135deg, var(--fedora-blue-light) 0%, var(--fedora-teal) 100%)',
        description: 'GitHub, LinkedIn, and social profiles.',
        aliases: ['social', 'github', 'linkedin', 'x'],
        desktopDock: true,
        mobileDock: false,
    },
    {
        id: 'terminal',
        label: 'Terminal',
        icon: 'fas fa-terminal',
        dockTooltip: 'Terminal',
        gradient: 'linear-gradient(135deg, #57e389 0%, var(--fedora-green) 100%)',
        description: 'A portfolio terminal with filesystem and app commands.',
        aliases: ['shell', 'cli', 'bash', 'command'],
        desktopDock: true,
        mobileDock: false,
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: 'fas fa-cog',
        dockTooltip: 'Settings',
        gradient: 'linear-gradient(135deg, #c0bfbc 0%, #9a9996 100%)',
        description: 'Appearance, sound, windowing, and system preferences.',
        aliases: ['preferences', 'appearance', 'sound', 'windows'],
        desktopDock: true,
        mobileDock: false,
    },
    {
        id: 'focus-mode',
        label: 'Focus',
        icon: 'fas fa-clock',
        dockTooltip: 'Focus Mode',
        gradient: 'linear-gradient(135deg, #ff7800 0%, #e5611a 100%)',
        description: 'Pomodoro presets, session stats, and optional focus dimming.',
        aliases: ['pomodoro', 'timer', 'deep work', 'productivity'],
        desktopDock: false,
        mobileDock: false,
    },
];

export const DOCK_APPS: AppDefinition[] = APP_DEFINITIONS.filter(app => app.desktopDock);

export const MOBILE_DOCK_APPS: AppDefinition[] = APP_DEFINITIONS.filter(app => app.mobileDock);

export const MOBILE_LAUNCHER_APPS: AppDefinition[] = APP_DEFINITIONS.filter(app => !app.mobileDock);

// ============================================
// PORTFOLIO CONTENT DATA
// ============================================

export const PROJECTS: Project[] = [
    {
        id: 'fedora-portfolio',
        title: 'This Portfolio (Fedora Desktop)',
        role: 'Developer & Designer',
        summary:
            'The site you are using right now — a full Fedora 43 GNOME desktop simulation built in React and TypeScript, with draggable windows, a virtual terminal, a boot sequence, and real desktop keyboard shortcuts.',
        impact:
            'Turns a personal portfolio into a recruiter-friendly desktop experience while preserving fast routes to About, Skills, Projects, Resume, and Contact.',
        techStack: ['React 19', 'TypeScript', 'Vite', 'CSS Layers', 'Tailwind v4'],
        platform: 'Responsive web app',
        proofPoints: [
            'Implemented draggable windows with snap zones, resize handles, minimise/maximise, and z-index stacking.',
            'Built a virtual filesystem terminal you can explore with cd, ls, cat, and open commands.',
            'Ships with a Plymouth boot screen, GNOME Activities overlay, Quick Settings panel, and notification center.',
        ],
        links: [
            {
                label: 'View on GitHub',
                href: 'https://github.com/sawyairhtet/portfolio',
                icon: 'fab fa-github',
                primary: true,
            },
        ],
        featured: true,
        icon: 'fas fa-desktop',
    },
    {
        id: 'opstrack',
        title: 'OpsTrack',
        role: 'Developer',
        summary:
            'A Spring Boot operations tracking API with clean REST endpoints, SQL persistence, and layered architecture — built to sharpen backend fundamentals and demonstrate production-grade Java patterns.',
        impact:
            'Practice ground for applying Spring Boot, JPA, and relational data patterns in a realistic backend service.',
        techStack: ['Java', 'Spring Boot', 'PostgreSQL', 'REST API'],
        platform: 'Backend API',
        proofPoints: [
            'REST API with CRUD operations and proper HTTP status codes.',
            'Layered architecture: Controller → Service → Repository.',
            'PostgreSQL persistence with Spring Data JPA.',
        ],
        links: [
            {
                label: 'View on GitHub',
                href: 'https://github.com/sawyairhtet/opstrack',
                icon: 'fab fa-github',
                primary: true,
            },
        ],
        featured: false,
        icon: 'fas fa-server',
        status: 'wip',
    },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
    {
        title: 'Java & Backend',
        icon: 'fab fa-java',
        skills: [
            {
                name: 'Java + OOP',
                context:
                    'Object-oriented design, class hierarchies, control flow, and practical problem solving — actively building toward professional Spring Boot development.',
                usedIn: ['Singapore Polytechnic', 'Self-Study'],
                level: 'proficient',
            },
            {
                name: 'Spring Boot',
                context:
                    'REST API structure, dependency injection, application layers, and building clean backend services — current primary learning focus.',
                usedIn: ['Java Path'],
                level: 'intermediate',
            },
            {
                name: 'SQL + Data Handling',
                context:
                    'Relational data fundamentals, queries, schema design, and connecting application logic to structured storage.',
                usedIn: ['Coursework', 'Backend Study'],
                level: 'intermediate',
            },
        ],
    },
    {
        title: 'Web & Tooling',
        icon: 'fas fa-code',
        skills: [
            {
                name: 'React + TypeScript',
                context:
                    'Component architecture, stateful UI, typed config, custom context providers, and responsive app shells.',
                usedIn: ['Fedora Portfolio'],
                level: 'proficient',
            },
            {
                name: 'JavaScript / Python',
                context:
                    'Coursework, tooling, data handling, scripting, and small automation tasks.',
                usedIn: ['Coursework', 'Fedora Portfolio'],
                level: 'intermediate',
            },
            {
                name: 'Git + Linux Workflow',
                context:
                    'Source control, shell habits, public repositories, and Fedora/GNOME customization on real hardware.',
                usedIn: ['Fedora Portfolio', 'Personal Workflow'],
                level: 'proficient',
            },
        ],
    },
];

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
    '  sawyehtet@fedora  Java Software Engineer. Recent graduate. This portfolio runs on your browser.',
    '',
];

// ============================================
// FILE SYSTEM DATA
// ============================================

export const DEFAULT_FILE_SYSTEM: FileSystem = {
    '/': { type: 'dir', children: ['home', 'etc', 'var'] },
    '/home': { type: 'dir', children: ['sawyehtet'] },
    '/home/sawyehtet': {
        type: 'dir',
        children: ['projects', 'documents', 'resume.txt', '.bashrc'],
    },
    '/home/sawyehtet/projects': { type: 'dir', children: ['portfolio', 'README.md'] },
    '/home/sawyehtet/projects/portfolio': {
        type: 'dir',
        children: ['src', 'index.html', 'package.json'],
    },
    '/home/sawyehtet/projects/portfolio/index.html': {
        type: 'file',
        content:
            '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <title>Saw Ye Htet - Portfolio</title>\n</head>\n<body>\n    <!-- You are here! -->\n</body>\n</html>',
    },
    '/home/sawyehtet/projects/portfolio/package.json': {
        type: 'file',
        content:
            '{\n  "scripts": {\n    "dev": "vite",\n    "build": "tsc -b && vite build",\n    "test": "vitest"\n  },\n  "dependencies": {\n    "react": "^19",\n    "typescript": "^5"\n  }\n}',
    },
    '/home/sawyehtet/projects/portfolio/src': {
        type: 'dir',
        children: ['main.tsx', 'App.tsx', 'components', 'styles'],
    },
    '/home/sawyehtet/projects/portfolio/src/main.tsx': {
        type: 'file',
        content:
            'import { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport { App } from "./App";\nimport "./styles/main.css";',
    },
    '/home/sawyehtet/projects/portfolio/src/App.tsx': {
        type: 'file',
        content: 'export function App() {\n  return <DesktopShell />;\n}',
    },
    '/home/sawyehtet/projects/portfolio/src/components': {
        type: 'dir',
        children: ['apps', 'shell', 'ui', 'window'],
    },
    '/home/sawyehtet/projects/portfolio/src/styles': { type: 'dir', children: ['main.css'] },
    '/home/sawyehtet/projects/README.md': {
        type: 'file',
        content:
            '# My Projects\n\nWelcome to my project folder!\n\n- **portfolio**: This Fedora 43 desktop simulation — React 19, TypeScript, window management, virtual terminal\n\nFeel free to explore with `cd` and `cat`.',
    },
    '/home/sawyehtet/documents': { type: 'dir', children: ['notes.txt', 'ideas.md'] },
    '/home/sawyehtet/documents/notes.txt': {
        type: 'file',
        content:
            'TODO:\n- Keep strengthening Java fundamentals\n- Build backend practice projects\n- Update portfolio proof points\n- Call mom \u{1F499}',
    },
    '/home/sawyehtet/documents/ideas.md': {
        type: 'file',
        content:
            '# Future Project Ideas\n\n1. Java backend API with SQL persistence\n2. Spring Boot practice app\n3. Open-source developer tools',
    },
    '/home/sawyehtet/resume.txt': {
        type: 'file',
        content: `\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557\n\u2551         SAW YE HTET - RESUME          \u2551\n\u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563\n\u2551 Education: Singapore Polytechnic grad \u2551\n\u2551 Major: Information Technology         \u2551\n\u2551 Skills: Java, SQL, JavaScript, Python \u2551\n\u2551 Focus: Java developer path            \u2551\n\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D\n\nContact: ${PROFILE.email}`,
    },
    '/home/sawyehtet/.bashrc': {
        type: 'file',
        content:
            '# ~/.bashrc\nexport PS1="sawyehtet@fedora:~$ "\nalias ll="ls -la"\nalias cls="clear"\n\n# Secret: You found the hidden config!',
    },
    '/etc': { type: 'dir', children: ['hostname', 'os-release'] },
    '/etc/hostname': { type: 'file', content: 'fedora' },
    '/etc/os-release': {
        type: 'file',
        content:
            'NAME="Fedora Linux"\nVERSION="43 (Workstation Edition)"\nID=fedora\nPRETTY_NAME="Fedora Linux 43 (Workstation Edition)"',
    },
    '/var': { type: 'dir', children: ['log'] },
    '/var/log': { type: 'dir', children: ['visitor.log'] },
    '/var/log/visitor.log': {
        type: 'file',
        content:
            '[INFO] Visitor connected to portfolio\n[INFO] Terminal session started\n[INFO] Thanks for exploring! \u{1F389}',
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
    "Why do Java developers wear glasses?\nBecause they can't see without them — just like their code can't run without a JVM.",
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
    {
        // Multi-centre Fedora-blue blobs — the closest CSS approximation
        // of the official GNOME/Fedora blob wallpaper series
        id: 'fedora-blobs',
        label: 'Fedora Blobs',
        gradient:
            'radial-gradient(ellipse at 22% 48%, rgba(53,132,228,0.42) 0%, transparent 46%), radial-gradient(ellipse at 78% 30%, rgba(28,113,216,0.32) 0%, transparent 42%), radial-gradient(ellipse at 60% 78%, rgba(78,154,241,0.26) 0%, transparent 38%), radial-gradient(ellipse at 38% 18%, rgba(120,174,237,0.16) 0%, transparent 32%), linear-gradient(135deg, #0a1424 0%, #0e1c30 50%, #0a1424 100%)',
    },
    {
        // Blueprint — deep navy + single overhead Fedora-blue radial,
        // feels like a technical schematic / Fedora design asset
        id: 'blueprint',
        label: 'Blueprint',
        gradient:
            'radial-gradient(ellipse at 50% 0%, rgba(53,132,228,0.30) 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(28,113,216,0.22) 0%, transparent 45%), radial-gradient(ellipse at 100% 80%, rgba(78,154,241,0.14) 0%, transparent 38%), linear-gradient(160deg, #040d1c 0%, #071326 40%, #0b1c38 70%, #060f1e 100%)',
    },
    {
        // Indigo — deep indigo-blue matching Fedora's darker brand tone
        id: 'indigo',
        label: 'Indigo',
        gradient:
            'radial-gradient(ellipse at 50% 100%, rgba(53,132,228,0.38) 0%, transparent 46%), radial-gradient(ellipse at 18% 58%, rgba(83,96,200,0.26) 0%, transparent 40%), radial-gradient(ellipse at 82% 48%, rgba(53,132,228,0.20) 0%, transparent 36%), linear-gradient(180deg, #06080f 0%, #0c0e20 35%, #141638 60%, #0e1030 85%, #060810 100%)',
    },
    {
        // Teal — secondary Fedora/GNOME teal accent over dark navy
        id: 'fedora-teal',
        label: 'Fedora Teal',
        gradient:
            'radial-gradient(ellipse at 62% 28%, rgba(20,184,166,0.32) 0%, transparent 46%), radial-gradient(ellipse at 24% 68%, rgba(53,132,228,0.28) 0%, transparent 42%), radial-gradient(ellipse at 78% 76%, rgba(6,182,212,0.22) 0%, transparent 36%), linear-gradient(160deg, #030e0e 0%, #05141a 40%, #071c22 70%, #040f14 100%)',
    },
    {
        // Fedora Radiant — centred radial burst in signature Fedora blue,
        // evokes the "infinity" logo glow used in Fedora design assets
        id: 'fedora-radiant',
        label: 'Fedora Radiant',
        gradient:
            'radial-gradient(ellipse at 50% 50%, rgba(53,132,228,0.32) 0%, rgba(28,113,216,0.22) 32%, rgba(12,50,100,0.16) 62%, transparent 82%), radial-gradient(ellipse at 20% 28%, rgba(78,154,241,0.16) 0%, transparent 40%), radial-gradient(ellipse at 80% 72%, rgba(28,113,216,0.12) 0%, transparent 36%), linear-gradient(135deg, #040810 0%, #07101e 50%, #050c18 100%)',
    },
    {
        // GNOME Dark — clean Adwaita-dark surface with the lightest
        // blue touch; minimal option for those who prefer near-plain
        id: 'gnome-dark',
        label: 'GNOME Dark',
        gradient:
            'radial-gradient(ellipse at 38% 38%, rgba(53,132,228,0.14) 0%, transparent 52%), radial-gradient(ellipse at 66% 66%, rgba(28,113,216,0.10) 0%, transparent 42%), linear-gradient(135deg, #1e1e1e 0%, #252525 45%, #2a2a2a 72%, #1e1e1e 100%)',
    },
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
        title: 'sawyehtet.com',
        body: 'Java Software Engineer, recent SP graduate — click apps in the dock to explore projects, skills, and contact.',
        icon: 'fab fa-fedora',
        iconBg: 'linear-gradient(135deg, var(--fedora-blue-light), var(--fedora-blue))',
        time: 'Just now',
        group: 'System',
    },
];

// ============================================
// BOOT TIMING CONSTANTS
// ============================================

export const BOOT_LINE_INTERVAL_MS = 55;
export const PLYMOUTH_DURATION_MS = 1200;

// ============================================
// GESTURE THRESHOLDS
// ============================================

export const SWIPE_CLOSE_THRESHOLD_Y = 80;
export const SWIPE_CLOSE_MAX_X = 50;

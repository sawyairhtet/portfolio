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
        gradient: 'linear-gradient(135deg, var(--blue-2) 0%, var(--accent-blue) 100%)',
        description: 'Recruiter summary, graduation, Java focus, and personality.',
        aliases: ['bio', 'profile', 'summary', 'saw'],
        desktopDock: true,
        mobileDock: true,
    },
    {
        id: 'files',
        label: 'Files',
        icon: 'fas fa-folder',
        dockTooltip: 'Files',
        gradient: 'linear-gradient(135deg, var(--blue-2) 0%, var(--blue-4) 100%)',
        description: 'Nautilus-style project files, recent work, and case studies.',
        aliases: ['nautilus', 'folder', 'recent', 'documents'],
        desktopDock: true,
        mobileDock: true,
    },
    {
        id: 'skills',
        label: 'Skills',
        icon: 'fas fa-tools',
        dockTooltip: 'Skills',
        gradient: 'linear-gradient(135deg, var(--green-3) 0%, var(--accent-teal) 100%)',
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
        gradient: 'linear-gradient(135deg, var(--blue-2) 0%, var(--blue-4) 100%)',
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
        gradient: 'linear-gradient(135deg, var(--purple-2) 0%, var(--accent-purple) 100%)',
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
        gradient: 'linear-gradient(135deg, var(--blue-2) 0%, var(--accent-teal) 100%)',
        description: 'GitHub, LinkedIn, and social profiles.',
        aliases: ['social', 'github', 'linkedin', 'x'],
        desktopDock: true,
        mobileDock: false,
    },
    {
        id: 'browser',
        label: 'Firefox',
        icon: 'fab fa-firefox-browser',
        dockTooltip: 'Firefox',
        gradient: 'linear-gradient(135deg, var(--orange-3) 0%, var(--accent-purple) 100%)',
        description: 'A small browser window pointed at GitHub.',
        aliases: ['firefox', 'web', 'github', 'browser'],
        desktopDock: false,
        mobileDock: false,
    },
    {
        id: 'terminal',
        label: 'Terminal',
        icon: 'fas fa-terminal',
        dockTooltip: 'Terminal',
        gradient: 'linear-gradient(135deg, var(--green-2) 0%, var(--accent-green) 100%)',
        description: 'A portfolio terminal with filesystem and app commands.',
        aliases: ['shell', 'cli', 'bash', 'command'],
        desktopDock: true,
        mobileDock: false,
    },
    {
        id: 'text-editor',
        label: 'Papers',
        icon: 'fas fa-file-pdf',
        dockTooltip: 'Papers',
        gradient: 'linear-gradient(135deg, var(--blue-1) 0%, var(--accent-blue) 100%)',
        description: 'Resume document viewer with PDF actions and markdown fallback.',
        aliases: ['resume', 'cv', 'papers', 'text editor', 'editor', 'gedit', 'nano', 'resume.md'],
        desktopDock: false,
        mobileDock: false,
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: 'fas fa-cog',
        dockTooltip: 'Settings',
        gradient: 'linear-gradient(135deg, var(--light-4) 0%, var(--light-5) 100%)',
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
        gradient: 'linear-gradient(135deg, var(--orange-3) 0%, var(--orange-4) 100%)',
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
        title: 'Fedora-Inspired Portfolio Desktop',
        role: 'Developer & Designer',
        summary:
            'The site you are using right now - a React and TypeScript portfolio presented through a Fedora/GNOME-inspired desktop shell with windows, app search, terminal commands, and mobile launcher cards.',
        problem:
            'A static portfolio can hide the strongest proof behind navigation and make recruiters work too hard for the basics.',
        solution:
            'Built a fast desktop-style shell where About, Projects, Resume, and Contact stay one click away from the dock, Activities search, and terminal.',
        impact:
            'Shows frontend ability through real interaction design while keeping the recruiter path clear and fast.',
        techStack: ['React 19', 'TypeScript', 'Vite', 'CSS Layers', 'Tailwind v4'],
        platform: 'Responsive web app',
        proofPoints: [
            'Implemented draggable windows with snap zones, resize handles, minimise/maximise, and z-index stacking.',
            'Built a virtual filesystem terminal you can explore with cd, ls, cat, and open commands.',
            'Added Activities search, Quick Settings, notifications, welcome flow, and a mobile launcher experience.',
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
            'A Spring Boot operations tracking API for practicing REST endpoints, SQL persistence, and layered Java application structure.',
        problem:
            'I needed a Java backend project that goes beyond isolated coursework snippets and exercises real service boundaries.',
        solution:
            'Building a layered Spring Boot REST API with controllers, services, repositories, and PostgreSQL persistence.',
        impact:
            'Makes my Spring Boot and SQL learning path visible; it is marked as work in progress and kept honest in the UI.',
        techStack: ['Java', 'Spring Boot', 'PostgreSQL', 'REST API'],
        platform: 'Backend API',
        proofPoints: [
            'Defines CRUD endpoints and HTTP status handling for operations tracking workflows.',
            'Separates Controller, Service, and Repository responsibilities.',
            'Connects Spring Data JPA to PostgreSQL for relational persistence practice.',
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
    '[    0.000000] Linux version 6.19.0-301.fc43.x86_64 (mockbuild@fedora)',
    '[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-6.19.0-301.fc43.x86_64 root=/dev/sda1',
    '[    0.183421] ACPI: Core revision 20240927',
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
    '         Kernel 6.19.0-301.fc43.x86_64 on Wayland',
    '',
    '  sawyehtet@fedora  Java-focused software developer. This portfolio runs in your browser.',
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
        children: ['projects', 'documents', 'resume.txt', 'resume.md', '.bashrc'],
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
            '# Projects\n\nRecruiter scan:\n\n- **Fedora-Inspired Portfolio Desktop**: React 19, TypeScript, window management, Activities search, virtual terminal, mobile launcher.\n- **OpsTrack**: Spring Boot and PostgreSQL API practice project for REST, SQL, and layered backend design.\n\nRun `projects`, `skills`, `resume`, or `contact` for the fastest path.',
    },
    '/home/sawyehtet/documents': { type: 'dir', children: ['notes.txt', 'ideas.md'] },
    '/home/sawyehtet/documents/notes.txt': {
        type: 'file',
        content:
            'TODO:\n- Keep strengthening Java fundamentals\n- Build Spring Boot and SQL practice projects\n- Keep project proof points current\n- Make recruiter paths obvious',
    },
    '/home/sawyehtet/documents/ideas.md': {
        type: 'file',
        content:
            '# Future Project Ideas\n\n1. Java backend API with SQL persistence\n2. Spring Boot practice app\n3. Open-source developer tools',
    },
    '/home/sawyehtet/resume.txt': {
        type: 'file',
        content: `SAW YE HTET - RESUME\n\nRole: ${PROFILE.role}\nTarget: ${PROFILE.roleTarget}\nEducation: ${PROFILE.education}\nStack: ${PROFILE.primaryStack.join(', ')}\nFocus: Java, Spring Boot, SQL, REST APIs, and React + TypeScript frontend proof.\n\nContact: ${PROFILE.email}\nResume PDF: ${PROFILE.resumePath}`,
    },
    '/home/sawyehtet/resume.md': {
        type: 'file',
        content: `# Saw Ye Htet\n\n${PROFILE.role}\n\n## Positioning\n\nRecent Singapore Polytechnic IT graduate focused on Java, Spring Boot, SQL, REST APIs, and clean application structure. This portfolio is also a React + TypeScript proof point.\n\n## Focus\n\n- Java backend development\n- Spring Boot service structure\n- SQL data modelling and persistence\n- React and TypeScript interfaces\n\n## Best Proof\n\n- Fedora-inspired desktop portfolio: React 19, TypeScript, Vite, window management, search, terminal, mobile launcher\n- OpsTrack: Spring Boot and PostgreSQL backend API practice project\n\n## Recruiter Path\n\n1. About - who I am\n2. Projects - what I build\n3. Skills - technologies and learning path\n4. Resume - PDF source of truth\n5. Contact - email and form\n\n## Contact\n\n${PROFILE.email}\n${PROFILE.location}\n${PROFILE.availability}`,
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
            'NAME="Fedora Linux"\nVERSION="43 (Workstation Edition)"\nID=fedora\nPRETTY_NAME="Fedora Linux 43 (Workstation Edition)"\nKERNEL="Linux 6.19"\nWINDOWING="Wayland"\nSHELL="GNOME 49"\nPACKAGE_MANAGER="DNF5"',
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
    'Hi. The fastest recruiter path is: path, projects, resume, contact.',
    'Thanks for exploring. Try projects or skills for the useful bits.',
    'Tip: run neofetch for a compact portfolio summary.',
    'Tip: run nano resume.md for a readable resume fallback.',
];

// ============================================
// WALLPAPERS
// ============================================

export const WALLPAPERS: WallpaperOption[] = [
    {
        id: 'default',
        label: 'Fedora 43 (Time)',
        gradient: null,
        image: '/images/wallpapers/fedora-43/f43-day.webp',
        darkImage: '/images/wallpapers/fedora-43/f43-night.webp',
        sourceUrl: 'https://github.com/fedoradesign/backgrounds/tree/f43-backgrounds/default',
    },
    {
        id: 'gnome-adwaita',
        label: 'GNOME 49 Adwaita',
        gradient: null,
        image: '/images/wallpapers/gnome-49/adwaita-l.webp',
        darkImage: '/images/wallpapers/gnome-49/adwaita-d.webp',
        sourceUrl: 'https://download.gnome.org/sources/gnome-backgrounds/49/',
    },
    {
        id: 'gnome-curvy',
        label: 'GNOME 49 Curvy',
        gradient: null,
        image: '/images/wallpapers/gnome-49/curvy-l.webp',
        darkImage: '/images/wallpapers/gnome-49/curvy-d.webp',
        sourceUrl: 'https://download.gnome.org/sources/gnome-backgrounds/49/',
    },
    {
        id: 'gnome-blobs',
        label: 'GNOME 49 Blobs',
        gradient: null,
        image: '/images/wallpapers/gnome-49/blobs-l.svg',
        darkImage: '/images/wallpapers/gnome-49/blobs-d.svg',
        sourceUrl: 'https://download.gnome.org/sources/gnome-backgrounds/49/',
    },
    {
        id: 'gnome-geometrics',
        label: 'GNOME 49 Geometrics',
        gradient: null,
        image: '/images/wallpapers/gnome-49/geometrics-l.webp',
        darkImage: '/images/wallpapers/gnome-49/geometrics-d.webp',
        sourceUrl: 'https://download.gnome.org/sources/gnome-backgrounds/49/',
    },
    {
        id: 'gnome-pixels',
        label: 'GNOME 49 Pixels',
        gradient: null,
        image: '/images/wallpapers/gnome-49/pixels-l.webp',
        darkImage: '/images/wallpapers/gnome-49/pixels-d.webp',
        sourceUrl: 'https://download.gnome.org/sources/gnome-backgrounds/49/',
    },
    {
        id: 'gnome-symbolic',
        label: 'GNOME 49 Symbolic',
        gradient: null,
        image: '/images/wallpapers/gnome-49/symbolic-l.webp',
        darkImage: '/images/wallpapers/gnome-49/symbolic-d.webp',
        sourceUrl: 'https://download.gnome.org/sources/gnome-backgrounds/49/',
    },
    {
        id: 'gnome-vnc',
        label: 'GNOME 49 VNC',
        gradient: null,
        image: '/images/wallpapers/gnome-49/vnc-l.webp',
        darkImage: '/images/wallpapers/gnome-49/vnc-d.webp',
        sourceUrl: 'https://download.gnome.org/sources/gnome-backgrounds/49/',
    },
];

// ============================================
// ACCENT COLORS
// ============================================

export const ACCENT_COLORS: AccentColor[] = [
    { color: 'var(--accent-blue)', label: 'Blue' },
    { color: 'var(--accent-green)', label: 'Green' },
    { color: 'var(--accent-yellow)', label: 'Yellow' },
    { color: 'var(--accent-red)', label: 'Red' },
    { color: 'var(--accent-purple)', label: 'Purple' },
    { color: 'var(--accent-teal)', label: 'Teal' },
    { color: 'var(--accent-orange)', label: 'Orange' },
    { color: 'var(--accent-pink)', label: 'Pink' },
    { color: 'var(--accent-slate)', label: 'Slate' },
];

// ============================================
// DEFAULT NOTIFICATIONS
// ============================================

export const DEFAULT_NOTIFICATIONS: Notification[] = [
    {
        id: 'welcome',
        title: 'Welcome to Saw Ye Htet',
        body: 'Java-focused software developer. Open the resume, projects, or contact app for the quick path.',
        icon: 'fas fa-desktop',
        iconBg: 'linear-gradient(135deg, var(--accent-color), var(--accent-bg-color))',
        time: 'Just now',
        group: 'System',
        action: {
            label: 'View Resume',
            appId: 'text-editor',
        },
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

import type {
    FileSystem,
    AppDefinition,
    WallpaperOption,
    AccentColor,
    Notification,
    Project,
    SkillCategory,
    ExperienceItem,
} from '../types';
import { PROFILE } from './profile';

// ============================================
// APP DEFINITIONS
// ============================================

export const APP_DEFINITIONS: AppDefinition[] = [
    {
        id: 'about',
        label: 'About',
        icon: 'user-circle',
        dockTooltip: 'About Me',
        gradient: 'linear-gradient(135deg, var(--blue-2) 0%, var(--accent-blue) 100%)',
        description: 'Recruiter summary, graduation, support focus, and personality.',
        aliases: ['bio', 'profile', 'summary', 'saw'],
        desktopDock: true,
        mobileDock: true,
    },
    {
        id: 'files',
        label: 'Files',
        icon: 'folder',
        dockTooltip: 'Files',
        gradient: 'linear-gradient(135deg, var(--blue-2) 0%, var(--blue-4) 100%)',
        description: 'Nautilus-style project files, recent work, and case studies.',
        aliases: ['nautilus', 'folder', 'recent', 'documents'],
        desktopDock: true,
        mobileDock: false,
    },
    {
        id: 'skills',
        label: 'Skills',
        icon: 'tools',
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
        icon: 'folder-open',
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
        icon: 'envelope',
        dockTooltip: 'Contact',
        gradient: 'linear-gradient(135deg, var(--purple-2) 0%, var(--accent-purple) 100%)',
        description: 'Email, resume, availability, and a contact form.',
        aliases: ['email', 'hire', 'resume', 'availability'],
        desktopDock: true,
        mobileDock: true,
    },
    {
        id: 'browser',
        label: 'Firefox',
        icon: 'firefox-browser',
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
        icon: 'terminal',
        dockTooltip: 'Terminal',
        gradient: 'linear-gradient(135deg, var(--green-2) 0%, var(--accent-green) 100%)',
        description: 'A portfolio terminal with filesystem and app commands.',
        aliases: ['shell', 'cli', 'bash', 'command'],
        desktopDock: true,
        mobileDock: false,
    },
    {
        id: 'text-editor',
        label: 'Text Editor',
        icon: 'file-lines',
        dockTooltip: 'Text Editor',
        gradient: 'linear-gradient(135deg, var(--blue-1) 0%, var(--accent-blue) 100%)',
        description: 'Edit and preview the resume in markdown format.',
        aliases: ['text editor', 'editor', 'gedit', 'nano', 'resume.md', 'txt'],
        desktopDock: false,
        mobileDock: false,
    },
    {
        id: 'resume',
        label: 'Resume',
        icon: 'file-pdf',
        dockTooltip: 'Resume',
        gradient: 'linear-gradient(135deg, var(--red-2) 0%, var(--accent-red) 100%)',
        description: 'View and download resume PDF.',
        aliases: ['cv', 'pdf', 'curriculum'],
        desktopDock: true,
        mobileDock: true,
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: 'cog',
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
        icon: 'clock',
        dockTooltip: 'Focus Mode',
        gradient: 'linear-gradient(135deg, var(--orange-3) 0%, var(--orange-4) 100%)',
        description: 'Pomodoro presets, session stats, and optional focus dimming.',
        aliases: ['pomodoro', 'timer', 'deep work', 'productivity'],
        desktopDock: false,
        mobileDock: false,
    },
    {
        id: 'calendar',
        label: 'Calendar',
        icon: 'calendar',
        dockTooltip: 'Calendar',
        gradient: 'linear-gradient(135deg, var(--red-1) 0%, var(--accent-red) 100%)',
        description: 'View month layouts and program milestones.',
        aliases: ['calendar', 'events', 'schedule', 'today'],
        desktopDock: true,
        mobileDock: false,
    },
    {
        id: 'image-viewer',
        label: 'Image Viewer',
        icon: 'image',
        dockTooltip: 'Image Viewer',
        gradient: 'linear-gradient(135deg, var(--yellow-2) 0%, var(--accent-yellow) 100%)',
        description: 'View project screenshots, mockups, or wallpapers.',
        aliases: ['image-viewer', 'viewer', 'loupe', 'gallery', 'photos'],
        desktopDock: false,
        mobileDock: false,
    },
    {
        id: 'software',
        label: 'Software',
        icon: 'package',
        dockTooltip: 'Software',
        gradient: 'linear-gradient(135deg, var(--blue-3) 0%, var(--accent-blue) 100%)',
        description: 'Browse and install portfolio projects as software packages.',
        aliases: ['software', 'apps', 'store', 'gnome-software', 'discover', 'packages'],
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

export const EXPERIENCE: ExperienceItem[] = [
    {
        org: 'Centre of Excellence in Maritime Safety (CEMS)',
        role: 'Research Assistant & Software Developer',
        period: 'Apr 2025 – Feb 2026',
        location: 'Singapore',
        bullets: [
            'Profiled and resolved performance bottlenecks in a Unity VR application, reaching a stable 72 FPS through systematic frame analysis and targeted optimization.',
            'Gathered requirements from maritime subject-matter experts, translated operational procedures into technical specifications, and validated each feature through structured user testing.',
            'Owned end-to-end QA and documentation across multiple hardware configurations (Meta Quest 3, bHaptics gloves), logging reproduction steps and verifying consistent behavior for full coverage.',
        ],
        stack: ['Unity', 'C#', 'Profiling', 'QA', 'Technical Writing'],
    },
];

export const PROJECTS: Project[] = [
    {
        id: 'fedora-portfolio',
        title: 'GNOME-Inspired Portfolio Desktop',
        role: 'Developer & Designer',
        summary:
            'The site you are using right now - a React and TypeScript portfolio presented through a GNOME-inspired desktop shell with windows, app search, terminal commands, and mobile launcher cards.',
        problem:
            'A static portfolio can hide the strongest proof behind navigation and make recruiters work too hard for the basics.',
        solution:
            'Built a fast desktop-style shell where About, Projects, Resume, and Contact stay one click away from the dock, Activities search, and terminal.',
        impact: 'Demonstrates systematic problem-solving, attention to detail, and ability to build production-quality software with monitoring patterns (status indicators, notifications, structured logs).',
        techStack: ['React 19', 'TypeScript', 'Vite', 'CSS Layers'],
        platform: 'Responsive web app',
        proofPoints: [
            'Implemented draggable windows with snap zones, resize handles, minimise/maximise, and z-index stacking.',
            'Built a virtual filesystem terminal you can explore with cd, ls, cat, and open commands.',
            'Added Activities search, Quick Settings, notifications, welcome flow, and a mobile launcher experience.',
        ],
        links: [
            {
                label: 'Launch live',
                href: '/desktop',
                icon: 'globe',
                primary: true,
            },
            {
                label: 'View on GitHub',
                href: 'https://github.com/sawyairhtet/portfolio',
                icon: 'github',
            },
        ],
        featured: true,
        icon: 'desktop',
        media: {
            type: 'image',
            src: '/images/portfolio_project.webp',
            alt: 'Screenshot of the GNOME-inspired portfolio desktop showing the shell, dock, and wallpaper',
        },
    },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
    {
        title: 'Application & Production Support',
        icon: 'headset',
        skills: [
            {
                name: 'Incident Triage & Escalation',
                context:
                    'Methodical approach to classifying, prioritizing, and routing production issues to resolution.',
                usedIn: ['Coursework'],
                level: 'intermediate',
            },
            {
                name: 'Log Analysis & Troubleshooting',
                context:
                    'Reading application logs, stack traces, and system output to identify root causes and verify fixes.',
                usedIn: ['Fedora Portfolio', 'Java Debugging'],
                level: 'proficient',
            },
            {
                name: 'System Monitoring Awareness',
                context:
                    'Understanding of monitoring dashboards, alerts, health checks, and SLA-driven response workflows.',
                usedIn: ['Self-Study'],
                level: 'learning',
            },
        ],
    },
    {
        title: 'QA & Testing',
        icon: 'vial',
        skills: [
            {
                name: 'Manual Testing',
                context:
                    'Test case design, execution, defect reporting, and regression testing across web applications.',
                usedIn: ['Fedora Portfolio', 'Coursework'],
                level: 'proficient',
            },
            {
                name: 'API Testing',
                context:
                    'Endpoint validation with Postman, status codes, response schemas, and edge-case coverage.',
                usedIn: ['Self-Study'],
                level: 'intermediate',
            },
            {
                name: 'Unit Testing',
                context:
                    'JUnit for Java, Vitest + Testing Library for React — writing and maintaining automated test suites.',
                usedIn: ['Fedora Portfolio', 'Java Path'],
                level: 'intermediate',
            },
        ],
    },
    {
        title: 'Technical & Tooling',
        icon: 'wrench',
        skills: [
            {
                name: 'SQL & Database Querying',
                context:
                    'Writing queries to investigate data, verify fixes, and support production debugging across PostgreSQL and MySQL.',
                usedIn: ['Coursework'],
                level: 'proficient',
            },
            {
                name: 'Linux & Shell',
                context:
                    'Terminal navigation, log tailing, grep/awk, process management, and scripting on Fedora.',
                usedIn: ['Personal Workflow', 'Fedora Portfolio'],
                level: 'proficient',
            },
            {
                name: 'Git & Version Control',
                context:
                    'Branching, pull requests, commit discipline, and collaborative development workflows.',
                usedIn: ['Fedora Portfolio'],
                level: 'proficient',
            },
            {
                name: 'VS Code & Dev Tools',
                context:
                    'Primary IDE with debugging, extensions, integrated terminal, and browser DevTools.',
                usedIn: ['All Projects'],
                level: 'proficient',
            },
        ],
    },
    {
        title: 'Programming',
        icon: 'code',
        skills: [
            {
                name: 'Java + OOP',
                context:
                    'Object-oriented design, class hierarchies, control flow, and practical problem solving.',
                usedIn: ['Singapore Polytechnic'],
                level: 'proficient',
            },
            {
                name: 'React + TypeScript',
                context:
                    'Component architecture, typed state management, context providers — this portfolio is the proof.',
                usedIn: ['Fedora Portfolio'],
                level: 'proficient',
            },
            {
                name: 'JavaScript / Python',
                context:
                    'Scripting, data handling, utility development, and coursework automation.',
                usedIn: ['Coursework', 'Fedora Portfolio'],
                level: 'intermediate',
            },
        ],
    },
    {
        title: 'Concepts & Frameworks',
        icon: 'sitemap',
        skills: [
            {
                name: 'ITIL Fundamentals',
                context:
                    'Service management concepts — incident, problem, and change management workflows.',
                usedIn: ['Self-Study'],
                level: 'learning',
            },
            {
                name: 'REST API Design',
                context:
                    'Endpoint design, HTTP methods, status codes, and API documentation best practices.',
                usedIn: ['Fedora Portfolio'],
                level: 'proficient',
            },
            {
                name: 'OOP & Design Patterns',
                context:
                    'SOLID principles, inheritance, composition, and practical pattern application.',
                usedIn: ['Singapore Polytechnic', 'Java Path'],
                level: 'proficient',
            },
            {
                name: 'Agile / Scrum',
                context:
                    'Sprint planning, standups, retrospectives, and iterative delivery from coursework.',
                usedIn: ['Singapore Polytechnic'],
                level: 'intermediate',
            },
        ],
    },
];

// Editorial homepage only. The desktop SkillsApp still uses SKILL_CATEGORIES.
export const EDITORIAL_SKILLS = [
    {
        title: 'Support & QA',
        skills: [
            'Log analysis & troubleshooting',
            'Incident triage & escalation',
            'Manual & API testing (Postman)',
        ],
    },
    {
        title: 'Technical',
        skills: [
            'SQL querying & debugging',
            'Linux & shell',
            'Git & version control',
            'REST / HTTP debugging',
        ],
    },
    {
        title: 'Languages',
        skills: ['Python', 'JavaScript / TypeScript'],
    },
] as const;

export const LEARNING_NOW = ['ITIL 4 Foundation', 'System monitoring & alerting'];

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
    '  sawyehtet@fedora  IT Support & Operations Specialist. This portfolio runs in your browser.',
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
            '# Projects\n\nRecruiter scan:\n\n- **GNOME-Inspired Portfolio Desktop**: React 19, TypeScript, window management — shows systematic problem-solving and attention to detail.\n\nRun `projects`, `skills`, `resume`, or `contact` for the fastest path.',
    },
    '/home/sawyehtet/documents': { type: 'dir', children: ['notes.txt', 'ideas.md', 'about.md'] },
    '/home/sawyehtet/documents/about.md': {
        type: 'file',
        content: `# About Me\n\n${PROFILE.name}\n${PROFILE.role}\n\n## Summary\n\n${PROFILE.summary}\n\n## Education\n\n${PROFILE.education}\n\n## Focus Areas\n\n- Application Support & Production Support\n- SQL Debugging & Database Querying\n- Log Analysis & Incident Triage\n- API Testing & Quality Assurance\n- IT Service Management & ITIL\n\n## Contact\n\n${PROFILE.email}\n${PROFILE.location}\n${PROFILE.availability}\n\n## Links\n\n- [GitHub](https://github.com/sawyairhtet)\n- [LinkedIn](https://www.linkedin.com/in/saw-ye-htet-the-man-who-code/)\n- [Resume](${PROFILE.resumePath})`,
    },
    '/home/sawyehtet/documents/notes.txt': {
        type: 'file',
        content:
            'TODO:\n- Strengthen incident triage and log analysis skills\n- Study ITIL fundamentals for support role interviews\n- Keep recruiter paths obvious and up to date',
    },
    '/home/sawyehtet/documents/ideas.md': {
        type: 'file',
        content:
            '# Future Project Ideas\n\n1. Monitoring dashboard with health checks and alerts\n2. Log analysis shell scripts for production debugging',
    },
    '/home/sawyehtet/resume.txt': {
        type: 'file',
        content: `SAW YE HTET - RESUME\n\nRole: ${PROFILE.role}\nTarget: ${PROFILE.roleTarget}\nEducation: ${PROFILE.education}\nStack: ${PROFILE.primaryStack.join(', ')}\nFocus: Application support, production support, SQL debugging, API testing, and IT operations.\n\nContact: ${PROFILE.email}\nResume PDF: ${PROFILE.resumePath}`,
    },
    '/home/sawyehtet/resume.md': {
        type: 'file',
        content: `# Saw Ye Htet\n\n${PROFILE.role}\n\n## Positioning\n\nRecent Singapore Polytechnic IT graduate targeting application support and production support roles. Hands-on with SQL, Linux, Java, and API testing.\n\n## Focus\n\n- Application support and production support\n- Incident triage, log analysis, and SQL debugging\n- API testing and quality assurance\n- IT service management (carry-over)\n\n## Best Proof\n\n- GNOME-inspired desktop portfolio: React 19, TypeScript, Vite, window management, search, terminal, mobile launcher\n\n## Recruiter Path\n\n1. About - who I am\n2. Projects - what I build\n3. Skills - technologies and learning path\n4. Resume - PDF source of truth\n5. Contact - email and form\n\n## Contact\n\n${PROFILE.email}\n${PROFILE.location}\n${PROFILE.availability}`,
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
        body: 'IT support & operations specialist. Open the resume, projects, or contact app for the quick path.',
        icon: 'desktop',
        iconBg: 'linear-gradient(135deg, var(--accent-color), var(--accent-bg-color))',
        time: 'Just now',
        group: 'System',
        action: {
            label: 'View Resume',
            appId: 'resume',
        },
    },
];

// ============================================
// BOOT TIMING CONSTANTS
// ============================================

export const BOOT_LINE_INTERVAL_MS = 18;
export const PLYMOUTH_DURATION_MS = 450;

// ============================================
// GESTURE THRESHOLDS
// ============================================

export const SWIPE_CLOSE_THRESHOLD_Y = 80;
export const SWIPE_CLOSE_MAX_X = 50;

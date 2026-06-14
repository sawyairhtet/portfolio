import type { Project, ExperienceItem } from '../types';

// Editorial front-door content (the / portfolio, /writing, posts). Kept in its
// own module — separate from the desktop-only data in ./data.ts (virtual
// filesystem, boot logs, wallpapers, terminal easter eggs, app definitions) —
// so the eager front-door bundle doesn't drag that desktop data in. data.ts
// re-exports PROJECTS for the desktop apps that still consume it.

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
    {
        id: 'tokey',
        title: 'Tokey',
        role: 'Developer & Maintainer',
        summary:
            'Real-time per-prompt token cost panel for Claude Code. Live IN / OUT / CACHE figures in a Rich panel as you work.',
        problem:
            'Claude Code surfaces no per-prompt token cost while you work, so the real spend of a prompt is only visible after the fact, if you reconcile it at all.',
        solution:
            'Built a zero-config Rich panel that discovers session data directly and renders live IN / OUT / CACHE figures the moment a prompt lands.',
        impact: 'Demonstrates the discipline to ship a small tool to a real, tested release and the engineering judgment to simplify a design even when it means deleting working code.',
        techStack: ['Python', 'Rich', 'Standard library', 'MIT'],
        platform: 'Command-line tool',
        proofPoints: [
            'Cut a fragile transcript-tracking dependency mid-project in favour of direct discovery, deleting roughly half the original code while keeping the token-accounting core untouched.',
            'Renders live IN / OUT / CACHE figures in a Rich panel the moment a prompt lands, so cost is visible while you work rather than reconciled afterward.',
            'Zero-config install-and-run, cross-platform on Windows and Linux, covered by 89 passing tests.',
        ],
        links: [
            {
                label: 'View on GitHub',
                href: 'https://github.com/sawyairhtet/tokey',
                icon: 'github',
            },
        ],
        featured: false,
        icon: 'terminal',
        status: 'completed',
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

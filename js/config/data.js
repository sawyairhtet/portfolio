/**
 * Portfolio Data Configuration
 * Single source of truth for all content used across the site.
 */

// ============================================
// BOOT LOG MESSAGES
// ============================================

export const BOOT_LOG_MESSAGES = [
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

// ============================================
// STICKY NOTES DATA
// ============================================

export const stickyNotesData = [
    { text: "I like coke but \ncoke light is better 🥤", color: "yellow", rotation: -3, x: 75, y: 15 },
    { text: "Roses are red.\nViolets are blue.\nUnexpected error in line 52.", color: "pink", rotation: 2, x: 82, y: 35 },
    { text: 'System.out.println\n("Hi Mom! I love you.");', color: "blue", rotation: -1, x: 78, y: 55 }
];

// ============================================
// FILE SYSTEM DATA
// ============================================

export const DEFAULT_FILE_SYSTEM = {
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
        content: 'TODO:\n- Finish VR project\n- Update portfolio\n- Master Godot Engine\n- Call mom 💙'
    },
    '/home/visitor/documents/ideas.md': {
        type: 'file',
        content: '# Future Project Ideas\n\n1. Multiplayer VR escape room\n2. Indie game with procedural generation\n3. Open-source developer tools'
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
// TERMINAL EASTER EGG RESPONSES
// ============================================

export const terminalFortunes = [
    "A bug in the code is worth two in the documentation.",
    "Today is a good day to commit and push.",
    "You will solve that tricky bug before lunch.",
    "Someone will appreciate your clean code today.",
    "The semicolon you're missing is on line 42.",
    "Your next project will be your best yet.",
    "Coffee + Code = Success",
    "Remember: It works on my machine is not a valid excuse."
];

export const terminalJokes = [
    "Why do programmers prefer dark mode?\nBecause light attracts bugs.",
    "A SQL query walks into a bar, walks up to two tables and asks...\n'Can I join you?'",
    "Why do Java developers wear glasses?\nBecause they don't C#.",
    "!false - It's funny because it's true.",
    "A programmer's wife tells him: 'Go to the store and buy a loaf of bread. If they have eggs, buy a dozen.'\nHe comes home with 12 loaves of bread.",
    "There are only 10 types of people in the world:\nThose who understand binary and those who don't."
];

export const terminalGreetings = [
    "Hey there! 👋 Welcome to my corner of the internet.",
    "Hi! Thanks for exploring. Feel free to poke around!",
    "Hi Mom! 💙 (This one's for you)",
    "Greetings, traveler! You've found the secret hello."
];

import { useState, useRef, useCallback, useEffect } from 'react';
import {
    APP_DEFINITIONS,
    DEFAULT_FILE_SYSTEM,
    PROJECTS,
    SKILL_CATEGORIES,
    terminalFortunes,
    terminalJokes,
    terminalGreetings,
} from '../../config/data';
import { useWindowManager } from '../../context/WindowManagerContext';
import { PROFILE, SOCIAL_LINKS } from '../../config/profile';
import type { AppId, FileSystem } from '../../types';

function randomPick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

interface TerminalLine {
    id: number;
    content: string;
    className?: string;
}

export function TerminalApp() {
    const { openWindow } = useWindowManager();
    const [lines, setLines] = useState<TerminalLine[]>([
        {
            id: 0,
            content: "Welcome to Saw Ye Htet's Portfolio Terminal",
            className: 'terminal-welcome',
        },
        { id: 1, content: "Type 'help' to see available commands", className: 'terminal-info' },
        {
            id: 2,
            content: '─────────────────────────────────────────',
            className: 'terminal-divider',
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [cwd, setCwd] = useState('/home/sawyehtet');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const lineIdRef = useRef(3);
    const outputRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll & auto-focus
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [lines]);

    const addLine = useCallback((content: string, className?: string) => {
        setLines(prev => [...prev, { id: lineIdRef.current++, content, className }]);
    }, []);

    const addLines = useCallback((contents: (string | { text: string; className?: string })[]) => {
        setLines(prev => [
            ...prev,
            ...contents.map(c => {
                if (typeof c === 'string') {
                    return { id: lineIdRef.current++, content: c };
                }
                return { id: lineIdRef.current++, content: c.text, className: c.className };
            }),
        ]);
    }, []);

    const resolvePath = useCallback(
        (path: string): string => {
            if (path.startsWith('/')) return path;
            if (path.startsWith('~')) return '/home/sawyehtet' + path.slice(1);

            const parts = cwd.split('/').filter(Boolean);
            const segments = path.split('/');

            for (const seg of segments) {
                if (seg === '..') parts.pop();
                else if (seg !== '.') parts.push(seg);
            }

            return '/' + parts.join('/');
        },
        [cwd]
    );

    const executeCommand = useCallback(
        (cmd: string) => {
            const trimmed = cmd.trim();
            if (!trimmed) return;

            addLine(
                `[sawyehtet@fedora ${cwd === '/home/sawyehtet' ? '~' : cwd.split('/').pop()}]$ ${trimmed}`,
                'terminal-cmd-echo'
            );

            const [rawCommand, ...args] = trimmed.split(/\s+/);
            const command = rawCommand.toLowerCase();
            const fs: FileSystem = DEFAULT_FILE_SYSTEM;
            const findApp = (input: string): AppId | null => {
                const q = input.toLowerCase();
                const app = APP_DEFINITIONS.find(
                    item =>
                        item.id === q ||
                        item.label.toLowerCase() === q ||
                        item.aliases.some(alias => alias.toLowerCase() === q)
                );
                return app?.id ?? null;
            };

            switch (command) {
                case 'help':
                    addLines([
                        { text: 'Available commands:', className: 'terminal-heading' },
                        '  help          - Show this help message',
                        '  projects      - Open Projects and list featured work',
                        '  skills        - Open Skills and summarize tools',
                        '  contact       - Open Contact and show email',
                        '  hire          - Open Contact with recruiter details',
                        '  links         - Open Links',
                        '  resume/cv     - Open the resume PDF',
                        '  shortcuts     - Show desktop shortcuts',
                        '  open <app>    - Open an app by label or alias',
                        '  about         - Open About',
                        '  ls/cd/cat/pwd - Browse the portfolio filesystem',
                        '  clear         - Clear the terminal',
                        '  whoami/date/uptime/echo/neofetch/tree',
                        '  fortune/joke/hello',
                    ]);
                    break;

                case 'ls': {
                    const target = args[0] ? resolvePath(args[0]) : cwd;
                    const node = fs[target];
                    if (!node) {
                        addLine(
                            `ls: cannot access '${args[0] || target}': No such file or directory`,
                            'terminal-error'
                        );
                        break;
                    }
                    if (node.type !== 'dir') {
                        addLine(target.split('/').pop() || '');
                        break;
                    }
                    addLine(node.children.join('  '));
                    break;
                }

                case 'cd': {
                    if (!args[0] || args[0] === '~') {
                        setCwd('/home/sawyehtet');
                        break;
                    }
                    const target = resolvePath(args[0]);
                    const node = fs[target];
                    if (!node) {
                        addLine(`cd: no such file or directory: ${args[0]}`, 'terminal-error');
                        break;
                    }
                    if (node.type !== 'dir') {
                        addLine(`cd: not a directory: ${args[0]}`, 'terminal-error');
                        break;
                    }
                    setCwd(target);
                    break;
                }

                case 'cat': {
                    if (!args[0]) {
                        addLine('cat: missing operand', 'terminal-error');
                        break;
                    }
                    const target = resolvePath(args[0]);
                    const node = fs[target];
                    if (!node) {
                        addLine(`cat: ${args[0]}: No such file or directory`, 'terminal-error');
                        break;
                    }
                    if (node.type !== 'file') {
                        addLine(`cat: ${args[0]}: Is a directory`, 'terminal-error');
                        break;
                    }
                    addLines(node.content.split('\n'));
                    break;
                }

                case 'pwd':
                    addLine(cwd, 'terminal-path');
                    break;

                case 'clear':
                    setLines([]);
                    lineIdRef.current = 0;
                    break;

                case 'whoami':
                    addLine('sawyehtet');
                    break;

                case 'date':
                    addLine(new Date().toString());
                    break;

                case 'uptime': {
                    const loadTime = (window as unknown as Record<string, unknown>)
                        .__portfolioLoadTime;
                    if (typeof loadTime === 'number') {
                        const seconds = Math.floor((Date.now() - loadTime) / 1000);
                        const mins = Math.floor(seconds / 60);
                        const secs = seconds % 60;
                        addLine(`up ${mins}m ${secs}s`);
                    } else {
                        addLine('up 0m 0s');
                    }
                    break;
                }

                case 'echo':
                    addLine(args.join(' '));
                    break;

                case 'fortune':
                    addLine(randomPick(terminalFortunes));
                    break;
                case 'joke':
                    addLines(randomPick(terminalJokes).split('\n'));
                    break;
                case 'hello':
                    addLine(randomPick(terminalGreetings));
                    break;
                case 'about':
                    openWindow('about');
                    addLine('Opened About.', 'terminal-ok');
                    break;

                case 'projects':
                    openWindow('projects');
                    addLines([
                        { text: 'Projects:', className: 'terminal-heading' },
                        ...PROJECTS.map(
                            project => `  ${project.title} - ${project.role}; ${project.platform}`
                        ),
                        { text: 'Opened Projects.', className: 'terminal-ok' },
                    ]);
                    break;

                case 'skills':
                    openWindow('skills');
                    addLines([
                        { text: 'Skills:', className: 'terminal-heading' },
                        ...SKILL_CATEGORIES.map(
                            category =>
                                `  ${category.title}: ${category.skills.map(skill => skill.name).join(', ')}`
                        ),
                        { text: 'Opened Skills.', className: 'terminal-ok' },
                    ]);
                    break;

                case 'contact':
                    openWindow('contact');
                    addLines([
                        { text: 'Contact:', className: 'terminal-heading' },
                        `  Email: ${PROFILE.email}`,
                        `  Availability: ${PROFILE.availability}`,
                        { text: 'Opened Contact.', className: 'terminal-ok' },
                    ]);
                    break;

                case 'hire':
                    openWindow('contact');
                    addLines([
                        { text: 'Recruiter shortcut:', className: 'terminal-heading' },
                        `  Role target: Java Software Engineer`,
                        `  Availability: ${PROFILE.availability}`,
                        `  Location: ${PROFILE.location}`,
                        `  Email: ${PROFILE.email}`,
                        { text: 'Opened Contact.', className: 'terminal-ok' },
                    ]);
                    break;

                case 'links':
                    openWindow('links');
                    addLines([
                        { text: 'Links:', className: 'terminal-heading' },
                        ...SOCIAL_LINKS.map(link => `  ${link.label}: ${link.terminal}`),
                        { text: 'Opened Links.', className: 'terminal-ok' },
                    ]);
                    break;

                case 'resume':
                case 'cv':
                    window.open(PROFILE.resumePath, '_blank', 'noopener,noreferrer');
                    addLine('Opened resume PDF.', 'terminal-ok');
                    break;

                case 'shortcuts':
                    addLines([
                        { text: 'Desktop shortcuts:', className: 'terminal-heading' },
                        '  Super / Meta  - Activities overview',
                        '  Escape        - Close overlays or focused window',
                        '  Alt+1         - Projects',
                        '  Alt+2         - Contact',
                        '  Alt+3         - Resume',
                        '  Ctrl+L        - Clear terminal',
                    ]);
                    break;

                case 'open': {
                    if (!args[0]) {
                        addLine('Usage: open <app>');
                        break;
                    }
                    const appId = findApp(args.join(' '));
                    if (!appId) {
                        addLine(`open: unknown app '${args.join(' ')}'`, 'terminal-error');
                        break;
                    }
                    openWindow(appId);
                    addLine(
                        `Opened ${APP_DEFINITIONS.find(app => app.id === appId)?.label ?? appId}.`,
                        'terminal-ok'
                    );
                    break;
                }

                case 'neofetch':
                    addLines([
                        '         ⣀⣤⣤⣤⣤⣤⣤⣤⣄⡀        sawyehtet@fedora',
                        '       ⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⡀    ─────────────────',
                        '      ⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷    OS: Fedora Linux 43',
                        '     ⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇   DE: GNOME 49',
                        '     ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇   WM: Wayland',
                        '     ⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇   Shell: bash 5.2',
                        '      ⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃    Terminal: portfolio-term',
                        "        ⠈⠛⠿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠁       CPU: Visitor's Device",
                        '                                          Made with React + TS',
                    ]);
                    break;

                case 'tree': {
                    const target = args[0] ? resolvePath(args[0]) : cwd;
                    const treeLines: string[] = [];
                    const renderTree = (path: string, prefix: string) => {
                        const node = fs[path];
                        if (!node || node.type !== 'dir') return;
                        const children = node.children;
                        children.forEach((child, i) => {
                            const isLast = i === children.length - 1;
                            const connector = isLast ? '└── ' : '├── ';
                            const childPath = path === '/' ? `/${child}` : `${path}/${child}`;
                            const childNode = fs[childPath];
                            treeLines.push(
                                `${prefix}${connector}${child}${childNode?.type === 'dir' ? '/' : ''}`
                            );
                            if (childNode?.type === 'dir') {
                                renderTree(childPath, prefix + (isLast ? '    ' : '│   '));
                            }
                        });
                    };
                    treeLines.push(target);
                    renderTree(target, '');
                    addLines(treeLines);
                    break;
                }

                default:
                    addLine(`bash: ${rawCommand}: command not found`, 'terminal-error');
                    break;
            }

            setHistory(prev => [...prev, trimmed]);
            setHistoryIndex(-1);
        },
        [cwd, addLine, addLines, resolvePath, openWindow]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                executeCommand(inputValue);
                setInputValue('');
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (history.length > 0) {
                    const newIdx =
                        historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
                    setHistoryIndex(newIdx);
                    setInputValue(history[newIdx]);
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex >= 0) {
                    const newIdx = historyIndex + 1;
                    if (newIdx >= history.length) {
                        setHistoryIndex(-1);
                        setInputValue('');
                    } else {
                        setHistoryIndex(newIdx);
                        setInputValue(history[newIdx]);
                    }
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                // Simple tab-completion for filenames
                const partial = inputValue.split(/\s+/).pop() || '';
                if (partial) {
                    const target = resolvePath(cwd);
                    const node = DEFAULT_FILE_SYSTEM[target];
                    if (node?.type === 'dir') {
                        const match = node.children.find(c => c.startsWith(partial));
                        if (match) {
                            const parts = inputValue.split(/\s+/);
                            parts[parts.length - 1] = match;
                            setInputValue(parts.join(' '));
                        }
                    }
                }
            } else if (e.key === 'l' && e.ctrlKey) {
                e.preventDefault();
                setLines([]);
                lineIdRef.current = 0;
            }
        },
        [inputValue, executeCommand, history, historyIndex, cwd, resolvePath]
    );

    // Focus input when terminal body clicked
    const handleBodyClick = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    const prompt = `[sawyehtet@fedora ${cwd === '/home/sawyehtet' ? '~' : cwd.split('/').pop()}]$`;

    return (
        <div onClick={handleBodyClick} className="terminal-shell">
            <div
                ref={outputRef}
                className="terminal-output terminal-output-scroll"
                aria-live="polite"
                aria-label="Terminal output"
            >
                {lines.map(line => (
                    <div
                        key={line.id}
                        className={`terminal-line${line.className ? ` ${line.className}` : ''}`}
                    >
                        {line.content}
                    </div>
                ))}
            </div>
            <div className="terminal-input-line">
                <span className="terminal-prompt">{prompt}</span>
                <input
                    ref={inputRef}
                    type="text"
                    className="terminal-input"
                    autoComplete="off"
                    spellCheck="false"
                    inputMode="text"
                    enterKeyHint="send"
                    aria-label="Terminal command input"
                    title="Terminal command input"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="terminal-submit-btn"
                    aria-label="Run command"
                    onClick={() => {
                        executeCommand(inputValue);
                        setInputValue('');
                    }}
                >
                    <i className="fas fa-arrow-right" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

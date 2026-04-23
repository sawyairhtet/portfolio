import { useState, useRef, useCallback, useEffect } from 'react';
import { DEFAULT_FILE_SYSTEM, terminalFortunes, terminalJokes, terminalGreetings } from '../../config/data';
import type { FileSystem } from '../../types';

function randomPick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

interface TerminalLine {
    id: number;
    content: string;
}

export function TerminalApp() {
    const [lines, setLines] = useState<TerminalLine[]>([
        { id: 0, content: "Welcome to Saw Ye Htet's Portfolio Terminal" },
        { id: 1, content: "Type 'help' to see available commands" },
        { id: 2, content: '─────────────────────────────────────────' },
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

    const addLine = useCallback((content: string) => {
        setLines((prev) => [...prev, { id: lineIdRef.current++, content }]);
    }, []);

    const addLines = useCallback((contents: string[]) => {
        setLines((prev) => [
            ...prev,
            ...contents.map((c) => ({ id: lineIdRef.current++, content: c })),
        ]);
    }, []);

    const resolvePath = useCallback((path: string): string => {
        if (path.startsWith('/')) return path;
        if (path.startsWith('~')) return '/home/sawyehtet' + path.slice(1);

        const parts = cwd.split('/').filter(Boolean);
        const segments = path.split('/');

        for (const seg of segments) {
            if (seg === '..') parts.pop();
            else if (seg !== '.') parts.push(seg);
        }

        return '/' + parts.join('/');
    }, [cwd]);

    const executeCommand = useCallback((cmd: string) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        addLine(`[sawyehtet@fedora ${cwd === '/home/sawyehtet' ? '~' : cwd.split('/').pop()}]$ ${trimmed}`);

        const [command, ...args] = trimmed.split(/\s+/);
        const fs: FileSystem = DEFAULT_FILE_SYSTEM;

        switch (command) {
            case 'help':
                addLines([
                    'Available commands:',
                    '  help     — Show this help message',
                    '  ls       — List directory contents',
                    '  cd       — Change directory',
                    '  cat      — Display file contents',
                    '  pwd      — Print working directory',
                    '  clear    — Clear the terminal',
                    '  whoami   — Show current user',
                    '  date     — Show current date/time',
                    '  uptime   — Show session uptime',
                    '  echo     — Print text',
                    '  fortune  — Get a fortune cookie',
                    '  joke     — Hear a dev joke',
                    '  hello    — Say hello',
                    '  neofetch — System info',
                    '  tree     — Show directory tree',
                    '  about    — Open About app',
                ]);
                break;

            case 'ls': {
                const target = args[0] ? resolvePath(args[0]) : cwd;
                const node = fs[target];
                if (!node) { addLine(`ls: cannot access '${args[0] || target}': No such file or directory`); break; }
                if (node.type !== 'dir') { addLine(target.split('/').pop() || ''); break; }
                addLine(node.children.join('  '));
                break;
            }

            case 'cd': {
                if (!args[0] || args[0] === '~') { setCwd('/home/sawyehtet'); break; }
                const target = resolvePath(args[0]);
                const node = fs[target];
                if (!node) { addLine(`cd: no such file or directory: ${args[0]}`); break; }
                if (node.type !== 'dir') { addLine(`cd: not a directory: ${args[0]}`); break; }
                setCwd(target);
                break;
            }

            case 'cat': {
                if (!args[0]) { addLine('cat: missing operand'); break; }
                const target = resolvePath(args[0]);
                const node = fs[target];
                if (!node) { addLine(`cat: ${args[0]}: No such file or directory`); break; }
                if (node.type !== 'file') { addLine(`cat: ${args[0]}: Is a directory`); break; }
                addLines(node.content.split('\n'));
                break;
            }

            case 'pwd': addLine(cwd); break;

            case 'clear':
                setLines([]);
                lineIdRef.current = 0;
                break;

            case 'whoami': addLine('sawyehtet'); break;

            case 'date': addLine(new Date().toString()); break;

            case 'uptime': {
                const loadTime = (window as unknown as Record<string, unknown>).__portfolioLoadTime;
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

            case 'echo': addLine(args.join(' ')); break;

            case 'fortune': addLine(randomPick(terminalFortunes)); break;
            case 'joke': addLines(randomPick(terminalJokes).split('\n')); break;
            case 'hello': addLine(randomPick(terminalGreetings)); break;

            case 'neofetch':
                addLines([
                    '         ⣀⣤⣤⣤⣤⣤⣤⣤⣄⡀        sawyehtet@fedora',
                    '       ⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⡀    ─────────────────',
                    '      ⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷    OS: Fedora Linux 43',
                    '     ⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇   DE: GNOME 49',
                    '     ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇   WM: Wayland',
                    '     ⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇   Shell: bash 5.2',
                    '      ⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃    Terminal: portfolio-term',
                    '        ⠈⠛⠿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠁       CPU: Visitor\'s Device',
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
                        treeLines.push(`${prefix}${connector}${child}${childNode?.type === 'dir' ? '/' : ''}`);
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
                addLine(`bash: ${command}: command not found`);
                break;
        }

        setHistory((prev) => [...prev, trimmed]);
        setHistoryIndex(-1);
    }, [cwd, addLine, addLines, resolvePath]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            executeCommand(inputValue);
            setInputValue('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length > 0) {
                const newIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
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
                    const match = node.children.find((c) => c.startsWith(partial));
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
    }, [inputValue, executeCommand, history, historyIndex, cwd, resolvePath]);

    // Focus input when terminal body clicked
    const handleBodyClick = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    const prompt = `[sawyehtet@fedora ${cwd === '/home/sawyehtet' ? '~' : cwd.split('/').pop()}]$`;

    return (
        <div onClick={handleBodyClick} className="terminal-shell">
            <div ref={outputRef} className="terminal-output terminal-output-scroll" aria-live="polite" aria-label="Terminal output">
                {lines.map((line) => (
                    <div key={line.id} className="terminal-line">{line.content}</div>
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
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="terminal-submit-btn"
                    aria-label="Run command"
                    onClick={() => { executeCommand(inputValue); setInputValue(''); }}
                >
                    <i className="fas fa-arrow-right" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

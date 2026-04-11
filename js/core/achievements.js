/**
 * Achievement System
 * Gamification layer that tracks user actions and unlocks achievements
 */

import { showToast } from '../ui/notifications.js';

const STORAGE_KEY = 'portfolioAchievements';

const ACHIEVEMENTS = [
    { id: 'first_app', icon: '🖱️', title: 'Getting Started', desc: 'Open your first app', condition: s => s.appsOpened >= 1 },
    { id: 'explorer', icon: '🗺️', title: 'Explorer', desc: 'Open all 7 apps', condition: s => s.uniqueApps.size >= 7 },
    { id: 'terminal_master', icon: '💻', title: 'Terminal Master', desc: 'Run 10 terminal commands', condition: s => s.terminalCommands >= 10 },
    { id: 'curious_mind', icon: '🥚', title: 'Curious Mind', desc: 'Find an easter egg', condition: s => s.easterEggsFound >= 1 },
    { id: 'night_owl', icon: '🦉', title: 'Night Owl', desc: 'Visit between 12am and 5am', condition: () => { const h = new Date().getHours(); return h >= 0 && h < 5; } },
    { id: 'multitasker', icon: '🪟', title: 'Multitasker', desc: 'Have 3 windows open at once', condition: s => s.maxConcurrentWindows >= 3 },
    { id: 'theme_switcher', icon: '🌓', title: 'Day & Night', desc: 'Switch themes 3 times', condition: s => s.themeSwitches >= 3 },
    { id: 'speed_runner', icon: '⚡', title: 'Speed Runner', desc: 'Open 3 apps in 10 seconds', condition: s => s.speedRun },
    { id: 'resume_dl', icon: '📄', title: 'Interested', desc: 'Download the resume', condition: s => s.resumeDownloaded },
    { id: 'hire_me', icon: '🎉', title: 'sudo hire me', desc: 'Run the secret command', condition: s => s.sudoHireMe },
];

/** @type {{ appsOpened: number, uniqueApps: Set<string>, terminalCommands: number, easterEggsFound: number, maxConcurrentWindows: number, themeSwitches: number, speedRun: boolean, resumeDownloaded: boolean, sudoHireMe: boolean, recentAppTimes: number[], unlocked: Set<string> }} */
let state;

function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        state = {
            appsOpened: saved.appsOpened || 0,
            uniqueApps: new Set(saved.uniqueApps || []),
            terminalCommands: saved.terminalCommands || 0,
            easterEggsFound: saved.easterEggsFound || 0,
            maxConcurrentWindows: saved.maxConcurrentWindows || 0,
            themeSwitches: saved.themeSwitches || 0,
            speedRun: saved.speedRun || false,
            resumeDownloaded: saved.resumeDownloaded || false,
            sudoHireMe: saved.sudoHireMe || false,
            recentAppTimes: [],
            unlocked: new Set(saved.unlocked || []),
        };
    } catch (e) {
        console.error('Failed to load achievements:', e);
        state = {
            appsOpened: 0, uniqueApps: new Set(), terminalCommands: 0,
            easterEggsFound: 0, maxConcurrentWindows: 0, themeSwitches: 0,
            speedRun: false, resumeDownloaded: false, sudoHireMe: false,
            recentAppTimes: [], unlocked: new Set(),
        };
    }
}

function saveState() {
    try {
        const serializable = {
            appsOpened: state.appsOpened,
            uniqueApps: Array.from(state.uniqueApps),
            terminalCommands: state.terminalCommands,
            easterEggsFound: state.easterEggsFound,
            maxConcurrentWindows: state.maxConcurrentWindows,
            themeSwitches: state.themeSwitches,
            speedRun: state.speedRun,
            resumeDownloaded: state.resumeDownloaded,
            sudoHireMe: state.sudoHireMe,
            unlocked: Array.from(state.unlocked),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
        console.error('Failed to save achievements:', e);
    }
}

function checkAchievements() {
    for (const a of ACHIEVEMENTS) {
        if (!state.unlocked.has(a.id) && a.condition(state)) {
            state.unlocked.add(a.id);
            showToast(`${a.icon} Achievement Unlocked: ${a.title}`, 'fa-trophy');
            triggerConfetti();
            saveState();
        }
    }
}

function triggerConfetti() {
    const colors = ['#e95420', '#ff7a45', '#77216f', '#5e2750', '#4caf50', '#2196f3'];
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:99999;overflow:hidden;';
    document.body.appendChild(container);

    for (let i = 0; i < 60; i++) {
        const piece = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const size = Math.random() * 8 + 4;
        piece.style.cssText = `position:absolute;top:-10px;left:${left}%;width:${size}px;height:${size}px;background:${color};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};animation:confettiFall ${1.5 + Math.random()}s ease-in ${delay}s forwards;`;
        container.appendChild(piece);
    }

    setTimeout(() => container.remove(), 3000);
}

// Expose confetti globally for terminal
/** @type {any} */ (window).__triggerConfetti = triggerConfetti;

export const Achievements = {
    init() {
        loadState();

        // Night owl check on init
        checkAchievements();

        // Resume download tracking
        document.querySelectorAll('a[download]').forEach(link => {
            link.addEventListener('click', () => {
                state.resumeDownloaded = true;
                saveState();
                checkAchievements();
            });
        });
    },

    onAppOpen(appName, activeWindowCount = 0) {
        state.appsOpened++;
        state.uniqueApps.add(appName);

        if (activeWindowCount > state.maxConcurrentWindows) {
            state.maxConcurrentWindows = activeWindowCount;
        }

        // Speed run tracking
        const now = Date.now();
        state.recentAppTimes.push(now);
        state.recentAppTimes = state.recentAppTimes.filter(t => now - t < 10000);
        if (state.recentAppTimes.length >= 3) {
            state.speedRun = true;
        }

        saveState();
        checkAchievements();
    },

    onTerminalCommand(command = '') {
        state.terminalCommands++;

        // Easter egg detection
        const easterEggs = ['cowsay', 'fortune', 'matrix', 'flip', 'unflip', 'joke'];
        if (easterEggs.includes(command.split(' ')[0].toLowerCase())) {
            state.easterEggsFound++;
        }

        // sudo hire me detection
        if (command.toLowerCase().startsWith('sudo hire me')) {
            state.sudoHireMe = true;
        }

        saveState();
        checkAchievements();
    },

    onThemeSwitch() {
        state.themeSwitches++;
        saveState();
        checkAchievements();
    },

    getUnlocked() {
        return ACHIEVEMENTS.filter(a => state.unlocked.has(a.id));
    },

    getAll() {
        return ACHIEVEMENTS.map(a => ({
            ...a,
            unlocked: state.unlocked.has(a.id),
        }));
    },

    getProgress() {
        return `${state.unlocked.size}/${ACHIEVEMENTS.length}`;
    },
};

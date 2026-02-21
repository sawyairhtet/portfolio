/**
 * Achievement System
 * Gamifies portfolio exploration
 */

import { celebrate } from '../ui/micro-interactions.js';

const ACHIEVEMENTS = {
    FIRST_CLICK: {
        id: 'first_click',
        title: 'Getting Started',
        description: 'Open your first app',
        icon: '🖱️',
        unlocked: false,
    },
    EXPLORER: {
        id: 'explorer',
        title: 'Explorer',
        description: 'Open all 7 apps',
        icon: '🗺️',
        unlocked: false,
        progress: 0,
        max: 7,
    },
    TERMINAL_MASTER: {
        id: 'terminal_master',
        title: 'Terminal Master',
        description: 'Execute 10 terminal commands',
        icon: '💻',
        unlocked: false,
        progress: 0,
        max: 10,
    },
    EASTER_EGG: {
        id: 'easter_egg',
        title: 'Curious Mind',
        description: 'Find an easter egg',
        icon: '🥚',
        unlocked: false,
    },
    NIGHT_OWL: {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Visit between 12am and 5am',
        icon: '🦉',
        unlocked: false,
    },
    STICKY_COLLECTOR: {
        id: 'sticky_collector',
        title: 'Sticky Note Mover',
        description: 'Move all sticky notes',
        icon: '📝',
        unlocked: false,
        progress: 0,
        max: 4,
    },
    WINDOW_MANAGER: {
        id: 'window_manager',
        title: 'Multitasker',
        description: 'Have 3 windows open at once',
        icon: '🪟',
        unlocked: false,
    },
    THEME_SWITCHER: {
        id: 'theme_switcher',
        title: 'Day & Night',
        description: 'Switch themes 3 times',
        icon: '🌓',
        unlocked: false,
        progress: 0,
        max: 3,
    },
    SPEED_RUNNER: {
        id: 'speed_runner',
        title: 'Speed Runner',
        description: 'Open 3 apps within 10 seconds',
        icon: '⚡',
        unlocked: false,
    },
    RESUME_DOWNLOADER: {
        id: 'resume_downloader',
        title: 'Interested',
        description: 'Download the resume',
        icon: '📄',
        unlocked: false,
    },
};

class AchievementSystem {
    constructor() {
        this.achievements = this.load();
        this.appOpens = new Set();
        this.appOpenTimes = [];
        this.movedStickies = new Set();
    }

    load() {
        try {
            const saved = localStorage.getItem('portfolio_achievements');
            return saved ? JSON.parse(saved) : { ...ACHIEVEMENTS };
        } catch {
            return { ...ACHIEVEMENTS };
        }
    }

    save() {
        try {
            localStorage.setItem('portfolio_achievements', JSON.stringify(this.achievements));
        } catch (e) {
            console.warn('Could not save achievements:', e);
        }
    }

    unlock(id, element = null) {
        const achievement = this.achievements[id];
        if (!achievement || achievement.unlocked) {
            return;
        }

        achievement.unlocked = true;
        this.save();
        this.showNotification(achievement);

        if (element) {
            celebrate(element);
        }

        // Dispatch custom event
        window.dispatchEvent(
            new CustomEvent('achievement-unlocked', {
                detail: achievement,
            })
        );
    }

    progress(id, amount = 1, element = null) {
        const achievement = this.achievements[id];
        if (!achievement || achievement.unlocked) {
            return;
        }

        achievement.progress = Math.min((achievement.progress || 0) + amount, achievement.max);

        if (achievement.progress >= achievement.max) {
            this.unlock(id, element);
        } else {
            this.save();
        }
    }

    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.title}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 40px;
            right: 20px;
            background: linear-gradient(135deg, #E95420 0%, #77216F 100%);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 100000;
            animation: achievement-slide-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-width: 350px;
        `;

        document.body.appendChild(notification);

        // Play sound
        import('./sound-manager.js').then(module => {
            module.default.playClick();
        });

        setTimeout(() => {
            notification.style.animation = 'achievement-slide-out 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Event handlers
    onAppOpen(appName, element) {
        this.appOpens.add(appName);
        this.progress('EXPLORER', 1, element);

        if (this.appOpens.size === 1) {
            this.unlock('FIRST_CLICK', element);
        }

        // Speed runner check
        this.appOpenTimes.push(Date.now());
        this.appOpenTimes = this.appOpenTimes.filter(t => Date.now() - t < 10000);
        if (this.appOpenTimes.length >= 3) {
            this.unlock('SPEED_RUNNER', element);
        }
    }

    onTerminalCommand(element) {
        this.progress('TERMINAL_MASTER', 1, element);
    }

    onEasterEgg(element) {
        this.unlock('EASTER_EGG', element);
    }

    onStickyMove(noteId, element) {
        this.movedStickies.add(noteId);
        this.progress('STICKY_COLLECTOR', 1, element);
    }

    onThemeSwitch(element) {
        this.progress('THEME_SWITCHER', 1, element);
    }

    onWindowCount(count, element) {
        if (count >= 3) {
            this.unlock('WINDOW_MANAGER', element);
        }
    }

    onResumeDownload(element) {
        this.unlock('RESUME_DOWNLOADER', element);
    }

    checkNightOwl(element) {
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5) {
            this.unlock('NIGHT_OWL', element);
        }
    }

    getAll() {
        return Object.values(this.achievements);
    }

    getUnlocked() {
        return this.getAll().filter(a => a.unlocked);
    }

    getProgress() {
        const all = this.getAll();
        const unlocked = all.filter(a => a.unlocked).length;
        return {
            unlocked,
            total: all.length,
            percentage: Math.round((unlocked / all.length) * 100),
        };
    }
}

export const Achievements = new AchievementSystem();

// Add styles
const style = document.createElement('style');
style.textContent = `
    @keyframes achievement-slide-in {
        from {
            transform: translateX(120%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes achievement-slide-out {
        to {
            transform: translateX(120%);
            opacity: 0;
        }
    }
    
    .achievement-icon {
        font-size: 32px;
        animation: achievement-bounce 0.5s ease-out;
    }
    
    @keyframes achievement-bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
    }
    
    .achievement-title {
        font-size: 12px;
        opacity: 0.9;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .achievement-name {
        font-size: 16px;
        font-weight: 600;
        margin: 2px 0;
    }
    
    .achievement-desc {
        font-size: 13px;
        opacity: 0.85;
    }
`;
document.head.appendChild(style);

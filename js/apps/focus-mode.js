/**
 * Focus Mode - GNOME 49 Focus Mode with Pomodoro Timer
 * Provides a distraction-free work timer with dim-other-windows effect
 */

import SoundManager from '../core/sound-manager.js';
import { showToast } from '../ui/notifications.js';

/** @type {{ minutes: number, seconds: number, isRunning: boolean, isPaused: boolean, interval: number | null, totalSeconds: number, mode: 'focus' | 'break' }} */
const state = {
    minutes: 25,
    seconds: 0,
    isRunning: false,
    isPaused: false,
    interval: null,
    totalSeconds: 25 * 60,
    mode: 'focus',
};

const FOCUS_DURATION = 25;
const SHORT_BREAK = 5;
const LONG_BREAK = 15;

/**
 * Initialize Focus Mode UI inside the focus-mode window
 */
export function setupFocusMode() {
    const windowBody = document.querySelector('#focus-mode-window .window-body');
    if (!windowBody) {
        return;
    }

    windowBody.innerHTML = '';

    // Build the Pomodoro UI
    const container = document.createElement('div');
    container.className = 'focus-mode-container';

    // Timer display
    const timerSection = document.createElement('div');
    timerSection.className = 'focus-timer-section';

    const modeLabel = document.createElement('div');
    modeLabel.className = 'focus-mode-label';
    modeLabel.textContent = 'Focus';
    modeLabel.id = 'focus-mode-current';

    const timerRing = document.createElement('div');
    timerRing.className = 'focus-timer-ring';

    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'focus-timer-display';
    timerDisplay.id = 'focus-timer-display';
    timerDisplay.textContent = '25:00';

    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    progressCircle.setAttribute('class', 'focus-progress-svg');
    progressCircle.setAttribute('viewBox', '0 0 200 200');
    progressCircle.innerHTML =
        '<circle class="focus-progress-bg" cx="100" cy="100" r="90" />' +
        '<circle class="focus-progress-fill" id="focus-progress-fill" cx="100" cy="100" r="90" />';

    timerRing.appendChild(progressCircle);
    timerRing.appendChild(timerDisplay);
    timerSection.appendChild(modeLabel);
    timerSection.appendChild(timerRing);

    // Controls
    const controls = document.createElement('div');
    controls.className = 'focus-controls';

    const startBtn = document.createElement('button');
    startBtn.className = 'focus-btn focus-btn-primary';
    startBtn.id = 'focus-start-btn';
    startBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i> Start';

    const pauseBtn = document.createElement('button');
    pauseBtn.className = 'focus-btn focus-btn-secondary';
    pauseBtn.id = 'focus-pause-btn';
    pauseBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i> Pause';
    pauseBtn.style.display = 'none';

    const resetBtn = document.createElement('button');
    resetBtn.className = 'focus-btn focus-btn-ghost';
    resetBtn.id = 'focus-reset-btn';
    resetBtn.innerHTML = '<i class="fas fa-redo" aria-hidden="true"></i> Reset';

    controls.appendChild(startBtn);
    controls.appendChild(pauseBtn);
    controls.appendChild(resetBtn);

    // Preset buttons
    const presets = document.createElement('div');
    presets.className = 'focus-presets';

    /** @type {Array<{label: string, minutes: number, mode: 'focus' | 'break'}>} */
    const presetData = [
        { label: 'Focus', minutes: FOCUS_DURATION, mode: 'focus' },
        { label: 'Short Break', minutes: SHORT_BREAK, mode: 'break' },
        { label: 'Long Break', minutes: LONG_BREAK, mode: 'break' },
    ];

    presetData.forEach((p, i) => {
        const btn = document.createElement('button');
        btn.className = 'focus-preset-btn' + (i === 0 ? ' active' : '');
        btn.textContent = p.label;
        btn.dataset.minutes = String(p.minutes);
        btn.dataset.mode = p.mode;
        btn.addEventListener('click', () => {
            if (state.isRunning) {
                return;
            }
            presets.querySelectorAll('.focus-preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setTimer(p.minutes, p.mode);
        });
        presets.appendChild(btn);
    });

    // Stats
    const stats = document.createElement('div');
    stats.className = 'focus-stats';
    stats.innerHTML =
        '<div class="focus-stat">' +
        '<span class="focus-stat-value" id="focus-sessions-count">0</span>' +
        '<span class="focus-stat-label">Sessions</span>' +
        '</div>' +
        '<div class="focus-stat">' +
        '<span class="focus-stat-value" id="focus-total-time">0m</span>' +
        '<span class="focus-stat-label">Total Focus</span>' +
        '</div>';

    container.appendChild(timerSection);
    container.appendChild(presets);
    container.appendChild(controls);
    container.appendChild(stats);
    windowBody.appendChild(container);

    // Load saved stats
    loadStats();

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
}

/**
 * @param {number} minutes
 * @param {'focus' | 'break'} mode
 */
function setTimer(minutes, mode) {
    state.minutes = minutes;
    state.seconds = 0;
    state.totalSeconds = minutes * 60;
    state.mode = mode;
    state.isRunning = false;
    state.isPaused = false;

    if (state.interval) {
        clearInterval(state.interval);
        state.interval = null;
    }

    updateDisplay();
    updateProgress(1);
    updateTopBarLabel(false);
    removeDimEffect();

    const modeLabel = document.getElementById('focus-mode-current');
    if (modeLabel) {
        modeLabel.textContent = mode === 'focus' ? 'Focus' : 'Break';
    }

    const startBtn = document.getElementById('focus-start-btn');
    const pauseBtn = document.getElementById('focus-pause-btn');
    if (startBtn) {
        startBtn.style.display = '';
        startBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i> Start';
    }
    if (pauseBtn) {
        pauseBtn.style.display = 'none';
    }
}

function startTimer() {
    if (state.isRunning && !state.isPaused) {
        return;
    }

    state.isRunning = true;
    state.isPaused = false;

    const startBtn = document.getElementById('focus-start-btn');
    const pauseBtn = document.getElementById('focus-pause-btn');
    if (startBtn) {
        startBtn.style.display = 'none';
    }
    if (pauseBtn) {
        pauseBtn.style.display = '';
    }

    if (state.mode === 'focus') {
        applyDimEffect();
        updateTopBarLabel(true);
    }

    SoundManager.playClick();

    state.interval = setInterval(() => {
        if (state.seconds === 0) {
            if (state.minutes === 0) {
                completeTimer();
                return;
            }
            state.minutes--;
            state.seconds = 59;
        } else {
            state.seconds--;
        }

        updateDisplay();

        const elapsed = state.totalSeconds - (state.minutes * 60 + state.seconds);
        const progress = 1 - elapsed / state.totalSeconds;
        updateProgress(progress);
    }, 1000);
}

function pauseTimer() {
    if (!state.isRunning) {
        return;
    }

    state.isPaused = true;
    state.isRunning = false;

    if (state.interval) {
        clearInterval(state.interval);
        state.interval = null;
    }

    const startBtn = document.getElementById('focus-start-btn');
    const pauseBtn = document.getElementById('focus-pause-btn');
    if (startBtn) {
        startBtn.style.display = '';
        startBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i> Resume';
    }
    if (pauseBtn) {
        pauseBtn.style.display = 'none';
    }

    SoundManager.playClick();
}

function resetTimer() {
    if (state.interval) {
        clearInterval(state.interval);
        state.interval = null;
    }

    const activePreset = /** @type {HTMLElement | null} */ (document.querySelector('.focus-preset-btn.active'));
    const minutes = activePreset ? parseInt(activePreset.dataset.minutes || '25') : FOCUS_DURATION;
    /** @type {'focus' | 'break'} */
    const mode = activePreset && activePreset.dataset.mode === 'break' ? 'break' : 'focus';

    setTimer(minutes, mode);
    SoundManager.playClick();
}

function completeTimer() {
    if (state.interval) {
        clearInterval(state.interval);
        state.interval = null;
    }

    state.isRunning = false;
    state.isPaused = false;

    removeDimEffect();
    updateTopBarLabel(false);

    // Play completion sound
    playCompletionSound();

    if (state.mode === 'focus') {
        incrementStats();
        showToast('Focus session complete! Take a break.', 'fa-check-circle');
    } else {
        showToast('Break over! Ready for another focus session?', 'fa-coffee');
    }

    const startBtn = document.getElementById('focus-start-btn');
    const pauseBtn = document.getElementById('focus-pause-btn');
    if (startBtn) {
        startBtn.style.display = '';
        startBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i> Start';
    }
    if (pauseBtn) {
        pauseBtn.style.display = 'none';
    }

    // Reset display
    state.minutes = 0;
    state.seconds = 0;
    updateDisplay();
    updateProgress(0);
}

function updateDisplay() {
    const display = document.getElementById('focus-timer-display');
    if (display) {
        const m = String(state.minutes).padStart(2, '0');
        const s = String(state.seconds).padStart(2, '0');
        display.textContent = `${m}:${s}`;
    }
}

/** @param {number} progress - 0 to 1 */
function updateProgress(progress) {
    const fill = document.getElementById('focus-progress-fill');
    if (fill) {
        const circumference = 2 * Math.PI * 90;
        const offset = circumference * (1 - progress);
        fill.style.strokeDasharray = String(circumference);
        fill.style.strokeDashoffset = String(offset);
    }
}

function applyDimEffect() {
    document.querySelectorAll('.window').forEach(win => {
        if (win.id !== 'focus-mode-window') {
            win.classList.add('focus-dimmed');
        }
    });
}

function removeDimEffect() {
    document.querySelectorAll('.window.focus-dimmed').forEach(win => {
        win.classList.remove('focus-dimmed');
    });
}

/** @param {boolean} active */
function updateTopBarLabel(active) {
    let label = document.getElementById('topbar-focus-label');

    if (active) {
        if (!label) {
            label = document.createElement('span');
            label.id = 'topbar-focus-label';
            label.className = 'topbar-focus-label';
            label.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i> Focus Mode';
            const menuBarLeft = document.querySelector('.menu-bar-left');
            if (menuBarLeft) {
                menuBarLeft.appendChild(label);
            }
        }
        label.style.display = '';
    } else if (label) {
        label.style.display = 'none';
    }
}

function playCompletionSound() {
    if (SoundManager.isMuted()) {
        return;
    }
    try {
        const ctx = SoundManager.init();
        // Pleasant bell-like tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);

        // Second tone
        setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.frequency.setValueAtTime(660, ctx.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
            gain2.gain.setValueAtTime(0.15, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
            osc2.start(ctx.currentTime);
            osc2.stop(ctx.currentTime + 0.6);
        }, 300);
    } catch {
        // Sound playback failed silently
    }
}

function loadStats() {
    try {
        const saved = JSON.parse(localStorage.getItem('focusModeStats') || '{"sessions":0,"totalMinutes":0}');
        const sessionsEl = document.getElementById('focus-sessions-count');
        const totalEl = document.getElementById('focus-total-time');
        if (sessionsEl) {
            sessionsEl.textContent = String(saved.sessions || 0);
        }
        if (totalEl) {
            const mins = saved.totalMinutes || 0;
            totalEl.textContent = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
        }
    } catch {
        // Ignore storage errors
    }
}

function incrementStats() {
    try {
        const saved = JSON.parse(localStorage.getItem('focusModeStats') || '{"sessions":0,"totalMinutes":0}');
        saved.sessions = (saved.sessions || 0) + 1;
        saved.totalMinutes = (saved.totalMinutes || 0) + FOCUS_DURATION;
        localStorage.setItem('focusModeStats', JSON.stringify(saved));
        loadStats();
    } catch {
        // Ignore storage errors
    }
}

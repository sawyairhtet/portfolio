import { useState, useEffect, useCallback, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { usePreferences } from '../../context/PreferencesContext';

type TimerState = 'idle' | 'work' | 'break' | 'paused';
type ActiveTimerState = 'work' | 'break';

const PRESETS = [
    { id: 'classic', label: '25 / 5', work: 25 * 60, break: 5 * 60 },
    { id: 'deep', label: '50 / 10', work: 50 * 60, break: 10 * 60 },
    { id: 'sprint', label: '15 / 3', work: 15 * 60, break: 3 * 60 },
];

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatMinutes(seconds: number): string {
    return `${Math.round(seconds / 60)}m`;
}

export function FocusModeApp() {
    const { showToast, addNotification } = useNotifications();
    const { preferences } = usePreferences();
    const [presetId, setPresetId] = useState(PRESETS[0].id);
    const preset = PRESETS.find(item => item.id === presetId) ?? PRESETS[0];
    const [state, setState] = useState<TimerState>('idle');
    const [pausedFrom, setPausedFrom] = useState<ActiveTimerState>('work');
    const [timeLeft, setTimeLeft] = useState(preset.work);
    const [sessions, setSessions] = useState(0);
    const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!preferences.focusDim || (state !== 'work' && state !== 'break')) {
            document.body.classList.remove('focus-dim-active');
            return;
        }

        document.body.classList.add('focus-dim-active');
        return () => document.body.classList.remove('focus-dim-active');
    }, [preferences.focusDim, state]);

    useEffect(() => {
        if (state !== 'work' && state !== 'break') {
            clearTimer();
            return;
        }

        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev > 1) return prev - 1;

                clearTimer();
                if (state === 'work') {
                    setSessions(count => count + 1);
                    setTotalFocusSeconds(total => total + preset.work);
                    setState('break');
                    setPausedFrom('break');
                    showToast('Focus session complete. Break time.', 'fas fa-mug-hot');
                    addNotification({
                        title: 'Focus Session Complete',
                        body: 'Nice work. Take a short break before the next round.',
                        icon: 'fas fa-clock',
                        iconBg: 'linear-gradient(135deg, var(--fedora-green), var(--fedora-teal))',
                        time: 'Just now',
                        group: 'Focus',
                    });
                    return preset.break;
                }

                setState('idle');
                setPausedFrom('work');
                showToast('Break complete. Ready when you are.', 'fas fa-check-circle');
                return preset.work;
            });
        }, 1000);

        return clearTimer;
    }, [state, clearTimer, preset.work, preset.break, showToast, addNotification]);

    const startOrResume = useCallback(() => {
        if (state === 'paused') {
            setState(pausedFrom);
            return;
        }

        setState('work');
        setPausedFrom('work');
        setTimeLeft(preset.work);
    }, [state, pausedFrom, preset.work]);

    const pause = useCallback(() => {
        if (state === 'work' || state === 'break') {
            setPausedFrom(state);
            setState('paused');
        }
    }, [state]);

    const skip = useCallback(() => {
        clearTimer();
        if (state === 'work' || (state === 'paused' && pausedFrom === 'work')) {
            setState('break');
            setPausedFrom('break');
            setTimeLeft(preset.break);
            return;
        }

        setState('idle');
        setPausedFrom('work');
        setTimeLeft(preset.work);
    }, [state, pausedFrom, preset.break, preset.work, clearTimer]);

    const reset = useCallback(() => {
        clearTimer();
        setState('idle');
        setPausedFrom('work');
        setTimeLeft(preset.work);
        setSessions(0);
        setTotalFocusSeconds(0);
    }, [clearTimer, preset.work]);

    const changePreset = useCallback(
        (nextPresetId: string) => {
            const nextPreset = PRESETS.find(item => item.id === nextPresetId) ?? PRESETS[0];
            setPresetId(nextPreset.id);
            if (state === 'idle' || state === 'paused') {
                setTimeLeft(nextPreset.work);
                setState('idle');
                setPausedFrom('work');
            }
        },
        [state]
    );

    const duration =
        state === 'break' || (state === 'paused' && pausedFrom === 'break')
            ? preset.break
            : preset.work;
    const progress = Math.max(0, Math.min(1, (duration - timeLeft) / duration));
    const circumference = 2 * Math.PI * 90;

    return (
        <div className="focus-mode-container">
            <div className="focus-timer-section">
                <div className="focus-mode-label">
                    {state === 'work'
                        ? 'Focus time'
                        : state === 'break'
                          ? 'Break time'
                          : state === 'paused'
                            ? 'Paused'
                            : 'Ready'}
                </div>
                <div className="focus-timer-ring">
                    <svg viewBox="0 0 200 200" className="focus-progress-svg" aria-hidden="true">
                        <circle cx="100" cy="100" r="90" className="focus-progress-bg" />
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            className="focus-progress-fill"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference * (1 - progress)}
                        />
                    </svg>
                    <div className="focus-timer-display">{formatTime(timeLeft)}</div>
                </div>
            </div>

            <div className="focus-presets" aria-label="Focus presets">
                {PRESETS.map(item => (
                    <button
                        key={item.id}
                        className={`focus-preset-btn${presetId === item.id ? ' active' : ''}`}
                        onClick={() => changePreset(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="focus-controls">
                {state === 'work' || state === 'break' ? (
                    <button onClick={pause} className="focus-btn focus-btn-secondary">
                        <i className="fas fa-pause" aria-hidden="true" /> Pause
                    </button>
                ) : (
                    <button onClick={startOrResume} className="focus-btn focus-btn-primary">
                        <i className="fas fa-play" aria-hidden="true" />{' '}
                        {state === 'paused' ? 'Resume' : 'Start'}
                    </button>
                )}
                <button
                    onClick={skip}
                    className="focus-btn focus-btn-ghost"
                    disabled={state === 'idle'}
                >
                    <i className="fas fa-forward" aria-hidden="true" /> Skip
                </button>
                <button onClick={reset} className="focus-btn focus-btn-ghost">
                    <i className="fas fa-redo" aria-hidden="true" /> Reset
                </button>
            </div>

            <div className="focus-stats">
                <div className="focus-stat">
                    <span className="focus-stat-value">{sessions}</span>
                    <span className="focus-stat-label">Sessions</span>
                </div>
                <div className="focus-stat">
                    <span className="focus-stat-value">{formatMinutes(totalFocusSeconds)}</span>
                    <span className="focus-stat-label">Focused</span>
                </div>
                <div className="focus-stat">
                    <span className="focus-stat-value">{preferences.focusDim ? 'On' : 'Off'}</span>
                    <span className="focus-stat-label">Dim</span>
                </div>
            </div>
        </div>
    );
}

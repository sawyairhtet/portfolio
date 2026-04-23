import { useState, useEffect, useCallback, useRef } from 'react';

type TimerState = 'idle' | 'work' | 'break';

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function FocusModeApp() {
    const [state, setState] = useState<TimerState>('idle');
    const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
    const [sessions, setSessions] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Timer tick
    useEffect(() => {
        if (state === 'idle') { clearTimer(); return; }

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearTimer();
                    if (state === 'work') {
                        setSessions((s) => s + 1);
                        setState('break');
                        return BREAK_DURATION;
                    } else {
                        setState('idle');
                        return WORK_DURATION;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return clearTimer;
    }, [state, clearTimer]);

    const start = useCallback(() => {
        setState('work');
        setTimeLeft(WORK_DURATION);
    }, []);

    const pause = useCallback(() => {
        setState('idle');
    }, []);

    const skip = useCallback(() => {
        clearTimer();
        if (state === 'work') {
            setState('break');
            setTimeLeft(BREAK_DURATION);
        } else {
            setState('idle');
            setTimeLeft(WORK_DURATION);
        }
    }, [state, clearTimer]);

    const reset = useCallback(() => {
        clearTimer();
        setState('idle');
        setTimeLeft(WORK_DURATION);
        setSessions(0);
    }, [clearTimer]);

    const progress = state === 'work'
        ? ((WORK_DURATION - timeLeft) / WORK_DURATION) * 100
        : state === 'break'
            ? ((BREAK_DURATION - timeLeft) / BREAK_DURATION) * 100
            : 0;

    return (
        <div className="focus-mode-content" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>
                <i className="fas fa-clock" aria-hidden="true" /> Focus Mode
            </h2>
            <p style={{ opacity: 0.7, marginBottom: '2rem' }}>
                {state === 'work' ? 'Focus time! Stay concentrated.' :
                 state === 'break' ? 'Take a short break.' :
                 'Ready to focus?'}
            </p>

            {/* Timer Circle */}
            <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 2rem' }}>
                <svg viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="100" cy="100" r="90" fill="none" stroke="var(--color-border, #444)" strokeWidth="6" />
                    <circle
                        cx="100" cy="100" r="90" fill="none"
                        stroke="var(--fedora-blue, #3584e4)"
                        strokeWidth="6"
                        strokeDasharray={`${2 * Math.PI * 90}`}
                        strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                </svg>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', fontSize: '2.5rem',
                    fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
                }}>
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div style={{ marginBottom: '1rem', opacity: 0.7 }}>
                Sessions completed: {sessions}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {state === 'idle' ? (
                    <button onClick={start} className="contact-submit-btn" style={{ padding: '0.75rem 2rem' }}>
                        <i className="fas fa-play" aria-hidden="true" /> Start
                    </button>
                ) : (
                    <>
                        <button onClick={pause} className="contact-submit-btn" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-border, #555)' }}>
                            <i className="fas fa-pause" aria-hidden="true" /> Pause
                        </button>
                        <button onClick={skip} className="contact-submit-btn" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-border, #555)' }}>
                            <i className="fas fa-forward" aria-hidden="true" /> Skip
                        </button>
                    </>
                )}
                {sessions > 0 && (
                    <button onClick={reset} className="contact-submit-btn" style={{ padding: '0.75rem 1.5rem', background: 'var(--fedora-red, #e01b24)' }}>
                        <i className="fas fa-redo" aria-hidden="true" /> Reset
                    </button>
                )}
            </div>
        </div>
    );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { BOOT_LOG_MESSAGES, BOOT_LINE_INTERVAL_MS, PLYMOUTH_DURATION_MS } from '../../config/data';

interface BootScreenProps {
    onBootComplete: () => void;
}

export function BootScreen({ onBootComplete }: BootScreenProps) {
    const [phase, setPhase] = useState<'plymouth' | 'bootlog' | 'done'>('plymouth');
    const [bootLines, setBootLines] = useState<string[]>([]);
    const [fadeOut, setFadeOut] = useState(false);
    const isSkippedRef = useRef(false);
    const bootLogRef = useRef<HTMLDivElement>(null);

    const completeBoot = useCallback(() => {
        if (isSkippedRef.current) return;
        isSkippedRef.current = true;
        setFadeOut(true);
        setTimeout(() => {
            setPhase('done');
            onBootComplete();
        }, 300);
    }, [onBootComplete]);

    // Check if should skip boot
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const isReturningVisitor = localStorage.getItem('hasVisitedBefore');

        if (mediaQuery.matches || isReturningVisitor) {
            isSkippedRef.current = true;
            setPhase('done');
            localStorage.setItem('hasVisitedBefore', 'true');
            onBootComplete();
            return;
        }

        // Skip on click or keypress
        const skipBoot = (e: KeyboardEvent | MouseEvent) => {
            if ('key' in e && ['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
            completeBoot();
        };

        document.addEventListener('keydown', skipBoot);
        document.addEventListener('click', skipBoot);

        return () => {
            document.removeEventListener('keydown', skipBoot);
            document.removeEventListener('click', skipBoot);
        };
    }, [completeBoot, onBootComplete]);

    // Plymouth → Boot log transition
    useEffect(() => {
        if (phase !== 'plymouth') return;

        const timer = setTimeout(() => {
            if (!isSkippedRef.current) {
                setPhase('bootlog');
            }
        }, PLYMOUTH_DURATION_MS);

        return () => clearTimeout(timer);
    }, [phase]);

    // Boot log line-by-line
    useEffect(() => {
        if (phase !== 'bootlog') return;

        let lineIndex = 0;
        let timeout: ReturnType<typeof setTimeout>;

        const addLine = () => {
            if (isSkippedRef.current) return;

            if (lineIndex < BOOT_LOG_MESSAGES.length) {
                setBootLines((prev) => [...prev, BOOT_LOG_MESSAGES[lineIndex]]);
                lineIndex++;
                timeout = setTimeout(addLine, BOOT_LINE_INTERVAL_MS);
            } else {
                timeout = setTimeout(completeBoot, 500);
            }
        };

        // Small delay for fade transition
        timeout = setTimeout(addLine, 500);
        return () => clearTimeout(timeout);
    }, [phase, completeBoot]);

    // Auto-scroll boot log
    useEffect(() => {
        if (bootLogRef.current) {
            bootLogRef.current.scrollTop = bootLogRef.current.scrollHeight;
        }
    }, [bootLines]);

    if (phase === 'done') return null;

    return (
        <div
            className={`boot-screen${fadeOut ? ' fade-out' : ''}`}
            role="status"
            aria-label="System booting"
        >
            {phase === 'plymouth' && (
                <div className="plymouth-splash">
                    <div className="plymouth-logo">
                        <i className="fab fa-fedora" aria-hidden="true" />
                    </div>
                    <div className="plymouth-spinner">
                        <div className="plymouth-dot" />
                        <div className="plymouth-dot" />
                        <div className="plymouth-dot" />
                    </div>
                </div>
            )}

            {phase === 'bootlog' && (
                <div className="boot-log" ref={bootLogRef}>
                    {bootLines.map((line, i) => (
                        <div key={i}>
                            {line.startsWith('[  OK  ]') ? (
                                <>
                                    <span className="ok">[  OK  ]</span>
                                    {line.substring(8)}
                                </>
                            ) : line.startsWith('[') ? (
                                <span className="info">{line}</span>
                            ) : (
                                line
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="boot-skip-hint">Press any key or click to skip</div>
        </div>
    );
}

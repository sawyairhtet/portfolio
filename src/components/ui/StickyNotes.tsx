import { useState, useCallback, useEffect, useRef } from 'react';
import { stickyNotesData } from '../../config/data';

interface StickyNotePosition {
    x: number;
    y: number;
}

export function StickyNotes() {
    const [positions, setPositions] = useState<StickyNotePosition[]>(() => {
        const saved = localStorage.getItem('stickyNotePositions');
        if (saved) {
            try { return JSON.parse(saved); } catch { /* use defaults */ }
        }
        return stickyNotesData.map((n) => ({ x: n.x, y: n.y }));
    });

    const dragging = useRef<{ index: number; offsetX: number; offsetY: number } | null>(null);
    const defaultPositions = useCallback(() => stickyNotesData.map((n) => ({ x: n.x, y: n.y })), []);

    useEffect(() => {
        const reset = () => setPositions(defaultPositions());
        window.addEventListener('portfolio:reset-sticky-notes', reset);
        return () => window.removeEventListener('portfolio:reset-sticky-notes', reset);
    }, [defaultPositions]);

    const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
        const el = e.currentTarget as HTMLElement;
        const rect = el.getBoundingClientRect();
        dragging.current = {
            index,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top,
        };

        const handleMouseMove = (ev: MouseEvent) => {
            if (!dragging.current) return;
            const newX = ((ev.clientX - dragging.current.offsetX) / window.innerWidth) * 100;
            const newY = ((ev.clientY - dragging.current.offsetY) / window.innerHeight) * 100;

            setPositions((prev) => {
                const next = [...prev];
                next[dragging.current!.index] = {
                    x: Math.max(0, Math.min(90, newX)),
                    y: Math.max(0, Math.min(90, newY)),
                };
                return next;
            });
        };

        const handleMouseUp = () => {
            // Save positions
            setPositions((prev) => {
                localStorage.setItem('stickyNotePositions', JSON.stringify(prev));
                return prev;
            });
            dragging.current = null;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    return (
        <div className="sticky-notes-container">
            {stickyNotesData.map((note, i) => (
                <div
                    key={i}
                    className={`sticky-note sticky-${note.color}`}
                    style={{
                        left: `${positions[i]?.x ?? note.x}%`,
                        top: `${positions[i]?.y ?? note.y}%`,
                        transform: `rotate(${note.rotation}deg)`,
                        cursor: 'grab',
                    }}
                    onMouseDown={(e) => handleMouseDown(e, i)}
                >
                    {note.text.split('\n').map((line, j) => (
                        <span key={j}>
                            {line}
                            {j < note.text.split('\n').length - 1 && <br />}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
}

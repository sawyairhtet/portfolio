import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

interface SoundContextValue {
    isMuted: boolean;
    setMuted: (muted: boolean) => void;
    toggleMute: () => void;
    playClick: () => void;
    playStartupDrum: () => void;
}

const SoundContext = createContext<SoundContextValue>({
    isMuted: false,
    setMuted: () => {},
    toggleMute: () => {},
    playClick: () => {},
    playStartupDrum: () => {},
});

// Web Audio API based sound manager
function createOscillatorSound(
    audioCtx: AudioContext,
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.1,
) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

export function SoundProvider({ children }: { children: ReactNode }) {
    const [isMuted, setIsMuted] = useState<boolean>(() => {
        return localStorage.getItem('soundMuted') === 'true';
    });

    const audioCtxRef = useRef<AudioContext | null>(null);

    const getAudioCtx = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
        }
        return audioCtxRef.current;
    }, []);

    const setMuted = useCallback((muted: boolean) => {
        setIsMuted(muted);
        localStorage.setItem('soundMuted', String(muted));
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted((prev) => {
            const next = !prev;
            localStorage.setItem('soundMuted', String(next));
            return next;
        });
    }, []);

    const playClick = useCallback(() => {
        if (isMuted) return;
        try {
            const ctx = getAudioCtx();
            createOscillatorSound(ctx, 800, 0.05, 'sine', 0.05);
        } catch {
            // Audio not available
        }
    }, [isMuted, getAudioCtx]);

    const playStartupDrum = useCallback(() => {
        if (isMuted) return;
        try {
            const ctx = getAudioCtx();
            createOscillatorSound(ctx, 150, 0.3, 'triangle', 0.15);
            setTimeout(() => createOscillatorSound(ctx, 200, 0.2, 'triangle', 0.1), 150);
            setTimeout(() => createOscillatorSound(ctx, 300, 0.4, 'sine', 0.08), 300);
        } catch {
            // Audio not available
        }
    }, [isMuted, getAudioCtx]);

    return (
        <SoundContext.Provider value={{ isMuted, setMuted, toggleMute, playClick, playStartupDrum }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound(): SoundContextValue {
    return useContext(SoundContext);
}

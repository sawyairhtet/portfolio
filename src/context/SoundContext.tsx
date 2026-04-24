import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

interface SoundContextValue {
    isMuted: boolean;
    toggleMute: () => void;
    volume: number;
    setVolume: (volume: number) => void;
    playStartupDrum: () => void;
}

const SoundContext = createContext<SoundContextValue>({
    isMuted: false,
    toggleMute: () => {},
    volume: 70,
    setVolume: () => {},
    playStartupDrum: () => {},
});

// Web Audio API based sound manager
function createOscillatorSound(
    audioCtx: AudioContext,
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.1
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
    const [volume, setVolumeState] = useState<number>(() => {
        const saved = Number(localStorage.getItem('soundVolume'));
        return Number.isFinite(saved) ? Math.min(100, Math.max(0, saved)) : 70;
    });

    const audioCtxRef = useRef<AudioContext | null>(null);

    const getAudioCtx = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
        }
        return audioCtxRef.current;
    }, []);

    const setMutedState = useCallback((muted: boolean) => {
        setIsMuted(muted);
        localStorage.setItem('soundMuted', String(muted));
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const next = !prev;
            localStorage.setItem('soundMuted', String(next));
            return next;
        });
    }, []);

    const setVolume = useCallback(
        (nextVolume: number) => {
            const normalized = Math.min(100, Math.max(0, nextVolume));
            setVolumeState(normalized);
            localStorage.setItem('soundVolume', String(normalized));
            if (normalized > 0 && isMuted) {
                setMutedState(false);
            }
        },
        [isMuted, setMutedState]
    );

    const playStartupDrum = useCallback(() => {
        if (isMuted) return;
        try {
            const ctx = getAudioCtx();
            const gain = volume / 100;
            createOscillatorSound(ctx, 150, 0.3, 'triangle', 0.15 * gain);
            setTimeout(() => createOscillatorSound(ctx, 200, 0.2, 'triangle', 0.1 * gain), 150);
            setTimeout(() => createOscillatorSound(ctx, 300, 0.4, 'sine', 0.08 * gain), 300);
        } catch {
            // Audio not available
        }
    }, [isMuted, getAudioCtx, volume]);

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, volume, setVolume, playStartupDrum }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound(): SoundContextValue {
    return useContext(SoundContext);
}

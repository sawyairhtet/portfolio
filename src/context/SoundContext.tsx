import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
    type ReactNode,
} from 'react';

interface SoundContextValue {
    isMuted: boolean;
    toggleMute: () => void;
    volume: number;
    setVolume: (volume: number) => void;
    playStartupDrum: () => void;
    playMinimizeSound: () => void;
    playRestoreSound: () => void;
    playNotificationSound: () => void;
    playCloseSound: () => void;
    playClickSound: () => void;
    playMaximizeSound: () => void;
}

const SoundContext = createContext<SoundContextValue>({
    isMuted: false,
    toggleMute: () => {},
    volume: 70,
    setVolume: () => {},
    playStartupDrum: () => {},
    playMinimizeSound: () => {},
    playRestoreSound: () => {},
    playNotificationSound: () => {},
    playCloseSound: () => {},
    playClickSound: () => {},
    playMaximizeSound: () => {},
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
    // Browsers block audio until the user interacts with the page. We must not
    // even *create* an AudioContext before then, or Chrome logs a noisy
    // "AudioContext was not allowed to start" warning on every sound attempt.
    const isUnlockedRef = useRef(false);

    const getAudioCtx = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
            void ctx.resume();
        }
        return ctx;
    }, []);

    // Create + resume the AudioContext on the first real user gesture, then
    // stop listening. Until this fires, every play* call is a no-op, so no
    // audio is attempted (and no autoplay warning is produced) pre-interaction.
    useEffect(() => {
        if (isUnlockedRef.current) return;
        const unlock = () => {
            isUnlockedRef.current = true;
            try {
                getAudioCtx();
            } catch {
                // AudioContext unavailable (e.g. very old browser) — stay silent.
            }
            teardown();
        };
        const teardown = () => {
            window.removeEventListener('pointerdown', unlock, true);
            window.removeEventListener('keydown', unlock, true);
            window.removeEventListener('touchstart', unlock, true);
        };
        window.addEventListener('pointerdown', unlock, true);
        window.addEventListener('keydown', unlock, true);
        window.addEventListener('touchstart', unlock, true);
        return teardown;
    }, [getAudioCtx]);

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
        if (isMuted || !isUnlockedRef.current) return;
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

    const playMinimizeSound = useCallback(() => {
        if (isMuted || !isUnlockedRef.current) return;
        try {
            const ctx = getAudioCtx();
            const gain = volume / 100;
            createOscillatorSound(ctx, 400, 0.1, 'sine', 0.08 * gain);
            setTimeout(() => createOscillatorSound(ctx, 300, 0.15, 'sine', 0.06 * gain), 80);
        } catch {
            // Audio not available
        }
    }, [isMuted, getAudioCtx, volume]);

    const playRestoreSound = useCallback(() => {
        if (isMuted || !isUnlockedRef.current) return;
        try {
            const ctx = getAudioCtx();
            const gain = volume / 100;
            createOscillatorSound(ctx, 300, 0.1, 'sine', 0.06 * gain);
            setTimeout(() => createOscillatorSound(ctx, 400, 0.15, 'sine', 0.08 * gain), 80);
        } catch {
            // Audio not available
        }
    }, [isMuted, getAudioCtx, volume]);

    const playNotificationSound = useCallback(() => {
        if (isMuted || !isUnlockedRef.current) return;
        try {
            const ctx = getAudioCtx();
            const gain = volume / 100;
            createOscillatorSound(ctx, 600, 0.08, 'sine', 0.07 * gain);
            setTimeout(() => createOscillatorSound(ctx, 800, 0.12, 'sine', 0.07 * gain), 100);
        } catch {
            // Audio not available
        }
    }, [isMuted, getAudioCtx, volume]);

    const playCloseSound = useCallback(() => {
        if (isMuted || !isUnlockedRef.current) return;
        try {
            const ctx = getAudioCtx();
            const gain = volume / 100;
            createOscillatorSound(ctx, 500, 0.08, 'sine', 0.06 * gain);
            setTimeout(() => createOscillatorSound(ctx, 350, 0.1, 'sine', 0.05 * gain), 60);
        } catch {
            // Audio not available
        }
    }, [isMuted, getAudioCtx, volume]);

    const playClickSound = useCallback(() => {
        if (isMuted || !isUnlockedRef.current) return;
        try {
            const ctx = getAudioCtx();
            const gain = volume / 100;
            createOscillatorSound(ctx, 800, 0.04, 'sine', 0.04 * gain);
        } catch {
            // Audio not available
        }
    }, [isMuted, getAudioCtx, volume]);

    const playMaximizeSound = useCallback(() => {
        if (isMuted || !isUnlockedRef.current) return;
        try {
            const ctx = getAudioCtx();
            const gain = volume / 100;
            createOscillatorSound(ctx, 500, 0.06, 'sine', 0.05 * gain);
            setTimeout(() => createOscillatorSound(ctx, 700, 0.1, 'sine', 0.04 * gain), 50);
        } catch {
            // Audio not available
        }
    }, [isMuted, getAudioCtx, volume]);

    return (
        <SoundContext.Provider
            value={{
                isMuted,
                toggleMute,
                volume,
                setVolume,
                playStartupDrum,
                playMinimizeSound,
                playRestoreSound,
                playNotificationSound,
                playCloseSound,
                playClickSound,
                playMaximizeSound,
            }}
        >
            {children}
        </SoundContext.Provider>
    );
}

export function useSound(): SoundContextValue {
    return useContext(SoundContext);
}

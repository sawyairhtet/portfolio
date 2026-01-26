/**
 * Sound Manager - WebAudio Synthesis
 * Handles all audio effects for the portfolio
 */

const SoundManager = {
    audioContext: null,
    muted: false, // Default pending init

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Lazy load preference safely
        try {
            this.muted = localStorage.getItem('soundMuted') === 'true';
        } catch (e) {
            console.warn('LocalStorage access blocked', e);
        }
        return this.audioContext;
    },

    setMuted(muted) {
        this.muted = muted;
        try {
            localStorage.setItem('soundMuted', muted.toString());
        } catch (e) {
            // Ignore storage errors
        }
    },

    isMuted() {
        return this.muted;
    },

    playClick() {
        if (this.muted) return;
        try {
            const ctx = this.init();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(800, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.05);
        } catch (e) {
            console.log('Sound playback failed:', e);
        }
    },

    playWhoosh() {
        if (this.muted) return;
        try {
            const ctx = this.init();
            
            const bufferSize = ctx.sampleRate * 0.15;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(3000, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
            
            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
            
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            noise.start(ctx.currentTime);
        } catch (e) {
            console.log('Sound playback failed:', e);
        }
    },

    playStartupDrum() {
        if (this.muted) return;
        try {
            const ctx = this.init();
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
            
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
            
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                
                osc2.frequency.setValueAtTime(120, ctx.currentTime);
                osc2.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
                
                gain2.gain.setValueAtTime(0.25, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
                
                osc2.start(ctx.currentTime);
                osc2.stop(ctx.currentTime + 0.25);
            }, 200);
        } catch (e) {
            console.log('Sound playback failed:', e);
        }
    }
};

export default SoundManager;

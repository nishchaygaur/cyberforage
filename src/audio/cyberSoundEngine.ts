class CyberSoundEngine {
  private ctx: AudioContext | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  public isMuted: boolean = false; // Enabled by default
  public isDroneActive: boolean = false;
  public voiceEnabled: boolean = true;
  public hasWelcomed: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private isWelcoming: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        try {
          const v = window.speechSynthesis.getVoices();
          if (v && v.length > 0) {
            this.cachedVoices = v;
          }
        } catch {
          // Ignored
        }
      };
      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }

  public initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public async triggerWelcomeSequence(customText?: string): Promise<boolean> {
    if (this.hasWelcomed || this.isMuted || this.isWelcoming) return false;

    this.initCtx();
    if (!this.ctx) return false;

    // Check if AudioContext is running or can be resumed immediately
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        // Autoplay restriction in effect
      }
    }

    if (this.ctx.state === 'running') {
      this.isWelcoming = true;
      this.hasWelcomed = true;
      this.playWelcome(customText);
      setTimeout(() => {
        this.isWelcoming = false;
      }, 3500);
      return true;
    }

    // Attempt direct voice synthesis if Web Audio is suspended by browser
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.voiceEnabled) {
      try {
        this.speakVoice(
          customText || "Welcome to Cyberforage. Tactical defense systems online.",
          () => {
            this.hasWelcomed = true;
          }
        );
      } catch {
        // Ignored
      }
    }

    return this.hasWelcomed;
  }

  public setMuted(muted: boolean): boolean {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbientDrone();
    } else {
      this.initCtx();
      this.playBlip();
    }
    return this.isMuted;
  }

  public toggleMute(): boolean {
    return this.setMuted(!this.isMuted);
  }

  public toggleDrone(): boolean {
    if (this.isDroneActive) {
      this.stopAmbientDrone();
      return false;
    } else {
      if (this.isMuted) {
        this.setMuted(false);
      }
      this.startAmbientDrone();
      return true;
    }
  }

  public startAmbientDrone() {
    if (this.isMuted || this.isDroneActive) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.025, this.ctx.currentTime + 2.0);

      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sawtooth';
      this.ambientOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(55.8, this.ctx.currentTime); // Slight binaural beat

      this.ambientOsc1.connect(filter);
      this.ambientOsc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
      this.isDroneActive = true;
    } catch {
      // Audio autoplay handled gracefully
    }
  }

  public stopAmbientDrone() {
    if (!this.isDroneActive) return;
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      }
      setTimeout(() => {
        try {
          this.ambientOsc1?.stop();
          this.ambientOsc2?.stop();
          this.ambientOsc1?.disconnect();
          this.ambientOsc2?.disconnect();
        } catch {
          // Ignored
        }
        this.ambientOsc1 = null;
        this.ambientOsc2 = null;
        this.ambientGain = null;
        this.isDroneActive = false;
      }, 900);
    } catch {
      this.isDroneActive = false;
    }
  }

  public playWelcome(customText?: string) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;

      // 1. Deep sub-bass energy swell
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(55, now);
      subOsc.frequency.exponentialRampToValueAtTime(160, now + 0.6);
      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.14, now + 0.25);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.85);

      // 2. Harmonic Cyber Arpeggio (Futuristic power-up chord)
      const chordNotes = [329.63, 440.0, 554.37, 659.25, 880.0, 1108.73];
      chordNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + 0.08 + idx * 0.07;

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq * 0.75, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.15);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.07, startTime + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.9);
      });

      // 3. Shimmering high-frequency cyber beam
      const highOsc = this.ctx.createOscillator();
      const highGain = this.ctx.createGain();
      highOsc.type = 'sawtooth';
      highOsc.frequency.setValueAtTime(1100, now + 0.45);
      highOsc.frequency.exponentialRampToValueAtTime(2200, now + 0.75);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now);

      highGain.gain.setValueAtTime(0.001, now + 0.45);
      highGain.gain.linearRampToValueAtTime(0.04, now + 0.55);
      highGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      highOsc.connect(filter);
      filter.connect(highGain);
      highGain.connect(this.ctx.destination);
      highOsc.start(now + 0.45);
      highOsc.stop(now + 0.9);

      // 4. Tactical Welcome Voice Synthesizer
      if (this.voiceEnabled) {
        setTimeout(() => {
          this.speakVoice(
            customText || "Welcome to Cyberforage. Tactical defense systems online."
          );
        }, 600);
      }
    } catch {
      // Ignored if browser audio context restricted
    }
  }

  public replayWelcome(customText?: string) {
    this.hasWelcomed = false;
    this.isWelcoming = false;
    this.initCtx();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.playWelcome(customText);
  }

  public speakVoice(text: string, onStarted?: () => void, onError?: (err: any) => void) {
    if (this.isMuted || !this.voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      setTimeout(() => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.pitch = 0.88;
          utterance.rate = 1.0;
          utterance.volume = 0.95;

          const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            const preferred = voices.find(
              (v) =>
                v.lang.startsWith('en') &&
                (v.name.includes('Google') ||
                  v.name.includes('Natural') ||
                  v.name.includes('Samantha') ||
                  v.name.includes('Daniel') ||
                  v.name.includes('David') ||
                  v.name.includes('Zira') ||
                  v.name.includes('Desktop'))
            );
            if (preferred) {
              utterance.voice = preferred;
            }
          }

          utterance.onstart = () => {
            if (onStarted) onStarted();
          };

          utterance.onerror = (e) => {
            if (onError) onError(e);
          };

          window.speechSynthesis.speak(utterance);
        } catch (e) {
          if (onError) onError(e);
        }
      }, 40);
    } catch (err) {
      if (onError) onError(err);
    }
  }

  public playBlip() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Ignored
    }
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Ignored
    }
  }

  public playLaser() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignored
    }
  }

  public playRadioStatic() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch {
      // Ignored
    }
  }

  public playPulse() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch {
      // Ignored
    }
  }

  public playAlert() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(650, this.ctx.currentTime);
      osc.frequency.setValueAtTime(850, this.ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(650, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {
      // Ignored
    }
  }

  public playTerminalKey() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const freq = 1800 + Math.random() * 400;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // Ignored
    }
  }

  public speak(text: string) {
    this.speakVoice(text);
  }
}

export const cyberSound = new CyberSoundEngine();

// Auto-trigger welcome sequence at initial document loading
if (typeof window !== 'undefined') {
  const tryAutoPlay = () => {
    cyberSound.triggerWelcomeSequence().catch(() => {});
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    tryAutoPlay();
  } else {
    window.addEventListener('DOMContentLoaded', tryAutoPlay, { once: true });
    window.addEventListener('load', tryAutoPlay, { once: true });
  }
}

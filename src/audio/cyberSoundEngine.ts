class CyberSoundEngine {
  private ctx: AudioContext | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  public isMuted: boolean = false; // Master audio enabled by default
  public isDroneActive: boolean = true; // Ambient drone active by default
  public voiceEnabled: boolean = true; // Tactical voice synthesizer enabled by default
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
    if (typeof window !== 'undefined' && (window as unknown as { __CYBERFORAGE_PAGE_WELCOMED?: boolean }).__CYBERFORAGE_PAGE_WELCOMED) {
      this.hasWelcomed = true;
      return true;
    }
    if (this.hasWelcomed || this.isMuted || this.isWelcoming) return false;

    this.isWelcoming = true;

    // 1. In modern browsers, SpeechSynthesis can speak immediately on page load
    let voiceTriggered = false;
    if (this.voiceEnabled) {
      this.speakVoice(
        customText || "Welcome to Cyberforage. Tactical defense systems online."
      );
      voiceTriggered = true;
    }

    this.initCtx();
    if (!this.ctx) {
      this.isWelcoming = false;
      return voiceTriggered;
    }

    // 2. Attempt to resume audio context
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        // Handled via immediate pointer motion / interaction
      }
    }

    if (this.ctx.state === 'running') {
      this.hasWelcomed = true;
      if (typeof window !== 'undefined') {
        (window as unknown as { __CYBERFORAGE_PAGE_WELCOMED?: boolean }).__CYBERFORAGE_PAGE_WELCOMED = true;
      }
      this.playWelcome(customText, !voiceTriggered);
      if (this.isDroneActive) {
        this.startAmbientDrone();
      }
      setTimeout(() => {
        this.isWelcoming = false;
      }, 3500);
      return true;
    }

    this.isWelcoming = false;
    return voiceTriggered;
  }

  public setMuted(muted: boolean): boolean {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbientDrone();
    } else {
      this.initCtx();
      this.playBlip();
      if (this.isDroneActive) {
        this.startAmbientDrone();
      }
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
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ambientOsc1) return; // Already running

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.025, this.ctx.currentTime + 1.5);

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

  public playWelcome(customText?: string, speakVoiceNow: boolean = true) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;

      // 1. Warm Analog Cyber Bass Foundation (clean sine, gentle presence)
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(75, now);
      bassOsc.frequency.exponentialRampToValueAtTime(52, now + 0.65);
      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.linearRampToValueAtTime(0.07, now + 0.12);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.75);

      // 2. High-Tech Glass Cyber Chime (Pristine 3-tone Harmonic Handshake)
      // Note 1: D5 (587.33 Hz)
      // Note 2: A5 (880.00 Hz)
      // Note 3: E6 (1318.51 Hz) + F#6 shimmer (1479.98 Hz)
      const chimes = [
        { freq: 587.33, start: now + 0.05, dur: 0.55, gainVal: 0.06 },
        { freq: 880.00, start: now + 0.18, dur: 0.60, gainVal: 0.07 },
        { freq: 1318.51, start: now + 0.32, dur: 0.65, gainVal: 0.06 },
        { freq: 1479.98, start: now + 0.40, dur: 0.55, gainVal: 0.035 }
      ];

      chimes.forEach(({ freq, start, dur, gainVal }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3600, start);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(gainVal, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        const blendGain = this.ctx.createGain();
        blendGain.gain.setValueAtTime(0.18, start);
        overtone.connect(blendGain);
        blendGain.connect(gain);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(this.ctx.destination);

        osc.start(start);
        overtone.start(start);
        osc.stop(start + dur);
        overtone.stop(start + dur);
      });

      // 3. Subtle Holographic Resonant Swell
      const pulseOsc = this.ctx.createOscillator();
      const pulseGain = this.ctx.createGain();
      const pulseFilter = this.ctx.createBiquadFilter();

      pulseFilter.type = 'bandpass';
      pulseFilter.Q.setValueAtTime(2.5, now + 0.1);
      pulseFilter.frequency.setValueAtTime(1600, now + 0.1);
      pulseFilter.frequency.exponentialRampToValueAtTime(800, now + 0.6);

      pulseOsc.type = 'sine';
      pulseOsc.frequency.setValueAtTime(1200, now + 0.1);
      pulseGain.gain.setValueAtTime(0.001, now + 0.1);
      pulseGain.gain.linearRampToValueAtTime(0.02, now + 0.22);
      pulseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      pulseOsc.connect(pulseGain);
      pulseGain.connect(pulseFilter);
      pulseFilter.connect(this.ctx.destination);
      pulseOsc.start(now + 0.1);
      pulseOsc.stop(now + 0.65);

      // 4. Tactical Welcome Voice Synthesizer (Starts cleanly as chimes settle)
      if (this.voiceEnabled && speakVoiceNow) {
        setTimeout(() => {
          this.speakVoice(
            customText || "Welcome to Cyberforage. Tactical defense systems online."
          );
        }, 300);
      }

      // 5. Automatic Sub-Bass Ambient Drone
      if (this.isDroneActive) {
        this.startAmbientDrone();
      }
    } catch {
      // Ignored if browser audio context restricted
    }
  }

  public replayWelcome(customText?: string) {
    if (this.isMuted) return;
    this.initCtx();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.playWelcome(customText, true);
  }

  public speakVoice(text: string, onStarted?: () => void, onError?: (err: any) => void) {
    if (this.isMuted || !this.voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

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


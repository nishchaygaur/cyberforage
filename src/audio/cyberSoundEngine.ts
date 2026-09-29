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
  private userHasInteracted: boolean = false;
  private pendingWelcomeChime: boolean = false;
  private pendingWelcomeText?: string;

  public voiceHasSpoken: boolean = false;
  private stateListeners: Set<(state: AudioContextState | 'unsupported') => void> = new Set();

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
      window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    }
  }

  /**
   * Retrieves current AudioContext state ('running', 'suspended', 'closed', or 'unsupported').
   */
  public getAudioState(): AudioContextState | 'unsupported' {
    if (typeof window === 'undefined') return 'unsupported';
    if (!this.ctx) return 'suspended';
    return this.ctx.state;
  }

  /**
   * Subscribes to AudioContext state changes (e.g. from 'suspended' to 'running' on unlock).
   */
  public onStateChange(listener: (state: AudioContextState | 'unsupported') => void): () => void {
    this.stateListeners.add(listener);
    listener(this.getAudioState());
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private notifyStateListeners() {
    const state = this.getAudioState();
    this.stateListeners.forEach((l) => {
      try {
        l(state);
      } catch {}
    });
  }

  /**
   * Checks if user activation has occurred on the page, satisfying browser autoplay policies.
   */
  public isUserGestureAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    if (this.userHasInteracted) return true;
    if (
      typeof navigator !== 'undefined' &&
      'userActivation' in navigator &&
      (navigator as unknown as { userActivation?: { hasBeenActive?: boolean } }).userActivation?.hasBeenActive
    ) {
      this.userHasInteracted = true;
      return true;
    }
    return false;
  }

  /**
   * Initializes or returns AudioContext according to Google Chrome Web Audio Autoplay guidelines.
   * If forced (e.g. on page load), instantiates AudioContext and listens for state transitions.
   */
  public initCtx(force: boolean = false): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      if (!force && !this.userHasInteracted && !this.isUserGestureAvailable()) {
        return null;
      }

      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();

          // Attach statechange listener per Chrome specification
          this.ctx.addEventListener('statechange', () => {
            this.notifyStateListeners();
            if (this.ctx && this.ctx.state === 'running') {
              if (!this.hasWelcomed && !this.isMuted) {
                this.hasWelcomed = true;
                if (typeof window !== 'undefined') {
                  (window as unknown as { __CYBERFORAGE_PAGE_WELCOMED?: boolean }).__CYBERFORAGE_PAGE_WELCOMED = true;
                }
                this.playWelcome(this.pendingWelcomeText, !this.voiceHasSpoken);
              } else if (this.isDroneActive && !this.ambientOsc1) {
                this.startAmbientDrone();
              }
            }
          });
        }
      } catch {
        return null;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended' && (this.userHasInteracted || this.isUserGestureAvailable())) {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /**
   * Unlocks Web Audio synchronously inside a user interaction event or programmatic trigger.
   */
  public unlockAudio(): AudioContext | null {
    this.userHasInteracted = true;
    if (typeof window === 'undefined') return null;

    const ctx = this.initCtx(true);
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // If welcome chimes were queued waiting for browser activation, trigger them now
    if (this.pendingWelcomeChime && !this.isMuted) {
      this.pendingWelcomeChime = false;
      this.hasWelcomed = true;
      if (typeof window !== 'undefined') {
        (window as unknown as { __CYBERFORAGE_PAGE_WELCOMED?: boolean }).__CYBERFORAGE_PAGE_WELCOMED = true;
      }
      this.playWelcome(this.pendingWelcomeText, !this.voiceHasSpoken);
    }

    return ctx;
  }

  /**
   * Triggers the welcome sequence following Google Chrome's Web Audio Autoplay specification:
   * 1. Speaks tactical male voice synthesizer on page load.
   * 2. Instantiates AudioContext and checks .state ('running' vs 'suspended').
   * 3. Attempts immediate resume() if MEI permits automatic playback.
   * 4. Arms statechange & interaction listeners to fire harmonic chimes and ambient drone instantly.
   */
  public async triggerWelcomeSequence(customText?: string): Promise<boolean> {
    if (this.hasWelcomed || this.isMuted || this.isWelcoming) return this.hasWelcomed;

    this.isWelcoming = true;
    this.pendingWelcomeText = customText;

    // 1. Tactical Welcome Voice (SpeechSynthesis)
    if (this.voiceEnabled && !this.voiceHasSpoken) {
      try {
        this.speakVoice(
          customText || "Welcome to Cyberforage. Tactical defense systems online.",
          () => {
            this.voiceHasSpoken = true;
          }
        );
      } catch {}
    }

    // 2. Initialize AudioContext on page load per Chrome Autoplay Guide
    const ctx = this.initCtx(true);

    if (ctx) {
      // If allowed by Chrome Media Engagement Index (MEI), state is already 'running'
      if (ctx.state === 'running') {
        this.hasWelcomed = true;
        if (typeof window !== 'undefined') {
          (window as unknown as { __CYBERFORAGE_PAGE_WELCOMED?: boolean }).__CYBERFORAGE_PAGE_WELCOMED = true;
        }
        this.playWelcome(customText, false);
        setTimeout(() => {
          this.isWelcoming = false;
        }, 3500);
        return true;
      }

      // Attempt resume on page load in case browser permits it
      try {
        await ctx.resume();
        if ((ctx.state as AudioContextState) === 'running') {
          this.hasWelcomed = true;
          if (typeof window !== 'undefined') {
            (window as unknown as { __CYBERFORAGE_PAGE_WELCOMED?: boolean }).__CYBERFORAGE_PAGE_WELCOMED = true;
          }
          this.playWelcome(customText, false);
          setTimeout(() => {
            this.isWelcoming = false;
          }, 3500);
          return true;
        }
      } catch {
        // Suspended pending user interaction; statechange listener and gesture fallback are active
      }
    }

    // 3. Mark pending so that as soon as user interacts or state transitions to running, chimes trigger
    this.pendingWelcomeChime = true;
    this.isWelcoming = false;
    this.notifyStateListeners();
    return false;
  }

  public setMuted(muted: boolean): boolean {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbientDrone();
    } else {
      this.unlockAudio();
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
      this.unlockAudio();
      this.startAmbientDrone();
      return true;
    }
  }

  public startAmbientDrone() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx || ctx.state !== 'running') return;
      if (this.ambientOsc1) return; // Already running

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, ctx.currentTime);

      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 1.5);

      this.ambientOsc1 = ctx.createOscillator();
      this.ambientOsc1.type = 'sawtooth';
      this.ambientOsc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note

      this.ambientOsc2 = ctx.createOscillator();
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(55.8, ctx.currentTime); // Slight binaural beat

      this.ambientOsc1.connect(filter);
      this.ambientOsc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);

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
      if (this.ambientGain && this.ctx && this.ctx.state === 'running') {
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
      const ctx = this.ctx;
      if (!ctx || ctx.state !== 'running') return;

      const now = ctx.currentTime;

      // 1. Warm Analog Cyber Bass Foundation (clean sine, gentle presence)
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(75, now);
      bassOsc.frequency.exponentialRampToValueAtTime(52, now + 0.65);
      bassGain.gain.setValueAtTime(0.001, now);
      bassGain.gain.linearRampToValueAtTime(0.07, now + 0.12);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
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
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const overtone = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3600, start);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(gainVal, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        const blendGain = ctx.createGain();
        blendGain.gain.setValueAtTime(0.18, start);
        overtone.connect(blendGain);
        blendGain.connect(gain);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(ctx.destination);

        osc.start(start);
        overtone.start(start);
        osc.stop(start + dur);
        overtone.stop(start + dur);
      });

      // 3. Subtle Holographic Resonant Swell
      const pulseOsc = ctx.createOscillator();
      const pulseGain = ctx.createGain();
      const pulseFilter = ctx.createBiquadFilter();

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
      pulseFilter.connect(ctx.destination);
      pulseOsc.start(now + 0.1);
      pulseOsc.stop(now + 0.65);

      // 4. Tactical Welcome Voice Synthesizer (Starts cleanly as chimes settle)
      if (this.voiceEnabled && speakVoiceNow && !this.voiceHasSpoken) {
        setTimeout(() => {
          this.speakVoice(
            customText || "Welcome to Cyberforage. Tactical defense systems online.",
            () => {
              this.voiceHasSpoken = true;
            }
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
    this.voiceHasSpoken = false;
    this.unlockAudio();
    this.playWelcome(customText, true);
  }

  public speakVoice(text: string, onStarted?: () => void, onError?: (err: unknown) => void) {
    if (this.isMuted || !this.voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 0.85;
        utterance.rate = 1.02;
        utterance.volume = 1.0;

        let voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          const handleVoices = () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handleVoices);
            this.cachedVoices = window.speechSynthesis.getVoices();
            this.speakVoice(text, onStarted, onError);
          };
          window.speechSynthesis.addEventListener('voiceschanged', handleVoices, { once: true });
          return;
        }
        this.cachedVoices = voices;

        if (voices.length > 0) {
          // Explicitly prioritize authentic English MALE voices
          const maleVoice =
            voices.find(
              (v) =>
                v.lang.startsWith('en') &&
                (v.name.includes('David') ||
                 v.name.includes('Mark') ||
                 v.name.includes('George') ||
                 v.name.includes('Daniel') ||
                 v.name.includes('Alex') ||
                 v.name.includes('Guy') ||
                 v.name.includes('Christopher') ||
                 v.name.includes('UK English Male') ||
                 (v.name.toLowerCase().includes('male') && !v.name.toLowerCase().includes('female')))
            ) ||
            voices.find(
              (v) =>
                v.lang.startsWith('en') &&
                !v.name.toLowerCase().includes('zira') &&
                !v.name.toLowerCase().includes('samantha') &&
                !v.name.toLowerCase().includes('jenny') &&
                !v.name.toLowerCase().includes('eva') &&
                !v.name.toLowerCase().includes('victoria') &&
                !v.name.toLowerCase().includes('karen') &&
                !v.name.toLowerCase().includes('female')
            ) ||
            voices.find((v) => v.lang.startsWith('en'));

          if (maleVoice) {
            utterance.voice = maleVoice;
          }
        }

        utterance.onstart = () => {
          this.voiceHasSpoken = true;
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
      const ctx = this.initCtx();
      if (!ctx || ctx.state !== 'running') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignored
    }
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx || ctx.state !== 'running') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignored
    }
  }

  public playLaser() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx || ctx.state !== 'running') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Ignored
    }
  }

  public playRadioStatic() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx || ctx.state !== 'running') return;

      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch {
      // Ignored
    }
  }

  public playPulse() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx || ctx.state !== 'running') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Ignored
    }
  }

  public playAlert() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx || ctx.state !== 'running') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.setValueAtTime(850, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(650, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Ignored
    }
  }

  public playTerminalKey() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx || ctx.state !== 'running') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const freq = 1800 + Math.random() * 400;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Ignored
    }
  }

  public speak(text: string) {
    this.speakVoice(text);
  }
}

export const cyberSound = new CyberSoundEngine();

// Seamless global gesture unlock: unlocks Web Audio on user's first genuine interaction
if (typeof window !== 'undefined') {
  const unlockEvents = ['click', 'pointerdown', 'keydown', 'touchstart'];
  const handleUserActivation = () => {
    cyberSound.unlockAudio();
    unlockEvents.forEach((evt) => {
      window.removeEventListener(evt, handleUserActivation, true);
    });
  };

  unlockEvents.forEach((evt) => {
    window.addEventListener(evt, handleUserActivation, { capture: true, passive: true });
  });

  // Attempt welcome sequence (voice speech) on page load
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

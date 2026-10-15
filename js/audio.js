// ==============================================================================
// NANO-PULSE AUDIO SYNTHESIZER ENGINE (Web Audio API)
// Tactile medical journal audio: Pencil scratches, typewriter clacks,
// ink stamp thuds, acoustic pulse ricochets, and resonant singing bowl override.
// ==============================================================================

class JournalAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.sfxGain = null;
    this.ambientGain = null;
    this.heartbeatTimer = null;
    this.heartRate = 72;
    this.isHeartbeatRunning = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.ambientGain = this.ctx.createGain();

      this.masterGain.gain.value = 0.85;
      this.sfxGain.gain.value = 0.8;
      this.ambientGain.gain.value = 0.3;

      this.sfxGain.connect(this.masterGain);
      this.ambientGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  // --- 1. Pencil Scratch / Sketch Sound ---
  playPencilScratch(duration = 0.08) {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2800 + Math.random() * 800, t);
    filter.Q.value = 4.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
  }

  // --- 2. Vintage Typewriter Key Clack ---
  playTypewriterClack() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Click transient
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200 + Math.random() * 300, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.025);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.028);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.03);

    // Mechanical thud
    this.playSubThump(0.04, 80, 0.12);
  }

  // --- 3. Medical Stamp Ink "THUD" ---
  playStampThud() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.22);

    filter.type = 'lowpass';
    filter.frequency.value = 260;

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.26);

    // Paper slap texture
    this.playPencilScratch(0.12);
  }

  // --- 4. Sub-harmonic Thump ---
  playSubThump(duration = 0.08, freq = 65, volume = 0.2) {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + duration);

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + duration);
  }

  // --- 5. Nano-Pulse Launch Chirp ---
  playPulseLaunch() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.11);
  }

  // --- 6. Specular Ricochet Ping (Acoustic Mirror Bounce) ---
  playRicochetPing(bounceCount = 1) {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const baseFreqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const freq = baseFreqs[Math.min(bounceCount - 1, baseFreqs.length - 1)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.96, t + 0.12);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  // --- 7. Target Synapse Cleared (Success Chime) ---
  playSynapseHit() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const chord = [440, 554.37, 659.25, 880]; // A major
    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);

      gain.gain.setValueAtTime(0.001, t + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.18, t + idx * 0.04 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.04 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t + idx * 0.04);
      osc.stop(t + idx * 0.04 + 0.38);
    });
  }

  // --- 8. BIO-HARMONIC OVERRIDE ENGAGED (Resonant Tibetan Singing Bowl) ---
  playBioHarmonicChime() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Harmonic series tuned to 216Hz & 432Hz (Sacred/Calming frequency)
    const harmonics = [
      { f: 216, gain: 0.35, dur: 3.2 },
      { f: 432, gain: 0.28, dur: 2.8 },
      { f: 648, gain: 0.15, dur: 2.2 },
      { f: 864, gain: 0.08, dur: 1.8 }
    ];

    harmonics.forEach(h => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(h.f, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(h.gain, t + 0.15); // gentle swell
      gain.gain.exponentialRampToValueAtTime(0.0001, t + h.dur);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + h.dur);
    });
  }

  // --- 9. Mosquito Buzz / High-Pitch Neural Tinnitus Whine ---
  playMosquitoBuzz(duration = 2.2) {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Dual high-pitch saw/square oscillators with vibrato LFO to simulate mosquito wing flutters / sharp tinnitus
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(680, t);
    osc1.frequency.linearRampToValueAtTime(740, t + duration * 0.4);
    osc1.frequency.linearRampToValueAtTime(690, t + duration);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(1360, t);
    osc2.frequency.linearRampToValueAtTime(1480, t + duration * 0.4);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(32, t); // 32 Hz wing flutter
    lfoGain.gain.setValueAtTime(45, t);

    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    lfo.start(t);
    osc1.start(t);
    osc2.start(t);
    lfo.stop(t + duration);
    osc1.stop(t + duration);
    osc2.stop(t + duration);
  }

  // --- 10. Medical ICU Heart Monitor Fast Beeper Loop ---
  startHeartMonitor(bpm = 124) {
    this.init();
    this.resume();
    this.heartRate = bpm;
    this.isHeartbeatRunning = true;
    this.stopHeartMonitorTimer();

    const beep = () => {
      if (!this.isHeartbeatRunning || !this.ctx || this.isMuted) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, t); // B5 medical monitor standard pitch
      osc.frequency.setValueAtTime(987.77, t + 0.08);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.1);

      // Low cardiac pulse thud alongside the electronic beep
      this.playSubThump(0.08, 62, 0.2);

      const intervalMs = (60 / this.heartRate) * 1000;
      this.heartbeatTimer = setTimeout(beep, intervalMs);
    };

    beep();
  }

  stopHeartMonitor() {
    this.isHeartbeatRunning = false;
    this.stopHeartMonitorTimer();
  }

  stopHeartMonitorTimer() {
    if (this.heartbeatTimer) {
      clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // --- 11. Cinematic White Flash / Transition Whoosh ---
  playFlashWhoosh() {
    this.init();
    this.resume();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(760, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.45);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.46);

    // Ink stamp thud for impact
    this.playSubThump(0.3, 48, 0.4);
  }

  // --- 12. Rhythmic Heartbeat (Subtle Pulse) ---
  startHeartbeat(bpm = 72) {
    this.startHeartMonitor(bpm);
  }

  stopHeartbeat() {
    this.stopHeartMonitor();
  }

  stopHeartbeatTimer() {
    this.stopHeartMonitorTimer();
  }
}

window.soundEngine = new JournalAudioEngine();


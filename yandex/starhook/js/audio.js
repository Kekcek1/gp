// Процедурный звук: атмосфера и эффекты без внешних аудиофайлов.

const CHORDS = [
  [110.0, 164.81, 220.0, 329.63], // Am
  [87.31, 130.81, 174.61, 261.63], // F
  [130.81, 196.0, 261.63, 392.0], // C
  [98.0, 146.83, 196.0, 293.66] // G
];
const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.noiseBuffer = null;
    this.unlocked = false;
    this.paused = false;
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.ambientStarted = false;
    this.scheduler = null;
    this.nextChordAt = 0;
    this.chordIndex = 0;
    this.lastTick = 0;
    this.lastSparkle = 0;
    this.volume = 0.85;
  }

  get supported() {
    return typeof window !== 'undefined' && Boolean(window.AudioContext || window.webkitAudioContext);
  }

  /** Создаёт контекст после первого действия пользователя. */
  unlock() {
    if (!this.supported) return false;
    if (!this.ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.paused ? 0 : this.volume;
      this.master.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicEnabled ? 0.55 : 0;
      this.musicGain.connect(this.master);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.soundEnabled ? 0.9 : 0;
      this.sfxGain.connect(this.master);

      this.noiseBuffer = this.createNoiseBuffer(2.5);
    }
    if (this.ctx.state === 'suspended' && !this.paused) {
      this.ctx.resume().catch(() => {});
    }
    this.unlocked = true;
    this.startAmbient();
    return true;
  }

  createNoiseBuffer(seconds) {
    const length = Math.floor(this.ctx.sampleRate * seconds);
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      // Немного сглаженный шум — ближе к воде, чем к телевизионным помехам.
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    return buffer;
  }

  applySettings(settings = {}) {
    this.soundEnabled = settings.sound !== false;
    this.musicEnabled = settings.music !== false;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.sfxGain.gain.cancelScheduledValues(now);
    this.sfxGain.gain.setTargetAtTime(this.soundEnabled ? 0.9 : 0, now, 0.04);
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setTargetAtTime(this.musicEnabled ? 0.55 : 0, now, 0.08);
    if (this.musicEnabled && this.unlocked && !this.ambientStarted) this.startAmbient();
  }

  setPaused(paused) {
    if (this.paused === paused) return;
    this.paused = paused;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(paused ? 0 : this.volume, now, 0.05);
    if (paused) {
      setTimeout(() => {
        if (this.paused && this.ctx?.state === 'running') this.ctx.suspend().catch(() => {});
      }, 180);
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  startAmbient() {
    if (!this.ctx || this.ambientStarted || !this.musicEnabled) return;
    this.ambientStarted = true;
    this.nextChordAt = this.ctx.currentTime + 0.1;
    this.startWater();
    this.scheduler = setInterval(() => this.schedule(), 400);
  }

  startWater() {
    if (!this.ctx) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    filter.Q.value = 0.4;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.028;
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.014;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);
    src.start();
    lfo.start();
  }

  schedule() {
    if (!this.ctx || this.paused) return;
    const now = this.ctx.currentTime;
    if (now >= this.nextChordAt) {
      this.playChord(now);
      this.nextChordAt = now + 10.5 + Math.random() * 3.5;
    }
    if (now - this.lastSparkle > 9 + Math.random() * 5) {
      this.lastSparkle = now;
      if (Math.random() > 0.35) this.sparkle(now + Math.random() * 0.4);
    }
  }

  playChord(at) {
    const chord = CHORDS[this.chordIndex % CHORDS.length];
    this.chordIndex += 1;
    const duration = 12;
    for (let i = 0; i < chord.length; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      osc.type = i === 0 ? 'sine' : i % 2 ? 'triangle' : 'sine';
      osc.frequency.value = chord[i];
      osc.detune.value = (Math.random() - 0.5) * 6;
      filter.type = 'lowpass';
      filter.frequency.value = 900 + i * 120;
      const level = i === 0 ? 0.055 : 0.028;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(level, at + 3.2);
      gain.gain.setValueAtTime(level, at + duration - 4);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);
      osc.start(at);
      osc.stop(at + duration + 0.1);
    }
  }

  sparkle(at) {
    const freq = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.016, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.6);
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(at);
    osc.stop(at + 1.7);
  }

  tone({ freq, to, type = 'sine', duration = 0.2, gain = 0.12, at = 0, filter = 0 }) {
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime + at;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (to && to !== freq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + duration);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), now + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    let tail = osc;
    if (filter) {
      const f = this.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = filter;
      osc.connect(f);
      tail = f;
    }
    tail.connect(env);
    env.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  noise({ duration = 0.3, gain = 0.1, at = 0, freq = 900, q = 1, type = 'bandpass', sweepTo = 0 }) {
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime + at;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(freq, now);
    filter.Q.value = q;
    if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, now + duration);
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(gain, now + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    src.connect(filter);
    filter.connect(env);
    env.connect(this.sfxGain);
    src.start(now);
    src.stop(now + duration + 0.02);
  }

  play(name) {
    if (!this.ctx || !this.soundEnabled || this.paused) return;
    switch (name) {
      case 'ui':
        this.tone({ freq: 740, to: 880, type: 'sine', duration: 0.07, gain: 0.045 });
        break;
      case 'uiBack':
        this.tone({ freq: 520, to: 420, type: 'sine', duration: 0.08, gain: 0.04 });
        break;
      case 'cast':
        this.noise({ duration: 0.38, gain: 0.07, freq: 300, sweepTo: 2400, q: 0.8 });
        this.tone({ freq: 220, to: 120, type: 'triangle', duration: 0.22, gain: 0.04, at: 0.04 });
        break;
      case 'splash':
        this.noise({ duration: 0.34, gain: 0.1, freq: 1400, sweepTo: 280, q: 0.7, type: 'lowpass' });
        this.tone({ freq: 420, to: 160, type: 'sine', duration: 0.2, gain: 0.06, at: 0.02 });
        break;
      case 'bite':
        this.tone({ freq: 880, type: 'triangle', duration: 0.12, gain: 0.11 });
        this.tone({ freq: 1174.66, type: 'triangle', duration: 0.16, gain: 0.09, at: 0.09 });
        this.noise({ duration: 0.18, gain: 0.05, freq: 900, q: 1.5, at: 0.02 });
        break;
      case 'hook':
        this.tone({ freq: 392, to: 784, type: 'triangle', duration: 0.18, gain: 0.1 });
        this.tone({ freq: 587.33, type: 'sine', duration: 0.26, gain: 0.06, at: 0.08 });
        break;
      case 'tick':
        if (performance.now() - this.lastTick < 90) return;
        this.lastTick = performance.now();
        this.tone({ freq: 1600 + Math.random() * 300, type: 'square', duration: 0.03, gain: 0.018, filter: 3200 });
        break;
      case 'struggle':
        this.noise({ duration: 0.22, gain: 0.045, freq: 700, sweepTo: 1500, q: 1.2 });
        this.tone({ freq: 196, to: 147, type: 'triangle', duration: 0.22, gain: 0.035 });
        break;
      case 'perfect':
        [1046.5, 1318.5, 1568].forEach((f, i) => {
          this.tone({ freq: f, type: 'sine', duration: 0.5, gain: 0.075, at: i * 0.08 });
        });
        break;
      case 'catch':
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          this.tone({ freq: f, type: 'triangle', duration: 0.6, gain: 0.055, at: i * 0.07 });
        });
        this.noise({ duration: 0.3, gain: 0.035, freq: 2200, q: 0.7, type: 'highpass' });
        break;
      case 'fail':
        this.tone({ freq: 330, to: 247, type: 'triangle', duration: 0.3, gain: 0.07 });
        this.tone({ freq: 247, to: 185, type: 'sine', duration: 0.45, gain: 0.05, at: 0.18 });
        break;
      case 'snap':
        this.noise({ duration: 0.12, gain: 0.14, freq: 2400, q: 0.8, type: 'highpass' });
        this.tone({ freq: 180, to: 90, type: 'square', duration: 0.16, gain: 0.05 });
        break;
      case 'level':
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
          this.tone({ freq: f, type: 'sine', duration: 0.7, gain: 0.06, at: i * 0.09 });
        });
        break;
      case 'guardian':
        this.tone({ freq: 98, to: 73.42, type: 'sine', duration: 2.4, gain: 0.12, filter: 400 });
        this.tone({ freq: 196, type: 'triangle', duration: 2.0, gain: 0.05, at: 0.1 });
        [1318.5, 1568, 2093].forEach((f, i) => {
          this.tone({ freq: f, type: 'sine', duration: 1.8, gain: 0.024, at: 0.4 + i * 0.13 });
        });
        break;
      case 'reward':
        [659.25, 783.99, 1046.5].forEach((f, i) => {
          this.tone({ freq: f, type: 'triangle', duration: 0.35, gain: 0.05, at: i * 0.06 });
        });
        break;
      case 'ad':
        this.tone({ freq: 440, type: 'sine', duration: 0.2, gain: 0.04 });
        break;
      default:
        break;
    }
  }

  dispose() {
    if (this.scheduler) clearInterval(this.scheduler);
    this.scheduler = null;
    if (this.ctx) this.ctx.close().catch(() => {});
    this.ctx = null;
    this.unlocked = false;
    this.ambientStarted = false;
  }
}

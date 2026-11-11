/* ==========================================================================
   Сияние рифа / Reef Glow — звук без внешних файлов.
   Музыка и эффекты синтезируются через WebAudio. Запуск только после
   первого касания (требование браузеров и Яндекс Игр).
   ========================================================================== */
(function (root) {
  'use strict';

  var Audio = {
    ctx: null,
    master: null,
    musicGain: null,
    sfxGain: null,
    reverb: null,
    reverbSend: null,
    unlocked: false,
    musicOn: true,
    sfxOn: true,
    mood: 'menu',
    _timer: null,
    _nextTime: 0,
    _step: 0,
    _paused: false,
    _started: false,

    init: function (settings) {
      if (settings) {
        this.musicOn = settings.music !== false;
        this.sfxOn = settings.sfx !== false;
      }
      if (this.ctx) return this;
      try {
        var Ctx = root.AudioContext || root.webkitAudioContext;
        if (!Ctx) return this;
        this.ctx = new Ctx();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.9;
        this.master.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = this.musicOn ? 0.2 : 0;
        this.musicGain.connect(this.master);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.sfxOn ? 0.38 : 0;
        this.sfxGain.connect(this.master);

        this.reverb = this.ctx.createConvolver();
        this.reverb.buffer = this._impulse(1.9, 2.6);
        this.reverbSend = this.ctx.createGain();
        this.reverbSend.gain.value = 0.35;
        this.reverbSend.connect(this.reverb);
        this.reverb.connect(this.master);
      } catch (e) {
        this.ctx = null;
      }
      return this;
    },

    _impulse: function (seconds, decay) {
      var rate = this.ctx.sampleRate;
      var length = Math.floor(rate * seconds);
      var buffer = this.ctx.createBuffer(2, length, rate);
      for (var ch = 0; ch < 2; ch++) {
        var data = buffer.getChannelData(ch);
        for (var i = 0; i < length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
        }
      }
      return buffer;
    },

    unlock: function () {
      var self = this;
      if (!self.ctx) self.init();
      if (!self.ctx) return;
      if (self.ctx.state === 'suspended') self.ctx.resume().catch(function () {});
      if (!self.unlocked) {
        self.unlocked = true;
        self._paused = false;
        if (self.musicOn) self.startMusic(self.mood);
      }
    },

    setSettings: function (settings) {
      this.musicOn = settings.music !== false;
      this.sfxOn = settings.sfx !== false;
      if (this.ctx) {
        this.musicGain.gain.setTargetAtTime(this.musicOn ? 0.2 : 0, this.ctx.currentTime, 0.08);
        this.sfxGain.gain.setTargetAtTime(this.sfxOn ? 0.38 : 0, this.ctx.currentTime, 0.05);
      }
      if (this.musicOn) this.startMusic(this.mood);
      else this.stopMusic();
    },

    setMood: function (mood) {
      if (this.mood === mood) return;
      this.mood = mood;
      if (this.ctx && this.musicOn && this.unlocked && !this._paused) {
        this.stopMusic();
        this.startMusic(mood);
      }
    },

    startMusic: function (mood) {
      var self = this;
      if (!self.ctx || !self.musicOn || self._paused) return;
      self.mood = mood || self.mood;
      if (self._timer) return;
      self._nextTime = self.ctx.currentTime + 0.15;
      self._step = 0;
      self._started = true;
      self._timer = setInterval(function () { self._schedule(); }, 180);
      self._schedule();
    },

    stopMusic: function () {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
      this._started = false;
    },

    _schedule: function () {
      var self = this;
      if (!self.ctx || !self.musicOn || self._paused) return;
      var stepDur = self.mood === 'game' ? 0.42 : 0.52;
      var horizon = self.ctx.currentTime + 1.2;
      while (self._nextTime < horizon) {
        self._playStep(self._step, self._nextTime);
        self._step++;
        self._nextTime += stepDur;
      }
    },

    _playStep: function (step, time) {
      var self = this;
      // Прогрессия: Dm9 — Bb maj7 — F — Cadd9.
      var chords = [
        [146.83, 174.61, 220.00, 261.63, 329.63],
        [116.54, 146.83, 174.61, 220.00, 293.66],
        [174.61, 220.00, 261.63, 349.23, 440.00],
        [130.81, 196.00, 261.63, 293.66, 392.00]
      ];
      var chordIndex = Math.floor(step / 16) % chords.length;
      var chord = chords[chordIndex];
      var barStep = step % 16;
      if (barStep === 0) {
        for (var i = 0; i < chord.length; i++) {
          self._pad(chord[i], time, 8.2, 0.055);
        }
      }
      // Мягкая басовая нота в начале такта.
      if (barStep === 0) self._tone(chord[0] / 2, 'sine', 1.8, 0.1, time, { attack: 0.08, release: 1.4 });
      // Арпеджио.
      if (barStep % 2 === 0) {
        var notes = [0, 2, 4, 1, 3, 2, 4, 0];
        var noteIndex = notes[(barStep / 2) % notes.length];
        var freq = chord[noteIndex] * 2;
        self._pluck(freq, time, 0.28, 0.05 + (barStep === 0 ? 0.015 : 0));
      }
      // Редкий высокий отклик.
      if (barStep === 7 && Math.random() < 0.5) {
        self._pluck(chord[4] * 4, time + 0.1, 0.5, 0.018);
      }
    },

    _pad: function (freq, time, dur, gain) {
      if (!this.ctx) return;
      var ctx = this.ctx;
      var osc = ctx.createOscillator();
      var osc2 = ctx.createOscillator();
      var filter = ctx.createBiquadFilter();
      var env = ctx.createGain();
      osc.type = 'triangle';
      osc2.type = 'sine';
      osc.frequency.value = freq;
      osc2.frequency.value = freq * 1.005;
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      filter.Q.value = 0.4;
      env.gain.setValueAtTime(0, time);
      env.gain.linearRampToValueAtTime(gain, time + 1.4);
      env.gain.setValueAtTime(gain, time + dur - 1.6);
      env.gain.linearRampToValueAtTime(0, time + dur);
      osc.connect(filter); osc2.connect(filter);
      filter.connect(env);
      env.connect(this.musicGain);
      env.connect(this.reverbSend);
      osc.start(time); osc2.start(time);
      osc.stop(time + dur + 0.1); osc2.stop(time + dur + 0.1);
    },

    _pluck: function (freq, time, dur, gain) {
      if (!this.ctx) return;
      var ctx = this.ctx;
      var osc = ctx.createOscillator();
      var env = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 2400;
      env.gain.setValueAtTime(0, time);
      env.gain.linearRampToValueAtTime(gain, time + 0.012);
      env.gain.exponentialRampToValueAtTime(0.0001, time + dur);
      osc.connect(filter); filter.connect(env);
      env.connect(this.musicGain);
      env.connect(this.reverbSend);
      osc.start(time); osc.stop(time + dur + 0.05);
    },

    _tone: function (freq, type, dur, gain, time, opts) {
      if (!this.ctx) return;
      opts = opts || {};
      var ctx = this.ctx;
      var t = time === undefined ? ctx.currentTime : time;
      var osc = ctx.createOscillator();
      var env = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t);
      if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.slideTo), t + dur);
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(gain, t + (opts.attack || 0.01));
      env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(env);
      env.connect(this.sfxGain);
      if (opts.reverb !== false) env.connect(this.reverbSend);
      osc.start(t); osc.stop(t + dur + 0.05);
    },

    _noise: function (dur, gain, time, filterFreq) {
      if (!this.ctx) return;
      var ctx = this.ctx;
      var t = time === undefined ? ctx.currentTime : time;
      var length = Math.floor(ctx.sampleRate * dur);
      var buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
      var src = ctx.createBufferSource();
      src.buffer = buffer;
      var filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(filterFreq || 1200, t);
      filter.Q.value = 0.9;
      var env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(gain, t + 0.01);
      env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(filter); filter.connect(env); env.connect(this.sfxGain);
      src.start(t);
    },

    sfx: function (name, options) {
      var self = this;
      if (!self.ctx || !self.sfxOn || self._paused) return;
      options = options || {};
      var t = self.ctx.currentTime;
      try {
        switch (name) {
          case 'click':
            self._tone(640, 'sine', 0.06, 0.12, t, { slideTo: 840, reverb: false });
            break;
          case 'swap':
            self._tone(320, 'sine', 0.09, 0.12, t, { slideTo: 460, reverb: false });
            break;
          case 'invalid':
            self._tone(170, 'sawtooth', 0.14, 0.08, t, { slideTo: 110, reverb: false });
            break;
          case 'match': {
            var cascade = Math.min(6, options.cascade || 1);
            var scale = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66];
            var f = scale[(cascade - 1) % scale.length];
            self._pluck(f, t, 0.32, 0.16);
            self._pluck(f * 1.5, t + 0.02, 0.24, 0.06);
            break;
          }
          case 'special':
            [0, 0.07, 0.14].forEach(function (d, i) {
              self._pluck(587.33 * Math.pow(1.26, i), t + d, 0.3, 0.12);
            });
            self._noise(0.25, 0.05, t, 2600);
            break;
          case 'wave':
            self._noise(0.7, 0.1, t, 900);
            self._tone(110, 'sine', 0.8, 0.1, t, { slideTo: 55, attack: 0.05 });
            [0, 0.1, 0.2, 0.3].forEach(function (d, i) {
              self._pluck(880 * Math.pow(1.12, i), t + d, 0.25, 0.07);
            });
            break;
          case 'hammer':
            self._noise(0.12, 0.18, t, 480);
            self._tone(120, 'sine', 0.16, 0.12, t, { slideTo: 70 });
            break;
          case 'shuffle':
            self._noise(0.35, 0.08, t, 1800);
            break;
          case 'coin':
            self._tone(1046.5, 'sine', 0.12, 0.12, t, { reverb: false });
            self._tone(1568, 'sine', 0.18, 0.1, t + 0.07, { reverb: false });
            break;
          case 'star':
            [0, 0.08, 0.16].forEach(function (d, i) {
              self._tone([1046.5, 1318.5, 1568][i], 'triangle', 0.35, 0.09, t + d);
            });
            break;
          case 'win':
            [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) {
              self._pluck(f, t + i * 0.12, 0.55, 0.14);
            });
            self._pad(261.63, t, 2.5, 0.04);
            break;
          case 'lose':
            [392, 349.23, 293.66, 220].forEach(function (f, i) {
              self._pluck(f, t + i * 0.16, 0.55, 0.11);
            });
            break;
          case 'daily':
            [659.25, 783.99, 987.77, 1318.5].forEach(function (f, i) {
              self._pluck(f, t + i * 0.1, 0.5, 0.1);
            });
            break;
          default:
            break;
        }
      } catch (e) { /* звук не должен ломать игру */ }
    },

    pause: function () {
      this._paused = true;
      this.stopMusic();
      if (this.ctx && this.ctx.state === 'running') {
        try { this.ctx.suspend(); } catch (e) { /* ignore */ }
      }
    },

    resume: function () {
      this._paused = false;
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(function () {});
      }
      if (this.unlocked && this.musicOn) this.startMusic(this.mood);
    },

    isPaused: function () { return this._paused; }
  };

  root.ReefAudio = Audio;
})(typeof globalThis !== 'undefined' ? globalThis : this);

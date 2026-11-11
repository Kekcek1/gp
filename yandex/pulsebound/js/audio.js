/* Pulsebound — procedural WebAudio music and sound effects. */
(function (global) {
    'use strict';

    var Audio = {
        ctx: null,
        master: null,
        musicBus: null,
        sfxBus: null,
        musicFilter: null,
        delay: null,
        delayGain: null,
        soundOn: true,
        musicOn: true,
        started: false,
        scene: 'menu',
        _scheduler: null,
        _nextNote: 0,
        _step: 0,
        _noise: null,
        _unlocked: false,
        _intensity: 0,

        init: function (sound, music) {
            this.soundOn = sound !== false;
            this.musicOn = music !== false;
            var self = this;
            if (typeof document === 'undefined') return;
            var unlock = function () {
                self.unlock();
            };
            document.addEventListener('pointerdown', unlock, { once: true, passive: true });
            document.addEventListener('touchstart', unlock, { once: true, passive: true });
            document.addEventListener('keydown', unlock, { once: true });
        },

        ensure: function () {
            if (this.ctx) return this.ctx;
            var AC = global.AudioContext || global.webkitAudioContext;
            if (!AC) return null;
            try {
                this.ctx = new AC();
            } catch (e) {
                return null;
            }
            var ctx = this.ctx;
            this.master = ctx.createGain();
            this.master.gain.value = 0.6;
            this.master.connect(ctx.destination);

            this.musicFilter = ctx.createBiquadFilter();
            this.musicFilter.type = 'lowpass';
            this.musicFilter.frequency.value = 1500;
            this.musicFilter.Q.value = 0.6;

            this.musicBus = ctx.createGain();
            this.musicBus.gain.value = this.musicOn ? 0.22 : 0;
            this.musicBus.connect(this.musicFilter);
            this.musicFilter.connect(this.master);

            this.sfxBus = ctx.createGain();
            this.sfxBus.gain.value = this.soundOn ? 0.42 : 0;
            this.sfxBus.connect(this.master);

            this.delay = ctx.createDelay(1.2);
            this.delay.delayTime.value = 0.31;
            this.delayGain = ctx.createGain();
            this.delayGain.gain.value = 0.2;
            this.delay.connect(this.delayGain);
            this.delayGain.connect(this.musicBus);
            this.delayGain.connect(this.delay);

            this._noise = this.makeNoise(1.2);
            return ctx;
        },

        makeNoise: function (seconds) {
            var ctx = this.ctx;
            var len = Math.floor(ctx.sampleRate * seconds);
            var buffer = ctx.createBuffer(1, len, ctx.sampleRate);
            var data = buffer.getChannelData(0);
            for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
            return buffer;
        },

        unlock: function () {
            if (this._unlocked) return;
            var ctx = this.ensure();
            if (!ctx) return;
            this._unlocked = true;
            if (ctx.state === 'suspended') {
                var p = ctx.resume();
                if (p && p.catch) p.catch(function () {});
            }
            this.started = true;
            this.startMusic();
        },

        setSound: function (on) {
            this.soundOn = !!on;
            if (this.sfxBus && this.ctx) {
                this.sfxBus.gain.setTargetAtTime(on ? 0.42 : 0, this.ctx.currentTime, 0.04);
            }
        },

        setMusic: function (on) {
            this.musicOn = !!on;
            if (this.musicBus && this.ctx) {
                this.musicBus.gain.setTargetAtTime(on ? 0.22 : 0, this.ctx.currentTime, 0.12);
            }
            if (on) this.startMusic();
            else this.stopMusic();
        },

        setScene: function (scene) {
            this.scene = scene || 'menu';
            if (!this.ctx) return;
            var now = this.ctx.currentTime;
            var freq = 1500;
            var volume = 0.22;
            if (scene === 'game') { freq = 2100; volume = 0.24; }
            else if (scene === 'overdrive') { freq = 3600; volume = 0.28; }
            else if (scene === 'over') { freq = 650; volume = 0.16; }
            else if (scene === 'paused') { freq = 900; volume = 0.14; }
            this.musicFilter.frequency.setTargetAtTime(freq, now, 0.5);
            this.musicBus.gain.setTargetAtTime(this.musicOn ? volume : 0, now, 0.35);
        },

        // ------------------------------------------------------------ music engine

        chords: [
            [110.00, 164.81, 220.00, 261.63], // A minor
            [87.31, 130.81, 174.61, 220.00],  // F major
            [130.81, 196.00, 261.63, 329.63], // C major
            [98.00, 146.83, 196.00, 246.94]   // G major
        ],

        startMusic: function () {
            if (!this.ctx || !this.musicOn || this._scheduler) return;
            if (this.ctx.state !== 'running') return;
            var self = this;
            this._nextNote = this.ctx.currentTime + 0.12;
            this._step = 0;
            this._scheduler = setInterval(function () { self.schedule(); }, 80);
        },

        stopMusic: function () {
            if (this._scheduler) {
                clearInterval(this._scheduler);
                this._scheduler = null;
            }
        },

        schedule: function () {
            if (!this.ctx || !this.musicOn) return;
            if (this.ctx.state !== 'running') return;
            var ahead = 0.45;
            while (this._nextNote < this.ctx.currentTime + ahead) {
                this.playStep(this._step, this._nextNote);
                this._nextNote += 0.357; // 84 BPM eighth notes
                this._step = (this._step + 1) % 64;
            }
        },

        playStep: function (step, time) {
            var ctx = this.ctx;
            var bar = Math.floor(step / 8) % 4;
            var chord = this.chords[bar];
            // Pad at the start of every second bar.
            if (step % 16 === 0) {
                for (var i = 0; i < chord.length; i++) {
                    this.pad(chord[i], time, 3.6, 0.035);
                }
            }
            // Gentle sub bass on beats 1 and 3.
            if (step % 8 === 0 || step % 8 === 4) {
                this.tone(chord[0] / 2, 0.7, 'sine', 0.055, time, null, this.musicBus, 200);
            }
            // Arpeggio on selected eighths.
            var arpPattern = [0, 2, 1, 3, 2, 1, 3, 1];
            if (step % 2 === 0) {
                var note = chord[arpPattern[(step / 2) % 8]] * 2;
                this.pluck(note, time, 0.5, 0.035);
            }
            // Tiny tick.
            if (step % 4 === 2) {
                this.tick(time, 0.012);
            }
            // Overdrive shimmer.
            if (this.scene === 'overdrive' && step % 2 === 1) {
                var high = chord[(step + 1) % chord.length] * 4;
                this.pluck(high, time, 0.3, 0.02);
            }
        },

        pad: function (freq, time, dur, gain) {
            var ctx = this.ctx;
            var osc = ctx.createOscillator();
            var osc2 = ctx.createOscillator();
            var g = ctx.createGain();
            var filter = ctx.createBiquadFilter();
            osc.type = 'sawtooth';
            osc2.type = 'sawtooth';
            osc.frequency.value = freq;
            osc2.frequency.value = freq * 1.006;
            filter.type = 'lowpass';
            filter.frequency.value = 820;
            filter.Q.value = 0.4;
            g.gain.setValueAtTime(0.0001, time);
            g.gain.exponentialRampToValueAtTime(gain, time + 1.1);
            g.gain.setValueAtTime(gain, time + dur - 1.3);
            g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
            osc.connect(filter);
            osc2.connect(filter);
            filter.connect(g);
            g.connect(this.musicBus);
            osc.start(time);
            osc2.start(time);
            osc.stop(time + dur + 0.1);
            osc2.stop(time + dur + 0.1);
        },

        pluck: function (freq, time, dur, gain) {
            var ctx = this.ctx;
            var osc = ctx.createOscillator();
            var g = ctx.createGain();
            var filter = ctx.createBiquadFilter();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            filter.type = 'lowpass';
            filter.frequency.value = 2600;
            g.gain.setValueAtTime(0.0001, time);
            g.gain.exponentialRampToValueAtTime(gain, time + 0.012);
            g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
            osc.connect(filter);
            filter.connect(g);
            g.connect(this.musicBus);
            g.connect(this.delay);
            osc.start(time);
            osc.stop(time + dur + 0.05);
        },

        tick: function (time, gain) {
            var ctx = this.ctx;
            var src = ctx.createBufferSource();
            var filter = ctx.createBiquadFilter();
            var g = ctx.createGain();
            src.buffer = this._noise;
            filter.type = 'highpass';
            filter.frequency.value = 7200;
            g.gain.setValueAtTime(gain, time);
            g.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);
            src.connect(filter);
            filter.connect(g);
            g.connect(this.musicBus);
            src.start(time);
            src.stop(time + 0.06);
        },

        // -------------------------------------------------------------- SFX helpers

        tone: function (freq, dur, type, gain, when, slideTo, destination, filterFreq) {
            if (!this.ctx) return;
            var ctx = this.ctx;
            var t = when === undefined || when === null ? ctx.currentTime : when;
            var osc = ctx.createOscillator();
            var g = ctx.createGain();
            var dest = destination || this.sfxBus;
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(Math.max(20, freq), t);
            if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
            var node = osc;
            if (filterFreq) {
                var f = ctx.createBiquadFilter();
                f.type = 'lowpass';
                f.frequency.value = filterFreq;
                osc.connect(f);
                node = f;
            }
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + Math.min(0.015, dur * 0.2));
            g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
            node.connect(g);
            g.connect(dest);
            osc.start(t);
            osc.stop(t + dur + 0.03);
        },

        noiseBurst: function (dur, gain, type, freq, when, q) {
            if (!this.ctx) return;
            var ctx = this.ctx;
            var t = when === undefined || when === null ? ctx.currentTime : when;
            var src = ctx.createBufferSource();
            var filter = ctx.createBiquadFilter();
            var g = ctx.createGain();
            src.buffer = this._noise;
            filter.type = type || 'bandpass';
            filter.frequency.setValueAtTime(freq || 800, t);
            filter.Q.value = q || 0.8;
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t + 0.008);
            g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
            src.connect(filter);
            filter.connect(g);
            g.connect(this.sfxBus);
            src.start(t);
            src.stop(t + dur + 0.02);
        },

        // ---------------------------------------------------------------- SFX API

        click: function () {
            if (!this.ctx || !this.soundOn) return;
            this.tone(720, 0.05, 'sine', 0.06, null, 920);
        },

        back: function () {
            if (!this.ctx || !this.soundOn) return;
            this.tone(420, 0.06, 'sine', 0.045, null, 300);
        },

        switchLane: function (dir) {
            if (!this.ctx || !this.soundOn) return;
            var t = this.ctx.currentTime;
            this.noiseBurst(0.13, 0.1, 'bandpass', dir > 0 ? 950 : 620, t, 1.2);
            this.tone(dir > 0 ? 310 : 260, 0.13, 'sine', 0.09, t, dir > 0 ? 640 : 190);
        },

        collect: function (combo) {
            if (!this.ctx || !this.soundOn) return;
            var step = Math.min(18, combo || 0);
            var f = 760 * Math.pow(2, step / 24);
            this.tone(f, 0.09, 'triangle', 0.08, null, f * 1.25);
            this.tone(f * 2, 0.05, 'sine', 0.025, null, f * 2.4);
        },

        shard: function () {
            if (!this.ctx || !this.soundOn) return;
            var t = this.ctx.currentTime;
            [660, 880, 1320].forEach(function (f, i) {
                Audio.tone(f, 0.16, 'triangle', 0.06, t + i * 0.035, f * 1.1);
            });
        },

        overdrive: function () {
            if (!this.ctx || !this.soundOn) return;
            var t = this.ctx.currentTime;
            this.tone(140, 0.75, 'sawtooth', 0.12, t, 900, null, 1800);
            [440, 554, 659, 880].forEach(function (f, i) {
                Audio.tone(f, 0.8, 'sine', 0.05, t + 0.08 + i * 0.04, f);
            });
            this.noiseBurst(0.9, 0.06, 'highpass', 2500, t);
        },

        hit: function () {
            if (!this.ctx || !this.soundOn) return;
            var t = this.ctx.currentTime;
            this.noiseBurst(0.55, 0.2, 'lowpass', 900, t);
            this.tone(130, 0.6, 'sine', 0.22, t, 34);
            this.tone(70, 0.7, 'triangle', 0.16, t, 28);
        },

        revive: function () {
            if (!this.ctx || !this.soundOn) return;
            var t = this.ctx.currentTime;
            [330, 440, 660, 880, 1320].forEach(function (f, i) {
                Audio.tone(f, 0.35, 'sine', 0.05, t + i * 0.06, f * 1.02);
            });
        },

        sector: function () {
            if (!this.ctx || !this.soundOn) return;
            var t = this.ctx.currentTime;
            this.tone(523, 0.5, 'sine', 0.05, t);
            this.tone(784, 0.6, 'sine', 0.035, t + 0.08);
        },

        record: function () {
            if (!this.ctx || !this.soundOn) return;
            var t = this.ctx.currentTime;
            [523, 659, 784, 1046, 1318].forEach(function (f, i) {
                Audio.tone(f, 0.5, 'triangle', 0.06, t + i * 0.085, f);
            });
        },

        buy: function () {
            if (!this.ctx || !this.soundOn) return;
            var t = this.ctx.currentTime;
            this.tone(880, 0.09, 'triangle', 0.06, t);
            this.tone(1320, 0.16, 'triangle', 0.06, t + 0.07);
        },

        claim: function () {
            if (!this.ctx || !this.soundOn) return;
            var t = this.ctx.currentTime;
            [659, 880, 1174].forEach(function (f, i) {
                Audio.tone(f, 0.25, 'sine', 0.055, t + i * 0.06, f);
            });
        },

        error: function () {
            if (!this.ctx || !this.soundOn) return;
            this.tone(170, 0.16, 'square', 0.045, null, 120);
        },

        countdown: function () {
            if (!this.ctx || !this.soundOn) return;
            this.tone(520, 0.09, 'sine', 0.05);
        },

        go: function () {
            if (!this.ctx || !this.soundOn) return;
            this.tone(780, 0.18, 'triangle', 0.07, null, 1200);
        },

        pause: function () {
            this.suspend();
        },

        suspend: function () {
            this.stopMusic();
            if (this.ctx && this.ctx.state === 'running') {
                try { this.ctx.suspend(); } catch (e) { /* ignore */ }
            }
        },

        resume: function () {
            if (!this.ctx) return;
            var self = this;
            var p = this.ctx.resume();
            if (p && p.then) {
                p.then(function () {
                    self._nextNote = self.ctx.currentTime + 0.12;
                    self.startMusic();
                }).catch(function () {});
            } else {
                this._nextNote = this.ctx.currentTime + 0.12;
                this.startMusic();
            }
        },

        applySettings: function (sound, music) {
            this.setSound(sound);
            this.setMusic(music);
        }
    };

    global.PB = global.PB || {};
    global.PB.Audio = Audio;
})(window);

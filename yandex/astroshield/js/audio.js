/* Procedural audio: ambient score and arcade SFX, no external assets. */
(function () {
  "use strict";

  const AG = (window.AG = window.AG || {});
  const TAU = Math.PI * 2;

  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  const CHORDS = [
    { pad: [57, 60, 64, 67], bass: 45 },
    { pad: [53, 57, 60, 64], bass: 41 },
    { pad: [48, 52, 55, 59], bass: 36 },
    { pad: [55, 59, 62, 64], bass: 43 }
  ];

  const Audio = (AG.Audio = {
    ctx: null,
    master: null,
    musicBus: null,
    sfxBus: null,
    reverb: null,
    reverbSend: null,
    compressor: null,
    noiseBuffer: null,
    ready: false,
    sound: true,
    music: true,
    intensity: 0,
    muted: false,
    timer: null,
    nextBar: 0,
    barIndex: 0,
    started: false,
    adMuted: false
  });

  Audio.init = function (opts) {
    if (Audio.ctx) {
      if (Audio.ctx.state === "suspended" && !Audio.muted && !Audio.adMuted) {
        Audio.ctx.resume().catch(function () {});
      }
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    let ctx;
    try { ctx = new Ctx(); } catch (e) { return; }
    Audio.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0.72;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 18;
    comp.ratio.value = 3;
    comp.attack.value = 0.004;
    comp.release.value = 0.22;
    master.connect(comp);
    comp.connect(ctx.destination);
    Audio.master = master;
    Audio.compressor = comp;

    const sfx = ctx.createGain();
    sfx.gain.value = 0.85;
    sfx.connect(master);
    Audio.sfxBus = sfx;

    const music = ctx.createGain();
    music.gain.value = 0;
    music.connect(master);
    Audio.musicBus = music;

    const conv = ctx.createConvolver();
    conv.buffer = makeImpulse(ctx, 2.2, 2.6);
    const wet = ctx.createGain();
    wet.gain.value = 0.32;
    const send = ctx.createGain();
    send.gain.value = 0.55;
    send.connect(conv);
    conv.connect(wet);
    wet.connect(master);
    Audio.reverb = conv;
    Audio.reverbSend = send;

    Audio.noiseBuffer = makeNoise(ctx, 1.2);
    Audio.ready = true;
    Audio.started = true;
    if (opts) {
      if (typeof opts.sound === "boolean") Audio.sound = opts.sound;
      if (typeof opts.music === "boolean") Audio.music = opts.music;
    }
    if (Audio.music && !Audio.muted && !Audio.adMuted) startMusic();
  };

  function makeNoise(ctx, seconds) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function makeImpulse(ctx, seconds, decay) {
    const rate = ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  function startMusic() {
    if (!Audio.ready || Audio.timer || !Audio.music || Audio.muted || Audio.adMuted) return;
    const ctx = Audio.ctx;
    if (ctx.state === "suspended") ctx.resume().catch(function () {});
    Audio.nextBar = ctx.currentTime + 0.12;
    Audio.barIndex = 0;
    Audio.musicBus.gain.cancelScheduledValues(ctx.currentTime);
    Audio.musicBus.gain.setValueAtTime(Audio.musicBus.gain.value, ctx.currentTime);
    Audio.musicBus.gain.linearRampToValueAtTime(Audio.music ? 0.34 : 0, ctx.currentTime + 0.8);
    Audio.timer = window.setInterval(function () { schedule(); }, 100);
    schedule();
  }

  function stopMusic() {
    if (Audio.timer) {
      window.clearInterval(Audio.timer);
      Audio.timer = null;
    }
    if (Audio.ctx && Audio.musicBus) {
      const now = Audio.ctx.currentTime;
      Audio.musicBus.gain.cancelScheduledValues(now);
      Audio.musicBus.gain.setValueAtTime(Audio.musicBus.gain.value, now);
      Audio.musicBus.gain.linearRampToValueAtTime(0, now + 0.22);
    }
  }

  function schedule() {
    if (!Audio.ready || !Audio.music || Audio.muted || Audio.adMuted) return;
    const ctx = Audio.ctx;
    const barDur = 4 * (60 / 84);
    let guard = 0;
    while (Audio.nextBar < ctx.currentTime + 0.35 && guard < 4) {
      scheduleBar(Audio.barIndex, Audio.nextBar);
      Audio.nextBar += barDur;
      Audio.barIndex++;
      guard++;
    }
  }

  function scheduleBar(index, time) {
    const chord = CHORDS[index % CHORDS.length];
    const intensity = Audio.intensity;
    const isGame = intensity > 0;
    const isBoss = intensity > 1;

    chord.pad.forEach(function (m, i) {
      pad(mtof(m), time, 4 * 0.96, 0.021 + (i === 0 ? 0.005 : 0), 1100 + i * 120);
      pad(mtof(m) * 1.0035, time + 0.02, 4 * 0.9, 0.012, 1000);
    });
    pad(mtof(chord.bass + 12), time, 4, 0.016, 500);

    bass(mtof(chord.bass), time, 1.55, isGame ? 0.06 : 0.04);
    bass(mtof(chord.bass), time + 2.05 * 0.5, 1.45, isGame ? 0.045 : 0.03);

    const arpSteps = isGame ? 16 : 8;
    const arpNotes = chord.pad.concat([chord.pad[0] + 12]);
    for (let s = 0; s < arpSteps; s++) {
      const stepDur = (4 / arpSteps);
      if (!isGame && s % 2 === 1) continue;
      const note = arpNotes[(s * 3 + index) % arpNotes.length] + 12;
      const vel = 0.016 + (s % 4 === 0 ? 0.012 : 0);
      pluck(mtof(note), time + s * stepDur, 0.24, vel);
    }

    if (isGame) {
      kick(time + 0.02, 0.07);
      kick(time + 2.02, 0.055);
      for (let s = 0; s < 8; s++) {
        if (s % 2 === 1) hat(time + s * 0.5, isBoss ? 0.018 : 0.011);
      }
      if (isBoss) {
        for (let s = 0; s < 4; s++) bass(mtof(chord.bass + 12), time + s * 1, 0.34, 0.028);
      }
    }

    if (index % 4 === 3) {
      bell(mtof(arpNotes[2] + 24), time + 2.6, 0.07);
    }
  }

  function pad(freq, time, dur, gain, cutoff) {
    const ctx = Audio.ctx;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    osc.type = "sine";
    osc2.type = "triangle";
    osc.frequency.value = freq;
    osc2.frequency.value = freq * 0.501;
    osc.detune.value = -4;
    osc2.detune.value = 6;
    f.type = "lowpass";
    f.frequency.value = cutoff;
    f.Q.value = 0.6;
    g.gain.value = 0;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time + 1.1);
    g.gain.linearRampToValueAtTime(gain * 0.75, time + dur * 0.7);
    g.gain.linearRampToValueAtTime(0, time + dur);
    osc.connect(f);
    osc2.connect(f);
    f.connect(g);
    g.connect(Audio.musicBus);
    g.connect(Audio.reverbSend);
    osc.start(time);
    osc2.start(time);
    osc.stop(time + dur + 0.05);
    osc2.stop(time + dur + 0.05);
  }

  function bass(freq, time, dur, gain) {
    const ctx = Audio.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    osc.type = "triangle";
    osc.frequency.value = freq;
    f.type = "lowpass";
    f.frequency.value = 420;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(f);
    f.connect(g);
    g.connect(Audio.musicBus);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  function pluck(freq, time, dur, gain) {
    const ctx = Audio.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    osc.type = "sine";
    osc.frequency.value = freq;
    f.type = "lowpass";
    f.frequency.value = 2400;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(f);
    f.connect(g);
    g.connect(Audio.musicBus);
    const send = ctx.createGain();
    send.gain.value = 0.5;
    g.connect(send);
    send.connect(Audio.reverbSend);
    osc.start(time);
    osc.stop(time + dur + 0.03);
  }

  function bell(freq, time, gain) {
    const ctx = Audio.ctx;
    [1, 2.01, 3.02].forEach(function (mul, i) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq * mul;
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(gain / (i + 1), time + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 1.8 / (i * 0.5 + 1));
      osc.connect(g);
      g.connect(Audio.musicBus);
      const send = ctx.createGain();
      send.gain.value = 0.7;
      g.connect(send);
      send.connect(Audio.reverbSend);
      osc.start(time);
      osc.stop(time + 2);
    });
  }

  function kick(time, gain) {
    const ctx = Audio.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(44, time + 0.18);
    g.gain.setValueAtTime(gain, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);
    osc.connect(g);
    g.connect(Audio.musicBus);
    osc.start(time);
    osc.stop(time + 0.24);
  }

  function hat(time, gain) {
    const ctx = Audio.ctx;
    const src = ctx.createBufferSource();
    src.buffer = Audio.noiseBuffer;
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    src.connect(f);
    f.connect(g);
    g.connect(Audio.musicBus);
    src.start(time, Math.random() * 0.5, 0.08);
  }

  /* ----------------------------- SFX ------------------------------- */

  function sfxTone(f1, f2, dur, type, gain, when, filterFreq) {
    const ctx = Audio.ctx;
    if (!ctx) return;
    const t = ctx.currentTime + (when || 0);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(f1, t);
    if (f2 && f2 !== f1) osc.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
    let dest = g;
    if (filterFreq) {
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = filterFreq;
      f.Q.value = 0.7;
      f.connect(g);
      dest = f;
    }
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(dest);
    g.connect(Audio.sfxBus);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }

  function sfxNoise(dur, gain, type, freq, q, when) {
    const ctx = Audio.ctx;
    if (!ctx) return;
    const t = ctx.currentTime + (when || 0);
    const src = ctx.createBufferSource();
    src.buffer = Audio.noiseBuffer;
    const f = ctx.createBiquadFilter();
    f.type = type || "bandpass";
    f.frequency.setValueAtTime(freq, t);
    if (type === "bandpass") f.frequency.exponentialRampToValueAtTime(Math.max(80, freq * 0.45), t + dur);
    f.Q.value = q || 1.2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(Audio.sfxBus);
    src.start(t, Math.random() * 0.4, dur + 0.05);
  }

  Audio.play = function (name, opts) {
    if (!Audio.ready || !Audio.sound || Audio.muted || Audio.adMuted) return;
    const o = opts || {};
    switch (name) {
      case "block": {
        const idx = AG.clamp(o.combo || 1, 1, 5);
        const pitch = [520, 580, 650, 740, 830][Math.floor(idx) - 1];
        sfxTone(pitch, pitch * 0.55, 0.16, "triangle", 0.13);
        sfxNoise(0.06, 0.05, "highpass", 2000, 0.8);
        break;
      }
      case "perfect": {
        sfxTone(880, 1320, 0.2, "sine", 0.11);
        sfxTone(1320, 1760, 0.26, "sine", 0.055, 0.03);
        sfxNoise(0.05, 0.025, "highpass", 5200, 0.7);
        break;
      }
      case "crystal": {
        sfxTone(1180, 1760, 0.28, "sine", 0.1);
        sfxTone(1760, 2350, 0.34, "sine", 0.045, 0.04);
        sfxNoise(0.12, 0.025, "highpass", 6000, 0.5);
        break;
      }
      case "repair": {
        sfxTone(523, 784, 0.24, "sine", 0.1);
        sfxTone(659, 988, 0.3, "sine", 0.07, 0.05);
        sfxTone(784, 1175, 0.36, "triangle", 0.045, 0.1);
        break;
      }
      case "shatter": {
        sfxNoise(0.16, 0.055, "highpass", 3200, 0.8);
        sfxTone(700, 300, 0.12, "triangle", 0.045);
        break;
      }
      case "damage": {
        sfxTone(95, 38, 0.62, "sine", 0.34);
        sfxTone(150, 60, 0.3, "sawtooth", 0.05, 0, 420);
        sfxNoise(0.38, 0.14, "lowpass", 900, 0.6);
        break;
      }
      case "overload": {
        sfxTone(240, 54, 0.6, "sawtooth", 0.08, 0, 600);
        sfxNoise(0.3, 0.07, "bandpass", 1200, 0.6);
        break;
      }
      case "wave": {
        sfxNoise(0.6, 0.06, "bandpass", 320, 0.7);
        sfxTone(220, 440, 0.45, "sine", 0.05, 0.05);
        break;
      }
      case "boss": {
        sfxTone(70, 48, 1.2, "sine", 0.22);
        sfxNoise(0.9, 0.08, "lowpass", 500, 0.5);
        sfxTone(180, 120, 0.8, "sawtooth", 0.03, 0, 300);
        break;
      }
      case "bossHit": {
        sfxTone(300, 120, 0.22, "square", 0.07, 0, 900);
        sfxNoise(0.1, 0.05, "bandpass", 1800, 0.9);
        break;
      }
      case "bossDown": {
        sfxTone(90, 30, 1.4, "sine", 0.32);
        sfxNoise(1.2, 0.16, "lowpass", 1200, 0.5);
        [523, 659, 784, 1046].forEach(function (f, i) {
          sfxTone(f, f, 0.5, "sine", 0.05, 0.3 + i * 0.09);
        });
        break;
      }
      case "gameover": {
        sfxTone(440, 220, 0.5, "sine", 0.08, 0);
        sfxTone(349, 174, 0.55, "sine", 0.07, 0.18);
        sfxTone(261, 130, 0.9, "sine", 0.08, 0.38);
        sfxNoise(0.8, 0.05, "lowpass", 600, 0.5, 0.3);
        break;
      }
      case "ui": {
        sfxTone(760, 900, 0.05, "sine", 0.045);
        break;
      }
      case "uiBack": {
        sfxTone(520, 380, 0.07, "sine", 0.04);
        break;
      }
      case "hover": {
        sfxTone(1100, 1180, 0.025, "sine", 0.012);
        break;
      }
      case "reward": {
        [523, 659, 784, 1046].forEach(function (f, i) {
          sfxTone(f, f, 0.4, "sine", 0.065, i * 0.07);
        });
        sfxNoise(0.2, 0.02, "highpass", 7000, 0.5, 0.1);
        break;
      }
      case "count": {
        sfxTone(520, 520, 0.08, "sine", 0.05);
        break;
      }
      case "go": {
        sfxTone(520, 1040, 0.25, "triangle", 0.09);
        sfxNoise(0.2, 0.03, "highpass", 3000, 0.5);
        break;
      }
      case "buy": {
        sfxTone(660, 990, 0.18, "triangle", 0.08);
        sfxTone(990, 1320, 0.22, "sine", 0.05, 0.06);
        break;
      }
      case "error": {
        sfxTone(220, 165, 0.14, "square", 0.045, 0, 1200);
        break;
      }
      default:
        sfxTone(600, 600, 0.05, "sine", 0.03);
    }
  };

  Audio.setSound = function (on) {
    Audio.sound = !!on;
    if (on) Audio.init({ sound: Audio.sound, music: Audio.music });
  };

  Audio.setMusic = function (on) {
    Audio.music = !!on;
    if (!Audio.ready) {
      if (on) Audio.init({ sound: Audio.sound, music: true });
      return;
    }
    if (on) {
      startMusic();
    } else {
      stopMusic();
    }
  };

  Audio.setIntensity = function (n) {
    Audio.intensity = n;
  };

  Audio.muteExternal = function (mute) {
    Audio.adMuted = !!mute;
    if (!Audio.ready) return;
    if (mute) {
      stopMusic();
      if (Audio.ctx && Audio.master) {
        const now = Audio.ctx.currentTime;
        Audio.master.gain.cancelScheduledValues(now);
        Audio.master.gain.setValueAtTime(Audio.master.gain.value, now);
        Audio.master.gain.linearRampToValueAtTime(0, now + 0.08);
      }
      const ctx = Audio.ctx;
      window.setTimeout(function () {
        if (Audio.adMuted && ctx && ctx.state === "running") ctx.suspend().catch(function () {});
      }, 120);
    } else {
      if (Audio.ctx) {
        Audio.ctx.resume().catch(function () {});
        const now = Audio.ctx.currentTime;
        Audio.master.gain.cancelScheduledValues(now);
        Audio.master.gain.setValueAtTime(0, now);
        Audio.master.gain.linearRampToValueAtTime(0.72, now + 0.25);
      }
      if (Audio.music && !Audio.muted) {
        Audio.nextBar = Audio.ctx.currentTime + 0.1;
        startMusic();
      }
    }
  };

  Audio.suspendAll = function () {
    Audio.muteExternal(true);
  };

  Audio.resumeAll = function () {
    if (Audio.adMuted) Audio.muteExternal(false);
  };

  Audio.toggleSound = function () {
    Audio.setSound(!Audio.sound);
    if (Audio.sound) Audio.play("ui");
    return Audio.sound;
  };

  Audio.toggleMusic = function () {
    Audio.setMusic(!Audio.music);
    if (Audio.music) Audio.play("ui");
    return Audio.music;
  };

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) Audio.suspendAll();
  });
})();

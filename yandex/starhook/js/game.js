// Игровой цикл: заброс, поклёвка, вываживание и переходы между экранами.

import {
  GUARDIAN_SIGNS_NEEDED,
  baitEffects,
  chooseFish,
  guardianStatus,
  rollWeight,
  locationById
} from './core.js';
import { BAIT_BY_ID, LOCATION_BY_ID } from './data.js';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rand = (a, b) => a + Math.random() * (b - a);

export class Game {
  constructor({ scene, store, audio, hooks = {} }) {
    this.scene = scene;
    this.store = store;
    this.audio = audio;
    this.hooks = hooks;
    this.mode = 'menu';
    this.frozen = false;
    this.running = false;
    this.lastFrame = 0;
    this.playtimeClock = 0;
    this.charging = null;
    this.casting = null;
    this.waiting = null;
    this.reel = null;
    this.currentFish = null;
    this.castCooldown = 0;
    this.uiTimer = 0;
    this._lastMode = '';
    this._boundKeyDown = (e) => this.onKeyDown(e);
    this._boundKeyUp = (e) => this.onKeyUp(e);
    this._boundCanvasDown = (e) => this.onCanvasDown(e);
    this._boundPointerUp = (e) => this.onPointerUp(e);
    this._bind();
  }

  _bind() {
    window.addEventListener('keydown', this._boundKeyDown, { passive: false });
    window.addEventListener('keyup', this._boundKeyUp);
    window.addEventListener('pointerup', this._boundPointerUp);
    window.addEventListener('pointercancel', this._boundPointerUp);
    window.addEventListener('blur', () => {
      if (this.reel) this.reel.held = false;
    });
    this.scene.canvas.addEventListener('pointerdown', this._boundCanvasDown);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastFrame = 0;
    const loop = (now) => {
      if (!this.running) return;
      const dt = this.lastFrame ? Math.min(0.05, (now - this.lastFrame) / 1000) : 0.016;
      this.lastFrame = now;
      if (!this.frozen) this.update(dt);
      this.scene.render(now);
      if (this.mode !== 'menu' && !this.frozen) {
        this.playtimeClock += dt;
        if (this.playtimeClock >= 1) {
          this.store.addPlayTime(Math.floor(this.playtimeClock));
          this.playtimeClock %= 1;
        }
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // ── Переходы ─────────────────────────────────────────────────────────────

  enterMenu() {
    this.mode = 'menu';
    this.currentFish = null;
    this.reel = null;
    this.charging = null;
    this.casting = null;
    this.waiting = null;
    this.scene.setFishing(null);
    this.scene.setLocation(this.store.state.currentLocation || 'cove');
    this._emitMode();
  }

  startFishing() {
    this.mode = 'idle';
    this.currentFish = null;
    this.scene.setLocation(this.store.state.currentLocation || 'cove');
    this.scene.setFishing({ mode: 'idle' });
    this._emitMode();
  }

  travel(locId) {
    if (!this.store.state.locations.includes(locId)) return false;
    if (this.mode === 'reeling' || this.mode === 'waiting' || this.mode === 'bite' || this.mode === 'charging') {
      this.resetToIdle(false);
    }
    this.store.setLocation(locId);
    this.scene.setLocation(locId);
    this.mode = 'idle';
    this.scene.setFishing({ mode: 'idle' });
    this._emitMode();
    return true;
  }

  resetToIdle(withSound = true) {
    this.mode = 'idle';
    this.reel = null;
    this.currentFish = null;
    this.charging = null;
    this.casting = null;
    this.waiting = null;
    this.scene.setFishing({ mode: 'idle' });
    if (withSound) this.audio.play('uiBack');
    this._emitMode();
  }

  freeze() {
    if (this.frozen) return;
    this.frozen = true;
    if (this.reel) this.reel.held = false;
    if (this.mode === 'charging') {
      this.mode = 'idle';
      this.charging = null;
      this.scene.setFishing({ mode: 'idle' });
      this._emitMode();
    }
  }

  unfreeze() {
    this.frozen = false;
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    this._emitMode();
  }

  _emitMode() {
    if (this._lastMode === this.mode) {
      this.hooks.onMode?.(this.mode, this.getUiState());
      return;
    }
    this._lastMode = this.mode;
    this.hooks.onMode?.(this.mode, this.getUiState());
  }

  getUiState() {
    const status = guardianStatus(this.store.state, this.store.state.currentLocation);
    return {
      mode: this.mode,
      fish: this.currentFish,
      guardian: status,
      zone: this.getCastZone(),
      bait: BAIT_BY_ID[this.store.state.bait],
      location: LOCATION_BY_ID[this.store.state.currentLocation]
    };
  }

  getCastZone() {
    const state = this.store.state;
    const bait = BAIT_BY_ID[state.bait] || null;
    const bonus = (state.upgrades?.lantern - 1 || 0) * 0.015 + (bait?.effects?.zone || 0);
    const start = clamp(0.62 - bonus / 2, 0.42, 0.78);
    const end = clamp(0.88 + bonus / 2, 0.68, 0.96);
    return { start, end };
  }

  // ── Ввод ─────────────────────────────────────────────────────────────────

  onKeyDown(e) {
    if (e.code === 'Space') {
      if (e.repeat) return;
      e.preventDefault();
      this.primaryDown('key');
    }
  }

  onKeyUp(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      this.primaryUp('key');
    }
  }

  onCanvasDown(e) {
    if (this.frozen) return;
    if (e.button !== undefined && e.button !== 0) return;
    if (this.mode === 'waiting' || this.mode === 'bite') {
      e.preventDefault();
      this.primaryDown('scene');
    } else if (this.mode === 'reeling') {
      e.preventDefault();
      this.reel.held = true;
    }
  }

  onPointerUp() {
    if (this.mode === 'reeling' && this.reel) this.reel.held = false;
    if (this.mode === 'charging') this.releaseCharge();
  }

  /** Основное действие: заброс, подсечка или удержание. */
  primaryDown(source = 'ui') {
    if (this.frozen || this.castCooldown > 0) return;
    switch (this.mode) {
      case 'idle':
        this.beginCharge(source);
        break;
      case 'charging':
        this.releaseCharge();
        break;
      case 'waiting':
        this.cancelCast('early');
        break;
      case 'bite':
        this.hookFish();
        break;
      case 'reeling':
        if (this.reel) this.reel.held = true;
        break;
      default:
        break;
    }
  }

  primaryUp() {
    if (this.mode === 'charging') this.releaseCharge();
    if (this.mode === 'reeling' && this.reel) this.reel.held = false;
  }

  beginCharge() {
    if (this.mode !== 'idle' || this.frozen) return;
    const zone = this.getCastZone();
    this.charging = { power: 0, direction: 1, perfect: false, zone };
    this.mode = 'charging';
    this.scene.setFishing({ mode: 'charging', power: 0, perfect: false });
    this.audio.play('ui');
    this.hooks.onEvent?.('cast-start');
    this._emitMode();
    this.hooks.onPower?.({ power: 0, ...zone, perfect: false });
  }

  releaseCharge() {
    if (this.mode !== 'charging' || !this.charging) return;
    const { power, zone } = this.charging;
    const perfect = power >= zone.start && power <= zone.end;
    const distance = 0.36 + clamp(power, 0, 1) * 0.62;
    const state = this.store.state;
    this.store.recordCast(perfect);
    this.currentFish = chooseFish(state, state.currentLocation, {
      perfectCast: perfect,
      rng: Math.random
    });
    this.mode = 'casting';
    this.charging = null;
    this.casting = { t: 0, distance, perfect };
    this.waiting = null;
    this.reel = null;
    this.audio.play('cast');
    this.scene.setFishing({
      mode: 'casting',
      castT: 0,
      distance,
      perfect,
      bobber: this.scene.castPoint(distance)
    });
    const bait = BAIT_BY_ID[state.bait];
    const lantern = state.upgrades.lantern || 1;
    const base = rand(2.2, 5.4);
    const delay = clamp(
      base * (1 - (lantern - 1) * 0.045) * (bait?.effects?.bite || 1) * (perfect ? 0.82 : 1) * (this.currentFish?.guardian ? 0.78 : 1),
      1.3,
      6.4
    );
    this.waiting = { delay, timer: 0, distance, perfect, bobber: this.scene.castPoint(distance) };
    // Точка назначения сохраняется, даже пока летит поплавок.
    this.hooks.onEvent?.(perfect ? 'perfect-cast' : 'cast');
    this._emitMode();
  }

  _landCast() {
    const w = this.waiting;
    if (!w) return;
    this.mode = 'waiting';
    this.scene.splash(w.bobber.x, w.bobber.y, 0.75);
    this.audio.play('splash');
    this.scene.setFishing({
      mode: 'waiting',
      distance: w.distance,
      perfect: w.perfect,
      bobber: w.bobber
    });
    this._emitMode();
    this.hooks.onEvent?.('cast-land');
  }

  _startBite() {
    if (!this.waiting) return;
    this.mode = 'bite';
    this.waiting.biteWindow = 1.55 + (this.store.state.settings.softMode ? 0.35 : 0);
    this.waiting.biteTimer = this.waiting.biteWindow;
    this.scene.splash(this.waiting.bobber.x, this.waiting.bobber.y, 0.45);
    this.audio.play('bite');
    this.scene.setFishing({
      mode: 'bite',
      distance: this.waiting.distance,
      bobber: this.waiting.bobber,
      perfect: this.waiting.perfect
    });
    this.hooks.onBite?.();
    this.hooks.onEvent?.('bite');
    this._emitMode();
  }

  _missBite() {
    if (this.mode !== 'bite') return;
    this.audio.play('fail');
    this.hooks.onMiss?.('miss');
    this.hooks.onEvent?.('miss');
    this.resetToIdle(false);
    this.castCooldown = 0.35;
    this.scene.splash(this.waiting?.bobber?.x || this.scene.castPoint(0.7).x, this.waiting?.bobber?.y || this.scene.castPoint(0.7).y, 0.3);
  }

  cancelCast(reason = 'manual') {
    if (!['waiting', 'bite', 'charging'].includes(this.mode)) return;
    const wasBite = this.mode === 'bite';
    this.audio.play('uiBack');
    this.hooks.onEvent?.(wasBite ? 'miss' : 'cancel');
    this.resetToIdle(false);
    if (reason === 'early') this.hooks.onEarly?.();
  }

  hookFish() {
    if (this.mode !== 'bite' || !this.currentFish) return;
    const state = this.store.state;
    const fish = this.currentFish;
    const line = state.upgrades.line || 1;
    const rod = state.upgrades.rod || 1;
    const soft = state.settings.softMode;
    const aggression = fish.aggression || 1;
    const safeLow = clamp(22 - (line - 1) * 0.5, 16, 30);
    const safeHigh = clamp(76 + (line - 1) * 1.35 - aggression * 2.5, 64, 90);
    const rise = (25 + aggression * 21) * (soft ? 0.68 : 1);
    const fall = 38;
    const rate = (25 + rod * 1.9 - aggression * 3.2) * (soft ? 1.06 : 1);
    this.reel = {
      held: false,
      tension: 38,
      progress: 0,
      safeLow,
      safeHigh,
      rise,
      fall,
      rate,
      elapsed: 0,
      perfectTime: 0,
      struggle: false,
      struggleTimer: rand(1.4, 2.6),
      struggleLeft: 0,
      snapTime: 0,
      perfect: false,
      lastTick: 0
    };
    this.mode = 'reeling';
    this.audio.play('hook');
    this.scene.setFishing({
      mode: 'reeling',
      distance: this.waiting?.distance || 0.7,
      bobber: this.waiting?.bobber || this.scene.castPoint(0.7),
      fish,
      tension: 38,
      progress: 0,
      struggle: false
    });
    this.hooks.onEvent?.('reel-start');
    this._emitMode();
    this._pushReel(true);
  }

  _updateReel(dt) {
    const r = this.reel;
    if (!r) return;
    r.elapsed += dt;

    r.struggleTimer -= dt;
    if (r.struggleTimer <= 0 && r.struggleLeft <= 0) {
      r.struggle = true;
      r.struggleLeft = rand(0.55, 0.95);
      r.struggleTimer = rand(2.0, 3.6);
      this.audio.play('struggle');
      this.hooks.onStruggle?.();
    }
    if (r.struggleLeft > 0) {
      r.struggleLeft -= dt;
      if (r.struggleLeft <= 0) r.struggle = false;
    }

    const wasHeld = r.held;
    if (r.held) {
      r.tension += r.rise * dt * (r.struggle ? 1.85 : 1);
      if (r.tension > 8) {
        let rate = r.rate;
        if (r.tension < r.safeLow) rate *= 0.55;
        if (r.tension > r.safeHigh) rate *= 0.3;
        if (r.struggle) rate *= 0.46;
        r.progress = clamp(r.progress + rate * dt, 0, 100);
      }
      if (r.tension >= r.safeLow && r.tension <= r.safeHigh) r.perfectTime += dt;
      if (r.progress < 100 && Math.random() < dt * 14) this.audio.play('tick');
    } else {
      r.tension -= r.fall * dt;
    }
    r.tension = clamp(r.tension, 0, 100);
    r.perfect = r.elapsed > 1.2 && r.perfectTime / r.elapsed > 0.52;

    if (r.tension >= 99.5) {
      r.snapTime += dt;
      if (r.snapTime > (this.store.state.settings.softMode ? 0.7 : 0.4)) {
        this._failReel('snap');
        return;
      }
    } else {
      r.snapTime = 0;
    }

    this.scene.setFishing({
      mode: 'reeling',
      distance: this.waiting?.distance || 0.7,
      bobber: this.waiting?.bobber || this.scene.castPoint(0.7),
      fish: this.currentFish,
      tension: r.tension,
      progress: r.progress,
      struggle: r.struggle,
      perfect: r.perfect
    });
    this._pushReel(false);
    if (r.progress >= 100) {
      this._finishReel();
    }
    if (wasHeld !== r.held) this._pushReel(true);
  }

  _pushReel(force = false) {
    const r = this.reel;
    if (!r) return;
    this.uiTimer += 0.016;
    if (!force && this.uiTimer < 0.04) return;
    this.uiTimer = 0;
    this.hooks.onReel?.({
      tension: r.tension,
      progress: r.progress,
      safeLow: r.safeLow,
      safeHigh: r.safeHigh,
      struggle: r.struggle,
      perfect: r.perfect,
      held: r.held,
      snap: r.tension > 94,
      fish: this.currentFish,
      guardian: Boolean(this.currentFish?.guardian)
    });
  }

  _finishReel() {
    if (!this.reel || this.mode !== 'reeling') return;
    const r = this.reel;
    const fish = this.currentFish;
    const perfect = r.progress >= 100 && r.perfect;
    this.mode = 'landed';
    this.reel = null;
    this._emitMode();
    this.audio.play(perfect ? 'perfect' : 'catch');
    this.scene.leap(fish);
    this.scene.setFishing(null);
    if (perfect) this.store.recordPerfectReel();
    const summary = this.store.catchFish(fish, {
      perfect,
      perfectRatio: r.elapsed ? r.perfectTime / r.elapsed : 0
    });
    this.hooks.onEvent?.('catch');
    this.hooks.onCatch?.(summary);
  }

  _failReel(reason) {
    if (this.mode !== 'reeling') return;
    this.audio.play(reason === 'snap' ? 'snap' : 'fail');
    this.scene.splash(this.waiting?.bobber?.x || this.scene.castPoint(0.7).x, this.waiting?.bobber?.y || this.scene.castPoint(0.7).y, 0.8);
    this.reel = null;
    this.hooks.onMiss?.(reason);
    this.hooks.onEvent?.('miss');
    this.resetToIdle(false);
    this.castCooldown = 0.7;
  }

  // ── Обновление ───────────────────────────────────────────────────────────

  update(dt) {
    if (this.castCooldown > 0) this.castCooldown = Math.max(0, this.castCooldown - dt);

    if (this.mode === 'charging' && this.charging) {
      const c = this.charging;
      c.power += c.direction * dt * 1.32;
      if (c.power >= 1) {
        c.power = 1;
        c.direction = -1;
      } else if (c.power <= 0) {
        c.power = 0;
        c.direction = 1;
      }
      c.perfect = c.power >= c.zone.start && c.power <= c.zone.end;
      this.scene.setFishing({ mode: 'charging', power: c.power, perfect: c.perfect });
      this.hooks.onPower?.({
        power: c.power,
        zoneStart: c.zone.start,
        zoneEnd: c.zone.end,
        perfect: c.perfect
      });
      return;
    }

    if (this.mode === 'casting' && this.casting) {
      this.casting.t += dt / 0.42;
      this.scene.setFishing({
        mode: 'casting',
        castT: Math.min(1, this.casting.t),
        distance: this.casting.distance,
        bobber: this.waiting?.bobber || this.scene.castPoint(this.casting.distance)
      });
      if (this.casting.t >= 1) {
        this.casting = null;
        this._landCast();
      }
      return;
    }

    if (this.mode === 'waiting' && this.waiting) {
      this.waiting.timer += dt;
      if (this.waiting.timer >= this.waiting.delay) {
        this._startBite();
      }
      return;
    }

    if (this.mode === 'bite' && this.waiting) {
      this.waiting.biteTimer -= dt;
      if (this.waiting.biteTimer <= 0) this._missBite();
      return;
    }

    if (this.mode === 'reeling') {
      this._updateReel(dt);
    }
  }

  // ── Вызывается интерфейсом после закрытия карточки улова ─────────────────

  afterCatch() {
    this.mode = 'idle';
    this.currentFish = null;
    this.reel = null;
    this.waiting = null;
    this.casting = null;
    this.charging = null;
    this.scene.setFishing({ mode: 'idle' });
    this._emitMode();
  }

  get guardianStatus() {
    return guardianStatus(this.store.state, this.store.state.currentLocation);
  }

  get signsRemaining() {
    const status = this.guardianStatus;
    if (!status.active) return null;
    return Math.max(0, GUARDIAN_SIGNS_NEEDED - status.meter);
  }

  get location() {
    return locationById(this.store.state.currentLocation);
  }
}

// Живая сцена: небо, вода, причал, смотритель, поплавок и подводная жизнь.
// Всё нарисовано процедурно на canvas — ни одного внешнего изображения.

import { LOCATION_BY_ID, LOCATIONS, CONSTELLATIONS } from './data.js';
import { hashString, mulberry32 } from './core.js';
import { drawFish } from './fishart.js';
import { tData } from './i18n.js';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

export class Scene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.w = 0;
    this.h = 0;
    this.dpr = 1;
    this.horizon = 0;
    this.pierY = 0;
    this.charX = 0;
    this.charH = 80;
    this.rodTip = { x: 0, y: 0 };
    this.time = 0;
    this.lastFrame = 0;
    this.locId = 'cove';
    this.loc = LOCATION_BY_ID.cove;
    this.guardians = {};
    this.fishing = null;
    this.quality = 'auto';
    this.reducedMotion = false;
    this.stars = [];
    this.fireflies = [];
    this.snow = [];
    this.meteors = [];
    this.splashes = [];
    this.rings = [];
    this.leaps = [];
    this.reeds = [];
    this.mountainLayers = [];
    this.skyGradient = null;
    this.medallionGradient = null;
    this.nextMeteor = 3;
    this.waterRipples = [];
    this.resizeObserver = null;
    this._boundResize = () => this.resize();
    this._init();
  }

  _init() {
    this.resize();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.canvas);
    } else {
      window.addEventListener('resize', this._boundResize);
    }
  }

  get low() {
    if (this.quality === 'low') return true;
    if (this.quality === 'high') return false;
    return this.w < 560 || this.dpr > 2.2;
  }

  setLocation(locId) {
    if (!LOCATION_BY_ID[locId] || locId === this.locId) return;
    this.locId = locId;
    this.loc = LOCATION_BY_ID[locId];
    this._generate();
  }

  setGuardians(map = {}) {
    this.guardians = { ...map };
  }

  setQuality(quality) {
    this.quality = quality || 'auto';
    this.skyGradient = null;
    if (this.w && this.h) this._generate();
  }

  setReducedMotion(value) {
    this.reducedMotion = Boolean(value);
  }

  setFishing(state) {
    this.fishing = state;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width || window.innerWidth));
    const h = Math.max(1, Math.round(rect.height || window.innerHeight));
    this.w = w;
    this.h = h;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.horizon = h * (w < 680 ? 0.45 : 0.54);
    this.pierY = h * (w < 680 ? 0.79 : 0.815);
    this.charX = w * (w < 680 ? 0.17 : 0.185);
    this.charH = clamp(h * 0.155, 56, 152);
    this.skyGradient = null;
    this._layoutRod();
    this._generate();
  }

  _layoutRod() {
    const f = this.fishing;
    const ch = this.charH;
    const mode = f?.mode;
    let tipX = this.charX + ch * 0.72;
    let tipY = this.pierY - ch * 0.96;
    if (mode === 'charging') {
      tipX -= ch * 0.12;
      tipY -= ch * 0.03;
    } else if (mode === 'reeling') {
      tipX += ch * 0.06;
      tipY += ch * 0.03;
    }
    this.rodTip = { x: tipX, y: tipY };
  }

  castPoint(distance = 0.7) {
    const d = clamp(distance, 0.15, 1);
    return {
      x: this.w * (0.42 + 0.37 * d),
      y: this.horizon + this.h * (0.16 - 0.055 * d)
    };
  }

  _generate() {
    const rng = mulberry32(hashString(`scene-${this.locId}-${this.w}x${this.h}`));
    const loc = this.loc;
    const starCount = this.low ? Math.round(loc.starCount * 0.55) : loc.starCount;
    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      const y = rng() * this.horizon * 0.94;
      this.stars.push({
        x: rng() * this.w,
        y,
        r: 0.35 + rng() * (y < this.horizon * 0.5 ? 1.25 : 0.8),
        a: 0.25 + rng() * 0.7,
        phase: rng() * Math.PI * 2,
        speed: 0.3 + rng() * 0.9,
        cross: rng() > 0.93
      });
    }

    // Светлячки у берега.
    this.fireflies = [];
    const ffCount = this.low ? 10 : 22;
    for (let i = 0; i < ffCount; i++) {
      this.fireflies.push({
        x: this.w * (0.02 + rng() * 0.5),
        y: this.horizon + this.h * (0.02 + rng() * 0.3),
        phase: rng() * Math.PI * 2,
        speed: 0.3 + rng() * 0.45,
        r: 0.7 + rng() * 1.7
      });
    }

    this.snow = [];
    if (this.locId === 'frozen' || this.locId === 'crown') {
      const snowCount = this.low ? 26 : 64;
      for (let i = 0; i < snowCount; i++) {
        this.snow.push({
          x: rng() * this.w,
          y: rng() * this.h,
          r: 0.6 + rng() * 1.7,
          vy: 6 + rng() * 16,
          vx: -4 + rng() * 8,
          phase: rng() * Math.PI * 2
        });
      }
    }

    // Камыши и трава на переднем плане.
    this.reeds = [];
    const reedCount = this.low ? 7 : 14;
    for (let i = 0; i < reedCount; i++) {
      const side = rng() > 0.5 ? 0 : 1;
      this.reeds.push({
        x: side ? this.w - rng() * this.w * 0.18 : rng() * this.w * 0.13,
        baseY: this.h * (0.88 + rng() * 0.14),
        h: this.h * (0.08 + rng() * 0.13),
        lean: (side ? -1 : 1) * (0.05 + rng() * 0.2),
        phase: rng() * Math.PI * 2,
        kind: this.locId === 'frozen' ? 'ice' : this.locId === 'abyss' ? 'crystal' : 'reed'
      });
    }

    this.waterRipples = [];
    for (let i = 0; i < (this.low ? 12 : 24); i++) {
      this.waterRipples.push({
        y: this.horizon + this.h * (0.02 + rng() * 0.42),
        x: rng() * this.w,
        len: this.w * (0.03 + rng() * 0.13),
        phase: rng() * Math.PI * 2,
        speed: 0.3 + rng() * 0.8,
        alpha: 0.03 + rng() * 0.09
      });
    }

    this._generateMountains(rng);
    this.skyGradient = null;
    this.waterGradient = null;
    this.vignetteGradient = null;
    this.horizonGlow = null;
    this.celestialHalo = null;
    this.celestialHaloR = 0;
    this._moonCache = null;
    this._moonCacheR = 0;
    this._layoutRod();
  }

  _generateMountains(rng) {
    const loc = this.loc;
    this.mountainLayers = [];
    const layers = [
      { up: 0.02, color: loc.palette.mountain, alpha: 0.45 },
      { up: 0.075, color: loc.palette.mountain, alpha: 0.7 },
      { up: 0.14, color: loc.palette.mountain, alpha: 0.94 }
    ];
    for (let l = 0; l < layers.length; l++) {
      const points = [];
      const count = 9 + l * 3;
      for (let i = 0; i <= count; i++) {
        const x = (i / count) * this.w;
        const base = this.horizon + 2;
        const peak = base - this.h * (layers[l].up + rng() * (0.03 + l * 0.045));
        points.push({ x, y: peak });
      }
      this.mountainLayers.push({ points, color: layers[l].color, alpha: layers[l].alpha });
    }
    // Парящие острова для Бездны.
    this.floatingIslands = [];
    if (this.locId === 'abyss' || this.locId === 'crown') {
      for (let i = 0; i < 3; i++) {
        this.floatingIslands.push({
          x: this.w * (0.55 + i * 0.16),
          y: this.horizon - this.h * (0.02 + rng() * 0.1),
          w: this.w * (0.04 + rng() * 0.06),
          h: this.h * (0.012 + rng() * 0.02),
          phase: rng() * Math.PI * 2
        });
      }
    }
  }

  // ── Эффекты ──────────────────────────────────────────────────────────────

  splash(x, y, strength = 1) {
    const count = Math.round((this.low ? 7 : 14) * strength);
    for (let i = 0; i < count; i++) {
      const a = Math.PI * (1.05 + Math.random() * 0.9);
      const speed = (30 + Math.random() * 100) * strength;
      this.splashes.push({
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed * 1.1,
        life: 0.5 + Math.random() * 0.6,
        maxLife: 0.5 + Math.random() * 0.6,
        r: 1 + Math.random() * 2.4 * strength,
        color: this.loc.palette.glow
      });
    }
    this.rings.push({ x, y, t: 0, dur: 1.6, max: 26 + strength * 30 });
  }

  leap(fish) {
    if (!fish) return;
    const p = this.fishing?.bobber || this.castPoint(0.7);
    this.leaps.push({
      fish,
      x0: p.x,
      y0: p.y + 18,
      x1: this.charX + this.charH * 0.4,
      y1: this.pierY - this.charH * 0.3,
      t: 0,
      dur: 1.5,
      size: clamp(this.h * 0.12, 46, 130)
    });
    this.splash(p.x, p.y, 1.5);
  }

  // ── Рендер ───────────────────────────────────────────────────────────────

  render(now) {
    if (!this.w || !this.h) return;
    const dt = this.lastFrame ? Math.min(0.05, (now - this.lastFrame) / 1000) : 0.016;
    this.lastFrame = now;
    if (!this.reducedMotion) this.time += dt;
    this._layoutRod();
    this._update(dt);
    const ctx = this.ctx;
    ctx.save();
    ctx.clearRect(0, 0, this.w, this.h);
    this._drawSky(ctx);
    this._drawCelestial(ctx);
    this._drawStars(ctx);
    this._drawAurora(ctx);
    this._drawConstellation(ctx);
    this._drawMountains(ctx);
    this._drawWater(ctx);
    this._drawPier(ctx);
    this._drawAngler(ctx);
    this._drawFishing(ctx);
    this._drawLeaps(ctx);
    this._drawReeds(ctx);
    this._drawParticles(ctx);
    this._drawFog(ctx);
    this._drawVignette(ctx);
    ctx.restore();
  }

  _update(dt) {
    if (this.reducedMotion) dt *= 0.2;
    for (const p of this.splashes) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 260 * dt;
      p.life -= dt;
    }
    this.splashes = this.splashes.filter((p) => p.life > 0);
    for (const r of this.rings) r.t += dt;
    this.rings = this.rings.filter((r) => r.t < r.dur);
    for (const l of this.leaps) l.t += dt;
    this.leaps = this.leaps.filter((l) => l.t < l.dur);
    for (const s of this.snow) {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.y > this.h) {
        s.y = -5;
        s.x = Math.random() * this.w;
      }
      if (s.x < 0) s.x = this.w;
      if (s.x > this.w) s.x = 0;
    }
    if (this.locId === 'abyss' || this.locId === 'crown' || this.locId === 'frozen') {
      this.nextMeteor -= dt;
      if (this.nextMeteor <= 0) {
        this.nextMeteor = 7 + Math.random() * 14;
        this.meteors.push({
          x: this.w * (0.2 + Math.random() * 0.7),
          y: this.horizon * (0.08 + Math.random() * 0.3),
          vx: -this.w * (0.12 + Math.random() * 0.1),
          vy: this.h * (0.05 + Math.random() * 0.04),
          life: 1.2,
          maxLife: 1.2
        });
      }
    }
    for (const m of this.meteors) {
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      m.life -= dt;
    }
    this.meteors = this.meteors.filter((m) => m.life > 0);

    // Круги на воде от поплавка.
    if (this.fishing && ['waiting', 'bite'].includes(this.fishing.mode)) {
      this._rippleTimer = (this._rippleTimer || 0) + dt;
      if (this._rippleTimer > 2.2) {
        this._rippleTimer = 0;
        const p = this.fishing.bobber;
        if (p) this.rings.push({ x: p.x, y: p.y + 2, t: 0, dur: 2.6, max: 20 });
      }
    }
  }

  // ── Небо ─────────────────────────────────────────────────────────────────

  _drawSky(ctx) {
    if (!this.skyGradient) {
      const p = this.loc.palette;
      const g = ctx.createLinearGradient(0, 0, 0, this.horizon + this.h * 0.04);
      g.addColorStop(0, p.skyTop);
      g.addColorStop(0.55, p.skyMid);
      g.addColorStop(0.93, p.skyBottom);
      g.addColorStop(1, p.skyBottom);
      this.skyGradient = g;
    }
    ctx.fillStyle = this.skyGradient;
    ctx.fillRect(0, 0, this.w, this.horizon + 3);

    // Мягкое свечение у горизонта.
    const p = this.loc.palette;
    if (!this.horizonGlow) {
      const hg = ctx.createRadialGradient(this.w * 0.58, this.horizon, 2, this.w * 0.58, this.horizon, this.w * 0.55);
      hg.addColorStop(0, `${p.glow}24`);
      hg.addColorStop(0.5, `${p.glow}0c`);
      hg.addColorStop(1, 'transparent');
      this.horizonGlow = hg;
    }
    ctx.fillStyle = this.horizonGlow;
    ctx.fillRect(0, 0, this.w, this.horizon + 2);

    // Млечный путь.
    if (!this.low) {
      ctx.save();
      ctx.translate(this.w * 0.62, this.horizon * 0.3);
      ctx.rotate(-0.45);
      const mw = ctx.createLinearGradient(-this.w * 0.35, 0, this.w * 0.35, 0);
      mw.addColorStop(0, 'transparent');
      mw.addColorStop(0.5, `${p.star}14`);
      mw.addColorStop(1, 'transparent');
      ctx.fillStyle = mw;
      ctx.fillRect(-this.w * 0.4, -this.h * 0.1, this.w * 0.8, this.h * 0.2);
      ctx.restore();
    }
  }

  _drawStars(ctx) {
    const p = this.loc.palette;
    for (const s of this.stars) {
      const tw = 0.55 + 0.45 * Math.sin(this.time * s.speed + s.phase);
      const alpha = s.a * (0.55 + 0.45 * tw);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.star;
      if (s.cross) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.fillRect(-s.r * 2.4, -0.4, s.r * 4.8, 0.8);
        ctx.fillRect(-0.4, -s.r * 2.4, 0.8, s.r * 4.8);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    for (const m of this.meteors) {
      const a = clamp(m.life / m.maxLife, 0, 1);
      ctx.strokeStyle = p.star;
      ctx.globalAlpha = a * 0.7;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 0.32, m.y - m.vy * 0.32);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  _drawCelestial(ctx) {
    const p = this.loc.palette;
    const id = this.locId;
    let x = this.w * 0.79;
    let y = this.horizon * 0.3;
    let r = Math.min(this.w, this.h) * 0.052;
    if (this.w < 680) {
      x = this.w * 0.77;
      y = this.horizon * 0.32;
      r = Math.min(this.w, this.h) * 0.075;
    }
    this.celestial = { x, y, r };

    // Ореол.
    if (this.celestialHaloR !== r || !this.celestialHalo) {
      const glow = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 4.5);
      glow.addColorStop(0, `${p.glow}46`);
      glow.addColorStop(0.35, `${p.glow}18`);
      glow.addColorStop(1, 'transparent');
      this.celestialHalo = glow;
      this.celestialHaloR = r;
    }
    ctx.fillStyle = this.celestialHalo;
    ctx.beginPath();
    ctx.arc(x, y, r * 4.5, 0, Math.PI * 2);
    ctx.fill();

    if (id === 'abyss') {
      // Планета с кольцом.
      const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
      g.addColorStop(0, '#8d7bd6');
      g.addColorStop(0.5, '#4b3d94');
      g.addColorStop(1, '#211a4b');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.35);
      ctx.strokeStyle = `${p.glow}88`;
      ctx.lineWidth = Math.max(1, r * 0.08);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.8, r * 0.42, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = `${p.glow}33`;
      ctx.lineWidth = r * 0.22;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.8, r * 0.42, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (id === 'crown') {
      // Яркая звезда с лучами.
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.5);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.25, p.glow);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `${p.glow}66`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + this.time * 0.03;
        const len = r * (i % 2 ? 2.2 : 3.4);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2);
        ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
        ctx.stroke();
      }
      return;
    }

    if (id === 'cove') {
      // Полумесяц: рисуем на отдельном холсте и вырезаем тень,
      // чтобы фон просвечивал сквозь неё естественно.
      if (!this._moonCache || this._moonCacheR !== r) {
        this._moonCache = this._makeCrescent(r);
        this._moonCacheR = r;
      }
      if (this._moonCache) {
        ctx.drawImage(this._moonCache, x - r * 1.8, y - r * 1.8, r * 3.6, r * 3.6);
      }
      return;
    }

    if (id === 'mist') {
      ctx.globalAlpha = 0.55;
    }
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.55, '#eef4ff');
    g.addColorStop(1, '#b7c8e2');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    // Кратеры.
    ctx.globalAlpha = id === 'mist' ? 0.12 : 0.18;
    ctx.fillStyle = '#7d8aa8';
    const craters = [[-0.3, -0.15, 0.18], [0.2, 0.25, 0.12], [0.1, -0.3, 0.1], [0.35, -0.05, 0.08]];
    for (const [cx, cy, cr] of craters) {
      ctx.beginPath();
      ctx.arc(x + cx * r, y + cy * r, cr * r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  _makeCrescent(r) {
    const size = Math.max(8, Math.ceil(r * 3.6));
    const scale = 2;
    const c = document.createElement('canvas');
    c.width = size * scale;
    c.height = size * scale;
    const g = c.getContext('2d');
    g.scale(scale, scale);
    const cx = size / 2;
    const cy = size / 2;
    const grad = g.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.1, cx, cy, r);
    grad.addColorStop(0, '#fff9e3');
    grad.addColorStop(0.55, '#ffe8b0');
    grad.addColorStop(1, '#d7a35e');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.fill();
    // Мягкая внутренняя тень по краю.
    g.globalCompositeOperation = 'destination-out';
    g.beginPath();
    g.arc(cx + r * 0.44, cy - r * 0.14, r * 0.93, 0, Math.PI * 2);
    g.fill();
    g.globalCompositeOperation = 'source-over';
    return c;
  }

  _drawAurora(ctx) {
    if (this.locId !== 'frozen') return;
    const colors = this.locId === 'frozen'
      ? ['#63ffc9', '#8b7bff', '#5de0ff', '#b6ff8a']
      : ['#ffca7a', '#ff9ad5', '#ffe6a8', '#c7a1ff'];
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const layers = this.low ? 2 : 3;
    const steps = 36;
    for (let i = 0; i < layers; i++) {
      const baseY = this.horizon * (0.13 + i * 0.075);
      const amp = this.horizon * (0.032 + i * 0.01);
      const thickness = this.horizon * (0.075 + i * 0.018);
      const color = colors[i % colors.length];
      const topPoints = [];
      const bottomPoints = [];
      for (let s = 0; s <= steps; s++) {
        const x = (s / steps) * this.w;
        const wave = Math.sin((s / steps) * Math.PI * 2.4 + this.time * 0.18 + i * 1.7) * amp
          + Math.sin((s / steps) * Math.PI * 6.1 - this.time * 0.11 + i) * amp * 0.32;
        const y = baseY + wave;
        topPoints.push({ x, y });
        bottomPoints.push({ x, y: y + thickness * (0.75 + 0.25 * Math.sin((s / steps) * Math.PI * 3.3 + this.time * 0.2)) });
      }
      const grad = ctx.createLinearGradient(0, baseY - amp, 0, baseY + amp + thickness);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.28, `${color}18`);
      grad.addColorStop(0.6, `${color}33`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      topPoints.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      for (let idx = bottomPoints.length - 1; idx >= 0; idx--) {
        const p = bottomPoints[idx];
        ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Вертикальные прожилки внутри полосы.
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      for (let r = 0; r <= 18; r++) {
        const idx = Math.round((r / 18) * steps);
        ctx.beginPath();
        ctx.moveTo(topPoints[idx].x, topPoints[idx].y);
        ctx.lineTo(bottomPoints[idx].x, bottomPoints[idx].y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  }

  _drawConstellation(ctx) {
    const c = CONSTELLATIONS[this.loc.constellation];
    if (!c) return;
    const mobile = this.w < 680;
    const boxW = mobile ? this.w * 0.34 : this.w * 0.22;
    const boxH = mobile ? this.horizon * 0.24 : this.horizon * 0.32;
    const x0 = mobile ? this.w * 0.06 : this.w * 0.08;
    const y0 = mobile ? this.horizon * 0.36 : this.horizon * 0.3;
    const restored = Boolean(this.guardians[this.loc.guardian]);
    const points = c.stars.map(([sx, sy]) => ({ x: x0 + sx * boxW, y: y0 + sy * boxH }));
    const alpha = restored ? 0.95 : 0.4;

    ctx.save();
    ctx.globalAlpha = alpha;
    if (restored) {
      ctx.shadowColor = this.loc.palette.glow;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = `${this.loc.palette.glow}cc`;
      ctx.lineWidth = 1;
      for (const [a, b] of c.lines) {
        ctx.beginPath();
        ctx.moveTo(points[a].x, points[a].y);
        ctx.lineTo(points[b].x, points[b].y);
        ctx.stroke();
      }
    } else {
      ctx.shadowColor = this.loc.palette.glow;
      ctx.shadowBlur = 5;
      ctx.strokeStyle = `${this.loc.palette.glow}77`;
      ctx.lineWidth = 0.7;
      ctx.setLineDash([2, 5]);
      for (const [a, b] of c.lines) {
        ctx.beginPath();
        ctx.moveTo(points[a].x, points[a].y);
        ctx.lineTo(points[b].x, points[b].y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    ctx.shadowBlur = restored ? 16 : 6;
    ctx.fillStyle = restored ? `${this.loc.palette.glow}` : this.loc.palette.star;
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, restored ? 2.1 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = restored ? 0.55 : 0.28;
    ctx.fillStyle = this.loc.palette.star;
    ctx.font = mobile ? '9px Georgia, serif' : '10px Georgia, serif';
    ctx.textAlign = 'right';
    ctx.fillText(tData(c.name).toUpperCase(), x0 + boxW, y0 + boxH + (mobile ? 12 : 16));
    ctx.restore();
  }

  _drawMountains(ctx) {
    for (const layer of this.mountainLayers) {
      ctx.globalAlpha = layer.alpha;
      ctx.fillStyle = layer.color;
      ctx.beginPath();
      ctx.moveTo(0, this.horizon + 4);
      for (const p of layer.points) ctx.lineTo(p.x, p.y);
      ctx.lineTo(this.w, this.horizon + 4);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Парящие острова.
    if (this.floatingIslands?.length) {
      for (const island of this.floatingIslands) {
        const bob = Math.sin(this.time * 0.25 + island.phase) * 2;
        ctx.save();
        ctx.translate(island.x, island.y + bob);
        ctx.fillStyle = this.loc.palette.mountain;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(-island.w, 0);
        ctx.lineTo(-island.w * 0.72, -island.h * 0.75);
        ctx.lineTo(-island.w * 0.35, -island.h * 1.25);
        ctx.lineTo(0, -island.h * 0.85);
        ctx.lineTo(island.w * 0.3, -island.h * 1.35);
        ctx.lineTo(island.w * 0.62, -island.h * 0.7);
        ctx.lineTo(island.w, -island.h * 0.15);
        ctx.lineTo(island.w * 0.5, island.h * 0.55);
        ctx.lineTo(-island.w * 0.45, island.h * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = this.loc.palette.glow;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-island.w * 0.72, -island.h * 0.75);
        ctx.lineTo(-island.w * 0.35, -island.h * 1.25);
        ctx.lineTo(0, -island.h * 0.85);
        ctx.lineTo(island.w * 0.3, -island.h * 1.35);
        ctx.lineTo(island.w * 0.62, -island.h * 0.7);
        ctx.stroke();
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = this.loc.palette.glow;
        ctx.beginPath();
        ctx.moveTo(-island.w * 0.3, island.h * 0.2);
        ctx.lineTo(0, island.h * 1.6);
        ctx.lineTo(island.w * 0.2, island.h * 0.25);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }
  }

  // ── Вода ─────────────────────────────────────────────────────────────────

  _drawWater(ctx) {
    const p = this.loc.palette;
    if (!this.waterGradient) {
      const g = ctx.createLinearGradient(0, this.horizon, 0, this.h);
      g.addColorStop(0, p.waterTop);
      g.addColorStop(0.55, p.waterBottom);
      g.addColorStop(1, '#05070f');
      this.waterGradient = g;
    }
    ctx.fillStyle = this.waterGradient;
    ctx.fillRect(0, this.horizon, this.w, this.h - this.horizon);

    // Дорожка от светила.
    if (this.celestial) {
      const { x, r } = this.celestial;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const glow = ctx.createRadialGradient(x, this.horizon + this.h * 0.05, 2, x, this.horizon + this.h * 0.08, this.w * 0.26);
      glow.addColorStop(0, `${p.glow}26`);
      glow.addColorStop(0.45, `${p.glow}0d`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(x - this.w * 0.3, this.horizon, this.w * 0.6, this.h * 0.32);
      for (let i = 0; i < 22; i++) {
        const t = i / 22;
        const yy = this.horizon + t * this.h * 0.34 + Math.sin(i * 5.7 + this.time * 0.6) * 2.4;
        const base = r * (0.35 + t * 1.45);
        const pieces = 2 + (i % 3);
        for (let pIndex = 0; pIndex < pieces; pIndex++) {
          const segment = base * (0.16 + 0.18 * Math.abs(Math.sin(i * 1.7 + pIndex * 2.3)));
          const offset = (pIndex - (pieces - 1) / 2) * base * 0.55
            + Math.sin(this.time * 0.8 + i * 2.1 + pIndex) * (2 + t * 6);
          const alpha = (0.2 - t * 0.155) * (0.45 + 0.55 * Math.abs(Math.sin(this.time * 1.35 + i * 1.9 + pIndex * 0.7)));
          ctx.globalAlpha = Math.max(0, alpha);
          ctx.fillStyle = p.glow;
          ctx.fillRect(x + offset - segment / 2, yy + pIndex * 0.9, segment, 1 + t * 1.1);
        }
      }
      ctx.restore();
    }

    // Линия горизонта.
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = p.glow;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, this.horizon);
    ctx.lineTo(this.w, this.horizon);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Рябь.
    for (const r of this.waterRipples) {
      const offset = Math.sin(this.time * r.speed + r.phase) * 10;
      ctx.globalAlpha = r.alpha;
      ctx.strokeStyle = p.star;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(r.x + offset, r.y);
      ctx.quadraticCurveTo(r.x + offset + r.len * 0.5, r.y - 1.2, r.x + offset + r.len, r.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Круги от поплавка и всплесков.
    for (const ring of this.rings) {
      const t = ring.t / ring.dur;
      ctx.globalAlpha = (1 - t) * 0.4;
      ctx.strokeStyle = p.glow;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(ring.x, ring.y, 4 + ring.max * t, 1 + ring.max * 0.22 * t, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ── Причал и смотритель ──────────────────────────────────────────────────

  _drawPier(ctx) {
    const p = this.loc.palette;
    const y = this.pierY;
    const deckRight = this.w * (this.w < 680 ? 0.38 : 0.33);
    ctx.fillStyle = '#0b0d16';
    ctx.beginPath();
    ctx.moveTo(-20, y - 12);
    ctx.lineTo(deckRight, y + 4);
    ctx.lineTo(deckRight, y + 26);
    ctx.lineTo(-20, y + 18);
    ctx.closePath();
    ctx.fill();

    // Доски.
    ctx.strokeStyle = '#1b2031';
    ctx.lineWidth = 1;
    for (let i = 0; i < 9; i++) {
      const t = i / 9;
      const x = -20 + t * (deckRight + 20);
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(x, y - 10 + t * 13);
      ctx.lineTo(x, y + 20 + t * 8);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Сваи.
    ctx.fillStyle = '#080a12';
    for (const t of [0.02, 0.12, 0.24, 0.34]) {
      const px = -20 + t * (deckRight + 20);
      const top = y - 10 + t * 13;
      ctx.fillRect(px - 3, top, 6, this.h - top);
    }

    // Фонарь на столбе.
    const lx = this.charX + this.charH * 0.98;
    const ly = this.pierY - this.charH * 0.58;
    ctx.strokeStyle = '#0a0d15';
    ctx.lineWidth = Math.max(2, this.charH * 0.035);
    ctx.beginPath();
    ctx.moveTo(lx, this.pierY + 2);
    ctx.lineTo(lx, ly + this.charH * 0.1);
    ctx.stroke();
    const flicker = 0.85 + 0.15 * Math.sin(this.time * 3.1 + 1.2);
    const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, this.charH * 0.55);
    glow.addColorStop(0, `${p.glow}55`);
    glow.addColorStop(0.4, `${p.glow}18`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(lx, ly, this.charH * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `${p.glow}`;
    ctx.globalAlpha = flicker;
    ctx.beginPath();
    ctx.arc(lx, ly, Math.max(2, this.charH * 0.032), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#0a0d15';
    ctx.lineWidth = 2;
    ctx.strokeRect(lx - this.charH * 0.06, ly - this.charH * 0.09, this.charH * 0.12, this.charH * 0.18);
  }

  _drawAngler(ctx) {
    const p = this.loc.palette;
    const x = this.charX;
    const y = this.pierY + 2;
    const s = this.charH;
    const breathe = Math.sin(this.time * 1.15) * s * 0.006;
    const mode = this.fishing?.mode;
    const lean = mode === 'reeling' ? Math.sin(this.time * 18) * 1.2 : 0;

    ctx.save();
    ctx.translate(x, y + breathe);
    ctx.fillStyle = 'rgba(0,0,0,.32)';
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.23, s * 0.035, 0, 0, Math.PI * 2);
    ctx.fill();

    const body = '#080c16';
    const rim = `${p.glow}33`;

    // Ноги и сапоги.
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(-s * 0.09, -s * 0.1);
    ctx.lineTo(-s * 0.03, -s * 0.1);
    ctx.lineTo(-s * 0.02, 0);
    ctx.lineTo(-s * 0.1, 0);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s * 0.02, -s * 0.1);
    ctx.lineTo(s * 0.08, -s * 0.1);
    ctx.lineTo(s * 0.09, 0);
    ctx.lineTo(s * 0.01, 0);
    ctx.closePath();
    ctx.fill();

    // Пальто.
    ctx.beginPath();
    ctx.moveTo(-s * 0.16, -s * 0.58);
    ctx.quadraticCurveTo(-s * 0.22, -s * 0.3, -s * 0.15, -s * 0.08);
    ctx.lineTo(s * 0.15, -s * 0.08);
    ctx.quadraticCurveTo(s * 0.22, -s * 0.3, s * 0.16, -s * 0.58);
    ctx.quadraticCurveTo(0, -s * 0.68, -s * 0.16, -s * 0.58);
    ctx.fill();
    // Воротник.
    ctx.beginPath();
    ctx.moveTo(-s * 0.16, -s * 0.58);
    ctx.quadraticCurveTo(-s * 0.04, -s * 0.5, 0, -s * 0.42);
    ctx.quadraticCurveTo(s * 0.04, -s * 0.5, s * 0.16, -s * 0.58);
    ctx.quadraticCurveTo(0, -s * 0.66, -s * 0.16, -s * 0.58);
    ctx.fillStyle = '#0d1322';
    ctx.fill();

    // Голова.
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(0, -s * 0.7, s * 0.085, 0, Math.PI * 2);
    ctx.fill();
    // Шляпа.
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.77, s * 0.19, s * 0.032, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-s * 0.085, -s * 0.78);
    ctx.quadraticCurveTo(-s * 0.07, -s * 0.92, 0, -s * 0.93);
    ctx.quadraticCurveTo(s * 0.07, -s * 0.92, s * 0.085, -s * 0.78);
    ctx.closePath();
    ctx.fill();

    // Шарф.
    ctx.strokeStyle = '#242033';
    ctx.lineWidth = s * 0.035;
    ctx.beginPath();
    ctx.moveTo(-s * 0.11, -s * 0.61);
    ctx.quadraticCurveTo(0, -s * 0.56, s * 0.12, -s * 0.6);
    ctx.stroke();

    // Рука к удилищу.
    const handX = s * 0.17 + lean;
    const handY = -s * 0.57;
    ctx.strokeStyle = body;
    ctx.lineWidth = s * 0.055;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(s * 0.1, -s * 0.56);
    ctx.quadraticCurveTo(s * 0.16, -s * 0.6, handX, handY);
    ctx.stroke();

    // Контурный свет.
    ctx.strokeStyle = rim;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-s * 0.16, -s * 0.58);
    ctx.quadraticCurveTo(-s * 0.22, -s * 0.3, -s * 0.15, -s * 0.08);
    ctx.stroke();

    // Удилище.
    const tipLocalX = this.rodTip.x - x;
    const tipLocalY = this.rodTip.y - (y + breathe);
    ctx.strokeStyle = '#3a2a1d';
    ctx.lineWidth = Math.max(1.6, s * 0.018);
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.quadraticCurveTo(
      (handX + tipLocalX) / 2,
      Math.min(handY, tipLocalY) - s * 0.12,
      tipLocalX,
      tipLocalY
    );
    ctx.stroke();
    ctx.strokeStyle = `${p.glow}44`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Катушка.
    ctx.fillStyle = '#181a28';
    ctx.beginPath();
    ctx.arc(handX + s * 0.02, handY + s * 0.03, s * 0.025, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `${p.glow}66`;
    ctx.lineWidth = 0.7;
    ctx.stroke();

    ctx.restore();
  }

  // ── Леска, поплавок и рыба ───────────────────────────────────────────────

  _drawFishing(ctx) {
    const f = this.fishing;
    if (!f || f.mode === 'idle' || f.mode === 'landed' || f.mode === 'menu') return;
    const p = this.loc.palette;
    const tip = this.rodTip;
    const target = this.castPoint(f.distance ?? 0.7);
    const bob = f.bobber || target;

    if (f.mode === 'charging') {
      // Дуга силы заброса.
      const power = clamp(f.power || 0, 0, 1);
      const angle = -Math.PI * 0.78 + power * Math.PI * 0.42;
      const len = this.charH * (0.35 + power * 0.55);
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = power > 0.62 && power < 0.9 ? p.glow : `${p.star}66`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 6]);
      ctx.beginPath();
      ctx.moveTo(tip.x, tip.y);
      ctx.lineTo(tip.x + Math.cos(angle) * len, tip.y + Math.sin(angle) * len);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = p.glow;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, this.charH * 0.06 + power * this.charH * 0.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // Точка поплавка: при забросе интерполируем по параболе.
    let bx = bob.x;
    let by = bob.y;
    if (f.mode === 'casting') {
      const t = clamp(f.castT || 0, 0, 1);
      bx = lerp(tip.x, target.x, t);
      by = lerp(tip.y, target.y, t) - Math.sin(Math.PI * t) * this.h * 0.16;
    } else if (f.mode === 'waiting' || f.mode === 'bite') {
      by += Math.sin(this.time * 2 + 1) * 1.6;
      if (f.mode === 'bite') by += 7;
    } else if (f.mode === 'reeling') {
      const prog = clamp(f.progress || 0, 0, 100) / 100;
      const ret = this.castPoint(lerp(f.distance ?? 0.7, 0.3, prog * 0.55));
      bx = lerp(bob.x, ret.x, 0.42);
      by = lerp(bob.y, ret.y, 0.42);
      const shake = f.struggle ? 2.8 : 0.7;
      bx += Math.sin(this.time * 16) * shake;
      by += Math.cos(this.time * 13) * shake * 0.6;
    }

    // Леска.
    const tension = f.mode === 'reeling' ? clamp(f.tension || 0, 0, 100) : 0;
    const taut = f.mode === 'reeling';
    const sag = taut ? 2 : f.mode === 'waiting' ? this.h * 0.035 : 0;
    ctx.save();
    ctx.strokeStyle = taut
      ? tension > 85 ? '#ff7a6b' : tension > 62 ? '#ffd479' : '#b9ffe6'
      : `${p.star}88`;
    ctx.lineWidth = taut ? 1.4 : 1;
    ctx.globalAlpha = taut ? 0.9 : 0.55;
    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    const mx = (tip.x + bx) / 2;
    const my = (tip.y + by) / 2 + sag;
    ctx.quadraticCurveTo(mx, my, bx, by);
    ctx.stroke();
    if (taut && tension > 75) {
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = '#ff7a6b';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    ctx.restore();

    // Поплавок.
    this._drawBobber(ctx, bx, by, f);

    // Рыба во время вываживания.
    if (f.mode === 'reeling' && f.fish) {
      const size = clamp(this.h * 0.05 + f.fish.value * 0.08, 32, 170) * (f.struggle ? 1.08 : 1);
      const fy = by + this.h * 0.055 + Math.sin(this.time * 3) * 4;
      const fx = bx + Math.sin(this.time * 2.4) * (f.struggle ? 12 : 5);
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.filter = 'blur(1px)';
      drawFish(ctx, f.fish, {
        x: fx,
        y: fy,
        size,
        time: this.time * 2,
        flip: true,
        glow: true,
        alpha: 0.85
      });
      ctx.restore();
      // Пузырьки.
      if (!this.low) {
        for (let i = 0; i < 3; i++) {
          const t = (this.time * 0.6 + i * 0.33) % 1;
          ctx.globalAlpha = (1 - t) * 0.35;
          ctx.fillStyle = p.glow;
          ctx.beginPath();
          ctx.arc(fx - size * 0.2 + Math.sin(i * 2 + this.time) * 8, fy + 14 - t * 26, 1.2 + t * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }

    // Прыжок пойманной рыбы рисуется отдельно, чтобы он был виден
    // и после закрытия линии (mode landed / fishing = null).
  }

  _drawLeaps(ctx) {
    for (const leap of this.leaps) {
      const t = leap.t / leap.dur;
      const x = lerp(leap.x0, leap.x1, t);
      const y = lerp(leap.y0, leap.y1, t) - Math.sin(Math.PI * t) * this.h * 0.28;
      const angle = -0.5 + Math.sin(Math.PI * t) * 0.9;
      drawFish(ctx, leap.fish, {
        x,
        y,
        size: leap.size,
        time: this.time * 3,
        angle,
        flip: true,
        glow: true,
        alpha: Math.min(1, 1.2 - t * 0.4)
      });
    }
  }

  _drawBobber(ctx, x, y, f) {
    const p = this.loc.palette;
    const bite = f.mode === 'bite';
    const glow = ctx.createRadialGradient(x, y, 0, x, y, this.h * 0.035);
    glow.addColorStop(0, `${p.glow}88`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, this.h * 0.035, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#1b1b26';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y - 3);
    ctx.stroke();

    const grad = ctx.createLinearGradient(x, y - 4, x, y + 5);
    grad.addColorStop(0, '#f7f1dc');
    grad.addColorStop(0.55, '#ffb35e');
    grad.addColorStop(1, '#b54a3d');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, 3.6, 4.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.35)';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    if (bite) {
      ctx.strokeStyle = `${p.glow}aa`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 10 + Math.sin(this.time * 8) * 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // ── Передний план и атмосфера ────────────────────────────────────────────

  _drawReeds(ctx) {
    const p = this.loc.palette;
    for (const reed of this.reeds) {
      const sway = Math.sin(this.time * 0.7 + reed.phase) * reed.h * 0.08;
      const topX = reed.x + reed.lean * reed.h + sway;
      const topY = reed.baseY - reed.h;
      ctx.strokeStyle = reed.kind === 'ice' ? `${p.glow}55` : '#080b13';
      ctx.lineWidth = reed.kind === 'ice' ? 1.2 : 2;
      ctx.beginPath();
      ctx.moveTo(reed.x, this.h + 5);
      ctx.quadraticCurveTo(reed.x + reed.lean * reed.h * 0.4, reed.baseY - reed.h * 0.5, topX, topY);
      ctx.stroke();
      if (reed.kind === 'crystal') {
        ctx.fillStyle = `${p.glow}88`;
        ctx.beginPath();
        ctx.moveTo(topX, topY - 4);
        ctx.lineTo(topX + 3, topY + 2);
        ctx.lineTo(topX, topY + 8);
        ctx.lineTo(topX - 3, topY + 2);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  _drawParticles(ctx) {
    const p = this.loc.palette;
    // Светлячки.
    for (const f of this.fireflies) {
      const x = f.x + Math.sin(this.time * f.speed + f.phase) * 14;
      const y = f.y + Math.cos(this.time * f.speed * 0.7 + f.phase) * 8;
      const a = 0.35 + 0.65 * Math.max(0, Math.sin(this.time * 1.3 + f.phase));
      ctx.globalAlpha = a * 0.18;
      ctx.fillStyle = p.glow;
      ctx.beginPath();
      ctx.arc(x, y, f.r * 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = a * 0.65;
      ctx.beginPath();
      ctx.arc(x, y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Снег / звёздная пыль.
    for (const s of this.snow) {
      ctx.globalAlpha = 0.35 + 0.3 * Math.sin(this.time + s.phase);
      ctx.fillStyle = this.locId === 'crown' ? p.glow : '#eaffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Брызги.
    for (const s of this.splashes) {
      const a = clamp(s.life / s.maxLife, 0, 1);
      ctx.globalAlpha = a * 0.85;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  _drawFog(ctx) {
    const p = this.loc.palette;
    const strength = this.locId === 'mist' ? 0.22 : this.locId === 'frozen' ? 0.09 : 0.05;
    const y = this.horizon - this.h * 0.01;
    const g = ctx.createLinearGradient(0, y - this.h * 0.08, 0, y + this.h * 0.09);
    g.addColorStop(0, 'transparent');
    g.addColorStop(0.5, p.fog);
    g.addColorStop(1, 'transparent');
    ctx.globalAlpha = strength * 3;
    ctx.fillStyle = g;
    ctx.fillRect(0, y - this.h * 0.08, this.w, this.h * 0.17);
    ctx.globalAlpha = 1;

    if (this.locId === 'mist') {
      for (let i = 0; i < 3; i++) {
        const y = this.horizon + this.h * (0.015 + i * 0.065);
        const band = ctx.createLinearGradient(0, y - this.h * 0.05, 0, y + this.h * 0.12);
        band.addColorStop(0, 'transparent');
        band.addColorStop(0.45, p.fog);
        band.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = band;
        ctx.fillRect(0, y - this.h * 0.05, this.w, this.h * 0.17);
      }
      for (let i = 0; i < 3; i++) {
        const x = this.w * (0.2 + i * 0.3) + Math.sin(this.time * 0.05 + i * 2) * this.w * 0.08;
        const y = this.horizon + this.h * (0.04 + i * 0.05);
        const mist = ctx.createRadialGradient(x, y, 2, x, y, this.w * 0.3);
        mist.addColorStop(0, p.fog);
        mist.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = mist;
        ctx.fillRect(x - this.w * 0.3, y - this.h * 0.08, this.w * 0.6, this.h * 0.2);
      }
      ctx.globalAlpha = 1;
    }
  }

  _drawVignette(ctx) {
    if (!this.vignetteGradient) {
      const g = ctx.createRadialGradient(this.w * 0.5, this.h * 0.45, this.h * 0.2, this.w * 0.5, this.h * 0.5, Math.max(this.w, this.h) * 0.75);
      g.addColorStop(0, 'transparent');
      g.addColorStop(0.68, 'rgba(3,6,14,.06)');
      g.addColorStop(1, 'rgba(2,4,11,.52)');
      this.vignetteGradient = g;
    }
    ctx.fillStyle = this.vignetteGradient;
    ctx.fillRect(0, 0, this.w, this.h);
  }
}

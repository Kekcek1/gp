/* ==========================================================================
   Сияние рифа / Reef Glow — отрисовка на Canvas 2D.
   Вся графика рисуется процедурно: без внешних картинок и загрузок.
   ========================================================================== */
(function (root) {
  'use strict';

  var TYPES = ['pearl', 'coral', 'star', 'shell', 'bubble', 'kelp'];
  var PALETTE = {
    pearl: { a: '#f7feff', b: '#b8f3ff', c: '#3aa9c9', glow: '#c9f8ff' },
    coral: { a: '#ffc2d4', b: '#ff6b8a', c: '#b83258', glow: '#ffabc5' },
    star: { a: '#fff0b8', b: '#ffc857', c: '#d98222', glow: '#ffe39a' },
    shell: { a: '#e2d6ff', b: '#9b7bff', c: '#5e3fc4', glow: '#cdbcff' },
    bubble: { a: '#d4feff', b: '#66e0ff', c: '#168ab0', glow: '#b5f7ff' },
    kelp: { a: '#d6ffe2', b: '#6be09a', c: '#278653', glow: '#b6ffd0' }
  };
  var ALGAE_COLOR = '#5fbf7a';

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeOutBack(t) {
    var c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function roundRect(ctx, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function starPath(ctx, cx, cy, outer, inner, points, rotation) {
    ctx.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var r = i % 2 === 0 ? outer : inner;
      var a = (Math.PI / points) * i - Math.PI / 2 + (rotation || 0);
      var x = cx + Math.cos(a) * r;
      var y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  var Renderer = {
    bg: null,
    bc: null,
    bw: 0, bh: 0, dpr: 1,
    boardCanvas: null,
    boardCtx: null,
    boardSize: 0,
    cell: 0,
    pad: 0,
    gap: 0,
    sprites: {},
    spriteCell: 0,
    particles: [],
    time: 0,
    lastTime: 0,
    shake: 0,
    bgStatic: null,
    bgStaticSize: { w: 0, h: 0 },
    bgBase: null,
    boardBase: null,
    bubbles: [],
    fish: [],
    plankton: [],
    seed: 7,

    init: function (bgCanvas, boardCanvas) {
      this.bg = bgCanvas;
      this.bc = bgCanvas ? bgCanvas.getContext('2d') : null;
      this.boardCanvas = boardCanvas;
      this.boardCtx = boardCanvas ? boardCanvas.getContext('2d') : null;
      this._initAmbient();
      this.resize();
      return this;
    },

    resize: function () {
      this.dpr = Math.min(2, root.devicePixelRatio || 1);
      if (this.bg) {
        var bw = this.bg.clientWidth || root.innerWidth;
        var bh = this.bg.clientHeight || root.innerHeight;
        this.bg.width = Math.max(1, Math.floor(bw * this.dpr));
        this.bg.height = Math.max(1, Math.floor(bh * this.dpr));
        this.bw = bw; this.bh = bh;
        this.bgStatic = null;
        this.bgBase = null;
        this._initAmbient();
        this._buildBgBase();
      }
      if (this.boardCanvas) {
        var size = this.boardCanvas.clientWidth || 320;
        this.boardCanvas.width = Math.max(1, Math.floor(size * this.dpr));
        this.boardCanvas.height = Math.max(1, Math.floor(size * this.dpr));
        this.boardSize = size;
        this.pad = Math.max(5, size * 0.014);
        this.gap = Math.max(2, size * 0.009);
        this.cell = (size - this.pad * 2 - this.gap * 7) / 8;
        if (Math.abs(this.cell - this.spriteCell) > 0.6) {
          this.sprites = {};
          this.spriteCell = this.cell;
        }
        this._buildBoardBase();
      }
    },

    _buildBgBase: function () {
      if (!this.bw || !this.bh || !root.document) return;
      var w = this.bw, h = this.bh, dpr = this.dpr;
      var canvas = root.document.createElement('canvas');
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      var ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      var grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#06283c');
      grad.addColorStop(0.45, '#083a4c');
      grad.addColorStop(1, '#03121d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // Статические лучи.
      var cx = w * 0.5;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < 6; i++) {
        var angle = -0.65 + i * 0.26;
        var spread = 0.035 + (i % 3) * 0.014;
        var len = h * 1.15;
        var gx = cx + Math.sin(angle) * len;
        var gy = Math.cos(angle) * len;
        var lg = ctx.createLinearGradient(cx, -40, gx, gy);
        lg.addColorStop(0, 'rgba(120,255,230,0.10)');
        lg.addColorStop(0.35, 'rgba(90,220,220,0.035)');
        lg.addColorStop(1, 'rgba(40,140,180,0)');
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.moveTo(cx + Math.sin(angle - spread) * 40, -20);
        ctx.lineTo(cx + Math.sin(angle + spread) * 40, -20);
        ctx.lineTo(cx + Math.sin(angle + spread * 2.4) * len, gy);
        ctx.lineTo(cx + Math.sin(angle - spread * 2.4) * len, gy);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      // Каустика.
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (var k = 0; k < 5; k++) {
        ctx.beginPath();
        for (var x = -20; x <= w + 20; x += 14) {
          var y = h * (0.78 + k * 0.045) + Math.sin(x * 0.012 + k * 1.7) * (10 + k * 3);
          if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(110,255,225,' + (0.028 + k * 0.008) + ')';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();
      if (!this.bgStatic || this.bgStaticSize.w !== w || this.bgStaticSize.h !== h) this._makeReef(w, h);
      if (this.bgStatic) ctx.drawImage(this.bgStatic, 0, 0, w, h);
      var vg = ctx.createRadialGradient(w * 0.5, h * 0.45, Math.min(w, h) * 0.25, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,8,14,0.55)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
      this.bgBase = canvas;
    },

    _buildBoardBase: function () {
      if (!this.boardCanvas || !this.boardSize || !root.document) return;
      var size = this.boardSize, dpr = this.dpr;
      var canvas = root.document.createElement('canvas');
      canvas.width = Math.max(1, Math.floor(size * dpr));
      canvas.height = Math.max(1, Math.floor(size * dpr));
      var ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      var panelG = ctx.createLinearGradient(0, 0, size, size);
      panelG.addColorStop(0, 'rgba(9,48,63,0.78)');
      panelG.addColorStop(0.55, 'rgba(5,29,42,0.82)');
      panelG.addColorStop(1, 'rgba(3,18,28,0.9)');
      ctx.fillStyle = panelG;
      roundRect(ctx, 0, 0, size, size, size * 0.035);
      ctx.fill();
      ctx.strokeStyle = 'rgba(115,240,220,0.18)';
      ctx.lineWidth = 1.5;
      roundRect(ctx, 0.75, 0.75, size - 1.5, size - 1.5, size * 0.035);
      ctx.stroke();
      for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) this._drawCellBase(ctx, r, c);
      }
      this.boardBase = canvas;
    },

    _rng: function () {
      this.seed = (this.seed * 16807) % 2147483647;
      return (this.seed - 1) / 2147483646;
    },

    _initAmbient: function () {
      var w = this.bw || 800, h = this.bh || 600;
      this.bubbles = [];
      for (var i = 0; i < 26; i++) {
        this.bubbles.push({
          x: this._rng() * w,
          y: this._rng() * h,
          r: 1.5 + this._rng() * 5,
          speed: 8 + this._rng() * 22,
          wobble: this._rng() * Math.PI * 2,
          alpha: 0.12 + this._rng() * 0.3
        });
      }
      this.plankton = [];
      for (var j = 0; j < 55; j++) {
        this.plankton.push({
          x: this._rng() * w,
          y: this._rng() * h,
          r: 0.5 + this._rng() * 1.6,
          speed: 2 + this._rng() * 6,
          phase: this._rng() * Math.PI * 2,
          alpha: 0.1 + this._rng() * 0.4
        });
      }
      this.fish = [];
      for (var k = 0; k < 4; k++) {
        this.fish.push({
          x: this._rng() * w,
          y: h * (0.22 + this._rng() * 0.5),
          size: 8 + this._rng() * 15,
          speed: 5 + this._rng() * 12,
          dir: this._rng() < 0.5 ? -1 : 1,
          phase: this._rng() * Math.PI * 2
        });
      }
    },

    /* ------------------------------------------------------------ background */
    drawBackground: function (time, mood) {
      if (!this.bc) return;
      var ctx = this.bc;
      var w = this.bw || (root.innerWidth || 800);
      var h = this.bh || (root.innerHeight || 600);
      var dpr = this.dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!this.bgBase) this._buildBgBase();
      if (this.bgBase) ctx.drawImage(this.bgBase, 0, 0, w, h);
      else { ctx.fillStyle = '#06283c'; ctx.fillRect(0, 0, w, h); }
      if (mood === 'game') {
        ctx.fillStyle = 'rgba(1,10,17,0.30)';
        ctx.fillRect(0, 0, w, h);
      }

      // Планктон.
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (var p = 0; p < this.plankton.length; p++) {
        var pl = this.plankton[p];
        var py = (pl.y - time * 0.001 * pl.speed) % h;
        if (py < 0) py += h;
        var px = pl.x + Math.sin(time * 0.0004 + pl.phase) * 12;
        ctx.globalAlpha = pl.alpha * (0.6 + 0.4 * Math.sin(time * 0.001 + pl.phase));
        ctx.fillStyle = '#8ff7e8';
        ctx.beginPath();
        ctx.arc(px, py, pl.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Пузыри.
      ctx.save();
      for (var b = 0; b < this.bubbles.length; b++) {
        var bb = this.bubbles[b];
        var by = (bb.y - time * 0.001 * bb.speed) % h;
        if (by < 0) by += h;
        var bx = bb.x + Math.sin(time * 0.0012 + bb.wobble) * 8;
        ctx.globalAlpha = bb.alpha;
        ctx.strokeStyle = 'rgba(170,255,245,0.9)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bx, by, bb.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(170,255,245,0.10)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bx - bb.r * 0.3, by - bb.r * 0.3, Math.max(0.5, bb.r * 0.22), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fill();
      }
      ctx.restore();

      // Рыбки.
      ctx.save();
      for (var f = 0; f < this.fish.length; f++) {
        var fi = this.fish[f];
        var fx = fi.x + fi.dir * ((time * 0.001 * fi.speed) % (w + 200));
        if (fx > w + 60) fx -= w + 120;
        if (fx < -60) fx += w + 120;
        var fy = fi.y + Math.sin(time * 0.0007 + fi.phase) * 14;
        ctx.save();
        ctx.translate(fx, fy);
        ctx.scale(fi.dir, 1);
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = '#9ef4e2';
        ctx.beginPath();
        ctx.ellipse(0, 0, fi.size, fi.size * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-fi.size * 0.8, 0);
        ctx.lineTo(-fi.size * 1.5, -fi.size * 0.45);
        ctx.lineTo(-fi.size * 1.5, fi.size * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    },

    _makeReef: function (w, h) {
      var canvas = root.document.createElement('canvas');
      canvas.width = Math.max(1, Math.floor(w));
      canvas.height = Math.max(1, Math.floor(h));
      var ctx = canvas.getContext('2d');
      var rng = (function (seed) {
        var s = seed;
        return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
      })(42);
      // Дальние холмы.
      ctx.fillStyle = 'rgba(6,45,58,0.55)';
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (var x = 0; x <= w; x += w / 8) {
        ctx.lineTo(x, h * 0.72 + Math.sin(x * 0.004 + 1.3) * h * 0.05 + rng() * h * 0.02);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
      // Кораллы по краям.
      var baseY = h + 4;
      function coral(cx, scale, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineWidth = 6 * scale;
        for (var i = 0; i < 4; i++) {
          var ang = -Math.PI / 2 + (i - 1.5) * 0.32 + (rng() - 0.5) * 0.15;
          var len = (h * 0.13 + rng() * h * 0.1) * scale;
          ctx.beginPath();
          ctx.moveTo(cx, baseY);
          var mx = cx + Math.cos(ang) * len * 0.55;
          var my = baseY + Math.sin(ang) * len * 0.55;
          ctx.quadraticCurveTo(mx + (rng() - 0.5) * 20, my, cx + Math.cos(ang) * len, baseY + Math.sin(ang) * len);
          ctx.stroke();
          // Веточка.
          ctx.lineWidth = 3 * scale;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.quadraticCurveTo(mx + 10 * scale, my - 12 * scale, mx + 18 * scale, my - 20 * scale);
          ctx.stroke();
          ctx.lineWidth = 6 * scale;
        }
        ctx.restore();
      }
      coral(w * 0.08, 1.2, 'rgba(255,107,138,0.16)', 1);
      coral(w * 0.16, 0.8, 'rgba(155,123,255,0.16)', 1);
      coral(w * 0.9, 1.3, 'rgba(107,224,154,0.15)', 1);
      coral(w * 0.82, 0.85, 'rgba(255,200,87,0.14)', 1);
      // Веерный коралл.
      ctx.save();
      ctx.globalAlpha = 0.14;
      ctx.strokeStyle = '#ff8fb1';
      ctx.lineWidth = 1.2;
      for (var a = 0; a < 9; a++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h + 8);
        ctx.quadraticCurveTo(w * 0.5 + (a - 4) * 18, h * 0.78, w * 0.5 + (a - 4) * 44, h * 0.66);
        ctx.stroke();
      }
      ctx.restore();
      // Водоросли.
      ctx.save();
      ctx.globalAlpha = 0.14;
      for (var k = 0; k < 14; k++) {
        var x0 = rng() * w;
        var hh = h * (0.12 + rng() * 0.16);
        ctx.strokeStyle = rng() < 0.5 ? '#6be09a' : '#3aa9c9';
        ctx.lineWidth = 2 + rng() * 3;
        ctx.beginPath();
        ctx.moveTo(x0, h + 4);
        ctx.bezierCurveTo(x0 - 14, h - hh * 0.4, x0 + 18, h - hh * 0.7, x0 - 6, h - hh);
        ctx.stroke();
      }
      ctx.restore();
      this.bgStatic = canvas;
      this.bgStaticSize = { w: w, h: h };
    },

    /* --------------------------------------------------------------- board */
    setGame: function (game) {
      this.game = game;
      this.particles = [];
      this.shake = 0;
      if (!this.boardBase) this._buildBoardBase();
    },

    cellRect: function (r, c) {
      var x = this.pad + c * (this.cell + this.gap);
      var y = this.pad + r * (this.cell + this.gap);
      return { x: x, y: y, w: this.cell, h: this.cell };
    },

    cellCenter: function (r, c) {
      var rect = this.cellRect(r, c);
      return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
    },

    hitTest: function (clientX, clientY) {
      if (!this.boardCanvas) return null;
      var rect = this.boardCanvas.getBoundingClientRect();
      var x = (clientX - rect.left) * (this.boardSize / rect.width);
      var y = (clientY - rect.top) * (this.boardSize / rect.height);
      if (x < this.pad || y < this.pad) return null;
      var step = this.cell + this.gap;
      var c = Math.floor((x - this.pad) / step);
      var r = Math.floor((y - this.pad) / step);
      if (r < 0 || c < 0 || r >= 8 || c >= 8) return null;
      return { r: r, c: c };
    },

    _sprite: function (type, special) {
      var key = type + '|' + (special || '');
      if (this.sprites[key]) return this.sprites[key];
      var size = Math.max(20, Math.floor(this.cell * 1.15));
      var canvas = root.document.createElement('canvas');
      canvas.width = Math.floor(size * this.dpr);
      canvas.height = Math.floor(size * this.dpr);
      var ctx = canvas.getContext('2d');
      ctx.scale(this.dpr, this.dpr);
      var cx = size / 2, cy = size / 2;
      var s = size * 0.82;
      this._drawTileShape(ctx, type, null, cx, cy, s);
      if (special) this._drawSpecialOverlay(ctx, type, special, cx, cy, s);
      this.sprites[key] = { canvas: canvas, size: size };
      return this.sprites[key];
    },

    _drawTileShape: function (ctx, type, algae, cx, cy, s) {
      var p = PALETTE[type] || PALETTE.pearl;
      var radius = s * 0.42;
      // Мягкая тень/свечение под фишкой.
      var glow = ctx.createRadialGradient(cx, cy + radius * 0.25, radius * 0.1, cx, cy, radius * 1.25);
      glow.addColorStop(0, this._alpha(p.glow, 0.25));
      glow.addColorStop(1, this._alpha(p.glow, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      if (type === 'pearl') {
        var g = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.4, radius * 0.1, cx, cy, radius);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.45, p.a);
        g.addColorStop(0.82, p.b);
        g.addColorStop(1, p.c);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = this._alpha('#ffffff', 0.65);
        ctx.lineWidth = Math.max(1, s * 0.025);
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.88, -2.6, -0.7);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.ellipse(cx - radius * 0.34, cy - radius * 0.38, radius * 0.18, radius * 0.11, -0.6, 0, Math.PI * 2);
        ctx.fill();
        // Иридесценция.
        ctx.strokeStyle = 'rgba(175,255,240,0.5)';
        ctx.lineWidth = Math.max(1, s * 0.02);
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.65, 2.4, 3.4);
        ctx.stroke();
      } else if (type === 'coral') {
        ctx.lineCap = 'round';
        var g2 = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius);
        g2.addColorStop(0, p.a);
        g2.addColorStop(0.55, p.b);
        g2.addColorStop(1, p.c);
        ctx.strokeStyle = g2;
        ctx.lineWidth = s * 0.085;
        var branches = [
          [-0.58, -0.76, -0.38, -0.12],
          [-0.06, -1.02, -0.12, -0.1],
          [0.5, -0.84, 0.36, -0.14]
        ];
        for (var i = 0; i < branches.length; i++) {
          var b = branches[i];
          var startX = cx + b[2] * radius * 0.55;
          var startY = cy + radius * 0.5;
          var endX = cx + b[0] * radius;
          var endY = cy + b[1] * radius;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo(cx + b[2] * radius, cy + b[3] * radius * 1.18, endX, endY);
          ctx.stroke();
          // Маленькая боковая веточка.
          ctx.lineWidth = s * 0.055;
          ctx.beginPath();
          ctx.moveTo((startX + endX) / 2, (startY + endY) / 2);
          ctx.quadraticCurveTo((startX + endX) / 2 + (i - 1) * radius * 0.18, (startY + endY) / 2 - radius * 0.2, (startX + endX) / 2 + (i - 1) * radius * 0.42, (startY + endY) / 2 - radius * 0.38);
          ctx.stroke();
          ctx.lineWidth = s * 0.085;
          ctx.fillStyle = this._alpha('#ffe1ea', 0.9);
          ctx.beginPath();
          ctx.arc(endX, endY, radius * 0.075, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.ellipse(cx, cy + radius * 0.58, radius * 0.26, radius * 0.14, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.fill();
      } else if (type === 'star') {
        var g3 = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius);
        g3.addColorStop(0, p.a);
        g3.addColorStop(0.6, p.b);
        g3.addColorStop(1, p.c);
        ctx.fillStyle = g3;
        starPath(ctx, cx, cy + radius * 0.05, radius * 1.02, radius * 0.46, 5, -0.15);
        ctx.fill();
        ctx.strokeStyle = this._alpha('#fff6d6', 0.6);
        ctx.lineWidth = Math.max(1, s * 0.02);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        for (var d = 0; d < 5; d++) {
          var ang = -Math.PI / 2 + (Math.PI * 2 / 5) * d - 0.15;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(ang) * radius * 0.55, cy + Math.sin(ang) * radius * 0.55, radius * 0.05, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === 'shell') {
        var g4 = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius);
        g4.addColorStop(0, p.a);
        g4.addColorStop(0.6, p.b);
        g4.addColorStop(1, p.c);
        ctx.fillStyle = g4;
        ctx.beginPath();
        ctx.moveTo(cx, cy + radius * 0.55);
        ctx.arc(cx, cy + radius * 0.15, radius * 0.95, Math.PI, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = Math.max(1, s * 0.018);
        for (var rIdx = 0; rIdx < 5; rIdx++) {
          var a2 = Math.PI + (Math.PI / 4) * rIdx + Math.PI / 8;
          ctx.beginPath();
          ctx.moveTo(cx, cy + radius * 0.3);
          ctx.lineTo(cx + Math.cos(a2) * radius * 0.9, cy + radius * 0.3 + Math.sin(a2) * radius * 0.9);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.ellipse(cx, cy + radius * 0.55, radius * 0.3, radius * 0.12, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.fill();
      } else if (type === 'bubble') {
        var g5 = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.4, radius * 0.05, cx, cy, radius);
        g5.addColorStop(0, '#ffffff');
        g5.addColorStop(0.25, this._alpha(p.a, 0.95));
        g5.addColorStop(0.75, this._alpha(p.b, 0.55));
        g5.addColorStop(1, this._alpha(p.c, 0.85));
        ctx.fillStyle = g5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(220,255,255,0.8)';
        ctx.lineWidth = Math.max(1, s * 0.022);
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.97, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.ellipse(cx - radius * 0.32, cy - radius * 0.4, radius * 0.2, radius * 0.1, -0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.64, 2.1, 2.9);
        ctx.stroke();
      } else if (type === 'kelp') {
        ctx.lineCap = 'round';
        var g6 = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius);
        g6.addColorStop(0, p.a);
        g6.addColorStop(0.6, p.b);
        g6.addColorStop(1, p.c);
        ctx.strokeStyle = g6;
        ctx.lineWidth = s * 0.09;
        ctx.beginPath();
        ctx.moveTo(cx - radius * 0.18, cy + radius * 0.7);
        ctx.bezierCurveTo(cx - radius * 0.55, cy + radius * 0.2, cx + radius * 0.05, cy - radius * 0.1, cx - radius * 0.18, cy - radius * 0.75);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + radius * 0.16, cy + radius * 0.7);
        ctx.bezierCurveTo(cx + radius * 0.55, cy + radius * 0.25, cx + radius * 0.1, cy - radius * 0.15, cx + radius * 0.28, cy - radius * 0.55);
        ctx.stroke();
        ctx.fillStyle = 'rgba(220,255,235,0.5)';
        for (var l = 0; l < 5; l++) {
          ctx.beginPath();
          ctx.ellipse(cx - radius * 0.3 + l * radius * 0.12, cy - radius * 0.3 + l * radius * 0.18, radius * 0.07, radius * 0.14, 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    },

    _drawSpecialOverlay: function (ctx, type, special, cx, cy, s) {
      var radius = s * 0.42;
      ctx.save();
      if (special === 'lineH' || special === 'lineV') {
        var vertical = special === 'lineV';
        ctx.translate(cx, cy);
        if (!vertical) ctx.rotate(0); else ctx.rotate(Math.PI / 2);
        var lg = ctx.createLinearGradient(-radius, 0, radius, 0);
        lg.addColorStop(0, 'rgba(255,255,255,0)');
        lg.addColorStop(0.3, 'rgba(255,255,255,0.85)');
        lg.addColorStop(0.7, 'rgba(255,255,255,0.85)');
        lg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(-radius * 1.1, -radius * 0.14, radius * 2.2, radius * 0.28, radius * 0.14) : ctx.rect(-radius * 1.1, -radius * 0.14, radius * 2.2, radius * 0.28);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        for (var i = -1; i <= 1; i++) {
          ctx.beginPath();
          ctx.moveTo(i * radius * 0.55 - radius * 0.1, -radius * 0.24);
          ctx.lineTo(i * radius * 0.55 + radius * 0.12, 0);
          ctx.lineTo(i * radius * 0.55 - radius * 0.1, radius * 0.24);
          ctx.closePath();
          ctx.fill();
        }
      } else if (special === 'bomb') {
        var bg = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.25, radius * 0.1, cx, cy, radius);
        bg.addColorStop(0, 'rgba(20,40,60,0.15)');
        bg.addColorStop(0.65, 'rgba(8,20,34,0.75)');
        bg.addColorStop(1, 'rgba(4,10,18,0.95)');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.85, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,214,102,0.95)';
        ctx.lineWidth = Math.max(1.5, s * 0.035);
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.78, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,170,80,0.8)';
        ctx.lineWidth = Math.max(1, s * 0.025);
        for (var k = 0; k < 6; k++) {
          var a = (Math.PI * 2 / 6) * k + 0.3;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * radius * 0.2, cy + Math.sin(a) * radius * 0.2);
          ctx.lineTo(cx + Math.cos(a) * radius * 0.7, cy + Math.sin(a) * radius * 0.7);
          ctx.stroke();
        }
        ctx.fillStyle = '#fff3c4';
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.16, 0, Math.PI * 2);
        ctx.fill();
      } else if (special === 'rainbow') {
        var colors = ['#ff6b8a', '#ffc857', '#6be09a', '#66e0ff', '#9b7bff', '#ff8fb1'];
        for (var r = 0; r < 6; r++) {
          ctx.strokeStyle = colors[r];
          ctx.lineWidth = Math.max(2, s * 0.045);
          ctx.globalAlpha = 0.9;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * (0.95 - r * 0.12), -2.4 + r * 0.4, 0.6 + r * 0.4);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        var rg = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.25, 0, cx, cy, radius * 0.7);
        rg.addColorStop(0, 'rgba(255,255,255,0.95)');
        rg.addColorStop(0.5, 'rgba(255,255,255,0.35)');
        rg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.75, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        starPath(ctx, cx + radius * 0.45, cy - radius * 0.5, radius * 0.13, radius * 0.05, 4, 0);
        ctx.fill();
      }
      ctx.restore();
    },

    _alpha: function (hex, a) {
      if (hex[0] !== '#') return hex;
      var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
      return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    },

    /** Иконка фишки для интерфейса (магазин, цели, обучение). */
    makeIconDataURL: function (type, size, special) {
      size = size || 48;
      var key = 'icon:' + type + ':' + (special || '') + ':' + size;
      if (this._iconCache && this._iconCache[key]) return this._iconCache[key];
      this._iconCache = this._iconCache || {};
      var scale = 2;
      var canvas = root.document.createElement('canvas');
      canvas.width = canvas.height = size * scale;
      var ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      if (type === 'algae') {
        ctx.save();
        ctx.strokeStyle = 'rgba(95,191,122,0.95)';
        ctx.lineWidth = Math.max(2, size * 0.055);
        ctx.lineCap = 'round';
        for (var i = 0; i < 5; i++) {
          var bx = size * (0.22 + i * 0.14);
          var by = size * 0.9;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.quadraticCurveTo(bx + (i % 2 ? 8 : -8), by - size * 0.3, bx + (i % 2 ? -4 : 6), by - size * (0.5 + (i % 3) * 0.12));
          ctx.stroke();
        }
        ctx.fillStyle = 'rgba(143,247,194,0.85)';
        for (var b = 0; b < 3; b++) {
          ctx.beginPath();
          ctx.arc(size * (0.32 + b * 0.18), size * (0.4 + b * 0.14), size * 0.035, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      } else {
        this._drawTileShape(ctx, type, null, size / 2, size / 2, size * 0.86);
        if (special) this._drawSpecialOverlay(ctx, type, special, size / 2, size / 2, size * 0.86);
      }
      var url = canvas.toDataURL('image/png');
      this._iconCache[key] = url;
      return url;
    },

    _drawAlgae: function (ctx, rect, r, c, time) {
      var sway = Math.sin(time * 0.0018 + r * 0.8 + c * 0.5) * 0.08;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = 'rgba(30,100,70,0.24)';
      roundRect(ctx, rect.x + 1, rect.y + 1, rect.w - 2, rect.h - 2, rect.w * 0.2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(95,191,122,0.75)';
      ctx.lineWidth = Math.max(1.2, rect.w * 0.035);
      ctx.lineCap = 'round';
      for (var i = 0; i < 5; i++) {
        var bx = rect.x + rect.w * (0.2 + i * 0.15);
        var by = rect.y + rect.h * 0.92;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(bx + Math.sin(time * 0.002 + i + r) * 8 + sway * 20, by - rect.h * 0.3, bx + Math.sin(time * 0.0016 + i * 2) * 10, by - rect.h * (0.5 + (i % 2) * 0.15));
        ctx.stroke();
      }
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#8ff7c2';
      for (var b = 0; b < 3; b++) {
        ctx.beginPath();
        ctx.arc(rect.x + rect.w * (0.3 + b * 0.2), rect.y + rect.h * (0.35 + b * 0.16), rect.w * 0.025, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },

    _drawCellBase: function (ctx, r, c) {
      var rect = this.cellRect(r, c);
      var radius = rect.w * 0.2;
      var g = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
      g.addColorStop(0, 'rgba(20,80,100,0.22)');
      g.addColorStop(1, 'rgba(3,22,34,0.36)');
      ctx.fillStyle = g;
      roundRect(ctx, rect.x, rect.y, rect.w, rect.h, radius);
      ctx.fill();
      ctx.strokeStyle = 'rgba(120,235,220,0.10)';
      ctx.lineWidth = 1;
      roundRect(ctx, rect.x + 0.5, rect.y + 0.5, rect.w - 1, rect.h - 1, radius);
      ctx.stroke();
    },

    _drawCell: function (ctx, r, c, algae) {
      this._drawCellBase(ctx, r, c);
      if (algae) this._drawAlgae(ctx, this.cellRect(r, c), r, c, this.time);
    },

    _drawTile: function (ctx, type, special, x, y, size, alpha, scale, rotation) {
      if (!type) return;
      var sprite = this._sprite(type, special);
      var drawSize = size * (scale === undefined ? 1 : scale);
      ctx.save();
      ctx.globalAlpha = alpha === undefined ? 1 : alpha;
      ctx.translate(x, y);
      if (rotation) ctx.rotate(rotation);
      ctx.drawImage(sprite.canvas, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
      ctx.restore();
    },

    _isClearAnim: function (anim) { return anim && (anim.type === 'clear' || anim.type === 'wave'); },
    _isSwapAnim: function (anim) { return anim && anim.type === 'swap'; },
    _isInvalidAnim: function (anim) { return anim && anim.type === 'invalid'; },
    _isFallAnim: function (anim) { return anim && anim.type === 'fall'; },

    render: function (game, anim, now) {
      var ctx = this.boardCtx;
      if (!ctx || !game) return;
      var dt = this.lastTime ? Math.min(0.05, (now - this.lastTime) / 1000) : 0.016;
      this.lastTime = now;
      this.time = now;
      this._updateParticles(dt);
      this.shake = Math.max(0, this.shake - dt * 1.6);

      var size = this.boardSize;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      var shakeX = this.shake > 0 ? (Math.random() - 0.5) * this.shake * 16 : 0;
      var shakeY = this.shake > 0 ? (Math.random() - 0.5) * this.shake * 16 : 0;
      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Панель и фон клеток кэшируются, чтобы не создавать 64 градиента на кадр.
      if (this.boardBase) {
        ctx.drawImage(this.boardBase, 0, 0, size, size);
      } else {
        var panelG = ctx.createLinearGradient(0, 0, size, size);
        panelG.addColorStop(0, 'rgba(9,48,63,0.78)');
        panelG.addColorStop(0.55, 'rgba(5,29,42,0.82)');
        panelG.addColorStop(1, 'rgba(3,18,28,0.9)');
        ctx.fillStyle = panelG;
        roundRect(ctx, 0, 0, size, size, size * 0.035);
        ctx.fill();
      }

      var time = now;
      for (var r = 0; r < game.rows; r++) {
        for (var c = 0; c < game.cols; c++) {
          if (game.algae[r][c] === 1) this._drawAlgae(ctx, this.cellRect(r, c), r, c, time);
        }
      }

      var animProgress = 0;
      if (anim && anim.start) {
        animProgress = clamp((now - anim.start) / Math.max(1, anim.dur), 0, 1);
      }

      var hidden = {};
      if (this._isSwapAnim(anim)) {
        hidden[anim.a.r + ':' + anim.a.c] = true;
        hidden[anim.b.r + ':' + anim.b.c] = true;
      } else if (this._isInvalidAnim(anim)) {
        hidden[anim.a.r + ':' + anim.a.c] = true;
        hidden[anim.b.r + ':' + anim.b.c] = true;
      } else if (this._isFallAnim(anim)) {
        for (var fi = 0; fi < anim.falls.length; fi++) {
          var f = anim.falls[fi];
          hidden[f.toR + ':' + f.toC] = true;
        }
        for (var si = 0; si < anim.spawns.length; si++) {
          var sp = anim.spawns[si];
          hidden[sp.r + ':' + sp.c] = true;
        }
      }

      // Обычные фишки.
      for (var rr = 0; rr < game.rows; rr++) {
        for (var cc = 0; cc < game.cols; cc++) {
          if (hidden[rr + ':' + cc]) continue;
          var tile = game.board.cells[rr][cc];
          if (!tile) continue;
          var center = this.cellCenter(rr, cc);
          var tileSize = this.cell * 1.02;
          var scale = 1, alpha = 1;
          if (anim && anim.type === 'clear' && anim.creations) {
            for (var ci = 0; ci < anim.creations.length; ci++) {
              var cr = anim.creations[ci];
              if (cr.r === rr && cr.c === cc) {
                var pop = clamp((now - anim.start) / Math.max(1, anim.dur), 0, 1);
                scale = 0.4 + 0.6 * easeOutBack(pop);
                alpha = pop;
              }
            }
          }
          this._drawTile(ctx, tile.type, tile.special, center.x, center.y, tileSize, alpha, scale, 0);
        }
      }

      // Анимация обмена.
      if (this._isSwapAnim(anim)) {
        var p = easeInOut(animProgress);
        var ca = this.cellCenter(anim.a.r, anim.a.c);
        var cb = this.cellCenter(anim.b.r, anim.b.c);
        var ta = anim.tiles ? anim.tiles[0] : null;
        var tb = anim.tiles ? anim.tiles[1] : null;
        if (ta) this._drawTile(ctx, ta.type, ta.special, lerp(ca.x, cb.x, p), lerp(ca.y, cb.y, p), this.cell * 1.02, 1, 1 + Math.sin(p * Math.PI) * 0.06, 0);
        if (tb) this._drawTile(ctx, tb.type, tb.special, lerp(cb.x, ca.x, p), lerp(cb.y, ca.y, p), this.cell * 1.02, 1, 1 + Math.sin(p * Math.PI) * 0.06, 0);
      }

      // Неверный обмен — лёгкий стук.
      if (this._isInvalidAnim(anim)) {
        var ip = Math.sin(animProgress * Math.PI);
        var ia = this.cellCenter(anim.a.r, anim.a.c);
        var ib = this.cellCenter(anim.b.r, anim.b.c);
        var ta2 = anim.tiles ? anim.tiles[0] : null;
        var tb2 = anim.tiles ? anim.tiles[1] : null;
        var dx = (ib.x - ia.x) * 0.16 * ip;
        var dy = (ib.y - ia.y) * 0.16 * ip;
        if (ta2) this._drawTile(ctx, ta2.type, ta2.special, ia.x + dx, ia.y + dy, this.cell * 1.02, 1, 1, 0);
        if (tb2) this._drawTile(ctx, tb2.type, tb2.special, ib.x - dx, ib.y - dy, this.cell * 1.02, 1, 1, 0);
      }

      // Исчезающие фишки.
      if (this._isClearAnim(anim) && anim.cleared) {
        var cp = easeOutCubic(animProgress);
        for (var k = 0; k < anim.cleared.length; k++) {
          var item = anim.cleared[k];
          if (!item.tile) continue;
          var ic = this.cellCenter(item.r, item.c);
          this._drawTile(ctx, item.tile.type, item.tile.special, ic.x, ic.y, this.cell * 1.02, 1 - cp, 1 + cp * 0.35, cp * 0.15);
        }
      }

      // Падение.
      if (this._isFallAnim(anim)) {
        var fp = easeOutCubic(animProgress);
        var bounce = Math.sin(animProgress * Math.PI) * 0.02;
        for (var fj = 0; fj < anim.falls.length; fj++) {
          var fall = anim.falls[fj];
          var from = this.cellCenter(fall.fromR, fall.fromC);
          var to = this.cellCenter(fall.toR, fall.toC);
          var fx = lerp(from.x, to.x, fp);
          var fy = lerp(from.y, to.y, fp) - Math.sin(fp * Math.PI) * this.cell * 0.08;
          var fscale = 1 + Math.sin(fp * Math.PI) * bounce;
          this._drawTile(ctx, fall.tile.type, fall.tile.special, fx, fy, this.cell * 1.02, 1, fscale, 0);
        }
        for (var sk = 0; sk < anim.spawns.length; sk++) {
          var spawn = anim.spawns[sk];
          var sc = this.cellCenter(spawn.r, spawn.c);
          var dist = (spawn.r + 1) * (this.cell + this.gap);
          var sy = lerp(sc.y - dist, sc.y, fp);
          this._drawTile(ctx, spawn.tile.type, spawn.tile.special, sc.x, sy, this.cell * 1.02, clamp(fp * 1.6, 0, 1), 1, 0);
        }
      }

      // Лучи/взрывы от спецфишек.
      if (this._isClearAnim(anim) && anim.cleared) {
        var ep = Math.sin(animProgress * Math.PI);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (var e = 0; e < anim.cleared.length; e++) {
          var cel = anim.cleared[e];
          var tile2 = cel.tile;
          if (!tile2 || !tile2.special) continue;
          var ec = this.cellCenter(cel.r, cel.c);
          if (tile2.special === 'lineH') {
            var lg2 = ctx.createLinearGradient(0, ec.y, size, ec.y);
            lg2.addColorStop(0, 'rgba(255,255,255,0)');
            lg2.addColorStop(0.5, 'rgba(200,255,245,' + 0.8 * ep + ')');
            lg2.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = lg2;
            ctx.fillRect(0, ec.y - this.cell * 0.16, size, this.cell * 0.32);
          } else if (tile2.special === 'lineV') {
            var lg3 = ctx.createLinearGradient(ec.x, 0, ec.x, size);
            lg3.addColorStop(0, 'rgba(255,255,255,0)');
            lg3.addColorStop(0.5, 'rgba(200,255,245,' + 0.8 * ep + ')');
            lg3.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = lg3;
            ctx.fillRect(ec.x - this.cell * 0.16, 0, this.cell * 0.32, size);
          } else if (tile2.special === 'bomb') {
            var bg2 = ctx.createRadialGradient(ec.x, ec.y, this.cell * 0.1, ec.x, ec.y, this.cell * 2.2);
            bg2.addColorStop(0, 'rgba(255,240,180,' + 0.7 * ep + ')');
            bg2.addColorStop(0.4, 'rgba(255,170,80,' + 0.35 * ep + ')');
            bg2.addColorStop(1, 'rgba(255,120,40,0)');
            ctx.fillStyle = bg2;
            ctx.beginPath();
            ctx.arc(ec.x, ec.y, this.cell * 2.2, 0, Math.PI * 2);
            ctx.fill();
          } else if (tile2.special === 'rainbow') {
            ctx.globalAlpha = ep * 0.4;
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, size, size);
            ctx.globalAlpha = 1;
          }
        }
        // Волна: кольцо от центра.
        if (anim.type === 'wave') {
          var wp = animProgress;
          ctx.strokeStyle = 'rgba(140,255,235,' + (1 - wp) * 0.8 + ')';
          ctx.lineWidth = this.cell * 0.2 * (1 - wp);
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, wp * size * 0.75, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Выделение.
      if (anim && anim.selected) {
        var sel = anim.selected;
        var sr = this.cellRect(sel.r, sel.c);
        ctx.save();
        ctx.strokeStyle = 'rgba(180,255,240,0.9)';
        ctx.lineWidth = Math.max(2, this.cell * 0.05);
        roundRect(ctx, sr.x + 1, sr.y + 1, sr.w - 2, sr.h - 2, sr.w * 0.2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(120,255,230,0.25)';
        ctx.lineWidth = Math.max(4, this.cell * 0.12);
        ctx.stroke();
        ctx.restore();
      }

      // Подсказка.
      if (anim && anim.hint) {
        var hp = 0.55 + 0.45 * Math.sin(now * 0.005);
        ctx.save();
        ctx.globalAlpha = hp;
        ctx.strokeStyle = 'rgba(255,230,140,0.95)';
        ctx.lineWidth = Math.max(2, this.cell * 0.055);
        [anim.hint.a, anim.hint.b].forEach(function (pos) {
          var hr = this.cellRect(pos.r, pos.c);
          roundRect(ctx, hr.x + 2, hr.y + 2, hr.w - 4, hr.h - 4, hr.w * 0.22);
          ctx.stroke();
        }, this);
        ctx.restore();
      }

      // Частицы.
      this._drawParticles(ctx);

      ctx.restore();
    },

    /* ----------------------------------------------------------- particles */
    spawnBurst: function (r, c, type, count, options) {
      options = options || {};
      var center = this.cellCenter(r, c);
      var color = (PALETTE[type] || PALETTE.pearl).b;
      var palette = options.colors || [color, (PALETTE[type] || PALETTE.pearl).a, '#ffffff'];
      count = count || 8;
      for (var i = 0; i < count; i++) {
        if (this.particles.length > 380) break;
        var ang = Math.random() * Math.PI * 2;
        var speed = (0.4 + Math.random() * 1.2) * (options.power || 1);
        this.particles.push({
          x: center.x + (Math.random() - 0.5) * this.cell * 0.4,
          y: center.y + (Math.random() - 0.5) * this.cell * 0.4,
          vx: Math.cos(ang) * speed * this.cell * 1.6,
          vy: Math.sin(ang) * speed * this.cell * 1.6 - this.cell * 0.5,
          life: 0, maxLife: 0.45 + Math.random() * 0.5,
          size: this.cell * (0.04 + Math.random() * 0.07),
          color: palette[Math.floor(Math.random() * palette.length)],
          shape: Math.random() < 0.2 ? 'star' : (Math.random() < 0.4 ? 'bubble' : 'dot'),
          gravity: this.cell * 1.4,
          alpha: 1
        });
      }
    },

    spawnRing: function (r, c, color, size) {
      var center = this.cellCenter(r, c);
      this.particles.push({
        x: center.x, y: center.y, vx: 0, vy: 0,
        life: 0, maxLife: 0.55, size: size || this.cell * 1.4,
        color: color || '#aaffee', shape: 'ring', gravity: 0, alpha: 1
      });
    },

    spawnFloatingText: function (r, c, text, color) {
      var center = this.cellCenter(r, c);
      this.particles.push({
        x: center.x, y: center.y, vx: 0, vy: -this.cell * 1.1,
        life: 0, maxLife: 0.9, size: this.cell * 0.34,
        color: color || '#fff3c4', shape: 'text', text: text, gravity: 0, alpha: 1
      });
    },

    _updateParticles: function (dt) {
      for (var i = this.particles.length - 1; i >= 0; i--) {
        var p = this.particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          this.particles.splice(i, 1);
          continue;
        }
        if (p.shape !== 'ring' && p.shape !== 'text') {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += p.gravity * dt;
          p.vx *= 0.98;
          p.alpha = 1 - p.life / p.maxLife;
        } else if (p.shape === 'text') {
          p.y += p.vy * dt;
          p.alpha = 1 - Math.pow(p.life / p.maxLife, 2);
        } else {
          p.alpha = 1 - p.life / p.maxLife;
        }
      }
    },

    _drawParticles: function (ctx) {
      for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        ctx.save();
        ctx.globalAlpha = clamp(p.alpha, 0, 1);
        if (p.shape === 'dot') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'bubble') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(1, p.size * 0.3);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.4, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.shape === 'star') {
          ctx.fillStyle = p.color;
          starPath(ctx, p.x, p.y, p.size * 1.5, p.size * 0.6, 4, p.life * 3);
          ctx.fill();
        } else if (p.shape === 'ring') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(1, p.size * 0.08);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (0.2 + p.life / p.maxLife * 0.9), 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.shape === 'text') {
          ctx.fillStyle = p.color;
          ctx.font = '800 ' + Math.round(p.size) + 'px Nunito, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.text, p.x, p.y);
        }
        ctx.restore();
      }
    },

    shakeScreen: function (amount) {
      this.shake = Math.max(this.shake, amount);
    },

    clearParticles: function () {
      this.particles = [];
      this.shake = 0;
    }
  };

  root.ReefRenderer = Renderer;
})(typeof globalThis !== 'undefined' ? globalThis : this);

/* Core utilities, persistence, meta progression and procedural artwork. */
(function () {
  "use strict";

  const AG = (window.AG = window.AG || {});

  if (!Math.hypot) {
    Math.hypot = function () {
      let sum = 0;
      for (let i = 0; i < arguments.length; i++) sum += arguments[i] * arguments[i];
      return Math.sqrt(sum);
    };
  }
  if (!String.prototype.padStart) {
    String.prototype.padStart = function (target, pad) {
      let s = String(this);
      const p = pad === undefined ? " " : String(pad);
      while (s.length < target) s = p + s;
      return s;
    };
  }
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (value) { return this.indexOf(value) !== -1; };
  }

  AG.VERSION = "1.0.0";
  AG.IS_TOUCH = (function () {
    try {
      return ("ontouchstart" in window) || (navigator.maxTouchPoints || 0) > 1;
    } catch (e) {
      return false;
    }
  })();

  AG.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  AG.lerp = function (a, b, t) { return a + (b - a) * t; };
  AG.TAU = Math.PI * 2;
  AG.DEG = Math.PI / 180;

  AG.angNorm = function (a) {
    a %= AG.TAU;
    return a < 0 ? a + AG.TAU : a;
  };

  AG.angDiff = function (a, b) {
    let d = (a - b + Math.PI) % AG.TAU;
    if (d < 0) d += AG.TAU;
    return d - Math.PI;
  };

  AG.approachAngle = function (current, target, maxStep) {
    const d = AG.angDiff(target, current);
    if (Math.abs(d) <= maxStep) return AG.angNorm(target);
    return AG.angNorm(current + Math.sign(d) * maxStep);
  };

  AG.easeOutCubic = function (t) { return 1 - Math.pow(1 - t, 3); };
  AG.easeInOut = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  AG.easeOutBack = function (t) {
    const c = 1.70158;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  };

  AG.mulberry32 = function (seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  AG.rgba = function (hex, alpha) {
    if (!hex || hex[0] !== "#") return hex;
    let h = hex.slice(1);
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const n = parseInt(h, 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + alpha + ")";
  };

  AG.Storage = {
    get: function (key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : raw;
      } catch (e) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        window.localStorage.setItem(key, value);
        return true;
      } catch (e) {
        return false;
      }
    },
    remove: function (key) {
      try { window.localStorage.removeItem(key); return true; } catch (e) { return false; }
    }
  };

  /* ------------------------------------------------------------------ */
  /* Progression                                                         */
  /* ------------------------------------------------------------------ */

  AG.UPGRADES = {
    cap:   { max: 5, costs: [60, 160, 340, 640, 1000] },
    regen: { max: 5, costs: [70, 180, 380, 680, 1050] },
    width: { max: 4, costs: [90, 230, 480, 850] },
    hull:  { max: 3, costs: [120, 340, 800] },
    score: { max: 5, costs: [100, 240, 480, 800, 1200] }
  };

  AG.UPGRADE_ORDER = ["cap", "regen", "width", "hull", "score"];

  AG.Meta = {
    fromSave: function (save) {
      const u = save.upgrades;
      return {
        maxEnergy: 100 + 20 * (u.cap || 0),
        regen: 16 + 3 * (u.regen || 0),
        halfWidth: (72 + 14 * (u.width || 0)) * 0.5 * AG.DEG,
        maxHP: 3 + (u.hull || 0),
        scoreMul: 1 + 0.08 * (u.score || 0)
      };
    },
    effect: function (key, level) {
      switch (key) {
        case "cap": return 100 + 20 * level;
        case "regen": return 16 + 3 * level;
        case "width": return 72 + 14 * level;
        case "hull": return 3 + level;
        case "score": return level * 8;
        default: return 0;
      }
    }
  };

  AG.ACHIEVEMENTS = [
    { id: "first_block", reward: 30 },
    { id: "wave5", reward: 30 },
    { id: "wave10", reward: 30 },
    { id: "combo", reward: 30 },
    { id: "perfect", reward: 30 },
    { id: "crystals", reward: 30 },
    { id: "boss", reward: 30 },
    { id: "score5k", reward: 30 },
    { id: "score20k", reward: 30 },
    { id: "runs10", reward: 30 }
  ];

  AG.Save = {
    KEY: "astroshield_save_v1",
    defaults: function () {
      return {
        v: 1,
        best: 0,
        dust: 0,
        runs: 0,
        upgrades: { cap: 0, regen: 0, width: 0, hull: 0, score: 0 },
        achievements: {},
        tutorialSeen: false,
        hints: { crystal: false, repair: false, boss: false },
        sound: true,
        music: true,
        lang: null,
        daily: { date: "", streak: 0 },
        ads: { lastAt: 0, runsSince: 99 },
        stats: { blocks: 0, perfect: 0, crystals: 0, bossKills: 0, bestWave: 0 },
        updatedAt: 0
      };
    },
    normalize: function (raw) {
      const d = AG.Save.defaults();
      if (!raw || typeof raw !== "object") return d;
      const out = d;
      const num = function (v, fallback, min, max) {
        const n = Number(v);
        if (!isFinite(n)) return fallback;
        return AG.clamp(n, min === undefined ? 0 : min, max === undefined ? 1e12 : max);
      };
      out.best = Math.floor(num(raw.best, 0));
      out.dust = Math.floor(num(raw.dust, 0));
      out.runs = Math.floor(num(raw.runs, 0));
      out.updatedAt = num(raw.updatedAt, 0);
      if (raw.upgrades && typeof raw.upgrades === "object") {
        for (const key of AG.UPGRADE_ORDER) {
          const def = AG.UPGRADES[key];
          out.upgrades[key] = Math.floor(num(raw.upgrades[key], 0, 0, def.max));
        }
      }
      if (raw.achievements && typeof raw.achievements === "object") {
        for (const a of AG.ACHIEVEMENTS) {
          if (raw.achievements[a.id]) out.achievements[a.id] = true;
        }
      }
      out.tutorialSeen = !!raw.tutorialSeen;
      if (raw.hints && typeof raw.hints === "object") {
        out.hints.crystal = !!raw.hints.crystal;
        out.hints.repair = !!raw.hints.repair;
        out.hints.boss = !!raw.hints.boss;
      }
      out.sound = raw.sound !== false;
      out.music = raw.music !== false;
      out.lang = (raw.lang === "ru" || raw.lang === "en" || raw.lang === "tr") ? raw.lang : null;
      if (raw.daily && typeof raw.daily === "object") {
        out.daily.date = typeof raw.daily.date === "string" ? raw.daily.date : "";
        out.daily.streak = Math.floor(num(raw.daily.streak, 0, 0, 9999));
      }
      if (raw.ads && typeof raw.ads === "object") {
        out.ads.lastAt = num(raw.ads.lastAt, 0);
        out.ads.runsSince = Math.floor(num(raw.ads.runsSince, 99, 0, 9999));
      }
      if (raw.stats && typeof raw.stats === "object") {
        out.stats.blocks = Math.floor(num(raw.stats.blocks, 0));
        out.stats.perfect = Math.floor(num(raw.stats.perfect, 0));
        out.stats.crystals = Math.floor(num(raw.stats.crystals, 0));
        out.stats.bossKills = Math.floor(num(raw.stats.bossKills, 0));
        out.stats.bestWave = Math.floor(num(raw.stats.bestWave, 0));
      }
      return out;
    },
    load: function () {
      const raw = AG.Storage.get(AG.Save.KEY, null);
      if (!raw) return AG.Save.defaults();
      try {
        return AG.Save.normalize(JSON.parse(raw));
      } catch (e) {
        return AG.Save.defaults();
      }
    },
    store: function (save) {
      try {
        return AG.Storage.set(AG.Save.KEY, JSON.stringify(save));
      } catch (e) {
        return false;
      }
    },
    merge: function (a, b) {
      const base = AG.Save.normalize(a && a.updatedAt >= b.updatedAt ? a : b);
      const other = a && a.updatedAt >= b.updatedAt ? b : a;
      if (!other) return base;
      base.best = Math.max(base.best, Math.floor(Number(other.best) || 0));
      base.dust = Math.max(base.dust, Math.floor(Number(other.dust) || 0));
      base.runs = Math.max(base.runs, Math.floor(Number(other.runs) || 0));
      base.stats.blocks = Math.max(base.stats.blocks, Math.floor(Number(other.stats && other.stats.blocks) || 0));
      base.stats.perfect = Math.max(base.stats.perfect, Math.floor(Number(other.stats && other.stats.perfect) || 0));
      base.stats.crystals = Math.max(base.stats.crystals, Math.floor(Number(other.stats && other.stats.crystals) || 0));
      base.stats.bossKills = Math.max(base.stats.bossKills, Math.floor(Number(other.stats && other.stats.bossKills) || 0));
      base.stats.bestWave = Math.max(base.stats.bestWave, Math.floor(Number(other.stats && other.stats.bestWave) || 0));
      if (other.upgrades && typeof other.upgrades === "object") {
        for (const key of AG.UPGRADE_ORDER) {
          base.upgrades[key] = Math.max(base.upgrades[key], Math.min(AG.UPGRADES[key].max, Math.floor(Number(other.upgrades[key]) || 0)));
        }
      }
      if (other.achievements && typeof other.achievements === "object") {
        for (const id in other.achievements) {
          if (other.achievements[id]) base.achievements[id] = true;
        }
      }
      if (other.daily && typeof other.daily === "object") {
        base.daily.streak = Math.max(base.daily.streak, Math.floor(Number(other.daily.streak) || 0));
        if (String(other.daily.date || "") > String(base.daily.date || "")) {
          base.daily.date = other.daily.date;
        }
      }
      base.updatedAt = Math.max(Number(a && a.updatedAt) || 0, Number(b && b.updatedAt) || 0);
      return base;
    },
    dustForRun: function (score, wave, crystals, bossKills) {
      return Math.max(1,
        Math.floor(score / 300) +
        Math.max(0, wave - 1) * 3 +
        (crystals || 0) * 2 +
        (bossKills || 0) * 15
      );
    }
  };

  AG.todayKey = function (date) {
    const d = date || new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };

  AG.yesterdayKey = function () {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return AG.todayKey(d);
  };

  AG.dailyReward = function (streak) {
    return Math.min(80, 40 + Math.max(0, streak - 1) * 10);
  };

  AG.dailyAvailable = function (save) {
    return save.daily.date !== AG.todayKey();
  };

  AG.nextDailyStreak = function (save) {
    if (save.daily.date === AG.yesterdayKey()) return (save.daily.streak || 0) + 1;
    if (save.daily.date === AG.todayKey()) return Math.max(1, save.daily.streak || 0);
    return 1;
  };

  /* ------------------------------------------------------------------ */
  /* Art                                                                 */
  /* ------------------------------------------------------------------ */

  const Art = (AG.Art = {});
  const glowCache = new Map();

  function makeCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.ceil(w));
    c.height = Math.max(1, Math.ceil(h));
    return c;
  }
  Art.makeCanvas = makeCanvas;

  Art.glowSprite = function (color, size) {
    const s = size || 128;
    const key = color + "|" + s;
    if (glowCache.has(key)) return glowCache.get(key);
    const c = makeCanvas(s, s);
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, AG.rgba(color, 0.85));
    grad.addColorStop(0.26, AG.rgba(color, 0.42));
    grad.addColorStop(0.58, AG.rgba(color, 0.13));
    grad.addColorStop(1, AG.rgba(color, 0));
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
    glowCache.set(key, c);
    return c;
  };

  Art.drawGlow = function (ctx, color, x, y, radius, alpha) {
    if (radius <= 0 || alpha <= 0) return;
    const sprite = Art.glowSprite(color, 128);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
    ctx.restore();
  };

  Art.roundRect = function (ctx, x, y, w, h, r) {
    const rr = Math.min(typeof r === "number" ? r : 12, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  };

  Art.panel = function (ctx, x, y, w, h, opts) {
    const o = opts || {};
    const r = o.radius === undefined ? 18 : o.radius;
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, o.top || "rgba(12, 26, 48, 0.94)");
    g.addColorStop(1, o.bottom || "rgba(6, 15, 30, 0.96)");
    Art.roundRect(ctx, x, y, w, h, r);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = o.borderWidth || 1;
    ctx.strokeStyle = o.border || "rgba(118, 204, 232, 0.18)";
    ctx.stroke();
    if (o.highlight !== false) {
      ctx.beginPath();
      ctx.moveTo(x + r, y + 1);
      ctx.lineTo(x + w - r, y + 1);
      ctx.strokeStyle = "rgba(180, 255, 250, 0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    if (o.glow) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.3;
      Art.roundRect(ctx, x, y, w, h, r);
      ctx.strokeStyle = o.glow;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  };

  Art.spacedText = function (ctx, text, x, y, spacing, align) {
    text = String(text);
    const chars = Array.from(text);
    let total = 0;
    const widths = [];
    for (let i = 0; i < chars.length; i++) {
      const w = ctx.measureText(chars[i]).width;
      widths.push(w);
      total += w;
    }
    total += Math.max(0, chars.length - 1) * spacing;
    let px = x;
    if (align === "center") px -= total / 2;
    else if (align === "right" || align === "end") px -= total;
    const oldAlign = ctx.textAlign;
    ctx.textAlign = "left";
    for (let i = 0; i < chars.length; i++) {
      ctx.fillText(chars[i], px, y);
      px += widths[i] + spacing;
    }
    ctx.textAlign = oldAlign;
    return total;
  };

  Art.fitText = function (ctx, text, maxWidth, startSize) {
    let size = startSize;
    while (size > 8) {
      ctx.font = ctx.font.replace(/\d+(\.\d+)?px/, size + "px");
      if (ctx.measureText(text).width <= maxWidth) return size;
      size -= 1;
    }
    return size;
  };

  Art.wrap = function (ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = String(text).split(" ");
    let line = "";
    let lines = 0;
    for (let i = 0; i < words.length; i++) {
      const test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y + lines * lineHeight);
        line = words[i];
        lines++;
        if (maxLines && lines >= maxLines) return lines;
      } else {
        line = test;
      }
    }
    if (line) {
      ctx.fillText(line, x, y + lines * lineHeight);
      lines++;
    }
    return lines;
  };

  /* ---------------------------- icons ------------------------------ */

  const ICONS = {
    play: function (c) {
      c.beginPath();
      c.moveTo(8, 5.4);
      c.lineTo(19, 12);
      c.lineTo(8, 18.6);
      c.closePath();
      c.fill();
    },
    pause: function (c) {
      c.fillRect(7.5, 5.5, 3.4, 13);
      c.fillRect(13.1, 5.5, 3.4, 13);
    },
    back: function (c) {
      c.beginPath();
      c.moveTo(15.5, 5);
      c.lineTo(8.5, 12);
      c.lineTo(15.5, 19);
      c.stroke();
    },
    chevron: function (c) {
      c.beginPath();
      c.moveTo(9.5, 5.5);
      c.lineTo(16, 12);
      c.lineTo(9.5, 18.5);
      c.stroke();
    },
    up: function (c) {
      c.beginPath();
      c.moveTo(12, 19);
      c.lineTo(12, 6);
      c.moveTo(6.5, 11.5);
      c.lineTo(12, 6);
      c.lineTo(17.5, 11.5);
      c.stroke();
    },
    close: function (c) {
      c.beginPath();
      c.moveTo(6.5, 6.5);
      c.lineTo(17.5, 17.5);
      c.moveTo(17.5, 6.5);
      c.lineTo(6.5, 17.5);
      c.stroke();
    },
    trophy: function (c) {
      c.beginPath();
      c.moveTo(8, 4.5);
      c.lineTo(16, 4.5);
      c.lineTo(16, 8.5);
      c.bezierCurveTo(16, 12, 14, 13.6, 12, 13.6);
      c.bezierCurveTo(10, 13.6, 8, 12, 8, 8.5);
      c.closePath();
      c.stroke();
      c.beginPath();
      c.moveTo(8, 5.5);
      c.bezierCurveTo(4.7, 5.5, 4.7, 10.2, 8, 10.6);
      c.moveTo(16, 5.5);
      c.bezierCurveTo(19.3, 5.5, 19.3, 10.2, 16, 10.6);
      c.moveTo(12, 13.6);
      c.lineTo(12, 17);
      c.moveTo(8.5, 19.5);
      c.lineTo(15.5, 19.5);
      c.stroke();
    },
    medal: function (c) {
      c.beginPath();
      c.arc(12, 9.2, 4.7, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.moveTo(8.7, 12.9);
      c.lineTo(7, 20);
      c.lineTo(12, 17.6);
      c.lineTo(17, 20);
      c.lineTo(15.3, 12.9);
      c.stroke();
      c.beginPath();
      c.arc(12, 9.2, 2, 0, Math.PI * 2);
      c.fill();
    },
    upgrade: function (c) {
      c.beginPath();
      c.moveTo(12, 4.5);
      c.lineTo(18, 11);
      c.lineTo(14.5, 11);
      c.lineTo(14.5, 19.5);
      c.lineTo(9.5, 19.5);
      c.lineTo(9.5, 11);
      c.lineTo(6, 11);
      c.closePath();
      c.stroke();
    },
    gear: function (c) {
      c.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const r1 = 8.3;
        const r2 = 5.6;
        c.lineTo(12 + Math.cos(a - 0.18) * r1, 12 + Math.sin(a - 0.18) * r1);
        c.lineTo(12 + Math.cos(a + 0.18) * r1, 12 + Math.sin(a + 0.18) * r1);
        c.lineTo(12 + Math.cos(a + 0.4) * r2, 12 + Math.sin(a + 0.4) * r2);
      }
      c.closePath();
      c.stroke();
      c.beginPath();
      c.arc(12, 12, 2.6, 0, Math.PI * 2);
      c.stroke();
    },
    sound: function (c) {
      c.beginPath();
      c.moveTo(4.5, 9.5);
      c.lineTo(8, 9.5);
      c.lineTo(12, 5.8);
      c.lineTo(12, 18.2);
      c.lineTo(8, 14.5);
      c.lineTo(4.5, 14.5);
      c.closePath();
      c.stroke();
      c.beginPath();
      c.arc(13.5, 12, 3.4, -0.9, 0.9);
      c.stroke();
      c.beginPath();
      c.arc(14.3, 12, 6.2, -0.9, 0.9);
      c.stroke();
    },
    mute: function (c) {
      c.beginPath();
      c.moveTo(4.5, 9.5);
      c.lineTo(8, 9.5);
      c.lineTo(12, 5.8);
      c.lineTo(12, 18.2);
      c.lineTo(8, 14.5);
      c.lineTo(4.5, 14.5);
      c.closePath();
      c.stroke();
      c.beginPath();
      c.moveTo(15, 9.5);
      c.lineTo(20, 14.5);
      c.moveTo(20, 9.5);
      c.lineTo(15, 14.5);
      c.stroke();
    },
    music: function (c) {
      c.beginPath();
      c.moveTo(9.5, 18);
      c.lineTo(9.5, 5.5);
      c.lineTo(18.5, 3.6);
      c.lineTo(18.5, 15.6);
      c.stroke();
      c.beginPath();
      c.arc(7.1, 18, 2.5, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.arc(16.1, 15.6, 2.5, 0, Math.PI * 2);
      c.fill();
    },
    globe: function (c) {
      c.beginPath();
      c.arc(12, 12, 8.4, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.ellipse(12, 12, 4, 8.4, 0, 0, Math.PI * 2);
      c.moveTo(3.6, 12);
      c.lineTo(20.4, 12);
      c.stroke();
    },
    gift: function (c) {
      c.beginPath();
      c.moveTo(4.5, 10.5);
      c.lineTo(19.5, 10.5);
      c.lineTo(19.5, 20);
      c.lineTo(4.5, 20);
      c.closePath();
      c.stroke();
      c.beginPath();
      c.moveTo(3.2, 7);
      c.lineTo(20.8, 7);
      c.lineTo(20.8, 10.5);
      c.lineTo(3.2, 10.5);
      c.closePath();
      c.stroke();
      c.beginPath();
      c.moveTo(12, 7);
      c.lineTo(12, 20);
      c.moveTo(12, 7);
      c.bezierCurveTo(9, 2.8, 4.4, 4.6, 6.2, 7);
      c.moveTo(12, 7);
      c.bezierCurveTo(15, 2.8, 19.6, 4.6, 17.8, 7);
      c.stroke();
    },
    lock: function (c) {
      c.beginPath();
      c.arc(12, 9.5, 4, Math.PI, 0);
      c.stroke();
      c.beginPath();
      c.moveTo(7.7, 9.5);
      c.lineTo(7.7, 20);
      c.lineTo(16.3, 20);
      c.lineTo(16.3, 9.5);
      c.stroke();
      c.beginPath();
      c.arc(12, 14.6, 1.2, 0, Math.PI * 2);
      c.fill();
    },
    check: function (c) {
      c.beginPath();
      c.moveTo(4.8, 12.6);
      c.lineTo(9.8, 17.5);
      c.lineTo(19.4, 6.8);
      c.stroke();
    },
    ad: function (c) {
      c.beginPath();
      c.moveTo(4, 9.5);
      c.lineTo(9.5, 9.5);
      c.lineTo(18, 4.5);
      c.lineTo(18, 19.5);
      c.lineTo(9.5, 14.5);
      c.lineTo(4, 14.5);
      c.closePath();
      c.stroke();
      c.beginPath();
      c.moveTo(7, 14.8);
      c.lineTo(8.4, 20.2);
      c.stroke();
    },
    refresh: function (c) {
      c.beginPath();
      c.arc(12, 12, 7.5, 0.6, Math.PI * 1.55);
      c.stroke();
      c.beginPath();
      c.moveTo(18.4, 5.2);
      c.lineTo(18.9, 10.6);
      c.lineTo(13.7, 9.2);
      c.stroke();
    },
    info: function (c) {
      c.beginPath();
      c.arc(12, 12, 8.3, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.arc(12, 7.6, 0.9, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.moveTo(12, 11);
      c.lineTo(12, 17);
      c.stroke();
    },
    spark: function (c) {
      c.beginPath();
      c.moveTo(12, 3);
      c.lineTo(14.1, 9.9);
      c.lineTo(21, 12);
      c.lineTo(14.1, 14.1);
      c.lineTo(12, 21);
      c.lineTo(9.9, 14.1);
      c.lineTo(3, 12);
      c.lineTo(9.9, 9.9);
      c.closePath();
      c.fill();
    },
    bolt: function (c) {
      c.beginPath();
      c.moveTo(13.4, 3);
      c.lineTo(6.4, 13.2);
      c.lineTo(11.1, 13.2);
      c.lineTo(10.2, 21);
      c.lineTo(17.8, 10.3);
      c.lineTo(12.9, 10.3);
      c.closePath();
      c.fill();
    },
    hull: function (c) {
      c.beginPath();
      c.moveTo(12, 3.2);
      c.lineTo(19.6, 6.4);
      c.lineTo(19.6, 12.2);
      c.bezierCurveTo(19.6, 16.5, 16.5, 19.4, 12, 21);
      c.bezierCurveTo(7.5, 19.4, 4.4, 16.5, 4.4, 12.2);
      c.lineTo(4.4, 6.4);
      c.closePath();
      c.stroke();
      c.beginPath();
      c.arc(12, 11.6, 2.2, 0, Math.PI * 2);
      c.fill();
    },
    warning: function (c) {
      c.beginPath();
      c.moveTo(12, 3.5);
      c.lineTo(21, 20);
      c.lineTo(3, 20);
      c.closePath();
      c.stroke();
      c.beginPath();
      c.moveTo(12, 9);
      c.lineTo(12, 14.2);
      c.stroke();
      c.beginPath();
      c.arc(12, 17, 0.9, 0, Math.PI * 2);
      c.fill();
    },
    target: function (c) {
      c.beginPath();
      c.arc(12, 12, 8.2, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.arc(12, 12, 3.4, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.moveTo(12, 1.8);
      c.lineTo(12, 5.6);
      c.moveTo(12, 18.4);
      c.lineTo(12, 22.2);
      c.moveTo(1.8, 12);
      c.lineTo(5.6, 12);
      c.moveTo(18.4, 12);
      c.lineTo(22.2, 12);
      c.stroke();
    }
  };

  Art.icon = function (ctx, name, x, y, size, color, filled) {
    const fn = ICONS[name];
    if (!fn) return;
    ctx.save();
    ctx.translate(x - size / 2, y - size / 2);
    ctx.scale(size / 24, size / 24);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    fn(ctx);
    ctx.restore();
  };

  /* --------------------------- planet ------------------------------ */

  const PLANET_BANDS = [
    "#0a2338", "#11506d", "#1d8291", "#4fd0c8", "#2a8c9e",
    "#123a5b", "#0b2a44", "#7be6d6", "#1d617d", "#14324f"
  ];

  let planetTexture = null;

  function makePlanetTexture() {
    const W = 1024, H = 512;
    const c = makeCanvas(W, H);
    const g = c.getContext("2d");
    const rnd = AG.mulberry32(271828);

    const base = g.createLinearGradient(0, 0, 0, H);
    base.addColorStop(0, "#0a2234");
    base.addColorStop(0.28, "#124d63");
    base.addColorStop(0.52, "#176b7e");
    base.addColorStop(0.76, "#0d3b54");
    base.addColorStop(1, "#071a2a");
    g.fillStyle = base;
    g.fillRect(0, 0, W, H);

    const bands = 30;
    for (let i = 0; i < bands; i++) {
      const y0 = (i / bands) * H + (rnd() - 0.5) * 10;
      const bh = (H / bands) * (0.65 + rnd() * 0.9);
      const color = PLANET_BANDS[i % PLANET_BANDS.length];
      const amp = 5 + rnd() * 15;
      const k = 1 + Math.floor(rnd() * 3);
      const phase = rnd() * AG.TAU;
      const alpha = 0.14 + rnd() * 0.34;
      const grad = g.createLinearGradient(0, y0, 0, y0 + bh);
      grad.addColorStop(0, AG.rgba(color, 0.01));
      grad.addColorStop(0.32, AG.rgba(color, alpha));
      grad.addColorStop(0.66, AG.rgba(color, alpha * 0.95));
      grad.addColorStop(1, AG.rgba(color, 0.01));
      g.beginPath();
      for (let x = -24; x <= W + 24; x += 12) {
        const yy = y0 + Math.sin((x / W) * AG.TAU * k + phase) * amp +
          Math.sin((x / W) * AG.TAU * (k + 2) + phase * 1.7) * amp * 0.32;
        if (x === -24) g.moveTo(x, yy);
        else g.lineTo(x, yy);
      }
      for (let x = W + 24; x >= -24; x -= 12) {
        const yy = y0 + bh + Math.sin((x / W) * AG.TAU * k + phase) * amp * 0.75 +
          Math.sin((x / W) * AG.TAU * (k + 2) + phase * 1.7) * amp * 0.3;
        g.lineTo(x, yy);
      }
      g.closePath();
      g.fillStyle = grad;
      g.fill();
    }

    for (let i = 0; i < 26; i++) {
      const yy = H * (0.1 + rnd() * 0.8);
      const w = W * (0.08 + rnd() * 0.3);
      const h = 2 + rnd() * 8;
      const grad = g.createLinearGradient(0, yy - h, 0, yy + h);
      grad.addColorStop(0, "rgba(190, 255, 247, 0)");
      grad.addColorStop(0.5, "rgba(200, 255, 250, " + (0.035 + rnd() * 0.07) + ")");
      grad.addColorStop(1, "rgba(190, 255, 247, 0)");
      g.save();
      g.translate(rnd() * W, yy);
      g.rotate((rnd() - 0.5) * 0.06);
      g.scale(1, 0.3 + rnd() * 0.5);
      g.beginPath();
      g.arc(0, 0, w, 0, AG.TAU);
      g.fillStyle = grad;
      g.fill();
      g.restore();
    }

    g.save();
    g.filter = "blur(5px)";
    for (let i = 0; i < 22; i++) {
      const yy = H * (0.15 + rnd() * 0.7);
      const w = W * (0.04 + rnd() * 0.22);
      const h = 2 + rnd() * 9;
      g.save();
      g.translate(rnd() * W, yy);
      g.scale(1, 0.25 + rnd() * 0.5);
      g.beginPath();
      g.arc(0, 0, w, 0, AG.TAU);
      g.fillStyle = "rgba(145, 245, 235, " + (0.035 + rnd() * 0.065) + ")";
      g.fill();
      g.restore();
    }
    g.restore();

    const storms = [
      { x: 0.28, y: 0.47, w: 0.11, h: 0.045, color: "245, 190, 120", a: 0.34, rot: -0.26 },
      { x: 0.66, y: 0.58, w: 0.075, h: 0.032, color: "255, 211, 155", a: 0.26, rot: 0.2 },
      { x: 0.52, y: 0.36, w: 0.05, h: 0.02, color: "170, 255, 238", a: 0.22, rot: 0.1 }
    ];
    for (const s of storms) {
      g.save();
      g.translate(s.x * W, s.y * H);
      g.rotate(s.rot);
      g.scale(s.w * W, s.h * H);
      const grad = g.createRadialGradient(0, 0, 0.1, 0, 0, 1);
      grad.addColorStop(0, "rgba(" + s.color + ", " + s.a + ")");
      grad.addColorStop(0.42, "rgba(" + s.color + ", " + s.a * 0.45 + ")");
      grad.addColorStop(0.78, "rgba(" + s.color + ", " + s.a * 0.1 + ")");
      grad.addColorStop(1, "rgba(" + s.color + ", 0)");
      g.fillStyle = grad;
      g.beginPath();
      g.arc(0, 0, 1, 0, AG.TAU);
      g.fill();
      g.restore();
    }

    const pole = g.createLinearGradient(0, 0, 0, H * 0.16);
    pole.addColorStop(0, "rgba(204, 250, 242, 0.26)");
    pole.addColorStop(1, "rgba(204, 250, 242, 0)");
    g.fillStyle = pole;
    g.fillRect(0, 0, W, H * 0.16);
    const pole2 = g.createLinearGradient(0, H, 0, H * 0.84);
    pole2.addColorStop(0, "rgba(184, 235, 232, 0.2)");
    pole2.addColorStop(1, "rgba(184, 235, 232, 0)");
    g.fillStyle = pole2;
    g.fillRect(0, H * 0.84, W, H * 0.16);

    const img = g.getImageData(0, 0, W, H);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (rnd() - 0.5) * 9;
      data[i] = AG.clamp(data[i] + n, 0, 255);
      data[i + 1] = AG.clamp(data[i + 1] + n, 0, 255);
      data[i + 2] = AG.clamp(data[i + 2] + n * 0.8, 0, 255);
    }
    g.putImageData(img, 0, 0);
    return c;
  }

  Art.drawPlanet = function (ctx, x, y, r, time, opts) {
    const o = opts || {};
    const t = time || 0;
    if (!planetTexture) planetTexture = makePlanetTexture();
    ctx.save();
    ctx.translate(x, y);

    Art.drawGlow(ctx, o.glowColor || "#36ded3", 0, 0, r * (o.glow || 2.0), 0.2);
    Art.drawGlow(ctx, "#1d7c9e", 0, 0, r * 1.2, 0.16);

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, AG.TAU);
    ctx.clip();

    const texW = r * 4;
    const texH = r * 2;
    let shift = (t * r * 0.035) % texW;
    if (shift < 0) shift += texW;
    ctx.drawImage(planetTexture, -r - shift, -r, texW, texH);
    ctx.drawImage(planetTexture, -r - shift + texW, -r, texW, texH);

    const shade = ctx.createRadialGradient(-r * 0.58, -r * 0.55, r * 0.12, -r * 0.05, -r * 0.05, r * 1.38);
    shade.addColorStop(0, "rgba(0, 0, 0, 0)");
    shade.addColorStop(0.4, "rgba(1, 7, 17, 0.07)");
    shade.addColorStop(0.7, "rgba(1, 5, 13, 0.36)");
    shade.addColorStop(0.92, "rgba(0, 2, 8, 0.78)");
    shade.addColorStop(1, "rgba(0, 2, 7, 0.92)");
    ctx.fillStyle = shade;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    const term = ctx.createLinearGradient(r * 0.15, 0, r * 1.05, 0);
    term.addColorStop(0, "rgba(1, 4, 12, 0)");
    term.addColorStop(0.65, "rgba(1, 4, 12, 0.18)");
    term.addColorStop(1, "rgba(0, 2, 8, 0.46)");
    ctx.fillStyle = term;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    const lit = ctx.createRadialGradient(-r * 0.4, -r * 0.45, r * 0.04, -r * 0.3, -r * 0.3, r * 0.98);
    lit.addColorStop(0, "rgba(224, 255, 250, 0.2)");
    lit.addColorStop(0.36, "rgba(157, 255, 245, 0.09)");
    lit.addColorStop(1, "rgba(157, 255, 245, 0)");
    ctx.fillStyle = lit;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.987, Math.PI * 1.03, Math.PI * 1.73);
    ctx.strokeStyle = "rgba(203, 255, 251, 0.7)";
    ctx.lineWidth = Math.max(1, r * 0.018);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.985, Math.PI * 0.03, Math.PI * 0.35);
    ctx.strokeStyle = "rgba(88, 240, 226, 0.2)";
    ctx.lineWidth = Math.max(1, r * 0.028);
    ctx.stroke();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(0, 0, r + 0.6, 0, AG.TAU);
    ctx.strokeStyle = "rgba(126, 235, 228, 0.22)";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (o.moons) {
      for (let i = 0; i < o.moons; i++) {
        const a = t * (0.08 + i * 0.03) + i * 2.2;
        const mr = r * (1.45 + i * 0.23);
        const mx = Math.cos(a) * mr;
        const my = Math.sin(a) * mr * 0.42;
        const size = Math.max(1.3, r * (0.024 + i * 0.007));
        ctx.beginPath();
        ctx.arc(mx, my, size, 0, AG.TAU);
        ctx.fillStyle = i % 2 ? "rgba(160, 190, 215, 0.65)" : "rgba(255, 210, 160, 0.62)";
        ctx.fill();
      }
    }

    ctx.restore();
  };

  /* --------------------------- shield ------------------------------ */

  Art.drawShield = function (ctx, cx, cy, radius, angle, halfWidth, opts) {
    const o = opts || {};
    const t = o.time || 0;
    const energy = o.energy === undefined ? 1 : AG.clamp(o.energy, 0, 1);
    const active = o.active !== false;
    const low = energy < 0.25;
    const color = active ? (low ? "#ff8266" : "#4ef0e2") : "#ff5b63";
    const a0 = angle - halfWidth;
    const a1 = angle + halfWidth;

    ctx.save();
    ctx.translate(cx, cy);

    if (!active) {
      ctx.globalAlpha = 0.35 + 0.2 * Math.sin(t * 18);
      ctx.beginPath();
      ctx.arc(0, 0, radius, a0, a1);
      ctx.setLineDash([4, 12]);
      ctx.strokeStyle = "#ff5b63";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      return;
    }

    Art.drawGlow(ctx, color, Math.cos(angle) * radius, Math.sin(angle) * radius, radius * 0.62, 0.16);

    const layers = [
      { w: 26, a: 0.045 },
      { w: 15, a: 0.075 },
      { w: 8, a: 0.16 },
      { w: 3.2, a: 0.7 },
      { w: 1, a: 0.92 }
    ];
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < layers.length; i++) {
      const l = layers[i];
      ctx.beginPath();
      ctx.arc(0, 0, radius, a0, a1);
      ctx.strokeStyle = AG.rgba(color, l.a);
      ctx.lineWidth = l.w;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    const perfect = halfWidth * 0.44;
    ctx.beginPath();
    ctx.arc(0, 0, radius, angle - perfect, angle + perfect);
    ctx.strokeStyle = AG.rgba(o.perfectColor || "#ffe9a8", 0.26);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius, angle - perfect, angle + perfect);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.globalCompositeOperation = "source-over";

    for (let i = -3; i <= 3; i++) {
      const ta = angle + (i / 3) * halfWidth * 0.86;
      const inner = radius - (i === 0 ? 10 : 6);
      const outer = radius + (i === 0 ? 9 : 5);
      ctx.beginPath();
      ctx.moveTo(Math.cos(ta) * inner, Math.sin(ta) * inner);
      ctx.lineTo(Math.cos(ta) * outer, Math.sin(ta) * outer);
      ctx.strokeStyle = i === 0 ? "rgba(255, 255, 255, 0.8)" : "rgba(122, 255, 246, 0.4)";
      ctx.lineWidth = i === 0 ? 1.6 : 1;
      ctx.stroke();
    }

    for (let side = 0; side < 2; side++) {
      const ea = side === 0 ? a0 : a1;
      const ex = Math.cos(ea) * radius;
      const ey = Math.sin(ea) * radius;
      Art.drawGlow(ctx, color, ex, ey, 22, 0.6);
      ctx.beginPath();
      ctx.arc(ex, ey, 5.2, 0, AG.TAU);
      ctx.fillStyle = "rgba(7, 22, 36, 0.9)";
      ctx.fill();
      ctx.strokeStyle = AG.rgba(color, 0.95);
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ex, ey, 2, 0, AG.TAU);
      ctx.fillStyle = color;
      ctx.fill();
    }

    if (o.energyRing !== false) {
      const er = radius - 20;
      ctx.beginPath();
      ctx.arc(0, 0, er, 0, AG.TAU);
      ctx.strokeStyle = "rgba(100, 160, 190, 0.065)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, er, -Math.PI / 2, -Math.PI / 2 + AG.TAU * energy);
      ctx.strokeStyle = AG.rgba(low ? "#ff8266" : color, 0.38);
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    if (low) {
      ctx.globalAlpha = 0.35 + 0.25 * Math.sin(t * 10);
      ctx.beginPath();
      ctx.arc(0, 0, radius + 12, a0, a1);
      ctx.strokeStyle = "#ff6a5e";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  };

  /* ------------------------ asteroid sprites ----------------------- */

  const rockSprites = [];
  const splitSprites = [];

  function makeRock(seed, split) {
    const rnd = AG.mulberry32(seed);
    const size = 160;
    const c = makeCanvas(size, size);
    const g = c.getContext("2d");
    const cx = 80, cy = 80;
    const baseR = 58;
    const points = [];
    const n = 12 + Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * AG.TAU;
      const rr = baseR * (0.78 + rnd() * 0.26);
      points.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    const grad = g.createRadialGradient(cx - 18, cy - 22, 6, cx, cy, baseR * 1.25);
    grad.addColorStop(0, split ? "#9c7468" : "#9aa9bd");
    grad.addColorStop(0.32, split ? "#704a44" : "#5d6e86");
    grad.addColorStop(0.72, split ? "#432a2a" : "#303c51");
    grad.addColorStop(1, split ? "#1e1216" : "#161d2b");
    g.beginPath();
    g.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      const prev = points[i - 1];
      const mx = (prev[0] + p[0]) / 2 + (rnd() - 0.5) * 9;
      const my = (prev[1] + p[1]) / 2 + (rnd() - 0.5) * 9;
      g.quadraticCurveTo(mx, my, p[0], p[1]);
    }
    g.closePath();
    g.fillStyle = grad;
    g.fill();
    g.strokeStyle = split ? "rgba(255, 154, 120, 0.22)" : "rgba(174, 214, 238, 0.25)";
    g.lineWidth = 2;
    g.stroke();

    g.save();
    g.clip();
    for (let i = 0; i < 8; i++) {
      const a = rnd() * AG.TAU;
      const d = rnd() * baseR * 0.72;
      const cr = 3 + rnd() * 11;
      const x = cx + Math.cos(a) * d;
      const y = cy + Math.sin(a) * d;
      const cg = g.createRadialGradient(x - cr * 0.3, y - cr * 0.3, 0, x, y, cr);
      cg.addColorStop(0, "rgba(4, 9, 18, 0.5)");
      cg.addColorStop(0.75, "rgba(10, 17, 28, 0.28)");
      cg.addColorStop(1, "rgba(150, 190, 215, 0.04)");
      g.fillStyle = cg;
      g.beginPath();
      g.arc(x, y, cr, 0, AG.TAU);
      g.fill();
    }
    g.restore();

    if (split) {
      g.beginPath();
      g.moveTo(cx - 34, cy - 50);
      g.lineTo(cx - 6, cy - 12);
      g.lineTo(cx - 20, cy + 10);
      g.lineTo(cx + 8, cy + 52);
      g.moveTo(cx - 6, cy - 12);
      g.lineTo(cx + 30, cy - 2);
      g.lineTo(cx + 42, cy + 26);
      g.strokeStyle = "rgba(255, 137, 92, 0.55)";
      g.lineWidth = 2.4;
      g.stroke();
      g.strokeStyle = "rgba(255, 218, 160, 0.22)";
      g.lineWidth = 1;
      g.stroke();
    }

    g.beginPath();
    g.arc(cx - 22, cy - 26, 20, Math.PI * 1.05, Math.PI * 1.55);
    g.strokeStyle = "rgba(226, 250, 255, 0.18)";
    g.lineWidth = 3;
    g.stroke();

    return c;
  }

  for (let i = 0; i < 6; i++) rockSprites.push(makeRock(1000 + i * 77, false));
  for (let i = 0; i < 3; i++) splitSprites.push(makeRock(5000 + i * 131, true));

  Art.drawRock = function (ctx, x, y, r, rot, opts) {
    const o = opts || {};
    const list = o.split ? splitSprites : rockSprites;
    const sprite = list[(o.variant || 0) % list.length];
    const size = r * 2.85;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot || 0);
    ctx.globalAlpha = o.alpha === undefined ? 1 : o.alpha;
    if (o.trail) {
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = AG.rgba(o.split ? "#ff8f68" : "#7fc7e8", 0.14);
      ctx.lineWidth = r * 0.75;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(Math.cos(o.trailAngle || 0) * -r * 2.2, Math.sin(o.trailAngle || 0) * -r * 2.2);
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = o.alpha === undefined ? 1 : o.alpha;
    }
    ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
    ctx.restore();
  };

  Art.drawCrystal = function (ctx, x, y, r, rot, time, alpha) {
    const t = time || 0;
    const pulse = 0.82 + 0.18 * Math.sin(t * 5);
    Art.drawGlow(ctx, "#5ffbf1", x, y, r * 3.1 * pulse, 0.4 * (alpha === undefined ? 1 : alpha));
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot || 0);
    ctx.globalAlpha = alpha === undefined ? 1 : alpha;
    const g = ctx.createLinearGradient(-r, -r, r, r);
    g.addColorStop(0, "#c8ffff");
    g.addColorStop(0.4, "#4ef0e2");
    g.addColorStop(1, "#0e7b91");
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.55);
    ctx.lineTo(r * 0.92, -r * 0.2);
    ctx.lineTo(r * 0.55, r * 1.35);
    ctx.lineTo(-r * 0.55, r * 1.35);
    ctx.lineTo(-r * 0.92, -r * 0.2);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "rgba(220, 255, 255, 0.85)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.55);
    ctx.lineTo(0, r * 1.2);
    ctx.lineTo(-r * 0.92, -r * 0.2);
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.1);
    ctx.lineTo(r * 0.5, -r * 0.35);
    ctx.lineTo(r * 0.3, r * 0.75);
    ctx.strokeStyle = "rgba(5, 35, 45, 0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  };

  Art.drawRepair = function (ctx, x, y, r, time, alpha) {
    const t = time || 0;
    const pulse = 0.85 + 0.15 * Math.sin(t * 4.2);
    Art.drawGlow(ctx, "#8dff9d", x, y, r * 3.2 * pulse, 0.36 * (alpha === undefined ? 1 : alpha));
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t * 0.6);
    ctx.globalAlpha = alpha === undefined ? 1 : alpha;
    const g = ctx.createLinearGradient(-r, -r, r, r);
    g.addColorStop(0, "#d6ffe0");
    g.addColorStop(0.5, "#69e884");
    g.addColorStop(1, "#116f3d");
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * AG.TAU - Math.PI / 2;
      const px = Math.cos(a) * r * 1.25;
      const py = Math.sin(a) * r * 1.25;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "rgba(220, 255, 228, 0.8)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = "rgba(6, 40, 24, 0.7)";
    ctx.fillRect(-r * 0.2, -r * 0.65, r * 0.4, r * 1.3);
    ctx.fillRect(-r * 0.65, -r * 0.2, r * 1.3, r * 0.4);
    ctx.restore();
  };

  Art.drawOrb = function (ctx, x, y, r, time, alpha) {
    Art.drawGlow(ctx, "#ff6b7d", x, y, r * 4.2, 0.42 * (alpha === undefined ? 1 : alpha));
    Art.drawGlow(ctx, "#ffd36d", x, y, r * 2.2, 0.4 * (alpha === undefined ? 1 : alpha));
    ctx.save();
    ctx.globalAlpha = alpha === undefined ? 1 : alpha;
    const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
    g.addColorStop(0, "#fff6d0");
    g.addColorStop(0.45, "#ffb35f");
    g.addColorStop(0.8, "#ff4f62");
    g.addColorStop(1, "#8a1739");
    ctx.beginPath();
    ctx.arc(x, y, r, 0, AG.TAU);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 228, 180, 0.8)";
    ctx.lineWidth = 1;
    ctx.stroke();
    const a = (time || 0) * 3;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.75, r * 0.6, a, 0, AG.TAU);
    ctx.strokeStyle = "rgba(255, 164, 120, 0.32)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  };

  Art.drawBoss = function (ctx, x, y, r, time, hpRatio, telegraph) {
    const t = time || 0;
    ctx.save();
    ctx.translate(x, y);
    Art.drawGlow(ctx, "#ff5b7f", 0, 0, r * 2.4, 0.24);
    Art.drawGlow(ctx, "#ffb35f", 0, 0, r * 1.3, 0.22);

    ctx.save();
    ctx.rotate(t * 0.35);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.ellipse(0, 0, r * (1.35 + i * 0.19), r * (0.42 + i * 0.09), i * 0.9 + t * 0.1, 0, AG.TAU);
      ctx.strokeStyle = "rgba(255, 132, 146, " + (0.3 - i * 0.06) + ")";
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.rotate(-t * 0.22);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * AG.TAU;
      const r1 = r * 1.04;
      const r2 = r * (1.26 + 0.1 * Math.sin(t * 2 + i));
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.strokeStyle = "rgba(255, 120, 140, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();

    const body = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
    body.addColorStop(0, "#ffd3a1");
    body.addColorStop(0.2, "#ff8d72");
    body.addColorStop(0.56, "#a93056");
    body.addColorStop(0.86, "#431634");
    body.addColorStop(1, "#16081a");
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * AG.TAU;
      const rr = r * (0.9 + 0.1 * Math.sin(i * 2.7 + t));
      if (i === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
      else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fillStyle = body;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 192, 150, 0.55)";
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.5, 0, AG.TAU);
    ctx.fillStyle = "rgba(255, 238, 190, 0.16)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.32, 0, AG.TAU);
    ctx.fillStyle = "#ffe9a8";
    ctx.globalAlpha = 0.7 + 0.25 * Math.sin(t * 3);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.72, 0, AG.TAU);
    ctx.strokeStyle = "rgba(255, 217, 160, 0.28)";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (hpRatio !== undefined) {
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.13, -Math.PI / 2, -Math.PI / 2 + AG.TAU * AG.clamp(hpRatio, 0, 1));
      ctx.strokeStyle = "rgba(255, 108, 129, 0.8)";
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    if (telegraph) {
      ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 22);
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.18, 0, AG.TAU);
      ctx.strokeStyle = "#ffe9a8";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  };

  /* --------------------------- backdrop ---------------------------- */

  Art.makeBackdrop = function (w, h, seed) {
    const c = makeCanvas(w, h);
    const g = c.getContext("2d");
    const rnd = AG.mulberry32(seed || 90210);
    const bg = g.createLinearGradient(0, 0, w * 0.3, h);
    bg.addColorStop(0, "#04070f");
    bg.addColorStop(0.45, "#07101f");
    bg.addColorStop(1, "#03060d");
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);

    const nebulas = [
      { x: 0.76, y: 0.3, r: 0.68, color: "44, 150, 158", a: 0.12 },
      { x: 0.18, y: 0.78, r: 0.58, color: "102, 47, 128", a: 0.13 },
      { x: 0.52, y: 0.52, r: 0.5, color: "24, 70, 128", a: 0.1 },
      { x: 0.9, y: 0.82, r: 0.36, color: "172, 54, 94", a: 0.055 },
      { x: 0.08, y: 0.16, r: 0.34, color: "42, 102, 150", a: 0.08 }
    ];
    for (const n of nebulas) {
      const x = n.x * w, y = n.y * h, r = n.r * Math.max(w, h);
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, "rgba(" + n.color + ", " + n.a + ")");
      grad.addColorStop(0.48, "rgba(" + n.color + ", " + n.a * 0.36 + ")");
      grad.addColorStop(1, "rgba(" + n.color + ", 0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, w, h);
    }

    g.save();
    g.translate(w * 0.5, h * 0.48);
    g.rotate(-0.52);
    const band = g.createLinearGradient(0, -h * 0.2, 0, h * 0.2);
    band.addColorStop(0, "rgba(120, 170, 220, 0)");
    band.addColorStop(0.45, "rgba(140, 190, 235, 0.035)");
    band.addColorStop(0.55, "rgba(180, 225, 245, 0.05)");
    band.addColorStop(1, "rgba(120, 170, 220, 0)");
    g.fillStyle = band;
    g.fillRect(-w, -h * 0.24, w * 2, h * 0.48);
    g.restore();

    const starColors = ["#dff6ff", "#dff6ff", "#dff6ff", "#a9e8ff", "#ffe2b0", "#ffd2dd"];
    for (let i = 0; i < 320; i++) {
      const x = rnd() * w;
      const y = rnd() * h;
      const r = 0.25 + Math.pow(rnd(), 2.1) * 1.5;
      const a = 0.18 + rnd() * 0.65;
      g.globalAlpha = a;
      g.fillStyle = starColors[Math.floor(rnd() * starColors.length)];
      g.beginPath();
      g.arc(x, y, r, 0, AG.TAU);
      g.fill();
      if (r > 1.35) {
        g.globalAlpha = a * 0.4;
        g.strokeStyle = g.fillStyle;
        g.lineWidth = 0.7;
        g.beginPath();
        g.moveTo(x - r * 3.4, y);
        g.lineTo(x + r * 3.4, y);
        g.moveTo(x, y - r * 3.4);
        g.lineTo(x, y + r * 3.4);
        g.stroke();
      }
    }
    g.globalAlpha = 1;

    for (let i = 0; i < 9; i++) {
      const x = rnd() * w;
      const y = rnd() * h;
      const r = 18 + rnd() * 54;
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, "rgba(90, 170, 200, 0.032)");
      grad.addColorStop(1, "rgba(90, 170, 200, 0)");
      g.fillStyle = grad;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }

    const vig = g.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.2, w * 0.5, h * 0.5, Math.max(w, h) * 0.78);
    vig.addColorStop(0, "rgba(0, 0, 0, 0)");
    vig.addColorStop(0.72, "rgba(0, 0, 0, 0.18)");
    vig.addColorStop(1, "rgba(0, 0, 0, 0.56)");
    g.fillStyle = vig;
    g.fillRect(0, 0, w, h);

    return c;
  };

  Art.stars = function (seed, w, h, count) {
    const rnd = AG.mulberry32(seed || 777);
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push({
        x: rnd() * w,
        y: rnd() * h,
        r: 0.4 + rnd() * 1.3,
        a: 0.2 + rnd() * 0.6,
        p: rnd() * AG.TAU,
        s: 0.5 + rnd() * 1.7
      });
    }
    return out;
  };

  Art.drawTwinkles = function (ctx, stars, time) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const a = s.a * (0.45 + 0.55 * Math.sin(time * s.s + s.p));
      if (a <= 0.03) continue;
      ctx.globalAlpha = a;
      ctx.fillStyle = "#dff8ff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, AG.TAU);
      ctx.fill();
    }
    ctx.restore();
  };

  AG.Art.drawSpacedText = Art.spacedText;
  AG.Art.percent = function (v) { return Math.round(v * 100); };
})();

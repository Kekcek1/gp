// Процедурная графика рыб: силуэты, узоры, свечение, портреты для коллекции.

import { hashString, mulberry32 } from './core.js';

const patternCache = new WeakMap();

function patternPoints(fish) {
  if (patternCache.has(fish)) return patternCache.get(fish);
  const rng = mulberry32(hashString(`pattern-${fish.id}`));
  const points = [];
  for (let i = 0; i < 26; i++) {
    points.push({ x: rng() * 2 - 1, y: rng() * 2 - 1, r: 0.02 + rng() * 0.055, a: 0.25 + rng() * 0.5 });
  }
  patternCache.set(fish, points);
  return points;
}

function bodyHalf(shape) {
  switch (shape) {
    case 'round': return 0.34;
    case 'torpedo': return 0.2;
    case 'flat': return 0.4;
    case 'ribbon': return 0.1;
    case 'ray': return 0.3;
    case 'whale': return 0.28;
    case 'catfish': return 0.24;
    case 'angel': return 0.34;
    case 'sturgeon': return 0.2;
    case 'sword': return 0.17;
    case 'dragon': return 0.19;
    case 'lyre': return 0.32;
    case 'narwhal': return 0.26;
    case 'angler': return 0.32;
    default: return 0.28;
  }
}

function bodyPath(ctx, fish, L) {
  const h = bodyHalf(fish.shape) * L;
  const left = -0.45 * L;
  const right = 0.46 * L;
  ctx.beginPath();
  switch (fish.shape) {
    case 'torpedo':
    case 'sturgeon':
    case 'sword':
      ctx.moveTo(right, 0);
      ctx.bezierCurveTo(right - L * 0.1, -h * 0.9, -L * 0.1, -h, left + L * 0.03, -h * 0.28);
      ctx.quadraticCurveTo(left - L * 0.03, 0, left + L * 0.03, h * 0.28);
      ctx.bezierCurveTo(-L * 0.1, h, right - L * 0.1, h * 0.9, right, 0);
      break;
    case 'flat':
      ctx.moveTo(right, 0);
      ctx.bezierCurveTo(right - L * 0.08, -h * 0.85, L * 0.12, -h, -L * 0.02, -h);
      ctx.bezierCurveTo(-L * 0.24, -h, left, -h * 0.5, left, 0);
      ctx.bezierCurveTo(left, h * 0.5, -L * 0.24, h, -L * 0.02, h);
      ctx.bezierCurveTo(L * 0.12, h, right - L * 0.08, h * 0.85, right, 0);
      break;
    case 'ribbon':
    case 'dragon':
      ctx.moveTo(right, -h * 0.1);
      ctx.bezierCurveTo(L * 0.15, -h * 1.8, -L * 0.05, h * 1.4, left, h * 0.2);
      ctx.bezierCurveTo(-L * 0.52, -h * 0.5, -L * 0.2, -h * 0.2, right, -h * 0.1);
      break;
    case 'ray':
      ctx.moveTo(right, 0);
      ctx.quadraticCurveTo(L * 0.1, -h * 0.2, -L * 0.12, -h);
      ctx.quadraticCurveTo(-L * 0.3, -h * 0.35, left, 0);
      ctx.quadraticCurveTo(-L * 0.3, h * 0.35, -L * 0.12, h);
      ctx.quadraticCurveTo(L * 0.1, h * 0.2, right, 0);
      break;
    case 'whale':
    case 'narwhal':
      ctx.moveTo(right + L * 0.02, -h * 0.1);
      ctx.bezierCurveTo(right, -h * 0.6, L * 0.18, -h, -L * 0.02, -h);
      ctx.bezierCurveTo(-L * 0.28, -h, left, -h * 0.55, left, 0);
      ctx.bezierCurveTo(left, h * 0.55, -L * 0.28, h, -L * 0.02, h);
      ctx.bezierCurveTo(L * 0.18, h, right, h * 0.55, right + L * 0.02, h * 0.1);
      break;
    case 'catfish':
    case 'angler':
    case 'lyre':
    case 'angel':
      ctx.moveTo(right, 0);
      ctx.bezierCurveTo(right - L * 0.04, -h * 0.7, L * 0.2, -h * 0.98, -L * 0.02, -h * 0.98);
      ctx.bezierCurveTo(-L * 0.28, -h * 0.98, left, -h * 0.6, left, 0);
      ctx.bezierCurveTo(left, h * 0.6, -L * 0.28, h * 0.98, -L * 0.02, h * 0.98);
      ctx.bezierCurveTo(L * 0.2, h * 0.98, right - L * 0.04, h * 0.7, right, 0);
      break;
    default:
      ctx.ellipse(0, 0, 0.45 * L, h, 0, 0, Math.PI * 2);
  }
  ctx.closePath();
}

function drawTail(ctx, fish, L, time, silhouette) {
  const c = fish.colors;
  const h = bodyHalf(fish.shape) * L;
  const wag = Math.sin(time * 2.2 + hashString(fish.id) % 10) * 0.08;
  ctx.save();
  ctx.translate(-0.4 * L, 0);
  ctx.rotate(wag);
  ctx.beginPath();
  if (fish.shape === 'ray') {
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-L * 0.5, -L * 0.02, -L * 0.75, L * 0.02);
    ctx.strokeStyle = silhouette ? '#0b1220' : c.fin;
    ctx.lineWidth = Math.max(1.4, L * 0.014);
    ctx.stroke();
  } else if (fish.shape === 'lyre') {
    // Веер из светящихся «струн».
    for (let i = 0; i < 6; i++) {
      const angle = -0.7 + i * 0.28;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-L * 0.3, Math.sin(angle) * L * 0.25, -L * (0.52 + i * 0.025), Math.sin(angle) * L * 0.42);
      ctx.strokeStyle = silhouette ? '#0b1220' : i % 2 ? c.body : c.fin;
      ctx.lineWidth = Math.max(1, L * 0.012);
      ctx.globalAlpha = silhouette ? 1 : 0.75;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (fish.shape === 'whale' || fish.shape === 'narwhal') {
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-L * 0.12, -h * 0.2, -L * 0.24, -h * 0.75, -L * 0.3, -h * 0.55);
    ctx.quadraticCurveTo(-L * 0.2, 0, -L * 0.3, h * 0.55);
    ctx.bezierCurveTo(-L * 0.24, h * 0.75, -L * 0.12, h * 0.2, 0, 0);
    ctx.fillStyle = silhouette ? '#0b1220' : c.fin;
    ctx.fill();
  } else if (fish.shape === 'ribbon' || fish.shape === 'dragon') {
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-L * 0.18, -h * 1.4, -L * 0.3, -h * 0.2);
    ctx.quadraticCurveTo(-L * 0.18, h * 1.4, 0, 0);
    ctx.fillStyle = silhouette ? '#0b1220' : c.fin;
    ctx.fill();
  } else {
    const spread = fish.shape === 'flat' || fish.shape === 'angel' ? h * 1.45 : h * 1.2;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-L * 0.1, -spread * 0.5, -L * 0.24, -spread, -L * 0.34, -spread * 0.78);
    ctx.quadraticCurveTo(-L * 0.2, -spread * 0.1, -L * 0.3, 0);
    ctx.quadraticCurveTo(-L * 0.2, spread * 0.1, -L * 0.34, spread * 0.78);
    ctx.bezierCurveTo(-L * 0.24, spread, -L * 0.1, spread * 0.5, 0, 0);
    ctx.fillStyle = silhouette ? '#0b1220' : c.fin;
    ctx.fill();
  }
  if (fish.shape !== 'ray') {
    ctx.strokeStyle = silhouette ? '#0b1220' : c.body;
    ctx.globalAlpha = silhouette ? 1 : 0.35;
    ctx.lineWidth = Math.max(0.7, L * 0.006);
    ctx.stroke();
    if (!silhouette) {
      const spread = fish.shape === 'flat' || fish.shape === 'angel' ? h * 1.45 : h * 1.2;
      ctx.strokeStyle = c.fin;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = Math.max(0.6, L * 0.005);
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-L * 0.18, -spread * 0.45 * side, -L * 0.3, -spread * 0.72 * side);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  // Спинной и грудной плавники.
  if (!silhouette) {
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = c.fin;
    if (fish.shape === 'angel' || fish.shape === 'lyre') {
      ctx.beginPath();
      ctx.moveTo(-L * 0.12, -h * 0.9);
      ctx.quadraticCurveTo(L * 0.02, -h * 1.5, L * 0.16, -h * 0.85);
      ctx.quadraticCurveTo(L * 0.02, -h * 0.8, -L * 0.12, -h * 0.9);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-L * 0.12, h * 0.9);
      ctx.quadraticCurveTo(L * 0.02, h * 1.5, L * 0.16, h * 0.85);
      ctx.quadraticCurveTo(L * 0.02, h * 0.8, -L * 0.12, h * 0.9);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(-L * 0.2, -h * 0.72);
      ctx.quadraticCurveTo(-L * 0.02, -h * 1.28, L * 0.16, -h * 0.7);
      ctx.quadraticCurveTo(-L * 0.02, -h * 0.78, -L * 0.2, -h * 0.72);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(L * 0.08, h * 0.35);
    ctx.quadraticCurveTo(L * 0.02, h * 0.85, L * 0.22, h * 0.48);
    ctx.quadraticCurveTo(L * 0.15, h * 0.38, L * 0.08, h * 0.35);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawPattern(ctx, fish, L) {
  if (fish.pattern === 'none' || fish.pattern === 'scales') {
    if (fish.pattern !== 'scales') return;
  }
  const h = bodyHalf(fish.shape) * L;
  ctx.save();
  bodyPath(ctx, fish, L);
  ctx.clip();
  if (fish.pattern === 'spots') {
    for (const p of patternPoints(fish)) {
      if (Math.abs(p.y) > 0.85 || Math.abs(p.x) > 0.9) continue;
      ctx.beginPath();
      ctx.arc(p.x * L * 0.38, p.y * h * 0.8, p.r * L, 0, Math.PI * 2);
      ctx.fillStyle = fish.colors.glow;
      ctx.globalAlpha = p.a * 0.55;
      ctx.fill();
    }
  } else if (fish.pattern === 'stripes') {
    ctx.strokeStyle = fish.colors.fin;
    ctx.lineWidth = Math.max(1, L * 0.022);
    ctx.globalAlpha = 0.45;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      const x = i * L * 0.1;
      ctx.moveTo(x, -h);
      ctx.quadraticCurveTo(x + L * 0.04, 0, x, h);
      ctx.stroke();
    }
  } else if (fish.pattern === 'stars') {
    ctx.fillStyle = fish.colors.glow;
    for (let i = 0; i < 10; i++) {
      const p = patternPoints(fish)[i];
      if (Math.abs(p.x) > 0.85 || Math.abs(p.y) > 0.8) continue;
      const x = p.x * L * 0.36;
      const y = p.y * h * 0.75;
      const r = L * 0.012;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y - r * 2.2);
      ctx.quadraticCurveTo(x, y, x + r * 2.2, y);
      ctx.quadraticCurveTo(x, y, x, y + r * 2.2);
      ctx.quadraticCurveTo(x, y, x - r * 2.2, y);
      ctx.quadraticCurveTo(x, y, x, y - r * 2.2);
      ctx.fill();
    }
  } else if (fish.pattern === 'scales') {
    ctx.strokeStyle = fish.colors.belly;
    ctx.globalAlpha = 0.18;
    ctx.lineWidth = Math.max(0.8, L * 0.008);
    for (let row = -3; row <= 3; row++) {
      for (let col = -4; col <= 4; col++) {
        ctx.beginPath();
        ctx.arc(col * L * 0.09 + (row % 2) * L * 0.045, row * h * 0.22, L * 0.05, 0.15, Math.PI - 0.15);
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}

function drawWhiskers(ctx, fish, L, silhouette) {
  if (fish.shape !== 'catfish') return;
  ctx.strokeStyle = silhouette ? '#0b1220' : fish.colors.fin;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = Math.max(1, L * 0.01);
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(L * 0.4, side * L * 0.03);
    ctx.quadraticCurveTo(L * 0.52, side * L * 0.08, L * 0.62, side * L * 0.16);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawHorn(ctx, fish, L, silhouette) {
  if (fish.shape !== 'narwhal') return;
  ctx.strokeStyle = silhouette ? '#0b1220' : fish.colors.belly;
  ctx.lineWidth = Math.max(1.5, L * 0.018);
  ctx.beginPath();
  ctx.moveTo(L * 0.4, -L * 0.03);
  ctx.lineTo(L * 0.72, -L * 0.2);
  ctx.stroke();
  if (!silhouette) {
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = fish.colors.glow;
    ctx.lineWidth = Math.max(3, L * 0.04);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function drawAnglerLight(ctx, fish, L, time, silhouette) {
  if (fish.shape !== 'angler' || silhouette) return;
  const sway = Math.sin(time * 2) * 0.03;
  ctx.strokeStyle = fish.colors.fin;
  ctx.lineWidth = Math.max(1, L * 0.008);
  ctx.beginPath();
  ctx.moveTo(L * 0.16, -L * 0.22);
  ctx.quadraticCurveTo(L * 0.28, -L * 0.45, L * 0.4 + sway * L, -L * 0.4);
  ctx.stroke();
  const gx = L * 0.4 + sway * L;
  const gy = -L * 0.4;
  const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, L * 0.1);
  grad.addColorStop(0, fish.colors.glow);
  grad.addColorStop(0.35, `${fish.colors.glow}99`);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(gx, gy, L * 0.1, 0, Math.PI * 2);
  ctx.fill();
}

function drawDragonHorns(ctx, fish, L, silhouette) {
  if (fish.shape !== 'dragon' || silhouette) return;
  const h = bodyHalf('dragon') * L;
  ctx.strokeStyle = fish.colors.glow;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = Math.max(1, L * 0.014);
  // Два длинных рога.
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(L * 0.31, side * h * 0.35);
    ctx.quadraticCurveTo(L * 0.4, side * h * 1.15, L * 0.48, side * h * 1.55);
    ctx.stroke();
  }
  // Гребень вдоль спины.
  ctx.fillStyle = fish.colors.glow;
  ctx.globalAlpha = 0.45;
  for (let i = 0; i < 5; i++) {
    const x = -L * 0.26 + i * L * 0.1;
    const base = -h * 0.78;
    ctx.beginPath();
    ctx.moveTo(x - L * 0.035, base);
    ctx.lineTo(x, base - h * (0.55 + (i % 2) * 0.25));
    ctx.lineTo(x + L * 0.035, base);
    ctx.closePath();
    ctx.fill();
  }
  // Усы.
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = fish.colors.fin;
  ctx.lineWidth = Math.max(0.8, L * 0.007);
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(L * 0.42, side * h * 0.1);
    ctx.bezierCurveTo(L * 0.55, side * h * 0.35, L * 0.6, side * h * 0.9, L * 0.72, side * h * 1.15);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/**
 * Рисует рыбу в точке (x, y). Размер — длина тела в пикселях.
 */
export function drawFish(ctx, fish, {
  x = 0,
  y = 0,
  size = 120,
  time = 0,
  alpha = 1,
  angle = 0,
  flip = false,
  glow = true,
  silhouette = false,
  pattern = true,
  phase = 0
} = {}) {
  if (!fish) return;
  const L = Math.max(12, size);
  ctx.save();
  ctx.translate(x, y);
  if (angle) ctx.rotate(angle);
  if (flip) ctx.scale(-1, 1);
  ctx.globalAlpha = alpha;

  if (glow && !silhouette) {
    ctx.save();
    ctx.shadowColor = fish.colors.glow;
    ctx.shadowBlur = L * 0.16;
    ctx.globalAlpha = alpha * 0.3;
    bodyPath(ctx, fish, L);
    ctx.fillStyle = fish.colors.glow;
    ctx.fill();
    ctx.restore();
  }

  drawTail(ctx, fish, L, time + phase, silhouette);

  if (!silhouette) {
    const h = bodyHalf(fish.shape) * L;
    const grad = ctx.createLinearGradient(0, -h, 0, h);
    grad.addColorStop(0, fish.colors.body);
    grad.addColorStop(0.52, fish.colors.body);
    grad.addColorStop(0.86, fish.colors.belly);
    grad.addColorStop(1, fish.colors.belly);
    bodyPath(ctx, fish, L);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineJoin = 'round';
    ctx.strokeStyle = fish.colors.fin;
    ctx.lineWidth = Math.max(0.9, L * 0.007);
    ctx.globalAlpha = alpha * 0.8;
    ctx.stroke();
    ctx.globalAlpha = alpha;
    if (pattern) drawPattern(ctx, fish, L);

    // Жаберная крышка.
    ctx.strokeStyle = fish.colors.fin;
    ctx.globalAlpha = alpha * 0.34;
    ctx.lineWidth = Math.max(0.7, L * 0.006);
    ctx.beginPath();
    ctx.moveTo(L * 0.2, -h * 0.58);
    ctx.quadraticCurveTo(L * 0.1, 0, L * 0.2, h * 0.58);
    ctx.stroke();
    // Боковая линия.
    ctx.globalAlpha = alpha * 0.2;
    ctx.beginPath();
    ctx.moveTo(L * 0.17, -h * 0.14);
    ctx.quadraticCurveTo(-L * 0.05, -h * 0.03, -L * 0.32, -h * 0.12);
    ctx.stroke();
    // Рот.
    ctx.globalAlpha = alpha * 0.55;
    ctx.strokeStyle = fish.colors.fin;
    ctx.lineWidth = Math.max(0.8, L * 0.007);
    ctx.beginPath();
    ctx.moveTo(L * 0.44, -h * 0.06);
    ctx.quadraticCurveTo(L * 0.46, h * 0.03, L * 0.41, h * 0.07);
    ctx.stroke();

    // Блик по спине.
    ctx.save();
    bodyPath(ctx, fish, L);
    ctx.clip();
    ctx.globalAlpha = alpha * 0.2;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = L * 0.022;
    ctx.beginPath();
    ctx.moveTo(-L * 0.3, -h * 0.55);
    ctx.quadraticCurveTo(0, -h * 0.72, L * 0.32, -h * 0.35);
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = alpha;

    // Глаз.
    const eyeX = L * 0.3;
    const eyeY = -h * 0.2;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, Math.max(1.1, L * 0.027), 0, Math.PI * 2);
    ctx.fillStyle = '#fff8e8';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(eyeX + L * 0.006, eyeY, Math.max(0.8, L * 0.014), 0, Math.PI * 2);
    ctx.fillStyle = '#101425';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(eyeX - L * 0.007, eyeY - L * 0.007, Math.max(0.4, L * 0.005), 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  } else {
    bodyPath(ctx, fish, L);
    ctx.fillStyle = '#0a1020';
    ctx.fill();
  }

  drawWhiskers(ctx, fish, L, silhouette);
  drawHorn(ctx, fish, L, silhouette);
  drawAnglerLight(ctx, fish, L, time + phase, silhouette);
  drawDragonHorns(ctx, fish, L, silhouette);

  ctx.restore();
}

/** Один кадр для миниатюры коллекции. */
export function renderFishThumb(canvas, fish, { unknown = false } = {}) {
  if (!canvas) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth || 120;
  const h = canvas.clientHeight || 84;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.55, 2, w * 0.5, h * 0.55, w * 0.65);
  bg.addColorStop(0, unknown ? 'rgba(120,140,170,.07)' : `${fish.colors.glow}18`);
  bg.addColorStop(1, 'transparent');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  if (unknown) {
    const ghost = {
      ...fish,
      pattern: 'none',
      colors: { body: '#1b2a3c', fin: '#2b4359', belly: '#20354a', glow: '#8fa9bd' }
    };
    drawFish(ctx, ghost, {
      x: w * 0.5,
      y: h * 0.55,
      size: Math.min(w * 0.72, h * 1.08),
      alpha: 0.78,
      glow: false,
      pattern: false
    });
  } else {
    drawFish(ctx, fish, {
      x: w * 0.5,
      y: h * 0.55,
      size: Math.min(w * 0.9, h * 1.24),
      glow: true,
      time: 0.6
    });
  }
}

/** Анимированный портрет для карточки улова. */
export function startFishPortrait(canvas, fish, { reducedMotion = false } = {}) {
  if (!canvas) return () => {};
  let raf = 0;
  let start = performance.now();
  let stopped = false;
  const draw = (now) => {
    if (stopped) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth || 520;
    const h = canvas.clientHeight || 280;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const t = (now - start) / 1000;
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.48, 4, w * 0.5, h * 0.5, w * 0.65);
    bg.addColorStop(0, `${fish.colors.glow}2e`);
    bg.addColorStop(0.45, 'rgba(11,17,35,.35)');
    bg.addColorStop(1, 'transparent');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Едва заметные орбиты вокруг рыбы.
    ctx.strokeStyle = `${fish.colors.glow}22`;
    ctx.lineWidth = 1;
    for (let ring = 0; ring < 3; ring++) {
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.54, Math.min(w, h) * (0.26 + ring * 0.09), Math.min(w, h) * (0.1 + ring * 0.04), -0.08, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Мягкая тень на «воде».
    const shadow = ctx.createRadialGradient(w * 0.5, h * 0.78, 2, w * 0.5, h * 0.78, Math.min(w, h) * 0.32);
    shadow.addColorStop(0, 'rgba(0,0,0,.22)');
    shadow.addColorStop(1, 'transparent');
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.78, Math.min(w, h) * 0.3, Math.min(w, h) * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();

    // Медленные искры вокруг.
    for (let i = 0; i < 12; i++) {
      const a = t * 0.15 + i * 1.7;
      const rad = (0.22 + (i % 4) * 0.05) * Math.min(w, h);
      const px = w * 0.5 + Math.cos(a) * rad * 1.6;
      const py = h * 0.48 + Math.sin(a * 0.8) * rad * 0.6;
      ctx.globalAlpha = 0.18 + 0.25 * (0.5 + 0.5 * Math.sin(t * 1.4 + i));
      ctx.fillStyle = fish.colors.glow;
      ctx.beginPath();
      ctx.arc(px, py, 1.2 + (i % 3) * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    drawFish(ctx, fish, {
      x: w * 0.5,
      y: h * 0.54,
      size: Math.min(w * 0.8, h * 1.08),
      time: reducedMotion ? 0.8 : t,
      glow: true
    });

    if (!reducedMotion) raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
  };
}

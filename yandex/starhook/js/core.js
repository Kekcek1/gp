// ЗВЕЗДОЛОВ — чистая игровая логика без DOM.
// Модуль покрыт юнит-тестами и используется и игрой, и тестами.

import {
  ACHIEVEMENTS,
  BAITS,
  BAIT_BY_ID,
  DAILY_GIFTS,
  DAILY_POOL,
  LOCATIONS,
  LOCATION_BY_ID,
  QUESTS,
  RANKS,
  RARITIES,
  UPGRADES,
  UPGRADE_BY_ID
} from './data.js';
import { FISH, FISH_BY_ID } from './fish.js';

export const SAVE_VERSION = 1;
export const GUARDIAN_SIGNS_NEEDED = 5;
export const MAX_LEVEL = 30;

const SPECIES_IDS = new Set(FISH.map((f) => f.id));
const ACHIEVEMENT_IDS = new Set(ACHIEVEMENTS.map((a) => a.id));
const BAIT_IDS = new Set(BAITS.map((b) => b.id));
const UPGRADE_IDS = new Set(UPGRADES.map((u) => u.id));
const LOCATION_IDS = new Set(LOCATIONS.map((l) => l.id));

const RARITY_WEIGHT = {
  common: 100,
  uncommon: 30,
  rare: 8,
  epic: 2.2,
  legendary: 0,
  mythic: 0
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const finite = (v, fallback = 0) => (Number.isFinite(Number(v)) ? Number(v) : fallback);

// ── Случайность ─────────────────────────────────────────────────────────────

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ── Дата и ежедневные события ──────────────────────────────────────────────

export function dateKey(ts = Date.now()) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function daysBetweenKeys(a, b) {
  if (!a || !b) return Infinity;
  const parse = (key) => {
    const [y, m, d] = key.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((parse(b) - parse(a)) / 86400000);
}

/** Три задания дня, детерминированные от даты. */
export function makeDailyTasks(dayKey = dateKey()) {
  const rng = mulberry32(hashString(`starhook-daily-${dayKey}`));
  const pool = [...DAILY_POOL];
  // Перемешиваем Фишером-Йетсом.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const catchTask = pool.find((task) => task.type === 'dailyCatch');
  const chosen = [];
  const usedTypes = new Set();
  if (catchTask) {
    chosen.push(catchTask);
    usedTypes.add(catchTask.type);
  }
  for (const task of pool) {
    if (chosen.length >= 3) break;
    if (usedTypes.has(task.type)) continue;
    chosen.push(task);
    usedTypes.add(task.type);
  }
  return chosen.slice(0, 3).map((task) => ({
    id: task.id,
    text: task.text,
    type: task.type,
    count: task.count,
    reward: task.reward
  }));
}

export function ensureDaily(state, now = Date.now()) {
  const key = dateKey(now);
  if (!state.daily) state.daily = createNewState(now).daily;
  if (state.daily.date === key) return false;

  const previousGiftDate = state.daily.lastGiftDate || '';
  const gap = previousGiftDate ? daysBetweenKeys(previousGiftDate, key) : Infinity;
  let streak = 1;
  if (previousGiftDate) {
    if (gap === 0) streak = state.daily.streak || 1;
    else if (gap === 1) streak = (state.daily.streak || 1) + 1;
    else streak = 1;
  }

  state.daily.date = key;
  state.daily.tasks = makeDailyTasks(key);
  state.daily.claimed = [];
  state.daily.bonus = false;
  state.daily.stats = { catches: 0, rare: 0, perfectReels: 0, perfectCasts: 0, sparks: 0, species: [] };
  state.daily.streak = streak;
  state.daily.giftDay = ((streak - 1) % 7) + 1;
  state.daily.giftClaimed = previousGiftDate === key;
  state.daily.giftAvailable = !state.daily.giftClaimed;
  if (previousGiftDate && gap > 1) state.daily.streakReset = true;
  return true;
}

export function dailyTaskProgress(state, task) {
  const stats = state.daily?.stats || {};
  switch (task.type) {
    case 'dailyCatch': return finite(stats.catches);
    case 'dailyRare': return finite(stats.rare);
    case 'dailyPerfectReel': return finite(stats.perfectReels);
    case 'dailyPerfectCast': return finite(stats.perfectCasts);
    case 'dailySpecies': return Array.isArray(stats.species) ? stats.species.length : 0;
    case 'dailySparks': return finite(stats.sparks);
    default: return 0;
  }
}

export function dailyView(state) {
  if (!state.daily) return { tasks: [], done: 0, total: 0, allDone: false, bonus: false };
  const tasks = (state.daily.tasks || []).map((task) => {
    const current = dailyTaskProgress(state, task);
    return {
      ...task,
      current: Math.min(current, task.count),
      target: task.count,
      complete: current >= task.count,
      claimed: (state.daily.claimed || []).includes(task.id)
    };
  });
  const done = tasks.filter((t) => t.claimed).length;
  return {
    ...state.daily,
    tasks,
    done,
    total: tasks.length,
    allDone: tasks.length > 0 && tasks.every((t) => t.complete),
    bonus: Boolean(state.daily.bonus)
  };
}

export function claimDailyTask(state, taskId) {
  const view = dailyView(state);
  const task = view.tasks.find((t) => t.id === taskId);
  if (!task || !task.complete || task.claimed) return null;
  state.sparks += task.reward;
  state.stats.earnedSparks += task.reward;
  state.daily.claimed.push(taskId);
  state.updatedAt = Date.now();
  const after = dailyView(state);
  return { task, allClaimed: after.tasks.every((t) => t.complete && t.claimed) };
}

export function claimDailyBonus(state) {
  const view = dailyView(state);
  if (!view.tasks.length || !view.tasks.every((t) => t.claimed) || state.daily.bonus) return null;
  state.sparks += 100;
  state.shards += 1;
  state.stats.earnedSparks += 100;
  state.daily.bonus = true;
  state.updatedAt = Date.now();
  return { sparks: 100, shards: 1 };
}

export function giftView(state, now = Date.now()) {
  ensureDaily(state, now);
  const day = clamp(finite(state.daily.giftDay, 1), 1, 7);
  return {
    day,
    gift: DAILY_GIFTS[day - 1],
    claimed: Boolean(state.daily.giftClaimed),
    available: Boolean(state.daily.giftAvailable) && !state.daily.giftClaimed,
    streak: state.daily.streak || 1,
    streakReset: Boolean(state.daily.streakReset)
  };
}

export function claimGift(state, now = Date.now()) {
  ensureDaily(state, now);
  const view = giftView(state, now);
  if (!view.available) return null;
  state.sparks += view.gift.sparks;
  state.shards += view.gift.shards;
  state.stats.earnedSparks += view.gift.sparks;
  state.daily.lastGiftDate = dateKey(now);
  state.daily.giftClaimed = true;
  state.daily.giftAvailable = false;
  state.daily.streakReset = false;
  state.updatedAt = now;
  return view;
}

// ── Уровни, ранги, награды ──────────────────────────────────────────────────

export function levelXpNeed(level) {
  return Math.max(10, Math.round(25 * Math.pow(Math.max(1, level), 1.1)));
}

export function rankForLevel(level) {
  let result = RANKS[0];
  for (const rank of RANKS) if (level >= rank.level) result = rank;
  return result;
}

export function nextRank(level) {
  return RANKS.find((r) => r.level > level) || null;
}

export function awardXp(state, amount, now = Date.now()) {
  const xp = Math.max(0, Math.round(finite(amount)));
  state.xp += xp;
  const levels = [];
  const ranks = [];
  let guard = 0;
  while (state.level < MAX_LEVEL && state.xp >= levelXpNeed(state.level) && guard++ < 100) {
    state.xp -= levelXpNeed(state.level);
    state.level += 1;
    levels.push(state.level);
    const rank = RANKS.find((r) => r.level === state.level && r.shards);
    if (rank && !(state.ranks || []).includes(rank.level)) {
      state.ranks = state.ranks || [];
      state.ranks.push(rank.level);
      state.shards += rank.shards;
      ranks.push(rank);
    }
  }
  if (state.level >= MAX_LEVEL) state.xp = 0;
  state.updatedAt = now;
  return { levels, ranks };
}

export function grantReward(state, reward = {}, now = Date.now()) {
  const result = { sparks: 0, shards: 0, xp: 0, levels: [], ranks: [] };
  if (reward.sparks) {
    state.sparks += reward.sparks;
    state.stats.earnedSparks += reward.sparks;
    result.sparks = reward.sparks;
  }
  if (reward.shards) {
    state.shards += reward.shards;
    result.shards = reward.shards;
  }
  if (reward.xp) {
    result.xp = reward.xp;
    const xpResult = awardXp(state, reward.xp, now);
    result.levels = xpResult.levels;
    result.ranks = xpResult.ranks;
  }
  state.updatedAt = now;
  return result;
}

// ── Улучшения и наживки ────────────────────────────────────────────────────

export function upgradeCost(upgradeId, currentLevel) {
  const upgrade = UPGRADE_BY_ID[upgradeId];
  if (!upgrade || currentLevel >= upgrade.max) return null;
  return Math.round((upgrade.baseCost * Math.pow(1.6, currentLevel - 1)) / 5) * 5;
}

export function upgradeEffect(upgradeId, level) {
  const upgrade = UPGRADE_BY_ID[upgradeId];
  if (!upgrade) return 0;
  return (level - 1) * (upgrade.step || 0);
}

export function buyUpgrade(state, upgradeId, now = Date.now()) {
  const upgrade = UPGRADE_BY_ID[upgradeId];
  if (!upgrade) return { ok: false, error: 'unknown' };
  const level = state.upgrades[upgradeId] || 1;
  if (level >= upgrade.max) return { ok: false, error: 'max' };
  const cost = upgradeCost(upgradeId, level);
  if (state.sparks < cost) return { ok: false, error: 'sparks', cost };
  state.sparks -= cost;
  state.upgrades[upgradeId] = level + 1;
  state.updatedAt = now;
  return { ok: true, cost, level: level + 1, name: upgrade.name };
}

export function baitLevelLocked(state, baitId) {
  const bait = BAIT_BY_ID[baitId];
  return !bait || state.level < bait.unlockLevel;
}

export function buyBait(state, baitId, now = Date.now()) {
  const bait = BAIT_BY_ID[baitId];
  if (!bait) return { ok: false, error: 'unknown' };
  if (state.baits.includes(baitId)) return { ok: false, error: 'owned' };
  if (state.level < bait.unlockLevel) return { ok: false, error: 'level', level: bait.unlockLevel };
  if (state.sparks < bait.cost) return { ok: false, error: 'sparks', cost: bait.cost };
  state.sparks -= bait.cost;
  state.baits.push(baitId);
  state.bait = baitId;
  state.updatedAt = now;
  return { ok: true, cost: bait.cost, bait };
}

export function equipBait(state, baitId) {
  if (!state.baits.includes(baitId)) return false;
  state.bait = baitId;
  state.updatedAt = Date.now();
  return true;
}

export function baitEffects(state) {
  const bait = BAIT_BY_ID[state.bait] || BAITS[0];
  return { ...bait.effects };
}

// ── Рыба, заброс, вываживание ───────────────────────────────────────────────

export function locationFish(locId) {
  return FISH.filter((fish) => fish.loc === locId);
}

export function fishPool(locId) {
  return FISH.filter((fish) => fish.loc === locId && !fish.guardian);
}

export function guardianStatus(state, locId) {
  const loc = LOCATION_BY_ID[locId];
  if (!loc) return { active: false, caught: false, meter: 0, need: GUARDIAN_SIGNS_NEEDED, ready: false, fish: null };
  const fish = FISH_BY_ID[loc.guardian];
  const caught = Boolean(state.guardians[loc.guardian]);
  const quest = QUESTS[state.story] || null;
  const active = Boolean(quest && quest.guardian === loc.guardian && !caught);
  const meter = clamp(finite(state.guardianMeter?.[locId]), 0, GUARDIAN_SIGNS_NEEDED);
  return { active, caught, meter, need: GUARDIAN_SIGNS_NEEDED, ready: active && meter >= GUARDIAN_SIGNS_NEEDED, fish };
}

/** Веса редкости с учётом блесны, наживки, идеального заброса и локации. */
export function rarityWeightFor(rarity, { lureLevel = 1, bait = null, perfectCast = false, locationIndex = 0 } = {}) {
  let weight = RARITY_WEIGHT[rarity] || 0;
  if (!weight) return 0;
  const lureBonus = 1 + (lureLevel - 1) * 0.08;
  const baitBonus = 1 + (bait?.effects?.rare || 0);
  const perfectBonus = perfectCast ? 1.25 : 1;
  const locBonus = 1 + locationIndex * 0.07;
  if (rarity === 'rare' || rarity === 'epic') weight *= lureBonus * baitBonus * perfectBonus * locBonus;
  return weight;
}

export function chooseFish(state, locId, { rng = Math.random, perfectCast = false } = {}) {
  const status = guardianStatus(state, locId);
  if (status.ready) return status.fish;

  const locIndex = Math.max(0, LOCATIONS.findIndex((l) => l.id === locId));
  const bait = BAIT_BY_ID[state.bait] || BAITS[0];
  const lureLevel = state.upgrades?.lure || 1;
  const pool = fishPool(locId);
  const weights = pool.map((fish) => rarityWeightFor(fish.rarity, { lureLevel, bait, perfectCast, locationIndex: locIndex }));
  let total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return pool[Math.floor(rng() * pool.length)] || FISH[0];
  let roll = rng() * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

export function rollWeight(fish, { rng = Math.random, weightBoost = 0 } = {}) {
  const [min, max] = fish.weight;
  // Треугольное распределение: обычная рыба чаще ближе к середине,
  // приманка и идеальный заброс сдвигают результат к крупным экземплярам.
  const triangular = (rng() + rng() + rng()) / 3;
  const boost = clamp(weightBoost, 0, 0.9);
  const r = clamp((1 - boost) * triangular + boost * rng(), 0, 1);
  return Math.max(1, Math.round(min + (max - min) * r));
}

export function calcCatchValue(fish, weight, { perfect = false, isNew = false } = {}) {
  const [min, max] = fish.weight;
  const ratio = max > min ? clamp((weight - min) / (max - min), 0, 1) : 0.5;
  let value = fish.value * (0.82 + 0.34 * ratio);
  if (perfect) value *= 1.12;
  if (isNew) value *= 1.25;
  return Math.max(1, Math.round(value));
}

export function calcCatchXp(fish, { perfect = false, isNew = false } = {}) {
  let xp = fish.xp;
  if (isNew) xp *= 2;
  if (perfect) xp *= 1.15;
  return Math.max(1, Math.round(xp));
}

export function calcCatchScore(fish, weight, { perfect = false, isNew = false } = {}) {
  return Math.max(1, Math.round(fish.value * 1.4 + weight / 40 + (perfect ? 12 : 0) + (isNew ? 20 : 0)));
}

export function isRare(rarity) {
  return (RARITIES[rarity]?.order ?? -1) >= 2;
}

/**
 * Применяет пойманную рыбу к состоянию. Мутирует state и возвращает сводку.
 * @returns {{fish: object, weight: number, value: number, xp: number, score: number,
 *   isNew: boolean, isRecord: boolean, levels: number[], ranks: object[],
 *   guardianCaught: boolean, guardianMeter: number, constellation: string|null,
 *   achievements: object[]}}
 */
export function applyCatch(state, fish, {
  weight = null,
  perfect = false,
  perfectRatio = 0,
  rng = Math.random,
  now = Date.now()
} = {}) {
  const bait = BAIT_BY_ID[state.bait] || BAITS[0];
  const boost = (bait.effects?.weight || 0) + (perfect ? 0.04 : 0);
  const finalWeight = weight == null ? rollWeight(fish, { rng, weightBoost: boost }) : Math.max(1, Math.round(weight));
  const isNew = !state.species[fish.id];
  const isRecord = finalWeight > (state.stats.bestWeight || 0);
  const value = calcCatchValue(fish, finalWeight, { perfect, isNew });
  const xp = calcCatchXp(fish, { perfect, isNew });
  const score = calcCatchScore(fish, finalWeight, { perfect, isNew });

  state.sparks += value;
  state.stats.earnedSparks += value;
  state.stats.catches += 1;
  state.stats.byLoc[fish.loc] = (state.stats.byLoc[fish.loc] || 0) + 1;
  state.stats.totalWeight += finalWeight;
  if (isRare(fish.rarity)) state.stats.rareCatches += 1;
  if (isRecord) {
    state.stats.bestWeight = finalWeight;
    state.stats.bestFish = { id: fish.id, weight: finalWeight, at: now };
  }

  if (!state.species[fish.id]) {
    state.species[fish.id] = { count: 0, best: 0, firstAt: now };
  }
  state.species[fish.id].count += 1;
  state.species[fish.id].best = Math.max(state.species[fish.id].best, finalWeight);

  state.score += score;
  state.catches += 1;

  const daily = state.daily;
  if (daily) {
    daily.stats.catches += 1;
    daily.stats.sparks += value;
    if (isRare(fish.rarity)) daily.stats.rare += 1;
    if (isNew && !daily.stats.species.includes(fish.id)) daily.stats.species.push(fish.id);
  }

  let guardianCaught = false;
  let guardianMeter = 0;
  let constellation = null;
  if (fish.guardian) {
    guardianCaught = true;
    state.guardians[fish.id] = now;
    state.guardianMeter[fish.loc] = 0;
    constellation = fish.constellation || null;
  } else {
    const loc = LOCATION_BY_ID[fish.loc];
    const quest = QUESTS[state.story];
    if (loc && quest && quest.guardian === loc.guardian && !state.guardians[loc.guardian]) {
      state.guardianMeter[fish.loc] = Math.min(GUARDIAN_SIGNS_NEEDED, (state.guardianMeter[fish.loc] || 0) + 1);
      guardianMeter = state.guardianMeter[fish.loc];
    }
  }

  const xpResult = awardXp(state, xp, now);
  const achievements = checkAchievements(state, now);
  state.updatedAt = now;

  return {
    fish,
    weight: finalWeight,
    value,
    xp,
    score,
    isNew,
    isRecord,
    perfect,
    perfectRatio,
    levels: xpResult.levels,
    ranks: xpResult.ranks,
    guardianCaught,
    guardianMeter,
    constellation,
    achievements
  };
}

// ── Задания ─────────────────────────────────────────────────────────────────

export function collectionCount(state) {
  return Object.keys(state.species || {}).length;
}

export function guardianCount(state) {
  return Object.keys(state.guardians || {}).length;
}

export function questGoalProgress(goal, state) {
  switch (goal.type) {
    case 'totalCatch': return state.stats.catches;
    case 'species': return collectionCount(state);
    case 'perfectCast': return state.stats.perfectCasts;
    case 'rareCatch': return state.stats.rareCatches;
    case 'locCatch': return state.stats.byLoc[goal.loc] || 0;
    case 'perfectReel': return state.stats.perfectReels;
    case 'guardian': return state.guardians[goal.fish] ? 1 : 0;
    default: return 0;
  }
}

export function questView(state) {
  const quest = QUESTS[state.story] || null;
  if (!quest) return null;
  const goals = quest.goals.map((goal) => {
    const target = Math.max(1, finite(goal.count, 1));
    const current = Math.min(target, questGoalProgress(goal, state));
    return { ...goal, count: target, current, target, done: current >= target };
  });
  return {
    index: state.story,
    total: QUESTS.length,
    quest,
    goals,
    complete: goals.every((g) => g.done),
    final: Boolean(quest.final)
  };
}

export function claimStoryReward(state, now = Date.now()) {
  const view = questView(state);
  if (!view || !view.complete) return null;
  const quest = view.quest;
  const reward = grantReward(state, quest.reward || {}, now);
  if (quest.unlock && !state.locations.includes(quest.unlock)) {
    state.locations.push(quest.unlock);
  }
  state.story = Math.min(QUESTS.length, state.story + 1);
  if (quest.final) {
    state.flags.ending = true;
    state.flags.freePlay = true;
  }
  state.updatedAt = now;
  return { ...view, reward, final: Boolean(quest.final), unlock: quest.unlock || null };
}

// ── Достижения ──────────────────────────────────────────────────────────────

export function achievementCurrent(check, state) {
  switch (check.type) {
    case 'catches': return state.stats.catches;
    case 'species': return collectionCount(state);
    case 'bestWeight': return state.stats.bestWeight;
    case 'perfectCasts': return state.stats.perfectCasts;
    case 'perfectReels': return state.stats.perfectReels;
    case 'guardian': return state.guardians[check.fish] ? 1 : 0;
    case 'locations': return state.locations.length;
    case 'earnedSparks': return state.stats.earnedSparks;
    case 'streak': return state.daily?.streak || 0;
    case 'guardians': return guardianCount(state);
    default: return 0;
  }
}

export function achievementView(state, achievement) {
  const current = Math.min(achievement.check.count, achievementCurrent(achievement.check, state));
  const unlocked = Boolean(state.achievements[achievement.id]);
  return {
    ...achievement,
    current,
    target: achievement.check.count,
    unlocked,
    complete: current >= achievement.check.count
  };
}

export function checkAchievements(state, now = Date.now()) {
  const unlocked = [];
  for (const achievement of ACHIEVEMENTS) {
    if (state.achievements[achievement.id]) continue;
    if (achievementCurrent(achievement.check, state) >= achievement.check.count) {
      state.achievements[achievement.id] = now;
      if (achievement.shards) state.shards += achievement.shards;
      unlocked.push(achievement);
    }
  }
  return unlocked;
}

// ── Прогресс локаций ────────────────────────────────────────────────────────

export function locationProgress(state, locId) {
  const all = locationFish(locId);
  const caught = all.filter((fish) => state.species[fish.id]).length;
  return { caught, total: all.length, complete: caught === all.length };
}

export function guardianProgress(state) {
  return { caught: guardianCount(state), total: LOCATIONS.length };
}

export function collectionProgress(state) {
  return { caught: collectionCount(state), total: FISH.length };
}

export function scoreForLeaderboard(state) {
  return Math.max(0, Math.floor(state.score));
}

export function playtimeLabel(seconds) {
  return Math.max(0, Math.floor(seconds));
}

// ── Состояние и сохранения ──────────────────────────────────────────────────

export function createNewState(now = Date.now()) {
  const key = dateKey(now);
  return {
    v: SAVE_VERSION,
    createdAt: now,
    updatedAt: now,
    sparks: 140,
    shards: 0,
    xp: 0,
    level: 1,
    score: 0,
    catches: 0,
    species: {},
    guardians: {},
    guardianMeter: Object.fromEntries(LOCATIONS.map((l) => [l.id, 0])),
    story: 0,
    locations: ['cove'],
    currentLocation: 'cove',
    upgrades: Object.fromEntries(UPGRADES.map((u) => [u.id, 1])),
    bait: 'firefly',
    baits: ['firefly'],
    achievements: {},
    ranks: [],
    stats: {
      catches: 0,
      casts: 0,
      perfectCasts: 0,
      perfectReels: 0,
      rareCatches: 0,
      earnedSparks: 0,
      bestWeight: 0,
      bestFish: null,
      totalWeight: 0,
      byLoc: Object.fromEntries(LOCATIONS.map((l) => [l.id, 0]))
    },
    daily: {
      date: key,
      tasks: makeDailyTasks(key),
      claimed: [],
      bonus: false,
      stats: { catches: 0, rare: 0, perfectReels: 0, perfectCasts: 0, sparks: 0, species: [] },
      streak: 1,
      giftDay: 1,
      lastGiftDate: '',
      giftClaimed: false,
      giftAvailable: true,
      streakReset: false
    },
    settings: {
      lang: 'ru',
      langManual: false,
      sound: true,
      music: true,
      reducedMotion: false,
      softMode: false,
      quality: 'auto'
    },
    flags: {
      intro: false,
      tutorial: 0,
      ending: false,
      freePlay: false
    },
    playTime: 0,
    scoreSubmitted: 0
  };
}

function num(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
  return clamp(finite(value, fallback), min, max);
}

/** Приводит любое сохранение к актуальной и безопасной структуре. */
export function sanitizeState(raw, now = Date.now()) {
  const base = createNewState(now);
  if (!raw || typeof raw !== 'object') return base;
  const state = { ...base, ...raw };
  state.v = SAVE_VERSION;
  state.createdAt = num(raw.createdAt, now, 0);
  state.updatedAt = num(raw.updatedAt, now, 0);
  state.sparks = num(raw.sparks, 140, 0, 1e12);
  state.shards = num(raw.shards, 0, 0, 1e9);
  state.xp = num(raw.xp, 0, 0, 1e12);
  state.level = num(raw.level, 1, 1, MAX_LEVEL);
  state.score = num(raw.score, 0, 0, 1e15);
  state.catches = num(raw.catches, 0, 0, 1e9);
  state.story = num(raw.story, 0, 0, QUESTS.length);
  state.playTime = num(raw.playTime, 0, 0, 1e12);
  state.scoreSubmitted = num(raw.scoreSubmitted, 0, 0, 1e15);
  state.settings = { ...base.settings, ...(raw.settings || {}) };
  state.settings.lang = ['ru', 'en', 'tr'].includes(state.settings.lang) ? state.settings.lang : 'ru';
  state.settings.langManual = Boolean(state.settings.langManual);
  for (const key of ['sound', 'music', 'reducedMotion', 'softMode']) state.settings[key] = Boolean(state.settings[key]);
  if (!['auto', 'high', 'low'].includes(state.settings.quality)) state.settings.quality = 'auto';
  state.flags = { ...base.flags, ...(raw.flags || {}) };
  state.flags.intro = Boolean(state.flags.intro);
  state.flags.ending = Boolean(state.flags.ending);
  state.flags.freePlay = Boolean(state.flags.freePlay);
  state.flags.tutorial = num(state.flags.tutorial, 0, 0, 99);

  state.stats = { ...base.stats, ...(raw.stats || {}) };
  state.stats.catches = num(state.stats.catches, 0, 0, 1e9);
  state.stats.casts = num(state.stats.casts, 0, 0, 1e9);
  state.stats.perfectCasts = num(state.stats.perfectCasts, 0, 0, 1e9);
  state.stats.perfectReels = num(state.stats.perfectReels, 0, 0, 1e9);
  state.stats.rareCatches = num(state.stats.rareCatches, 0, 0, 1e9);
  state.stats.earnedSparks = num(state.stats.earnedSparks, 0, 0, 1e15);
  state.stats.bestWeight = num(state.stats.bestWeight, 0, 0, 1e9);
  state.stats.totalWeight = num(state.stats.totalWeight, 0, 0, 1e15);
  state.stats.bestFish = raw.stats?.bestFish && FISH_BY_ID[raw.stats.bestFish.id]
    ? { id: raw.stats.bestFish.id, weight: num(raw.stats.bestFish.weight, 0, 0), at: num(raw.stats.bestFish.at, 0, 0) }
    : null;
  state.stats.byLoc = { ...base.stats.byLoc };
  for (const loc of LOCATIONS) state.stats.byLoc[loc.id] = num(raw.stats?.byLoc?.[loc.id], 0, 0, 1e9);

  state.species = {};
  if (raw.species && typeof raw.species === 'object') {
    for (const [id, entry] of Object.entries(raw.species)) {
      if (!SPECIES_IDS.has(id) || !entry || typeof entry !== 'object') continue;
      state.species[id] = {
        count: num(entry.count, 0, 0, 1e9),
        best: num(entry.best, 0, 0, 1e9),
        firstAt: num(entry.firstAt, now, 0)
      };
    }
  }

  state.guardians = {};
  if (raw.guardians && typeof raw.guardians === 'object') {
    for (const [id, at] of Object.entries(raw.guardians)) {
      if (FISH_BY_ID[id]?.guardian) state.guardians[id] = num(at, now, 0);
    }
  }

  state.guardianMeter = { ...base.guardianMeter };
  for (const loc of LOCATIONS) {
    state.guardianMeter[loc.id] = num(raw.guardianMeter?.[loc.id], 0, 0, GUARDIAN_SIGNS_NEEDED);
  }

  state.locations = ['cove'];
  if (Array.isArray(raw.locations)) {
    for (const id of raw.locations) if (LOCATION_IDS.has(id) && id !== 'cove') state.locations.push(id);
  }
  // Гарантируем, что сюжет и локации не расходятся.
  state.locations = [...new Set(state.locations)];
  state.currentLocation = state.locations.includes(raw.currentLocation) ? raw.currentLocation : 'cove';

  state.upgrades = { ...base.upgrades };
  for (const upgrade of UPGRADES) {
    state.upgrades[upgrade.id] = num(raw.upgrades?.[upgrade.id], 1, 1, upgrade.max);
  }

  state.baits = ['firefly'];
  if (Array.isArray(raw.baits)) {
    for (const id of raw.baits) if (BAIT_IDS.has(id) && id !== 'firefly') state.baits.push(id);
  }
  state.baits = [...new Set(state.baits)];
  state.bait = BAIT_IDS.has(raw.bait) && state.baits.includes(raw.bait) ? raw.bait : 'firefly';

  state.achievements = {};
  if (raw.achievements && typeof raw.achievements === 'object') {
    for (const [id, at] of Object.entries(raw.achievements)) {
      if (ACHIEVEMENT_IDS.has(id)) state.achievements[id] = num(at, now, 0);
    }
  }

  state.ranks = Array.isArray(raw.ranks)
    ? [...new Set(raw.ranks.filter((n) => RANKS.some((r) => r.level === n)))]
    : [];

  const daily = { ...base.daily, ...(raw.daily || {}) };
  daily.stats = { ...base.daily.stats, ...(raw.daily?.stats || {}) };
  daily.stats.catches = num(daily.stats.catches, 0, 0, 1e9);
  daily.stats.rare = num(daily.stats.rare, 0, 0, 1e9);
  daily.stats.perfectReels = num(daily.stats.perfectReels, 0, 0, 1e9);
  daily.stats.perfectCasts = num(daily.stats.perfectCasts, 0, 0, 1e9);
  daily.stats.sparks = num(daily.stats.sparks, 0, 0, 1e12);
  daily.stats.species = Array.isArray(daily.stats.species)
    ? [...new Set(daily.stats.species.filter((id) => SPECIES_IDS.has(id)))]
    : [];
  daily.claimed = Array.isArray(daily.claimed) ? daily.claimed.filter((id) => daily.tasks?.some?.((t) => t.id === id)) : [];
  daily.tasks = Array.isArray(raw.daily?.tasks)
    ? raw.daily.tasks
        .filter((t) => t && typeof t === 'object' && DAILY_POOL.some((p) => p.id === t.id))
        .slice(0, 3)
        .map((t) => ({ ...t, current: undefined, target: undefined, complete: undefined, claimed: undefined }))
    : makeDailyTasks(daily.date || dateKey(now));
  if (!daily.tasks.length) daily.tasks = makeDailyTasks(daily.date || dateKey(now));
  daily.streak = num(daily.streak, 1, 0, 1e6);
  daily.giftDay = num(daily.giftDay, 1, 1, 7);
  daily.giftClaimed = Boolean(daily.giftClaimed);
  daily.giftAvailable = Boolean(daily.giftAvailable);
  daily.bonus = Boolean(daily.bonus);
  daily.streakReset = Boolean(daily.streakReset);
  daily.lastGiftDate = typeof daily.lastGiftDate === 'string' ? daily.lastGiftDate : '';
  daily.date = typeof daily.date === 'string' ? daily.date : dateKey(now);
  state.daily = daily;

  return state;
}

export function serializeState(state) {
  return JSON.stringify(state);
}

export function deserializeState(raw) {
  if (!raw) return null;
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!parsed || typeof parsed !== 'object') return null;
    return sanitizeState(parsed);
  } catch {
    return null;
  }
}

// ── Вспомогательные данные для интерфейса ──────────────────────────────────

export function fishById(id) {
  return FISH_BY_ID[id] || null;
}

export function locationById(id) {
  return LOCATION_BY_ID[id] || null;
}

export function locationFishCaught(state, locId) {
  return FISH.filter((f) => f.loc === locId && state.species[f.id]);
}

export function nextLevelProgress(state) {
  const need = levelXpNeed(state.level);
  return { current: Math.min(state.xp, need), need, percent: Math.min(100, (state.xp / need) * 100) };
}

export function currentQuest(state) {
  return QUESTS[state.story] || null;
}

export function hasUnclaimedStory(state) {
  const view = questView(state);
  return Boolean(view?.complete);
}

export function unclaimedAchievements(state) {
  return ACHIEVEMENTS.filter((a) => !state.achievements[a.id] && achievementCurrent(a.check, state) >= a.check.count);
}

export function totalDailyReward(view) {
  return (view?.tasks || []).reduce((sum, t) => sum + (t.reward || 0), 0);
}

export const CONSTANTS = {
  GUARDIAN_SIGNS_NEEDED,
  MAX_LEVEL,
  SAVE_VERSION
};

// Хранилище прогресса, облачные сохранения, реклама и рейтинг.

import { platform } from './platform.js';
import {
  achievementView,
  applyCatch,
  buyBait,
  buyUpgrade,
  checkAchievements,
  claimDailyBonus,
  claimDailyTask,
  claimGift,
  claimStoryReward,
  collectionCount,
  createNewState,
  dailyView,
  deserializeState,
  ensureDaily,
  equipBait,
  giftView,
  questView,
  scoreForLeaderboard,
  serializeState
} from './core.js';
import { ACHIEVEMENTS, LOCATION_BY_ID } from './data.js';
import { setLang, normalizeLang, t, tData } from './i18n.js';

const SAVE_KEY = 'starhook_save_v1';
const CLOUD_KEY = 'starhook_save';
const LEADERBOARD = 'starhook_score';

export class Store {
  constructor() {
    this.state = createNewState();
    this.hadLocal = false;
    this.loaded = false;
    this.cloudStatus = 'off';
    this.cloudTimer = null;
    this.cloudInFlight = false;
    this.cloudQueued = false;
    this.lastCloudAt = 0;
    this.lastScoreAt = 0;
    this.interstitialCounter = 0;
    this.authName = '';
    this.listeners = new Map();
    this.saveTimer = null;
    this.playSaveCounter = 0;
  }

  on(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    this.listeners.get(event)?.delete(fn);
  }

  emit(event, payload) {
    this.listeners.get(event)?.forEach((fn) => {
      try {
        fn(payload);
      } catch (err) {
        console.error('[starhook] listener', event, err);
      }
    });
  }

  get isAuthorized() {
    return platform.isAuthorized();
  }

  get canUseAds() {
    return platform.available;
  }

  get hasCloud() {
    return platform.available && Boolean(platform.player);
  }

  get playerName() {
    return platform.getUserName() || '';
  }

  // ── Загрузка ─────────────────────────────────────────────────────────────

  async init() {
    // Локальное сохранение доступно сразу, ещё до SDK.
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = deserializeState(raw);
        if (parsed) {
          this.state = parsed;
          this.hadLocal = true;
        }
      }
    } catch {
      // Хранилище может быть недоступно в приватном режиме.
    }

    // Первичный язык — из сохранения или браузера; затем уточняем через SDK.
    const initialLang = this.state.settings.langManual
      ? this.state.settings.lang
      : normalizeLang(this.hadLocal ? this.state.settings.lang : navigator.language);
    setLang(initialLang, { silent: true });

    await platform.init();
    if (!this.state.settings.langManual && platform.lang) {
      setLang(normalizeLang(platform.lang), { silent: true });
      this.state.settings.lang = normalizeLang(platform.lang);
    }
    if (!this.hadLocal) {
      this.state.settings.reducedMotion = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
    }

    if (platform.available) {
      this.cloudStatus = platform.player ? 'on' : 'off';
      this.authName = platform.getUserName();
      await this._loadCloud();
    }
    ensureDaily(this.state);
    const unlocked = checkAchievements(this.state);
    this._saveLocal();
    this.loaded = true;
    this.emit('cloud', this.cloudStatus);
    this.emit('ready', { state: this.state, newAchievements: unlocked });
    if (giftView(this.state).available) this.emit('giftAvailable');
    if (!this.state.flags.intro) this.emit('firstRun');
  }

  async _loadCloud() {
    const raw = await platform.getCloudData(CLOUD_KEY);
    if (!raw) {
      this.cloudStatus = platform.player ? 'on' : 'off';
      return;
    }
    const cloudState = deserializeState(raw);
    if (!cloudState) return;
    const localTime = this.state.updatedAt || 0;
    const cloudTime = cloudState.updatedAt || 0;
    if (!this.hadLocal || cloudTime > localTime + 1000) {
      // На облаке более свежий прогресс.
      this.state = cloudState;
      this._saveLocal();
      this.emit('cloudLoaded');
      if (this.state.settings.langManual) setLang(this.state.settings.lang, { silent: true });
    } else if (localTime > cloudTime + 1000) {
      this.scheduleCloudSave(1200);
    }
    this.cloudStatus = 'on';
    this.emit('cloud', this.cloudStatus);
  }

  _saveLocal() {
    try {
      localStorage.setItem(SAVE_KEY, serializeState(this.state));
      return true;
    } catch {
      return false;
    }
  }

  /** Основная точка сохранения. */
  save({ cloud = true, flush = false } = {}) {
    this.state.updatedAt = Date.now();
    this._saveLocal();
    if (cloud) this.scheduleCloudSave(flush ? 0 : 2200);
    return true;
  }

  scheduleCloudSave(delay = 2200) {
    if (!this.hasCloud) return;
    if (this.cloudTimer) return;
    this.cloudTimer = setTimeout(() => {
      this.cloudTimer = null;
      this._flushCloud();
    }, delay);
  }

  async _flushCloud(force = false) {
    if (!this.hasCloud) return false;
    if (this.cloudInFlight) {
      this.cloudQueued = true;
      return false;
    }
    const now = Date.now();
    if (!force && now - this.lastCloudAt < 5000) {
      this.scheduleCloudSave(5200);
      return false;
    }
    this.cloudInFlight = true;
    this.cloudStatus = 'syncing';
    this.emit('cloud', this.cloudStatus);
    const ok = await platform.setCloudData(CLOUD_KEY, this.state, true);
    this.cloudInFlight = false;
    this.lastCloudAt = Date.now();
    this.cloudStatus = ok ? 'on' : 'error';
    this.emit('cloud', this.cloudStatus);
    if (this.cloudQueued) {
      this.cloudQueued = false;
      this.scheduleCloudSave(1000);
    }
    return ok;
  }

  async forceCloudSave() {
    return this._flushCloud(true);
  }

  // ── Действия игрока ──────────────────────────────────────────────────────

  recordCast(perfect) {
    ensureDaily(this.state);
    this.state.stats.casts += 1;
    if (perfect) {
      this.state.stats.perfectCasts += 1;
      if (this.state.daily?.stats) this.state.daily.stats.perfectCasts += 1;
    }
    this.save();
  }

  recordPerfectReel() {
    ensureDaily(this.state);
    this.state.stats.perfectReels += 1;
    if (this.state.daily?.stats) this.state.daily.stats.perfectReels += 1;
    const unlocked = checkAchievements(this.state);
    this.save();
    unlocked.forEach((a) => this.emit('achievement', a));
  }

  catchFish(fish, options = {}) {
    ensureDaily(this.state);
    const summary = applyCatch(this.state, fish, options);
    this.save();
    this.submitScore();
    this.emit('catch', summary);
    for (const achievement of summary.achievements || []) this.emit('achievement', achievement);
    if (summary.levels.length) {
      this.emit('levelup', { levels: summary.levels, ranks: summary.ranks, level: this.state.level });
    }
    return summary;
  }

  grantBonusSparks(amount) {
    const value = Math.max(0, Math.round(Number(amount) || 0));
    if (!value) return 0;
    this.state.sparks += value;
    this.state.stats.earnedSparks += value;
    this.save();
    this.emit('bonus', { sparks: value });
    return value;
  }

  claimStory() {
    const result = claimStoryReward(this.state);
    if (!result) return null;
    const unlocked = checkAchievements(this.state);
    this.save();
    this.emit('story', result);
    unlocked.forEach((a) => this.emit('achievement', a));
    if (result.reward?.levels?.length) {
      this.emit('levelup', { levels: result.reward.levels, ranks: result.reward.ranks, level: this.state.level });
    }
    return result;
  }

  claimDaily(taskId) {
    ensureDaily(this.state);
    const result = claimDailyTask(this.state, taskId);
    if (!result) return null;
    const unlocked = checkAchievements(this.state);
    this.save();
    unlocked.forEach((a) => this.emit('achievement', a));
    if (result.allClaimed) this.emit('dailyAllTasks');
    return result;
  }

  claimDailyBonus() {
    ensureDaily(this.state);
    const result = claimDailyBonus(this.state);
    if (!result) return null;
    this.save();
    this.emit('dailyBonus', result);
    return result;
  }

  claimGift() {
    const result = claimGift(this.state);
    if (!result) return null;
    const unlocked = checkAchievements(this.state);
    this.save();
    unlocked.forEach((a) => this.emit('achievement', a));
    return result;
  }

  buyUpgrade(id) {
    const result = buyUpgrade(this.state, id);
    if (result.ok) {
      this.save();
      this.emit('purchase', result);
    }
    return result;
  }

  buyBait(id) {
    const result = buyBait(this.state, id);
    if (result.ok) {
      this.save();
      this.emit('purchase', result);
    }
    return result;
  }

  equipBait(id) {
    const ok = equipBait(this.state, id);
    if (ok) {
      this.save();
      this.emit('bait', id);
    }
    return ok;
  }

  setLocation(locId) {
    if (!this.state.locations.includes(locId) || !LOCATION_BY_ID[locId]) return false;
    if (this.state.currentLocation === locId) return false;
    this.state.currentLocation = locId;
    this.save();
    this.emit('location', locId);
    return true;
  }

  addPlayTime(seconds) {
    this.state.playTime += Math.max(0, seconds);
    this.playSaveCounter += seconds;
    if (this.playSaveCounter > 30) {
      this.playSaveCounter = 0;
      this.save();
    }
  }

  setFlag(key, value = true) {
    if (!(key in this.state.flags)) return;
    this.state.flags[key] = value;
    this.save();
  }

  markTutorial(step) {
    this.state.flags.tutorial = Math.max(this.state.flags.tutorial || 0, step);
    this.save();
  }

  // ── Настройки и язык ─────────────────────────────────────────────────────

  updateSettings(patch) {
    this.state.settings = { ...this.state.settings, ...patch };
    if (patch.lang && ['ru', 'en', 'tr'].includes(patch.lang)) {
      this.state.settings.langManual = true;
      setLang(patch.lang);
    }
    this.save();
    this.emit('settings', this.state.settings);
    return this.state.settings;
  }

  setLanguage(lang) {
    const next = normalizeLang(lang);
    this.state.settings.lang = next;
    this.state.settings.langManual = true;
    setLang(next);
    this.save();
    this.emit('language', next);
    this.emit('settings', this.state.settings);
  }

  // ── Облако, вход, рейтинг ────────────────────────────────────────────────

  async login() {
    const ok = await platform.login();
    this.authName = platform.getUserName();
    this.cloudStatus = platform.player ? 'on' : 'off';
    this.emit('auth', { ok, name: this.authName });
    if (ok) {
      await this.forceCloudSave();
      this.submitScore(true);
    }
    return ok;
  }

  async loadLeaderboard() {
    return platform.getLeaderboard(LEADERBOARD);
  }

  async submitScore(force = false) {
    if (!platform.isAuthorized()) return false;
    const score = scoreForLeaderboard(this.state);
    if (!force && score <= (this.state.scoreSubmitted || 0)) return false;
    const now = Date.now();
    if (!force && now - this.lastScoreAt < 3000) return false;
    this.lastScoreAt = now;
    const ok = await platform.submitScore(LEADERBOARD, score);
    if (ok) {
      this.state.scoreSubmitted = score;
      this._saveLocal();
    }
    return ok;
  }

  async showRewarded() {
    if (!platform.available) return { shown: false, rewarded: false };
    return platform.showRewarded();
  }

  async maybeInterstitial() {
    this.interstitialCounter += 1;
    if (this.interstitialCounter % 5 !== 0) return false;
    return platform.showInterstitial();
  }

  // ── Сброс ────────────────────────────────────────────────────────────────

  async reset() {
    const settings = { ...this.state.settings };
    this.state = createNewState();
    this.state.settings = settings;
    ensureDaily(this.state);
    this._saveLocal();
    if (this.hasCloud) await platform.setCloudData(CLOUD_KEY, this.state, true);
    setLang(settings.lang || 'ru');
    this.emit('reset', this.state);
    this.emit('settings', this.state.settings);
    return this.state;
  }

  // ── Данные для интерфейса ────────────────────────────────────────────────

  get daily() {
    ensureDaily(this.state);
    return dailyView(this.state);
  }

  get gift() {
    return giftView(this.state);
  }

  get quest() {
    return questView(this.state);
  }

  get collectionCount() {
    return collectionCount(this.state);
  }

  achievements() {
    return ACHIEVEMENTS.map((a) => achievementView(this.state, a));
  }

  text(obj) {
    return tData(obj);
  }

  toast(key, vars, type = 'info') {
    this.emit('notice', { text: t(key, vars), type });
  }
}

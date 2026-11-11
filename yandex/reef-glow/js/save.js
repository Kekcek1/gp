/* ==========================================================================
   Сияние рифа / Reef Glow — прогресс, настройки, ежедневный подарок.
   Локальное хранилище + облако Яндекс Игр (player.setData/getData).
   ========================================================================== */
(function (root) {
  'use strict';

  var KEY = 'reefGlowSave_v1';
  var VERSION = 1;
  var TOTAL_LEVELS = 60;

  var ACHIEVEMENTS = [
    { id: 'first_win', reward: 20, check: function (s) { return s.stats.wins >= 1; } },
    { id: 'stars_30', reward: 40, check: function (s) { return totalStars(s) >= 30; } },
    { id: 'stars_90', reward: 80, check: function (s) { return totalStars(s) >= 90; } },
    { id: 'stars_all', reward: 200, check: function (s) { return totalStars(s) >= TOTAL_LEVELS * 3; } },
    { id: 'matches_500', reward: 40, check: function (s) { return s.stats.matches >= 500; } },
    { id: 'algae_100', reward: 40, check: function (s) { return s.stats.algae >= 100; } },
    { id: 'waves_20', reward: 40, check: function (s) { return s.stats.waves >= 20; } },
    { id: 'specials_50', reward: 60, check: function (s) { return s.stats.specials >= 50; } },
    { id: 'daily_3', reward: 40, check: function (s) { return s.daily.bestStreak >= 3; } },
    { id: 'level_60', reward: 150, check: function (s) { return completedLevels(s) >= TOTAL_LEVELS; } }
  ];

  function defaults() {
    return {
      v: VERSION,
      coins: 50,
      boosters: { hammer: 1, shuffle: 1, moves: 0, wave: 0 },
      levels: {},
      achievements: {},
      stats: { wins: 0, matches: 0, algae: 0, waves: 0, specials: 0, plays: 0 },
      daily: { last: '', streak: 0, bestStreak: 0, claims: 0, lastCoins: 0, doubled: '' },
      settings: { lang: 'auto', music: true, sfx: true },
      currentLevel: 1,
      tutorialSeen: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  function totalStars(state) {
    var sum = 0;
    Object.keys(state.levels).forEach(function (id) { sum += Math.max(0, Math.min(3, state.levels[id] | 0)); });
    return sum;
  }

  function completedLevels(state) {
    return Object.keys(state.levels).filter(function (id) { return (state.levels[id] | 0) > 0; }).length;
  }

  function safeParse(str) {
    try { return JSON.parse(str); } catch (e) { return null; }
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function normalize(raw) {
    var base = defaults();
    if (!raw || typeof raw !== 'object') return base;
    var state = base;
    state.coins = Math.max(0, Math.min(999999, Number(raw.coins) || 0));
    if (raw.boosters) {
      ['hammer', 'shuffle', 'moves', 'wave'].forEach(function (k) {
        state.boosters[k] = Math.max(0, Math.min(99, Number(raw.boosters[k]) || 0));
      });
    }
    if (raw.levels && typeof raw.levels === 'object') {
      Object.keys(raw.levels).forEach(function (id) {
        var n = Number(id);
        if (n >= 1 && n <= TOTAL_LEVELS) {
          var stars = Math.max(0, Math.min(3, Number(raw.levels[id]) || 0));
          if (stars > 0) state.levels[n] = stars;
        }
      });
    }
    if (raw.achievements && typeof raw.achievements === 'object') {
      Object.keys(raw.achievements).forEach(function (id) {
        if (raw.achievements[id]) state.achievements[id] = true;
      });
    }
    if (raw.stats) {
      ['wins', 'matches', 'algae', 'waves', 'specials', 'plays'].forEach(function (k) {
        state.stats[k] = Math.max(0, Number(raw.stats[k]) || 0);
      });
    }
    if (raw.daily) {
      state.daily.last = typeof raw.daily.last === 'string' ? raw.daily.last : '';
      state.daily.streak = Math.max(0, Number(raw.daily.streak) || 0);
      state.daily.bestStreak = Math.max(0, Number(raw.daily.bestStreak) || 0);
      state.daily.claims = Math.max(0, Number(raw.daily.claims) || 0);
      state.daily.lastCoins = Math.max(0, Number(raw.daily.lastCoins) || 0);
      state.daily.doubled = typeof raw.daily.doubled === 'string' ? raw.daily.doubled : '';
    }
    if (raw.settings) {
      state.settings.lang = raw.settings.lang === 'ru' || raw.settings.lang === 'en' ? raw.settings.lang : 'auto';
      state.settings.music = raw.settings.music !== false;
      state.settings.sfx = raw.settings.sfx !== false;
    }
    state.currentLevel = Math.max(1, Math.min(TOTAL_LEVELS, Number(raw.currentLevel) || 1));
    state.tutorialSeen = !!raw.tutorialSeen;
    state.createdAt = Number(raw.createdAt) || Date.now();
    state.updatedAt = Number(raw.updatedAt) || Date.now();
    return state;
  }

  function merge(local, cloud) {
    if (!cloud) return local;
    var a = normalize(local);
    var b = normalize(cloud);
    var out = clone(a);
    out.coins = Math.max(a.coins, b.coins);
    ['hammer', 'shuffle', 'moves', 'wave'].forEach(function (k) {
      out.boosters[k] = Math.max(a.boosters[k], b.boosters[k]);
    });
    Object.keys(b.levels).forEach(function (id) {
      out.levels[id] = Math.max(out.levels[id] || 0, b.levels[id]);
    });
    Object.keys(b.achievements).forEach(function (id) { out.achievements[id] = true; });
    ['wins', 'matches', 'algae', 'waves', 'specials', 'plays'].forEach(function (k) {
      out.stats[k] = Math.max(a.stats[k], b.stats[k]);
    });
    if (b.daily.last > a.daily.last) {
      out.daily = clone(b.daily);
    } else if (b.daily.last === a.daily.last) {
      out.daily.streak = Math.max(a.daily.streak, b.daily.streak);
      out.daily.bestStreak = Math.max(a.daily.bestStreak, b.daily.bestStreak);
      out.daily.claims = Math.max(a.daily.claims, b.daily.claims);
      out.daily.lastCoins = Math.max(a.daily.lastCoins, b.daily.lastCoins);
      out.daily.doubled = a.daily.doubled === a.daily.last ? a.daily.doubled : b.daily.doubled;
    }
    out.currentLevel = Math.max(a.currentLevel, b.currentLevel);
    out.settings = clone(a.settings);
    out.tutorialSeen = !!(a.tutorialSeen || b.tutorialSeen);
    out.createdAt = Math.min(a.createdAt, b.createdAt);
    out.updatedAt = Math.max(a.updatedAt, b.updatedAt, Date.now());
    return out;
  }

  function dateKey(date) {
    var d = date || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function yesterdayKey() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    return dateKey(d);
  }

  var Save = {
    state: defaults(),
    _storage: null,
    _cloudTimer: null,
    _cloudBusy: false,
    _dirty: false,

    init: function () {
      var self = this;
      try {
        self._storage = (root.ReefSDK && root.ReefSDK.getStorage && root.ReefSDK.getStorage()) || root.localStorage;
      } catch (e) { self._storage = null; }
      var raw = null;
      try { raw = self._storage ? self._storage.getItem(KEY) : null; } catch (e) { raw = null; }
      self.state = normalize(safeParse(raw));
      return self;
    },

    /** Подмешивает облачное сохранение и возвращает true, если что-то изменилось. */
    mergeCloud: function (cloud) {
      if (!cloud) return false;
      var before = JSON.stringify(this.state);
      this.state = merge(this.state, cloud);
      this._write();
      return before !== JSON.stringify(this.state);
    },

    get: function () { return this.state; },

    totalStars: function () { return totalStars(this.state); },
    completedLevels: function () { return completedLevels(this.state); },
    bestStars: function (id) { return this.state.levels[id] | 0; },
    isLevelUnlocked: function (id) {
      if (id <= 1) return true;
      return (this.state.levels[id - 1] | 0) > 0;
    },
    isChapterUnlocked: function (chapterId) {
      if (chapterId <= 1) return true;
      return (this.state.levels[(chapterId - 1) * 10] | 0) > 0;
    },
    currentLevel: function () {
      for (var i = 1; i <= TOTAL_LEVELS; i++) {
        if ((this.state.levels[i] | 0) === 0) return i;
      }
      return TOTAL_LEVELS;
    },

    addCoins: function (n) {
      this.state.coins = Math.max(0, Math.min(999999, this.state.coins + (n | 0)));
      this.save(false);
    },
    spendCoins: function (n) {
      if (this.state.coins < n) return false;
      this.state.coins -= n;
      this.save(false);
      return true;
    },
    addBooster: function (kind, n) {
      if (!this.state.boosters.hasOwnProperty(kind)) return;
      this.state.boosters[kind] = Math.max(0, Math.min(99, this.state.boosters[kind] + (n || 1)));
      this.save(false);
    },
    useBooster: function (kind) {
      if (!this.state.boosters[kind]) return false;
      this.state.boosters[kind]--;
      this.save(false);
      return true;
    },

    recordWin: function (levelId, stars, stats) {
      var prev = this.state.levels[levelId] | 0;
      var first = prev === 0;
      if (stars > prev) this.state.levels[levelId] = stars;
      this.state.stats.wins++;
      this.state.stats.plays++;
      if (stats) {
        this.state.stats.matches += stats.matches || 0;
        this.state.stats.algae += stats.algae || 0;
        this.state.stats.waves += stats.waves || 0;
        this.state.stats.specials += stats.specials || 0;
      }
      this.state.currentLevel = Math.max(this.state.currentLevel, Math.min(TOTAL_LEVELS, levelId + 1));
      this.save(true);
      return { first: first, prevStars: prev };
    },
    recordLoss: function (stats) {
      this.state.stats.plays++;
      if (stats) {
        this.state.stats.matches += stats.matches || 0;
        this.state.stats.algae += stats.algae || 0;
        this.state.stats.waves += stats.waves || 0;
        this.state.stats.specials += stats.specials || 0;
      }
      this.save(false);
    },

    addStats: function (stats) {
      if (!stats) return;
      this.state.stats.matches += stats.matches || 0;
      this.state.stats.algae += stats.algae || 0;
      this.state.stats.waves += stats.waves || 0;
      this.state.stats.specials += stats.specials || 0;
      this.save(false);
    },

    checkAchievements: function () {
      var unlocked = [];
      var self = this;
      ACHIEVEMENTS.forEach(function (ach) {
        if (self.state.achievements[ach.id]) return;
        var ok = false;
        try { ok = !!ach.check(self.state); } catch (e) { ok = false; }
        if (ok) {
          self.state.achievements[ach.id] = true;
          self.state.coins += ach.reward;
          unlocked.push({ id: ach.id, reward: ach.reward });
        }
      });
      if (unlocked.length) this.save(false);
      return unlocked;
    },
    achievementsList: function () {
      var self = this;
      return ACHIEVEMENTS.map(function (ach) {
        return {
          id: ach.id,
          reward: ach.reward,
          unlocked: !!self.state.achievements[ach.id]
        };
      });
    },

    dailyStatus: function () {
      var today = dateKey();
      var d = this.state.daily;
      var claimedToday = d.last === today;
      var nextStreak = 1;
      if (d.last === yesterdayKey()) nextStreak = Math.max(1, d.streak + 1);
      else if (claimedToday) nextStreak = Math.max(1, d.streak);
      return {
        claimedToday: claimedToday,
        canClaim: !claimedToday,
        streak: claimedToday ? d.streak : nextStreak,
        nextStreak: nextStreak,
        today: today
      };
    },
    claimDaily: function () {
      var status = this.dailyStatus();
      if (!status.canClaim) return { ok: false };
      var streak = status.nextStreak;
      var coins = 25 + Math.min(streak - 1, 6) * 5;
      var booster = streak % 7 === 0;
      this.state.daily.last = status.today;
      this.state.daily.streak = streak;
      this.state.daily.claims++;
      this.state.daily.bestStreak = Math.max(this.state.daily.bestStreak, streak);
      this.state.daily.lastCoins = coins;
      this.state.daily.doubled = '';
      this.state.coins += coins;
      if (booster) this.state.boosters.hammer++;
      this.save(true);
      return { ok: true, coins: coins, booster: booster, streak: streak };
    },
    doubleDaily: function () {
      var d = this.state.daily;
      if (d.last !== dateKey() || d.doubled === dateKey() || !d.lastCoins) return { ok: false };
      d.doubled = dateKey();
      this.state.coins += d.lastCoins;
      this.save(true);
      return { ok: true, coins: d.lastCoins };
    },
    timeUntilTomorrow: function () {
      var now = new Date();
      var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      var ms = next.getTime() - now.getTime();
      var h = Math.floor(ms / 3600000);
      var m = Math.floor((ms % 3600000) / 60000);
      return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    },

    setSetting: function (key, value) {
      this.state.settings[key] = value;
      this.save(false);
    },
    getSetting: function (key) {
      return this.state.settings[key];
    },
    langPref: function () {
      return this.state.settings.lang || 'auto';
    },

    reset: function () {
      var fresh = defaults();
      fresh.coins = 50;
      this.state = fresh;
      this._write();
      if (root.ReefSDK && root.ReefSDK.saveCloud) root.ReefSDK.saveCloud(fresh, true);
    },

    save: function (flush) {
      this.state.updatedAt = Date.now();
      this._write();
      this._scheduleCloud(flush);
    },
    _write: function () {
      try {
        if (this._storage) this._storage.setItem(KEY, JSON.stringify(this.state));
      } catch (e) { /* приватный режим — играем без сохранения */ }
    },
    _scheduleCloud: function (flush) {
      var self = this;
      if (!root.ReefSDK || !root.ReefSDK.available || !root.ReefSDK.player) return;
      self._dirty = true;
      if (self._cloudTimer) clearTimeout(self._cloudTimer);
      if (flush) {
        self._cloudTimer = null;
        self._pushCloud();
        return;
      }
      self._cloudTimer = setTimeout(function () {
        self._cloudTimer = null;
        self._pushCloud();
      }, 1800);
    },
    _pushCloud: function () {
      var self = this;
      if (self._cloudBusy) {
        self._dirty = true;
        return;
      }
      if (!self._dirty) return;
      self._cloudBusy = true;
      self._dirty = false;
      root.ReefSDK.saveCloud(self.state, false).then(function (ok) {
        self._cloudBusy = false;
        if (ok) self._dirty = false;
        if (self._dirty) self._scheduleCloud(false);
      });
    },
    flushCloud: function () {
      this._scheduleCloud(true);
    }
  };

  root.ReefSave = Save;
})(typeof globalThis !== 'undefined' ? globalThis : this);

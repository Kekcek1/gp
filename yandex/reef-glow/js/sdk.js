/* ==========================================================================
   Сияние рифа / Reef Glow — обёртка над SDK Яндекс Игр.
   Все методы безопасны: если SDK нет (локальный запуск, другой хостинг),
   игра работает в локальном режиме без ошибок.
   ========================================================================== */
(function (root) {
  'use strict';

  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () { reject(new Error('timeout')); }, ms);
      Promise.resolve(promise).then(function (value) {
        clearTimeout(timer); resolve(value);
      }, function (err) {
        clearTimeout(timer); reject(err);
      });
    });
  }

  function detectBrowserLang() {
    try {
      var list = (root.navigator && (root.navigator.languages || [root.navigator.language])) || [];
      return list[0] || 'ru';
    } catch (e) { return 'ru'; }
  }

  var SDK = {
    mode: 'local',
    available: false,
    ysdk: null,
    player: null,
    storage: null,
    authorized: false,
    lang: detectBrowserLang(),
    lastError: null,

    init: function () {
      var self = this;
      self.lang = detectBrowserLang();
      if (!root.YaGames || typeof root.YaGames.init !== 'function') {
        self.mode = 'local';
        return Promise.resolve(self);
      }
      return withTimeout(root.YaGames.init(), 8000).then(function (ysdk) {
        self.ysdk = ysdk;
        self.available = true;
        self.mode = 'yandex';
        try {
          if (ysdk.environment && ysdk.environment.i18n && ysdk.environment.i18n.lang) {
            self.lang = ysdk.environment.i18n.lang;
          }
        } catch (e) { /* ignore */ }
        return self._loadPlayer().then(function () {
          return self._loadStorage();
        }).then(function () {
          return self;
        });
      }).catch(function (err) {
        self.lastError = err;
        self.mode = 'local';
        self.available = false;
        return self;
      });
    },

    _loadPlayer: function () {
      var self = this;
      if (!self.ysdk || !self.ysdk.getPlayer) return Promise.resolve(null);
      return withTimeout(self.ysdk.getPlayer(), 5000).then(function (player) {
        self.player = player;
        try { self.authorized = !!(player && player.isAuthorized && player.isAuthorized()); }
        catch (e) { self.authorized = false; }
        return player;
      }).catch(function () {
        self.player = null;
        self.authorized = false;
        return null;
      });
    },

    _loadStorage: function () {
      var self = this;
      if (!self.ysdk || !self.ysdk.getStorage) return Promise.resolve(null);
      return withTimeout(self.ysdk.getStorage(), 5000).then(function (storage) {
        self.storage = storage;
        return storage;
      }).catch(function () {
        self.storage = null;
        return null;
      });
    },

    ready: function () {
      try {
        if (this.ysdk && this.ysdk.features && this.ysdk.features.LoadingAPI) {
          this.ysdk.features.LoadingAPI.ready();
        }
      } catch (e) { /* SDK не должен ломать игру */ }
    },

    gameplayStart: function () {
      try {
        if (this.ysdk && this.ysdk.features && this.ysdk.features.GameplayAPI) {
          this.ysdk.features.GameplayAPI.start();
        }
      } catch (e) { /* ignore */ }
      this._gameplayActive = true;
    },

    gameplayStop: function () {
      try {
        if (this.ysdk && this.ysdk.features && this.ysdk.features.GameplayAPI) {
          this.ysdk.features.GameplayAPI.stop();
        }
      } catch (e) { /* ignore */ }
      this._gameplayActive = false;
    },

    showFullscreen: function () {
      var self = this;
      return new Promise(function (resolve) {
        if (!self.available || !self.ysdk || !self.ysdk.adv || !self.ysdk.adv.showFullscreenAdv) {
          resolve({ shown: false, local: true });
          return;
        }
        var finished = false;
        function finish(shown) {
          if (finished) return;
          finished = true;
          resolve({ shown: !!shown, local: false });
        }
        try {
          self.ysdk.adv.showFullscreenAdv({
            callbacks: {
              onClose: function (wasShown) { finish(wasShown); },
              onError: function () { finish(false); }
            }
          });
        } catch (e) { finish(false); }
        setTimeout(function () { finish(false); }, 45000);
      });
    },

    showRewarded: function () {
      var self = this;
      return new Promise(function (resolve) {
        if (!self.available || !self.ysdk || !self.ysdk.adv || !self.ysdk.adv.showRewardedVideo) {
          resolve({ rewarded: false, shown: false, local: true });
          return;
        }
        var finished = false;
        var rewarded = false;
        function finish(shown) {
          if (finished) return;
          finished = true;
          resolve({ rewarded: rewarded, shown: !!shown, local: false });
        }
        try {
          self.ysdk.adv.showRewardedVideo({
            callbacks: {
              onRewarded: function () { rewarded = true; },
              onClose: function (wasShown) { finish(wasShown); },
              onError: function () { finish(false); }
            }
          });
        } catch (e) { finish(false); }
        setTimeout(function () { finish(false); }, 90000);
      });
    },

    getStorage: function () {
      return this.storage;
    },

    loadCloud: function () {
      var self = this;
      if (!self.player || !self.player.getData) return Promise.resolve(null);
      return withTimeout(self.player.getData(['reefSave']), 8000).then(function (data) {
        if (data && data.reefSave && typeof data.reefSave === 'object') return data.reefSave;
        return null;
      }).catch(function () { return null; });
    },

    saveCloud: function (data, flush) {
      var self = this;
      if (!self.player || !self.player.setData) return Promise.resolve(false);
      return withTimeout(self.player.setData({ reefSave: data }, !!flush), 8000).then(function () {
        return true;
      }).catch(function () { return false; });
    },

    auth: function () {
      var self = this;
      if (!self.available || !self.ysdk || !self.ysdk.auth || !self.ysdk.auth.openAuthDialog) {
        return Promise.resolve(false);
      }
      return withTimeout(self.ysdk.auth.openAuthDialog(), 120000).then(function () {
        return self._loadPlayer().then(function () { return self.authorized; });
      }).catch(function () { return false; });
    },

    setLeaderboardScore: function (score) {
      var self = this;
      if (!self.available || !self.authorized || !self.ysdk || !self.ysdk.leaderboards) return Promise.resolve(false);
      return withTimeout(self.ysdk.leaderboards.setScore('reef_stars', Math.max(0, Math.floor(score))), 8000)
        .then(function () { return true; })
        .catch(function () { return false; });
    },

    getLeaderboard: function () {
      var self = this;
      if (!self.available || !self.ysdk || !self.ysdk.leaderboards) return Promise.resolve(null);
      return withTimeout(self.ysdk.leaderboards.getEntries('reef_stars', {
        quantityTop: 20,
        includeUser: true,
        quantityAround: 2
      }), 10000).then(function (result) {
        return result || null;
      }).catch(function () { return null; });
    },

    isAvailable: function (method) {
      var self = this;
      if (!self.available || !self.ysdk || !self.ysdk.isAvailableMethod) return Promise.resolve(false);
      return self.ysdk.isAvailableMethod(method).catch(function () { return false; });
    }
  };

  root.ReefSDK = SDK;
})(typeof globalThis !== 'undefined' ? globalThis : this);

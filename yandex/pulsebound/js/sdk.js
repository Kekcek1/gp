/* Pulsebound — Yandex Games SDK integration.
   The SDK is connected with the official relative /sdk.js path in index.html.
   Everything degrades gracefully when the game runs outside Yandex (local dev). */
(function (global) {
    'use strict';

    var SDK = {
        ysdk: null,
        player: null,
        available: false,
        initialized: false,
        authorized: false,
        lang: null,
        appId: null,
        username: '',
        avatar: '',
        offline: true,
        lastError: null,
        _loadingReady: false,
        _gameplayActive: false,
        _lastScoreAt: 0,
        _lastScore: -1,
        _initializing: null,
        pauseHandler: null,
        resumeHandler: null,

        init: function () {
            var self = this;
            if (this._initializing) return this._initializing;
            this._initializing = new Promise(function (resolve) {
                if (typeof global.YaGames === 'undefined') {
                    // Local development or a blocked SDK. The game stays playable.
                    self.offline = true;
                    self.initialized = true;
                    setTimeout(function () { resolve(self); }, 350);
                    return;
                }
                var settled = false;
                var timer = setTimeout(function () {
                    if (settled) return;
                    settled = true;
                    self.offline = true;
                    self.initialized = true;
                    self.lastError = new Error('SDK init timeout');
                    resolve(self);
                }, 7000);

                var initPromise;
                try {
                    initPromise = global.YaGames.init();
                } catch (e) {
                    clearTimeout(timer);
                    self.offline = true;
                    self.initialized = true;
                    self.lastError = e;
                    resolve(self);
                    return;
                }
                Promise.resolve(initPromise).then(function (ysdk) {
                    if (settled) return;
                    settled = true;
                    clearTimeout(timer);
                    self.ysdk = ysdk;
                    self.available = true;
                    self.offline = false;
                    self.initialized = true;
                    try {
                        self.lang = ysdk.environment && ysdk.environment.i18n && ysdk.environment.i18n.lang;
                        self.appId = ysdk.environment && ysdk.environment.app && ysdk.environment.app.id;
                    } catch (e) { /* ignore */ }
                    self.bindEvents();
                    Promise.race([
                        self.initPlayer(),
                        new Promise(function (r) { setTimeout(r, 4000); })
                    ]).then(function () {
                        resolve(self);
                    });
                }).catch(function (err) {
                    if (settled) return;
                    settled = true;
                    clearTimeout(timer);
                    self.offline = true;
                    self.initialized = true;
                    self.lastError = err;
                    resolve(self);
                });
            });
            return this._initializing;
        },

        bindEvents: function () {
            var self = this;
            try {
                this.ysdk.on('game_api_pause', function () {
                    if (typeof self.pauseHandler === 'function') self.pauseHandler();
                });
                this.ysdk.on('game_api_resume', function () {
                    if (typeof self.resumeHandler === 'function') self.resumeHandler();
                });
            } catch (e) { /* ignore */ }
        },

        initPlayer: function () {
            var self = this;
            if (!this.ysdk || typeof this.ysdk.getPlayer !== 'function') return Promise.resolve(null);
            return Promise.resolve()
                .then(function () { return self.ysdk.getPlayer(); })
                .then(function (player) {
                    self.player = player;
                    self.authorized = !!(player && typeof player.isAuthorized === 'function' && player.isAuthorized());
                    try {
                        self.username = (player && typeof player.getName === 'function' && player.getName()) || '';
                    } catch (e) { self.username = ''; }
                    try {
                        self.avatar = (player && typeof player.getPhoto === 'function' && player.getPhoto('small')) || '';
                    } catch (e) { self.avatar = ''; }
                    return player;
                })
                .catch(function (err) {
                    self.lastError = err;
                    self.player = null;
                    self.authorized = false;
                    return null;
                });
        },

        loadCloud: function () {
            if (!this.player) return Promise.resolve(null);
            return PB.Storage.initCloud(this.player);
        },

        loadingReady: function () {
            if (this._loadingReady) return;
            this._loadingReady = true;
            try {
                if (this.ysdk && this.ysdk.features && this.ysdk.features.LoadingAPI) {
                    this.ysdk.features.LoadingAPI.ready();
                }
            } catch (e) { /* ignore */ }
        },

        gameplayStart: function () {
            if (this._gameplayActive) return;
            this._gameplayActive = true;
            try {
                if (this.ysdk && this.ysdk.features && this.ysdk.features.GameplayAPI) {
                    this.ysdk.features.GameplayAPI.start();
                }
            } catch (e) { /* ignore */ }
        },

        gameplayStop: function () {
            if (!this._gameplayActive) return;
            this._gameplayActive = false;
            try {
                if (this.ysdk && this.ysdk.features && this.ysdk.features.GameplayAPI) {
                    this.ysdk.features.GameplayAPI.stop();
                }
            } catch (e) { /* ignore */ }
        },

        showFullscreen: function (onOpen, onClose, onError) {
            var self = this;
            if (!this.available || !this.ysdk || !this.ysdk.adv || typeof this.ysdk.adv.showFullscreenAdv !== 'function') {
                if (typeof onClose === 'function') setTimeout(function () { onClose(false); }, 80);
                return false;
            }
            try {
                this.ysdk.adv.showFullscreenAdv({
                    callbacks: {
                        onOpen: function () { if (typeof onOpen === 'function') onOpen(); },
                        onClose: function (wasShown) { if (typeof onClose === 'function') onClose(!!wasShown); },
                        onError: function (err) {
                            self.lastError = err;
                            if (typeof onError === 'function') onError(err);
                            if (typeof onClose === 'function') onClose(false);
                        }
                    }
                });
                return true;
            } catch (e) {
                this.lastError = e;
                if (typeof onError === 'function') onError(e);
                if (typeof onClose === 'function') onClose(false);
                return false;
            }
        },

        showRewarded: function (onRewarded, onClose, onError) {
            var self = this;
            var rewarded = false;
            if (!this.available || !this.ysdk || !this.ysdk.adv || typeof this.ysdk.adv.showRewardedVideo !== 'function') {
                if (typeof onError === 'function') onError(new Error('ADS_UNAVAILABLE'));
                if (typeof onClose === 'function') setTimeout(function () { onClose(false, false); }, 80);
                return false;
            }
            try {
                this.ysdk.adv.showRewardedVideo({
                    callbacks: {
                        onOpen: function () {},
                        onRewarded: function () {
                            rewarded = true;
                            if (typeof onRewarded === 'function') onRewarded();
                        },
                        onClose: function (wasShown) {
                            if (typeof onClose === 'function') onClose(!!wasShown, rewarded);
                        },
                        onError: function (err) {
                            self.lastError = err;
                            if (typeof onError === 'function') onError(err);
                            if (typeof onClose === 'function') onClose(false, rewarded);
                        }
                    }
                });
                return true;
            } catch (e) {
                this.lastError = e;
                if (typeof onError === 'function') onError(e);
                if (typeof onClose === 'function') onClose(false, false);
                return false;
            }
        },

        isLeaderboardAvailable: function (name) {
            var self = this;
            if (!this.available || !this.ysdk || !this.ysdk.leaderboards) return Promise.resolve(false);
            if (typeof this.ysdk.isAvailableMethod !== 'function') return Promise.resolve(true);
            return Promise.resolve(this.ysdk.isAvailableMethod('leaderboards.' + name))
                .then(function (ok) { return !!ok; })
                .catch(function () { return false; });
        },

        getLeaderboard: function (name) {
            var self = this;
            if (!this.available || !this.ysdk || !this.ysdk.leaderboards) {
                return Promise.resolve({ ok: false, reason: 'offline' });
            }
            return this.isLeaderboardAvailable('getEntries').then(function (ok) {
                if (!ok) return { ok: false, reason: 'unavailable' };
                return Promise.resolve(self.ysdk.leaderboards.getEntries(name, {
                    quantityTop: 10,
                    includeUser: !!self.authorized,
                    quantityAround: 3
                })).then(function (res) {
                    return { ok: true, data: res };
                }).catch(function (err) {
                    return { ok: false, reason: 'error', error: err };
                });
            });
        },

        setLeaderboardScore: function (name, score) {
            var self = this;
            if (!this.available || !this.ysdk || !this.ysdk.leaderboards || !this.authorized) return Promise.resolve(false);
            var now = Date.now();
            if (now - this._lastScoreAt < 1100) return Promise.resolve(false);
            if (this._lastScore >= score) return Promise.resolve(false);
            return this.isLeaderboardAvailable('setScore').then(function (ok) {
                if (!ok) return false;
                self._lastScoreAt = Date.now();
                self._lastScore = score;
                return Promise.resolve(self.ysdk.leaderboards.setScore(name, Math.floor(score)))
                    .then(function () { return true; })
                    .catch(function () { return false; });
            }).catch(function () { return false; });
        },

        login: function () {
            var self = this;
            if (!this.available || !this.ysdk || !this.ysdk.auth || typeof this.ysdk.auth.openAuthDialog !== 'function') {
                return Promise.resolve({ ok: false, reason: 'unavailable' });
            }
            return Promise.resolve(this.ysdk.auth.openAuthDialog())
                .then(function () { return self.initPlayer(); })
                .then(function () { return self.loadCloud(); })
                .then(function () {
                    return { ok: true, authorized: self.authorized };
                })
                .catch(function (err) {
                    return { ok: false, reason: 'cancelled', error: err };
                });
        },

        isAuthorized: function () {
            return !!(this.player && this.authorized);
        }
    };

    global.PB = global.PB || {};
    global.PB.SDK = SDK;
})(window);

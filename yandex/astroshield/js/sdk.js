/* Yandex Games SDK bridge with safe local fallback. */
(function () {
  "use strict";

  const AG = (window.AG = window.AG || {});

  const SDK = (AG.SDK = {
    active: false,
    ysdk: null,
    player: null,
    authorized: false,
    platformPaused: false,
    readyRequested: false,
    readyCalled: false,
    gameplayActive: false,
    adBusy: false,
    leaderboardName: "astroshield_score",
    log: [],
    lastError: null,
    callbacks: {}
  });

  function log(event, data) {
    SDK.log.push({ t: Date.now(), event: event, data: data || null });
    if (SDK.log.length > 80) SDK.log.shift();
  }

  function loadScript(src, timeoutMs) {
    return new Promise(function (resolve) {
      if (typeof window.YaGames !== "undefined") {
        resolve(true);
        return;
      }
      let done = false;
      const s = document.createElement("script");
      const timer = window.setTimeout(function () {
        if (done) return;
        done = true;
        resolve(false);
      }, timeoutMs || 8000);
      s.src = src;
      s.async = true;
      s.onload = function () {
        if (done) return;
        done = true;
        window.clearTimeout(timer);
        resolve(typeof window.YaGames !== "undefined");
      };
      s.onerror = function () {
        if (done) return;
        done = true;
        window.clearTimeout(timer);
        resolve(false);
      };
      document.head.appendChild(s);
    });
  }

  function withTimeout(promise, ms, fallback) {
    return Promise.race([
      promise,
      new Promise(function (resolve) {
        window.setTimeout(function () { resolve(fallback); }, ms);
      })
    ]);
  }

  SDK.init = async function (options) {
    SDK.callbacks = options || {};
    if (location.protocol === "file:") {
      log("skip", "file protocol");
      return false;
    }
    const loaded = await loadScript("/sdk.js", 8000);
    if (!loaded) {
      log("unavailable");
      return false;
    }
    let ysdk;
    try {
      ysdk = await withTimeout(Promise.resolve(window.YaGames.init()), 10000, null);
    } catch (e) {
      SDK.lastError = String(e && e.message ? e.message : e);
      log("init-error", SDK.lastError);
      return false;
    }
    if (!ysdk) {
      log("init-timeout");
      return false;
    }
    SDK.ysdk = ysdk;
    SDK.active = true;
    log("init");

    // Subscribe before any slow requests: the platform may show a startup
    // fullscreen ad immediately after init and we must not miss its pause.
    try {
      if (ysdk.on) {
        ysdk.on("game_api_pause", function () {
          SDK.platformPaused = true;
          log("platform-pause");
          if (SDK.callbacks.onPlatformPause) SDK.callbacks.onPlatformPause();
        });
        ysdk.on("game_api_resume", function () {
          SDK.platformPaused = false;
          log("platform-resume");
          if (SDK.readyRequested && !SDK.readyCalled) SDK.markReady();
          if (SDK.callbacks.onPlatformResume) SDK.callbacks.onPlatformResume();
        });
        if (ysdk.EVENTS && ysdk.EVENTS.ACCOUNT_SELECTION_DIALOG_CLOSED) {
          ysdk.on(ysdk.EVENTS.ACCOUNT_SELECTION_DIALOG_CLOSED, function () {
            log("account-selection-closed");
            SDK.refreshPlayer().then(function () {
              if (SDK.callbacks.onAccountChange) SDK.callbacks.onAccountChange();
            });
          });
        }
      }
    } catch (e) {
      log("events-error", String(e && e.message ? e.message : e));
    }

    try {
      SDK.player = await withTimeout(ysdk.getPlayer(), 6000, null);
      if (SDK.player && typeof SDK.player.isAuthorized === "function") {
        SDK.authorized = !!SDK.player.isAuthorized();
      }
    } catch (e) {
      SDK.player = null;
      log("player-error", String(e && e.message ? e.message : e));
    }

    if (SDK.readyRequested) SDK.markReady();
    return true;
  };

  SDK.refreshPlayer = async function () {
    if (!SDK.active || !SDK.ysdk) return null;
    try {
      SDK.player = await SDK.ysdk.getPlayer();
      SDK.authorized = SDK.player && SDK.player.isAuthorized ? !!SDK.player.isAuthorized() : false;
      log("player-refresh", SDK.authorized);
      return SDK.player;
    } catch (e) {
      log("player-refresh-error", String(e && e.message ? e.message : e));
      return null;
    }
  };

  SDK.getLang = function () {
    try {
      return SDK.ysdk.environment.i18n.lang || null;
    } catch (e) {
      return null;
    }
  };

  SDK.isActive = function () { return SDK.active; };
  SDK.isAuthorized = function () { return !!(SDK.active && SDK.authorized); };

  SDK.markReady = function () {
    SDK.readyRequested = true;
    if (!SDK.active || SDK.readyCalled) return;
    if (SDK.platformPaused) return;
    try {
      if (SDK.ysdk.features && SDK.ysdk.features.LoadingAPI) {
        SDK.ysdk.features.LoadingAPI.ready();
      }
      SDK.readyCalled = true;
      log("ready");
    } catch (e) {
      SDK.lastError = String(e && e.message ? e.message : e);
      log("ready-error", SDK.lastError);
    }
  };

  SDK.gameplayStart = function () {
    if (!SDK.active) return;
    if (SDK.gameplayActive) return;
    try {
      if (SDK.ysdk.features && SDK.ysdk.features.GameplayAPI) {
        SDK.ysdk.features.GameplayAPI.start();
      }
      SDK.gameplayActive = true;
      log("gameplay-start");
    } catch (e) {
      log("gameplay-start-error", String(e && e.message ? e.message : e));
    }
  };

  SDK.gameplayStop = function () {
    if (!SDK.active) return;
    if (!SDK.gameplayActive) return;
    try {
      if (SDK.ysdk.features && SDK.ysdk.features.GameplayAPI) {
        SDK.ysdk.features.GameplayAPI.stop();
      }
      SDK.gameplayActive = false;
      log("gameplay-stop");
    } catch (e) {
      log("gameplay-stop-error", String(e && e.message ? e.message : e));
    }
  };

  SDK.isAvailable = async function (method) {
    if (!SDK.active) return false;
    try {
      return !!(await SDK.ysdk.isAvailableMethod(method));
    } catch (e) {
      return false;
    }
  };

  SDK.showRewarded = function (cb) {
    const callbacks = cb || {};
    if (!SDK.active) {
      log("rewarded-local");
      if (callbacks.onRewarded) callbacks.onRewarded();
      if (callbacks.onClose) callbacks.onClose(true);
      return true;
    }
    if (SDK.adBusy) {
      if (callbacks.onError) callbacks.onError({ code: "AD_BUSY" });
      return false;
    }
    SDK.adBusy = true;
    log("rewarded-open");
    let rewarded = false;
    try {
      SDK.ysdk.adv.showRewardedVideo({
        callbacks: {
          onOpen: function () {
            log("rewarded-visible");
            if (callbacks.onOpen) callbacks.onOpen();
          },
          onRewarded: function () {
            rewarded = true;
            log("rewarded-reward");
            if (callbacks.onRewarded) callbacks.onRewarded();
          },
          onClose: function (wasShown) {
            SDK.adBusy = false;
            log("rewarded-close", { wasShown: wasShown, rewarded: rewarded });
            if (callbacks.onClose) callbacks.onClose(wasShown, rewarded);
          },
          onError: function (error) {
            SDK.adBusy = false;
            SDK.lastError = error ? String(error.code || error.message || error) : "AD_ERROR";
            log("rewarded-error", SDK.lastError);
            if (callbacks.onError) callbacks.onError(error);
          }
        }
      });
    } catch (e) {
      SDK.adBusy = false;
      SDK.lastError = String(e && e.message ? e.message : e);
      log("rewarded-throw", SDK.lastError);
      if (callbacks.onError) callbacks.onError(e);
      return false;
    }
    return true;
  };

  SDK.showFullscreen = function (cb) {
    const callbacks = cb || {};
    if (!SDK.active) {
      log("fullscreen-local");
      if (callbacks.onClose) callbacks.onClose(false);
      return false;
    }
    if (SDK.adBusy) {
      if (callbacks.onClose) callbacks.onClose(false);
      return false;
    }
    SDK.adBusy = true;
    log("fullscreen-open");
    try {
      SDK.ysdk.adv.showFullscreenAdv({
        callbacks: {
          onOpen: function () {
            log("fullscreen-visible");
            if (callbacks.onOpen) callbacks.onOpen();
          },
          onClose: function (wasShown) {
            SDK.adBusy = false;
            log("fullscreen-close", { wasShown: wasShown });
            if (callbacks.onClose) callbacks.onClose(wasShown);
          },
          onError: function (error) {
            SDK.adBusy = false;
            SDK.lastError = error ? String(error.code || error.message || error) : "AD_ERROR";
            log("fullscreen-error", SDK.lastError);
            if (callbacks.onError) callbacks.onError(error);
            if (callbacks.onClose) callbacks.onClose(false);
          }
        }
      });
    } catch (e) {
      SDK.adBusy = false;
      SDK.lastError = String(e && e.message ? e.message : e);
      log("fullscreen-throw", SDK.lastError);
      if (callbacks.onClose) callbacks.onClose(false);
      return false;
    }
    return true;
  };

  SDK.getCloudData = async function () {
    if (!SDK.active || !SDK.player) return null;
    try {
      const data = await SDK.player.getData();
      log("cloud-load", data && Object.keys(data).length);
      return data && data.save ? data.save : null;
    } catch (e) {
      log("cloud-load-error", String(e && e.message ? e.message : e));
      return null;
    }
  };

  SDK.setCloudData = async function (save) {
    if (!SDK.active || !SDK.player) return false;
    try {
      await SDK.player.setData({ save: save }, true);
      log("cloud-save");
      return true;
    } catch (e) {
      log("cloud-save-error", String(e && e.message ? e.message : e));
      return false;
    }
  };

  SDK.login = async function () {
    if (!SDK.active || !SDK.ysdk) return false;
    try {
      if (SDK.player && SDK.player.isAuthorized && SDK.player.isAuthorized()) {
        SDK.authorized = true;
        return true;
      }
      await SDK.ysdk.auth.openAuthDialog();
      const p = await SDK.ysdk.getPlayer();
      SDK.player = p;
      SDK.authorized = p && p.isAuthorized ? !!p.isAuthorized() : false;
      log("login", SDK.authorized);
      return SDK.authorized;
    } catch (e) {
      SDK.lastError = String(e && e.message ? e.message : e);
      log("login-error", SDK.lastError);
      return false;
    }
  };

  SDK.leaderboardAvailable = async function () {
    if (!SDK.active) return false;
    return SDK.isAvailable("leaderboards.getEntries");
  };

  SDK.getLeaderboardEntries = async function (name, opts) {
    if (!SDK.active) return { ok: false, reason: "offline" };
    try {
      const res = await SDK.ysdk.leaderboards.getEntries(name || SDK.leaderboardName, opts || {
        quantityTop: 10,
        includeUser: true,
        quantityAround: 3
      });
      log("lb-load", res && res.entries ? res.entries.length : 0);
      return { ok: true, data: res };
    } catch (e) {
      const code = e && (e.code || e.message);
      log("lb-error", String(code || e));
      return { ok: false, reason: code || "error" };
    }
  };

  SDK.getLeaderboardEntry = async function (name) {
    if (!SDK.active) return { ok: false, reason: "offline" };
    try {
      const res = await SDK.ysdk.leaderboards.getPlayerEntry(name || SDK.leaderboardName);
      return { ok: true, data: res };
    } catch (e) {
      return { ok: false, reason: e && (e.code || e.message) || "error" };
    }
  };

  SDK.submitScore = async function (score, name) {
    if (!SDK.active || !SDK.authorized) return false;
    const v = Math.floor(Number(score) || 0);
    if (v <= 0) return false;
    const key = "lastSubmit_" + (name || SDK.leaderboardName);
    const now = Date.now();
    if (SDK[key] && now - SDK[key] < 1100) return false;
    SDK[key] = now;
    try {
      const available = await SDK.isAvailable("leaderboards.setScore");
      if (!available) {
        log("lb-submit-unavailable");
        return false;
      }
      await SDK.ysdk.leaderboards.setScore(name || SDK.leaderboardName, v);
      log("lb-submit", v);
      return true;
    } catch (e) {
      SDK.lastError = e && (e.code || e.message) ? String(e.code || e.message) : "LB_ERROR";
      log("lb-submit-error", SDK.lastError);
      return false;
    }
  };

  SDK.destroy = function () {
    try {
      if (SDK.ysdk && SDK.ysdk.off) {
        SDK.ysdk.off("game_api_pause");
        SDK.ysdk.off("game_api_resume");
      }
    } catch (e) { /* noop */ }
  };
})();

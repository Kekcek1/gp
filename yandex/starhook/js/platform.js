// Мост между игрой и Yandex Games SDK.
// Если SDK недоступен (локальный запуск, file://), игра работает автономно.

const SDK_TIMEOUT = 5000;

function withTimeout(promise, ms, fallback = null) {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(fallback);
      }
    }, ms);
    promise
      .then((value) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(value);
        }
      })
      .catch(() => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(fallback);
        }
      });
  });
}

export class Platform {
  constructor() {
    this.ysdk = null;
    this.available = false;
    this.player = null;
    this.authorized = false;
    this.playerName = '';
    this.lang = '';
    this.readyCalled = false;
    this.gameplayActive = false;
    this.pauseHandlers = new Set();
    this.resumeHandlers = new Set();
    this.adInProgress = false;
    this._interstitialLast = 0;
  }

  async init() {
    this.lang = (navigator.language || 'en').slice(0, 2);
    if (typeof window === 'undefined' || !window.YaGames) {
      return this;
    }
    let ysdk = null;
    try {
      ysdk = await withTimeout(window.YaGames.init(), SDK_TIMEOUT, null);
    } catch {
      ysdk = null;
    }
    if (!ysdk) return this;

    this.ysdk = ysdk;
    this.available = true;
    this.lang = ysdk.environment?.i18n?.lang || this.lang;

    try {
      const player = await withTimeout(ysdk.getPlayer(), 4000, null);
      if (player) {
        this.player = player;
        this.authorized = Boolean(player.isAuthorized?.());
        this.playerName = this.authorized ? player.getName?.() || '' : '';
      }
    } catch {
      this.player = null;
    }

    try {
      ysdk.on?.('game_api_pause', () => this.emitPause('sdk'));
      ysdk.on?.('game_api_resume', () => this.emitResume('sdk'));
    } catch {
      // События не критичны для игры.
    }

    return this;
  }

  emitPause(reason) {
    this.pauseHandlers.forEach((fn) => fn(reason));
  }

  emitResume(reason) {
    this.resumeHandlers.forEach((fn) => fn(reason));
  }

  onPause(fn) {
    this.pauseHandlers.add(fn);
    return () => this.pauseHandlers.delete(fn);
  }

  onResume(fn) {
    this.resumeHandlers.add(fn);
    return () => this.resumeHandlers.delete(fn);
  }

  ready() {
    if (this.readyCalled) return;
    this.readyCalled = true;
    try {
      this.ysdk?.features?.LoadingAPI?.ready?.();
    } catch {
      // Ничего страшного: в автономном режиме метода нет.
    }
  }

  gameplayStart() {
    if (!this.available || this.gameplayActive) return;
    this.gameplayActive = true;
    try {
      this.ysdk?.features?.GameplayAPI?.start?.();
    } catch {
      // Игровой процесс продолжается.
    }
  }

  gameplayStop() {
    if (!this.available || !this.gameplayActive) return;
    this.gameplayActive = false;
    try {
      this.ysdk?.features?.GameplayAPI?.stop?.();
    } catch {
      // Игровой процесс уже остановлен.
    }
  }

  isAuthorized() {
    return Boolean(this.player?.isAuthorized?.());
  }

  getUserName() {
    return this.authorized ? this.playerName : '';
  }

  async login() {
    if (!this.ysdk?.auth?.openAuthDialog) return false;
    try {
      await this.ysdk.auth.openAuthDialog();
      const player = await this.ysdk.getPlayer();
      if (player) {
        this.player = player;
        this.authorized = Boolean(player.isAuthorized?.());
        this.playerName = this.authorized ? player.getName?.() || '' : '';
      }
      return this.authorized;
    } catch {
      return false;
    }
  }

  async getCloudData(key) {
    if (!this.player?.getData) return null;
    try {
      const data = await this.player.getData([key]);
      return data && typeof data === 'object' ? data[key] ?? null : null;
    } catch {
      return null;
    }
  }

  async setCloudData(key, value, flush = false) {
    if (!this.player?.setData) return false;
    try {
      await this.player.setData({ [key]: value }, Boolean(flush));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Показывает rewarded-рекламу. Возвращает true, если награда получена.
   */
  showRewarded() {
    return new Promise((resolve) => {
      if (!this.available || !this.ysdk?.adv?.showRewardedVideo) {
        resolve({ shown: false, rewarded: false });
        return;
      }
      let rewarded = false;
      let resolved = false;
      const finish = (shown) => {
        if (resolved) return;
        resolved = true;
        this.adInProgress = false;
        resolve({ shown, rewarded });
      };
      this.adInProgress = true;
      this.emitPause('ad');
      try {
        this.ysdk.adv.showRewardedVideo({
          callbacks: {
            onOpen: () => this.emitPause('ad'),
            onRewarded: () => {
              rewarded = true;
            },
            onClose: (wasShown) => {
              this.emitResume('ad');
              finish(Boolean(wasShown));
            },
            onError: () => {
              this.emitResume('ad');
              finish(false);
            }
          }
        });
      } catch {
        this.adInProgress = false;
        this.emitResume('ad');
        resolve({ shown: false, rewarded: false });
      }
    });
  }

  /**
   * Межстраничная реклама на естественной паузе.
   */
  showInterstitial() {
    return new Promise((resolve) => {
      if (!this.available || !this.ysdk?.adv?.showFullscreenAdv) {
        resolve(false);
        return;
      }
      const now = Date.now();
      if (now - this._interstitialLast < 180000) {
        resolve(false);
        return;
      }
      let resolved = false;
      let shown = false;
      const finish = (value) => {
        if (resolved) return;
        resolved = true;
        this.adInProgress = false;
        this._interstitialLast = Date.now();
        resolve(value);
      };
      this.adInProgress = true;
      this.emitPause('ad');
      try {
        this.ysdk.adv.showFullscreenAdv({
          callbacks: {
            onOpen: () => {
              shown = true;
              this.emitPause('ad');
            },
            onClose: (wasShown) => {
              this.emitResume('ad');
              finish(Boolean(wasShown));
            },
            onError: () => {
              this.emitResume('ad');
              finish(false);
            }
          }
        });
      } catch {
        this.adInProgress = false;
        this.emitResume('ad');
        resolve(false);
      }
      // Страховка, если платформа не вызвала ни один колбэк.
      setTimeout(() => {
        if (!resolved) {
          this.emitResume('ad');
          finish(shown);
        }
      }, 45000);
    });
  }

  async isMethodAvailable(method) {
    if (!this.ysdk?.isAvailableMethod) return false;
    try {
      return Boolean(await this.ysdk.isAvailableMethod(method));
    } catch {
      return false;
    }
  }

  async getLeaderboard(name, options = {}) {
    if (!this.ysdk?.leaderboards || !this.isAuthorized()) return null;
    try {
      const entries = await this.ysdk.leaderboards.getEntries(name, {
        quantityTop: 10,
        includeUser: true,
        quantityAround: 3,
        ...options
      });
      return entries;
    } catch {
      return null;
    }
  }

  async submitScore(name, score) {
    if (!this.ysdk?.leaderboards || !this.isAuthorized()) return false;
    try {
      await this.ysdk.leaderboards.setScore(name, Math.max(0, Math.floor(score)));
      return true;
    } catch {
      return false;
    }
  }

  async serverTime() {
    if (!this.ysdk?.serverTime) return Date.now();
    try {
      const t = await this.ysdk.serverTime();
      return Number(t) || Date.now();
    } catch {
      return Date.now();
    }
  }

  async review() {
    if (!this.ysdk?.feedback?.canReview) return false;
    try {
      const can = await this.ysdk.feedback.canReview();
      if (!can?.value) return false;
      await this.ysdk.feedback.requestReview();
      return true;
    } catch {
      return false;
    }
  }
}

export const platform = new Platform();

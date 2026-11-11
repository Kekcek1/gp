// Точка входа: связывает состояние, сцену, звук, игру и интерфейс.
// Здесь же — пауза, звук при потере фокуса и интеграция с Yandex Games SDK.

import { Store } from './store.js';
import { platform } from './platform.js';
import { Scene } from './scene.js';
import { AudioEngine } from './audio.js';
import { Game } from './game.js';
import { UI } from './ui.js';
import { t } from './i18n.js';

class App {
  constructor() {
    this.store = new Store();
    this.scene = new Scene(document.getElementById('scene'));
    this.audio = new AudioEngine();
    this.pauseReasons = new Set();
    this.wasPlaying = false;
    this.screen = 'loading';
    this.audioUnlocked = false;

    this.ui = new UI({
      store: this.store,
      scene: this.scene,
      audio: this.audio,
      game: null,
      hooks: {
        onGameStart: () => this.onGameStart(),
        onMenu: () => this.toMenu(),
        onPause: () => this.openPause(),
        onResume: () => this.closePause(),
        onModalOpen: () => this.addPause('modal'),
        onModalClose: () => this.removePause('modal'),
        onReset: () => this.onReset(),
        onGameShown: () => this.syncGameplay(),
        onMenuShown: () => this.syncGameplay(),
        onPauseShown: () => {},
        onNaturalBreak: () => this.store.maybeInterstitial()
      }
    });

    this.game = new Game({
      scene: this.scene,
      store: this.store,
      audio: this.audio,
      hooks: {
        onMode: (mode, info) => this.ui.setGameMode(mode, info),
        onPower: (data) => this.ui.updatePower(data),
        onReel: (data) => this.ui.updateReel(data),
        onBite: () => this.ui.showBite(),
        onMiss: (reason) => this.ui.onMiss(reason),
        onEarly: () => this.ui.onEarly(),
        onCatch: (summary) => this.ui.showCatch(summary),
        onEvent: (name) => this.ui.handleGameEvent(name),
        onStruggle: () => {},
        onCatchStart: () => { this.ui.catchPending = true; }
      }
    });
    this.ui.game = this.game;

    this._bindPlatform();
    this._bindAudioUnlock();
    this._bindVisibility();
    this._bindLifecycle();
    this._exposeDebug();
  }

  _bindPlatform() {
    platform.onPause((reason) => this.addPause(reason));
    platform.onResume((reason) => this.removePause(reason));
  }

  _bindAudioUnlock() {
    const unlock = () => {
      if (this.audioUnlocked) return;
      this.audioUnlocked = true;
      this.audio.unlock();
      this.audio.applySettings(this.store.state.settings);
      this.audio.setPaused(this.pauseReasons.size > 0);
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('keydown', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
    };
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('keydown', unlock, true);
    window.addEventListener('touchstart', unlock, true);
  }

  _bindVisibility() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.wasPlaying = this.screen === 'game' && this.game.mode !== 'menu';
        this.addPause('hidden');
      } else {
        this.removePause('hidden');
        if (this.wasPlaying && this.screen === 'game') {
          this.addPause('pause');
          this.ui.showPause();
          this.game.freeze();
          this.audio.setPaused(true);
          platform.gameplayStop();
        }
      }
    });
    window.addEventListener('blur', () => {
      if (this.screen === 'game') this.addPause('focus');
    });
    window.addEventListener('focus', () => {
      this.removePause('focus');
    });
  }

  _bindLifecycle() {
    const save = () => {
      this.store.save({ cloud: true, flush: true });
      if (this.store.hasCloud) this.store.forceCloudSave();
    };
    window.addEventListener('pagehide', save);
    window.addEventListener('beforeunload', save);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.store.save({ cloud: true });
    });
  }

  addPause(reason) {
    this.pauseReasons.add(reason);
    this.game.freeze();
    this.audio.setPaused(true);
    platform.gameplayStop();
    this.syncGameplay();
  }

  removePause(reason) {
    this.pauseReasons.delete(reason);
    // Реклама может кратко забирать фокус у окна; после её закрытия
    // не оставляем игру в паузе из-за этого.
    if (reason === 'ad') this.pauseReasons.delete('focus');
    if (this.pauseReasons.size === 0) {
      this.audio.setPaused(false);
      this.game.unfreeze();
      this.ui.hidePause();
      this.syncGameplay();
    }
  }

  syncGameplay() {
    const active = this.screen === 'game'
      && this.game.mode !== 'menu'
      && this.pauseReasons.size === 0
      && this.ui.modalStack.length === 0;
    if (active) platform.gameplayStart();
    else platform.gameplayStop();
  }

  openPause() {
    if (this.ui.modalStack.length) return;
    this.wasPlaying = this.screen === 'game';
    this.addPause('pause');
    this.ui.showPause();
    this.game.freeze();
    this.audio.setPaused(true);
    platform.gameplayStop();
  }

  closePause() {
    this.ui.hidePause();
    this.removePause('pause');
    if (this.screen === 'game' && this.pauseReasons.size === 0) {
      this.game.unfreeze();
      this.audio.setPaused(false);
      this.syncGameplay();
    }
  }

  onGameStart() {
    this.screen = 'game';
    this.pauseReasons.delete('modal');
    this.game.unfreeze();
    this.audio.unlock();
    this.audio.applySettings(this.store.state.settings);
    this.audio.setPaused(this.pauseReasons.size > 0);
    this.syncGameplay();
  }

  toMenu() {
    if (this.ui.modalStack.length) this.ui.closeAll();
    this.ui.hidePause();
    this.pauseReasons.clear();
    this.game.unfreeze();
    this.screen = 'menu';
    this.game.enterMenu();
    this.ui.showMenu();
    this.audio.setPaused(false);
    this.syncGameplay();
    this.store.save({ cloud: true });
    // Межстраничная реклама только на естественном переходе и не чаще,
    // чем позволяет платформа (внутри есть ограничение по времени).
    if (this.store.state.playTime > 180) {
      setTimeout(() => {
        if (this.screen === 'menu' && this.ui.modalStack.length === 0) {
          this.store.maybeInterstitial();
        }
      }, 900);
    }
  }

  onReset() {
    this.pauseReasons.clear();
    this.game.unfreeze();
    this.audio.setPaused(false);
    this.screen = 'menu';
    this.scene.setLocation(this.store.state.currentLocation);
    this.scene.setGuardians(this.store.state.guardians);
    this.game.enterMenu();
    this.ui.showMenu();
    this.syncGameplay();
  }

  async boot() {
    this.ui.showLoading(t('loading.text'));
    this.scene.setLocation(this.store.state.currentLocation || 'cove');
    this.game.start();
    try {
      await this.store.init();
    } catch (err) {
      console.error('[starhook] init', err);
    }
    this.ui.init();
    this.scene.setLocation(this.store.state.currentLocation || 'cove');
    this.scene.setGuardians(this.store.state.guardians);
    this.game.enterMenu();
    this.ui.showMenu();
    this.ui.refreshHud();
    this.screen = 'menu';
    this.syncGameplay();
    // Game Ready вызываем только когда меню действительно готово к взаимодействию.
    requestAnimationFrame(() => {
      platform.ready();
      window.__starhookReady = true;
      window.dispatchEvent(new CustomEvent('starhook:ready'));
      if (!platform.available) {
        console.info('[starhook] Yandex Games SDK недоступен — автономный режим');
      }
    });
  }

  _exposeDebug() {
    const local = /^(127\.0\.0\.1|localhost)$/.test(location.hostname);
    // Отладочный API доступен только локально, чтобы на платформе нельзя было
    // менять прогресс и рейтинг через консоль.
    if (!local) return;
    window.__STARHOOK__ = {
      app: this,
      store: this.store,
      game: this.game,
      ui: this.ui,
      scene: this.scene,
      audio: this.audio,
      platform,
      ready: false
    };
    window.addEventListener('starhook:ready', () => {
      if (window.__STARHOOK__) window.__STARHOOK__.ready = true;
    });
  }
}

const app = new App();
function bootApp() {
  app.boot().catch((err) => {
    console.error('[starhook] boot', err);
    // Даже при ошибке не оставляем игрока на пустом экране.
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('hidden');
    app.ui.showMenu();
    app.screen = 'menu';
    app.syncGameplay();
    platform.ready();
    window.__starhookReady = true;
  });
}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootApp, { once: true });
} else {
  bootApp();
}

// Для тестов и отладки на локальном сервере (см. _exposeDebug).

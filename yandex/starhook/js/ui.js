// Интерфейс: экраны, HUD, модальные окна и обратная связь.

import { ACHIEVEMENTS, BAIT_BY_ID, CONSTELLATIONS, LOCATIONS, LOCATION_BY_ID, RARITIES, TIPS, UPGRADE_BY_ID } from './data.js';
import { FISH, FISH_BY_ID } from './fish.js';
import {
  collectionCount,
  collectionProgress,
  giftView,
  guardianStatus,
  nextLevelProgress,
  questView,
  rankForLevel
} from './core.js';
import {
  applyStaticTranslations,
  formatNumber,
  formatWeight,
  getLang,
  t,
  tData
} from './i18n.js';
import { hydrateIcons, icon } from './icons.js';
import { renderFishThumb, startFishPortrait } from './fishart.js';
import {
  achievementsView,
  catchView,
  collectionView,
  confirmView,
  endingView,
  fishDetailView,
  fishName,
  giftViewFor,
  guardianView,
  helpView,
  introView,
  levelUpView,
  mapView,
  questsView,
  recordsView,
  settingsView,
  shopView
} from './views.js';

const $ = (sel, root = document) => root.querySelector(sel);

const TOAST_ICONS = {
  info: 'spark',
  gold: 'sparkles',
  mint: 'check',
  coral: 'info',
  shard: 'shard',
  trophy: 'trophy'
};

export class UI {
  constructor({ store, scene, audio, game, hooks = {} }) {
    this.store = store;
    this.scene = scene;
    this.audio = audio;
    this.game = game;
    this.hooks = hooks;
    this.screen = 'loading';
    this.modalStack = [];
    this.toastTimers = new Set();
    this.loadingTipTimer = null;
    this.pendingLevelUps = [];
    this.pendingToasts = [];
    this.catchPending = false;
    this.catchSummary = null;
    this.pendingGuardian = null;
    this.endingPending = false;
    this.suppressFlush = false;
    this.adBusy = false;
    this.stopCatchPortrait = null;
    this.stopGuardianAnimation = null;
    this.leaderboard = null;
    this.leaderboardStatus = 'idle';
    this.questTab = 'story';
    this.shopTab = 'upgrades';
    this.collectionFilter = 'all';
    this.lastFocused = null;
    this._loadingTipIndex = Math.floor(Math.random() * 6);
    this._cacheDom();
    this._bindStatic();
    this._applySettingsToScene();
    hydrateIcons(document);
    this._setLoadingTip();
    this._startLoadingTips();
    this.updateSoundIcons();
    this.refreshHud();
  }

  _cacheDom() {
    this.el = {
      loading: $('#loading'),
      loadingText: $('#loading-text'),
      loadingTip: $('#loading-tip'),
      menu: $('#menu'),
      game: $('#game'),
      pause: $('#pause'),
      modalRoot: $('#modal-root'),
      toastRoot: $('#toast-root'),
      menuSound: $('#menu-sound'),
      menuHelp: $('#menu-help'),
      menuSettings: $('#menu-settings'),
      menuHowto: $('#menu-howto-link'),
      menuDaily: $('#menu-daily'),
      menuDailyText: $('#menu-daily-text'),
      menuRank: $('#menu-rank'),
      menuTitle: $('#menu-title'),
      menuCardEyebrow: $('#menu-card-eyebrow'),
      menuSpecies: $('#menu-species'),
      menuScore: $('#menu-score'),
      menuBest: $('#menu-best'),
      menuLevel: $('#menu-level'),
      menuXpFill: $('#menu-xp-fill'),
      menuWelcome: $('#menu-welcome'),
      btnPlay: $('#btn-play'),
      btnPlayLabel: $('#btn-play-label'),
      btnPlayNote: $('#btn-play-note'),
      hud: $('.hud'),
      hudLevel: $('#hud-level'),
      hudRank: $('#hud-rank'),
      hudXpFill: $('#hud-xp-fill'),
      hudSparks: $('#hud-sparks'),
      hudShards: $('#hud-shards'),
      hudSound: $('#hud-sound'),
      hudPause: $('#hud-pause'),
      questChip: $('#quest-chip'),
      questChipLabel: $('#quest-chip-label'),
      questChipTitle: $('#quest-chip-title'),
      questChipBar: $('#quest-chip-bar'),
      questChipCount: $('#quest-chip-count'),
      locationChip: $('#location-chip'),
      locName: $('#loc-name'),
      locWeather: $('#loc-weather'),
      locSigns: $('#loc-signs'),
      bitePrompt: $('#bite-prompt'),
      castHint: $('#cast-hint'),
      powerMeter: $('#power-meter'),
      powerFill: $('#power-fill'),
      powerZone: $('.power-zone'),
      reelPanel: $('#reel-panel'),
      reelTitle: $('#reel-title'),
      reelSubtitle: $('#reel-subtitle'),
      reelPerfect: $('#reel-perfect'),
      tensionMeter: $('#tension-meter'),
      tensionSafe: $('.tension-safe'),
      tensionFill: $('#tension-fill'),
      tensionValue: $('#tension-value'),
      reelProgressFill: $('#reel-progress-fill'),
      progressValue: $('#progress-value'),
      tutorial: $('#tutorial-tip'),
      tutorialText: $('#tutorial-text'),
      tutorialSkip: $('#tutorial-skip'),
      bottomDock: $('#bottom-dock'),
      btnBait: $('#btn-bait'),
      baitName: $('#bait-name'),
      btnCast: $('#btn-cast'),
      castIcon: $('#cast-icon'),
      castLabel: $('#cast-label'),
      castSub: $('#cast-sub'),
      castCancel: $('#cast-cancel'),
      btnCancelCast: $('#btn-cancel-cast'),
      btnResume: $('#btn-resume'),
      btnToMenu: $('#btn-to-menu')
    };
    this.el.menuOpenButtons = document.querySelectorAll('#menu [data-open]');
    this.el.dockButtons = document.querySelectorAll('#game [data-open]');
    this.el.pauseLinks = document.querySelectorAll('#pause [data-open]');
  }

  _bindStatic() {
    const { el } = this;
    el.menuSound?.addEventListener('click', () => this.toggleSound());
    el.hudSound?.addEventListener('click', () => this.toggleSound());
    el.menuHelp?.addEventListener('click', () => this.openHelp());
    el.menuSettings?.addEventListener('click', () => this.openSettings());
    el.menuHowto?.addEventListener('click', () => this.openHelp());
    el.menuDaily?.addEventListener('click', () => this.openGift());
    el.btnPlay?.addEventListener('click', () => this.startFlow());
    el.hudPause?.addEventListener('click', () => this.hooks.onPause?.());
    el.btnResume?.addEventListener('click', () => this.hooks.onResume?.());
    el.btnToMenu?.addEventListener('click', () => this.hooks.onMenu?.());

    el.questChip?.addEventListener('click', () => this.openQuests('story'));
    el.questChip?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openQuests('story');
      }
    });
    el.locationChip?.addEventListener('click', () => this.openMap());
    el.locationChip?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openMap();
      }
    });
    el.btnBait?.addEventListener('click', () => this.openShop('baits'));

    el.dockButtons.forEach((btn) => {
      btn.addEventListener('click', () => this.openByKey(btn.dataset.open));
    });
    el.menuOpenButtons.forEach((btn) => {
      btn.addEventListener('click', () => this.openByKey(btn.dataset.open));
    });
    el.pauseLinks.forEach((btn) => {
      btn.addEventListener('click', () => this.openByKey(btn.dataset.open));
    });

    const castDown = (e) => {
      e.preventDefault();
      if (e.pointerId !== undefined && el.btnCast.setPointerCapture) {
        try { el.btnCast.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      }
      el.btnCast.classList.add('holding');
      this.game?.primaryDown('ui');
      this.audio?.unlock();
    };
    const castUp = (e) => {
      e.preventDefault();
      el.btnCast.classList.remove('holding');
      this.game?.primaryUp('ui');
    };
    el.btnCast?.addEventListener('pointerdown', castDown);
    el.btnCast?.addEventListener('pointerup', castUp);
    el.btnCast?.addEventListener('pointercancel', castUp);
    el.btnCast?.addEventListener('contextmenu', (e) => e.preventDefault());
    el.btnCancelCast?.addEventListener('click', () => this.game?.cancelCast('manual'));
    el.tutorialSkip?.addEventListener('click', () => this.skipTutorial());

    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('contextmenu', (e) => {
      if (e.target.closest('#app')) e.preventDefault();
    });
    document.addEventListener('selectstart', (e) => {
      if (e.target.closest('#app')) e.preventDefault();
    });
    window.addEventListener('resize', () => this._onResize());
    this.el.modalRoot.addEventListener('click', (e) => this.onModalClick(e));
    this.el.modalRoot.addEventListener('keydown', (e) => this.onModalKeyDown(e));

    this._subscribeStore();
  }

  _subscribeStore() {
    this.store.on('levelup', (data) => this.onLevelUp(data));
    this.store.on('achievement', (a) => this.toast(t('toast.achievement', { name: tData(a.title) }), 'gold', 'trophy'));
    this.store.on('notice', ({ text, type }) => this.toast(text, type));
    this.store.on('cloudLoaded', () => this.toast(t('toast.cloudLoaded'), 'mint'));
    this.store.on('cloud', (status) => {
      if (status === 'error') this.toast(t('toast.cloudError'), 'coral');
      const settingsModal = this.modalStack.find((m) => m.view === 'settings');
      if (settingsModal) this.replaceModalBody(settingsModal, settingsView(this.store.state, this._settingsMeta()));
    });
    this.store.on('giftAvailable', () => this.updateMenu());
    this.store.on('settings', () => {
      this.updateSoundIcons();
      this._applySettingsToScene();
    });
    this.store.on('language', () => {
      this.refreshTexts();
    });
    this.store.on('auth', ({ ok }) => {
      this.toast(ok ? t('toast.authSuccess') : t('toast.authFail'), ok ? 'mint' : 'coral');
      this.updateMenu();
    });
    this.store.on('bonus', () => this.refreshHud());
  }

  // ── Первичная инициализация ──────────────────────────────────────────────

  _applySettingsToScene() {
    const s = this.store?.state?.settings;
    if (!s) return;
    this.scene?.setQuality(s.quality);
    this.scene?.setReducedMotion(s.reducedMotion);
    this.audio?.applySettings(s);
  }

  _setLoadingTip() {
    const tip = this.el.loadingTip;
    if (!tip) return;
    const tips = TIPS.map((item) => tData(item));
    tip.textContent = tips[this._loadingTipIndex % tips.length] || '';
  }

  _startLoadingTips() {
    this.loadingTipTimer = setInterval(() => {
      if (this.screen !== 'loading') return;
      this._loadingTipIndex += 1;
      this._setLoadingTip();
    }, 3200);
  }

  _stopLoadingTips() {
    if (this.loadingTipTimer) clearInterval(this.loadingTipTimer);
    this.loadingTipTimer = null;
  }

  init() {
    this._applySettingsToScene();
    this.refreshTexts();
    this.scene.setLocation(this.store.state.currentLocation || 'cove');
    this.scene.setGuardians(this.store.state.guardians);
  }

  showLoading(text = t('loading.text')) {
    this.screen = 'loading';
    this.el.loading?.classList.remove('hidden');
    this.el.menu?.classList.add('hidden');
    this.el.game?.classList.add('hidden');
    this.el.pause?.classList.add('hidden');
    if (this.el.loadingText) this.el.loadingText.textContent = text;
  }

  showMenu() {
    this._stopLoadingTips();
    this.screen = 'menu';
    this.el.loading?.classList.add('hidden');
    this.el.game?.classList.add('hidden');
    this.el.pause?.classList.add('hidden');
    this.el.menu?.classList.remove('hidden');
    this.hideBite();
    this.hideReel();
    this.hideTutorial();
    this.game?.enterMenu();
    this.scene.setGuardians(this.store.state.guardians);
    this.updateMenu();
    this.refreshHud();
    this.hooks.onMenuShown?.();
  }

  showGame() {
    this.screen = 'game';
    this.el.loading?.classList.add('hidden');
    this.el.menu?.classList.add('hidden');
    this.el.pause?.classList.add('hidden');
    this.el.game?.classList.remove('hidden');
    this.refreshHud();
    this.hooks.onGameShown?.();
  }

  showPause() {
    this.el.pause?.classList.remove('hidden');
    this.hooks.onPauseShown?.();
  }

  hidePause() {
    this.el.pause?.classList.add('hidden');
  }

  _onResize() {
    if (this.screen === 'game') this.refreshLocationChip();
  }

  // ── Меню и HUD ───────────────────────────────────────────────────────────

  refreshTexts() {
    applyStaticTranslations(document);
    hydrateIcons(document);
    document.title = `${t('app.title')} — ${t('app.subtitle')}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', `${t('app.title')} — ${t('app.subtitle')}. ${t('app.tagline')}`);
    this._setLoadingTip();
    this.updateSoundIcons();
    this.updateMenu();
    this.refreshHud();
    if (this.game) this.setGameMode(this.game.mode, this.game.getUiState());
  }

  updateMenu() {
    const state = this.store.state;
    const rank = rankForLevel(state.level);
    const progress = nextLevelProgress(state);
    const collection = collectionProgress(state);
    const quest = questView(state);
    if (this.el.menuRank) this.el.menuRank.textContent = tData(rank.title);
    if (this.el.menuTitle) {
      const titles = {
        ru: ['Звезд', 'олов'],
        en: ['Star', 'hook'],
        tr: ['Yıldız', 'Oltası']
      };
      const [a, b] = titles[getLang()] || titles.ru;
      const sep = getLang() === 'tr' ? ' ' : '';
      this.el.menuTitle.innerHTML = `<span>${a}</span>${sep}<span class="title-accent">${b}</span>`;
    }
    if (this.el.menuCardEyebrow) {
      this.el.menuCardEyebrow.textContent = state.flags.intro ? t('menu.welcomeBack') : t('menu.firstTime');
    }
    if (this.el.menuSpecies) this.el.menuSpecies.textContent = `${collection.caught} / ${collection.total}`;
    if (this.el.menuScore) this.el.menuScore.textContent = formatNumber(state.score);
    if (this.el.menuBest) this.el.menuBest.textContent = this.bestCatchText();
    if (this.el.menuLevel) this.el.menuLevel.textContent = String(state.level);
    if (this.el.menuXpFill) this.el.menuXpFill.style.width = `${progress.percent}%`;
    if (this.el.btnPlayLabel) {
      this.el.btnPlayLabel.textContent = state.flags.intro ? t('menu.continue') : t('menu.play');
    }
    if (this.el.btnPlayNote) {
      this.el.btnPlayNote.textContent = quest
        ? `${t('quest.storyProgress', { n: quest.index + 1, m: quest.total })} · ${tData(quest.quest.title)}`
        : t('menu.freePlay');
    }
    if (this.el.menuWelcome) {
      this.el.menuWelcome.textContent = state.flags.intro
        ? t('menu.welcomeBack')
        : t('app.tagline');
    }
    const gift = giftView(state);
    if (this.el.menuDaily) {
      this.el.menuDaily.hidden = !gift.available;
      if (gift.available) {
        this.el.menuDaily.classList.remove('hidden');
      } else {
        this.el.menuDaily.classList.add('hidden');
      }
    }
    if (this.el.menuDailyText && gift.available) {
      this.el.menuDailyText.textContent = `${t('gift.day', { n: gift.day })} · ${t('gift.take')}`;
    }
  }

  bestCatchText() {
    const state = this.store.state;
    const fish = state.stats.bestFish ? FISH_BY_ID[state.stats.bestFish.id] : null;
    if (!fish) return '—';
    return `${fishName(fish)} · ${formatWeight(state.stats.bestWeight)}`;
  }

  refreshHud() {
    const state = this.store.state;
    if (this.el.hudLevel) this.el.hudLevel.textContent = String(state.level);
    if (this.el.hudRank) this.el.hudRank.textContent = tData(rankForLevel(state.level).title);
    if (this.el.hudXpFill) this.el.hudXpFill.style.width = `${nextLevelProgress(state).percent}%`;
    if (this.el.hudSparks) this.el.hudSparks.textContent = formatNumber(state.sparks);
    if (this.el.hudShards) this.el.hudShards.textContent = formatNumber(state.shards);
    if (this.el.baitName) {
      const bait = BAIT_BY_ID[state.bait] || BAIT_BY_ID.firefly;
      this.el.baitName.textContent = tData(bait.name);
    }
    this.updateQuestChip();
    this.refreshLocationChip();
    this.updateMenu();
    this.updateSoundIcons();
  }

  updateQuestChip() {
    const state = this.store.state;
    const view = questView(state);
    const chip = this.el.questChip;
    if (!chip) return;
    if (!view) {
      if (this.el.questChipLabel) this.el.questChipLabel.textContent = t('quest.freePlay');
      if (this.el.questChipTitle) this.el.questChipTitle.textContent = t('menu.freePlay');
      if (this.el.questChipBar) this.el.questChipBar.style.width = '100%';
      if (this.el.questChipCount) this.el.questChipCount.textContent = '★';
      return;
    }
    if (this.el.questChipLabel) this.el.questChipLabel.textContent = t('quest.storyProgress', { n: view.index + 1, m: view.total });
    if (this.el.questChipTitle) this.el.questChipTitle.textContent = tData(view.quest.title);
    const goal = view.goals[0];
    const pct = goal ? Math.min(100, (goal.current / goal.target) * 100) : 0;
    if (this.el.questChipBar) this.el.questChipBar.style.width = `${pct}%`;
    if (this.el.questChipCount) {
      this.el.questChipCount.textContent = view.complete
        ? t('quest.ready')
        : goal
          ? `${formatNumber(goal.current)} / ${formatNumber(goal.target)}`
          : '';
    }
  }

  refreshLocationChip() {
    const state = this.store.state;
    const loc = LOCATION_BY_ID[state.currentLocation] || LOCATIONS[0];
    if (!loc) return;
    if (this.el.locName) this.el.locName.textContent = tData(loc.name);
    if (this.el.locWeather) this.el.locWeather.textContent = tData(loc.weather);
    if (this.el.locSigns) {
      const status = guardianStatus(state, loc.id);
      const show = status.active || status.caught;
      this.el.locSigns.innerHTML = show
        ? Array.from({ length: status.need }, (_, i) => `<i class="${(status.caught || i < status.meter) ? 'on' : ''}"></i>`).join('')
        : '';
      this.el.locSigns.title = status.caught
        ? t('loc.guardianCaught')
        : status.active
          ? t('fish.signsHint', { n: Math.max(0, status.need - status.meter) })
          : '';
    }
    this.scene?.setGuardians(state.guardians);
  }

  updateSoundIcons() {
    const s = this.store.state.settings;
    const on = s.sound || s.music;
    const iconName = on ? 'soundOn' : 'soundOff';
    [this.el.menuSound, this.el.hudSound].forEach((btn) => {
      if (!btn) return;
      btn.innerHTML = icon(iconName);
      btn.setAttribute('aria-label', on ? t('hud.soundOn') : t('hud.soundOff'));
      btn.title = on ? t('hud.soundOn') : t('hud.soundOff');
    });
  }

  toggleSound() {
    const s = this.store.state.settings;
    const next = !(s.sound || s.music);
    this.store.updateSettings({ sound: next, music: next });
    this.audio.applySettings(this.store.state.settings);
    this.updateSoundIcons();
  }

  // ── Игровые режимы ───────────────────────────────────────────────────────

  setGameMode(mode, info = {}) {
    this.hideBite();
    if (mode !== 'reeling') this.hideReel();
    const cast = this.el.btnCast;
    cast?.classList.toggle('reeling', mode === 'reeling');
    cast?.classList.remove('holding', 'tension-high');
    if (this.el.castCancel) this.el.castCancel.classList.toggle('hidden', !['waiting', 'bite'].includes(mode));
    if (this.el.powerMeter) this.el.powerMeter.classList.toggle('hidden', mode !== 'charging');
    if (this.el.castHint) this.el.castHint.classList.add('hidden');
    if (mode === 'charging') {
      this.setCastCopy(t('fish.charging'), t('fish.release'));
    } else if (mode === 'casting') {
      this.setCastCopy(t('fish.wait'), t('fish.waitHint'));
    } else if (mode === 'waiting') {
      this.setCastCopy(t('fish.wait'), t('fish.waitHint'));
    } else if (mode === 'bite') {
      this.showBite();
      this.setCastCopy(t('fish.hook'), t('fish.bite'));
    } else if (mode === 'reeling') {
      this.showReel(info);
      this.setCastCopy(t('fish.hold'), t('fish.spaceHint'));
    } else if (mode === 'landed') {
      this.catchPending = true;
      this.setCastCopy(t('fish.landed'), '');
    } else {
      this.catchPending = false;
      this.setCastCopy(t('fish.cast'), t('fish.castHint'));
    }
    if (mode === 'idle') this.catchPending = false;
    this.refreshLocationChip();
  }

  setCastCopy(label, sub) {
    if (this.el.castLabel) this.el.castLabel.textContent = label;
    if (this.el.castSub) this.el.castSub.textContent = sub;
    if (this.el.btnCast) {
      this.el.btnCast.setAttribute('aria-label', label);
      this.el.btnCast.title = sub ? `${label}. ${sub}` : label;
    }
  }

  updatePower({ power, zoneStart, zoneEnd, perfect }) {
    if (this.el.powerFill) this.el.powerFill.style.width = `${Math.min(100, power * 100)}%`;
    if (this.el.powerZone) {
      this.el.powerZone.style.left = `${zoneStart * 100}%`;
      this.el.powerZone.style.width = `${(zoneEnd - zoneStart) * 100}%`;
    }
    this.el.powerMeter?.classList.toggle('perfect', perfect);
  }

  showBite() {
    this.el.bitePrompt?.classList.remove('hidden');
    this.el.btnCast?.classList.add('holding');
  }

  hideBite() {
    this.el.bitePrompt?.classList.add('hidden');
    this.el.btnCast?.classList.remove('holding');
  }

  showReel(info = {}) {
    this.el.reelPanel?.classList.remove('hidden');
    const guardian = Boolean(info.fish?.guardian || info.guardian === true);
    if (this.el.reelTitle) this.el.reelTitle.textContent = guardian ? t('guardian.catch') : t('reel.title');
    if (this.el.reelSubtitle) this.el.reelSubtitle.textContent = guardian ? t('fish.guardian') : t('reel.perfectHint');
    this.updateReel(info);
  }

  hideReel() {
    this.el.reelPanel?.classList.add('hidden');
    this.el.btnCast?.classList.remove('tension-high');
    if (this.el.reelPerfect) this.el.reelPerfect.hidden = true;
  }

  updateReel(info = {}) {
    const { tension = 0, progress = 0, safeLow = 24, safeHigh = 76, struggle, perfect, held } = info;
    if (this.el.tensionFill) this.el.tensionFill.style.width = `${Math.min(100, tension)}%`;
    if (this.el.tensionSafe) {
      this.el.tensionSafe.style.left = `${safeLow}%`;
      this.el.tensionSafe.style.width = `${Math.max(0, safeHigh - safeLow)}%`;
    }
    if (this.el.reelProgressFill) this.el.reelProgressFill.style.width = `${Math.min(100, progress)}%`;
    if (this.el.tensionValue) this.el.tensionValue.textContent = `${Math.round(tension)}%`;
    if (this.el.progressValue) this.el.progressValue.textContent = `${Math.round(progress)}%`;
    if (this.el.reelPerfect) this.el.reelPerfect.hidden = !perfect;
    if (this.el.reelSubtitle) {
      this.el.reelSubtitle.textContent = struggle
        ? t('reel.struggle')
        : tension > safeHigh
          ? t('reel.tooFast')
          : t('reel.perfectHint');
    }
    this.el.btnCast?.classList.toggle('tension-high', tension > safeHigh);
    if (this.el.castLabel) {
      this.el.castLabel.textContent = held
        ? tension > safeHigh ? t('fish.releaseTension') : t('fish.hold')
        : t('fish.hold');
    }
    if (this.el.castSub) this.el.castSub.textContent = held ? t('reel.releaseHint') : t('reel.holdHint');
  }

  onMiss(reason) {
    this.hideReel();
    this.hideBite();
    if (reason === 'snap') {
      this.toast(t('fish.snap'), 'coral', 'info');
    } else if (reason === 'early') {
      this.toast(t('fish.early'), 'info');
    } else {
      this.toast(t('fish.escaped'), 'coral', 'info');
    }
    this.catchPending = false;
    this.refreshHud();
  }

  onEarly() {
    this.toast(t('fish.early'), 'info');
  }

  // ── Обучение ─────────────────────────────────────────────────────────────

  handleGameEvent(name) {
    const step = this.store.state.flags.tutorial || 0;
    if (step >= 5) return;
    if (name === 'cast-start') {
      if (step < 1) {
        this.store.markTutorial(1);
        this.hideTutorial();
      }
    } else if (name === 'cast-land') {
      if (step < 2) {
        this.store.markTutorial(2);
        this.showTutorial(t('tut.wait'));
      }
    } else if (name === 'bite') {
      if (step < 3) {
        this.store.markTutorial(3);
        this.showTutorial(t('tut.bite'));
      }
    } else if (name === 'reel-start') {
      if (step < 4) {
        this.store.markTutorial(4);
        // Панель вываживания сама объясняет, что делать; не перекрываем её.
        this.hideTutorial();
      }
    } else if (name === 'perfect-cast') {
      this.toast(t('fish.perfectCast'), 'gold', 'arc');
    } else if (name === 'catch') {
      if (step < 5) {
        this.store.markTutorial(5);
        setTimeout(() => {
          if (this.screen === 'game') this.showTutorial(t('tut.done'), 5000);
        }, 400);
      }
    }
  }

  showTutorial(text, timeout = 0) {
    if (!this.el.tutorial) return;
    if (this.el.tutorialText) this.el.tutorialText.textContent = text;
    this.el.tutorial.classList.remove('hidden');
    this.el.castHint?.classList.add('hidden');
    if (this._tutorialTimer) clearTimeout(this._tutorialTimer);
    if (timeout) {
      this._tutorialTimer = setTimeout(() => this.hideTutorial(), timeout);
    }
  }

  hideTutorial() {
    this.el.tutorial?.classList.add('hidden');
    if (this._tutorialTimer) clearTimeout(this._tutorialTimer);
    this._tutorialTimer = null;
  }

  skipTutorial() {
    this.store.markTutorial(5);
    this.hideTutorial();
  }

  // ── Поток игры ───────────────────────────────────────────────────────────

  startFlow() {
    this.audio.unlock();
    this.audio.applySettings(this.store.state.settings);
    if (!this.store.state.flags.intro) {
      this.openIntro();
      return;
    }
    this.beginPlay();
  }

  beginPlay() {
    this.showGame();
    this.game.startFishing();
    this.hooks.onGameStart?.();
    this.refreshHud();
    if ((this.store.state.flags.tutorial || 0) === 0) {
      setTimeout(() => this.showTutorial(t('tut.cast')), 500);
    }
    if (this.pendingGuardian) {
      const summary = this.pendingGuardian;
      this.pendingGuardian = null;
      setTimeout(() => this.openGuardian(summary), 450);
    }
  }

  openIntro() {
    const modal = this.openModal({
      title: t('intro.eyebrow'),
      eyebrow: t('app.title'),
      body: introView(),
      className: 'narrow',
      dismissible: true,
      view: 'intro',
      onClose: () => {}
    });
    modal.action = (action) => {
      if (action === 'intro-start') {
        this.store.setFlag('intro', true);
        this.closeTop();
        setTimeout(() => this.beginPlay(), 180);
      } else if (action === 'intro-later') {
        this.closeTop();
      } else if (action === 'close-modal') {
        this.closeTop();
      }
    };
  }

  // ── Модальные окна ───────────────────────────────────────────────────────

  openModal({
    title = '',
    eyebrow = '',
    subtitle = '',
    body = '',
    footer = '',
    className = '',
    dismissible = true,
    noHead = false,
    view = '',
    onClose = null,
    onMount = null
  }) {
    if (!this.el.modalRoot) return null;
    if (this.modalStack.length === 0) {
      this.lastFocused = document.activeElement;
      this.hooks.onModalOpen?.();
      document.body.classList.add('modal-open');
    }
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.zIndex = String(120 + this.modalStack.length * 2);
    const modal = document.createElement('div');
    modal.className = `modal ${className}`.trim();
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', title || t('common.close'));
    const head = !noHead
      ? `<header class="modal-head">
          ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
          <h2 id="modal-title">${title}</h2>
          ${subtitle ? `<p class="modal-sub">${subtitle}</p>` : ''}
        </header>`
      : '';
    modal.innerHTML = `
      ${dismissible ? `<button class="modal-close" type="button" data-action="close-modal" aria-label="${t('common.close')}">${icon('close')}</button>` : ''}
      ${head}
      <div class="modal-body">${body}</div>
      ${footer ? `<footer class="modal-foot">${footer}</footer>` : ''}
    `;
    backdrop.appendChild(modal);
    this.el.modalRoot.appendChild(backdrop);
    const obj = {
      backdrop,
      modal,
      view,
      action: null,
      onClose,
      onMount,
      cleanup: null,
      dismissible,
      close: () => this.closeModal(obj)
    };
    this.modalStack.push(obj);
    if (typeof onMount === 'function') {
      try {
        obj.cleanup = onMount(modal, obj);
      } catch (err) {
        console.error('[starhook] modal mount', err);
      }
    }
    this._focusModal(modal);
    return obj;
  }

  closeTop() {
    const top = this.modalStack[this.modalStack.length - 1];
    if (top) this.closeModal(top);
  }

  closeModal(obj) {
    if (!obj || !this.modalStack.includes(obj)) return;
    const index = this.modalStack.indexOf(obj);
    this.modalStack.splice(index, 1);
    try {
      obj.cleanup?.();
    } catch {
      // ignore cleanup errors
    }
    try {
      obj.onClose?.();
    } catch (err) {
      console.error('[starhook] modal close', err);
    }
    obj.backdrop.classList.add('closing');
    setTimeout(() => obj.backdrop.remove(), 210);
    if (this.modalStack.length === 0) {
      document.body.classList.remove('modal-open');
      this.hooks.onModalClose?.();
      this.flushPending();
      if (this.lastFocused && this.lastFocused.focus) {
        try { this.lastFocused.focus({ preventScroll: true }); } catch { /* ignore */ }
      }
    } else {
      this._focusModal(this.modalStack[this.modalStack.length - 1].modal);
    }
  }

  closeAll() {
    while (this.modalStack.length) {
      const top = this.modalStack[this.modalStack.length - 1];
      this.closeModal(top);
    }
  }

  replaceModalBody(obj, html, mount = null) {
    if (!obj?.modal) return;
    const body = obj.modal.querySelector('.modal-body');
    if (!body) return;
    try { obj.cleanup?.(); } catch { /* ignore */ }
    obj.cleanup = null;
    body.innerHTML = html;
    hydrateIcons(obj.modal);
    if (mount) {
      try { obj.cleanup = mount(obj.modal, obj); } catch (err) { console.error(err); }
    }
  }

  _focusModal(modal) {
    if (!modal) return;
    const target = modal.querySelector('[data-autofocus], button:not(.modal-close), [href], input, select, textarea');
    if (target) {
      setTimeout(() => {
        try { target.focus({ preventScroll: true }); } catch { /* ignore */ }
      }, 30);
    }
  }

  onModalClick(e) {
    const top = this.modalStack[this.modalStack.length - 1];
    if (!top) return;
    if (e.target === top.backdrop) {
      if (top.dismissible) this.closeModal(top);
      return;
    }
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl || !top.modal.contains(actionEl)) return;
    e.preventDefault();
    const action = actionEl.dataset.action;
    const id = actionEl.dataset.id || '';
    if (top.action) {
      top.action(action, id, actionEl);
      return;
    }
    this.handleAction(action, id, actionEl);
  }

  onModalKeyDown(e) {
    const top = this.modalStack[this.modalStack.length - 1];
    if (!top) return;
    if (e.key === 'Tab') {
      const focusables = top.modal.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  onKeyDown(e) {
    if (e.key === 'Escape') {
      if (this.modalStack.length) {
        e.preventDefault();
        this.closeTop();
      } else if (!this.el.pause.classList.contains('hidden')) {
        e.preventDefault();
        this.hooks.onResume?.();
      } else if (this.screen === 'game' && !this.game?.frozen) {
        e.preventDefault();
        this.hooks.onPause?.();
      }
    }
  }

  // ── Действия ──────────────────────────────────────────────────────────────

  openByKey(key) {
    switch (key) {
      case 'collection': this.openCollection(); break;
      case 'shop': this.openShop(); break;
      case 'quests': this.openQuests(); break;
      case 'map': this.openMap(); break;
      case 'records': this.openRecords(); break;
      case 'settings': this.openSettings(); break;
      case 'help': this.openHelp(); break;
      case 'gift': this.openGift(); break;
      default: break;
    }
  }

  handleAction(action, id, el) {
    switch (action) {
      case 'close-modal':
        this.closeTop();
        break;
      case 'quest-tab': {
        this.questTab = id === 'daily' ? 'daily' : 'story';
        const top = this.modalStack[this.modalStack.length - 1];
        if (top) this.replaceModalBody(top, questsView(this.store.state, this.questTab));
        break;
      }
      case 'shop-tab': {
        this.shopTab = id === 'baits' ? 'baits' : 'upgrades';
        const top = this.modalStack[this.modalStack.length - 1];
        if (top) this.replaceModalBody(top, shopView(this.store.state, this.shopTab));
        break;
      }
      case 'claim-story':
        this.claimStory();
        break;
      case 'claim-daily':
        this.claimDaily(id);
        break;
      case 'claim-daily-bonus':
        this.claimDailyBonus();
        break;
      case 'claim-gift':
        this.claimGift();
        break;
      case 'open-gift':
        this.openGift();
        break;
      case 'buy-upgrade':
        this.buyUpgrade(id);
        break;
      case 'buy-bait':
        this.buyBait(id);
        break;
      case 'equip-bait':
        this.equipBait(id);
        break;
      case 'filter-collection':
        this.collectionFilter = id || 'all';
        this.updateCollectionModal();
        break;
      case 'fish-detail':
        this.openFishDetail(id);
        break;
      case 'travel':
        this.travel(id);
        break;
      case 'login':
        this.login();
        break;
      case 'refresh-records':
        this.refreshLeaderboard();
        break;
      case 'open-achievements':
        this.openAchievements();
        break;
      case 'open-collection':
        this.openCollection();
        break;
      case 'toggle-setting':
        this.toggleSetting(id, el);
        break;
      case 'set-quality':
        this.setQuality(id, el);
        break;
      case 'set-lang':
        this.setLanguage(id);
        break;
      case 'reset':
        this.openResetConfirm();
        break;
      case 'reset-yes':
        this.resetProgress();
        break;
      case 'reset-no':
        this.closeTop();
        break;
      case 'intro-start':
      case 'intro-later':
        break;
      case 'catch-keep':
      case 'close-guardian':
      case 'close-ending':
      case 'close-levelup':
        this.closeTop();
        break;
      case 'catch-double':
        this.doubleCatch();
        break;
      default:
        break;
    }
  }

  toast(text, type = 'info', iconName = null) {
    if (!this.el.toastRoot || !text) return;
    const iconKey = iconName || TOAST_ICONS[type] || 'spark';
    const node = document.createElement('div');
    node.className = `toast ${type}`;
    node.innerHTML = `${icon(iconKey)}<span>${String(text)}</span>`;
    this.el.toastRoot.appendChild(node);
    while (this.el.toastRoot.children.length > 3) this.el.toastRoot.firstChild.remove();
    const timer = setTimeout(() => {
      node.classList.add('out');
      setTimeout(() => node.remove(), 300);
      this.toastTimers.delete(timer);
    }, 3200);
    this.toastTimers.add(timer);
  }

  // ── Коллекция ────────────────────────────────────────────────────────────

  openCollection() {
    const body = collectionView(this.store.state, this.collectionFilter);
    const modal = this.openModal({
      title: t('col.title'),
      eyebrow: `${collectionCount(this.store.state)} / ${FISH.length}`,
      body,
      className: 'wide',
      view: 'collection',
      onMount: (root) => this.mountThumbs(root)
    });
    modal.action = (action, id) => {
      if (action === 'close-modal') this.closeTop();
      else if (action === 'filter-collection') {
        this.collectionFilter = id;
        this.replaceModalBody(modal, collectionView(this.store.state, this.collectionFilter), (root) => this.mountThumbs(root));
      } else if (action === 'fish-detail') this.openFishDetail(id);
    };
  }

  updateCollectionModal() {
    const top = this.modalStack.find((m) => m.view === 'collection');
    if (!top) return;
    this.replaceModalBody(top, collectionView(this.store.state, this.collectionFilter), (root) => this.mountThumbs(root));
  }

  mountThumbs(root) {
    root.querySelectorAll('[data-thumb-fish]').forEach((canvas) => {
      const fish = FISH_BY_ID[canvas.dataset.thumbFish];
      if (!fish) return;
      const known = Boolean(this.store.state.species[fish.id]);
      renderFishThumb(canvas, fish, { unknown: !known });
    });
  }

  openFishDetail(fishId) {
    const fish = FISH_BY_ID[fishId];
    if (!fish) return;
    const known = Boolean(this.store.state.species[fish.id]);
    const modal = this.openModal({
      title: known ? fishName(fish) : t('col.unknown'),
      eyebrow: known ? tData(RARITIES[fish.rarity].label) : t('col.unknown'),
      body: fishDetailView(this.store.state, fish),
      className: 'wide',
      view: 'fish-detail',
      onMount: (root) => {
        const canvas = root.querySelector('[data-portrait-fish]');
        if (!canvas) return;
        if (!known) {
          renderFishThumb(canvas, fish, { unknown: true });
          return;
        }
        return startFishPortrait(canvas, fish, { reducedMotion: this.store.state.settings.reducedMotion });
      }
    });
    modal.action = (action) => {
      if (action === 'close-modal') this.closeTop();
    };
  }

  // ── Магазин ───────────────────────────────────────────────────────────────

  openShop(tab = this.shopTab) {
    this.shopTab = tab;
    const modal = this.openModal({
      title: t('shop.title'),
      eyebrow: `${t('hud.sparks')}: ${formatNumber(this.store.state.sparks)}`,
      body: shopView(this.store.state, this.shopTab),
      className: 'wide',
      view: 'shop',
      onMount: () => {}
    });
    modal.action = (action, id) => {
      if (action === 'close-modal') this.closeTop();
      else if (action === 'shop-tab') {
        this.shopTab = id;
        this.replaceModalBody(modal, shopView(this.store.state, this.shopTab));
        const eyebrow = modal.modal.querySelector('.modal-head .eyebrow');
        if (eyebrow) eyebrow.textContent = `${t('hud.sparks')}: ${formatNumber(this.store.state.sparks)}`;
      } else if (action === 'buy-upgrade') this.buyUpgrade(id);
      else if (action === 'buy-bait') this.buyBait(id);
      else if (action === 'equip-bait') this.equipBait(id);
    };
  }

  buyUpgrade(id) {
    const result = this.store.buyUpgrade(id);
    if (result.ok) {
      this.audio.play('reward');
      this.toast(t('shop.upgradeBought', {
        name: tData(Object.values(this.store.state.upgrades).length ? this._upgradeName(id) : ''),
        n: result.level
      }), 'gold');
      this.refreshHud();
      const modal = this.modalStack.find((m) => m.view === 'shop');
      if (modal) {
        this.replaceModalBody(modal, shopView(this.store.state, this.shopTab));
        const eyebrow = modal.modal.querySelector('.modal-head .eyebrow');
        if (eyebrow) eyebrow.textContent = `${t('hud.sparks')}: ${formatNumber(this.store.state.sparks)}`;
      }
    } else if (result.error === 'sparks') this.toast(t('shop.noSparks'), 'coral');
    else if (result.error === 'max') this.toast(t('shop.maxLevel'), 'info');
    else this.toast(t('toast.nothing'), 'info');
  }

  _upgradeName(id) {
    return tData(UPGRADE_BY_ID[id]?.name, id);
  }

  buyBait(id) {
    const result = this.store.buyBait(id);
    if (result.ok) {
      this.audio.play('reward');
      this.toast(t('toast.bought'), 'mint');
      this.refreshHud();
      const modal = this.modalStack.find((m) => m.view === 'shop');
      if (modal) this.replaceModalBody(modal, shopView(this.store.state, this.shopTab));
    } else if (result.error === 'level') this.toast(t('shop.unlockLevel', { n: result.level }), 'coral');
    else if (result.error === 'sparks') this.toast(t('shop.noSparks'), 'coral');
  }

  equipBait(id) {
    if (this.store.equipBait(id)) {
      this.audio.play('ui');
      this.toast(t('toast.equipped'), 'mint');
      this.refreshHud();
      const modal = this.modalStack.find((m) => m.view === 'shop');
      if (modal) this.replaceModalBody(modal, shopView(this.store.state, this.shopTab));
    }
  }

  // ── Задания ───────────────────────────────────────────────────────────────

  openQuests(tab = this.questTab) {
    this.questTab = tab;
    // Проверяем смену суток, даже если вкладка была открыта давно.
    void this.store.daily;
    const modal = this.openModal({
      title: t('quest.title'),
      eyebrow: t('quest.story'),
      body: questsView(this.store.state, this.questTab),
      className: 'wide',
      view: 'quests'
    });
    modal.action = (action, id) => {
      if (action === 'close-modal') this.closeTop();
      else if (action === 'quest-tab') {
        this.questTab = id;
        this.replaceModalBody(modal, questsView(this.store.state, this.questTab));
      } else if (action === 'claim-story') this.claimStory();
      else if (action === 'claim-daily') this.claimDaily(id);
      else if (action === 'claim-daily-bonus') this.claimDailyBonus();
      else if (action === 'open-gift') this.openGift();
      else if (action === 'open-collection') this.openCollection();
    };
  }

  claimStory() {
    const result = this.store.claimStory();
    if (!result) return;
    this.audio.play('reward');
    this.toast(t('toast.claimed'), 'gold');
    if (result.unlock) {
      const loc = LOCATION_BY_ID[result.unlock];
      this.toast(t('toast.locationUnlocked', { name: tData(loc?.name, result.unlock) }), 'mint', 'map');
    }
    this.refreshHud();
    const modal = this.modalStack.find((m) => m.view === 'quests');
    if (result.final) {
      this.endingPending = true;
      this.closeAll();
      setTimeout(() => this.openEnding(), 260);
      return;
    }
    if (modal) this.replaceModalBody(modal, questsView(this.store.state, this.questTab));
  }

  claimDaily(id) {
    const result = this.store.claimDaily(id);
    if (!result) return;
    this.audio.play('reward');
    this.toast(t('toast.claimed'), 'mint');
    this.refreshHud();
    const modal = this.modalStack.find((m) => m.view === 'quests');
    if (modal) this.replaceModalBody(modal, questsView(this.store.state, 'daily'));
  }

  claimDailyBonus() {
    const result = this.store.claimDailyBonus();
    if (!result) return;
    this.audio.play('reward');
    this.toast(t('quest.dailyBonus'), 'gold');
    this.refreshHud();
    const modal = this.modalStack.find((m) => m.view === 'quests');
    if (modal) this.replaceModalBody(modal, questsView(this.store.state, 'daily'));
  }

  // ── Подарок ───────────────────────────────────────────────────────────────

  openGift() {
    const modal = this.openModal({
      title: t('gift.title'),
      eyebrow: t('menu.daily'),
      body: giftViewFor(this.store.state),
      className: 'narrow',
      view: 'gift'
    });
    modal.action = (action) => {
      if (action === 'close-modal') this.closeTop();
      else if (action === 'claim-gift') this.claimGift();
    };
  }

  claimGift() {
    const result = this.store.claimGift();
    if (!result) return;
    this.audio.play('reward');
    this.toast(t('toast.giftTaken'), 'gold', 'gift');
    this.refreshHud();
    this.updateMenu();
    const modal = this.modalStack.find((m) => m.view === 'gift');
    if (modal) this.replaceModalBody(modal, giftViewFor(this.store.state));
  }

  // ── Карта ─────────────────────────────────────────────────────────────────

  openMap() {
    const modal = this.openModal({
      title: t('map.title'),
      eyebrow: t('loc.title'),
      body: mapView(this.store.state),
      className: 'wide',
      view: 'map'
    });
    modal.action = (action, id) => {
      if (action === 'close-modal') this.closeTop();
      else if (action === 'travel') this.travel(id);
    };
  }

  travel(locId) {
    if (locId === this.store.state.currentLocation) {
      this.closeTop();
      return;
    }
    if (this.game?.travel(locId)) {
      this.audio.play('ui');
      this.closeAll();
      this.showGame();
      this.toast(t('toast.traveled', { name: tData(LOCATION_BY_ID[locId].name) }), 'mint', 'map');
      this.refreshHud();
    }
  }

  // ── Рейтинг и вход ────────────────────────────────────────────────────────

  openRecords() {
    const modal = this.openModal({
      title: t('records.title'),
      eyebrow: t('records.leaderboard'),
      body: recordsView(this.store.state, this._recordsMeta()),
      className: 'wide',
      view: 'records',
      onMount: () => {}
    });
    modal.action = (action, id) => {
      if (action === 'close-modal') this.closeTop();
      else if (action === 'login') this.login();
      else if (action === 'refresh-records') this.refreshLeaderboard();
      else if (action === 'open-achievements') this.openAchievements();
    };
    if (this.store.isAuthorized) this.refreshLeaderboard();
  }

  _recordsMeta() {
    return {
      leaderboard: this.leaderboard,
      status: this.leaderboardStatus,
      playerName: this.store.playerName,
      authorized: this.store.isAuthorized
    };
  }

  async refreshLeaderboard(force = true) {
    const modal = this.modalStack.find((m) => m.view === 'records');
    if (!this.store.isAuthorized) {
      this.leaderboard = null;
      this.leaderboardStatus = 'idle';
      if (modal) this.replaceModalBody(modal, recordsView(this.store.state, this._recordsMeta()));
      return;
    }
    this.leaderboardStatus = 'loading';
    if (modal) this.replaceModalBody(modal, recordsView(this.store.state, this._recordsMeta()));
    if (force) await this.store.submitScore();
    const result = await this.store.loadLeaderboard();
    this.leaderboard = result;
    this.leaderboardStatus = result ? 'ready' : 'error';
    if (this.modalStack.includes(modal)) {
      this.replaceModalBody(modal, recordsView(this.store.state, this._recordsMeta()));
    }
  }

  async login() {
    const buttons = this.el.modalRoot.querySelectorAll('[data-action="login"]');
    buttons.forEach((b) => { b.disabled = true; });
    const ok = await this.store.login();
    buttons.forEach((b) => { b.disabled = false; });
    this.refreshHud();
    this.updateMenu();
    if (ok) {
      const records = this.modalStack.find((m) => m.view === 'records');
      if (records) {
        this.replaceModalBody(records, recordsView(this.store.state, this._recordsMeta()));
        this.refreshLeaderboard();
      }
      const settings = this.modalStack.find((m) => m.view === 'settings');
      if (settings) this.replaceModalBody(settings, settingsView(this.store.state, this._settingsMeta()));
    }
  }

  // ── Настройки ─────────────────────────────────────────────────────────────

  _settingsMeta() {
    return {
      cloudStatus: this.store.cloudStatus,
      playerName: this.store.playerName,
      authorized: this.store.isAuthorized
    };
  }

  openSettings() {
    const modal = this.openModal({
      title: t('settings.title'),
      eyebrow: t('hud.settings'),
      body: settingsView(this.store.state, this._settingsMeta()),
      className: 'narrow',
      view: 'settings'
    });
    modal.action = (action, id, el) => {
      if (action === 'close-modal') this.closeTop();
      else if (action === 'toggle-setting') this.toggleSetting(id, el);
      else if (action === 'set-quality') this.setQuality(id, el);
      else if (action === 'set-lang') this.setLanguage(id);
      else if (action === 'login') this.login();
      else if (action === 'reset') this.openResetConfirm();
    };
  }

  toggleSetting(id, el) {
    if (!['sound', 'music', 'reducedMotion', 'softMode'].includes(id)) return;
    const next = !this.store.state.settings[id];
    this.store.updateSettings({ [id]: next });
    el?.classList.toggle('on', next);
    el?.setAttribute('aria-checked', String(next));
    this.audio.applySettings(this.store.state.settings);
    if (id === 'reducedMotion') this.scene.setReducedMotion(next);
    this.updateSoundIcons();
  }

  setQuality(id, el) {
    if (!['auto', 'high', 'low'].includes(id)) return;
    this.store.updateSettings({ quality: id });
    this.scene.setQuality(id);
    const group = el?.closest('.segmented');
    group?.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.id === id));
  }

  setLanguage(id) {
    if (!['ru', 'en', 'tr'].includes(id) || id === getLang()) return;
    this.store.setLanguage(id);
    this.refreshTexts();
    const wasSettings = this.modalStack.some((m) => m.view === 'settings');
    this.closeAll();
    if (wasSettings) setTimeout(() => this.openSettings(), 180);
  }

  openResetConfirm() {
    const modal = this.openModal({
      title: t('settings.reset'),
      eyebrow: t('settings.reset'),
      body: confirmView(t('settings.resetConfirm')),
      className: 'narrow',
      view: 'confirm',
      footer: `
        <button class="btn btn-secondary" type="button" data-action="reset-no">${t('settings.resetNo')}</button>
        <button class="btn btn-primary" type="button" data-action="reset-yes">${t('settings.resetYes')}</button>
      `
    });
    modal.action = (action) => {
      if (action === 'reset-no' || action === 'close-modal') this.closeTop();
      else if (action === 'reset-yes') this.resetProgress();
    };
  }

  async resetProgress() {
    await this.store.reset();
    this.pendingGuardian = null;
    this.pendingLevelUps = [];
    this.closeAll();
    this.showMenu();
    this.refreshTexts();
    this.toast(t('toast.reset'), 'mint');
    this.hooks.onReset?.();
  }

  // ── Помощь и достижения ───────────────────────────────────────────────────

  openHelp() {
    const modal = this.openModal({
      title: t('help.title'),
      eyebrow: t('menu.howto'),
      body: helpView(),
      className: 'narrow',
      view: 'help',
      footer: `<button class="btn btn-primary" type="button" data-action="close-modal">${t('help.close')}</button>`
    });
    modal.action = (action) => {
      if (action === 'close-modal' || action === 'close') this.closeTop();
    };
  }

  openAchievements() {
    const modal = this.openModal({
      title: t('records.achievements'),
      eyebrow: t('records.viewAchievements'),
      body: achievementsView(this.store.state),
      className: 'wide',
      view: 'achievements'
    });
    modal.action = (action) => {
      if (action === 'close-modal') this.closeTop();
    };
  }

  // ── Ранг, улов, хранитель, финал ─────────────────────────────────────────

  onLevelUp(data) {
    if (this.catchPending || this.modalStack.length || this.endingPending) {
      this.pendingLevelUps.push(data);
      return;
    }
    this.openLevelUp(data);
  }

  openLevelUp(data) {
    this.audio.play('level');
    const modal = this.openModal({
      title: t('levelup.title'),
      eyebrow: t('common.rank'),
      body: levelUpView(this.store.state, data),
      className: 'narrow',
      view: 'levelup',
      footer: `<button class="btn btn-primary" type="button" data-action="close-levelup">${t('levelup.continue')}</button>`
    });
    modal.action = (action) => {
      if (action === 'close-levelup' || action === 'close-modal') this.closeTop();
    };
  }

  showCatch(summary) {
    if (!summary) return;
    this.catchPending = true;
    this.catchSummary = summary;
    const modal = this.openModal({
      title: t('catch.title'),
      body: catchView(summary, { adsAvailable: this.store.canUseAds }),
      className: 'catch-modal',
      noHead: true,
      view: 'catch',
      dismissible: true,
      onMount: (root) => {
        const canvas = root.querySelector('#catch-portrait');
        if (canvas) {
          this.stopCatchPortrait = startFishPortrait(canvas, summary.fish, {
            reducedMotion: this.store.state.settings.reducedMotion
          });
        }
        setTimeout(() => this.audio.play(summary.guardianCaught ? 'guardian' : 'catch'), 80);
      },
      onClose: () => {
        this.stopCatchPortrait?.();
        this.stopCatchPortrait = null;
        this.catchPending = false;
        this.catchSummary = null;
        this.game?.afterCatch();
        this.refreshHud();
        if (summary.guardianCaught) {
          this.suppressFlush = true;
          setTimeout(() => {
            this.suppressFlush = false;
            if (this.screen === 'game') {
              this.openGuardian(summary);
            } else {
              this.pendingGuardian = summary;
              this.flushPending();
            }
          }, 260);
        } else if (summary.guardianMeter >= 5) {
          this.toast(t('toast.guardianReady'), 'gold', 'constellation');
        }
      }
    });
    modal.action = (action) => {
      if (action === 'catch-keep' || action === 'close-modal') this.closeTop();
      else if (action === 'catch-double') this.doubleCatch();
    };
  }

  async doubleCatch() {
    const summary = this.catchSummary;
    if (!summary || this.adBusy) return;
    if (!this.store.canUseAds) {
      this.toast(t('catch.adUnavailable'), 'info');
      return;
    }
    this.adBusy = true;
    const top = this.modalStack.find((m) => m.view === 'catch');
    const button = top?.modal.querySelector('[data-action="catch-double"]');
    if (button) button.disabled = true;
    const result = await this.store.showRewarded();
    this.adBusy = false;
    if (button) button.disabled = false;
    if (result.rewarded) {
      this.store.grantBonusSparks(summary.value);
      this.audio.play('reward');
      this.toast(t('toast.double'), 'gold');
      this.refreshHud();
      const valueEl = top?.modal.querySelector('#catch-value');
      if (valueEl) valueEl.textContent = formatNumber(summary.value * 2);
      if (button) {
        button.classList.remove('btn-ad');
        button.disabled = true;
        button.innerHTML = `${icon('check')} ${t('toast.double')}`;
      }
    } else {
      this.toast(t('toast.adNoFill'), 'info');
    }
  }

  openGuardian(summary) {
    this.pendingGuardian = null;
    const constellation = CONSTELLATIONS[summary.constellation];
    const modal = this.openModal({
      title: t('guardian.restored'),
      eyebrow: t('guardian.found'),
      body: guardianView(summary),
      className: 'narrow',
      view: 'guardian',
      onMount: (root) => {
        const canvas = root.querySelector('#guardian-canvas');
        if (!canvas || !constellation) return;
        return this.mountConstellation(canvas, constellation, summary.constellation);
      }
    });
    modal.action = (action) => {
      if (action === 'close-guardian' || action === 'close-modal') this.closeTop();
    };
    modal.onClose = () => {
      if (questView(this.store.state)?.complete) {
        this.toast(t('quest.ready'), 'gold', 'quest');
      }
    };
  }

  openEnding() {
    this.endingPending = true;
    const modal = this.openModal({
      title: t('ending.title'),
      eyebrow: t('guardian.all'),
      body: endingView(this.store.state),
      className: 'narrow',
      view: 'ending',
      onMount: (root) => {
        const canvas = root.querySelector('#ending-canvas');
        if (!canvas) return;
        return this.mountEnding(canvas);
      }
    });
    modal.action = (action) => {
      if (action === 'close-ending' || action === 'close-modal') this.closeTop();
    };
    modal.onClose = () => {
      this.endingPending = false;
      if (this.screen === 'menu') this.showMenu();
      else this.showGame();
      this.refreshHud();
    };
    this.audio.play('guardian');
  }

  mountConstellation(canvas, constellation, key) {
    let raf = 0;
    let start = performance.now();
    const draw = (now) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth || 480;
      const h = canvas.clientHeight || 190;
      if (canvas.width !== Math.floor(w * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const t0 = (now - start) / 1000;
      const color = LOCATIONS.find((l) => l.constellation === key)?.palette.glow || '#ffd479';
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 2, w * 0.5, h * 0.5, w * 0.65);
      bg.addColorStop(0, `${color}22`);
      bg.addColorStop(1, 'transparent');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 34; i++) {
        const a = i * 2.399 + t0 * 0.04;
        const rad = (i / 34) * Math.min(w, h) * 0.46;
        const x = w / 2 + Math.cos(a) * rad * 1.6;
        const y = h / 2 + Math.sin(a) * rad * 0.9;
        ctx.globalAlpha = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t0 * 1.6 + i));
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, i % 4 === 0 ? 1.5 : 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      const boxW = w * 0.56;
      const boxH = h * 0.62;
      const x0 = (w - boxW) / 2;
      const y0 = (h - boxH) / 2;
      const pts = constellation.stars.map(([sx, sy]) => ({ x: x0 + sx * boxW, y: y0 + sy * boxH }));
      const drawProgress = Math.min(1, t0 / 1.1);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.1;
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
      constellation.lines.forEach(([a, b], i) => {
        const local = Math.max(0, Math.min(1, (drawProgress - i * 0.06) / 0.7));
        if (local <= 0) return;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(pts[a].x, pts[a].y);
        ctx.lineTo(pts[a].x + (pts[b].x - pts[a].x) * local, pts[a].y + (pts[b].y - pts[a].y) * local);
        ctx.stroke();
      });
      pts.forEach((p, i) => {
        const tw = 0.6 + 0.4 * Math.sin(t0 * 2 + i);
        ctx.globalAlpha = 0.7 + 0.3 * tw;
        ctx.fillStyle = '#fff8e7';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8 + tw * 1.1, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }

  mountEnding(canvas) {
    let raf = 0;
    let start = performance.now();
    const draw = (now) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth || 480;
      const h = canvas.clientHeight || 130;
      if (canvas.width !== Math.floor(w * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const t0 = (now - start) / 1000;
      const keys = Object.keys(CONSTELLATIONS);
      const colors = ['#ffe08a', '#a9c8ff', '#c7e2ff', '#a7ffe0', '#d4b8ff', '#ffcf8a'];
      keys.forEach((key, idx) => {
        const c = CONSTELLATIONS[key];
        const slotW = w / 6;
        const x0 = idx * slotW + slotW * 0.15;
        const y0 = h * 0.22;
        const boxW = slotW * 0.7;
        const boxH = h * 0.52;
        const pts = c.stars.map(([sx, sy]) => ({ x: x0 + sx * boxW, y: y0 + sy * boxH }));
        ctx.strokeStyle = colors[idx];
        ctx.lineWidth = 1;
        ctx.shadowColor = colors[idx];
        ctx.shadowBlur = 5;
        ctx.globalAlpha = 0.8 + 0.15 * Math.sin(t0 + idx);
        c.lines.forEach(([a, b]) => {
          ctx.beginPath();
          ctx.moveTo(pts[a].x, pts[a].y);
          ctx.lineTo(pts[b].x, pts[b].y);
          ctx.stroke();
        });
        ctx.shadowBlur = 0;
        pts.forEach((p, i) => {
          ctx.fillStyle = colors[idx];
          ctx.globalAlpha = 0.75 + 0.25 * Math.sin(t0 * 1.5 + i + idx);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        });
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }

  // ── Прочее ────────────────────────────────────────────────────────────────

  flushPending() {
    if (this.modalStack.length || this.suppressFlush || this.endingPending) return;
    if (this.pendingLevelUps.length) {
      const next = this.pendingLevelUps.shift();
      setTimeout(() => {
        if (!this.modalStack.length && !this.endingPending) this.openLevelUp(next);
      }, 220);
      return;
    }
    if (this.pendingToasts.length) {
      const list = this.pendingToasts.splice(0);
      list.forEach((item) => this.toast(item.text, item.type, item.iconName));
    }
  }
}


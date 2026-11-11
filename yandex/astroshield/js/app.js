/* ASTROSHIELD application: screens, HUD, input, SDK, persistence. */
(function () {
  "use strict";

  const AG = window.AG;
  const T = function (key, vars) { return AG.I18N.t(key, vars); };
  const FONT_UI = "'Exo 2', 'Segoe UI', system-ui, sans-serif";
  const FONT_DISPLAY = "'Russo One', 'Arial Black', sans-serif";
  const TAU = Math.PI * 2;

  class App {
    constructor() {
      this.canvas = document.getElementById("game");
      this.ctx = this.canvas.getContext("2d", { alpha: false });
      this.save = AG.Save.load();
      this.game = null;
      this.screen = "boot";
      this.modal = null;
      this.toasts = [];
      this.buttons = [];
      this.hoverId = null;
      this.pressedId = null;
      this.pointer = { x: 0, y: 0, down: false, type: "mouse" };
      this.dragging = false;
      this.time = 0;
      this.screenTime = 0;
      this.lastFrame = 0;
      this.dpr = 1;
      this.w = 1;
      this.h = 1;
      this.safe = { top: 0, right: 0, bottom: 0, left: 0 };
      this.view = null;
      this.backdrop = null;
      this.stars = [];
      this.decor = [];
      this.ambientDust = [];
      this.dustShown = this.save.dust;
      this.ready = false;
      this.sdkApplied = false;
      this.sdkActive = false;
      this.sdkAuthorized = false;
      this.platformPaused = false;
      this.autoPausedByPlatform = false;
      this.needsAudioResume = false;
      this.adBusy = false;
      this.adKind = null;
      this.adRewarded = false;
      this.death = null;
      this.pendingGain = 0;
      this.adDoubled = false;
      this.reviveUsed = false;
      this.newRecord = false;
      this.runBankedDust = 0;
      this.bankedStats = { blocked: 0, perfect: 0, crystals: 0, repair: 0, bossKills: 0 };
      this.lastSubmit = 0;
      this.lb = { status: "idle", entries: [], data: null, error: "", lastFetch: 0, userRank: 0 };
      this.lbLoggingIn = false;
      this.upgradeFlash = null;
      this.cloudTimer = null;
      this.fade = 0;
      this.celebrate = 0;
      this.toastSeq = 0;
      this.safeProbe = null;
      this.backdropTimer = null;
      this.debug = /(?:^|[?&])debug=1(?:&|$)/.test(location.search);

      this.initLanguage();
      this.setupSafeProbe();
      this.resize(true);
      this.game = new AG.Game(this);
      this.setupInput();
      this.buildAmbient();
      this.updateBoot(8);
      this.loop = this.loop.bind(this);
      window.requestAnimationFrame(this.loop);
      this.init();
    }

    /* ----------------------------- boot ------------------------------ */

    initLanguage() {
      let initial = this.save.lang;
      if (!initial) {
        initial = AG.I18N.normalize(navigator.language || "ru");
      }
      AG.I18N.setLang(initial);
      this.updateDocumentTitle();
    }

    updateDocumentTitle() {
      document.title = T("brand") + " — " + T("subtitle").toLowerCase();
    }

    updateBoot(percent) {
      const bar = document.getElementById("bootBar");
      if (bar) bar.style.width = Math.max(0, Math.min(100, percent)) + "%";
    }

    async init() {
      const started = Date.now();
      let sdkPromise = null;
      try {
        sdkPromise = AG.SDK.init({
          onPlatformPause: () => this.handlePlatformPause(),
          onPlatformResume: () => this.handlePlatformResume(),
          onAccountChange: () => this.loadCloud(true)
        });
      } catch (e) {
        sdkPromise = null;
      }

      await Promise.race([
        Promise.all([
          document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve(),
          document.fonts && document.fonts.load ? document.fonts.load('16px "Exo 2"') : Promise.resolve(),
          document.fonts && document.fonts.load ? document.fonts.load('16px "Russo One"') : Promise.resolve()
        ]).catch(function () {}),
        new Promise(function (resolve) { window.setTimeout(resolve, 2600); })
      ]);
      this.updateBoot(38);

      if (sdkPromise) {
        const ok = await Promise.race([
          sdkPromise.catch(function () { return false; }),
          new Promise(function (resolve) { window.setTimeout(function () { resolve(false); }, 3600); })
        ]);
        if (ok && !this.sdkApplied) {
          await this.applySdk();
        } else if (ok) {
          await this.applySdk();
        }
        sdkPromise.then(async (late) => {
          if (late && !this.sdkApplied) await this.applySdk();
        }).catch(function () {});
      }
      this.updateBoot(74);

      if (Date.now() - started < 850) {
        await new Promise((resolve) => window.setTimeout(resolve, 850 - (Date.now() - started)));
      }
      this.updateBoot(100);
      this.ready = true;
      await new Promise((resolve) => window.setTimeout(resolve, 220));
      const boot = document.getElementById("boot");
      if (boot) boot.classList.add("is-hidden");
      this.screen = "menu";
      this.screenTime = 0;
      this.updateDocumentTitle();
      if (AG.SDK.isActive()) AG.SDK.markReady();
      this.dustShown = this.save.dust;
      this.save.updatedAt = this.save.updatedAt || Date.now();
      this.emitDebugHook();
    }

    async applySdk() {
      if (this.sdkApplied) return;
      this.sdkApplied = true;
      this.sdkActive = AG.SDK.isActive();
      this.sdkAuthorized = AG.SDK.isAuthorized();
      if (!this.save.lang) {
        const lang = AG.SDK.getLang();
        if (lang) {
          AG.I18N.setLang(lang);
          this.updateDocumentTitle();
          const bootTitle = document.getElementById("bootTitle");
          if (bootTitle) bootTitle.textContent = T("brand");
        }
      }
      try {
        if (AG.SDK.player && AG.SDK.player.getUniqueID) this.playerId = AG.SDK.player.getUniqueID();
      } catch (e) { /* noop */ }
      await this.loadCloud(false);
      this.updateBoot(92);
      if (this.screen === "menu" || this.ready) {
        if (this.screen === "leaderboard") this.loadLeaderboard(true);
        AG.SDK.markReady();
      }
    }

    async loadCloud(showToast) {
      if (!AG.SDK.isActive()) return false;
      let cloud = null;
      try {
        cloud = await AG.SDK.getCloudData();
      } catch (e) {
        cloud = null;
      }
      this.sdkActive = AG.SDK.isActive();
      this.sdkAuthorized = AG.SDK.isAuthorized();
      try {
        if (AG.SDK.player && AG.SDK.player.getUniqueID) this.playerId = AG.SDK.player.getUniqueID();
      } catch (e) { /* noop */ }
      if (this.screen === "leaderboard") this.loadLeaderboard(true);
      if (!cloud) return false;
      this.save = AG.Save.merge(this.save, cloud);
      this.save.updatedAt = Date.now();
      AG.Save.store(this.save);
      this.dustShown = this.save.dust;
      if (showToast) this.toast(T("saved"), "", "#7ff5da", "check");
      return true;
    }

    emitDebugHook() {
      if (!this.debug) return;
      window.__astro = { app: this, game: this.game, sdk: AG.SDK, save: this.save };
    }

    /* ---------------------------- viewport --------------------------- */

    setupSafeProbe() {
      const el = document.createElement("div");
      el.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;" +
        "padding-top:env(safe-area-inset-top);padding-right:env(safe-area-inset-right);" +
        "padding-bottom:env(safe-area-inset-bottom);padding-left:env(safe-area-inset-left);";
      document.body.appendChild(el);
      this.safeProbe = el;
    }

    measureSafe() {
      if (!this.safeProbe) return;
      const cs = getComputedStyle(this.safeProbe);
      this.safe = {
        top: parseFloat(cs.paddingTop) || 0,
        right: parseFloat(cs.paddingRight) || 0,
        bottom: parseFloat(cs.paddingBottom) || 0,
        left: parseFloat(cs.paddingLeft) || 0
      };
    }

    computeView() {
      const w = this.w, h = this.h;
      const safe = this.safe;
      const topUI = safe.top + 76;
      const bottomUI = safe.bottom + 54;
      const availW = Math.max(120, w - safe.left - safe.right - 24);
      const availH = Math.max(120, h - topUI - bottomUI - 8);
      const V = Math.max(72, Math.min(availW * 0.49, availH * 0.49));
      const S = V * 0.6;
      const P = Math.max(18, V * 0.225);
      return {
        w: w,
        h: h,
        cx: w / 2,
        cy: topUI + availH * 0.54,
        V: V,
        S: S,
        P: P,
        safe: {
          top: safe.top, right: safe.right, bottom: safe.bottom, left: safe.left
        }
      };
    }

    resize(immediate) {
      const w = Math.max(1, window.innerWidth);
      const h = Math.max(1, window.innerHeight);
      this.measureSafe();
      this.w = w;
      this.h = h;
      this.dpr = Math.min(2, window.devicePixelRatio || 1);
      this.canvas.width = Math.round(w * this.dpr);
      this.canvas.height = Math.round(h * this.dpr);
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
      const old = this.view;
      this.view = this.computeView();
      if (this.game && old) this.game.resizeView(old, this.view);
      this.buildAmbient();
      if (immediate) {
        this.rebuildBackdrop();
      } else if (this.backdropTimer) {
        window.clearTimeout(this.backdropTimer);
        this.backdropTimer = window.setTimeout(() => {
          this.backdropTimer = null;
          this.rebuildBackdrop();
        }, 140);
      }
    }

    rebuildBackdrop() {
      this.backdrop = AG.Art.makeBackdrop(this.w, this.h, 77113);
      this.stars = AG.Art.stars(913, this.w, this.h, 46);
    }

    buildAmbient() {
      const rnd = AG.mulberry32(4242);
      this.decor = [];
      for (let i = 0; i < 7; i++) {
        this.decor.push({
          a: rnd() * TAU,
          rf: 1.16 + rnd() * 0.95,
          speed: 0.02 + rnd() * 0.045,
          size: 0.035 + rnd() * 0.03,
          rot: rnd() * TAU,
          spin: (rnd() - 0.5) * 0.6,
          crystal: i === 2 || i === 5,
          variant: Math.floor(rnd() * 6)
        });
      }
      this.ambientDust = [];
      for (let i = 0; i < 34; i++) {
        this.ambientDust.push({
          x: rnd(), y: rnd(),
          s: 0.4 + rnd() * 1.4,
          a: 0.1 + rnd() * 0.4,
          vx: (rnd() - 0.5) * 0.004,
          vy: -0.002 - rnd() * 0.006
        });
      }
    }

    /* ------------------------------ input ---------------------------- */

    setupInput() {
      const c = this.canvas;
      const local = (e) => {
        const r = c.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      };
      c.addEventListener("pointerdown", (e) => {
        if (!this.ready) return;
        e.preventDefault();
        try { c.focus({ preventScroll: true }); } catch (err) { /* noop */ }
        try { c.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
        this.ensureAudio();
        const p = local(e);
        this.pointer.x = p.x;
        this.pointer.y = p.y;
        this.pointer.down = true;
        this.pointer.type = e.pointerType || "mouse";
        if (this.adBusy) return;
        const layer = this.modal ? "modal" : "base";
        const btn = this.hitButton(p.x, p.y, layer);
        if (btn && !btn.disabled) {
          this.pressedId = btn.id;
          this.dragging = false;
        } else {
          this.pressedId = null;
          if (!this.modal && this.screen === "game" && (this.game.state === "playing" || this.game.state === "countdown")) {
            this.dragging = true;
            if (this.game.state === "playing") this.game.aimAt(p.x, p.y);
          }
        }
      }, { passive: false });

      c.addEventListener("pointermove", (e) => {
        if (!this.ready) return;
        const p = local(e);
        this.pointer.x = p.x;
        this.pointer.y = p.y;
        this.pointer.type = e.pointerType || "mouse";
        const layer = this.modal ? "modal" : "base";
        const btn = this.hitButton(p.x, p.y, layer);
        this.hoverId = btn && !btn.disabled ? btn.id : null;
        if (!this.adBusy && !this.modal && this.screen === "game" &&
          (this.game.state === "playing" || this.game.state === "countdown")) {
          if (e.pointerType === "mouse" || this.dragging) {
            if (!(btn && btn.id === "hud_pause")) {
              if (this.game.state === "playing") this.game.aimAt(p.x, p.y);
            }
          }
        }
      });

      const finishPointer = (e) => {
        if (!this.ready) return;
        const p = local(e);
        this.pointer.down = false;
        this.dragging = false;
        if (this.adBusy) { this.pressedId = null; return; }
        if (this.pressedId) {
          const layer = this.modal ? "modal" : "base";
          const b = this.hitButton(p.x, p.y, layer);
          if (b && b.id === this.pressedId && !b.disabled) {
            AG.Audio.play("ui");
            this.safeCall(b.onClick);
          }
        }
        this.pressedId = null;
        this.hoverId = null;
      };
      c.addEventListener("pointerup", finishPointer);
      c.addEventListener("pointercancel", finishPointer);
      c.addEventListener("pointerleave", () => {
        this.hoverId = null;
      });

      c.addEventListener("contextmenu", (e) => e.preventDefault());
      c.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });
      document.addEventListener("selectstart", (e) => e.preventDefault());
      document.addEventListener("dragstart", (e) => e.preventDefault());
      window.addEventListener("keydown", (e) => this.onKeyDown(e));
      window.addEventListener("keyup", (e) => this.onKeyUp(e));
      window.addEventListener("resize", () => this.resize(false));
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", () => this.resize(false));
      }
      window.addEventListener("blur", () => {
        AG.Audio.muteExternal(true);
        this.needsAudioResume = true;
      });
      window.addEventListener("focus", () => {
        this.needsAudioResume = true;
      });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.persist(true);
          AG.Audio.muteExternal(true);
          this.needsAudioResume = true;
          if (this.screen === "game" && !this.adBusy) this.pauseGame(true);
        }
      });
      window.addEventListener("beforeunload", () => {
        this.persist(true);
      });
      window.addEventListener("pagehide", () => {
        this.persist(true);
      });
    }

    safeCall(fn) {
      if (typeof fn !== "function") return;
      try { fn(); } catch (e) {
        if (this.debug) console.warn(e);
      }
    }

    onKeyDown(e) {
      if (!this.ready) return;
      const code = e.code;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].indexOf(code) >= 0) e.preventDefault();
      this.ensureAudio();
      if (code === "Escape") {
        if (this.adBusy) return;
        if (this.modal) {
          if (this.modal.type === "confirm") this.closeModal();
          else this.closeModal(true);
          return;
        }
        if (this.screen === "game") this.pauseGame(false);
        else if (this.screen === "pause") this.resumeGame();
        else if (this.screen === "over") this.goMenu();
        else if (this.screen !== "menu" && this.screen !== "boot") this.switchScreen("menu");
        return;
      }
      if (this.modal) return;
      if (this.screen === "game") {
        if (code === "ArrowLeft" || code === "KeyA") this.game.setKeyDir(-1);
        if (code === "ArrowRight" || code === "KeyD") this.game.setKeyDir(1);
      }
      if ((code === "Enter" || code === "Space") && !this.adBusy) {
        if (this.screen === "menu") this.handlePlay();
        else if (this.screen === "over") this.startNewRun();
        else if (this.screen === "pause") this.resumeGame();
      }
    }

    onKeyUp(e) {
      if (e.code === "ArrowLeft" || e.code === "ArrowRight" || e.code === "KeyA" || e.code === "KeyD") {
        this.game.setKeyDir(0);
      }
    }

    hitButton(x, y, layer) {
      for (let i = this.buttons.length - 1; i >= 0; i--) {
        const b = this.buttons[i];
        if (b.layer !== layer) continue;
        if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b;
      }
      return null;
    }

    ensureAudio() {
      if (!AG.Audio.ctx) {
        AG.Audio.init({ sound: this.save.sound, music: this.save.music });
      }
      if (AG.Audio.ctx && AG.Audio.adMuted && !this.platformPaused && !this.adBusy) {
        AG.Audio.muteExternal(false);
      } else if (AG.Audio.ctx && AG.Audio.ctx.state === "suspended" && !this.platformPaused && !this.adBusy) {
        AG.Audio.ctx.resume().catch(function () {});
      }
      if (this.screen === "game" || this.screen === "pause") {
        AG.Audio.setIntensity(this.game && this.game.boss ? 2 : this.screen === "game" ? 1 : 0);
      } else {
        AG.Audio.setIntensity(0);
      }
    }

    clickSound() {
      AG.Audio.play("ui");
    }

    /* ---------------------------- lifecycle -------------------------- */

    handlePlatformPause() {
      this.platformPaused = true;
      AG.Audio.muteExternal(true);
      if (this.screen === "game" && !this.adBusy) {
        this.autoPausedByPlatform = true;
        this.pauseGame(true);
      }
    }

    handlePlatformResume() {
      this.platformPaused = false;
      if (!this.adBusy) AG.Audio.muteExternal(false);
      if (this.screen === "pause" && this.autoPausedByPlatform && !this.modal) {
        this.resumeGame();
      }
    }

    pauseGame(auto) {
      if (!this.game || this.screen !== "game") return;
      if (this.game.state !== "playing" && this.game.state !== "countdown") return;
      this.screen = "pause";
      this.screenTime = 0;
      this.hoverId = null;
      this.pressedId = null;
      this.autoPausedByPlatform = !!auto;
      AG.Audio.setIntensity(0);
      AG.SDK.gameplayStop();
    }

    resumeGame() {
      if (this.screen !== "pause") return;
      this.screen = "game";
      this.screenTime = 0;
      this.autoPausedByPlatform = false;
      this.ensureAudio();
      AG.Audio.setIntensity(this.game.boss ? 2 : 1);
      if (this.game.state === "playing") AG.SDK.gameplayStart();
      this.game.setKeyDir(0);
    }

    onPlayStart() {
      if (this.screen !== "game") return;
      AG.Audio.setIntensity(this.game.boss ? 2 : 1);
      AG.SDK.gameplayStart();
    }

    handlePlay() {
      if (this.adBusy) return;
      if (!this.save.tutorialSeen) {
        this.openTutorial(() => this.startNewRun());
      } else {
        this.startNewRun();
      }
    }

    startNewRun() {
      if (this.adBusy) return;
      this.closeModal();
      this.screen = "game";
      this.screenTime = 0;
      this.death = null;
      this.pendingGain = 0;
      this.adDoubled = false;
      this.reviveUsed = false;
      this.newRecord = false;
      this.runBankedDust = 0;
      this.bankedStats = { blocked: 0, perfect: 0, crystals: 0, repairs: 0, bossKills: 0 };
      this.save.runs = (this.save.runs || 0) + 1;
      this.save.updatedAt = Date.now();
      this.game.startRun();
      this.persist();
      this.ensureAudio();
      AG.Audio.setIntensity(1);
    }

    onRunDeath(result) {
      this.screen = "over";
      this.screenTime = 0;
      this.death = result;
      const prevBest = this.save.best || 0;
      this.newRecord = result.score > prevBest && result.score > 0;
      this.save.best = Math.max(prevBest, result.score);
      this.save.stats.bestWave = Math.max(this.save.stats.bestWave || 0, result.wave);

      const gain = Math.max(0, result.dustTotal - this.runBankedDust);
      this.runBankedDust = result.dustTotal;
      this.pendingGain = gain;
      this.save.dust = (this.save.dust || 0) + gain;

      const keys = { blocked: "blocked", perfect: "perfect", crystals: "crystals", repairs: "repairs", bossKills: "bossKills" };
      for (const k in keys) {
        const source = result.stats ? (result.stats[k] || 0) : 0;
        const banked = this.bankedStats[k] || 0;
        const delta = Math.max(0, source - banked);
        this.bankedStats[k] = source;
        this.save.stats[k] = (this.save.stats[k] || 0) + delta;
      }
      this.save.ads.runsSince = (this.save.ads.runsSince || 0) + 1;
      this.save.updatedAt = Date.now();
      this.persist();
      AG.SDK.gameplayStop();
      AG.Audio.setIntensity(0);
      if (this.sdkAuthorized && this.save.best > 0) this.submitBest();
      this.hoverId = null;
      this.pressedId = null;
    }

    reviveRun() {
      if (!this.game) return;
      this.screen = "game";
      this.screenTime = 0;
      this.reviveUsed = true;
      this.adDoubled = false;
      this.game.revive();
      this.ensureAudio();
      AG.Audio.setIntensity(this.game.boss ? 2 : 1);
      AG.SDK.gameplayStart();
      this.persist();
    }

    goMenu() {
      if (this.adBusy) return;
      this.closeModal();
      this.screen = "menu";
      this.screenTime = 0;
      this.game.stop();
      this.death = null;
      this.pendingGain = 0;
      AG.Audio.setIntensity(0);
      AG.SDK.gameplayStop();
      this.persist(true);
      this.maybeInterstitial();
    }

    leaveRun() {
      this.closeModal();
      this.screen = "menu";
      this.screenTime = 0;
      this.game.stop();
      this.autoPausedByPlatform = false;
      AG.Audio.setIntensity(0);
      AG.SDK.gameplayStop();
      this.persist(true);
    }

    restartRun() {
      this.closeModal();
      this.startNewRun();
    }

    persist(immediateCloud) {
      if (!this.save) return;
      this.save.updatedAt = Date.now();
      AG.Save.store(this.save);
      if (immediateCloud) {
        this.syncCloud();
      } else {
        if (this.cloudTimer) window.clearTimeout(this.cloudTimer);
        this.cloudTimer = window.setTimeout(() => {
          this.cloudTimer = null;
          this.syncCloud();
        }, 1400);
      }
    }

    syncCloud() {
      if (!AG.SDK.isActive()) return;
      const snapshot = JSON.parse(JSON.stringify(this.save));
      AG.SDK.setCloudData(snapshot).catch(function () {});
    }

    unlockAchievement(id) {
      if (!this.save || this.save.achievements[id]) return;
      const def = AG.ACHIEVEMENTS.filter(function (a) { return a.id === id; })[0];
      if (!def) return;
      this.save.achievements[id] = true;
      this.save.dust = (this.save.dust || 0) + def.reward;
      this.save.updatedAt = Date.now();
      this.persist();
      const name = T("ach_" + id + "_n");
      this.toast(T("newAchievement"), name + "  ·  +" + def.reward, "#ffd98a", "medal");
      AG.Audio.play("reward");
      this.celebrate = Math.max(this.celebrate, 0.8);
    }

    toast(title, sub, color, icon) {
      this.toasts.push({
        id: ++this.toastSeq,
        title: title,
        sub: sub || "",
        color: color || "#8ffff2",
        icon: icon || "medal",
        life: 3.1,
        maxLife: 3.1
      });
      if (this.toasts.length > 3) this.toasts.shift();
    }

    /* ------------------------------ ads ------------------------------ */

    maybeInterstitial() {
      if (!AG.SDK.isActive() || this.adBusy || this.modal) return;
      if (this.save.ads.runsSince < 3) return;
      if (Date.now() - (this.save.ads.lastAt || 0) < 180000) return;
      this.adBusy = true;
      this.adKind = "interstitial";
      AG.Audio.muteExternal(true);
      const done = (shown) => {
        this.adBusy = false;
        this.adKind = null;
        this.save.ads.lastAt = Date.now();
        if (shown) this.save.ads.runsSince = 0;
        this.save.updatedAt = Date.now();
        this.persist();
        if (!this.platformPaused) AG.Audio.muteExternal(false);
      };
      const started = AG.SDK.showFullscreen({
        onOpen: () => {},
        onClose: done,
        onError: () => done(false)
      });
      if (!started) {
        this.adBusy = false;
        this.adKind = null;
        if (!this.platformPaused) AG.Audio.muteExternal(false);
      }
    }

    watchAd(kind) {
      if (this.adBusy) return;
      this.adBusy = true;
      this.adKind = kind;
      this.adRewarded = false;
      AG.Audio.muteExternal(true);
      const finish = (rewarded) => {
        const wasKind = this.adKind;
        this.adBusy = false;
        this.adKind = null;
        this.adRewarded = false;
        if (!this.platformPaused) AG.Audio.muteExternal(false);
        if (rewarded) {
          if (wasKind === "revive") {
            this.reviveRun();
          } else if (wasKind === "dust") {
            this.doubleDust();
          }
        }
      };
      if (!AG.SDK.isActive()) {
        finish(true);
        return;
      }
      const started = AG.SDK.showRewarded({
        onRewarded: () => { this.adRewarded = true; },
        onClose: (wasShown) => {
          const rewarded = this.adRewarded;
          finish(rewarded);
          if (!rewarded) this.toast(T("adError"), "", "#ff9b93", "warning");
        },
        onError: () => {
          finish(false);
          this.toast(T("adError"), "", "#ff9b93", "warning");
        }
      });
      if (!started && !AG.SDK.adBusy) {
        this.adBusy = false;
        this.adKind = null;
        if (!this.platformPaused) AG.Audio.muteExternal(false);
      }
    }

    doubleDust() {
      if (this.adDoubled || this.pendingGain <= 0) return;
      this.adDoubled = true;
      this.save.dust = (this.save.dust || 0) + this.pendingGain;
      this.save.updatedAt = Date.now();
      this.persist();
      AG.Audio.play("reward");
      this.toast(T("rewardGranted"), "+" + AG.I18N.num(this.pendingGain) + " " + T("dustShort"), "#ffd98a", "spark");
      this.celebrate = Math.max(this.celebrate, 0.7);
    }

    submitBest() {
      if (!AG.SDK.isAuthorized()) return;
      const score = Math.max(0, Math.floor(this.save.best || 0));
      if (score <= 0 || score === this.lastSubmit) return;
      this.lastSubmit = score;
      AG.SDK.submitScore(score, AG.SDK.leaderboardName).then((ok) => {
        if (!ok) this.lastSubmit = 0;
      });
    }

    /* --------------------------- progression ------------------------- */

    buyUpgrade(key) {
      const def = AG.UPGRADES[key];
      if (!def) return;
      const level = this.save.upgrades[key] || 0;
      if (level >= def.max) return;
      const cost = def.costs[level];
      if ((this.save.dust || 0) < cost) {
        AG.Audio.play("error");
        const missing = cost - (this.save.dust || 0);
        this.toast(T("notEnough", { n: AG.I18N.num(missing) + " " + T("dustShort") }), "", "#ffb1a9", "warning");
        return;
      }
      this.save.dust -= cost;
      this.save.upgrades[key] = level + 1;
      this.save.updatedAt = Date.now();
      this.persist();
      AG.Audio.play("buy");
      this.upgradeFlash = { key: key, time: 1 };
      this.toast(T("upgradeDone"), T("up" + key.charAt(0).toUpperCase() + key.slice(1)), "#8ffff2", "upgrade");
    }

    claimDaily() {
      if (!AG.dailyAvailable(this.save)) return;
      const streak = AG.nextDailyStreak(this.save);
      const reward = AG.dailyReward(streak);
      this.save.daily.date = AG.todayKey();
      this.save.daily.streak = streak;
      this.save.dust = (this.save.dust || 0) + reward;
      this.save.updatedAt = Date.now();
      this.persist();
      AG.Audio.play("reward");
      this.toast(T("dailyTitle"), T("dailyToast", { n: AG.I18N.num(reward) }), "#ffd98a", "gift");
      this.celebrate = Math.max(this.celebrate, 1);
    }

    resetProgress() {
      const prefs = {
        sound: this.save.sound,
        music: this.save.music,
        lang: this.save.lang
      };
      const fresh = AG.Save.defaults();
      fresh.sound = prefs.sound;
      fresh.music = prefs.music;
      fresh.lang = prefs.lang;
      fresh.updatedAt = Date.now();
      this.save = fresh;
      AG.Save.store(this.save);
      this.dustShown = 0;
      this.lastSubmit = 0;
      this.game.stop();
      this.screen = "menu";
      this.closeModal();
      AG.SDK.gameplayStop();
      AG.Audio.setIntensity(0);
      this.persist(true);
      this.toast(T("resetDone"), "", "#ffb1a9", "refresh");
    }

    setLanguage(lang) {
      if (!AG.I18N.languages.includes(lang)) return;
      this.save.lang = lang;
      AG.I18N.setLang(lang);
      this.updateDocumentTitle();
      this.persist();
      AG.Audio.play("ui");
      this.lb.lastFetch = 0;
    }

    /* --------------------------- leaderboard ------------------------- */

    async loadLeaderboard(force) {
      if (this.lb.status === "loading" && !force) return;
      if (!AG.SDK.isActive()) {
        this.lb.status = "offline";
        return;
      }
      if (!force && this.lb.lastFetch && Date.now() - this.lb.lastFetch < 30000 && (this.lb.status === "ok" || this.lb.status === "empty")) return;
      this.lb.status = "loading";
      this.lb.error = "";
      const res = await AG.SDK.getLeaderboardEntries(AG.SDK.leaderboardName, {
        quantityTop: 10,
        includeUser: true,
        quantityAround: 2
      });
      this.lb.lastFetch = Date.now();
      if (!res.ok) {
        this.lb.status = res.reason === "offline" ? "offline" : "error";
        this.lb.error = String(res.reason || "");
        return;
      }
      const data = res.data || {};
      const entries = Array.isArray(data.entries) ? data.entries.slice() : [];
      entries.sort(function (a, b) { return (a.rank || 0) - (b.rank || 0); });
      this.lb.entries = entries;
      this.lb.data = data;
      this.lb.userRank = data.userRank || 0;
      this.lb.status = entries.length ? "ok" : "empty";
    }

    async loginAndRefresh() {
      if (this.lbLoggingIn || this.adBusy) return;
      this.lbLoggingIn = true;
      const ok = await AG.SDK.login();
      this.lbLoggingIn = false;
      this.sdkActive = AG.SDK.isActive();
      this.sdkAuthorized = AG.SDK.isAuthorized();
      if (ok) {
        if (AG.SDK.player && AG.SDK.player.getUniqueID) {
          try { this.playerId = AG.SDK.player.getUniqueID(); } catch (e) { /* noop */ }
        }
        this.lastSubmit = 0;
        this.submitBest();
        await this.loadCloud(false);
        await this.loadLeaderboard(true);
        this.toast(T("lbLogin"), T("lbLoginWhy"), "#8ffff2", "check");
      } else {
        this.toast(T("loginError"), "", "#ffb1a9", "warning");
      }
    }
    /* ------------------------------ loop ----------------------------- */

    loop(now) {
      if (!this.lastFrame) this.lastFrame = now;
      let dt = (now - this.lastFrame) / 1000;
      this.lastFrame = now;
      if (!isFinite(dt) || dt < 0) dt = 0;
      dt = Math.min(dt, 0.05);
      this.time += dt;
      this.screenTime += dt;
      this.update(dt);
      this.render();
      window.requestAnimationFrame(this.loop);
    }

    update(dt) {
      this.dustShown += (this.save.dust - this.dustShown) * Math.min(1, dt * 7);
      if (Math.abs(this.dustShown - this.save.dust) < 0.5) this.dustShown = this.save.dust;
      if (this.celebrate > 0) this.celebrate = Math.max(0, this.celebrate - dt * 1.4);

      for (let i = this.toasts.length - 1; i >= 0; i--) {
        this.toasts[i].life -= dt;
        if (this.toasts[i].life <= 0) this.toasts.splice(i, 1);
      }
      for (let i = 0; i < this.ambientDust.length; i++) {
        const d = this.ambientDust[i];
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); }
        if (d.x < -0.02) d.x = 1.02;
        if (d.x > 1.02) d.x = -0.02;
      }
      if (this.modal) this.modal.t = Math.min(1, (this.modal.t || 0) + dt * 7);
      if (this.upgradeFlash) {
        this.upgradeFlash.time -= dt * 1.6;
        if (this.upgradeFlash.time <= 0) this.upgradeFlash = null;
      }
      if (this.adBusy && this.adKind !== "interstitial" && this.screen === "over") {
        // The SDK or the local fallback controls the transition.
      }

      if (this.screen === "game" && !this.modal) {
        this.game.update(dt);
      } else if (this.screen === "over" && !this.modal) {
        this.game.update(dt);
      }
      if (this.screen === "game" && !this.modal) {
        AG.Audio.setIntensity(this.game.boss ? 2 : 1);
      }
    }

    render() {
      const ctx = this.ctx;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, this.w, this.h);
      if (this.backdrop) ctx.drawImage(this.backdrop, 0, 0, this.w, this.h);
      else {
        ctx.fillStyle = "#050816";
        ctx.fillRect(0, 0, this.w, this.h);
      }
      AG.Art.drawTwinkles(ctx, this.stars, this.time);

      this.buttons.length = 0;

      if (this.screen === "game" || this.screen === "pause" || this.screen === "over") {
        this.game.renderWorld(ctx);
        if (this.screen === "game") this.drawHUD(ctx);
        else if (this.screen === "pause") this.drawPause(ctx);
        else this.drawOver(ctx);
      } else {
        this.drawAmbient(ctx, this.screen === "menu" || this.screen === "boot");
        if (this.screen === "menu") this.drawMenu(ctx);
        else if (this.screen === "upgrades") this.drawUpgrades(ctx);
        else if (this.screen === "awards") this.drawAwards(ctx);
        else if (this.screen === "leaderboard") this.drawLeaderboard(ctx);
        else if (this.screen === "settings") this.drawSettings(ctx);
      }

      this.drawToasts(ctx);
      if (this.modal) this.drawModal(ctx);

      const layer = this.modal ? "modal" : "base";
      const hovered = this.hitButton(this.pointer.x, this.pointer.y, layer);
      if (hovered && !hovered.disabled) this.canvas.style.cursor = "pointer";
      else if (this.screen === "game" && this.game.state === "playing" && !this.adBusy) this.canvas.style.cursor = "crosshair";
      else this.canvas.style.cursor = "default";
    }

    /* --------------------------- navigation -------------------------- */

    switchScreen(name) {
      if (name === this.screen) return;
      this.screen = name;
      this.screenTime = 0;
      this.hoverId = null;
      this.pressedId = null;
      this.dragging = false;
      if (name === "menu") {
        AG.Audio.setIntensity(0);
        AG.SDK.gameplayStop();
      }
      if (name === "leaderboard") this.loadLeaderboard(false);
    }

    openUpgrades() { this.switchScreen("upgrades"); }
    openAwards() { this.switchScreen("awards"); }
    openSettings() { this.switchScreen("settings"); }
    openLeaderboard() { this.switchScreen("leaderboard"); this.loadLeaderboard(false); }

    openTutorial(after) {
      this.modal = { type: "tutorial", t: 0, after: after || null };
      this.hoverId = null;
      this.pressedId = null;
    }

    openDaily() {
      this.modal = { type: "daily", t: 0 };
      this.hoverId = null;
      this.pressedId = null;
    }

    openConfirm(kind) {
      let title = T("resetTitle");
      let note = T("resetNote");
      let yes = T("resetYes");
      let no = T("resetNo");
      let danger = true;
      let action = () => this.resetProgress();
      if (kind === "leave") {
        title = T("leaveTitle");
        note = T("leaveText");
        yes = T("leaveYes");
        no = T("leaveNo");
        danger = true;
        action = () => this.leaveRun();
      } else if (kind === "restart") {
        title = T("restartTitle");
        note = T("restartText");
        yes = T("restartYes");
        no = T("restartNo");
        danger = false;
        action = () => this.restartRun();
      }
      this.modal = { type: "confirm", t: 0, title: title, note: note, yes: yes, no: no, danger: danger, action: action };
      this.hoverId = null;
      this.pressedId = null;
    }

    closeModal(skipAction) {
      const m = this.modal;
      this.modal = null;
      this.hoverId = null;
      this.pressedId = null;
      if (m && m.type === "tutorial") {
        if (!this.save.tutorialSeen) {
          this.save.tutorialSeen = true;
          this.persist();
        }
        if (m.after && !skipAction) this.safeCall(m.after);
      }
    }

    /* ------------------------------ art ------------------------------ */

    setFont(size, weight, display) {
      const ctx = this.ctx;
      ctx.font = (display ? "400 " : (weight || 600) + " ") + size + "px " + (display ? FONT_DISPLAY : FONT_UI);
    }

    text(str, x, y, size, color, opts) {
      const o = opts || {};
      const ctx = this.ctx;
      ctx.save();
      this.setFont(size, o.weight, o.display);
      ctx.fillStyle = color || "#eaf6ff";
      ctx.textAlign = o.align || "left";
      ctx.textBaseline = o.baseline || "middle";
      if (o.alpha !== undefined) ctx.globalAlpha = o.alpha;
      if (o.spacing) {
        AG.Art.spacedText(ctx, str, x, y, o.spacing, o.align || "left");
      } else if (o.stroke) {
        ctx.strokeStyle = o.stroke;
        ctx.lineWidth = o.strokeWidth || 3;
        ctx.strokeText(str, x, y);
        ctx.fillText(str, x, y);
      } else {
        ctx.fillText(str, x, y);
      }
      ctx.restore();
    }

    label(str, x, y, size, color, spacing, align, weight) {
      const ctx = this.ctx;
      ctx.save();
      this.setFont(size, weight || 600);
      ctx.fillStyle = color || "#9fbcd0";
      ctx.textBaseline = "middle";
      AG.Art.spacedText(ctx, str, x, y, spacing === undefined ? 1.4 : spacing, align || "left");
      ctx.restore();
    }

    measure(str, size, weight, display) {
      const ctx = this.ctx;
      ctx.save();
      this.setFont(size, weight, display);
      const w = ctx.measureText(str).width;
      ctx.restore();
      return w;
    }

    sizeToFit(str, maxWidth, start, min, display, weight) {
      let s = start;
      while (s > min && this.measure(str, s, weight, display) > maxWidth) s -= 0.5;
      return s;
    }

    panel(x, y, w, h, opts) {
      AG.Art.panel(this.ctx, x, y, w, h, opts);
    }

    chip(x, y, w, h, icon, labelText, value, color) {
      const ctx = this.ctx;
      this.panel(x, y, w, h, { radius: h / 2, border: "rgba(110,205,222,0.16)" });
      const cy = y + h / 2;
      AG.Art.icon(ctx, icon, x + 16, cy, Math.min(17, h * 0.5), color || "#9fe9e3");
      const textX = x + 30;
      if (labelText) {
        this.label(labelText, textX, cy - 7.5, Math.max(6.5, h * 0.19), "rgba(139,171,190,0.9)", 1.1);
        this.text(value, textX, cy + 5, Math.max(10, h * 0.34), "#e9fbff", { weight: 700 });
      } else {
        this.text(value, textX, cy + 1, Math.max(11, h * 0.38), "#e9fbff", { weight: 700 });
      }
    }

    iconButton(id, icon, x, y, size, onClick, opts) {
      const o = opts || {};
      const b = {
        id: id, x: x, y: y, w: size, h: size, style: "icon", icon: icon,
        active: !!o.active, badge: !!o.badge, disabled: !!o.disabled,
        layer: o.layer || "base", onClick: onClick
      };
      this.buttons.push(b);
      this.drawIconButton(b);
      return b;
    }

    drawIconButton(b) {
      if (this.hoverId === b.id && !b.disabled) {
        this.panel(b.x - 2, b.y - 2, b.w + 4, b.h + 4, { radius: (b.w + 4) * 0.3, border: "rgba(120,240,226,0.3)", top: "rgba(18,45,62,0.9)", bottom: "rgba(9,24,40,0.9)" });
      }
      this.panel(b.x, b.y, b.w, b.h, {
        radius: b.w * 0.32,
        border: b.active ? "rgba(110,235,226,0.38)" : "rgba(108,180,205,0.16)",
        top: "rgba(12,29,48,0.82)",
        bottom: "rgba(6,16,29,0.86)"
      });
      const color = b.disabled ? "rgba(150,180,200,0.3)" : b.active ? "#8ffff2" : "#b9d6e4";
      AG.Art.icon(this.ctx, b.icon, b.x + b.w / 2, b.y + b.h / 2, b.w * 0.44, color);
      if (b.badge) {
        const bx = b.x + b.w - 5;
        const by = b.y + 5;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(bx, by, 5.2, 0, TAU);
        this.ctx.fillStyle = "#ffcf6b";
        this.ctx.fill();
        this.ctx.restore();
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(bx, by, 2.2 + Math.sin(this.time * 5) * 0.7, 0, TAU);
        this.ctx.fillStyle = "#5a3906";
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    button(opts) {
      const o = opts || {};
      const b = {
        id: o.id,
        x: o.x, y: o.y, w: o.w, h: o.h,
        style: o.style || "secondary",
        label: o.label || "",
        sub: o.sub || "",
        icon: o.icon || null,
        badge: !!o.badge,
        disabled: !!o.disabled,
        insufficient: !!o.insufficient,
        labelSize: o.labelSize || 12,
        layer: o.layer || "base",
        onClick: o.onClick,
        noHover: !!o.noHover
      };
      this.buttons.push(b);
      this.drawButton(b);
      return b;
    }

    drawButton(b) {
      const ctx = this.ctx;
      const hover = this.hoverId === b.id && !b.disabled && !b.noHover;
      const pressed = this.pressedId === b.id && !b.disabled;
      const s = pressed ? 0.978 : hover ? 1.014 : 1;
      ctx.save();
      ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
      ctx.scale(s, s);
      ctx.translate(-b.w / 2, -b.h / 2);
      const w = b.w, h = b.h, r = Math.min(14, h * 0.32);
      let fillTop = "rgba(12, 27, 46, 0.9)";
      let fillBottom = "rgba(6, 16, 29, 0.94)";
      let border = "rgba(108, 190, 215, 0.2)";
      let textColor = "#dff4ff";
      let subColor = "rgba(146, 183, 205, 0.85)";
      let iconColor = "#8ffff2";
      let trackGlow = null;

      if (b.style === "primary") {
        fillTop = "#72f8e8";
        fillBottom = "#25c6c0";
        border = "rgba(160, 255, 248, 0.65)";
        textColor = "#032429";
        iconColor = "#032429";
        subColor = "rgba(4, 52, 55, 0.75)";
        trackGlow = "#3fe8dc";
      } else if (b.style === "gold") {
        fillTop = "#ffe3a0";
        fillBottom = "#f0b04e";
        border = "rgba(255, 235, 175, 0.7)";
        textColor = "#2b1a04";
        iconColor = "#2b1a04";
        subColor = "rgba(60, 38, 6, 0.72)";
        trackGlow = "#ffcf6b";
      } else if (b.style === "danger") {
        fillTop = "rgba(48, 18, 26, 0.92)";
        fillBottom = "rgba(25, 10, 16, 0.94)";
        border = "rgba(255, 122, 122, 0.4)";
        textColor = "#ffb3b3";
        iconColor = "#ff9b93";
        subColor = "rgba(255, 176, 176, 0.66)";
      } else if (b.style === "ghost") {
        fillTop = "rgba(8, 18, 31, 0.4)";
        fillBottom = "rgba(5, 12, 22, 0.45)";
        border = "rgba(110, 175, 200, 0.14)";
        textColor = "#b6cfdd";
        iconColor = "#9fc5d3";
      } else if (b.style === "listrow") {
        fillTop = "rgba(11, 26, 45, 0.82)";
        fillBottom = "rgba(7, 18, 32, 0.9)";
        border = "rgba(105, 185, 210, 0.16)";
        textColor = "#d6edf7";
      }

      if (b.insufficient) {
        border = "rgba(255, 138, 122, 0.45)";
        textColor = "#ffb1a9";
        iconColor = "#ffb1a9";
      }
      if (b.disabled) ctx.globalAlpha = 0.42;

      if (trackGlow) {
        AG.Art.drawGlow(ctx, trackGlow, w / 2, h / 2, Math.max(w * 0.55, h * 1.1), hover ? 0.24 : 0.15);
      }
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, fillTop);
      g.addColorStop(1, fillBottom);
      AG.Art.roundRect(ctx, 0, 0, w, h, r);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = border;
      ctx.lineWidth = b.style === "primary" || b.style === "gold" ? 1.2 : 1;
      ctx.stroke();

      if (b.style === "primary" || b.style === "gold") {
        ctx.beginPath();
        ctx.moveTo(r, 1.2);
        ctx.lineTo(w - r, 1.2);
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(r, 1);
        ctx.lineTo(w - r, 1);
        ctx.strokeStyle = "rgba(180, 240, 245, 0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const hasIcon = !!b.icon;
      const iconSize = Math.min(20, h * 0.42);
      const textMax = w - (hasIcon ? 46 : 22);
      let size = b.labelSize;
      if (b.sub) size = Math.min(size, h * 0.24);
      const labelY = b.sub ? h / 2 - h * 0.15 : h / 2;
      let spacing = 0.8;
      let labelWidth = this.measureWithSpacing(b.label, size, spacing, 600);
      while (labelWidth > textMax && size > 8) {
        size -= 0.4;
        labelWidth = this.measureWithSpacing(b.label, size, spacing, 600);
      }
      const contentShift = hasIcon ? 9 : 0;
      if (hasIcon) {
        AG.Art.icon(ctx, b.icon, 20, h / 2 - (b.sub ? 2 : 0), iconSize, iconColor);
      }
      ctx.save();
      this.setFont(size, 700);
      ctx.fillStyle = textColor;
      AG.Art.spacedText(ctx, b.label, w / 2 + contentShift, labelY, spacing, "center");
      ctx.restore();
      if (b.sub) {
        ctx.save();
        this.setFont(Math.min(9, h * 0.17), 600);
        ctx.fillStyle = subColor;
        AG.Art.spacedText(ctx, b.sub, w / 2 + contentShift * 0.4, h / 2 + h * 0.19, 0.7, "center");
        ctx.restore();
      }
      if (b.style === "listrow") {
        AG.Art.icon(ctx, "chevron", w - 18, h / 2, 14, iconColor);
      }
      if (b.badge) {
        ctx.save();
        this.setFont(7.2, 700);
        const badgeText = T("adBadge");
        const bw = Math.max(26, ctx.measureText(badgeText).width + 12);
        const bh = 13;
        AG.Art.roundRect(ctx, w - bw - 7, 6, bw, bh, 6.5);
        ctx.fillStyle = "rgba(255, 207, 107, 0.14)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 207, 107, 0.6)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.fillStyle = "#ffd98a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(badgeText, w - bw / 2 - 7, 12.8);
        ctx.restore();
      }
      ctx.restore();
    }

    measureWithSpacing(text, size, spacing, weight) {
      const ctx = this.ctx;
      ctx.save();
      this.setFont(size, weight);
      let total = 0;
      for (const ch of Array.from(String(text))) total += ctx.measureText(ch).width + spacing;
      ctx.restore();
      return Math.max(0, total - spacing);
    }

    switchButton(id, x, y, on, onClick) {
      const w = 48, h = 26;
      const hover = this.hoverId === id;
      this.buttons.push({ id: id, x: x, y: y, w: w, h: h, style: "toggle", layer: "base", onClick: onClick });
      const ctx = this.ctx;
      ctx.save();
      if (hover) ctx.globalAlpha = 0.9;
      AG.Art.roundRect(ctx, x, y, w, h, h / 2);
      ctx.fillStyle = on ? "rgba(52, 224, 205, 0.26)" : "rgba(80, 110, 132, 0.18)";
      ctx.fill();
      ctx.strokeStyle = on ? "rgba(111, 250, 232, 0.62)" : "rgba(130, 165, 185, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + (on ? w - h / 2 : h / 2), y + h / 2, h / 2 - 4, 0, TAU);
      ctx.fillStyle = on ? "#7ffff0" : "rgba(165, 190, 205, 0.55)";
      ctx.fill();
      ctx.restore();
    }

    /* ----------------------------- ambient --------------------------- */

    ambientLayout() {
      if (this.portrait()) {
        const short = this.h < 700;
        return {
          x: this.w * 0.55,
          y: this.h * (short ? 0.99 : 0.93),
          r: Math.min(this.w, this.h) * (short ? 0.44 : 0.60),
          horizon: true
        };
      }
      return { x: this.w * 0.775, y: this.h * 0.54, r: Math.min(this.w, this.h) * 0.245 };
    }

    portrait() {
      return this.h > this.w * 1.12;
    }

    drawAmbient(ctx, bright) {
      const a = this.ambientLayout();
      const dim = bright ? 1 : 0.5;
      ctx.save();
      ctx.globalAlpha = dim;
      AG.Art.drawPlanet(ctx, a.x, a.y, a.r, this.time * 0.8, { glow: 1.8, moons: a.horizon ? 0 : 1 });
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = dim * (this.portrait() ? 0.45 : 0.7);
      AG.Art.drawShield(ctx, a.x, a.y, a.r * (a.horizon ? 1.22 : 1.5), this.time * 0.18 - 2.35, 0.82, {
        time: this.time,
        energy: 0.78,
        active: true
      });
      ctx.restore();

      if (bright) {
        for (let i = 0; i < this.decor.length; i++) {
          const d = this.decor[i];
          const ang = d.a + this.time * d.speed * (i % 2 ? -1 : 1);
          const dist = a.r * d.rf;
          const x = a.x + Math.cos(ang) * dist;
          const y = a.y + Math.sin(ang) * dist * 0.52;
          if (x < -80 || x > this.w + 80 || y < -80 || y > this.h + 80) continue;
          ctx.save();
          ctx.globalAlpha = dim * 0.72;
          if (d.crystal) {
            AG.Art.drawCrystal(ctx, x, y, a.r * d.size * 0.72, d.rot + this.time * 0.3, this.time);
          } else {
            AG.Art.drawRock(ctx, x, y, a.r * d.size, d.rot + this.time * d.spin, { variant: d.variant });
          }
          ctx.restore();
        }
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < this.ambientDust.length; i++) {
        const d = this.ambientDust[i];
        ctx.globalAlpha = d.a * (0.6 + 0.4 * Math.sin(this.time * 0.8 + i));
        ctx.fillStyle = i % 5 === 0 ? "#ffd98a" : "#9fe9e3";
        ctx.beginPath();
        ctx.arc(d.x * this.w, d.y * this.h, d.s, 0, TAU);
        ctx.fill();
      }
      ctx.restore();

      this.drawScrim(ctx);
      if (!bright) {
        const shade = ctx.createLinearGradient(0, 0, 0, this.h);
        shade.addColorStop(0, "rgba(3, 8, 16, 0.62)");
        shade.addColorStop(0.55, "rgba(3, 8, 16, 0.5)");
        shade.addColorStop(0.82, "rgba(3, 8, 16, 0.28)");
        shade.addColorStop(1, "rgba(3, 8, 16, 0.14)");
        ctx.fillStyle = shade;
        ctx.fillRect(0, 0, this.w, this.h);
      }
    }

    drawScrim(ctx) {
      const w = this.w, h = this.h;
      if (this.portrait()) {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "rgba(4, 8, 16, 0.76)");
        g.addColorStop(0.34, "rgba(4, 8, 16, 0.24)");
        g.addColorStop(0.62, "rgba(4, 8, 16, 0.04)");
        g.addColorStop(0.9, "rgba(4, 8, 16, 0.22)");
        g.addColorStop(1, "rgba(4, 8, 16, 0.5)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      } else {
        const g = ctx.createLinearGradient(0, 0, w * 0.62, 0);
        g.addColorStop(0, "rgba(4, 8, 16, 0.92)");
        g.addColorStop(0.55, "rgba(4, 8, 16, 0.35)");
        g.addColorStop(1, "rgba(4, 8, 16, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        const v = ctx.createLinearGradient(0, h * 0.7, 0, h);
        v.addColorStop(0, "rgba(3, 6, 12, 0)");
        v.addColorStop(1, "rgba(3, 6, 12, 0.68)");
        ctx.fillStyle = v;
        ctx.fillRect(0, 0, w, h);
      }
    }

    /* ------------------------------ menu ----------------------------- */

    menuLayout() {
      const w = this.w, h = this.h, safe = this.safe;
      if (this.portrait()) {
        const cw = Math.min(w - 36, 356);
        const x = (w - cw) / 2;
        const top = AG.clamp(h * 0.10, safe.top + 54, safe.top + 106);
        const emblemR = h < 620 ? 22 : 26;
        const emblemY = top + emblemR;
        return {
          portrait: true,
          cw: cw, x: x,
          emblem: { x: w / 2, y: emblemY, r: emblemR },
          title: { x: w / 2, y: emblemY + emblemR + 26, size: h < 620 ? 30 : 34, max: cw },
          sub: { x: w / 2, y: emblemY + emblemR + 48, size: h < 620 ? 8 : 9 },
          chips: { x: x, y: emblemY + emblemR + 64, w: cw, h: 34 },
          play: { x: x, y: emblemY + emblemR + 112, w: cw, h: h < 620 ? 52 : 56 },
          grid: { x: x, y: emblemY + emblemR + 174, w: cw, h: h < 620 ? 92 : 100, gap: 9 },
          footerY: h - safe.bottom - 12,
          iconSize: 38
        };
      }
      const cw = AG.clamp(w * 0.3, 300, 380);
      let x = Math.max(safe.left + 48, w * 0.085);
      if (x + cw > w * 0.57) x = Math.max(safe.left + 24, w * 0.06);
      const compact = h < 540;
      const emblemR = compact ? 22 : 28;
      const top = AG.clamp(h * 0.5 - (compact ? 150 : 188), safe.top + 16, h - (compact ? 280 : 340));
      const emblemY = top + emblemR;
      return {
        portrait: false,
        cw: cw, x: x,
        emblem: { x: x + emblemR, y: emblemY, r: emblemR },
        title: { x: x + emblemR * 2 + 14, y: emblemY, size: compact ? 30 : 42, max: cw - emblemR * 2 - 18 },
        sub: { x: x + emblemR * 2 + 16, y: emblemY + (compact ? 21 : 27), size: compact ? 8 : 9 },
        chips: { x: x, y: top + (compact ? 52 : 66), w: cw, h: compact ? 28 : 32 },
        play: { x: x, y: top + (compact ? 88 : 105), w: cw, h: compact ? 48 : 58 },
        grid: { x: x, y: top + (compact ? 146 : 174), w: cw, h: compact ? 78 : 112, gap: 9 },
        footerY: h - safe.bottom - 12,
        iconSize: 40
      };
    }

    drawMenu(ctx) {
      const lo = this.menuLayout();
      const safe = this.safe;
      const iconSize = lo.iconSize;
      const gap = 8;
      const iconY = safe.top + 12;
      let ix = this.w - safe.right - 14 - iconSize;
      this.iconButton("menu_gift", "gift", ix, iconY, iconSize, () => this.openDaily(), {
        badge: AG.dailyAvailable(this.save)
      });
      ix -= iconSize + gap;
      this.iconButton("menu_music", this.save.music ? "music" : "mute", ix, iconY, iconSize, () => this.toggleMusic(), {
        active: this.save.music
      });
      ix -= iconSize + gap;
      this.iconButton("menu_sound", this.save.sound ? "sound" : "mute", ix, iconY, iconSize, () => this.toggleSound(), {
        active: this.save.sound
      });

      this.drawLogo(lo);

      const chipGap = 8;
      const chipW = (lo.chips.w - chipGap) / 2;
      this.chip(lo.chips.x, lo.chips.y, chipW, lo.chips.h, "trophy", T("best"), AG.I18N.num(this.save.best || 0), "#ffd98a");
      this.chip(lo.chips.x + chipW + chipGap, lo.chips.y, chipW, lo.chips.h, "spark", T("dust"), AG.I18N.num(this.dustShown), "#8ffff2");

      this.button({
        id: "menu_play",
        x: lo.play.x, y: lo.play.y, w: lo.play.w, h: lo.play.h,
        style: "primary", icon: "play", label: T("play"),
        labelSize: lo.portrait ? 18 : 19,
        onClick: () => this.handlePlay()
      });

      const bw = (lo.grid.w - lo.grid.gap) / 2;
      const bh = (lo.grid.h - lo.grid.gap) / 2;
      const gx = lo.grid.x;
      const gy = lo.grid.y;
      const g = lo.grid.gap;
      this.button({
        id: "menu_upgrades", x: gx, y: gy, w: bw, h: bh,
        style: "secondary", icon: "upgrade", label: T("upgrades"),
        labelSize: lo.portrait ? 11 : 12,
        onClick: () => this.openUpgrades()
      });
      this.button({
        id: "menu_lb", x: gx + bw + g, y: gy, w: bw, h: bh,
        style: "secondary", icon: "trophy", label: T("leaderboard"),
        labelSize: lo.portrait ? 10 : 11,
        onClick: () => this.openLeaderboard()
      });
      this.button({
        id: "menu_awards", x: gx, y: gy + bh + g, w: bw, h: bh,
        style: "secondary", icon: "medal", label: T("awards"),
        labelSize: lo.portrait ? 11 : 12,
        onClick: () => this.openAwards()
      });
      this.button({
        id: "menu_settings", x: gx + bw + g, y: gy + bh + g, w: bw, h: bh,
        style: "secondary", icon: "gear", label: T("settings"),
        labelSize: lo.portrait ? 11 : 12,
        onClick: () => this.openSettings()
      });

      const statusY = lo.grid.y + lo.grid.h + 26;
      if (statusY < lo.footerY - 22) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(lo.x + 4, statusY, 3, 0, TAU);
        ctx.fillStyle = "rgba(111, 247, 223, 0.72)";
        ctx.fill();
        ctx.restore();
        this.label(T("sysOnline"), lo.x + 14, statusY, 6.5, "rgba(130, 207, 203, 0.62)", 1.4);
      }
      if (!lo.portrait) {
        this.label(T("sysFooter"), safe.left + 14, lo.footerY - 12, 7, "rgba(126,164,184,0.55)", 1.6);
      }
      this.label("v" + AG.VERSION, safe.left + 14, lo.footerY + 1, 7, "rgba(126,164,184,0.45)", 1.2);
      if (lo.portrait) {
        this.setFont(7.5, 600);
        const hintW = this.measureWithSpacing(T("hintMobile"), 7.5, 1.2, 600) + 30;
        const hy = lo.footerY - 25;
        this.panel(this.w / 2 - hintW / 2, hy - 11, hintW, 22, {
          radius: 11,
          top: "rgba(4, 13, 23, 0.5)",
          bottom: "rgba(4, 13, 23, 0.64)",
          border: "rgba(113, 192, 204, 0.12)",
          highlight: false
        });
        this.label(T("hintMobile"), this.w / 2, hy, 7.5, "rgba(192, 227, 234, 0.85)", 1.2, "center");
      }
    }

    drawLogo(lo) {
      const ctx = this.ctx;
      const e = lo.emblem;
      AG.Art.drawGlow(ctx, "#49e6da", e.x, e.y, e.r * 2.4, 0.4);
      AG.Art.drawPlanet(ctx, e.x, e.y, e.r, this.time * 0.4, { glow: 1.25, moons: 0 });
      ctx.save();
      AG.Art.drawShield(ctx, e.x, e.y, e.r * 1.55, -2.2 + Math.sin(this.time * 0.4) * 0.16, 0.86, {
        time: this.time, energy: 0.9, active: true
      });
      ctx.restore();
      AG.Art.drawRock(ctx, e.x + Math.cos(0.55) * e.r * 2.1, e.y + Math.sin(0.55) * e.r * 1.25, e.r * 0.18, 0.7, { variant: 2 });

      const size = this.sizeToFit(T("brand"), lo.title.max, lo.title.size, 20, true, 400);
      const align = lo.portrait ? "center" : "left";
      ctx.save();
      this.setFont(size, 400, true);
      ctx.fillStyle = "#ecfeff";
      ctx.shadowColor = "rgba(73, 235, 220, 0.4)";
      ctx.shadowBlur = 20;
      const spaced = 2.2;
      const width = this.measureWithSpacing(T("brand"), size, spaced, 400);
      let tx = lo.title.x;
      if (align === "center") tx = lo.title.x;
      AG.Art.spacedText(ctx, T("brand"), tx, lo.title.y, spaced, align);
      ctx.restore();

      this.label(T("subtitle"), lo.sub.x, lo.sub.y, lo.sub.size, "rgba(146, 205, 213, 0.78)", lo.portrait ? 4.2 : 4.4, lo.portrait ? "center" : "left", 600);

      const lineY = lo.portrait ? lo.sub.y + 18 : lo.sub.y + 18;
      const lineW = lo.portrait ? Math.min(150, lo.cw * 0.46) : Math.min(190, lo.cw * 0.64);
      const lx = lo.portrait ? this.w / 2 - lineW / 2 : lo.sub.x;
      const grd = ctx.createLinearGradient(lx, 0, lx + lineW, 0);
      grd.addColorStop(0, "rgba(105,235,225,0.45)");
      grd.addColorStop(0.6, "rgba(105,235,225,0.12)");
      grd.addColorStop(1, "rgba(105,235,225,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(lx, lineY, lineW, 1);
    }

    toggleSound() {
      this.save.sound = !this.save.sound;
      AG.Audio.setSound(this.save.sound);
      this.persist();
      if (this.save.sound) AG.Audio.play("ui");
    }

    toggleMusic() {
      this.save.music = !this.save.music;
      AG.Audio.setMusic(this.save.music);
      this.persist();
      if (this.save.music) AG.Audio.play("ui");
    }

    /* ------------------------------- HUD ----------------------------- */

    drawHUD(ctx) {
      const g = this.game;
      const safe = this.safe;
      const w = this.w, h = this.h;
      const top = safe.top + 12;
      const left = safe.left + 14;
      const right = safe.right + 14;
      const bottom = h - safe.bottom - 12;

      if (g.state === "playing" && g.hp <= 1) {
        const pulse = 0.1 + 0.05 * Math.sin(this.time * 4);
        const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.72);
        vg.addColorStop(0, "rgba(255,40,60,0)");
        vg.addColorStop(1, "rgba(255,40,60," + pulse + ")");
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, w, h);
      }
      if (g.overload > 0) {
        ctx.save();
        ctx.globalAlpha = 0.3 + 0.14 * Math.sin(this.time * 18);
        ctx.strokeStyle = "#ff6a62";
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, w - 4, h - 4);
        ctx.restore();
      }

      let tg = ctx.createLinearGradient(0, 0, 0, 102);
      tg.addColorStop(0, "rgba(3, 7, 14, 0.66)");
      tg.addColorStop(0.7, "rgba(3, 7, 14, 0.24)");
      tg.addColorStop(1, "rgba(3, 7, 14, 0)");
      ctx.fillStyle = tg;
      ctx.fillRect(0, 0, w, 102);
      let bg = ctx.createLinearGradient(0, h - 88, 0, h);
      bg.addColorStop(0, "rgba(3, 7, 14, 0)");
      bg.addColorStop(1, "rgba(3, 7, 14, 0.8)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, h - 88, w, 88);

      this.label(T("wave"), left, top + 1, 8, "rgba(154, 205, 219, 0.88)", 2);
      this.text(AG.I18N.num(g.wave), left, top + 21, 24, "#e9fdff", { display: true });

      if (!g.boss && g.quota > 0) {
        const ratio = AG.clamp(g.spawned / g.quota, 0, 1);
        const barW = Math.min(110, w * 0.28);
        ctx.fillStyle = "rgba(130, 190, 210, 0.18)";
        ctx.fillRect(left, top + 41, barW, 3.5);
        ctx.fillStyle = "#6ff7df";
        ctx.fillRect(left, top + 41, barW * ratio, 3.5);
        ctx.fillStyle = "rgba(111, 247, 223, 0.32)";
        ctx.fillRect(left, top + 40, barW * ratio, 1);
        this.text(AG.I18N.num(g.spawned) + "/" + AG.I18N.num(g.quota), left + barW + 7, top + 42, 6.5, "rgba(152, 198, 210, 0.7)", { weight: 600 });
      }

      this.label(T("score"), w / 2, top + 1, 7.5, "rgba(154, 205, 219, 0.78)", 2, "center");
      let scoreSize = 29;
      const scoreText = AG.I18N.num(Math.floor(g.displayScore));
      while (scoreSize > 18 && this.measure(scoreText, scoreSize, 400, true) > w * 0.36) scoreSize -= 1;
      ctx.save();
      this.setFont(scoreSize, 400, true);
      ctx.fillStyle = "#f3feff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(85, 240, 225, 0.38)";
      ctx.shadowBlur = 14;
      ctx.fillText(scoreText, w / 2, top + 24);
      ctx.restore();

      if (g.combo > 1.02) {
        const cw = 66, ch = 18;
        const cx = w / 2 - cw / 2;
        const cy = top + 44;
        AG.Art.roundRect(ctx, cx, cy, cw, ch, 9);
        ctx.fillStyle = "rgba(38, 29, 11, 0.72)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 214, 128, 0.45)";
        ctx.lineWidth = 1;
        ctx.stroke();
        this.text("×" + AG.I18N.combo(g.combo), w / 2, cy + 9, 10.5, "#ffe3a0", { weight: 700, align: "center" });
        const ratio = AG.clamp(g.comboTimer / 4, 0, 1);
        ctx.fillStyle = "rgba(255, 207, 107, 0.5)";
        ctx.fillRect(cx + 8, cy + ch - 3, (cw - 16) * ratio, 1.4);
      }

      this.iconButton("hud_pause", "pause", w - right - 40, top - 2, 40, () => this.pauseGame(false), {
        disabled: this.adBusy || (g.state !== "playing" && g.state !== "countdown")
      });

      if (g.boss) {
        const bw = Math.min(430, Math.max(180, w - left - right - 120));
        const bx = w / 2 - bw / 2;
        const by = top + 76;
        this.label(T("bossName"), w / 2, by - 8, 7.5, "rgba(255, 173, 170, 0.9)", 2, "center");
        ctx.fillStyle = "rgba(255, 120, 120, 0.14)";
        ctx.fillRect(bx, by, bw, 5);
        const ratio = AG.clamp(g.boss.hp / g.boss.maxHp, 0, 1);
        const gb = ctx.createLinearGradient(bx, 0, bx + bw, 0);
        gb.addColorStop(0, "#ff7f6d");
        gb.addColorStop(1, "#ffcf6b");
        ctx.fillStyle = gb;
        ctx.fillRect(bx, by, bw * ratio, 5);
        ctx.strokeStyle = "rgba(255, 180, 150, 0.28)";
        ctx.lineWidth = 1;
        ctx.strokeRect(bx - 1, by - 1, bw + 2, 7);
      }

      if (g.invuln > 0 && g.state === "playing") {
        ctx.save();
        ctx.globalAlpha = 0.35 + 0.25 * Math.sin(this.time * 10);
        ctx.strokeStyle = "#8ffff2";
        ctx.lineWidth = 1.4;
        ctx.setLineDash([5, 7]);
        ctx.beginPath();
        ctx.arc(this.view.cx, this.view.cy, this.view.P + 9, 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      const hudPanelW = Math.min(226, w - left - right - 8);
      const hudY = bottom - 48;
      this.panel(left - 8, hudY, hudPanelW, 48, {
        radius: 12,
        top: "rgba(6, 17, 29, 0.6)",
        bottom: "rgba(4, 12, 22, 0.72)",
        border: "rgba(108, 195, 208, 0.14)",
        highlight: false
      });
      this.label(T("hull"), left + 2, hudY + 9, 7, "rgba(167, 209, 218, 0.86)", 1.4);
      for (let i = 0; i < g.maxHP; i++) {
        const ix = left + 10 + i * 19;
        const alive = i < g.hp;
        ctx.save();
        ctx.globalAlpha = alive ? 1 : 0.2;
        AG.Art.icon(ctx, "hull", ix, hudY + 23, 14, alive ? "#8ffff2" : "#87a5b5");
        ctx.restore();
      }

      const energyRatio = AG.clamp(g.energy / g.maxEnergy, 0, 1);
      const barW = Math.min(158, hudPanelW - 58);
      const barX = left + 16;
      const barY = hudY + 38;
      AG.Art.icon(ctx, "bolt", left + 6, barY + 1, 11, g.overload > 0 ? "#ff8a7a" : "#8ffff2");
      ctx.fillStyle = "rgba(110, 180, 200, 0.2)";
      ctx.fillRect(barX, barY - 1, barW, 4.5);
      const ecolor = g.overload > 0 ? "#ff6f66" : energyRatio < 0.25 ? "#ffb35f" : "#62eedd";
      ctx.fillStyle = ecolor;
      ctx.fillRect(barX, barY - 1, barW * energyRatio, 4.5);
      if (g.overload > 0) {
        ctx.save();
        ctx.globalAlpha = 0.3 + 0.3 * Math.sin(this.time * 16);
        ctx.fillStyle = "#ff7a6e";
        ctx.fillRect(barX, barY - 3, barW, 8);
        ctx.restore();
      }
      this.text(Math.round(energyRatio * 100) + "%", barX + barW + 7, barY + 1, 8.5, "rgba(199, 232, 239, 0.88)", { weight: 600 });

      if (g.controlHint > 0 && g.state === "playing" && w >= 620) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, g.controlHint / 1.5) * 0.8;
        this.label(AG.IS_TOUCH ? T("hintMobile") : T("hintDesktop"), w - right, bottom - 4, 9, "rgba(198, 228, 237, 0.9)", 0.7, "right");
        ctx.restore();
      }

      if (g.banner && g.state !== "countdown") this.drawBanner(ctx, g.banner);
      if (g.state === "countdown") this.drawCountdown(ctx, g);

      if (g.callout) this.drawCallout(ctx, g.callout, bottom);
    }

    drawBanner(ctx, banner) {
      const age = banner.maxLife - banner.life;
      const fadeIn = AG.clamp(age / 0.18, 0, 1);
      const fadeOut = AG.clamp(banner.life / 0.4, 0, 1);
      const alpha = Math.min(fadeIn, fadeOut);
      if (alpha <= 0) return;
      const w = this.w;
      const y = this.safe.top + (this.h < 520 ? 146 : 140) - (1 - fadeIn) * 8;
      ctx.save();
      ctx.globalAlpha = alpha;
      const size = this.sizeToFit(banner.title, w * 0.7, this.h < 520 ? 20 : 28, 14, true, 400);
      this.text(banner.title, w / 2, y, size, banner.color || "#e9feff", { display: true, align: "center" });
      if (banner.sub) {
        this.label(banner.sub, w / 2, y + size * 0.72, this.h < 520 ? 8 : 9.5, "rgba(183, 222, 231, 0.9)", 2.4, "center");
      }
      const lineW = Math.min(210, w * 0.32);
      const lg = ctx.createLinearGradient(w / 2 - lineW, 0, w / 2 + lineW, 0);
      lg.addColorStop(0, "rgba(126, 235, 226, 0)");
      lg.addColorStop(0.5, "rgba(126, 235, 226, 0.32)");
      lg.addColorStop(1, "rgba(126, 235, 226, 0)");
      ctx.fillStyle = lg;
      ctx.fillRect(w / 2 - lineW, y + size * 0.92, lineW * 2, 1);
      ctx.restore();
    }

    drawCallout(ctx, callout, bottom) {
      const alpha = AG.clamp(callout.life / 0.35, 0, 1) * AG.clamp((callout.maxLife - callout.life) / 0.15, 0, 1);
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      this.setFont(9, 700);
      const tw = this.measureWithSpacing(callout.text, 9, 1, 700);
      const bw = Math.min(this.w - 32, tw + 34);
      const bh = 25;
      const bx = this.w / 2 - bw / 2;
      const by = bottom - 84;
      AG.Art.roundRect(ctx, bx, by, bw, bh, 12.5);
      ctx.fillStyle = "rgba(4, 13, 23, 0.76)";
      ctx.fill();
      ctx.strokeStyle = AG.rgba(callout.color, 0.35);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = callout.color;
      AG.Art.spacedText(ctx, callout.text, this.w / 2, by + bh / 2, 1, "center");
      ctx.restore();
    }

    drawCountdown(ctx, g) {
      const n = Math.ceil(g.countdown);
      if (n <= 0) return;
      const cy = this.view.cy;
      const frac = AG.clamp(1 - g.countdown / 2.65, 0, 1);
      ctx.save();
      ctx.globalAlpha = 0.9;
      this.label(T("countdown"), this.w / 2, cy - 92, 11, "rgba(200, 242, 245, 0.86)", 4.4, "center");
      ctx.globalAlpha = 0.75;
      const size = 90;
      ctx.save();
      this.setFont(size, 400, true);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(233, 254, 255, 0.95)";
      ctx.shadowColor = "rgba(76, 235, 223, 0.55)";
      ctx.shadowBlur = 35;
      ctx.fillText(String(n), this.w / 2, cy + 6);
      ctx.restore();
      ctx.strokeStyle = "rgba(120, 240, 229, 0.14)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.w / 2, cy + 4, 74, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = "rgba(120, 240, 229, 0.72)";
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(this.w / 2, cy + 4, 74, -Math.PI / 2, -Math.PI / 2 + frac * TAU);
      ctx.stroke();
      this.label(AG.IS_TOUCH ? T("hintMobile") : T("hintDesktop"), this.w / 2, cy + 108, 8, "rgba(171, 210, 220, 0.66)", 1.2, "center");
      ctx.restore();
    }

    /* ------------------------------ pause ---------------------------- */

    drawPause(ctx) {
      const w = this.w, h = this.h, safe = this.safe;
      ctx.save();
      ctx.fillStyle = "rgba(3, 7, 14, 0.74)";
      ctx.fillRect(0, 0, w, h);
      const vg = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, Math.max(w, h) * 0.7);
      vg.addColorStop(0, "rgba(22, 70, 84, 0.12)");
      vg.addColorStop(1, "rgba(0, 0, 0, 0.5)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      const pw = Math.min(w - 28, 400);
      const ph = Math.min(h - 20, 356);
      const x = (w - pw) / 2;
      const y = (h - ph) / 2;
      this.panel(x, y, pw, ph, { radius: 22, glow: "#4ef0e2" });
      const g = this.game;
      this.text(T("pause"), w / 2, y + 34, 29, "#eafdff", { display: true, align: "center" });
      this.label(T("wave") + " " + g.wave + "  ·  " + T("score") + " " + AG.I18N.num(Math.floor(g.score)), w / 2, y + 61, 8, "rgba(164, 205, 216, 0.8)", 1.2, "center");

      this.button({
        id: "pause_resume", x: x + 20, y: y + 86, w: pw - 40, h: 50,
        style: "primary", icon: "play", label: T("resume"),
        labelSize: 15, onClick: () => this.resumeGame()
      });
      this.button({
        id: "pause_how", x: x + 20, y: y + 144, w: pw - 40, h: 42,
        style: "secondary", icon: "info", label: T("howToPlay"),
        labelSize: 11, onClick: () => this.openTutorial(null)
      });
      const colW = (pw - 48) / 2;
      this.button({
        id: "pause_restart", x: x + 20, y: y + 194, w: colW, h: 40,
        style: "secondary", icon: "refresh", label: T("restart"),
        labelSize: 9.5, onClick: () => this.openConfirm("restart")
      });
      this.button({
        id: "pause_menu", x: x + 28 + colW, y: y + 194, w: colW, h: 40,
        style: "ghost", icon: "back", label: T("menu"),
        labelSize: 9.5, onClick: () => this.openConfirm("leave")
      });

      const togglesY = y + ph - 54;
      this.iconButton("pause_sound", this.save.sound ? "sound" : "mute", w / 2 - 52, togglesY, 38, () => this.toggleSound(), { active: this.save.sound });
      this.iconButton("pause_music", this.save.music ? "music" : "mute", w / 2 + 14, togglesY, 38, () => this.toggleMusic(), { active: this.save.music });
      this.label(T("sound"), w / 2 - 33, togglesY + 50, 6.5, "rgba(149, 190, 203, 0.75)", 0.7, "center");
      this.label(T("music"), w / 2 + 33, togglesY + 50, 6.5, "rgba(149, 190, 203, 0.75)", 0.7, "center");
    }

    /* ------------------------------- over ---------------------------- */

    drawOver(ctx) {
      const w = this.w, h = this.h;
      const death = this.death;
      if (!death) return;
      ctx.save();
      ctx.fillStyle = "rgba(3, 7, 13, 0.8)";
      ctx.fillRect(0, 0, w, h);
      const vg = ctx.createRadialGradient(w / 2, h * 0.45, 50, w / 2, h * 0.45, Math.max(w, h) * 0.72);
      vg.addColorStop(0, "rgba(92, 23, 37, 0.2)");
      vg.addColorStop(1, "rgba(0, 0, 0, 0.45)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      const twoCol = h < 520 && w >= 620;
      const compact = h < 660;
      const pw = twoCol ? Math.min(w - 20, 720) : Math.min(w - 24, compact ? 500 : 546);
      const ph = twoCol ? Math.min(h - 16, 300) : Math.min(h - 24, compact ? 466 : 486);
      const x = (w - pw) / 2;
      const y = (h - ph) / 2;
      this.panel(x, y, pw, ph, { radius: 24, border: "rgba(255, 137, 124, 0.24)", glow: "#ff6f68" });
      AG.Art.drawGlow(ctx, "#ff5b63", x + pw / 2, y + 2, pw * 0.5, 0.18);

      if (twoCol) {
        this.drawOverWide(ctx, x, y, pw, ph, death);
        return;
      }

      const cx = x + pw / 2;
      const pad = 22;
      const innerW = pw - pad * 2;
      let cursor = y + (compact ? 24 : 28);

      this.label(T("results"), cx, cursor, 8, "rgba(255, 167, 158, 0.72)", 4, "center");
      cursor += compact ? 22 : 25;
      const titleSize = this.sizeToFit(T("gameOver"), innerW, compact ? 20 : 24, 14, true, 400);
      this.text(T("gameOver"), cx, cursor, titleSize, "#ffd0c7", { display: true, align: "center" });
      cursor += compact ? 28 : 34;

      this.label(T("score"), cx, cursor, 7, "rgba(158, 198, 209, 0.8)", 2, "center");
      cursor += compact ? 27 : 31;
      const scoreSize = this.sizeToFit(AG.I18N.num(death.score), innerW * 0.8, compact ? 38 : 48, 24, true, 400);
      this.text(AG.I18N.num(death.score), cx, cursor, scoreSize, "#f5feff", { display: true, align: "center" });
      cursor += compact ? 27 : 31;

      if (this.newRecord) {
        const bw = Math.min(190, innerW * 0.6), bh = 20;
        AG.Art.roundRect(ctx, cx - bw / 2, cursor - 10, bw, bh, 10);
        ctx.fillStyle = "rgba(255, 207, 107, 0.12)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 207, 107, 0.48)";
        ctx.lineWidth = 1;
        ctx.stroke();
        this.label("★ " + T("newRecord"), cx, cursor, 7.5, "#ffd98a", 1.6, "center");
      } else {
        this.label(T("best") + ": " + AG.I18N.num(this.save.best || 0), cx, cursor, 8, "rgba(160, 198, 209, 0.75)", 1.4, "center");
      }
      cursor += compact ? 26 : 29;

      const statsH = compact ? 42 : 48;
      this.panel(x + pad, cursor, innerW, statsH, { radius: 12, border: "rgba(111, 190, 208, 0.14)" });
      const stats = [
        { v: AG.I18N.num(death.wave), l: T("wave") },
        { v: AG.I18N.num(death.stats.blocked), l: T("blocked") },
        { v: AG.I18N.num(death.stats.crystals), l: T("crystals") },
        { v: AG.I18N.num(death.stats.perfect), l: T("ideal") }
      ];
      const colW = innerW / 4;
      for (let i = 0; i < 4; i++) {
        const sx = x + pad + colW * (i + 0.5);
        if (i > 0) {
          ctx.fillStyle = "rgba(110, 175, 195, 0.12)";
          ctx.fillRect(x + pad + colW * i, cursor + 9, 1, statsH - 18);
        }
        this.text(stats[i].v, sx, cursor + statsH * 0.37, statsH * 0.4, "#e9fcff", { display: true, align: "center" });
        this.label(stats[i].l, sx, cursor + statsH * 0.78, 7, "rgba(166, 204, 215, 0.85)", 0.7, "center");
      }
      cursor += statsH + (compact ? 8 : 10);

      const dustH = compact ? 36 : 40;
      const stackX2 = innerW < 340 && this.pendingGain > 0 && !this.adDoubled;
      this.panel(x + pad, cursor, innerW, dustH, { radius: 10, border: "rgba(255, 207, 107, 0.16)" });
      AG.Art.icon(ctx, "spark", x + pad + 17, cursor + dustH / 2, 15, "#ffd98a");
      this.label(T("dustEarned"), x + pad + 33, cursor + dustH * 0.32, 8, "rgba(206, 219, 190, 0.9)", 0.9);
      this.text("+" + AG.I18N.num(this.pendingGain), x + pad + 33, cursor + dustH * 0.7, 17, "#ffe3a0", { weight: 700 });
      if (!stackX2 && this.pendingGain > 0 && !this.adDoubled) {
        this.button({
          id: "over_x2", x: x + pad + innerW - 172, y: cursor + 5, w: 164, h: dustH - 10,
          style: "gold", icon: "ad", label: T("watchAdX2"), labelSize: 9,
          disabled: this.adBusy, onClick: () => this.watchAd("dust")
        });
      } else if (this.adDoubled) {
        this.label("✓ ×2", x + pad + innerW - 16, cursor + dustH / 2, 10, "#ffd98a", 1.2, "right");
      }
      cursor += dustH + (compact ? 8 : 10);
      if (stackX2) {
        this.button({
          id: "over_x2", x: x + pad, y: cursor, w: innerW, h: 32,
          style: "gold", icon: "ad", label: T("watchAdX2"), labelSize: 9,
          disabled: this.adBusy, onClick: () => this.watchAd("dust")
        });
        cursor += 40;
      }

      if (!this.reviveUsed) {
        this.button({
          id: "over_revive", x: x + pad, y: cursor, w: innerW, h: compact ? 44 : 48,
          style: "secondary", icon: "ad", label: T("reviveAd"), sub: T("adRewardNote"),
          labelSize: 10.5, disabled: this.adBusy,
          onClick: () => this.watchAd("revive")
        });
        cursor += (compact ? 44 : 48) + (compact ? 8 : 10);
      }

      this.button({
        id: "over_again", x: x + pad, y: cursor, w: innerW, h: compact ? 46 : 50,
        style: "primary", icon: "refresh", label: T("playAgain"),
        labelSize: 15, disabled: this.adBusy, onClick: () => this.startNewRun()
      });
      cursor += (compact ? 46 : 50) + (compact ? 7 : 9);
      this.button({
        id: "over_menu", x: x + pad, y: cursor, w: innerW, h: compact ? 36 : 38,
        style: "ghost", icon: "back", label: T("menu"),
        labelSize: 10, disabled: this.adBusy, onClick: () => this.goMenu()
      });

      if (this.adBusy) {
        this.label(T("adLoading"), cx, y + ph - 13, 7, "rgba(255, 217, 138, 0.8)", 1.2, "center");
      }
    }

    drawOverWide(ctx, x, y, pw, ph, death) {
      const pad = 22;
      const leftW = pw * 0.54;
      const leftX = x + pad;
      const rightX = x + pw - 270;
      const rightW = 248;
      let cy = y + 26;
      this.label(T("results"), leftX, cy, 8, "rgba(255, 167, 158, 0.72)", 3);
      cy += 22;
      const titleSize = this.sizeToFit(T("gameOver"), leftW - 30, 23, 15, true, 400);
      this.text(T("gameOver"), leftX, cy, titleSize, "#ffd0c7", { display: true });
      cy += 26;
      this.label(T("score"), leftX, cy, 7, "rgba(158, 198, 209, 0.8)", 1.6);
      cy += 20;
      this.text(AG.I18N.num(death.score), leftX, cy + 8, 38, "#f5feff", { display: true });
      cy += 28;
      if (this.newRecord) this.label("★ " + T("newRecord"), leftX, cy, 8, "#ffd98a", 1.2);
      else this.label(T("best") + ": " + AG.I18N.num(this.save.best || 0), leftX, cy, 8, "rgba(160, 198, 209, 0.75)", 1.2);
      cy += 24;

      this.panel(leftX, cy, leftW - 14, 50, { radius: 10, border: "rgba(111, 190, 208, 0.14)" });
      const stats = [
        { v: AG.I18N.num(death.wave), l: T("wave") },
        { v: AG.I18N.num(death.stats.blocked), l: T("blocked") },
        { v: AG.I18N.num(death.stats.crystals), l: T("crystals") },
        { v: AG.I18N.num(death.stats.perfect), l: T("ideal") }
      ];
      const cw = (leftW - 14) / 4;
      for (let i = 0; i < 4; i++) {
        const sx = leftX + cw * (i + 0.5);
        if (i > 0) {
          ctx.fillStyle = "rgba(110, 175, 195, 0.12)";
          ctx.fillRect(leftX + cw * i, cy + 9, 1, 32);
        }
        this.text(stats[i].v, sx, cy + 18, 15, "#e9fcff", { display: true, align: "center" });
        this.label(stats[i].l, sx, cy + 37, 5.5, "rgba(150, 190, 202, 0.75)", 0.6, "center");
      }
      cy += 62;

      this.panel(leftX, cy, leftW - 14, 40, { radius: 10, border: "rgba(255, 207, 107, 0.16)" });
      AG.Art.icon(ctx, "spark", leftX + 16, cy + 20, 14, "#ffd98a");
      this.label(T("dustEarned"), leftX + 31, cy + 12, 6, "rgba(184, 195, 170, 0.8)", 0.8);
      this.text("+" + AG.I18N.num(this.pendingGain), leftX + 31, cy + 28, 14, "#ffe3a0", { weight: 700 });
      if (this.adDoubled) this.label("✓ ×2", leftX + leftW - 26, cy + 20, 9, "#ffd98a", 0.8, "right");

      let by = y + 46;
      if (!this.reviveUsed) {
        this.button({
          id: "over_revive", x: rightX, y: by, w: rightW, h: 52,
          style: "secondary", icon: "ad", label: T("reviveAd"), sub: T("adRewardNote"),
          labelSize: 10, disabled: this.adBusy, onClick: () => this.watchAd("revive")
        });
        by += 60;
      }
      this.button({
        id: "over_again", x: rightX, y: by, w: rightW, h: 48,
        style: "primary", icon: "refresh", label: T("playAgain"),
        labelSize: 14, disabled: this.adBusy, onClick: () => this.startNewRun()
      });
      by += 56;
      this.button({
        id: "over_menu", x: rightX, y: by, w: rightW, h: 38,
        style: "ghost", icon: "back", label: T("menu"),
        labelSize: 10, disabled: this.adBusy, onClick: () => this.goMenu()
      });
      by += 46;
      if (this.pendingGain > 0 && !this.adDoubled) {
        this.button({
          id: "over_x2", x: rightX, y: by, w: rightW, h: 34,
          style: "gold", icon: "ad", label: T("watchAdX2"), labelSize: 8.5,
          disabled: this.adBusy, onClick: () => this.watchAd("dust")
        });
      }
      if (this.adBusy) {
        this.label(T("adLoading"), x + pw / 2, y + ph - 14, 7, "rgba(255, 217, 138, 0.8)", 1.2, "center");
      }
    }

    /* ----------------------------- modals ---------------------------- */

    drawModal(ctx) {
      const m = this.modal;
      if (!m) return;
      const t = AG.clamp(m.t || 0, 0, 1);
      ctx.save();
      ctx.globalAlpha = AG.easeOutCubic(t);
      ctx.fillStyle = "rgba(2, 6, 13, 0.78)";
      ctx.fillRect(0, 0, this.w, this.h);
      if (m.type === "tutorial") this.drawTutorialModal(ctx);
      else if (m.type === "daily") this.drawDailyModal(ctx);
      else if (m.type === "confirm") this.drawConfirmModal(ctx);
      ctx.restore();
    }

    drawTutorialModal(ctx) {
      const w = this.w, h = this.h;
      const cols = w >= 640 ? 2 : 1;
      const compact = h < 560;
      const pw = Math.min(w - 24, cols === 2 ? 640 : 430);
      const steps = [
        { icon: "target", color: "#8ffff2", title: T("tut1t"), desc: T("tut1d") },
        { icon: "hull", color: "#8ffff2", title: T("tut2t"), desc: T("tut2d") },
        { icon: "spark", color: "#8dffb0", title: T("tut3t"), desc: T("tut3d") },
        { icon: "warning", color: "#ff9a8d", title: T("tut4t"), desc: T("tut4d") }
      ];
      let cellH = cols === 2 ? (compact ? 88 : 104) : (compact ? 70 : 78);
      const headerH = compact ? 46 : 60;
      const buttonH = compact ? 38 : 44;
      const pad = compact ? 16 : 22;
      const gap = compact ? 7 : 10;
      const rows = Math.ceil(steps.length / cols);
      let ph = pad * 2 + headerH + rows * cellH + (rows - 1) * gap + buttonH + 12;
      const maxPh = h - 16;
      if (ph > maxPh) {
        cellH -= (ph - maxPh) / rows;
        ph = maxPh;
      }
      const x = (w - pw) / 2;
      const y = (h - ph) / 2;
      this.panel(x, y, pw, ph, { radius: 22, glow: "#4ef0e2" });
      this.iconButton("modal_close", "close", x + pw - 40, y + 10, 30, () => this.closeModal(false), { layer: "modal" });
      this.text(T("tutorialTitle"), x + pad + 2, y + pad + 12, compact ? 20 : 24, "#ecfeff", { display: true });
      this.label(T("subtitle"), x + pad + 3, y + pad + (compact ? 32 : 38), 7.4, "rgba(150, 201, 212, 0.85)", 2.2);

      const gridTop = y + pad + headerH;
      const cw = (pw - pad * 2 - (cols - 1) * gap) / cols;
      for (let i = 0; i < steps.length; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = x + pad + col * (cw + gap);
        const cy = gridTop + row * (cellH + gap);
        const s = steps[i];
        this.panel(cx, cy, cw, cellH, {
          radius: 12,
          top: "rgba(12, 28, 46, 0.62)",
          bottom: "rgba(7, 17, 31, 0.68)",
          border: "rgba(104, 190, 212, 0.12)",
          highlight: false
        });
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx + 23, cy + 23, 14, 0, TAU);
        ctx.fillStyle = AG.rgba(s.color, 0.08);
        ctx.fill();
        ctx.strokeStyle = AG.rgba(s.color, 0.24);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
        AG.Art.icon(ctx, s.icon, cx + 23, cy + 23, 16, s.color);
        this.label(s.title, cx + 44, cy + 17, compact ? 9 : 10, "#e9fdff", 0.8);
        ctx.save();
        this.setFont(compact ? 9.3 : 10.1, 500);
        ctx.fillStyle = "rgba(181, 216, 225, 0.92)";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        AG.Art.wrap(ctx, s.desc, cx + 44, cy + 32, cw - 55, compact ? 11.5 : 12.5, 3);
        ctx.restore();
      }
      const bw = Math.min(250, pw - pad * 2);
      this.button({
        id: "modal_tut_ok", x: x + (pw - bw) / 2, y: y + ph - buttonH - pad + 4,
        w: bw, h: buttonH, style: "primary", icon: "play",
        label: this.modal && this.modal.after ? T("start") : T("gotIt"),
        labelSize: compact ? 12 : 14, layer: "modal",
        onClick: () => this.closeModal(false)
      });
    }

    drawDailyModal(ctx) {
      const w = this.w, h = this.h;
      const pw = Math.min(w - 24, 380);
      const compact = h < 560;
      const ph = Math.min(h - 20, compact ? 300 : 330);
      const x = (w - pw) / 2;
      const y = (h - ph) / 2;
      const available = AG.dailyAvailable(this.save);
      const streak = available ? AG.nextDailyStreak(this.save) : Math.max(1, this.save.daily.streak || 1);
      const amount = AG.dailyReward(streak);
      this.panel(x, y, pw, ph, { radius: 22, border: "rgba(255, 207, 107, 0.3)", glow: "#ffcf6b" });
      this.iconButton("modal_close", "close", x + pw - 40, y + 10, 30, () => this.closeModal(true), { layer: "modal" });
      const dailyTitleSize = this.sizeToFit(T("dailyTitle"), pw - 92, 19, 13, true, 400);
      this.text(T("dailyTitle"), x + 20 + (pw - 40) / 2, y + 28, dailyTitleSize, "#ffe9bd", { display: true, align: "center" });
      const gy = y + 82;
      AG.Art.drawGlow(ctx, "#ffcf6b", x + pw / 2, gy, 64, 0.4);
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + pw / 2, gy, 34, 0, TAU);
      const gg = ctx.createLinearGradient(x + pw / 2 - 34, gy - 34, x + pw / 2 + 34, gy + 34);
      gg.addColorStop(0, "rgba(255, 225, 157, 0.22)");
      gg.addColorStop(1, "rgba(120, 73, 18, 0.3)");
      ctx.fillStyle = gg;
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 215, 130, 0.5)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();
      AG.Art.icon(ctx, "gift", x + pw / 2, gy, 34, "#ffe1a0");
      if (available) {
        for (let i = 0; i < 6; i++) {
          const a = this.time * 0.8 + i * 1.05;
          AG.Art.drawGlow(ctx, "#ffe3a0", x + pw / 2 + Math.cos(a) * 52, gy + Math.sin(a) * 30, 4, 0.35);
        }
      }
      const textY = gy + 50;
      ctx.save();
      this.setFont(compact ? 9 : 9.6, 500);
      ctx.fillStyle = "rgba(166, 199, 209, 0.86)";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      AG.Art.wrap(ctx, T("dailyText"), x + pw / 2, textY, pw - 56, 13, 2);
      ctx.restore();

      const chipY = textY + (compact ? 31 : 34);
      const chipW = 176;
      this.panel(x + pw / 2 - chipW / 2, chipY, chipW, 24, { radius: 12, border: "rgba(111, 196, 204, 0.16)" });
      this.label(T("dailyStreak", { n: AG.I18N.num(streak) }), x + pw / 2, chipY + 12, 7, "rgba(171, 216, 224, 0.9)", 1.2, "center");
      this.label(available ? T("dailyAmount", { n: AG.I18N.num(amount) }) : T("dailyClaimed"), x + pw / 2, chipY + 48, 16, "#ffe3a0", 1, "center", 700);

      const bh = compact ? 42 : 46;
      this.button({
        id: "modal_daily_claim", x: x + 20, y: y + ph - bh - 18, w: pw - 40, h: bh,
        style: available ? "gold" : "secondary", icon: available ? "gift" : "check",
        label: available ? T("dailyClaim") : T("dailyTomorrow"),
        labelSize: 12, disabled: !available, layer: "modal",
        onClick: () => this.claimDaily()
      });
    }

    drawConfirmModal(ctx) {
      const w = this.w, h = this.h;
      const pw = Math.min(w - 24, 420);
      const ph = Math.min(h - 20, 236);
      const x = (w - pw) / 2;
      const y = (h - ph) / 2;
      this.panel(x, y, pw, ph, { radius: 20, border: "rgba(255, 137, 124, 0.2)" });
      this.iconButton("modal_close", "close", x + pw - 38, y + 8, 28, () => this.closeModal(true), { layer: "modal" });
      const m = this.modal;
      this.text(m.title, x + 22, y + 36, this.sizeToFit(m.title, pw - 70, 19, 13, true, 400), "#ffe2da", { display: true });
      ctx.save();
      this.setFont(9.5, 500);
      ctx.fillStyle = "rgba(171, 203, 212, 0.88)";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      AG.Art.wrap(ctx, m.note, x + 22, y + 58, pw - 44, 14, 4);
      ctx.restore();
      const bw = (pw - 54) / 2;
      this.button({
        id: "modal_no", x: x + 22, y: y + ph - 60, w: bw, h: 40,
        style: "secondary", label: m.no, labelSize: 10, layer: "modal",
        onClick: () => this.closeModal(true)
      });
      this.button({
        id: "modal_yes", x: x + 32 + bw, y: y + ph - 60, w: bw, h: 40,
        style: m.danger ? "danger" : "primary", label: m.yes, labelSize: 10, layer: "modal",
        onClick: () => {
          const action = this.modal && this.modal.action;
          this.modal = null;
          this.safeCall(action);
        }
      });
    }

    /* ----------------------------- toasts ---------------------------- */

    drawToasts(ctx) {
      if (!this.toasts.length) return;
      const w = this.w, h = this.h, safe = this.safe;
      const tw = Math.min(320, w - 28);
      const th = 54;
      const inGame = this.screen === "game";
      const atBottom = inGame || this.screen === "menu" || this.screen === "upgrades" ||
        this.screen === "awards" || this.screen === "leaderboard" || this.screen === "settings" ||
        this.screen === "boot";
      const fromTop = !atBottom;
      let baseY;
      if (inGame) {
        baseY = h - safe.bottom - (this.game.callout ? 142 : 98);
      } else if (atBottom) {
        baseY = h - safe.bottom - 82;
      } else {
        baseY = safe.top + 12 + th;
      }
      for (let i = 0; i < this.toasts.length; i++) {
        const t = this.toasts[this.toasts.length - 1 - i];
        const age = t.maxLife - t.life;
        const alpha = Math.min(1, age * 5, t.life * 2.2);
        if (alpha <= 0) continue;
        const slide = (1 - Math.min(1, age * 5)) * 10;
        const y = baseY + (fromTop ? i * (th + 8) : -i * (th + 8)) + slide;
        const x = (w - tw) / 2;
        ctx.save();
        ctx.globalAlpha = alpha;
        this.panel(x, y - th, tw, th, {
          radius: 14,
          border: "rgba(126, 218, 224, 0.22)",
          top: "rgba(10, 25, 43, 0.94)",
          bottom: "rgba(5, 15, 28, 0.96)"
        });
        ctx.beginPath();
        ctx.arc(x + 27, y - th / 2, 15, 0, TAU);
        ctx.fillStyle = "rgba(8, 22, 34, 0.8)";
        ctx.fill();
        ctx.strokeStyle = AG.rgba(t.color, 0.35);
        ctx.lineWidth = 1;
        ctx.stroke();
        AG.Art.icon(ctx, t.icon, x + 27, y - th / 2, 16, t.color);
        this.label(t.title, x + 50, y - th + 19, 6.8, AG.rgba(t.color, 0.9), 1.2);
        let sub = t.sub;
        if (sub) {
          ctx.save();
          this.setFont(10.3, 600);
          const maxW = tw - 64;
          while (ctx.measureText(sub).width > maxW && sub.length > 4) sub = sub.slice(0, -2) + "…";
          ctx.fillStyle = "#e2f7ff";
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(sub, x + 50, y - th + 35);
          ctx.restore();
        }
        ctx.fillStyle = AG.rgba(t.color, 0.5);
        ctx.fillRect(x + 12, y - 3, (tw - 24) * AG.clamp(t.life / t.maxLife, 0, 1), 1.2);
        ctx.restore();
      }
    }

    /* ---------------------------- metagame --------------------------- */

    hitArea(id, x, y, w, h, onClick) {
      this.buttons.push({ id: id, x: x, y: y, w: w, h: h, layer: "base", onClick: onClick });
    }

    drawMetaHeader(ctx, title, sub, showDust) {
      const w = this.w, safe = this.safe;
      const top = safe.top + 14;
      const compact = w < 390;
      this.iconButton("meta_back", "back", safe.left + 10, top + 2, 40, () => this.switchScreen("menu"));
      const titleX = safe.left + 62;
      this.text(title, titleX, top + 12, compact ? 17 : 20, "#e9fcff", { display: true });
      if (sub) this.label(sub, titleX + 1, top + 32, compact ? 6.5 : 7.2, "rgba(139, 187, 200, 0.82)", 1.2);
      if (showDust) {
        const cw = compact ? 108 : 128;
        this.chip(w - safe.right - 12 - cw, top + 2, cw, 30, "spark", null, AG.I18N.num(this.dustShown), "#8ffff2");
      }
      const lineY = top + 49;
      const lg = ctx.createLinearGradient(safe.left + 10, 0, w - safe.right - 10, 0);
      lg.addColorStop(0, "rgba(105, 215, 220, 0.28)");
      lg.addColorStop(0.7, "rgba(105, 215, 220, 0.08)");
      lg.addColorStop(1, "rgba(105, 215, 220, 0)");
      ctx.fillStyle = lg;
      ctx.fillRect(safe.left + 10, lineY, w - safe.left - safe.right - 20, 1);
      return safe.top + 66;
    }

    drawUpgrades(ctx) {
      const w = this.w, h = this.h, safe = this.safe;
      const top = this.drawMetaHeader(ctx, T("upgradesTitle"), T("upgradesSub"), true);
      const contentW = Math.min(w - 28, 820);
      const x = (w - contentW) / 2;
      const gap = h < 520 ? 5 : 8;
      const availH = h - top - safe.bottom - 16;
      const rowH = Math.min(108, Math.max(44, (availH - gap * 4) / 5));
      const groupH = rowH * 5 + gap * 4;
      const startY = top + Math.max(0, (availH - groupH) / 2);
      const hideDesc = rowH < 64;
      const buyW = Math.min(122, contentW * 0.28);
      const buyH = Math.min(38, rowH - 14);

      for (let i = 0; i < AG.UPGRADE_ORDER.length; i++) {
        const key = AG.UPGRADE_ORDER[i];
        const def = AG.UPGRADES[key];
        const lvl = this.save.upgrades[key] || 0;
        const maxed = lvl >= def.max;
        const cost = maxed ? 0 : def.costs[lvl];
        const y = startY + i * (rowH + gap);
        const cy = y + rowH / 2;
        const flash = this.upgradeFlash && this.upgradeFlash.key === key ? this.upgradeFlash.time : 0;
        this.panel(x, y, contentW, rowH, {
          radius: 14,
          border: maxed ? "rgba(255, 207, 107, 0.24)" : flash > 0 ? "rgba(126, 246, 226, 0.55)" : "rgba(105, 185, 210, 0.16)",
          glow: flash > 0 ? "#4ef0e2" : null
        });
        if (flash > 0) {
          ctx.save();
          ctx.globalAlpha = flash * 0.22;
          AG.Art.drawGlow(ctx, "#4ef0e2", x + 40, cy, rowH * 1.2, 0.6);
          ctx.restore();
        }
        const iconName = key === "cap" ? "bolt" : key === "regen" ? "refresh" : key === "width" ? "target" : key === "hull" ? "hull" : "spark";
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + 30, cy, Math.min(18, rowH * 0.27), 0, TAU);
        ctx.fillStyle = "rgba(66, 236, 220, 0.07)";
        ctx.fill();
        ctx.strokeStyle = "rgba(94, 235, 220, 0.22)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
        AG.Art.icon(ctx, iconName, x + 30, cy, Math.min(19, rowH * 0.32), maxed ? "#ffd98a" : "#8ffff2");

        const textX = x + 54;
        const name = T("up" + key.charAt(0).toUpperCase() + key.slice(1));
        const nameSize = this.sizeToFit(name, contentW - buyW - 120, hideDesc ? 11 : 13, 8, false, 700);
        this.label(name, textX, cy - (hideDesc ? 7 : 13), nameSize, "#e8fbff", 0.9);
        const pipY = cy + (hideDesc ? 7 : 3);
        for (let p = 0; p < def.max; p++) {
          const px = textX + p * 16;
          AG.Art.roundRect(ctx, px, pipY, 12, 4.5, 2.2);
          ctx.fillStyle = p < lvl ? "#6ff7df" : "rgba(120, 190, 205, 0.3)";
          ctx.fill();
        }
        this.text(AG.I18N.num(lvl) + " / " + AG.I18N.num(def.max), textX + def.max * 16 + 4, pipY + 2.5, 7.8, "rgba(169, 210, 220, 0.85)", { weight: 600 });
        if (!hideDesc) {
          let a = AG.Meta.effect(key, lvl);
          let b = AG.Meta.effect(key, Math.min(def.max, lvl + 1));
          if (maxed) a = b = AG.Meta.effect(key, def.max);
          const descKey = "up" + key.charAt(0).toUpperCase() + key.slice(1) + "D";
          const desc = T(descKey, { a: AG.I18N.num(a), b: AG.I18N.num(b) });
          ctx.save();
          this.setFont(10.2, 500);
          ctx.fillStyle = "rgba(170, 210, 220, 0.85)";
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          let out = desc;
          while (ctx.measureText(out).width > contentW - buyW - 100 && out.length > 8) out = out.slice(0, -2) + "…";
          ctx.fillText(out, textX, cy + 22);
          ctx.restore();
        }

        if (maxed) {
          const bw = Math.min(90, buyW - 8);
          this.panel(x + contentW - bw - 16, cy - 13, bw, 26, { radius: 13, border: "rgba(255, 207, 107, 0.3)" });
          this.label(T("max"), x + contentW - bw / 2 - 16, cy, 8, "#ffd98a", 1.2, "center");
        } else {
          const insufficient = (this.save.dust || 0) < cost;
          this.button({
            id: "buy_" + key,
            x: x + contentW - buyW - 16, y: cy - buyH / 2, w: buyW, h: buyH,
            style: "secondary", insufficient: insufficient,
            label: T("buy") + "  " + AG.I18N.num(cost),
            labelSize: hideDesc ? 9 : 10,
            onClick: () => this.buyUpgrade(key)
          });
        }
      }
    }

    drawAwards(ctx) {
      const w = this.w, h = this.h, safe = this.safe;
      let unlocked = 0;
      for (let i = 0; i < AG.ACHIEVEMENTS.length; i++) {
        if (this.save.achievements[AG.ACHIEVEMENTS[i].id]) unlocked++;
      }
      const sub = T("awardsSub") + "  ·  " + T("awardsProgress", { a: AG.I18N.num(unlocked), b: AG.I18N.num(AG.ACHIEVEMENTS.length) });
      const top = this.drawMetaHeader(ctx, T("awardsTitle"), sub, true);
      const contentW = Math.min(w - 28, 820);
      const x = (w - contentW) / 2;
      const availH = h - top - safe.bottom - 12;
      let cols = 1;
      if (w < 380) cols = 1;
      else if (h < 620) cols = 2;
      else if (w >= 760) cols = 2;
      const rows = Math.ceil(AG.ACHIEVEMENTS.length / cols);
      const gap = h < 520 ? 5 : 8;
      const rowH = Math.min(112, Math.max(40, (availH - gap * (rows - 1)) / rows));
      const hideDesc = rowH < 66 || (cols === 2 && w < 760);
      const cardW = (contentW - gap * (cols - 1)) / cols;
      const groupH = rowH * rows + gap * (rows - 1);
      const startY = top + Math.max(0, (availH - groupH) * 0.35);

      for (let i = 0; i < AG.ACHIEVEMENTS.length; i++) {
        const a = AG.ACHIEVEMENTS[i];
        const got = !!this.save.achievements[a.id];
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = x + col * (cardW + gap);
        const cy = startY + row * (rowH + gap);
        ctx.save();
        if (!got) ctx.globalAlpha = 0.6;
        this.panel(cx, cy, cardW, rowH, {
          radius: 12,
          border: got ? "rgba(255, 207, 107, 0.24)" : "rgba(100, 170, 190, 0.12)",
          top: got ? "rgba(35, 29, 16, 0.84)" : "rgba(9, 22, 38, 0.88)",
          bottom: got ? "rgba(18, 17, 11, 0.92)" : "rgba(5, 14, 26, 0.93)",
          highlight: false
        });
        const iy = cy + Math.min(24, rowH / 2);
        const ix = cx + 24;
        ctx.beginPath();
        ctx.arc(ix, iy, 15, 0, TAU);
        ctx.fillStyle = got ? "rgba(255, 207, 107, 0.1)" : "rgba(90, 130, 150, 0.08)";
        ctx.fill();
        ctx.strokeStyle = got ? "rgba(255, 207, 107, 0.36)" : "rgba(120, 160, 180, 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();
        AG.Art.icon(ctx, got ? "medal" : "lock", ix, iy, 17, got ? "#ffd98a" : "#91adbb");
        const name = T("ach_" + a.id + "_n");
        const nameSize = this.sizeToFit(name, cardW - 86, hideDesc ? 9.5 : 10.5, 6.5, false, 700);
        this.label(name, cx + 46, cy + (hideDesc ? rowH * 0.37 : 19), nameSize, got ? "#ffeac3" : "#dceef5", 0.6);
        if (!hideDesc) {
          ctx.save();
          this.setFont(9, 500);
          ctx.fillStyle = "rgba(170, 207, 217, 0.86)";
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          AG.Art.wrap(ctx, T("ach_" + a.id + "_d"), cx + 46, cy + 33, cardW - 62, 11.5, 2);
          ctx.restore();
        }
        this.label("+" + AG.I18N.num(a.reward), cx + cardW - 14, cy + rowH - (hideDesc ? 12 : 15), 8, got ? "#ffd98a" : "rgba(166, 202, 213, 0.8)", 0.5, "right");
        this.label(got ? T("aUnlocked") : T("aLocked"), cx + cardW - 14, cy + (hideDesc ? 13 : 15), 6.2, got ? "rgba(255, 217, 138, 0.75)" : "rgba(156, 193, 205, 0.65)", 0.3, "right");
        ctx.restore();
      }
    }

    drawLeaderboard(ctx) {
      const w = this.w, h = this.h, safe = this.safe;
      const top = this.drawMetaHeader(ctx, T("lbTitle"), T("lbSub"), true);
      const contentW = Math.min(w - 24, 660);
      const x = (w - contentW) / 2;
      const available = h - top - safe.bottom - 14;
      const showLogin = this.sdkActive && !this.sdkAuthorized;
      const ctaH = showLogin ? 72 : 0;
      const status = this.lb.status;
      const listStatus = status === "ok" || status === "empty";
      const panelH = h < 520 ? available : Math.min(available, listStatus ? (showLogin ? 648 : 580) : 380);
      const panelY = top + Math.max(0, (available - panelH) / 2);
      this.panel(x, panelY, contentW, panelH, { radius: 20 });

      const self = this;
      const entries = this.lb.entries || [];
      const selfEntry = entries.filter(function (e) {
        try {
          if (e.player && e.player.uniqueID && self.playerId && e.player.uniqueID === self.playerId) return true;
        } catch (err) { /* noop */ }
        return self.sdkAuthorized && self.lb.userRank > 0 && e.rank === self.lb.userRank;
      })[0];

      this.label(T("lbTop"), x + 18, panelY + 24, 8, "rgba(180, 222, 231, 0.9)", 2);
      this.label(T("best") + ": " + AG.I18N.num(this.save.best || 0), x + contentW - 18, panelY + 24, 8, "#ffd98a", 1.1, "right");
      ctx.fillStyle = "rgba(105, 195, 210, 0.16)";
      ctx.fillRect(x + 18, panelY + 38, contentW - 36, 1);

      const listTop = panelY + 48;
      const listH = panelH - 48 - ctaH - 8;

      if (status === "loading" || status === "idle") {
        const cy = listTop + listH / 2 - 8;
        ctx.save();
        ctx.translate(x + contentW / 2, cy);
        ctx.rotate(this.time * 3);
        ctx.strokeStyle = "rgba(111, 247, 223, 0.25)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 19, 0, TAU);
        ctx.stroke();
        ctx.strokeStyle = "#6ff7df";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(0, 0, 19, 0, 1.35);
        ctx.stroke();
        ctx.restore();
        this.label(T("lbLoading"), x + contentW / 2, cy + 42, 8.5, "rgba(181, 219, 227, 0.88)", 1.4, "center");
      } else if (status === "offline" || status === "error" || status === "empty") {
        const cy = listTop + listH / 2 - 30;
        AG.Art.drawGlow(ctx, status === "empty" ? "#ffd98a" : "#7fa8bb", x + contentW / 2, cy - 12, 58, 0.18);
        AG.Art.icon(ctx, status === "empty" ? "trophy" : "warning", x + contentW / 2, cy - 12, 32, status === "empty" ? "#ffd98a" : "#9abccb");
        const msg = status === "offline" ? T("lbUnavailable") : status === "empty" ? T("lbEmpty") : T("lbError");
        ctx.save();
        this.setFont(10, 500);
        ctx.fillStyle = "rgba(181, 217, 226, 0.9)";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        AG.Art.wrap(ctx, msg, x + contentW / 2, cy + 18, contentW - 70, 14, 3);
        ctx.restore();
        this.label(T("lbLocalBest"), x + contentW / 2, cy + 72, 7.5, "rgba(166, 204, 215, 0.8)", 1.2, "center");
        this.text(AG.I18N.num(this.save.best || 0), x + contentW / 2, cy + 94, 27, "#ffe3a0", { weight: 700, align: "center", display: true });
        if (status === "error") {
          this.button({
            id: "lb_retry", x: x + contentW / 2 - 70, y: panelY + panelH - (showLogin ? 106 : 58), w: 140, h: 36,
            style: "secondary", icon: "refresh", label: T("retry"), labelSize: 9.5,
            onClick: () => this.loadLeaderboard(true)
          });
        }
      } else {
        const maxRows = h < 480 ? 5 : 10;
        const topRows = entries.slice(0, maxRows);
        const rows = [];
        for (let i = 0; i < topRows.length; i++) rows.push({ entry: topRows[i], gap: false });
        if (selfEntry && topRows.indexOf(selfEntry) === -1) {
          rows.push({ entry: selfEntry, gap: true });
        }
        const rowH = Math.min(52, (listH - 8) / Math.max(1, rows.length));
        const rowsStart = listTop + Math.max(0, (listH - rows.length * rowH) / 2);
        for (let i = 0; i < rows.length; i++) {
          const item = rows[i];
          const e = item.entry;
          let y = rowsStart + i * rowH;
          if (item.gap) y += 4;
          const isSelf = selfEntry && e === selfEntry;
          if (isSelf) {
            AG.Art.roundRect(ctx, x + 14, y + 2, contentW - 28, rowH - 4, 9);
            ctx.fillStyle = "rgba(62, 223, 205, 0.08)";
            ctx.fill();
            ctx.strokeStyle = "rgba(90, 235, 219, 0.26)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          if (item.gap) {
            ctx.fillStyle = "rgba(120, 185, 200, 0.16)";
            ctx.fillRect(x + 30, y - 2, contentW - 60, 1);
          }
          const rank = e.rank || (i + 1);
          const rankColor = rank === 1 ? "#ffd98a" : rank === 2 ? "#c9d8e4" : rank === 3 ? "#e0a477" : "rgba(172, 212, 223, 0.85)";
          const rcX = x + 38;
          const rcY = y + rowH / 2;
          if (rank <= 3) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(rcX, rcY, 13, 0, TAU);
            ctx.fillStyle = AG.rgba(rankColor, 0.12);
            ctx.fill();
            ctx.strokeStyle = AG.rgba(rankColor, 0.4);
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }
          this.text(String(rank), rcX, rcY, rank <= 3 ? 12 : 10.5, rankColor, { weight: 700, align: "center", display: rank <= 3 });
          let name = T("playerAnon");
          try {
            if (e.player && e.player.publicName) name = e.player.publicName;
          } catch (err) { /* noop */ }
          let nameSize = 11.5;
          const maxNameW = contentW - 200;
          while (this.measure(name, nameSize, 600) > maxNameW && nameSize > 7) nameSize -= 0.5;
          this.text(name, x + 58, rcY, nameSize, isSelf ? "#9ffff2" : "#e4f6fc", { weight: isSelf ? 700 : 500 });
          if (isSelf) this.label(T("lbYou"), x + 58 + this.measure(name, nameSize, 600) + 8, rcY, 6.2, "rgba(143, 255, 242, 0.8)", 0.5);
          this.text(AG.I18N.num(e.score || 0), x + contentW - 22, rcY, 13, isSelf ? "#9ffff2" : "#eefbff", { weight: 700, align: "right" });
          if (i < rows.length - 1) {
            ctx.fillStyle = "rgba(105, 180, 195, 0.09)";
            ctx.fillRect(x + 30, y + rowH - 1, contentW - 60, 1);
          }
        }
      }

      if (showLogin) {
        const ctaTop = panelY + panelH - ctaH + 2;
        ctx.fillStyle = "rgba(105, 195, 210, 0.13)";
        ctx.fillRect(x + 18, ctaTop - 4, contentW - 36, 1);
        ctx.save();
        this.setFont(8.9, 500);
        ctx.fillStyle = "rgba(204, 237, 243, 0.94)";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        AG.Art.wrap(ctx, T("lbLoginWhy"), x + 18, ctaTop + 1, contentW - 36, 11.5, 2);
        ctx.restore();
        this.button({
          id: "lb_login", x: x + 18, y: panelY + panelH - 42, w: contentW - 36, h: 34,
          style: "secondary", icon: "globe", label: this.lbLoggingIn ? T("lbLoading") : T("lbLogin"),
          labelSize: 10, disabled: this.lbLoggingIn || this.adBusy,
          onClick: () => this.loginAndRefresh()
        });
      }
    }

    drawSettings(ctx) {
      const w = this.w, h = this.h, safe = this.safe;
      const top = this.drawMetaHeader(ctx, T("settingsTitle"), T("settingsSub"), true);
      const contentW = Math.min(w - 28, 620);
      const x = (w - contentW) / 2;
      const compact = h < 520;
      const rowH = compact ? 40 : 48;
      const gap = compact ? 5 : 7;
      let y = top;

      const drawToggleRow = (id, icon, label, on, toggle) => {
        this.panel(x, y, contentW, rowH, { radius: 12 });
        const cy = y + rowH / 2;
        AG.Art.icon(ctx, icon, x + 27, cy, 18, on ? "#8ffff2" : "rgba(140, 175, 188, 0.7)");
        this.label(label, x + 50, cy, compact ? 9.5 : 10.8, on ? "#eaffff" : "rgba(181, 211, 220, 0.85)", 0.9);
        this.hitArea(id + "_row", x, y, contentW, rowH, toggle);
        this.switchButton(id + "_switch", x + contentW - 64, cy - 13, on, toggle);
        y += rowH + gap;
      };
      drawToggleRow("set_sound", this.save.sound ? "sound" : "mute", T("settingsAudio"), this.save.sound, () => this.toggleSound());
      drawToggleRow("set_music", this.save.music ? "music" : "mute", T("settingsMusic"), this.save.music, () => this.toggleMusic());

      const langH = compact ? 56 : 66;
      this.panel(x, y, contentW, langH, { radius: 12 });
      AG.Art.icon(ctx, "globe", x + 18, y + (compact ? 10 : 17), compact ? 11 : 13, "rgba(143, 245, 233, 0.78)");
      this.label(T("settingsLang"), x + (compact ? 28 : 31), y + (compact ? 10 : 17), compact ? 7.5 : 8.2, "rgba(170, 209, 219, 0.9)", 0.9);
      const langs = AG.I18N.languages;
      const lgap = 6;
      const lbw = (contentW - 36 - lgap * 2) / 3;
      const lby = y + langH - (compact ? 30 : 36) - 6;
      for (let i = 0; i < langs.length; i++) {
        const l = langs[i];
        this.button({
          id: "lang_" + l,
          x: x + 18 + i * (lbw + lgap), y: lby, w: lbw, h: compact ? 27 : 31,
          style: AG.I18N.lang === l ? "primary" : "secondary",
          label: AG.I18N.langNames[l], labelSize: compact ? 8.5 : 9.5,
          onClick: () => this.setLanguage(l)
        });
      }
      y += langH + gap;

      this.button({
        id: "set_how", x: x, y: y, w: contentW, h: rowH,
        style: "listrow", icon: "info", label: T("settingsHow"),
        labelSize: compact ? 9.5 : 10.8,
        onClick: () => this.openTutorial(null)
      });
      y += rowH + gap;

      this.button({
        id: "set_reset", x: x, y: y, w: contentW, h: rowH,
        style: "danger", icon: "refresh", label: T("settingsReset"),
        labelSize: compact ? 9.5 : 10.8,
        onClick: () => this.openConfirm("reset")
      });
      y += rowH + gap;

      const maxInfoY = h - safe.bottom - 14;
      if (maxInfoY - y > 168) {
        const statsH = 56;
        this.panel(x, y, contentW, statsH, { radius: 12, border: "rgba(105, 185, 210, 0.12)" });
        const stats = [
          { v: this.save.runs || 0, l: T("runs") },
          { v: this.save.stats.bestWave || 0, l: T("bestWave") },
          { v: this.save.stats.blocks || 0, l: T("blocked") },
          { v: this.save.stats.crystals || 0, l: T("crystals") }
        ];
        const sw = contentW / 4;
        for (let i = 0; i < 4; i++) {
          const sx = x + sw * (i + 0.5);
          if (i > 0) {
            ctx.fillStyle = "rgba(110, 175, 195, 0.12)";
            ctx.fillRect(x + sw * i, y + 12, 1, statsH - 24);
          }
          this.text(AG.I18N.num(stats[i].v), sx, y + 22, 15, "#e9fcff", { display: true, align: "center" });
          this.label(stats[i].l, sx, y + 42, 6.4, "rgba(161, 202, 213, 0.82)", 0.5, "center");
        }
        y += statsH + 8;
      }
      if (maxInfoY - y > 54) {
        const ch = 42;
        this.panel(x, y, contentW, ch, { radius: 12, border: "rgba(105, 185, 210, 0.12)" });
        AG.Art.icon(ctx, "target", x + 24, y + ch / 2, 17, "#8ffff2");
        this.label(AG.IS_TOUCH ? T("hintMobile") : T("hintDesktop"), x + 44, y + ch / 2, compact ? 7.5 : 8.5, "rgba(180, 216, 225, 0.82)", 0.5);
        y += ch + 8;
      }
      if (maxInfoY - y > 98) {
        const ah = 84;
        this.panel(x, y, contentW, ah, { radius: 12, border: "rgba(105, 185, 210, 0.12)" });
        this.label(T("aboutTitle"), x + 18, y + 16, 7.2, "rgba(151, 217, 219, 0.86)", 1.4);
        ctx.save();
        this.setFont(9, 500);
        ctx.fillStyle = "rgba(164, 202, 212, 0.82)";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        AG.Art.wrap(ctx, T("aboutText"), x + 18, y + 29, contentW - 36, 11.5, 4);
        ctx.restore();
        y += ah + 8;
      }

      const infoY = Math.min(maxInfoY, y + 12);
      const dotColor = this.sdkActive ? "#7ff5da" : "rgba(150, 175, 188, 0.5)";
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + 4, infoY, 3, 0, TAU);
      ctx.fillStyle = dotColor;
      ctx.fill();
      ctx.restore();
      const info = T("settingsVersion", { v: AG.VERSION }) + "  ·  " + T("settingsSDK") + ": " + (this.sdkActive ? T("sdkOn") : T("sdkOff"));
      this.label(info, x + 12, infoY, compact ? 7 : 7.5, "rgba(157, 196, 208, 0.82)", 0.5);
    }
  }

  AG.App = App;
  try {
    AG.app = new AG.App();
  } catch (e) {
    console.error(e);
    const boot = document.getElementById("boot");
    if (boot) boot.classList.add("is-hidden");
  }
})();

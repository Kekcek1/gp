/* ==========================================================================
   Сияние рифа / Reef Glow — контроллер уровня.
   Связывает чистое ядро, отрисовку, интерфейс, звук и SDK.
   ========================================================================== */
(function (root) {
  'use strict';

  var Core = root.ReefCore;
  var Levels = root.ReefLevels;
  var Save = root.ReefSave;
  var UI = root.ReefUI;
  var Renderer = root.ReefRenderer;
  var Audio = root.ReefAudio;
  var SDK = root.ReefSDK;
  var t = function (key, params) { return root.I18n.t(key, params); };

  function now() { return (root.performance && root.performance.now) ? root.performance.now() : Date.now(); }
  function wait(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
  function adjacent(a, b) { return !!a && !!b && Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1; }

  var Game = {
    game: null,
    level: null,
    levelId: 0,
    playing: false,
    paused: false,
    busy: false,
    levelFinished: false,
    inAd: false,
    pausePending: false,
    anim: { type: 'none', selected: null, hint: null },
    selected: null,
    keyAnchor: null,
    dragStart: null,
    dragTriggered: false,
    pointerId: null,
    boosterMode: null,
    waveTargeting: false,
    waveAnnounced: false,
    goalAnnounced: false,
    hintTimer: null,
    hintHideTimer: null,
    winsSinceAd: 0,
    lastAdAt: 0,
    stats: { matches: 0, algae: 0, waves: 0, specials: 0 },
    levelStartAt: 0,
    _loopBound: null,
    _lastInvalidToast: 0,

    init: function () {
      var self = this;
      self.bindInput();
      self.bindLifecycle();
      self._loopBound = self.loop.bind(self);
      root.requestAnimationFrame(self._loopBound);
      self.bindSdkEvents();
      return self;
    },

    bindSdkEvents: function () {
      try {
        if (SDK.ysdk && typeof SDK.ysdk.on === 'function') {
          SDK.ysdk.on('game_api_pause', function () {
            if (Game.playing && !Game.levelFinished) Game.pause();
            else Audio.pause();
          });
          SDK.ysdk.on('game_api_resume', function () {
            if (Game.paused && !Game.levelFinished) Game.resume();
            else Audio.resume();
          });
        }
      } catch (e) { /* SDK не должен ломать игру */ }
    },

    bindLifecycle: function () {
      var self = this;
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          Audio.pause();
          if (self.playing && !self.levelFinished && !self.inAd) self.pause();
        } else if (!self.playing) {
          Audio.resume();
        }
      });
      root.addEventListener('blur', function () {
        Audio.pause();
        if (self.playing && !self.levelFinished && !self.inAd && !self.paused) self.pause();
      });
      root.addEventListener('focus', function () {
        if (!self.playing) Audio.resume();
      });
      root.addEventListener('resize', function () {
        if (self._resizeTimer) clearTimeout(self._resizeTimer);
        self._resizeTimer = setTimeout(function () {
          if (root.ReefRenderer) root.ReefRenderer.resize();
        }, 90);
      });
      document.addEventListener('keydown', function (e) {
        if (UI.modalOpen) return;
        if (UI.current !== 'game' || !self.isPlaying()) return;
        var tag = e.target && e.target.tagName;
        if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA') return;
        var key = e.key;
        if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
          e.preventDefault();
          var cur = self.selected || { r: 0, c: 0 };
          var r = cur.r, c = cur.c;
          if (key === 'ArrowLeft') c--;
          if (key === 'ArrowRight') c++;
          if (key === 'ArrowUp') r--;
          if (key === 'ArrowDown') r++;
          r = Math.max(0, Math.min(self.game.rows - 1, r));
          c = Math.max(0, Math.min(self.game.cols - 1, c));
          self.selected = { r: r, c: c };
          self.keyAnchor = null;
          self.updateVisual();
          Audio.sfx('click');
        } else if (key === ' ' || key === 'Enter') {
          e.preventDefault();
          if (!self.selected) { self.selected = { r: 0, c: 0 }; self.keyAnchor = null; self.updateVisual(); return; }
          if (self.keyAnchor && adjacent(self.keyAnchor, self.selected)) {
            var a = self.keyAnchor, b = self.selected;
            self.keyAnchor = null;
            self.trySwap(a, b);
          } else {
            self.keyAnchor = { r: self.selected.r, c: self.selected.c };
            Audio.sfx('click');
          }
        }
      });
    },

    bindInput: function () {
      var self = this;
      var canvas = document.getElementById('board-canvas');
      if (!canvas) return;
      canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      canvas.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        if (!self.isPlaying() || self.busy) return;
        self.clearHint();
        if (!self.waveTargeting && self.boosterMode !== 'hammer') UI.hideCoach();
        var tile = Renderer.hitTest(e.clientX, e.clientY);
        if (self.waveTargeting) {
          if (tile) self.resolveWaveAt(tile.r, tile.c);
          else self.cancelWave();
          return;
        }
        if (self.boosterMode === 'hammer') {
          if (tile) self.resolveHammerAt(tile.r, tile.c);
          return;
        }
        self.dragStart = tile;
        self.dragTriggered = false;
        self.pointerId = e.pointerId;
        self.keyAnchor = null;
        if (tile && canvas.setPointerCapture) {
          try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        }
      });
      canvas.addEventListener('pointermove', function (e) {
        if (!self.dragStart || self.dragTriggered || self.busy) return;
        var tile = Renderer.hitTest(e.clientX, e.clientY);
        if (tile && adjacent(self.dragStart, tile)) {
          self.dragTriggered = true;
          var a = self.dragStart;
          self.dragStart = null;
          self.selected = null;
          self.updateVisual();
          self.trySwap(a, tile);
        }
      });
      canvas.addEventListener('pointerup', function (e) {
        e.preventDefault();
        if (self.pointerId !== null && canvas.releasePointerCapture) {
          try { canvas.releasePointerCapture(self.pointerId); } catch (err) { /* ignore */ }
        }
        self.pointerId = null;
        if (self.dragTriggered) { self.dragTriggered = false; self.dragStart = null; return; }
        self.dragStart = null;
        if (!self.isPlaying() || self.busy) return;
        var tile = Renderer.hitTest(e.clientX, e.clientY);
        if (!tile) { self.selected = null; self.updateVisual(); return; }
        if (self.selected && self.selected.r === tile.r && self.selected.c === tile.c) {
          self.selected = null;
          self.updateVisual();
          return;
        }
        if (self.selected && adjacent(self.selected, tile)) {
          var a = self.selected;
          self.selected = null;
          self.updateVisual();
          self.trySwap(a, tile);
          return;
        }
        self.selected = tile;
        self.updateVisual();
        Audio.sfx('click');
      });
      canvas.addEventListener('pointercancel', function () {
        self.dragStart = null;
        self.dragTriggered = false;
        self.pointerId = null;
      });
    },

    loop: function (time) {
      root.requestAnimationFrame(this._loopBound);
      if (Renderer) {
        Renderer.drawBackground(time, (this.playing || this.game) ? 'game' : 'menu');
        if (this.game && UI.current === 'game') {
          Renderer.render(this.game, this.anim, time);
        }
      }
    },

    updateVisual: function () {
      if (!this.anim) this.anim = { type: 'none', selected: null, hint: null };
      this.anim.selected = this.selected;
      var canvas = document.getElementById('board-canvas');
      if (canvas) canvas.style.cursor = (this.waveTargeting || this.boosterMode) ? 'crosshair' : 'pointer';
    },

    isPlaying: function () {
      return this.playing && !this.paused && !this.levelFinished && !this.inAd;
    },
    isPaused: function () { return this.paused; },
    currentLevelId: function () { return this.levelId; },

    /* ------------------------------------------------------------ level flow */
    startFromMenu: function () {
      if (this.paused && this.game) { this.resume(); return; }
      this.startLevel(Save.currentLevel(), { from: 'menu' });
    },

    startLevel: function (id, opts) {
      var self = this;
      opts = opts || {};
      id = Math.max(1, Math.min(Levels.TOTAL_LEVELS, Number(id) || 1));
      self.levelId = id;
      self.level = Levels.getLevel(id);
      // Небольшой сдвиг seed делает повторные попытки разными.
      var offset = (opts.seedOffset !== undefined) ? opts.seedOffset : Math.floor(Math.random() * 100000);
      self.game = Core.createGame(self.level, { seedOffset: offset });
      self.stats = { matches: 0, algae: 0, waves: 0, specials: 0 };
      self.playing = true;
      self.paused = false;
      self.busy = false;
      self.levelFinished = false;
      self.inAd = false;
      self.pausePending = false;
      self.selected = null;
      self.keyAnchor = null;
      self.dragStart = null;
      self.boosterMode = null;
      self.waveTargeting = false;
      self.waveAnnounced = false;
      self.goalAnnounced = false;
      self.anim = { type: 'none', selected: null, hint: null };
      self.levelStartAt = now();
      self.clearHint();

      UI.closeModal(true);
      UI.show('game');
      UI.hideCoach();
      UI.setWaveTargeting(false);
      UI.setBusy(false);
      UI.lastResult = null;
      Renderer.resize();
      Renderer.setGame(self.game);
      UI.refreshHUD(self.game);
      self.updateVisual();
      root.requestAnimationFrame(function () {
        Renderer.resize();
        UI.refreshHUD(self.game);
      });

      Audio.resume();
      Audio.setMood('game');
      SDK.gameplayStart();

      self.scheduleHint();
      if (self.level.tutorial) {
        setTimeout(function () {
          if (self.isPlaying() && !self.busy && self.levelId === 1) {
            var hint = self.game.findHint();
            if (hint) {
              self.anim.hint = hint;
              UI.showCoach(t('tutorial.firstMove'), 6200);
              setTimeout(function () { if (self.anim) self.anim.hint = null; }, 7000);
            }
          }
        }, 2400);
      }
      if (opts.from === 'retry') Audio.sfx('click');
    },

    restart: function () {
      var id = this.levelId || Save.currentLevel();
      this.closeAllModals();
      this.startLevel(id, { from: 'retry' });
    },

    nextLevel: function () {
      var self = this;
      var next = self.levelId + 1;
      var last = self.levelId >= Levels.TOTAL_LEVELS;
      UI.closeModal(true);
      if (last) { self.exitToMap(); return; }
      self.playInterstitialIfNeeded().then(function () {
        self.startLevel(next, { from: 'next' });
      });
    },

    exitToMap: function () {
      var self = this;
      self.closeAllModals();
      var targetLevel = (self.game && self.game.status === 'won') ? (self.levelId + 1) : self.levelId;
      UI.chapter = Math.max(1, Math.min(6, Math.ceil(targetLevel / 10)));
      self.playing = false;
      self.paused = false;
      self.levelFinished = false;
      self.game = null;
      self.level = null;
      self.anim = { type: 'none', selected: null, hint: null };
      self.selected = null;
      self.boosterMode = null;
      self.waveTargeting = false;
      SDK.gameplayStop();
      Audio.resume();
      Audio.setMood('menu');
      UI.show('map');
    },

    exitToMenu: function () {
      this.closeAllModals();
      this.playing = false;
      this.paused = false;
      this.levelFinished = false;
      this.game = null;
      this.level = null;
      this.anim = { type: 'none', selected: null, hint: null };
      this.selected = null;
      this.boosterMode = null;
      this.waveTargeting = false;
      SDK.gameplayStop();
      Audio.resume();
      Audio.setMood('menu');
      UI.show('menu');
    },

    closeAllModals: function () {
      if (UI.modalOpen) UI.closeModal(true);
    },

    pause: function () {
      if (!this.playing || this.paused || this.levelFinished || this.inAd) return;
      if (this.busy) { this.pausePending = true; return; }
      this.paused = true;
      SDK.gameplayStop();
      Audio.pause();
      UI.setBusy(true);
      UI.hideCoach();
      UI.pauseModal();
    },

    resume: function () {
      if (!this.paused || this.levelFinished) return;
      this.paused = false;
      UI.closeModal(true);
      SDK.gameplayStart();
      Audio.resume();
      Audio.setMood('game');
      UI.setBusy(false);
      if (this.game) UI.refreshHUD(this.game);
      this.scheduleHint();
    },

    continueWithMoves: function () {
      if (!this.game || this.game.status !== 'lost') { UI.closeModal(true); return; }
      if (Save.state.coins < 25) { UI.toast(t('shop.notEnough'), 'error'); return; }
      Save.spendCoins(25);
      this.game.grantMoves(3);
      this.playing = true;
      this.paused = false;
      this.levelFinished = false;
      this.busy = false;
      UI.closeModal(true);
      UI.show('game');
      UI.setBusy(false);
      UI.refreshHUD(this.game);
      SDK.gameplayStart();
      Audio.resume();
      Audio.setMood('game');
      Audio.sfx('coin');
      UI.toast(t('result.continue', { n: 25 }), 'gold');
      this.scheduleHint();
    },

    resumeFromAdReward: function () {
      if (!this.game) return;
      if (this.game.status === 'lost') this.exitToMap();
      else this.resume();
    },

    playInterstitialIfNeeded: function () {
      var self = this;
      if (!SDK.available) return Promise.resolve();
      if (self.winsSinceAd < 3) return Promise.resolve();
      if (Date.now() - self.lastAdAt < 180000) return Promise.resolve();
      self.lastAdAt = Date.now();
      self.winsSinceAd = 0;
      self.inAd = true;
      SDK.gameplayStop();
      Audio.pause();
      return SDK.showFullscreen().then(function () {
        self.inAd = false;
        Audio.resume();
      });
    },

    /* --------------------------------------------------------------- finish */
    finishLevel: function (won) {
      if (this.levelFinished) return;
      this.levelFinished = true;
      this.playing = false;
      this.busy = false;
      this.paused = false;
      this.selected = null;
      this.keyAnchor = null;
      this.anim = { type: 'none', selected: null, hint: null };
      UI.setBusy(true);
      UI.hideCoach();
      SDK.gameplayStop();
      Audio.setMood('result');

      var id = this.levelId;
      var stars = won ? this.game.stars() : 0;
      var prev = Save.bestStars(id);
      var newBest = won && stars > prev;
      if (won) {
        var first = prev === 0;
        var coins = first ? (20 + stars * 10) : (5 + stars * 2);
        Save.recordWin(id, stars, this.stats);
        Save.addCoins(coins);
        Save.flushCloud();
        SDK.setLeaderboardScore(Save.totalStars());
        this.winsSinceAd++;
        Audio.sfx('win');
        UI.resultModal({
          won: true,
          stars: stars,
          score: this.game.score,
          coins: coins,
          newBest: newBest,
          first: first,
          level: id,
          lastLevel: id >= Levels.TOTAL_LEVELS
        });
        UI.checkAchievements();
        if (id % 10 === 0 && id < Levels.TOTAL_LEVELS) {
          var ch = Levels.getChapter(Math.floor(id / 10) + 1);
          var self = this;
          setTimeout(function () {
            UI.toast(t('toast.chapterUnlocked', { name: root.I18n.getLang() === 'ru' ? ch.title : ch.titleEn }), 'gold', 3200);
          }, 900);
        }
        UI.refreshCurrency();
        UI.refreshMenu();
      } else {
        Save.recordLoss(this.stats);
        Audio.sfx('lose');
        UI.resultModal({
          won: false,
          stars: 0,
          score: this.game.score,
          level: id,
          lastLevel: false
        });
        UI.refreshCurrency();
      }
    },

    /* ------------------------------------------------------------- resolving */
    trySwap: function (a, b) {
      var self = this;
      if (!self.isPlaying() || self.busy || self.levelFinished) return;
      if (!a || !b || !adjacent(a, b)) return;
      self.busy = true;
      self.clearHint();
      self.selected = null;
      self.updateVisual();
      UI.setBusy(true);
      var ta = self.game.board.get(a.r, a.c);
      var tb = self.game.board.get(b.r, b.c);
      if (!ta || !tb) { self.busy = false; UI.setBusy(false); return; }
      var res = self.game.swap(a, b);
      if (!res.valid) {
        self.anim = { type: 'invalid', start: now(), dur: 190, a: a, b: b, tiles: [ta, tb], selected: null, hint: null };
        Audio.sfx('invalid');
        if (now() - self._lastInvalidToast > 8000) {
          self._lastInvalidToast = now();
          UI.showCoach(t('toast.nomatch'), 2000);
        }
        wait(200).then(function () {
          self.anim = { type: 'none', selected: null, hint: null };
          self.busy = false;
          UI.setBusy(false);
          self.scheduleHint();
        });
        return;
      }
      Audio.sfx('swap');
      self.anim = { type: 'swap', start: now(), dur: 170, a: a, b: b, tiles: [ta, tb], selected: null, hint: null };
      UI.refreshHUD(self.game);
      wait(180).then(function () {
        return self.resolveAll(res.combo || null);
      }).then(function () {
        self.busy = false;
        UI.setBusy(false);
        self.anim = { type: 'none', selected: null, hint: null };
        if (self.game) UI.refreshHUD(self.game);
        if (self.pausePending) { self.pausePending = false; self.pause(); return; }
        if (self.game && self.game.status === 'playing') self.scheduleHint();
      });
    },

    resolveAll: function (initialEffect) {
      var self = this;
      var chain = Promise.resolve();
      if (initialEffect) {
        self.trackStep(initialEffect);
        chain = chain.then(function () { return self.animateClear(initialEffect, 'clear'); })
          .then(function () { return self.animateCollapse(); });
      }
      function loop() {
        if (!self.game || self.game.status !== 'playing') return Promise.resolve();
        var step = self.game.resolveStep();
        if (!step) return Promise.resolve();
        self.trackStep(step);
        return self.animateClear(step, 'clear')
          .then(function () { return self.animateCollapse(); })
          .then(function () { return loop(); });
      }
      return chain.then(function () { return loop(); }).then(function () {
        if (!self.game) return;
        UI.refreshHUD(self.game);
        if (self.game.status === 'playing') {
          var status = self.game.checkStatus();
          if (status === 'shuffled') {
            UI.toast(t('toast.nomoves'));
            Renderer.shakeScreen(0.4);
            self.anim = { type: 'none', selected: null, hint: null };
          }
        }
        if (self.game.status === 'won') self.finishLevel(true);
        else if (self.game.status === 'lost') self.finishLevel(false);
        else {
          self.maybeWaveReady();
          self.maybeGoalsDone();
        }
      });
    },

    trackStep: function (step) {
      if (!step) return;
      if (step.cleared) {
        for (var i = 0; i < step.cleared.length; i++) if (step.cleared[i].tile) this.stats.matches++;
      }
      this.stats.algae += step.algaeCleared || 0;
      this.stats.specials += (step.creations ? step.creations.length : 0) + (step.specialsActivated || 0);
    },

    animateClear: function (effect, kind) {
      var self = this;
      var dur = 280 + Math.min(120, (effect.cleared ? effect.cleared.length : 0) * 4);
      self.anim = {
        type: kind || 'clear',
        start: now(),
        dur: dur,
        cleared: effect.cleared || [],
        creations: effect.creations || [],
        comboKind: effect.combo || null,
        anchor: effect.anchor || null,
        selected: null,
        hint: null
      };
      var cleared = effect.cleared || [];
      var count = 0;
      for (var i = 0; i < cleared.length; i++) {
        var c = cleared[i];
        if (count++ > 42) break;
        if (c.tile) Renderer.spawnBurst(c.r, c.c, c.tile.type, 7 + Math.min(4, (effect.cascade || 1)));
        else Renderer.spawnBurst(c.r, c.c, 'kelp', 5);
        if (c.algae) Renderer.spawnBurst(c.r, c.c, 'kelp', 4);
      }
      if (effect.algaeSpread) {
        for (var s = 0; s < effect.algaeSpread.length; s++) {
          Renderer.spawnBurst(effect.algaeSpread[s].r, effect.algaeSpread[s].c, 'kelp', 4);
        }
      }
      if (effect.creations && effect.creations.length) {
        for (var k = 0; k < effect.creations.length; k++) {
          Renderer.spawnRing(effect.creations[k].r, effect.creations[k].c, '#bff6ff', self.boardCell ? self.boardCell * 1.4 : 50);
        }
        Audio.sfx('special');
      }
      var hasSpecial = false;
      for (var h = 0; h < cleared.length; h++) {
        if (cleared[h].tile && cleared[h].tile.special) { hasSpecial = true; break; }
      }
      if (hasSpecial || effect.combo) {
        Audio.sfx('special');
        Renderer.shakeScreen(effect.combo === 'rainbow-rainbow' ? 0.9 : 0.45);
      } else {
        Audio.sfx('match', { cascade: effect.cascade || 1 });
      }
      if (effect.scoreGain && (effect.cascade || 1) >= 2) {
        Renderer.spawnFloatingText(3, 3, '+' + effect.scoreGain, '#ffe9b5');
      }
      if ((effect.cascade || 1) >= 2) UI.combo(effect.cascade);
      UI.refreshHUD(self.game);
      return wait(dur).then(function () {
        self.anim = { type: 'none', selected: null, hint: null };
      });
    },

    animateCollapse: function () {
      var self = this;
      var col = self.game.collapse();
      if (!col.falls.length && !col.spawns.length) return Promise.resolve();
      self.anim = { type: 'fall', start: now(), dur: 290, falls: col.falls, spawns: col.spawns, selected: null, hint: null };
      return wait(300).then(function () {
        self.anim = { type: 'none', selected: null, hint: null };
      });
    },

    maybeWaveReady: function () {
      if (!this.game) return;
      if (this.game.wave >= 100 && !this.waveAnnounced) {
        this.waveAnnounced = true;
        UI.toast(t('toast.waveReady'), 'gold');
        UI.showCoach(t('tutorial.wave'), 4500);
        Audio.sfx('star');
      }
      if (this.game.wave < 100) this.waveAnnounced = false;
      UI.refreshHUD(this.game);
    },

    maybeGoalsDone: function () {
      if (!this.game || this.goalAnnounced) return;
      if (this.game.goalsComplete()) {
        this.goalAnnounced = true;
        UI.toast(t('hud.goalDone'), 'gold');
        Audio.sfx('star');
      }
    },

    /* -------------------------------------------------------------- boosters */
    useBooster: function (kind) {
      var self = this;
      if (!self.isPlaying() || self.busy || !self.game || self.game.status !== 'playing') return;
      var count = Save.state.boosters[kind] || 0;
      if (!count) { UI.toast(t('toast.noBooster'), 'error'); return; }
      if (kind !== 'hammer' && self.boosterMode) self.cancelBoosterMode();
      if (kind === 'hammer') {
        if (self.boosterMode === 'hammer') { self.cancelBoosterMode(); return; }
        self.boosterMode = 'hammer';
        UI.showCoach(t('boosters.active'), 0);
        self.updateVisual();
        Audio.sfx('click');
        return;
      }
      if (kind === 'shuffle') {
        Save.useBooster('shuffle');
        self.game.shuffleBoard();
        Renderer.shakeScreen(0.25);
        for (var r = 0; r < self.game.rows; r++) {
          for (var c = 0; c < self.game.cols; c++) {
            if ((r + c) % 3 === 0) Renderer.spawnBurst(r, c, 'bubble', 3);
          }
        }
        Audio.sfx('shuffle');
        UI.toast(t('boosters.used', { name: t('boosters.shuffle.name') }));
        UI.refreshHUD(self.game);
        UI.refreshBoosters();
        self.scheduleHint();
        return;
      }
      if (kind === 'moves') {
        Save.useBooster('moves');
        self.game.grantMoves(3);
        Audio.sfx('coin');
        UI.toast('+3 ' + t('common.moves'));
        UI.refreshHUD(self.game);
        UI.refreshBoosters();
        return;
      }
      if (kind === 'wave') {
        if (self.game.wave >= 100) { UI.toast(t('toast.waveReady'), 'gold'); return; }
        Save.useBooster('wave');
        self.game.wave = 100;
        self.waveAnnounced = false;
        Audio.sfx('special');
        UI.toast(t('boosters.used', { name: t('boosters.wave.name') }));
        self.maybeWaveReady();
        UI.refreshHUD(self.game);
        UI.refreshBoosters();
        return;
      }
    },

    cancelBoosterMode: function () {
      this.boosterMode = null;
      UI.hideCoach();
      this.updateVisual();
    },

    resolveHammerAt: function (r, c) {
      var self = this;
      if (!self.isPlaying() || self.busy) return;
      var effect = self.game.hammer(r, c);
      if (!effect) { UI.toast(t('boosters.active'), 'error'); return; }
      Save.useBooster('hammer');
      self.boosterMode = null;
      UI.hideCoach();
      self.updateVisual();
      self.busy = true;
      UI.setBusy(true);
      Audio.sfx('hammer');
      Renderer.shakeScreen(0.35);
      self.trackStep(effect);
      self.animateClear(effect, 'clear').then(function () {
        return self.animateCollapse();
      }).then(function () {
        return self.resolveAll(null);
      }).then(function () {
        self.busy = false;
        UI.setBusy(false);
        UI.refreshHUD(self.game);
        UI.refreshBoosters();
        if (self.pausePending) { self.pausePending = false; self.pause(); return; }
        if (self.game && self.game.status === 'playing') self.scheduleHint();
      });
    },

    toggleWave: function () {
      if (!this.isPlaying() || this.busy || !this.game) return;
      if (this.game.wave < 100) return;
      if (this.waveTargeting) { this.cancelWave(); return; }
      if (this.boosterMode) this.cancelBoosterMode();
      this.waveTargeting = true;
      UI.setWaveTargeting(true);
      UI.showCoach(t('hud.waveChoose'), 0);
      this.updateVisual();
      Audio.sfx('click');
    },

    cancelWave: function () {
      this.waveTargeting = false;
      UI.setWaveTargeting(false);
      UI.hideCoach();
      this.updateVisual();
    },

    resolveWaveAt: function (r, c) {
      var self = this;
      if (!self.isPlaying() || self.busy) return;
      var tile = self.game.board.get(r, c);
      if (!tile) { self.cancelWave(); return; }
      var type = tile.type;
      var effect = self.game.useWave(type);
      if (!effect) { self.cancelWave(); return; }
      self.waveTargeting = false;
      UI.setWaveTargeting(false);
      UI.hideCoach();
      self.updateVisual();
      self.stats.waves++;
      self.busy = true;
      UI.setBusy(true);
      self.waveAnnounced = false;
      Audio.sfx('wave');
      Renderer.shakeScreen(0.7);
      self.trackStep(effect);
      self.anim = { type: 'wave', start: now(), dur: 360, cleared: effect.cleared || [], selected: null, hint: null };
      Renderer.spawnRing(3, 3, '#8ff7e8', (Renderer.boardSize || 360) * 0.9);
      if (effect.cleared) {
        for (var i = 0; i < effect.cleared.length && i < 42; i++) {
          var cel = effect.cleared[i];
          if (cel.tile) Renderer.spawnBurst(cel.r, cel.c, cel.tile.type, 6, { power: 1.2 });
          if (cel.algae) Renderer.spawnBurst(cel.r, cel.c, 'kelp', 4);
        }
      }
      UI.refreshHUD(self.game);
      wait(370).then(function () {
        self.anim = { type: 'none', selected: null, hint: null };
        return self.animateCollapse();
      }).then(function () {
        return self.resolveAll(null);
      }).then(function () {
        self.busy = false;
        UI.setBusy(false);
        UI.refreshHUD(self.game);
        UI.refreshBoosters();
        if (self.pausePending) { self.pausePending = false; self.pause(); return; }
        if (self.game && self.game.status === 'playing') self.scheduleHint();
      });
    },

    /* ---------------------------------------------------------------- hints */
    scheduleHint: function () {
      var self = this;
      if (self.hintTimer) clearTimeout(self.hintTimer);
      if (!self.isPlaying() || self.busy || self.levelFinished) return;
      self.hintTimer = setTimeout(function () {
        if (!self.isPlaying() || self.busy || !self.game) return;
        var hint = self.game.findHint();
        if (hint) {
          self.anim.hint = hint;
          UI.showCoach(t('toast.hint'), 3000);
          if (self.hintHideTimer) clearTimeout(self.hintHideTimer);
          self.hintHideTimer = setTimeout(function () {
            if (self.anim) self.anim.hint = null;
          }, 5200);
        }
        self.scheduleHint();
      }, 8000);
    },

    clearHint: function () {
      if (this.hintTimer) { clearTimeout(this.hintTimer); this.hintTimer = null; }
      if (this.hintHideTimer) { clearTimeout(this.hintHideTimer); this.hintHideTimer = null; }
      if (this.anim) this.anim.hint = null;
    }
  };

  root.ReefGame = Game;
})(typeof globalThis !== 'undefined' ? globalThis : this);

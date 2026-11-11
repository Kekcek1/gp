/* ==========================================================================
   Сияние рифа / Reef Glow — запуск игры.
   Порядок: SDK → сохранение → облако → интерфейс → игровой цикл → меню.
   ========================================================================== */
(function (root) {
  'use strict';

  var SDK = root.ReefSDK;
  var Save = root.ReefSave;
  var UI = root.ReefUI;
  var Game = root.ReefGame;
  var Renderer = root.ReefRenderer;
  var Audio = root.ReefAudio;
  var I18n = root.I18n;

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function query(name) {
    try { return new URLSearchParams(root.location.search).get(name); }
    catch (e) { return null; }
  }

  function boot() {
    var bgCanvas = document.getElementById('bg-canvas');
    var boardCanvas = document.getElementById('board-canvas');
    Renderer.init(bgCanvas, boardCanvas);

    var progress = 8;
    UI.setBootProgress(progress);
    var fake = setInterval(function () {
      progress = Math.min(88, progress + Math.random() * 10);
      UI.setBootProgress(progress);
    }, 260);

    var startedAt = Date.now();
    SDK.init().then(function () {
      Save.init();
      Audio.init(Save.state.settings);
      return SDK.loadCloud().catch(function () { return null; });
    }).then(function (cloud) {
      if (cloud) Save.mergeCloud(cloud);

      // Язык: ручная настройка важнее автоопределения из SDK.
      UI.init();
      Game.init();
      I18n.apply(document);

      clearInterval(fake);
      UI.setBootProgress(100);

      var skip = query('skipintro') === '1';
      if (skip) { Save.state.tutorialSeen = true; Save.save(false); }

      var elapsed = Date.now() - startedAt;
      var delay = Math.max(0, 700 - elapsed);
      setTimeout(function () {
        var bootScreen = document.getElementById('screen-boot');
        if (bootScreen) bootScreen.classList.remove('is-active');
        UI.show('menu');
        SDK.ready();
        if (!Save.state.tutorialSeen) {
          setTimeout(function () { UI.tutorial(); }, 420);
        }

        var levelParam = Number(query('level'));
        if (levelParam >= 1 && levelParam <= 60) {
          setTimeout(function () { Game.startLevel(levelParam, { from: 'url' }); }, 300);
        }

        // Облако могло измениться после старта — синхронизируем звёзды.
        if (SDK.available && SDK.authorized) SDK.setLeaderboardScore(Save.totalStars());
        if (cloud) Save.flushCloud();
        Save.checkAchievements();
        UI.refreshAll();
      }, Math.max(220, delay));
    }).catch(function (err) {
      // Даже при сбое SDK игра должна открыться.
      try { Save.init(); UI.init(); Game.init(); } catch (e) { /* ignore */ }
      clearInterval(fake);
      UI.setBootProgress(100);
      setTimeout(function () {
        var bootScreen = document.getElementById('screen-boot');
        if (bootScreen) bootScreen.classList.remove('is-active');
        UI.show('menu');
        SDK.ready();
        if (root.console && root.console.warn) root.console.warn('Reef Glow boot fallback', err && err.message);
      }, 350);
    });

    // Сохраняем прогресс при уходе со страницы.
    root.addEventListener('pagehide', function () { Save.flushCloud(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) Save.flushCloud();
    });
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); }, { passive: false });
    root.addEventListener('orientationchange', function () {
      setTimeout(function () { Renderer.resize(); }, 250);
    });
    // Ошибки не должны ломать звук/сохранение, но помогают при отладке.
    root.addEventListener('error', function (e) {
      if (root.console && root.console.warn) root.console.warn('Reef Glow error:', e.message || e);
    });

    root.__REEF__ = {
      SDK: SDK, Save: Save, UI: UI, Game: Game, Renderer: Renderer,
      Audio: Audio, Core: root.ReefCore, Levels: root.ReefLevels, I18n: I18n
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);

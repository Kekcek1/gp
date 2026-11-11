/* ==========================================================================
   Сияние рифа / Reef Glow — интерфейс, экраны, модальные окна.
   ========================================================================== */
(function (root) {
  'use strict';

  var t = function (key, params) { return root.I18n.t(key, params); };
  var Save = root.ReefSave;
  var Levels = root.ReefLevels;
  var Renderer = root.ReefRenderer;

  function $(id) { return document.getElementById(id); }
  function qs(sel, el) { return (el || document).querySelector(sel); }
  function qsa(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function escapeHtml(str) {
    return String(str === undefined || str === null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function formatNum(n) {
    return String(Math.max(0, Math.floor(n || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------------------------------------------------------------- icons */
  var ICONS = {
    coin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.6" fill="#ffc857"/><circle cx="12" cy="12" r="6.3" fill="#ffe29a"/><path d="M12 8.2v7.6M9.4 10.3h4.3a1.8 1.8 0 0 1 0 3.5H9.4" stroke="#8a5a12" stroke-width="1.5" stroke-linecap="round"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.4l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.3l6.6-.9z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" stroke-linecap="round"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2l11 6.8-11 6.8z"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 6.5l6-3 6 3 6-3v14l-6 3-6-3-6 3z"/><path d="M9 3.5v14M15 6.5v14"/></svg>',
    shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5.5 8h13l-1 12h-11z"/><path d="M9 8V6.2a3 3 0 0 1 6 0V8"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M8 4h8v4.2a4 4 0 0 1-8 0z"/><path d="M8 5H5.2v1.4A3.4 3.4 0 0 0 8.6 9.8M16 5h2.8v1.4a3.4 3.4 0 0 1-3.4 3.4M12 12.2V16M8.5 20h7M10 16h4v4h-4z"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13"/><path d="M12 7S9.6 3.2 7.7 4.3C6.2 5.2 7.5 7 9.5 7zM12 7s2.4-3.8 4.3-2.7C17.8 5.2 16.5 7 14.5 7z"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14.5 5l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'chevron-left': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14.5 5l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'chevron-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9.5 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'arrow-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.3"/><rect x="13.5" y="5" width="4" height="14" rx="1.3"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8.5 10V7.4a3.5 3.5 0 0 1 7 0V10"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 6.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'sound-on': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" stroke-linejoin="round"/><path d="M15.4 8.4a5 5 0 0 1 0 7.2M17.8 6a8.4 8.4 0 0 1 0 12" stroke-linecap="round"/></svg>',
    'sound-off': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" stroke-linejoin="round"/><path d="M16 9.5l5 5M21 9.5l-5 5" stroke-linecap="round"/></svg>',
    wave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 8.5c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 4.3-2 5 0M3 13c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 4.3-2 5 0M3 17.5c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 4.3-2 5 0" stroke-linecap="round"/></svg>',
    hammer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M13.5 4.2l6.3 6.3-2.3 2.3-6.3-6.3zM12.2 7.5l-7.8 7.8a2 2 0 0 0 0 2.8l1.5 1.5a2 2 0 0 0 2.8 0l7.8-7.8" stroke-linejoin="round"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h3.2c4.5 0 5.1 10 9.6 10H20M4 17h3.2c1.2 0 2.2-.7 3.1-1.7M13 8.7c.8-1 1.7-1.7 3.8-1.7H20" stroke-linecap="round"/><path d="M17.5 4l3 3-3 3M17.5 14l3 3-3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>',
    ad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
    medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="9" r="5.2"/><path d="M8.5 13.5L7 21l5-2.4L17 21l-1.5-7.5"/><path d="M10 9l1.4 1.4L14 7.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fullscreen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.3 3.4 8.5S14.3 18.1 12 20.5C9.7 18.1 8.6 15.2 8.6 12S9.7 5.9 12 3.5z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3l7 2.5v5.7c0 4.5-3 7.8-7 9.8-4-2-7-5.3-7-9.8V5.5z"/><path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M4.8 20c.6-4 3.2-6 7.2-6s6.6 2 7.2 6" stroke-linecap="round"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><path d="M12 10.5v5.5M12 7.6v.2" stroke-linecap="round"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M19 7v5h-5M5 17v-5h5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 8a7 7 0 0 1 11.5 1.5M17 16a7 7 0 0 1-11.5-1.5" stroke-linecap="round"/></svg>'
  };

  function icon(name) { return ICONS[name] || ICONS.sparkle; }
  function starSvg(on, cls) {
    return '<svg class="' + (cls || '') + (on ? ' is-on' : '') + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.4l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.3l6.6-.9z"/></svg>';
  }
  function gemImg(type, size, special) {
    var url = Renderer && Renderer.makeIconDataURL ? Renderer.makeIconDataURL(type, Math.round(size * 1.6), special) : '';
    return '<img class="gem-img" src="' + url + '" width="' + size + '" height="' + size + '" alt="" draggable="false">';
  }

  var UI = {
    current: 'boot',
    chapter: 1,
    modalOpen: false,
    modalCloseable: true,
    modalOnClose: null,
    confirmCallback: null,
    lb: null,
    lbLoading: false,
    lbError: false,
    lbFetchedAt: 0,
    coachTimer: null,
    toastCount: 0,
    _busy: false,

    init: function () {
      var self = this;
      // Подставляем иконки в статическую разметку.
      qsa('[data-icon]').forEach(function (el) {
        el.innerHTML = icon(el.getAttribute('data-icon'));
      });
      self.applyLanguage(false);
      self.chapter = clamp(Math.ceil(Save.currentLevel() / 10), 1, 6);
      self.bindEvents();
      self.refreshAll();
      self.show('boot');
      return self;
    },

    /* ------------------------------------------------------------ language */
    resolvedLang: function () {
      var pref = Save.langPref();
      if (pref === 'ru' || pref === 'en') return pref;
      var sdkLang = root.ReefSDK && root.ReefSDK.lang;
      return root.I18n.normalize(sdkLang || (root.navigator && root.navigator.language) || 'ru');
    },
    applyLanguage: function (refresh) {
      var lang = this.resolvedLang();
      root.I18n.setLang(lang);
      root.I18n.apply(document);
      document.title = t('game.title');
      if (refresh !== false) this.refreshAll();
      return lang;
    },

    /* -------------------------------------------------------------- screens */
    show: function (name) {
      this.current = name;
      qsa('.screen').forEach(function (el) {
        el.classList.toggle('is-active', el.id === 'screen-' + name);
      });
      document.body.classList.toggle('is-game', name === 'game');
      if (name === 'menu') this.refreshMenu();
      if (name === 'map') { this.refreshMap(); }
      if (name === 'shop') this.refreshShop();
      if (name === 'settings') this.refreshSettings();
      if (name === 'profile') this.refreshProfile();
      if (name === 'howto') this.refreshHowto();
      if (name === 'leaderboard') this.loadLeaderboard(false);
      if (name === 'boot') this.setBootProgress(0);
    },

    refreshAll: function () {
      this.refreshMenu();
      this.refreshCurrency();
      if (this.current === 'map') this.refreshMap();
      if (this.current === 'shop') this.refreshShop();
      if (this.current === 'settings') this.refreshSettings();
      if (this.current === 'profile') this.refreshProfile();
      if (this.current === 'howto') this.refreshHowto();
      if (this.current === 'leaderboard') this.refreshLeaderboardView();
    },

    refreshCurrency: function () {
      var coins = Save.state.coins;
      var stars = Save.totalStars();
      ['menu-coins', 'shop-coins'].forEach(function (id) { var el = $(id); if (el) el.textContent = formatNum(coins); });
      ['menu-stars', 'map-stars', 'profile-stars', 'leaderboard-stars'].forEach(function (id) {
        var el = $(id); if (el) el.textContent = formatNum(stars);
      });
      var daily = Save.dailyStatus();
      var dot = $('daily-dot');
      if (dot) dot.classList.toggle('is-on', daily.canClaim);
      var stripSub = $('daily-strip-sub');
      if (stripSub) {
        stripSub.textContent = daily.canClaim ? t('menu.dailyReady') : t('daily.next', { time: Save.timeUntilTomorrow() });
      }
    },

    refreshMenu: function () {
      var total = Save.completedLevels();
      var level = Save.currentLevel();
      var sub = $('menu-play-sub');
      if (sub) sub.textContent = total >= Levels.TOTAL_LEVELS ? t('menu.allDone') : t('menu.level', { n: level });
      var playText = $('menu-play');
      if (playText) {
        var b = playText.querySelector('b');
        if (b) b.textContent = total > 0 ? t('menu.continue') : t('menu.play');
      }
      var snd = $('menu-sound');
      if (snd) {
        var s = Save.state.settings;
        snd.innerHTML = icon((s.music || s.sfx) ? 'sound-on' : 'sound-off');
        snd.classList.toggle('is-off', !(s.music || s.sfx));
      }
      this.refreshCurrency();
    },

    /* ------------------------------------------------------------------ map */
    refreshMap: function () {
      var chapter = Levels.getChapter(this.chapter);
      if (!chapter) return;
      var lang = root.I18n.getLang();
      var chapterLocked = !Save.isChapterUnlocked(chapter.id);
      var label = $('map-chapter-label');
      if (label) label.textContent = t('map.chapterOf', { n: chapter.id, total: Levels.CHAPTERS.length });
      var title = $('chapter-title');
      if (title) title.textContent = lang === 'ru' ? chapter.title : chapter.titleEn;
      var subtitle = $('chapter-subtitle');
      if (subtitle) subtitle.textContent = lang === 'ru' ? chapter.subtitle : chapter.subtitleEn;

      var chapterStars = 0;
      for (var i = 1; i <= 10; i++) chapterStars += Save.bestStars((chapter.id - 1) * 10 + i);
      var bar = $('chapter-bar');
      if (bar) bar.style.width = Math.round(chapterStars / 30 * 100) + '%';
      var starsLabel = $('chapter-stars');
      if (starsLabel) starsLabel.textContent = t('map.chapterStars', { n: chapterStars, total: 30 });

      var dots = $('chapter-dots');
      if (dots) {
        dots.innerHTML = Levels.CHAPTERS.map(function (ch) {
          var active = ch.id === this.chapter ? ' is-active' : '';
          return '<button class="chapter-dot' + active + '" data-action="chapter-go" data-chapter="' + ch.id + '" aria-label="' + escapeHtml(t('map.chapter', { n: ch.id })) + '"></button>';
        }, this).join('');
      }

      var grid = $('level-grid');
      if (grid) {
        var html = '';
        var current = Save.currentLevel();
        for (var n = 1; n <= 10; n++) {
          var id = (chapter.id - 1) * 10 + n;
          var stars = Save.bestStars(id);
          var unlocked = !chapterLocked && Save.isLevelUnlocked(id);
          var isCurrent = id === current && unlocked;
          var cls = 'level-node';
          if (!unlocked) cls += ' is-locked';
          if (stars > 0) cls += ' is-done';
          if (isCurrent) cls += ' is-current';
          var starHtml = '';
          for (var s = 0; s < 3; s++) starHtml += starSvg(s < stars, 'node-star');
          html += '<button class="' + cls + '" data-action="level" data-level="' + id + '" aria-label="' + escapeHtml(t('common.level') + ' ' + id) + '">' +
            (unlocked ? '<b>' + id + '</b><span class="node-stars">' + starHtml + '</span>' : '<span class="node-lock">' + icon('lock') + '</span>') +
            '</button>';
        }
        grid.innerHTML = html;
      }

      var hint = $('map-hint');
      if (hint) hint.textContent = chapterLocked ? t('map.chapterLocked') : t('map.selectLevel');

      var playBtn = $('map-play');
      var playText = $('map-play-text');
      var target = this.chapterTargetLevel();
      if (playBtn) playBtn.disabled = chapterLocked || !target;
      if (playText && target) playText.textContent = t('map.play', { n: target });
      else if (playText) playText.textContent = t('common.play');
    },

    chapterTargetLevel: function () {
      if (!Save.isChapterUnlocked(this.chapter)) return null;
      var start = (this.chapter - 1) * 10 + 1;
      for (var id = start; id < start + 10; id++) {
        if ((Save.state.levels[id] | 0) === 0) return id;
      }
      return start + 9;
    },

    /* ----------------------------------------------------------------- shop */
    refreshShop: function () {
      var body = $('shop-body');
      if (!body) return;
      var items = [
        { kind: 'hammer', icon: 'hammer', price: 60 },
        { kind: 'shuffle', icon: 'shuffle', price: 40 },
        { kind: 'moves', icon: 'plus', price: 80 },
        { kind: 'wave', icon: 'wave', price: 50 }
      ];
      var html = '<div class="shop-balance"><div class="label"><small>' + t('shop.balance') + '</small>' +
        '<b><span class="icon icon-coin">' + icon('coin') + '</span><span>' + formatNum(Save.state.coins) + '</span></b></div></div>';
      html += '<div class="shop-grid">';
      items.forEach(function (item) {
        var owned = Save.state.boosters[item.kind] || 0;
        var enough = Save.state.coins >= item.price;
        html += '<div class="shop-card">' +
          '<div class="shop-card-head"><div class="shop-card-icon">' + icon(item.icon) + '</div>' +
          '<div><h3>' + t('boosters.' + item.kind + '.name') + '</h3><div class="owned">' + t('shop.owned', { n: owned }) + '</div></div></div>' +
          '<p>' + t('boosters.' + item.kind + '.desc') + '</p>' +
          '<button class="btn btn-primary btn-small" data-action="shop-buy" data-booster="' + item.kind + '"' + (enough ? '' : ' disabled') + '>' +
          icon('coin') + '<span>' + t('shop.buyFor', { n: item.price }) + '</span></button></div>';
      }, this);
      html += '</div>';
      html += '<div class="ad-box">' +
        '<div class="ad-icon">' + icon('ad') + '</div>' +
        '<div class="ad-text"><b>' + t('shop.watchAd', { n: 40 }) + '</b><small>' + t('shop.adNote') + '</small></div>' +
        '<button class="btn btn-ghost btn-small" data-action="watch-ad-coins">' + icon('play') + '<span>' + t('common.ad') + '</span></button>' +
        '</div>';
      html += '<p class="note">' + t('shop.howCoins') + '</p>';
      body.innerHTML = html;
    },

    /* ------------------------------------------------------------- settings */
    refreshSettings: function () {
      var body = $('settings-body');
      if (!body) return;
      var s = Save.state.settings;
      var pref = Save.langPref();
      var lang = this.resolvedLang();
      var html = '<div class="settings-list">';
      html += '<div class="settings-row"><span class="row-icon">' + icon('sound-on') + '</span><div class="row-text"><b>' + t('settings.music') + '</b><small>' + t('settings.audioHint') + '</small></div>' +
        '<button class="switch' + (s.music ? ' is-on' : '') + '" data-action="toggle-music" aria-label="' + t('settings.music') + '"></button></div>';
      html += '<div class="settings-row"><span class="row-icon">' + icon('sparkle') + '</span><div class="row-text"><b>' + t('settings.sfx') + '</b></div>' +
        '<button class="switch' + (s.sfx ? ' is-on' : '') + '" data-action="toggle-sfx" aria-label="' + t('settings.sfx') + '"></button></div>';
      html += '<div class="settings-row row-language"><span class="row-icon">' + icon('globe') + '</span><div class="row-text"><b>' + t('settings.language') + '</b><small>' + root.I18n.LANG_NAMES[lang] + '</small></div>' +
        '<div class="segmented">' +
        '<button data-action="lang" data-lang="auto" class="' + (pref === 'auto' ? 'is-active' : '') + '">' + t('settings.langAuto') + '</button>' +
        '<button data-action="lang" data-lang="ru" class="' + (pref === 'ru' ? 'is-active' : '') + '">RU</button>' +
        '<button data-action="lang" data-lang="en" class="' + (pref === 'en' ? 'is-active' : '') + '">EN</button>' +
        '</div></div>';
      html += '<div class="settings-row"><span class="row-icon">' + icon('fullscreen') + '</span><div class="row-text"><b>' + t('settings.fullscreen') + '</b></div>' +
        '<button class="btn btn-ghost btn-small" data-action="settings-fullscreen">' + (document.fullscreenElement ? t('settings.fullscreenExit') : t('settings.fullscreenOpen')) + '</button></div>';
      html += '</div>';
      html += '<div class="privacy-card"><h3>' + t('settings.privacy') + '</h3><p>' + t('settings.privacyText') + '</p></div>';
      html += '<button class="btn btn-danger btn-wide settings-danger" data-action="settings-reset">' + icon('refresh') + '<span>' + t('settings.reset') + '</span></button>';
      html += '<p class="version-line">' + t('settings.version', { v: (root.ReefCore && root.ReefCore.VERSION) || '1.0.0' }) + ' • ' + t('settings.credits') + '</p>';
      body.innerHTML = html;
    },

    /* ---------------------------------------------------------------- howto */
    refreshHowto: function () {
      var body = $('howto-body');
      if (!body) return;
      var line = gemImg('pearl', 34, 'lineH');
      var bomb = gemImg('star', 34, 'bomb');
      var rainbow = gemImg('bubble', 34, 'rainbow');
      var html = '<div class="howto-hero"><p>' + t('howto.intro') + '</p></div>';
      html += '<div class="howto-steps">';
      html += '<div class="howto-step"><div class="howto-num">1</div><div><h3>' + t('howto.step1.title') + '</h3><p>' + t('howto.step1.text') + '</p></div></div>';
      html += '<div class="howto-step"><div class="howto-num">2</div><div><h3>' + t('howto.step2.title') + '</h3><p>' + t('howto.step2.text') + '</p></div></div>';
      html += '<div class="howto-step"><div class="howto-num">3</div><div><h3>' + t('howto.step3.title') + '</h3><p>' + t('howto.step3.text') + '</p></div></div>';
      html += '</div>';
      html += '<div class="specials-card"><h3>' + t('howto.specials.title') + '</h3>' +
        '<div class="special-row"><div class="special-chip">' + line + '</div><p>' + t('howto.special.line') + '</p></div>' +
        '<div class="special-row"><div class="special-chip">' + bomb + '</div><p>' + t('howto.special.bomb') + '</p></div>' +
        '<div class="special-row"><div class="special-chip">' + rainbow + '</div><p>' + t('howto.special.rainbow') + '</p></div>' +
        '</div>';
      html += '<p class="howto-tip">' + t('howto.combos') + '<br>' + t('howto.tip') + '</p>';
      html += '<button class="btn btn-primary btn-wide" data-action="howto-close">' + t('howto.gotit') + '</button>';
      body.innerHTML = html;
    },

    /* ------------------------------------------------------------- profile */
    refreshProfile: function () {
      var body = $('profile-body');
      if (!body) return;
      var list = Save.achievementsList();
      var done = list.filter(function (a) { return a.unlocked; }).length;
      var html = '<div class="profile-summary">' +
        '<div class="summary-cell"><b>' + Save.totalStars() + '</b><small>' + t('common.stars') + '</small></div>' +
        '<div class="summary-cell"><b>' + Save.completedLevels() + '/' + Levels.TOTAL_LEVELS + '</b><small>' + t('common.levels') + '</small></div>' +
        '<div class="summary-cell"><b>' + Save.state.stats.wins + '</b><small>' + t('achievements.wins') + '</small></div>' +
        '</div>';
      html += '<p class="note" style="margin-top:0;margin-bottom:10px">' + t('achievements.progress', { done: done, total: list.length }) + '</p>';
      html += '<div class="ach-grid">';
      list.forEach(function (a) {
        html += '<div class="ach-card' + (a.unlocked ? ' is-unlocked' : '') + '">' +
          '<div class="ach-medal">' + icon(a.unlocked ? 'medal' : 'lock') + '</div>' +
          '<div class="ach-text"><b>' + t('ach.' + a.id + '.title') + '</b><small>' + t('ach.' + a.id + '.desc') + '</small></div>' +
          '<div class="ach-reward">' + icon('coin') + a.reward + '</div>' +
          '</div>';
      });
      html += '</div>';
      body.innerHTML = html;
    },

    /* ---------------------------------------------------------- leaderboard */
    loadLeaderboard: function (force) {
      var self = this;
      if (self.lbLoading) return;
      if (!force && self.lb && Date.now() - self.lbFetchedAt < 60000) {
        if (self.current === 'leaderboard') self.refreshLeaderboardView();
        return;
      }
      if (!root.ReefSDK.available) {
        self.lb = null;
        self.lbError = false;
        self.refreshLeaderboardView();
        return;
      }
      self.lbLoading = true;
      self.lbError = false;
      self.refreshLeaderboardView();
      root.ReefSDK.getLeaderboard().then(function (result) {
        self.lbLoading = false;
        if (!result) { self.lbError = true; }
        else { self.lb = result; self.lbFetchedAt = Date.now(); }
        self.refreshLeaderboardView();
        if (root.ReefSDK.authorized) {
          root.ReefSDK.setLeaderboardScore(Save.totalStars());
        }
      }).catch(function () {
        self.lbLoading = false;
        self.lbError = true;
        self.refreshLeaderboardView();
      });
    },

    refreshLeaderboardView: function () {
      var body = $('leaderboard-body');
      if (!body) return;
      var sdk = root.ReefSDK;
      if (!sdk.available) {
        body.innerHTML = '<div class="lb-empty">' + t('leaderboard.localOnly', { n: Save.totalStars() }) + '</div>';
        return;
      }
      if (this.lbLoading) {
        body.innerHTML = '<div class="lb-loader">' + t('leaderboard.loading') + '</div>';
        return;
      }
      if (this.lbError || !this.lb) {
        body.innerHTML = '<div class="lb-empty">' + t('leaderboard.error') + '</div>' +
          '<button class="btn btn-ghost btn-wide" data-action="lb-retry">' + icon('refresh') + '<span>' + t('common.retry') + '</span></button>';
        return;
      }
      var entries = this.lb.entries || [];
      var html = '';
      if (this.lb.userRank > 0) {
        html += '<p class="note" style="margin:0 0 8px">' + t('leaderboard.yourPlace', { n: this.lb.userRank }) + '</p>';
      }
      if (!entries.length) {
        html += '<div class="lb-empty">' + t('leaderboard.empty') + '</div>';
      } else {
        html += '<div class="leaderboard-card">';
        entries.forEach(function (entry, index) {
          var player = entry.player || {};
          var name = player.publicName || t('leaderboard.player');
          if (name === 'Пользователь скрыт' || name === 'Hidden user') name = t('leaderboard.player');
          var avatar = '';
          try {
            if (typeof player.getAvatarSrc === 'function') avatar = player.getAvatarSrc('small') || '';
          } catch (e) { avatar = ''; }
          var isMe = false;
          try {
            isMe = !!(sdk.player && player.uniqueID && sdk.player.getUniqueID && player.uniqueID === sdk.player.getUniqueID());
          } catch (e) { isMe = false; }
          var rank = entry.rank || (index + 1);
          html += '<div class="lb-row' + (isMe ? ' is-me' : '') + '">' +
            '<div class="lb-rank">' + rank + '</div>' +
            '<div class="lb-avatar">' + (avatar ? '<img src="' + escapeHtml(avatar) + '" alt="" loading="lazy">' : escapeHtml(name.charAt(0).toUpperCase())) + '</div>' +
            '<div class="lb-name">' + escapeHtml(name) + (isMe ? '<small>' + t('leaderboard.you') + '</small>' : '') + '</div>' +
            '<div class="lb-score">' + icon('star') + '<span>' + formatNum(entry.score || 0) + '</span></div>' +
            '</div>';
        });
        html += '</div>';
      }
      if (!sdk.authorized) {
        html += '<div class="lb-login-box"><p>' + t('leaderboard.loginWhy') + '</p>' +
          '<button class="btn btn-primary" data-action="lb-login">' + icon('user') + '<span>' + t('leaderboard.login') + '</span></button></div>';
      }
      body.innerHTML = html;
    },

    /* --------------------------------------------------------------- modals */
    openModal: function (html, opts) {
      opts = opts || {};
      var rootEl = $('modal-root');
      if (!rootEl) return;
      this.closeModal(true);
      var closeable = opts.closeable !== false;
      this.modalOpen = true;
      this.modalCloseable = closeable;
      this.modalOnClose = opts.onClose || null;
      document.body.classList.add('has-modal');
      var closeBtn = closeable ? '<button class="modal-close" data-action="close-modal" aria-label="' + t('common.close') + '">' + icon('close') + '</button>' : '';
      rootEl.innerHTML = '<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true">' + closeBtn + html + '</div></div>';
      var backdrop = rootEl.firstElementChild;
      requestAnimationFrame(function () { backdrop.classList.add('is-open'); });
      if (closeable) {
        backdrop.addEventListener('click', function (e) {
          if (e.target === backdrop) UI.closeModal();
        });
      }
      setTimeout(function () {
        var first = rootEl.querySelector('.modal button, .modal [data-action]');
        if (first) first.focus({ preventScroll: true });
      }, 80);
    },

    closeModal: function (silent) {
      var rootEl = $('modal-root');
      if (!rootEl) return;
      var wasOpen = this.modalOpen;
      this.modalOpen = false;
      document.body.classList.remove('has-modal');
      var cb = this.modalOnClose;
      this.modalOnClose = null;
      this._modalToken = (this._modalToken || 0) + 1;
      var token = this._modalToken;
      if (rootEl.innerHTML) {
        var backdrop = rootEl.firstElementChild;
        if (backdrop && !silent) {
          backdrop.classList.remove('is-open');
          setTimeout(function () {
            if (token === UI._modalToken) rootEl.innerHTML = '';
          }, 220);
        } else {
          rootEl.innerHTML = '';
        }
      }
      if (wasOpen && cb && !silent) cb();
    },

    toast: function (text, type, ms) {
      var rootEl = $('toast-root');
      if (!rootEl) return;
      var div = document.createElement('div');
      div.className = 'toast' + (type === 'gold' ? ' is-gold' : '') + (type === 'error' ? ' is-error' : '');
      div.textContent = text;
      rootEl.appendChild(div);
      this.toastCount++;
      while (rootEl.children.length > 3) rootEl.removeChild(rootEl.firstChild);
      setTimeout(function () {
        div.classList.add('is-out');
        setTimeout(function () { if (div.parentNode) div.parentNode.removeChild(div); }, 300);
      }, ms || 2300);
    },

    showCoach: function (text, ms) {
      var bubble = $('coach-bubble');
      if (!bubble) return;
      bubble.hidden = false;
      bubble.textContent = text;
      if (this.coachTimer) clearTimeout(this.coachTimer);
      if (ms) {
        this.coachTimer = setTimeout(function () { bubble.hidden = true; }, ms);
      }
    },
    hideCoach: function () {
      var bubble = $('coach-bubble');
      if (bubble) bubble.hidden = true;
      if (this.coachTimer) { clearTimeout(this.coachTimer); this.coachTimer = null; }
    },

    combo: function (n) {
      var el = $('combo-banner');
      if (!el) return;
      el.textContent = n >= 3 ? t('hud.cascade', { n: n }) : t('hud.combo', { n: n });
      el.classList.add('is-on');
      if (this._comboTimer) clearTimeout(this._comboTimer);
      this._comboTimer = setTimeout(function () { el.classList.remove('is-on'); }, 900);
    },

    setBootProgress: function (pct, text) {
      var bar = $('boot-progress');
      if (bar) bar.style.width = clamp(pct, 0, 100) + '%';
      var loader = $('boot-loader');
      if (loader) loader.setAttribute('aria-valuenow', Math.round(clamp(pct, 0, 100)));
      var status = $('boot-status');
      if (status && text) status.textContent = text;
    },

    /* ----------------------------------------------------------- level intro */
    levelIntro: function (levelId) {
      var self = this;
      var level = Levels.getLevel(levelId);
      if (!level) return;
      if (!Save.isLevelUnlocked(levelId)) {
        self.toast(t('map.levelLocked'), 'error');
        return;
      }
      var ch = Levels.getChapter(level.chapter);
      var lang = root.I18n.getLang();
      var best = Save.bestStars(levelId);
      var rows = '';
      Object.keys(level.goals.collect).forEach(function (type) {
        rows += '<div class="level-goal-row"><div class="goal-icon">' + gemImg(type, 30) + '</div><b>' + t('goal.collect', { type: t('gem.' + type) }) + '</b><span>' + level.goals.collect[type] + '</span></div>';
      });
      if (level.goals.algae > 0) {
        rows += '<div class="level-goal-row"><div class="goal-icon">' + gemImg('algae', 30) + '</div><b>' + t('goal.algae') + '</b><span>' + level.goals.algae + '</span></div>';
      }
      var starsHtml = '';
      for (var s = 0; s < 3; s++) starsHtml += '<span class="star-slot' + (s < best ? ' is-on' : '') + '">' + icon('star') + '</span>';
      var html = '<div class="level-intro-head">' +
        '<div class="level-badge"><small>' + t('hud.level') + '</small><b>' + level.id + '</b></div>' +
        '<div><h2>' + (lang === 'ru' ? ch.title : ch.titleEn) + '</h2><p>' + (lang === 'ru' ? ch.subtitle : ch.subtitleEn) + '</p></div>' +
        '</div>' +
        '<div class="level-goals">' + rows + '</div>' +
        '<div class="level-stars-preview">' + starsHtml + '</div>' +
        '<p class="star-caption">★★ ' + level.star2 + ' • ★★★ ' + level.star3 + '</p>' +
        '<div class="result-lines" style="margin-top:12px">' +
        '<div class="result-line"><span>' + t('level.moves') + '</span><b>' + level.moves + '</b></div>' +
        (best > 0 ? '<div class="result-line"><span>' + t('map.best') + '</span><b>' + best + ' ★</b></div>' : '') +
        '</div>' +
        '<div class="modal-actions">' +
        '<button class="btn btn-primary" data-action="level-start" data-level="' + level.id + '">' + icon('play') + '<span>' + t('level.start') + '</span></button>' +
        '<button class="btn btn-ghost" data-action="close-modal">' + t('common.cancel') + '</button>' +
        '</div>';
      self.openModal(html);
    },

    /* --------------------------------------------------------------- daily */
    daily: function () {
      var self = this;
      var st = Save.dailyStatus();
      var day = ((Math.max(1, st.streak) - 1) % 7) + 1;
      var calendar = '';
      for (var i = 1; i <= 7; i++) {
        var coins = 25 + (i - 1) * 5;
        var cls = 'day-cell';
        if (st.claimedToday && i <= day) cls += ' is-past';
        if (i === day) cls += ' is-today';
        calendar += '<div class="' + cls + '"><small>' + i + '</small><b>' + coins + '</b>' +
          (i === 7 ? '<span class="day-gift">' + icon('gift') + '</span>' : '') + '</div>';
      }
      var actions = '';
      if (st.canClaim) {
        actions = '<button class="btn btn-primary" data-action="daily-claim">' + icon('gift') + '<span>' + t('daily.claim') + '</span></button>';
      } else {
        actions = '<div class="lb-empty" style="padding:10px 0">' + t('daily.done') + '<br><small>' + t('daily.next', { time: Save.timeUntilTomorrow() }) + '</small></div>';
        var canDouble = Save.state.daily.lastCoins > 0 && Save.state.daily.doubled !== Save.state.daily.last;
        if (canDouble) {
          actions += '<button class="btn btn-coral" data-action="daily-double">' + icon('ad') + '<span>' + t('daily.double') + '</span></button>';
        }
      }
      var html = '<div class="modal-icon">' + icon('gift') + '</div>' +
        '<h2>' + t('daily.title') + '</h2>' +
        '<p class="modal-sub">' + t('daily.subtitle') + '</p>' +
        '<p class="daily-streak">' + t('daily.streak', { n: st.streak }) + '</p>' +
        '<div class="daily-calendar">' + calendar + '</div>' +
        '<div class="modal-actions">' + actions + '</div>';
      self.openModal(html);
    },

    /* --------------------------------------------------------------- pause */
    pauseModal: function () {
      var s = Save.state.settings;
      var soundOn = s.music || s.sfx;
      var html = '<div class="modal-icon">' + icon('pause') + '</div>' +
        '<h2>' + t('pause.title') + '</h2>' +
        '<p class="modal-sub">' + t('game.tagline') + '</p>' +
        '<div class="pause-grid">' +
        '<button class="btn btn-primary btn-wide" data-action="pause-resume">' + icon('play') + '<span>' + t('pause.resume') + '</span></button>' +
        '<button class="btn btn-ghost" data-action="pause-restart">' + icon('refresh') + '<span>' + t('pause.restart') + '</span></button>' +
        '<button class="btn btn-ghost" data-action="pause-map">' + icon('map') + '<span>' + t('common.map') + '</span></button>' +
        '<button class="btn btn-ghost btn-wide" data-action="pause-sound">' + icon(soundOn ? 'sound-on' : 'sound-off') + '<span>' + t('pause.sound') + ': ' + (soundOn ? t('common.on') : t('common.off')) + '</span></button>' +
        '</div>';
      this.openModal(html, { closeable: false });
    },

    /* -------------------------------------------------------------- result */
    resultModal: function (data) {
      var self = this;
      self.lastResult = data;
      var win = data.won;
      var stars = data.stars || 0;
      var starHtml = '';
      for (var i = 0; i < 3; i++) {
        starHtml += '<span class="result-star' + (i < stars ? ' is-on' : '') + '" style="animation-delay:' + (i * 0.14) + 's">' + icon('star') + '</span>';
      }
      var html = '<div class="modal-icon" style="color:' + (win ? 'var(--gold)' : 'var(--coral)') + '">' + icon(win ? 'trophy' : 'info') + '</div>' +
        '<h2>' + (win ? t('result.win') : t('result.lose')) + '</h2>' +
        '<p class="modal-sub">' + (win ? (data.lastLevel ? t('result.lastLevel') : t('game.tagline')) : t('result.outOfMoves')) + '</p>';
      if (win) {
        html += '<div class="result-stars">' + starHtml + '</div>';
        if (data.newBest) html += '<div style="text-align:center"><span class="new-best">' + t('result.newBest') + '</span></div>';
        html += '<div class="result-lines">' +
          '<div class="result-line"><span>' + t('result.score') + '</span><b>' + formatNum(data.score) + '</b></div>' +
          '<div class="result-line"><span>' + t('result.coins') + '</span><b class="coin-inline">' + icon('coin') + '+' + formatNum(data.coins) + '</b></div>' +
          '</div>';
        html += '<div class="modal-actions">';
        if (data.coins > 0) {
          html += '<button class="btn btn-coral" data-action="result-double">' + icon('ad') + '<span>' + t('result.double') + '</span></button>';
        }
        html += '<button class="btn btn-primary" data-action="result-next">' + icon('arrow-right') + '<span>' + (data.lastLevel ? t('result.map') : t('result.next')) + '</span></button>';
        html += '<button class="btn btn-ghost" data-action="result-retry">' + t('result.retry') + '</button>';
        if (!data.lastLevel) html += '<button class="btn btn-ghost" data-action="result-map">' + t('result.map') + '</button>';
        html += '</div>';
      } else {
        html += '<div class="modal-actions">' +
          '<button class="btn btn-primary" data-action="result-continue">' + icon('plus') + '<span>' + t('result.continue', { n: 25 }) + '</span></button>' +
          '<button class="btn btn-ghost" data-action="result-ad-booster">' + icon('ad') + '<span>' + t('result.adBooster') + '</span></button>' +
          '<button class="btn btn-ghost" data-action="result-retry">' + t('result.retry') + '</button>' +
          '<button class="btn btn-ghost" data-action="result-map">' + t('result.map') + '</button>' +
          '</div>';
      }
      self.openModal(html, { closeable: false });
    },

    /* --------------------------------------------------------------- auth */
    authModal: function () {
      var available = root.ReefSDK.available;
      var html = '<div class="modal-icon">' + icon('user') + '</div>' +
        '<h2>' + t('auth.title') + '</h2>' +
        '<div class="tutorial-list">' +
        '<div class="tutorial-line"><span class="tick">1</span><span>' + t('auth.benefit1') + '</span></div>' +
        '<div class="tutorial-line"><span class="tick">2</span><span>' + t('auth.benefit2') + '</span></div>' +
        '</div>' +
        '<p class="modal-note">' + t('auth.onlyYandex') + '</p>' +
        '<div class="modal-actions">' +
        (available ? '<button class="btn btn-primary" data-action="auth-login">' + icon('user') + '<span>' + t('auth.login') + '</span></button>' : '') +
        '<button class="btn btn-ghost" data-action="auth-later">' + t('auth.later') + '</button>' +
        '</div>';
      this.openModal(html);
    },

    tutorial: function () {
      var html = '<div class="modal-icon">' + icon('sparkle') + '</div>' +
        '<h2>' + t('tutorial.title') + '</h2>' +
        '<p class="modal-sub">' + t('tutorial.text') + '</p>' +
        '<div class="tutorial-art">' +
        '<div class="tutorial-gem">' + gemImg('pearl', 34) + '</div>' +
        '<div class="tutorial-gem">' + gemImg('coral', 34) + '</div>' +
        '<div class="tutorial-gem">' + gemImg('star', 34) + '</div>' +
        '</div>' +
        '<div class="tutorial-list">' +
        '<div class="tutorial-line"><span class="tick">1</span><span>' + t('tutorial.tip1') + '</span></div>' +
        '<div class="tutorial-line"><span class="tick">2</span><span>' + t('tutorial.tip2') + '</span></div>' +
        '<div class="tutorial-line"><span class="tick">3</span><span>' + t('tutorial.tip3') + '</span></div>' +
        '</div>' +
        '<div class="modal-actions">' +
        '<button class="btn btn-primary" data-action="tutorial-start">' + icon('play') + '<span>' + t('tutorial.start') + '</span></button>' +
        '<button class="btn btn-ghost" data-action="tutorial-skip">' + t('tutorial.skip') + '</button>' +
        '</div>';
      this.openModal(html, { closeable: false });
    },

    confirm: function (opts) {
      opts = opts || {};
      var html = '<div class="modal-icon" style="color:var(--coral)">' + icon('info') + '</div>' +
        '<h2>' + escapeHtml(opts.title || '') + '</h2>' +
        '<p class="modal-sub">' + escapeHtml(opts.text || '') + '</p>' +
        '<div class="modal-actions">' +
        '<button class="btn ' + (opts.danger ? 'btn-danger' : 'btn-primary') + '" data-action="confirm-yes">' + escapeHtml(opts.confirmText || t('common.confirm')) + '</button>' +
        '<button class="btn btn-ghost" data-action="confirm-no">' + escapeHtml(opts.cancelText || t('common.cancel')) + '</button>' +
        '</div>';
      this.confirmCallback = opts.onConfirm || null;
      this.openModal(html, { closeable: false });
    },

    /* ------------------------------------------------------------------ hud */
    refreshHUD: function (game) {
      if (!game) return;
      var lvl = $('hud-level'); if (lvl) lvl.textContent = game.level.id;
      var score = $('hud-score'); if (score) score.textContent = formatNum(game.score);
      var moves = $('hud-moves'); if (moves) moves.textContent = game.movesLeft;
      var movesWrap = $('moves-stat');
      if (movesWrap) movesWrap.classList.toggle('is-low', game.movesLeft <= 3);
      var goals = $('goals-list');
      if (goals) {
        var info = game.goalInfo();
        goals.innerHTML = info.map(function (g) {
          var done = g.done >= g.target;
          var iconHtml = g.kind === 'algae' ? gemImg('algae', 26) : gemImg(g.type, 26);
          var label = g.kind === 'algae' ? t('gemShort.algae') : t('gemShort.' + g.type);
          return '<div class="goal-item' + (done ? ' is-done' : '') + '">' +
            '<div class="goal-icon">' + iconHtml + '</div>' +
            '<div class="goal-text"><b>' + escapeHtml(label) + '</b><small>' + g.done + ' / ' + g.target + '</small></div>' +
            (done ? '<span class="goal-check">' + icon('check') + '</span>' : '') +
            '</div>';
        }).join('');
      }
      this.refreshWave(game);
      this.refreshBoosters();
    },

    refreshWave: function (game) {
      var pct = Math.round(clamp(game.wave, 0, 100));
      var fill = $('wave-fill');
      if (fill) fill.style.height = pct + '%';
      var label = $('wave-pct');
      if (label) label.textContent = pct + '%';
      var btn = $('wave-btn');
      if (btn) {
        btn.classList.toggle('is-ready', pct >= 100);
        btn.disabled = pct < 100 || !game || game.status !== 'playing';
      }
    },

    setWaveTargeting: function (on) {
      var btn = $('wave-btn');
      if (btn) btn.classList.toggle('is-targeting', !!on);
    },

    refreshBoosters: function () {
      var bar = $('booster-bar');
      if (!bar) return;
      var sig = root.I18n.getLang() + '|' + ['hammer', 'shuffle', 'moves', 'wave'].map(function (k) { return Save.state.boosters[k] || 0; }).join('|');
      if (this._boosterSig === sig && bar.children.length) return;
      this._boosterSig = sig;
      var items = [
        { kind: 'hammer', icon: 'hammer' },
        { kind: 'shuffle', icon: 'shuffle' },
        { kind: 'moves', icon: 'plus' },
        { kind: 'wave', icon: 'wave' }
      ];
      bar.innerHTML = items.map(function (b) {
        var count = Save.state.boosters[b.kind] || 0;
        return '<button class="booster-btn' + (count ? '' : ' is-empty') + '" data-action="booster" data-booster="' + b.kind + '" aria-label="' + escapeHtml(t('boosters.' + b.kind + '.name')) + '">' +
          icon(b.icon) + '<span>' + escapeHtml(t('boosters.' + b.kind + '.name')) + '</span>' +
          '<b class="booster-count">' + count + '</b></button>';
      }).join('');
    },

    setBusy: function (busy) {
      this._busy = !!busy;
      qsa('.booster-btn').forEach(function (btn) { btn.classList.toggle('is-disabled', busy); });
      var wave = $('wave-btn');
      if (wave) { if (busy) wave.classList.add('is-disabled'); else wave.classList.remove('is-disabled'); }
    },

    /* --------------------------------------------------------------- actions */
    bindEvents: function () {
      var self = this;
      document.addEventListener('click', function (e) {
        var el = e.target.closest('[data-action]');
        if (!el) return;
        var action = el.getAttribute('data-action');
        self.handleAction(action, el, e);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          if (self.modalOpen && self.modalCloseable) { self.closeModal(); return; }
          if (self.current === 'game' && root.ReefGame && root.ReefGame.isPlaying()) root.ReefGame.pause();
        }
      });
      // Первое касание — запуск звука.
      document.addEventListener('pointerdown', function () {
        if (root.ReefAudio) root.ReefAudio.unlock();
      }, { once: true });
      document.addEventListener('keydown', function () {
        if (root.ReefAudio) root.ReefAudio.unlock();
      }, { once: true });
      document.addEventListener('fullscreenchange', function () {
        if (self.current === 'settings') self.refreshSettings();
      });
    },

    handleAction: function (action, el, event) {
      var self = this;
      var Game = root.ReefGame;
      switch (action) {
        case 'play':
          if (Game) Game.startFromMenu();
          break;
        case 'map': self.show('map'); break;
        case 'shop': self.show('shop'); break;
        case 'settings': self.show('settings'); break;
        case 'profile': self.show('profile'); break;
        case 'howto': self.show('howto'); break;
        case 'leaderboard': self.show('leaderboard'); break;
        case 'menu': if (Game) Game.exitToMenu(); else self.show('menu'); break;
        case 'daily': self.daily(); break;
        case 'sound': self.toggleSound(); break;
        case 'chapter-prev':
          self.chapter = self.chapter <= 1 ? 6 : self.chapter - 1;
          self.refreshMap();
          break;
        case 'chapter-next':
          self.chapter = self.chapter >= 6 ? 1 : self.chapter + 1;
          self.refreshMap();
          break;
        case 'chapter-go':
          self.chapter = Number(el.getAttribute('data-chapter')) || 1;
          self.refreshMap();
          break;
        case 'level': {
          var id = Number(el.getAttribute('data-level'));
          if (Save.isLevelUnlocked(id) && Save.isChapterUnlocked(Math.ceil(id / 10))) self.levelIntro(id);
          else self.toast(t('map.levelLocked'), 'error');
          break;
        }
        case 'play-current': {
          var target = self.chapterTargetLevel();
          if (target) self.levelIntro(target);
          break;
        }
        case 'level-start': {
          var lid = Number(el.getAttribute('data-level'));
          self.closeModal(true);
          if (Game) Game.startLevel(lid, { from: 'map' });
          break;
        }
        case 'close-modal': self.closeModal(); break;
        case 'pause': if (Game && Game.isPlaying()) Game.pause(); break;
        case 'wave': if (Game) Game.toggleWave(); break;
        case 'booster': if (Game) Game.useBooster(el.getAttribute('data-booster')); break;
        case 'pause-resume': if (Game) Game.resume(); break;
        case 'pause-restart': if (Game) Game.restart(); break;
        case 'pause-map': if (Game) Game.exitToMap(); break;
        case 'pause-sound':
          self.toggleSound();
          if (Game && Game.isPaused()) self.pauseModal();
          break;
        case 'result-next': if (Game) Game.nextLevel(); break;
        case 'result-retry': if (Game) Game.restart(); break;
        case 'result-map': if (Game) Game.exitToMap(); break;
        case 'result-continue': if (Game) Game.continueWithMoves(); break;
        case 'result-double': self.doubleResultReward(); break;
        case 'result-ad-booster': self.resultAdBooster(); break;
        case 'daily-claim': self.claimDaily(); break;
        case 'daily-double': self.doubleDaily(); break;
        case 'shop-buy': self.buyBooster(el.getAttribute('data-booster')); break;
        case 'watch-ad-coins': self.watchAdCoins(); break;
        case 'toggle-music': Save.setSetting('music', !Save.state.settings.music); root.ReefAudio.setSettings(Save.state.settings); self.refreshSettings(); self.refreshMenu(); break;
        case 'toggle-sfx': Save.setSetting('sfx', !Save.state.settings.sfx); root.ReefAudio.setSettings(Save.state.settings); self.refreshSettings(); self.refreshMenu(); break;
        case 'lang': self.changeLanguage(el.getAttribute('data-lang')); break;
        case 'settings-fullscreen': self.toggleFullscreen(); break;
        case 'settings-reset':
          self.confirm({
            title: t('settings.reset'),
            text: t('settings.resetConfirm'),
            danger: true,
            onConfirm: function () {
              Save.reset();
              self.applyLanguage();
              self.refreshAll();
              self.toast(t('settings.resetDone'));
            }
          });
          break;
        case 'howto-close': self.show('menu'); break;
        case 'tutorial-start':
        case 'tutorial-skip':
          Save.state.tutorialSeen = true;
          Save.save(false);
          self.closeModal();
          break;
        case 'auth-login': self.login(); break;
        case 'auth-later': self.closeModal(); break;
        case 'lb-login': self.authModal(); break;
        case 'lb-retry': self.loadLeaderboard(true); break;
        case 'confirm-yes': {
          var cb = self.confirmCallback;
          self.confirmCallback = null;
          self.closeModal(true);
          if (cb) cb();
          break;
        }
        case 'confirm-no':
          self.confirmCallback = null;
          self.closeModal();
          break;
        default:
          break;
      }
    },

    toggleSound: function () {
      var s = Save.state.settings;
      var on = !(s.music || s.sfx);
      s.music = on;
      s.sfx = on;
      Save.save(false);
      root.ReefAudio.setSettings(s);
      this.refreshMenu();
      if (this.current === 'settings') this.refreshSettings();
      this.toast(on ? t('common.on') : t('common.off'));
    },

    changeLanguage: function (lang) {
      if (lang !== 'auto' && lang !== 'ru' && lang !== 'en') return;
      Save.setSetting('lang', lang);
      this.applyLanguage();
      this.toast(t('toast.langChanged'));
    },

    toggleFullscreen: function () {
      try {
        if (!document.fullscreenElement) {
          var p = document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
          if (p && p.catch) p.catch(function () { UI.toast(t('toast.fullscreenFail'), 'error'); });
        } else if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      } catch (e) {
        this.toast(t('toast.fullscreenFail'), 'error');
      }
    },

    buyBooster: function (kind) {
      var prices = { hammer: 60, shuffle: 40, moves: 80, wave: 50 };
      var price = prices[kind];
      if (!price) return;
      if (Save.state.coins < price) { this.toast(t('shop.notEnough'), 'error'); return; }
      Save.spendCoins(price);
      Save.addBooster(kind, 1);
      root.ReefAudio.sfx('coin');
      this.toast(t('shop.purchased', { name: t('boosters.' + kind + '.name') }), 'gold');
      this.refreshShop();
      this.refreshCurrency();
      this.refreshMenu();
    },

    watchAdCoins: function () {
      var self = this;
      self.watchRewarded(function () {
        Save.addCoins(40);
        Save.save(true);
        self.refreshShop();
        self.refreshCurrency();
        self.refreshMenu();
        self.toast(t('toast.coins', { n: 40 }), 'gold');
        root.ReefAudio.sfx('coin');
      });
    },

    claimDaily: function () {
      var res = Save.claimDaily();
      if (!res.ok) { this.toast(t('toast.alreadyClaimed'), 'error'); return; }
      root.ReefAudio.sfx('daily');
      this.toast(res.booster ? t('daily.claimedBooster') : t('daily.claimed', { n: res.coins }), 'gold');
      this.checkAchievements();
      this.refreshAll();
      this.daily();
    },

    doubleDaily: function () {
      var self = this;
      self.watchRewarded(function () {
        var res = Save.doubleDaily();
        if (!res.ok) { self.toast(t('toast.alreadyClaimed'), 'error'); return; }
        self.toast(t('toast.coins', { n: res.coins }), 'gold');
        root.ReefAudio.sfx('coin');
        self.refreshAll();
        self.daily();
      });
    },

    doubleResultReward: function () {
      var self = this;
      var data = self.lastResult;
      if (!data || !data.coins) return;
      self.watchRewarded(function () {
        Save.addCoins(data.coins);
        Save.save(true);
        data.coins *= 2;
        self.toast(t('result.doubleDone'), 'gold');
        root.ReefAudio.sfx('coin');
        self.refreshCurrency();
        self.refreshMenu();
        var btn = qs('[data-action="result-double"]');
        if (btn) { btn.disabled = true; btn.querySelector('span').textContent = t('result.doubleDone'); }
        var lines = qsa('.result-line');
        if (lines.length > 1) {
          var coinLine = lines[1].querySelector('b');
          if (coinLine) coinLine.innerHTML = icon('coin') + '+' + formatNum(data.coins);
        }
      });
    },

    resultAdBooster: function () {
      var self = this;
      self.watchRewarded(function () {
        Save.addBooster('hammer', 1);
        Save.save(true);
        self.toast(t('toast.booster', { name: t('boosters.hammer.name') }), 'gold');
        self.closeModal(true);
        if (root.ReefGame) root.ReefGame.resumeFromAdReward();
      });
    },

    watchRewarded: function (onReward) {
      var self = this;
      if (!root.ReefSDK.available) {
        self.toast(t('toast.noAds'), 'error');
        return;
      }
      root.ReefAudio.pause();
      root.ReefSDK.showRewarded().then(function (res) {
        root.ReefAudio.resume();
        if (res.rewarded) {
          onReward();
        } else if (!res.shown) {
          self.toast(t('toast.adUnavailable'), 'error');
        }
      });
    },

    login: function () {
      var self = this;
      if (!root.ReefSDK.available) { self.toast(t('toast.noAds'), 'error'); return; }
      root.ReefSDK.auth().then(function (ok) {
        if (!ok) { self.toast(t('auth.fail'), 'error'); return; }
        root.ReefSDK.loadCloud().then(function (cloud) {
          if (cloud) Save.mergeCloud(cloud);
          Save.flushCloud();
          root.ReefSDK.setLeaderboardScore(Save.totalStars());
          self.closeModal(true);
          self.applyLanguage();
          self.refreshAll();
          self.loadLeaderboard(true);
          self.toast(t('auth.success'), 'gold');
        });
      });
    },

    checkAchievements: function () {
      var unlocked = Save.checkAchievements();
      var self = this;
      unlocked.forEach(function (a, i) {
        setTimeout(function () {
          self.toast(t('ach.' + a.id + '.title') + ' +' + a.reward + ' ' + t('common.coins'), 'gold', 3000);
          root.ReefAudio.sfx('coin');
        }, i * 450);
      });
      if (unlocked.length) this.refreshCurrency();
      return unlocked;
    }
  };

  root.ReefUI = UI;
})(typeof globalThis !== 'undefined' ? globalThis : this);

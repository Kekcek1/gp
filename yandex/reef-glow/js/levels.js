/* ==========================================================================
   Сияние рифа / Reef Glow — 60 уровней, 6 глав.
   Данные детерминированы: одинаковый уровень всегда собирается одинаково.
   ========================================================================== */
(function (root, factory) {
  'use strict';
  var core = root && root.ReefCore;
  if (!core && typeof require === 'function') core = require('./core.js');
  var api = factory(core);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ReefLevels = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Core) {
  'use strict';

  var ROWS = 8, COLS = 8;

  var CHAPTERS = [
    {
      id: 1, key: 'ch1', title: 'Мелководье', titleEn: 'Shallows',
      subtitle: 'Первые лучи света', subtitleEn: 'First rays of light',
      colors: 5, accent: '#6ff2d0', maxAlgae: 10, goalMult: 1.0, moveDelta: 0, algaeBonus: 0
    },
    {
      id: 2, key: 'ch2', title: 'Коралловые сады', titleEn: 'Coral Gardens',
      subtitle: 'Сад просыпается', subtitleEn: 'The garden awakens',
      colors: 5, accent: '#ff8fb1', maxAlgae: 16, goalMult: 1.15, moveDelta: -1, algaeBonus: 4
    },
    {
      id: 3, key: 'ch3', title: 'Грот эха', titleEn: 'Echo Grotto',
      subtitle: 'Свет возвращается', subtitleEn: 'Light returns',
      colors: 6, accent: '#9d8cff', maxAlgae: 18, goalMult: 1.25, moveDelta: -2, algaeBonus: 6
    },
    {
      id: 4, key: 'ch4', title: 'Лунная лагуна', titleEn: 'Moon Lagoon',
      subtitle: 'Тихая глубина', subtitleEn: 'The quiet deep',
      colors: 6, accent: '#7cc7ff', maxAlgae: 20, goalMult: 1.3, moveDelta: -2, algaeBonus: 8
    },
    {
      id: 5, key: 'ch5', title: 'Тёмный жёлоб', titleEn: 'Dark Trench',
      subtitle: 'Испытание тишиной', subtitleEn: 'A trial in silence',
      colors: 6, accent: '#ffc857', maxAlgae: 22, goalMult: 1.35, moveDelta: -3, algaeBonus: 8
    },
    {
      id: 6, key: 'ch6', title: 'Сердце рифа', titleEn: 'Heart of the Reef',
      subtitle: 'Сияние для всех', subtitleEn: 'Glow for everyone',
      colors: 6, accent: '#ff6b8a', maxAlgae: 24, goalMult: 1.4, moveDelta: -3, algaeBonus: 6
    }
  ];

  /* --- узоры тины ------------------------------------------------------ */
  function buildAlgae(spec, rng, cap) {
    if (!spec) return [];
    if (Array.isArray(spec)) return spec.slice(0, cap || spec.length);
    var cells = [];
    var seen = {};
    function add(r, c) {
      if (r < 0 || c < 0 || r >= ROWS || c >= COLS) return;
      var k = r + ':' + c;
      if (seen[k]) return;
      seen[k] = 1;
      cells.push({ r: r, c: c });
    }
    if (spec.t === 'random') {
      var all = [];
      for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) all.push({ r: r, c: c });
      rng.shuffle(all);
      all.slice(0, spec.n).forEach(function (p) { add(p.r, p.c); });
    } else if (spec.t === 'rows') {
      spec.rows.forEach(function (r) {
        for (var c = 0; c < COLS; c++) if (c % 2 === 0 || spec.full) add(r, c);
      });
      if (spec.extra) spec.extra.forEach(function (p) { add(p[0], p[1]); });
    } else if (spec.t === 'cols') {
      spec.cols.forEach(function (c) {
        for (var r = 0; r < ROWS; r++) if (r % 2 === 0 || spec.full) add(r, c);
      });
    } else if (spec.t === 'cross') {
      for (var c2 = 0; c2 < COLS; c2++) add(3, c2);
      for (var r2 = 0; r2 < ROWS; r2++) add(r2, 3);
    } else if (spec.t === 'diamond') {
      for (var r3 = 0; r3 < ROWS; r3++) {
        for (var c3 = 0; c3 < COLS; c3++) {
          if (Math.abs(r3 - 3.5) + Math.abs(c3 - 3.5) <= (spec.rad || 2.5)) add(r3, c3);
        }
      }
    } else if (spec.t === 'corners') {
      var s = spec.size || 2;
      for (var dr = 0; dr < s; dr++) {
        for (var dc = 0; dc < s; dc++) {
          add(dr, dc);
          add(dr, COLS - 1 - dc);
          add(ROWS - 1 - dr, dc);
          add(ROWS - 1 - dr, COLS - 1 - dc);
        }
      }
    } else if (spec.t === 'checker') {
      for (var r4 = 0; r4 < ROWS; r4++) {
        for (var c4 = 0; c4 < COLS; c4++) {
          if ((r4 + c4) % spec.step === 0 && rng() < (spec.density || 0.5)) add(r4, c4);
        }
      }
    }
    if (cap && cells.length > cap) cells = cells.slice(0, cap);
    return cells;
  }

  /* --- таблица уровней -------------------------------------------------
     [ходы, цели «собери», узор тины]
     Максимум целей подобран так, чтобы уровень проходился за отведённые
     ходы, но требовал осмысленных ходов и каскадов.
  --------------------------------------------------------------------- */
  var TABLE = [
    // Глава 1. Мелководье — обучение, 5 цветов.
    [24, { pearl: 10 }, null],
    [24, { coral: 12 }, null],
    [23, { star: 14 }, null],
    [23, { shell: 16 }, null],
    [24, { bubble: 12, pearl: 8 }, null],
    [24, { bubble: 14 }, { t: 'random', n: 4 }],
    [24, { pearl: 12, coral: 8 }, { t: 'rows', rows: [4], full: true }],
    [23, { star: 14, shell: 8 }, { t: 'random', n: 8 }],
    [23, { bubble: 14, star: 10 }, { t: 'cols', cols: [2, 5] }],
    [23, { pearl: 14, coral: 10, star: 8 }, { t: 'cross' }],

    // Глава 2. Коралловые сады — больше тины, две цели.
    [24, { coral: 16, shell: 10 }, { t: 'rows', rows: [2, 5], full: true }],
    [24, { pearl: 16, star: 12 }, { t: 'corners', size: 2 }],
    [24, { shell: 18, star: 12 }, { t: 'diamond', rad: 2 }],
    [23, { bubble: 18, coral: 12 }, { t: 'checker', step: 2, density: 0.6 }],
    [23, { star: 18, pearl: 12 }, { t: 'cols', cols: [1, 6], full: true }],
    [24, { bubble: 18, shell: 12 }, { t: 'random', n: 14 }],
    [23, { coral: 20, bubble: 12 }, { t: 'rows', rows: [1, 6] }],
    [23, { pearl: 20, star: 14 }, { t: 'diamond', rad: 3 }],
    [23, { shell: 20, star: 14 }, { t: 'corners', size: 2 }],
    [23, { coral: 18, pearl: 16, star: 10 }, { t: 'cross' }],

    // Глава 3. Грот эха — 6 цветов, появляется водоросль.
    [26, { pearl: 16, shell: 12 }, { t: 'rows', rows: [3, 4] }],
    [26, { star: 18, coral: 14 }, { t: 'random', n: 16 }],
    [25, { bubble: 18, kelp: 14 }, { t: 'diamond', rad: 2.5 }],
    [25, { shell: 18, pearl: 14 }, { t: 'cols', cols: [2, 5] }],
    [25, { coral: 18, star: 14 }, { t: 'checker', step: 3, density: 0.8 }],
    [25, { kelp: 18, bubble: 14 }, { t: 'corners', size: 2 }],
    [25, { pearl: 16, coral: 16, shell: 10 }, { t: 'rows', rows: [1, 6], full: true }],
    [24, { star: 18, kelp: 14 }, { t: 'diamond', rad: 2.5 }],
    [24, { bubble: 18, shell: 14 }, { t: 'cross' }],
    [24, { coral: 18, pearl: 16, star: 10 }, { t: 'random', n: 18 }],

    // Глава 4. Лунная лагуна — тина и крупные цели.
    [25, { pearl: 18, bubble: 14 }, { t: 'rows', rows: [2, 3, 4] }],
    [25, { shell: 18, kelp: 14 }, { t: 'cols', cols: [1, 6] }],
    [25, { star: 20, coral: 14 }, { t: 'diamond', rad: 2.5 }],
    [24, { kelp: 20, pearl: 14 }, { t: 'checker', step: 2, density: 0.7 }],
    [24, { bubble: 20, shell: 14 }, { t: 'corners', size: 2 }],
    [24, { coral: 18, star: 14 }, { t: 'rows', rows: [0, 7], full: true }],
    [24, { pearl: 16, kelp: 16, bubble: 10 }, { t: 'random', n: 20 }],
    [24, { shell: 20, coral: 16 }, { t: 'diamond', rad: 3 }],
    [23, { star: 20, pearl: 16 }, { t: 'cross' }],
    [23, { kelp: 20, bubble: 16, shell: 10 }, { t: 'checker', step: 3, density: 1 }],

    // Глава 5. Тёмный жёлоб — сложнее, но честно.
    [26, { pearl: 20, coral: 16 }, { t: 'rows', rows: [1, 2, 5, 6] }],
    [26, { star: 20, shell: 16 }, { t: 'cols', cols: [0, 7] }],
    [26, { bubble: 20, kelp: 16 }, { t: 'diamond', rad: 2.5 }],
    [25, { coral: 20, pearl: 16 }, { t: 'checker', step: 2, density: 0.8 }],
    [25, { shell: 22, star: 16 }, { t: 'corners', size: 3 }],
    [25, { kelp: 22, bubble: 16 }, { t: 'rows', rows: [3, 4], full: true }],
    [25, { pearl: 18, coral: 18, shell: 10 }, { t: 'random', n: 22 }],
    [25, { star: 22, kelp: 16 }, { t: 'diamond', rad: 3 }],
    [24, { bubble: 22, coral: 16 }, { t: 'cross' }],
    [24, { shell: 20, pearl: 18, star: 10 }, { t: 'checker', step: 3, density: 1 }],

    // Глава 6. Сердце рифа — финал.
    [28, { pearl: 22, coral: 18 }, { t: 'rows', rows: [2, 5] }],
    [28, { star: 22, bubble: 18 }, { t: 'cols', cols: [2, 5], full: true }],
    [27, { coral: 22, shell: 18 }, { t: 'diamond', rad: 2.5 }],
    [27, { kelp: 22, star: 18 }, { t: 'checker', step: 2, density: 0.8 }],
    [27, { pearl: 20, bubble: 20, kelp: 10 }, { t: 'corners', size: 3 }],
    [26, { coral: 18, star: 18, shell: 10 }, { t: 'rows', rows: [0, 7], full: true }],
    [26, { shell: 22, kelp: 20 }, { t: 'random', n: 24 }],
    [26, { bubble: 22, pearl: 20 }, { t: 'diamond', rad: 3 }],
    [25, { coral: 17, star: 17, bubble: 11 }, { t: 'cross' }],
    [26, { pearl: 19, coral: 17, star: 17 }, { t: 'checker', step: 2, density: 1 }]
  ];

  var TYPE_KEYS = ['pearl', 'coral', 'star', 'shell', 'bubble', 'kelp'];

  // Пороговые значения для 2 и 3 звёзд подобраны симуляциями (см. docs/QA.md).
  var STAR2 = [0, 1400, 1550, 1570, 1660, 1680, 2160, 2010, 2100, 2010, 2120, 2360, 2970, 2470, 3080, 2970, 2920, 2600, 2830, 3100, 2930, 2260, 2650, 2410, 2440, 2530, 2670, 2560, 2510, 2460, 2680, 2520, 2210, 2550, 3100, 2860, 2580, 2880, 2940, 2710, 3020, 2960, 2690, 2580, 3260, 3380, 3230, 3090, 3060, 2820, 3380, 3030, 3590, 3290, 3240, 3510, 3160, 3590, 3310, 3000, 3590];
  var STAR3 = [0, 1900, 1950, 2540, 2230, 2210, 2880, 2590, 2910, 2550, 2930, 3380, 4160, 3160, 3610, 3620, 3650, 3380, 3590, 3760, 3750, 2840, 3040, 3130, 2990, 3120, 3730, 3070, 2910, 3310, 3150, 3120, 2930, 3300, 3910, 3600, 3360, 3360, 3550, 3370, 3450, 3460, 3260, 3520, 3650, 4560, 3560, 3670, 3640, 3590, 4050, 3600, 3990, 3760, 4330, 4080, 3500, 4470, 4300, 3530, 4140];

  function scaleGoals(collect, mult, chapterId) {
    var out = {};
    Object.keys(collect).forEach(function (key) {
      var value = Math.round(collect[key] * mult);
      value = chapterId <= 2 ? Math.max(8, Math.min(26, value)) : Math.max(10, Math.min(36, value));
      out[key] = value;
    });
    return out;
  }

  var LEVELS = TABLE.map(function (row, index) {
    var id = index + 1;
    var chapter = CHAPTERS[Math.floor(index / 10)];
    var moves = Math.max(14, row[0] + chapter.moveDelta);
    var collect = scaleGoals(row[1], chapter.goalMult, chapter.id);
    var algaeSpec = row[2];
    var rng = Core.makeRng(9000 + id * 37);
    var algaeCells = buildAlgae(algaeSpec, rng, chapter.maxAlgae + chapter.algaeBonus);
    var level = {
      id: id,
      chapter: chapter.id,
      seed: 1000 + id * 7919,
      rows: ROWS,
      cols: COLS,
      colors: chapter.colors,
      moves: moves,
      goals: {
        collect: collect,
        algae: algaeCells.length
      },
      algaeCells: algaeCells,
      star2: STAR2[id],
      star3: STAR3[id],
      tutorial: id === 1
    };
    return level;
  });

  function getLevel(id) {
    return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, id - 1))];
  }
  function getChapter(id) {
    return CHAPTERS[Math.max(0, Math.min(CHAPTERS.length - 1, id - 1))];
  }
  function chapterStart(chapterId) { return (chapterId - 1) * 10 + 1; }
  function chapterEnd(chapterId) { return chapterId * 10; }
  function typeKey(index) { return TYPE_KEYS[index]; }

  return {
    ROWS: ROWS,
    COLS: COLS,
    CHAPTERS: CHAPTERS,
    LEVELS: LEVELS,
    TYPE_KEYS: TYPE_KEYS,
    getLevel: getLevel,
    getChapter: getChapter,
    chapterStart: chapterStart,
    chapterEnd: chapterEnd,
    typeKey: typeKey,
    TOTAL_LEVELS: LEVELS.length,
    MAX_STARS: LEVELS.length * 3
  };
});

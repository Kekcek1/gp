/* ==========================================================================
   Сияние рифа / Reef Glow — игровое ядро (без DOM)
   Чистая логика поля, совпадений, каскадов, целей и усилителей.
   Работает и в браузере (window.ReefCore), и в Node (module.exports).
   ========================================================================== */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ReefCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var TYPES = ['pearl', 'coral', 'star', 'shell', 'bubble', 'kelp'];
  var SPECIALS = ['lineH', 'lineV', 'bomb', 'rainbow'];
  var VERSION = '1.0.0';

  /* ------------------------------------------------------------------ RNG */
  function hashSeed(input) {
    var str = String(input);
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function makeRng(seed) {
    var state = (typeof seed === 'number' ? seed : hashSeed(seed)) >>> 0;
    if (state === 0) state = 0x9e3779b9;
    function next() {
      state ^= state << 13; state >>>= 0;
      state ^= state >>> 17;
      state ^= state << 5; state >>>= 0;
      return state / 4294967296;
    }
    next.int = function (n) { return Math.floor(next() * n); };
    next.pick = function (arr) { return arr[next.int(arr.length)]; };
    next.shuffle = function (arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = next.int(i + 1);
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
      return arr;
    };
    return next;
  }

  /* ------------------------------------------------------------- helpers */
  function inBounds(board, r, c) {
    return r >= 0 && c >= 0 && r < board.rows && c < board.cols;
  }
  function key(r, c) { return r + ':' + c; }
  function adjacent(a, b) {
    return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
  }
  function cloneTile(t) {
    if (!t) return null;
    return { type: t.type, special: t.special || null, id: t.id };
  }
  function cloneBoard(board) {
    var cells = new Array(board.rows);
    for (var r = 0; r < board.rows; r++) {
      cells[r] = new Array(board.cols);
      for (var c = 0; c < board.cols; c++) cells[r][c] = cloneTile(board.cells[r][c]);
    }
    return { rows: board.rows, cols: board.cols, cells: cells };
  }

  /* --------------------------------------------------------------- Board */
  function Board(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.cells = [];
    for (var r = 0; r < rows; r++) {
      this.cells[r] = new Array(cols);
      for (var c = 0; c < cols; c++) this.cells[r][c] = null;
    }
  }
  Board.prototype.get = function (r, c) {
    return inBounds(this, r, c) ? this.cells[r][c] : null;
  };
  Board.prototype.set = function (r, c, tile) {
    if (inBounds(this, r, c)) this.cells[r][c] = tile;
  };
  Board.prototype.clone = function () { return cloneBoard(this); };

  /* ------------------------------------------------------- board filling */
  function tileIdFactory(prefix) {
    var n = 0;
    return function () { return (prefix || 't') + (++n); };
  }

  function fillBoard(rows, cols, typeCount, rng, nextId) {
    var board = new Board(rows, cols);
    var types = TYPES.slice(0, typeCount);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var banned = {};
        if (c >= 2) {
          var a = board.cells[r][c - 1], b = board.cells[r][c - 2];
          if (a && b && a.type === b.type && !a.special && !b.special) banned[a.type] = 1;
        }
        if (r >= 2) {
          var u = board.cells[r - 1][c], v = board.cells[r - 2][c];
          if (u && v && u.type === v.type && !u.special && !v.special) banned[u.type] = 1;
        }
        var pool = types.filter(function (t) { return !banned[t]; });
        if (!pool.length) pool = types;
        board.cells[r][c] = {
          type: rng.pick(pool),
          special: null,
          id: nextId ? nextId() : 't' + (r * cols + c)
        };
      }
    }
    return board;
  }

  /* ------------------------------------------------------ match detection */
  function findMatches(board) {
    var groups = [];
    var r, c;
    // Горизонтальные серии.
    for (r = 0; r < board.rows; r++) {
      c = 0;
      while (c < board.cols) {
        var t = board.cells[r][c];
        if (!t) { c++; continue; }
        var end = c + 1;
        while (end < board.cols) {
          var n = board.cells[r][end];
          if (!n || n.type !== t.type) break;
          end++;
        }
        if (end - c >= 3) {
          var cells = [];
          for (var x = c; x < end; x++) cells.push({ r: r, c: x });
          groups.push({ dir: 'h', len: end - c, type: t.type, cells: cells });
        }
        c = end;
      }
    }
    // Вертикальные серии.
    for (c = 0; c < board.cols; c++) {
      r = 0;
      while (r < board.rows) {
        var vt = board.cells[r][c];
        if (!vt) { r++; continue; }
        var ve = r + 1;
        while (ve < board.rows) {
          var vn = board.cells[ve][c];
          if (!vn || vn.type !== vt.type) break;
          ve++;
        }
        if (ve - r >= 3) {
          var vcells = [];
          for (var y = r; y < ve; y++) vcells.push({ r: y, c: c });
          groups.push({ dir: 'v', len: ve - r, type: vt.type, cells: vcells });
        }
        r = ve;
      }
    }
    return groups;
  }

  /** Кластеры пересекающихся групп (для создания бомб и подсчёта). */
  function clusterGroups(groups) {
    var clusters = [];
    var used = new Array(groups.length).fill(false);
    for (var i = 0; i < groups.length; i++) {
      if (used[i]) continue;
      var cluster = [i];
      used[i] = true;
      var changed = true;
      while (changed) {
        changed = false;
        for (var j = 0; j < groups.length; j++) {
          if (used[j]) continue;
          var touches = false;
          for (var a = 0; a < cluster.length && !touches; a++) {
            var g1 = groups[cluster[a]];
            for (var k = 0; k < g1.cells.length && !touches; k++) {
              for (var l = 0; l < groups[j].cells.length; l++) {
                if (g1.cells[k].r === groups[j].cells[l].r && g1.cells[k].c === groups[j].cells[l].c) {
                  touches = true; break;
                }
              }
            }
          }
          if (touches) { cluster.push(j); used[j] = true; changed = true; }
        }
      }
      var cells = [];
      var seen = {};
      var maxH = 0, maxV = 0, type = null;
      for (var m = 0; m < cluster.length; m++) {
        var g = groups[cluster[m]];
        if (g.dir === 'h') maxH = Math.max(maxH, g.len);
        else maxV = Math.max(maxV, g.len);
        type = g.type;
        for (var p = 0; p < g.cells.length; p++) {
          var cc = g.cells[p];
          var kk = key(cc.r, cc.c);
          if (!seen[kk]) { seen[kk] = 1; cells.push({ r: cc.r, c: cc.c }); }
        }
      }
      clusters.push({ cells: cells, maxH: maxH, maxV: maxV, type: type, groups: cluster.length });
    }
    return clusters;
  }

  function findValidMoves(board, limit) {
    var moves = [];
    var dirs = [[0, 1], [1, 0]];
    for (var r = 0; r < board.rows && moves.length < (limit || 1); r++) {
      for (var c = 0; c < board.cols && moves.length < (limit || 1); c++) {
        for (var d = 0; d < 2; d++) {
          var nr = r + dirs[d][0], nc = c + dirs[d][1];
          if (!inBounds(board, nr, nc)) continue;
          var t1 = board.cells[r][c], t2 = board.cells[nr][nc];
          if (!t1 || !t2) continue;
          if (t1.special === 'rainbow' || t2.special === 'rainbow' ||
              (t1.special && t2.special)) {
            moves.push({ a: { r: r, c: c }, b: { r: nr, c: nc }, special: true });
            continue;
          }
          var copy = board.clone();
          var tmp = copy.cells[r][c];
          copy.cells[r][c] = copy.cells[nr][nc];
          copy.cells[nr][nc] = tmp;
          if (findMatches(copy).length) {
            moves.push({ a: { r: r, c: c }, b: { r: nr, c: nc } });
          }
        }
      }
    }
    return moves;
  }

  /* --------------------------------------------------------------- Game */
  function Game(level, options) {
    options = options || {};
    this.level = level;
    this.rows = level.rows || 8;
    this.cols = level.cols || 8;
    this.typeCount = level.colors || 5;
    this.seed = (level.seed || 1) + (options.seedOffset || 0);
    this.rng = makeRng(this.seed);
    this._ids = tileIdFactory('t' + level.id + '_');
    this.board = this._createBoard();
    this.score = 0;
    this.movesLeft = level.moves || 20;
    this.cascade = 0;
    this.wave = 0;
    this.waveCharged = 0;
    this.waveLocked = false;
    this.status = 'playing';
    this.algaeTotal = 0;
    this.algaeLeft = 0;
    this.goals = [];
    this.progress = {};
    this.history = [];
    this.shuffles = 0;
    this._initGoals(level);
    this._applyAlgae(level);
    this._ensurePlayable();
  }

  Game.prototype._createBoard = function () {
    var board;
    var attempts = 0;
    do {
      board = fillBoard(this.rows, this.cols, this.typeCount, this.rng, this._ids);
      attempts++;
    } while (findMatches(board).length && attempts < 12);
    return board;
  };

  Game.prototype._initGoals = function (level) {
    var goals = [];
    var collect = level.goals && level.goals.collect ? level.goals.collect : {};
    Object.keys(collect).forEach(function (type) {
      if (collect[type] > 0) goals.push({ kind: 'collect', type: type, target: collect[type] });
    });
    if (level.goals && level.goals.algae > 0) {
      goals.push({ kind: 'algae', target: level.goals.algae });
    }
    this.goals = goals;
    for (var i = 0; i < goals.length; i++) this.progress[i] = 0;
  };

  Game.prototype._applyAlgae = function (level) {
    var self = this;
    var cells = [];
    if (Array.isArray(level.algaeCells)) {
      cells = level.algaeCells.slice();
    } else if (level.algae > 0) {
      var candidates = [];
      for (var r = 0; r < this.rows; r++) {
        for (var c = 0; c < this.cols; c++) candidates.push({ r: r, c: c });
      }
      this.rng.shuffle(candidates);
      cells = candidates.slice(0, level.algae);
    }
    this.algae = [];
    for (var i = 0; i < this.rows; i++) this.algae[i] = new Array(this.cols).fill(0);
    cells.forEach(function (pos) {
      if (inBounds(self.board, pos.r, pos.c)) self.algae[pos.r][pos.c] = 1;
    });
    this.algaeTotal = cells.length;
    this.algaeLeft = cells.length;
    // Цель по тине не может превышать фактическое число клеток.
    for (var g = 0; g < this.goals.length; g++) {
      if (this.goals[g].kind === 'algae') this.goals[g].target = Math.min(this.goals[g].target, cells.length);
    }
  };

  Game.prototype._ensurePlayable = function () {
    if (findValidMoves(this.board, 1).length) return false;
    this._reshuffleTypes();
    return true;
  };

  Game.prototype._reshuffleTypes = function () {
    var positions = [];
    var types = [];
    for (var r = 0; r < this.rows; r++) {
      for (var c = 0; c < this.cols; c++) {
        var t = this.board.cells[r][c];
        if (t) { positions.push({ r: r, c: c }); types.push(t.type); }
      }
    }
    for (var attempt = 0; attempt < 30; attempt++) {
      this.rng.shuffle(types);
      for (var i = 0; i < positions.length; i++) {
        this.board.cells[positions[i].r][positions[i].c].type = types[i];
      }
      if (!findMatches(this.board).length && findValidMoves(this.board, 1).length) return;
    }
  };

  Game.prototype.snapshot = function () {
    return {
      rows: this.rows,
      cols: this.cols,
      cells: this.board.cells.map(function (row) {
        return row.map(function (t) {
          return t ? { type: t.type, special: t.special, id: t.id } : null;
        });
      }),
      algae: this.algae.map(function (row) { return row.slice(); })
    };
  };

  Game.prototype.goalInfo = function () {
    var self = this;
    return this.goals.map(function (g, i) {
      return {
        kind: g.kind,
        type: g.type || null,
        target: g.target,
        done: self.progress[i] || 0
      };
    });
  };

  Game.prototype.goalsComplete = function () {
    for (var i = 0; i < this.goals.length; i++) {
      if ((this.progress[i] || 0) < this.goals[i].target) return false;
    }
    return true;
  };

  Game.prototype.stars = function () {
    var s = 1;
    if (this.score >= (this.level.star2 || 0)) s = 2;
    if (this.score >= (this.level.star3 || 0)) s = 3;
    return s;
  };

  Game.prototype.result = function () {
    return {
      won: this.status === 'won',
      stars: this.status === 'won' ? this.stars() : 0,
      score: this.score,
      movesLeft: this.movesLeft,
      level: this.level.id
    };
  };

  /* --- подсчёт и очистка набора клеток ------------------------------- */
  Game.prototype._expandSpecials = function (cells, rng) {
    var set = {};
    var queue = cells.slice();
    var self = this;
    queue.forEach(function (p) { set[key(p.r, p.c)] = { r: p.r, c: p.c }; });
    var activated = {};
    var guard = 0;
    while (queue.length && guard++ < 400) {
      var p = queue.shift();
      var tile = this.board.cells[p.r] && this.board.cells[p.r][p.c];
      if (!tile || !tile.special) continue;
      var k = key(p.r, p.c);
      if (activated[k]) continue;
      activated[k] = true;
      var add = [];
      var special = tile.special;
      if (special === 'lineH') {
        for (var c = 0; c < this.cols; c++) add.push({ r: p.r, c: c });
      } else if (special === 'lineV') {
        for (var r = 0; r < this.rows; r++) add.push({ r: r, c: p.c });
      } else if (special === 'bomb') {
        for (var dr = -1; dr <= 1; dr++) {
          for (var dc = -1; dc <= 1; dc++) {
            if (inBounds(this.board, p.r + dr, p.c + dc)) add.push({ r: p.r + dr, c: p.c + dc });
          }
        }
      } else if (special === 'rainbow') {
        var counts = {};
        for (var rr = 0; rr < this.rows; rr++) {
          for (var cc = 0; cc < this.cols; cc++) {
            var tt = this.board.cells[rr][cc];
            if (tt && tt.type && tt.special !== 'rainbow') counts[tt.type] = (counts[tt.type] || 0) + 1;
          }
        }
        var best = null, bestN = -1;
        Object.keys(counts).forEach(function (t) { if (counts[t] > bestN) { bestN = counts[t]; best = t; } });
        if (best) {
          for (var r2 = 0; r2 < this.rows; r2++) {
            for (var c2 = 0; c2 < this.cols; c2++) {
              var t2 = this.board.cells[r2][c2];
              if (t2 && t2.type === best) add.push({ r: r2, c: c2 });
            }
          }
        }
      }
      for (var i = 0; i < add.length; i++) {
        var kk = key(add[i].r, add[i].c);
        if (!set[kk]) { set[kk] = add[i]; queue.push(add[i]); }
      }
    }
    return Object.keys(set).map(function (k) { return set[k]; });
  };

  Game.prototype._applyClear = function (cells, opts) {
    opts = opts || {};
    var self = this;
    var expanded = this._expandSpecials(cells, this.rng);
    var cleared = [];
    var algaeCleared = 0;
    var specialsActivated = 0;
    var gain = 0;
    var cascadeMult = Math.min(opts.cascade || 1, 8);
    var seen = {};
    var tileCells = [];
    for (var i = 0; i < expanded.length; i++) {
      var p = expanded[i];
      var k = key(p.r, p.c);
      if (seen[k]) continue;
      seen[k] = 1;
      var tile = this.board.cells[p.r][p.c];
      var hasAlgae = this.algae[p.r][p.c] === 1;
      if (!tile && !hasAlgae) continue;
      if (tile && tile.special) specialsActivated++;
      cleared.push({ r: p.r, c: p.c, tile: cloneTile(tile), algae: hasAlgae });
      if (tile) tileCells.push(p);
      if (hasAlgae) {
        this.algae[p.r][p.c] = 0;
        algaeCleared++;
        this.algaeLeft = Math.max(0, this.algaeLeft - 1);
      }
      if (tile) this.board.cells[p.r][p.c] = null;
    }
    // Свет рассеивает тину и в соседних клетках — по одному шагу от каждой
    // очищенной фишки. Так последние водоросли не превращаются в лотерею.
    var spread = [];
    var spreadSeen = {};
    for (var ti = 0; ti < tileCells.length; ti++) {
      var tp = tileCells[ti];
      var neighbours = [
        { r: tp.r - 1, c: tp.c }, { r: tp.r + 1, c: tp.c },
        { r: tp.r, c: tp.c - 1 }, { r: tp.r, c: tp.c + 1 }
      ];
      for (var ni = 0; ni < neighbours.length; ni++) {
        var np = neighbours[ni];
        if (!inBounds(this.board, np.r, np.c)) continue;
        var nk = key(np.r, np.c);
        if (spreadSeen[nk]) continue;
        if (this.algae[np.r][np.c] !== 1) continue;
        spreadSeen[nk] = 1;
        this.algae[np.r][np.c] = 0;
        algaeCleared++;
        this.algaeLeft = Math.max(0, this.algaeLeft - 1);
        spread.push({ r: np.r, c: np.c });
      }
    }
    var tilesCleared = cleared.filter(function (x) { return !!x.tile; }).length;
    gain += tilesCleared * 10 * cascadeMult;
    gain += specialsActivated * 25 * cascadeMult;
    gain += algaeCleared * 20 * cascadeMult;
    // Цели «собери» и заряд волны.
    for (var c = 0; c < cleared.length; c++) {
      var ct = cleared[c].tile;
      if (!ct || ct.special === 'rainbow') continue;
      for (var g = 0; g < this.goals.length; g++) {
        if (this.goals[g].kind === 'collect' && this.goals[g].type === ct.type) {
          this.progress[g] = Math.min(this.goals[g].target, (this.progress[g] || 0) + 1);
        }
      }
    }
    if (this.goals) {
      for (var ga = 0; ga < this.goals.length; ga++) {
        if (this.goals[ga].kind === 'algae') {
          this.progress[ga] = Math.min(this.goals[ga].target, (this.progress[ga] || 0) + algaeCleared);
        }
      }
    }
    this.score += gain;
    if (!opts.noWave && !this.waveLocked) this.wave = Math.min(100, this.wave + tilesCleared + algaeCleared + specialsActivated * 4);
    return {
      cleared: cleared,
      algaeCleared: algaeCleared,
      algaeSpread: spread,
      specialsActivated: specialsActivated,
      scoreGain: gain,
      cascadeMult: cascadeMult
    };
  };

  /* --- ход игрока ---------------------------------------------------- */
  Game.prototype.swap = function (a, b) {
    if (this.status !== 'playing') return { valid: false, reason: 'status' };
    if (!a || !b || !adjacent(a, b)) return { valid: false, reason: 'adjacent' };
    var ta = this.board.get(a.r, a.c);
    var tb = this.board.get(b.r, b.c);
    if (!ta || !tb) return { valid: false, reason: 'empty' };
    if (ta.id === tb.id) return { valid: false, reason: 'same' };

    var aSpecial = ta.special, bSpecial = tb.special;
    var rainbow = aSpecial === 'rainbow' || bSpecial === 'rainbow';
    var bothSpecial = !!aSpecial && !!bSpecial;

    // Ставим на место, чтобы проверить совпадения.
    this.board.set(a.r, a.c, tb);
    this.board.set(b.r, b.c, ta);

    var matches = findMatches(this.board);
    var combo = null;

    if (rainbow || bothSpecial) {
      combo = this._buildCombo(a, b, ta, tb, rainbow);
    } else if (!matches.length) {
      this.board.set(a.r, a.c, ta);
      this.board.set(b.r, b.c, tb);
      return { valid: false, reason: 'nomatch' };
    }

    this.movesLeft = Math.max(0, this.movesLeft - 1);
    this.cascade = 0;
    this.waveLocked = false;
    this.history.push({ a: a, b: b, at: Date.now() });

    var effect = null;
    if (combo) {
      this.cascade = 1;
      effect = this._applyClear(combo.cells, { cascade: 1 });
      effect.combo = combo.kind;
      effect.anchor = combo.anchor;
    }
    return {
      valid: true,
      swapped: [cloneTile(ta), cloneTile(tb)],
      combo: effect,
      hadMatch: matches.length > 0
    };
  };

  Game.prototype._buildCombo = function (a, b, ta, tb, rainbow) {
    var cells = [a, b];
    var kind = 'special';
    var self = this;
    function addRow(r, set) { for (var c = 0; c < self.cols; c++) set.push({ r: r, c: c }); }
    function addCol(c, set) { for (var r = 0; r < self.rows; r++) set.push({ r: r, c: c }); }
    function addBox(r, c, rad, set) {
      for (var dr = -rad; dr <= rad; dr++) {
        for (var dc = -rad; dc <= rad; dc++) {
          if (inBounds(self.board, r + dr, c + dc)) set.push({ r: r + dr, c: c + dc });
        }
      }
    }
    if (rainbow) {
      var ar = ta.special === 'rainbow';
      var other = ar ? tb : ta;
      var anchor = ar ? b : a;
      if (ta.special === 'rainbow' && tb.special === 'rainbow') {
        kind = 'rainbow-rainbow';
        for (var r = 0; r < this.rows; r++) for (var c = 0; c < this.cols; c++) cells.push({ r: r, c: c });
      } else if (other.special) {
        kind = 'rainbow-special';
        for (var r2 = 0; r2 < this.rows; r2++) {
          for (var c2 = 0; c2 < this.cols; c2++) {
            var t = this.board.cells[r2][c2];
            if (t && t.type === other.type) cells.push({ r: r2, c: c2 });
          }
        }
        addBox(a.r, a.c, 1, cells);
        addBox(b.r, b.c, 1, cells);
      } else {
        kind = 'rainbow';
        for (var r3 = 0; r3 < this.rows; r3++) {
          for (var c3 = 0; c3 < this.cols; c3++) {
            var t3 = this.board.cells[r3][c3];
            if (t3 && t3.type === other.type) cells.push({ r: r3, c: c3 });
          }
        }
      }
      return { cells: cells, kind: kind, anchor: anchor };
    }
    var sa = ta.special, sb = tb.special;
    var pair = [sa, sb].sort().join('+');
    if (sa === 'lineH' && sb === 'lineH') { kind = 'line-line'; addRow(a.r, cells); addCol(a.c, cells); addRow(b.r, cells); addCol(b.c, cells); }
    else if (sa === 'lineV' && sb === 'lineV') { kind = 'line-line'; addRow(a.r, cells); addCol(a.c, cells); addRow(b.r, cells); addCol(b.c, cells); }
    else if ((sa === 'lineH' || sa === 'lineV') && (sb === 'lineH' || sb === 'lineV')) {
      kind = 'line-line';
      addRow(a.r, cells); addCol(a.c, cells); addRow(b.r, cells); addCol(b.c, cells);
    } else if (pair === 'bomb+bomb') {
      kind = 'bomb-bomb'; addBox(a.r, a.c, 2, cells); addBox(b.r, b.c, 2, cells);
    } else if (pair === 'bomb+lineH' || pair === 'bomb+lineV') {
      kind = 'bomb-line';
      addBox(a.r, a.c, 1, cells); addBox(b.r, b.c, 1, cells);
      addRow(a.r, cells); addRow(a.r - 1, cells); addRow(a.r + 1, cells);
      addRow(b.r, cells); addRow(b.r - 1, cells); addRow(b.r + 1, cells);
      addCol(a.c, cells); addCol(b.c, cells);
    } else {
      kind = 'special';
      addBox(a.r, a.c, 1, cells); addBox(b.r, b.c, 1, cells);
    }
    // Убираем координаты за пределами поля.
    cells = cells.filter(function (p) { return inBounds(self.board, p.r, p.c); });
    return { cells: cells, kind: kind, anchor: a };
  };

  /** Один шаг каскада: находит совпадения, очищает, создаёт спецфишки. */
  Game.prototype.resolveStep = function () {
    if (this.status !== 'playing') return null;
    var groups = findMatches(this.board);
    if (!groups.length) return null;
    this.cascade++;
    var clusters = clusterGroups(groups);
    var self = this;
    var allCells = [];
    var creations = [];
    var seen = {};

    clusters.forEach(function (cluster) {
      // Если в совпадении уже есть спецфишка, она активируется, а новая не создаётся.
      var hasSpecial = cluster.cells.some(function (p) {
        var t = self.board.cells[p.r][p.c];
        return !!(t && t.special);
      });
      cluster.cells.forEach(function (p) {
        var k = key(p.r, p.c);
        if (!seen[k]) { seen[k] = 1; allCells.push(p); }
      });
      var special = null;
      if (hasSpecial) return;
      if (cluster.maxH >= 5 || cluster.maxV >= 5) special = 'rainbow';
      else if (cluster.maxH >= 3 && cluster.maxV >= 3) special = 'bomb';
      else if (cluster.maxH === 4) special = 'lineH';
      else if (cluster.maxV === 4) special = 'lineV';
      if (!special) return;
      // Выбираем клетку для новой фишки: последний ход игрока, иначе середина.
      var chosen = null;
      var last = self.history.length ? self.history[self.history.length - 1] : null;
      if (last) {
        for (var i = 0; i < cluster.cells.length; i++) {
          var p = cluster.cells[i];
          if ((p.r === last.a.r && p.c === last.a.c) || (p.r === last.b.r && p.c === last.b.c)) { chosen = p; break; }
        }
      }
      if (!chosen) chosen = cluster.cells[Math.floor(cluster.cells.length / 2)];
      // Нельзя ставить спецфишку поверх уже существующей спецфишки.
      var existing = self.board.cells[chosen.r][chosen.c];
      if (existing && existing.special) {
        chosen = null;
        for (var j = 0; j < cluster.cells.length; j++) {
          var q = cluster.cells[j];
          if (!self.board.cells[q.r][q.c].special) { chosen = q; break; }
        }
      }
      if (chosen) {
        creations.push({ r: chosen.r, c: chosen.c, type: cluster.type, special: special });
      }
    });

    // Не очищаем клетки, где появятся новые спецфишки.
    var clearCells = allCells.filter(function (p) {
      return !creations.some(function (cr) { return cr.r === p.r && cr.c === p.c; });
    });

    var effect = this._applyClear(clearCells, { cascade: this.cascade });
    // Создаём спецфишки (они не участвуют в очистке).
    for (var i = 0; i < creations.length; i++) {
      var cr = creations[i];
      var old = this.board.cells[cr.r][cr.c];
      var tile = { type: cr.type, special: cr.special, id: old ? old.id : this._ids() };
      this.board.cells[cr.r][cr.c] = tile;
      this.score += 40;
    }
    // Цели по «собери» для клеток-создателей тоже учитываем.
    for (var c = 0; c < creations.length; c++) {
      for (var g = 0; g < this.goals.length; g++) {
        if (this.goals[g].kind === 'collect' && this.goals[g].type === creations[c].type) {
          this.progress[g] = Math.min(this.goals[g].target, (this.progress[g] || 0) + 1);
        }
      }
    }
    if (allCells.length) this.wave = Math.min(100, this.wave + (allCells.length - clearCells.length));
    return {
      cleared: effect.cleared,
      creations: creations,
      scoreGain: effect.scoreGain + creations.length * 40,
      cascade: this.cascade,
      algaeCleared: effect.algaeCleared,
      algaeSpread: effect.algaeSpread,
      specialsActivated: effect.specialsActivated,
      wave: this.wave
    };
  };

  /** Гравитация и дозаполнение. */
  Game.prototype.collapse = function () {
    var falls = [];
    var spawns = [];
    for (var c = 0; c < this.cols; c++) {
      var stack = [];
      for (var r = this.rows - 1; r >= 0; r--) {
        var t = this.board.cells[r][c];
        if (t) stack.push({ tile: t, from: r });
      }
      var write = this.rows - 1;
      for (var i = 0; i < stack.length; i++) {
        var item = stack[i];
        if (item.from !== write) {
          falls.push({ fromR: item.from, fromC: c, toR: write, toC: c, tile: cloneTile(item.tile) });
        }
        this.board.cells[write][c] = item.tile;
        write--;
      }
      for (var rr = write; rr >= 0; rr--) {
        var nt = { type: this.rng.pick(TYPES.slice(0, this.typeCount)), special: null, id: this._ids() };
        this.board.cells[rr][c] = nt;
        spawns.push({ r: rr, c: c, tile: cloneTile(nt) });
      }
    }
    return { falls: falls, spawns: spawns };
  };

  /** Проверка завершения после каскада. */
  Game.prototype.checkStatus = function () {
    if (this.status !== 'playing') return this.status;
    if (this.goalsComplete()) {
      this.status = 'won';
      this.score += this.movesLeft * 50;
      return 'won';
    }
    if (this.movesLeft <= 0) {
      this.status = 'lost';
      return 'lost';
    }
    var shuffled = this._ensurePlayable();
    return shuffled ? 'shuffled' : 'playing';
  };

  Game.prototype.grantMoves = function (n) {
    this.movesLeft += Math.max(0, n | 0);
    if (this.status === 'lost') this.status = 'playing';
  };

  /* --- усилители ------------------------------------------------------ */
  Game.prototype.hammer = function (r, c) {
    if (this.status !== 'playing' || !inBounds(this.board, r, c)) return null;
    var tile = this.board.cells[r][c];
    var algae = this.algae[r][c] === 1;
    if (!tile && !algae) return null;
    this.waveLocked = false;
    this.cascade = 1;
    var effect = this._applyClear([{ r: r, c: c }], { cascade: 1, noWave: true });
    effect.hammer = true;
    return effect;
  };

  Game.prototype.useWave = function (type) {
    if (this.status !== 'playing' || this.wave < 100) return null;
    if (TYPES.indexOf(type) < 0) return null;
    var cells = [];
    for (var r = 0; r < this.rows; r++) {
      for (var c = 0; c < this.cols; c++) {
        var t = this.board.cells[r][c];
        if (t && (t.type === type || t.special === 'rainbow')) cells.push({ r: r, c: c });
      }
    }
    if (!cells.length) return null;
    this.wave = 0;
    this.waveLocked = true;
    this.cascade = 1;
    var effect = this._applyClear(cells, { cascade: 1, noWave: true });
    effect.waveType = type;
    return effect;
  };

  Game.prototype.shuffleBoard = function () {
    if (this.status !== 'playing') return null;
    this.shuffles++;
    this._reshuffleTypes();
    return { shuffled: true };
  };

  Game.prototype.findHint = function () {
    var moves = findValidMoves(this.board, 40);
    if (!moves.length) return null;
    var best = moves[0];
    var bestScore = -1;
    for (var i = 0; i < moves.length; i++) {
      var m = moves[i];
      if (m.special) return m;
      var copy = this.board.clone();
      var tmp = copy.cells[m.a.r][m.a.c];
      copy.cells[m.a.r][m.a.c] = copy.cells[m.b.r][m.b.c];
      copy.cells[m.b.r][m.b.c] = tmp;
      var groups = findMatches(copy);
      var n = 0;
      for (var g = 0; g < groups.length; g++) n += groups[g].len;
      if (n > bestScore) { bestScore = n; best = m; }
    }
    return best;
  };

  Game.prototype.waveReady = function () { return this.wave >= 100; };

  /* -------------------------------------------------------- level helpers */
  function createGame(level, options) {
    return new Game(level, options);
  }

  /** Приблизительная проверка «есть ли чем ходить» для UI. */
  function hasMoves(game) {
    return !!game.findHint();
  }

  return {
    VERSION: VERSION,
    TYPES: TYPES,
    SPECIALS: SPECIALS,
    Board: Board,
    Game: Game,
    createGame: createGame,
    fillBoard: fillBoard,
    findMatches: findMatches,
    findValidMoves: findValidMoves,
    makeRng: makeRng,
    hashSeed: hashSeed,
    hasMoves: hasMoves,
    cloneBoard: cloneBoard,
    _internal: { clusterGroups: clusterGroups }
  };
});

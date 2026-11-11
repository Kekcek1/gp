/* Pulsebound — canvas engine and gameplay. */
(function (global) {
    'use strict';

    var TAU = Math.PI * 2;
    var PI = Math.PI;

    var THEMES = [
        { bg1: '#04050f', bg2: '#081027', neb1: '#1b2a68', neb2: '#3a1466', lane: '#57f5ff', lane2: '#8f63ff', obs: '#ff4fa3', obsEdge: '#ff9bd2', accent: '#57f5ff', core: '#e8ffff' },
        { bg1: '#0b0412', bg2: '#170723', neb1: '#541852', neb2: '#2a1466', lane: '#ff6bc1', lane2: '#b06cff', obs: '#ffd166', obsEdge: '#ffe6a8', accent: '#ff5cae', core: '#fff0fa' },
        { bg1: '#020a09', bg2: '#041a18', neb1: '#0a4a45', neb2: '#12452d', lane: '#6dffc0', lane2: '#4fd6ff', obs: '#ff7a6b', obsEdge: '#ffc1a8', accent: '#6dffc0', core: '#eafff6' },
        { bg1: '#0d0802', bg2: '#1b1104', neb1: '#5a370e', neb2: '#3a1608', lane: '#ffd166', lane2: '#ff9445', obs: '#ff5cae', obsEdge: '#ffc1e0', accent: '#ffd166', core: '#fff8e6' },
        { bg1: '#060412', bg2: '#120a24', neb1: '#34206e', neb2: '#4e185d', lane: '#b18cff', lane2: '#ff8bd0', obs: '#57f5ff', obsEdge: '#bffcff', accent: '#c39bff', core: '#f7f0ff' },
        { bg1: '#0b0306', bg2: '#19060d', neb1: '#571226', neb2: '#2a0a2a', lane: '#ff7a8a', lane2: '#ffb36b', obs: '#6dffc0', obsEdge: '#c8ffe9', accent: '#ff5570', core: '#fff0f2' }
    ];

    function hexToRgb(hex) {
        hex = (hex || '#ffffff').replace('#', '');
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        var n = parseInt(hex, 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    function makePalette(theme) {
        return {
            bg1: hexToRgb(theme.bg1),
            bg2: hexToRgb(theme.bg2),
            neb1: hexToRgb(theme.neb1),
            neb2: hexToRgb(theme.neb2),
            lane: hexToRgb(theme.lane),
            lane2: hexToRgb(theme.lane2),
            obs: hexToRgb(theme.obs),
            obsEdge: hexToRgb(theme.obsEdge),
            accent: hexToRgb(theme.accent),
            core: hexToRgb(theme.core)
        };
    }

    function clonePalette(p) {
        var out = {};
        for (var k in p) if (Object.prototype.hasOwnProperty.call(p, k)) out[k] = p[k].slice();
        return out;
    }

    function mixPalette(a, b, t) {
        var out = {};
        for (var k in a) {
            if (!Object.prototype.hasOwnProperty.call(a, k)) continue;
            out[k] = [
                Math.round(a[k][0] + (b[k][0] - a[k][0]) * t),
                Math.round(a[k][1] + (b[k][1] - a[k][1]) * t),
                Math.round(a[k][2] + (b[k][2] - a[k][2]) * t)
            ];
        }
        return out;
    }

    function css(c, a) {
        if (a === undefined || a === null || a >= 1) return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
        if (a <= 0) return 'rgba(0,0,0,0)';
        return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
    }

    function rgbStr(c) {
        return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
    }

    function clamp(v, a, b) {
        return v < a ? a : (v > b ? b : v);
    }

    function angleDiff(a, b) {
        var d = a - b;
        while (d > PI) d -= TAU;
        while (d < -PI) d += TAU;
        return d;
    }

    function hslHex(h, s, l) {
        s /= 100; l /= 100;
        var c = (1 - Math.abs(2 * l - 1)) * s;
        var x = c * (1 - Math.abs((h / 60) % 2 - 1));
        var m = l - c / 2;
        var r = 0, g = 0, b = 0;
        if (h < 60) { r = c; g = x; }
        else if (h < 120) { r = x; g = c; }
        else if (h < 180) { g = c; b = x; }
        else if (h < 240) { g = x; b = c; }
        else if (h < 300) { r = x; b = c; }
        else { r = c; b = x; }
        return '#' + [r, g, b].map(function (v) {
            var hx = Math.round((v + m) * 255).toString(16);
            return hx.length < 2 ? '0' + hx : hx;
        }).join('');
    }

    function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    var Game = {
        canvas: null,
        ctx: null,
        W: 0,
        H: 0,
        dpr: 1,
        stage: null,
        cx: 0,
        cy: 0,
        R: 180,
        Rin: 118,
        Rout: 180,
        core: 30,
        band: 14,
        state: 'boot',
        animTime: 0,
        lastTs: 0,
        run: null,
        player: null,
        obstacles: [],
        orbs: [],
        particles: [],
        floaters: [],
        trail: [],
        pending: [],
        nextRowAngle: 0,
        lastGeneratedAngle: 0,
        speed: 1.05,
        flow: 0,
        overdriveT: 0,
        invulnT: 0,
        sector: 1,
        palette: makePalette(THEMES[0]),
        paletteFrom: makePalette(THEMES[0]),
        paletteTo: makePalette(THEMES[0]),
        paletteT: 1,
        skin: null,
        shake: 0,
        flash: 0,
        dyingT: 0,
        lastSwitch: -1,
        lastHud: 0,
        best: 0,
        callbacks: {},
        tutorial: null,
        _bg: null,
        _bgKey: '',
        _bgW: 0,
        _bgH: 0,
        _glowCache: {},
        _stars: [],
        _menuOrbs: [],
        _menuSwitchIn: 4,
        _trailTimer: 0,
        _orbBurst: 0,

        init: function (canvas, callbacks) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d', { alpha: false });
            this.callbacks = callbacks || {};
            this.skin = PB.Storage.currentSkin();
            this.best = PB.Storage.state.best;
            this.buildStars();
            this.resize();
            this.startMenu();
            var self = this;
            this._resizeBound = function () { self.resize(); };
            global.addEventListener('resize', this._resizeBound, { passive: true });
            global.addEventListener('orientationchange', this._resizeBound, { passive: true });
            if (typeof ResizeObserver !== 'undefined' && this.stage) {
                try { new ResizeObserver(this._resizeBound).observe(this.stage); } catch (e) { /* ignore */ }
            }
            this._loop = this.loop.bind(this);
            requestAnimationFrame(this._loop);
        },

        buildStars: function () {
            this._stars = [];
            var count = 170;
            for (var i = 0; i < count; i++) {
                this._stars.push({
                    x: Math.random(),
                    y: Math.random(),
                    z: Math.random(),
                    size: 0.5 + Math.random() * 1.8,
                    phase: Math.random() * TAU,
                    twinkle: 0.6 + Math.random() * 1.8
                });
            }
        },

        resize: function () {
            if (!this.canvas) return;
            var W = global.innerWidth || document.documentElement.clientWidth || 800;
            var H = global.innerHeight || document.documentElement.clientHeight || 600;
            this.W = W;
            this.H = H;
            this.dpr = Math.min(2, global.devicePixelRatio || 1);
            this.canvas.width = Math.floor(W * this.dpr);
            this.canvas.height = Math.floor(H * this.dpr);
            this.canvas.style.width = W + 'px';
            this.canvas.style.height = H + 'px';
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
            this.stage = document.getElementById('stage');
            var rect = this.stage ? this.stage.getBoundingClientRect() : { left: 0, top: 0, width: W, height: H };
            if (!rect.width || !rect.height) rect = { left: 0, top: 0, width: W, height: H };
            this.cx = rect.left + rect.width / 2;
            this.cy = rect.top + rect.height / 2;
            this.R = clamp(Math.min(rect.width * 0.4, rect.height * 0.34), 70, 390);
            this.Rin = this.R * 0.66;
            this.Rout = this.R;
            this.core = this.R * 0.16;
            this.band = clamp(this.R * 0.07, 10, 22);
            this._bgKey = '';
            this._bgW = 0;
        },

        laneRadius: function (lane) {
            return this.Rin + (this.Rout - this.Rin) * lane;
        },

        // ------------------------------------------------------------------ state

        setSkin: function () {
            this.skin = PB.Storage.currentSkin();
        },

        refreshBest: function () {
            this.best = PB.Storage.state.best;
        },

        startMenu: function () {
            this.state = 'menu';
            this.run = null;
            this.obstacles = [];
            this.pending = [];
            this.particles = [];
            this.floaters = [];
            this.trail = [];
            this.tutorial = null;
            this.player = {
                angle: PI / 2 + 0.45,
                lane: 0,
                lanePos: 0,
                visible: true
            };
            this.speed = 0.3;
            this.flow = 0;
            this.overdriveT = 0;
            this.invulnT = 0;
            this.sector = 1;
            this.paletteFrom = makePalette(THEMES[0]);
            this.paletteTo = makePalette(THEMES[0]);
            this.palette = makePalette(THEMES[0]);
            this.paletteT = 1;
            this.shake = 0;
            this.flash = 0;
            this.dyingT = 0;
            this.lastSwitch = -1;
            this._menuSwitchIn = 3.5;
            this._paletteSectorTriggered = false;
            this._menuOrbs = [];
            this.setSkin();
            this.refreshBest();
            for (var i = 0; i < 9; i++) {
                this._menuOrbs.push(this.makeMenuOrb(PI / 2 + 0.8 + i * 0.62, i % 2));
            }
            if (PB.Audio) PB.Audio.setScene('menu');
        },

        makeMenuOrb: function (angle, lane) {
            return {
                angle: angle,
                lane: lane,
                kind: Math.random() < 0.18 ? 'shard' : 'orb',
                phase: Math.random() * TAU,
                menu: true
            };
        },

        startRun: function (tutorialMode) {
            this.setSkin();
            this.refreshBest();
            this.state = 'playing';
            this.obstacles = [];
            this.pending = [];
            this.particles = [];
            this.floaters = [];
            this.trail = [];
            this.tutorial = null;
            this.player = {
                angle: PI / 2,
                lane: 0,
                lanePos: 0,
                visible: true
            };
            this.run = {
                score: 0,
                orbs: 0,
                shards: 0,
                switches: 0,
                overdrives: 0,
                time: 0,
                sector: 1,
                maxCombo: 1,
                combo: 0,
                revived: false,
                tutorial: !!tutorialMode,
                deathAngle: 0
            };
            this.speed = 1.05;
            this.flow = tutorialMode ? 0.45 : 0;
            this.overdriveT = 0;
            this.invulnT = tutorialMode ? 999 : 0;
            this.sector = 1;
            this.paletteFrom = makePalette(THEMES[0]);
            this.paletteTo = makePalette(THEMES[0]);
            this.palette = makePalette(THEMES[0]);
            this.paletteT = 1;
            this.shake = 0;
            this.flash = 0;
            this.dyingT = 0;
            this.lastSwitch = -1;
            this.lastHud = -1;
            this._trailTimer = 0;
            this._orbBurst = 0;
            this._paletteSectorTriggered = false;
            this.nextRowAngle = this.player.angle + 2.35;
            this.lastGeneratedAngle = this.nextRowAngle;
            if (tutorialMode) {
                this.tutorial = {
                    stage: 0,
                    nextGateAt: this.run.time + 0.5,
                    gate: null,
                    endAt: 0,
                    orbsSpawned: false
                };
                this.onTutorialHint('tutorialSwitch');
            } else {
                this.ensureRows();
                this.spawnDueRows();
            }
            if (PB.Audio) PB.Audio.setScene('game');
            this.emitHud(true);
        },

        stats: function () {
            var r = this.run || {};
            return {
                score: Math.floor(r.score || 0),
                orbs: r.orbs || 0,
                shards: r.shards || 0,
                switches: r.switches || 0,
                overdrives: r.overdrives || 0,
                time: r.time || 0,
                sector: r.sector || 1,
                maxCombo: r.maxCombo || 1,
                revived: !!r.revived,
                tutorial: !!r.tutorial
            };
        },

        pause: function () {
            if (this.state !== 'playing') return false;
            this.state = 'paused';
            if (PB.Audio) PB.Audio.suspend();
            return true;
        },

        resume: function () {
            if (this.state !== 'paused') return false;
            this.state = 'playing';
            this.lastTs = 0;
            if (PB.Audio) PB.Audio.resume();
            return true;
        },

        switchLane: function () {
            if (this.state !== 'playing' || !this.player) return;
            if (this.run && this.run.time - this.lastSwitch < 0.055) return;
            if (this.run) this.lastSwitch = this.run.time;
            var old = this.player.lane;
            this.player.lane = old ? 0 : 1;
            if (this.run) this.run.switches++;
            var px = this.cx + Math.cos(this.player.angle) * this.laneRadius(this.player.lanePos);
            var py = this.cy + Math.sin(this.player.angle) * this.laneRadius(this.player.lanePos);
            this.burst(px, py, this.skin.glow, 9, 80, 0.45);
            if (PB.Audio) PB.Audio.switchLane(this.player.lane ? 1 : -1);
            if (this.tutorial && this.tutorial.stage <= 1) {
                var gate = this.tutorial.gate;
                if (gate && !gate.dead && this.player.lane !== gate.lane) {
                    var ahead = gate.angle - this.player.angle;
                    if (ahead < 1.15) this.tutorialSuccess();
                }
            }
        },

        // ----------------------------------------------------------------- tutorial

        spawnTutorialGate: function (lane) {
            var gate = {
                lane: lane,
                angle: this.player.angle + 2.0,
                width: 0.34,
                seed: Math.random() * 100,
                passed: false,
                dead: false,
                tutorial: true
            };
            this.obstacles.push(gate);
            this.tutorial.gate = gate;
        },

        tutorialSuccess: function () {
            if (!this.tutorial) return;
            var t = this.tutorial;
            if (t.gate) {
                this.destroyObstacle(t.gate, true);
                t.gate = null;
            }
            if (t.stage === 0) {
                t.stage = 1;
                t.nextGateAt = this.run.time + 0.55;
                this.onTutorialHint('tutorialDodge');
                if (PB.Audio) PB.Audio.collect(4);
            } else if (t.stage === 1) {
                t.stage = 2;
                this.onTutorialHint('tutorialOrbs');
                this.spawnTutorialOrbs();
            }
        },

        spawnTutorialOrbs: function () {
            var t = this.tutorial;
            if (!t) return;
            t.orbsSpawned = true;
            var lane = this.player.lane;
            for (var i = 0; i < 5; i++) {
                this.orbs.push({
                    angle: this.player.angle + 1.1 + i * 0.3,
                    lane: lane,
                    kind: 'orb',
                    phase: Math.random() * TAU,
                    tutorial: true
                });
            }
        },

        finishTutorial: function () {
            if (!this.tutorial) return;
            this.tutorial = null;
            if (this.run) this.run.tutorial = false;
            this.obstacles = this.obstacles.filter(function (o) { return !o.tutorial; });
            this.orbs = this.orbs.filter(function (o) { return !o.tutorial; });
            this.overdriveT = 0;
            this.flow = 0;
            this.invulnT = 1.6;
            this.speed = 1.05;
            this.run.sector = 1;
            this.sector = 1;
            this.paletteFrom = clonePalette(this.palette);
            this.paletteTo = makePalette(THEMES[0]);
            this.paletteT = 0;
            this.pending = [];
            this.nextRowAngle = this.player.angle + 2.6;
            this.lastGeneratedAngle = this.nextRowAngle;
            this.ensureRows();
            this.spawnDueRows();
            PB.Storage.state.tutorialDone = true;
            PB.Storage.state.updatedAt = Date.now();
            PB.Storage.saveSoon();
            this.onTutorialHint(null);
            if (this.callbacks.onTutorialDone) this.callbacks.onTutorialDone();
            if (PB.Audio) {
                PB.Audio.setScene('game');
                PB.Audio.go();
            }
        },

        // ------------------------------------------------------------------- spawn

        difficulty: function () {
            var s = this.sector;
            var t = this.run ? this.run.time : 0;
            return {
                speed: Math.min(2.55, 1.05 + (s - 1) * 0.075 + Math.min(0.62, t * 0.008)),
                gapTime: Math.max(0.54, 0.97 - (s - 1) * 0.045 - t * 0.00062),
                width: 0.2 + Math.min(0.09, (s - 1) * 0.012)
            };
        },

        ensureRows: function () {
            if (!this.run) return;
            var guard = 0;
            while (this.lastGeneratedAngle < this.player.angle + 9.5 && guard++ < 40) {
                var d = this.difficulty();
                var gap = Math.max(0.55, d.speed * d.gapTime);
                var lane;
                var last = this.pending.length ? this.pending[this.pending.length - 1].lane : null;
                if (last === null) lane = Math.random() < 0.5 ? 0 : 1;
                else lane = Math.random() < 0.7 ? 1 - last : last;
                var row = {
                    lane: lane,
                    angle: this.lastGeneratedAngle,
                    width: d.width,
                    gap: gap
                };
                this.pending.push(row);
                this.lastGeneratedAngle += gap;
                if (this.lastGeneratedAngle - this.player.angle > 9.5) break;
            }
        },

        spawnDueRows: function () {
            if (!this.run || this.run.tutorial) return;
            this.ensureRows();
            var guard = 0;
            while (this.pending.length && this.pending[0].angle - this.player.angle <= 2.35 && guard++ < 4) {
                var row = this.pending.shift();
                this.spawnRow(row);
            }
        },

        spawnRow: function (row) {
            var obs = {
                lane: row.lane,
                angle: row.angle,
                width: row.width,
                seed: Math.random() * 1000,
                passed: false,
                dead: false,
                tutorial: false
            };
            this.obstacles.push(obs);
            var next = this.pending[0];
            if (next) {
                var safeLane = 1 - row.lane;
                var start = row.angle + row.width / 2 + 0.2;
                var end = next.angle - next.width / 2 - 0.22;
                var count = Math.floor((end - start) / 0.185);
                count = clamp(count, 0, 3);
                if (count > 0) {
                    for (var i = 0; i < count; i++) {
                        var isLast = i === count - 1;
                        this.orbs.push({
                            angle: start + i * 0.185,
                            lane: safeLane,
                            kind: isLast && Math.random() < 0.16 ? 'shard' : 'orb',
                            phase: Math.random() * TAU,
                            tutorial: false
                        });
                    }
                }
            }
        },

        // ------------------------------------------------------------------ update

        loop: function (ts) {
            requestAnimationFrame(this._loop);
            if (!this.lastTs) this.lastTs = ts;
            var dt = Math.min(0.05, Math.max(0, (ts - this.lastTs) / 1000));
            this.lastTs = ts;
            if (this.state === 'playing' || this.state === 'menu') {
                this.animTime += dt;
                this.update(dt);
            } else if (this.state === 'dying') {
                this.animTime += dt * 0.35;
                this.updateDying(dt);
            } else {
                this.animTime += dt * 0.25;
                if (this.state === 'over') {
                    // Let celebration confetti and floating text finish after the run.
                    this.updateParticles(dt);
                    this.updateFloaters(dt);
                }
            }
            this.render();
        },

        update: function (dt) {
            if (this.state === 'menu') {
                this.updateMenu(dt);
                return;
            }
            if (this.state !== 'playing' || !this.run) return;
            var run = this.run;

            run.time += dt;
            var d = this.difficulty();
            this.speed += (d.speed - this.speed) * Math.min(1, dt * 1.4);
            this.player.angle += this.speed * dt;
            this.player.lanePos += (this.player.lane - this.player.lanePos) * Math.min(1, dt * 16);
            if (Math.abs(this.player.lane - this.player.lanePos) < 0.002) this.player.lanePos = this.player.lane;

            run.score += dt * this.speed * 16 * (this.overdriveT > 0 ? 2 : 1);
            this.sector = Math.floor(this.player.angle / (TAU * 3)) + 1;
            if (this.sector > run.sector) {
                run.sector = this.sector;
                this.onSector(this.sector);
            }
            if (this.sector !== 1) {
                var target = makePalette(THEMES[(this.sector - 1) % THEMES.length]);
                if (this.paletteT >= 1 && !this._paletteSectorTriggered) {
                    this.paletteFrom = clonePalette(this.palette);
                    this.paletteTo = target;
                    this.paletteT = 0;
                    this._paletteSectorTriggered = true;
                }
            } else {
                this._paletteSectorTriggered = false;
            }
            if (this.paletteT < 1) {
                this.paletteT = Math.min(1, this.paletteT + dt / 2.0);
                this.palette = mixPalette(this.paletteFrom, this.paletteTo, easeOut(this.paletteT));
            }

            if (this.overdriveT > 0) {
                this.overdriveT -= dt;
                this.flow = Math.max(0, this.overdriveT / 5.5);
                if (this.overdriveT <= 0) {
                    this.overdriveT = 0;
                    this.flow = 0;
                    if (PB.Audio) PB.Audio.setScene('game');
                }
            } else if (this.invulnT > 0) {
                this.invulnT = Math.max(0, this.invulnT - dt);
            }

            this._trailTimer += dt;
            this.recordTrail();
            if (this._trailTimer >= 0.045) {
                this._trailTimer = 0;
                this.emitTrailSpark();
            }

            if (run.tutorial) this.updateTutorial(dt);
            else {
                this.spawnDueRows();
                this.updateObstacles(dt);
                this.updateOrbs(dt);
            }

            this.updateParticles(dt);
            this.updateFloaters(dt);
            this.shake *= Math.pow(0.002, dt);
            this.flash *= Math.pow(0.01, dt);
            this._orbBurst += dt;
            if (run.time - this.lastHud > 0.08) {
                this.lastHud = run.time;
                this.emitHud(false);
            }
        },

        updateMenu: function (dt) {
            var p = this.player;
            p.angle += 0.3 * dt;
            this._menuSwitchIn -= dt;
            if (this._menuSwitchIn <= 0) {
                this._menuSwitchIn = 4.5 + Math.random() * 3;
                p.lane = p.lane ? 0 : 1;
            }
            p.lanePos += (p.lane - p.lanePos) * Math.min(1, dt * 5);
            this.recordTrail();
            var pr = this.laneRadius(p.lanePos);
            if (Math.random() < dt * 9) {
                var x = this.cx + Math.cos(p.angle) * pr;
                var y = this.cy + Math.sin(p.angle) * pr;
                this.burst(x, y, this.skin.glow, 1, 20, 0.6);
            }
            for (var i = 0; i < this._menuOrbs.length; i++) {
                var o = this._menuOrbs[i];
                var diff = angleDiff(o.angle, p.angle);
                if (diff > -0.08 && diff < 0.22 && Math.abs(this.laneRadius(o.lane) - pr) < 30) {
                    var ox = this.cx + Math.cos(o.angle) * this.laneRadius(o.lane);
                    var oy = this.cy + Math.sin(o.angle) * this.laneRadius(o.lane);
                    this.burst(ox, oy, o.kind === 'shard' ? '#ffd166' : '#bffcff', 8, 70, 0.5);
                    this._menuOrbs[i] = this.makeMenuOrb(p.angle + 2.0 + Math.random() * 3.4, Math.random() < 0.5 ? 0 : 1);
                }
            }
            this.updateParticles(dt);
            this.updateFloaters(dt);
        },

        updateTutorial: function (dt) {
            var t = this.tutorial;
            if (!t) return;
            if (t.stage <= 1) {
                if (!t.gate && this.run.time >= t.nextGateAt) {
                    this.spawnTutorialGate(this.player.lane);
                    this.onTutorialHint(t.stage === 0 ? 'tutorialSwitch' : 'tutorialDodge');
                }
                if (t.gate) {
                    var diff = t.gate.angle - this.player.angle;
                    if (diff < 1.15 && this.player.lane !== t.gate.lane) this.tutorialSuccess();
                    else if (diff < -0.55) {
                        t.gate.dead = true;
                        t.gate = null;
                        t.nextGateAt = this.run.time + 0.9;
                        this.onTutorialHint(t.stage === 0 ? 'tutorialSwitch' : 'tutorialDodge');
                    }
                }
            } else if (t.stage === 2) {
                if (!t.orbsSpawned && this.orbs.length === 0) this.spawnTutorialOrbs();
                if (this.orbs.length === 0 && this.flow < 1) {
                    this.spawnTutorialOrbs();
                }
            } else if (t.stage === 3) {
                if (this.run.time >= t.endAt) this.finishTutorial();
            }
            this.updateObstacles(dt);
            this.updateOrbs(dt);
        },

        updateObstacles: function (dt) {
            for (var i = this.obstacles.length - 1; i >= 0; i--) {
                var o = this.obstacles[i];
                if (o.dead) {
                    this.obstacles.splice(i, 1);
                    continue;
                }
                var r = this.laneRadius(o.lane);
                var radial = Math.abs(this.laneRadius(this.player.lanePos) - r);
                if (!o.passed && this.player.angle > o.angle + o.width / 2 + 0.06) {
                    o.passed = true;
                    if (!this.run.tutorial) {
                        this.run.score += 15 * this.comboMult();
                        this.addFloater(
                            this.cx + Math.cos(o.angle) * r,
                            this.cy + Math.sin(o.angle) * r,
                            '+15',
                            'rgba(190,225,255,0.7)',
                            13
                        );
                    }
                }
                var diff = angleDiff(this.player.angle, o.angle);
                var pa = clamp(7 / Math.max(40, r), 0.035, 0.1);
                if (!o.passed && Math.abs(diff) < o.width / 2 + pa && radial < this.band + 7) {
                    if (o.tutorial) {
                        // Tutorial collisions are harmless and handled by the tutorial timer.
                    } else if (this.overdriveT > 0) {
                        this.destroyObstacle(o, false);
                    } else if (this.invulnT > 0) {
                        // Revive shield: pass through safely.
                    } else {
                        this.die();
                        return;
                    }
                }
                if (this.player.angle > o.angle + o.width / 2 + 0.9) this.obstacles.splice(i, 1);
            }
        },

        updateOrbs: function (dt) {
            var pr = this.laneRadius(this.player.lanePos);
            var magnet = this.overdriveT > 0;
            for (var i = this.orbs.length - 1; i >= 0; i--) {
                var o = this.orbs[i];
                var or = this.laneRadius(o.lane);
                var diff = angleDiff(o.angle, this.player.angle);
                var laneOk = Math.abs(pr - or) < this.band + 12 || (magnet && Math.abs(diff) < 0.52);
                if (Math.abs(diff) < 0.16 && laneOk) {
                    this.collectOrb(o, i);
                    continue;
                }
                if (this.player.angle > o.angle + 0.55) this.orbs.splice(i, 1);
            }
        },

        collectOrb: function (o, index) {
            var x = this.cx + Math.cos(o.angle) * this.laneRadius(o.lane);
            var y = this.cy + Math.sin(o.angle) * this.laneRadius(o.lane);
            var isShard = o.kind === 'shard';
            var gain = isShard ? 0.18 : (this.run.tutorial ? 0.11 : 0.06);
            if (!this.run.tutorial) {
                this.run.combo += isShard ? 2 : 1;
                this.run.maxCombo = Math.max(this.run.maxCombo, this.comboMult());
                this.run.orbs += 1;
                if (isShard) this.run.shards += 1;
                var points = (isShard ? 80 : 25) * this.comboMult() * (this.overdriveT > 0 ? 2 : 1);
                this.run.score += points;
                this.addFloater(
                    x,
                    y,
                    '+' + Math.floor(points),
                    isShard ? 'rgba(255,220,140,0.95)' : 'rgba(190,250,255,0.9)',
                    isShard ? 20 : 15
                );
            }
            this.orbs.splice(index, 1);
            this.burst(x, y, isShard ? '#ffd166' : '#bffcff', isShard ? 20 : 9, isShard ? 130 : 75, 0.55);
            if (this.overdriveT <= 0) {
                this.flow = Math.min(1, this.flow + gain);
            }
            if (PB.Audio) {
                if (isShard) PB.Audio.shard();
                else PB.Audio.collect(this.run.combo);
            }
            if (this.flow >= 1 && this.overdriveT <= 0) this.startOverdrive();
        },

        comboMult: function () {
            if (!this.run) return 1;
            return 1 + Math.min(4, Math.floor(this.run.combo / 8));
        },

        startOverdrive: function () {
            this.overdriveT = 5.5;
            this.flow = 1;
            this.run.overdrives++;
            if (PB.Audio) {
                PB.Audio.overdrive();
                PB.Audio.setScene('overdrive');
            }
            this.burst(this.cx, this.cy, '#ffd166', 36, 240, 0.9);
            if (this.callbacks.onOverdrive) this.callbacks.onOverdrive();
            if (this.run.tutorial && this.tutorial && this.tutorial.stage === 2) {
                this.tutorial.stage = 3;
                this.tutorial.endAt = this.run.time + 2.6;
                this.onTutorialHint('tutorialPulse');
            }
        },

        destroyObstacle: function (o, quiet) {
            if (!o || o.dead) return;
            o.dead = true;
            var x = this.cx + Math.cos(o.angle) * this.laneRadius(o.lane);
            var y = this.cy + Math.sin(o.angle) * this.laneRadius(o.lane);
            this.burst(x, y, this.palette.obsEdge ? rgbStr(this.palette.obsEdge) : '#ff9bd2', 18, 170, 0.7);
            if (!quiet && this.run && !this.run.tutorial) {
                this.run.score += 100;
                this.addFloater(x, y, '+100', 'rgba(255,220,140,0.95)', 20);
            }
        },

        addFloater: function (x, y, text, color, size) {
            var fy = y;
            var offset = 0;
            for (var i = 0; i < this.floaters.length; i++) {
                if (Math.abs(this.floaters[i].x - x) < 52 && Math.abs(this.floaters[i].y - (y + offset)) < 38) {
                    offset -= 24;
                }
            }
            fy = y + offset;
            this.floaters.push({
                x: x,
                y: fy,
                text: text,
                color: color,
                life: 0.75,
                max: 0.75,
                size: size
            });
            if (this.floaters.length > 24) this.floaters.shift();
        },

        die: function () {
            if (!this.run || this.state !== 'playing') return;
            this.state = 'dying';
            this.dyingT = 1.1;
            this.shake = 26;
            this.flash = 0.85;
            this.run.deathAngle = this.player.angle;
            var x = this.cx + Math.cos(this.player.angle) * this.laneRadius(this.player.lanePos);
            var y = this.cy + Math.sin(this.player.angle) * this.laneRadius(this.player.lanePos);
            this.player.visible = false;
            this.burst(x, y, '#ff7a9b', 55, 270, 1.1);
            this.burst(x, y, '#ffffff', 20, 160, 0.75);
            if (PB.Audio) {
                PB.Audio.hit();
                PB.Audio.setScene('over');
            }
            var stats = this.stats();
            stats.score = Math.floor(this.run.score);
            this.lastResult = stats;
            if (this.callbacks.onGameplayStop) this.callbacks.onGameplayStop();
            if (this.callbacks.onRunEnd) this.callbacks.onRunEnd(stats);
            this.lastHud = -1;
        },

        updateDying: function (dt) {
            this.updateParticles(dt);
            this.updateFloaters(dt);
            this.shake *= Math.pow(0.004, dt);
            this.flash *= Math.pow(0.02, dt);
            this.dyingT -= dt;
            if (this.dyingT <= 0 && this.state === 'dying') {
                this.state = 'over';
                if (PB.Audio) PB.Audio.setScene('over');
            }
        },

        reviveRun: function () {
            if (this.state !== 'over' && this.state !== 'dying') return false;
            if (!this.run || this.run.revived) return false;
            this.run.revived = true;
            this.state = 'playing';
            this.dyingT = 0;
            this.player.visible = true;
            this.particles = [];
            this.floaters = [];
            this.trail = [];
            this.invulnT = 3;
            this.flow = 0.35;
            this.overdriveT = 0;
            this.shake = 0;
            this.flash = 0.3;
            var keep = [];
            for (var i = 0; i < this.obstacles.length; i++) {
                var o = this.obstacles[i];
                if (o.angle - this.player.angle > 1.6 || this.player.angle - o.angle > 0.5) keep.push(o);
            }
            this.obstacles = keep;
            this.pending = [];
            this.nextRowAngle = this.player.angle + 2.4;
            this.lastGeneratedAngle = this.nextRowAngle;
            this.ensureRows();
            this.burst(this.cx + Math.cos(this.player.angle) * this.laneRadius(this.player.lanePos), this.cy + Math.sin(this.player.angle) * this.laneRadius(this.player.lanePos), '#9ffcff', 40, 180, 0.9);
            if (PB.Audio) {
                PB.Audio.revive();
                PB.Audio.setScene('game');
            }
            this.emitHud(true);
            return true;
        },

        // ------------------------------------------------------------------ world

        recordTrail: function () {
            if (!this.player) return;
            this.trail.push({ a: this.player.angle, r: this.laneRadius(this.player.lanePos) });
            var max = PB.Storage.state.effects === 'low' ? 14 : 24;
            while (this.trail.length > max) this.trail.shift();
        },

        emitTrailSpark: function () {
            if (!this.player || this.player.visible === false) return;
            if (PB.Storage.state.effects === 'low' && Math.random() < 0.5) return;
            var r = this.laneRadius(this.player.lanePos) + (Math.random() - 0.5) * 8;
            var x = this.cx + Math.cos(this.player.angle + 0.02) * r;
            var y = this.cy + Math.sin(this.player.angle + 0.02) * r;
            this.particles.push({
                x: x, y: y,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                life: 0.35 + Math.random() * 0.3,
                max: 0.65,
                size: 1 + Math.random() * 1.8,
                color: this.skin ? this.skin.a : '#bffcff',
                type: 'glow'
            });
        },

        burst: function (x, y, color, count, power, life) {
            var low = PB.Storage.state.effects === 'low';
            count = Math.floor(count * (low ? 0.45 : 1));
            power = power || 100;
            life = life || 0.7;
            for (var i = 0; i < count; i++) {
                var a = Math.random() * TAU;
                var v = Math.random() * power;
                this.particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(a) * v,
                    vy: Math.sin(a) * v,
                    life: life * (0.55 + Math.random() * 0.5),
                    max: life,
                    size: 1 + Math.random() * 2.6,
                    color: color,
                    type: 'glow'
                });
            }
        },

        celebrate: function () {
            var colors = ['#57f5ff', '#8f63ff', '#ff5cae', '#ffd166', '#6dffc0', '#ffffff'];
            var count = PB.Storage.state.effects === 'low' ? 45 : 110;
            for (var i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.W,
                    y: -10 - Math.random() * 80,
                    vx: (Math.random() - 0.5) * 120,
                    vy: 80 + Math.random() * 240,
                    life: 1.6 + Math.random() * 1.2,
                    max: 2.8,
                    size: 2 + Math.random() * 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    type: 'confetti',
                    spin: Math.random() * TAU,
                    spinV: (Math.random() - 0.5) * 8
                });
            }
        },

        updateParticles: function (dt) {
            for (var i = this.particles.length - 1; i >= 0; i--) {
                var p = this.particles[i];
                p.life -= dt;
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                if (p.type === 'confetti') {
                    p.vy += 220 * dt;
                    p.vx *= 0.992;
                    p.spin += p.spinV * dt;
                } else {
                    p.vx *= Math.pow(0.06, dt);
                    p.vy *= Math.pow(0.06, dt);
                }
            }
            var cap = PB.Storage.state.effects === 'low' ? 160 : 420;
            if (this.particles.length > cap) this.particles.splice(0, this.particles.length - cap);
        },

        updateFloaters: function (dt) {
            for (var i = this.floaters.length - 1; i >= 0; i--) {
                var f = this.floaters[i];
                f.life -= dt;
                f.y -= 34 * dt;
                if (f.life <= 0) this.floaters.splice(i, 1);
            }
        },

        onSector: function (sector) {
            var idx = (sector - 1) % THEMES.length;
            this.paletteFrom = clonePalette(this.palette);
            this.paletteTo = makePalette(THEMES[idx]);
            this.paletteT = 0;
            this._paletteSectorTriggered = true;
            this.burst(this.cx, this.cy, rgbStr(this.paletteTo.accent), 40, 260, 1.0);
            if (PB.Audio) PB.Audio.sector();
            if (this.callbacks.onSector) this.callbacks.onSector(sector);
        },

        onTutorialHint: function (key) {
            if (this.callbacks.onTutorialHint) this.callbacks.onTutorialHint(key);
        },

        emitHud: function (force) {
            if (!this.run || !this.callbacks.onHud) return;
            this.callbacks.onHud({
                score: Math.floor(this.run.score),
                combo: this.comboMult(),
                comboRaw: this.run.combo,
                sector: this.sector,
                flow: this.flow,
                overdrive: this.overdriveT > 0,
                best: this.best
            });
        },

        // ------------------------------------------------------------------ render

        render: function () {
            var ctx = this.ctx;
            if (!ctx) return;
            var W = this.W, H = this.H;
            ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
            this.drawBackground(ctx);
            this.drawStars(ctx);
            ctx.save();
            var sx = 0, sy = 0;
            if (this.shake > 0.3) {
                sx = (Math.random() - 0.5) * this.shake;
                sy = (Math.random() - 0.5) * this.shake;
            }
            ctx.translate(sx, sy);
            this.drawPulsar(ctx);
            this.drawRings(ctx);
            this.drawOrbs(ctx);
            this.drawObstacles(ctx);
            this.drawPlayer(ctx);
            this.drawParticles(ctx);
            this.drawFloaters(ctx);
            ctx.restore();
            this.drawVignette(ctx);
            if (this.flash > 0.01) {
                ctx.fillStyle = 'rgba(255,255,255,' + Math.min(0.55, this.flash * 0.7) + ')';
                ctx.fillRect(0, 0, W, H);
            }
        },

        drawBackground: function (ctx) {
            var p = this.palette;
            var key = '';
            for (var k in p) if (Object.prototype.hasOwnProperty.call(p, k)) key += p[k].map(function (v) { return Math.round(v / 10); }).join(',');
            key += '|' + this.W + 'x' + this.H + '|' + Math.round(this.cx) + ',' + Math.round(this.cy);
            if (!this._bg || key !== this._bgKey) {
                this._bgKey = key;
                var scale = 0.5;
                var bw = Math.max(1, Math.floor(this.W * scale));
                var bh = Math.max(1, Math.floor(this.H * scale));
                if (!this._bg) this._bg = document.createElement('canvas');
                if (this._bg.width !== bw || this._bg.height !== bh) {
                    this._bg.width = bw;
                    this._bg.height = bh;
                }
                var b = this._bg.getContext('2d');
                b.setTransform(scale, 0, 0, scale, 0, 0);
                var grad = b.createLinearGradient(0, 0, this.W * 0.3, this.H);
                grad.addColorStop(0, rgbStr(p.bg1));
                grad.addColorStop(0.58, rgbStr(p.bg2));
                grad.addColorStop(1, rgbStr(p.bg1));
                b.fillStyle = grad;
                b.fillRect(0, 0, this.W, this.H);
                var blobs = [
                    { x: this.cx - this.W * 0.22, y: this.cy - this.H * 0.18, r: Math.max(this.W, this.H) * 0.55, c: p.neb1, a: 0.2 },
                    { x: this.cx + this.W * 0.28, y: this.cy + this.H * 0.12, r: Math.max(this.W, this.H) * 0.48, c: p.neb2, a: 0.17 },
                    { x: this.cx, y: this.cy + this.H * 0.42, r: Math.max(this.W, this.H) * 0.5, c: p.accent, a: 0.07 }
                ];
                for (var i = 0; i < blobs.length; i++) {
                    var bl = blobs[i];
                    var rg = b.createRadialGradient(bl.x, bl.y, 0, bl.x, bl.y, bl.r);
                    rg.addColorStop(0, css(bl.c, bl.a));
                    rg.addColorStop(0.55, css(bl.c, bl.a * 0.35));
                    rg.addColorStop(1, css(bl.c, 0));
                    b.fillStyle = rg;
                    b.fillRect(0, 0, this.W, this.H);
                }
                // Faint orbital arcs in the background.
                b.strokeStyle = css(p.lane, 0.055);
                b.lineWidth = 1.2;
                for (var j = 1; j <= 3; j++) {
                    b.beginPath();
                    b.arc(this.cx, this.cy, this.R * (1.45 + j * 0.34), 0, TAU);
                    b.stroke();
                }
            }
            ctx.drawImage(this._bg, 0, 0, this.W, this.H);
        },

        drawStars: function (ctx) {
            var count = PB.Storage.state.effects === 'low' ? 90 : this._stars.length;
            var speed = this.state === 'playing' ? this.speed : 0.4;
            for (var i = 0; i < count; i++) {
                var s = this._stars[i];
                var x = ((s.x + this.animTime * 0.002 * (0.2 + s.z)) % 1) * this.W;
                var y = s.y * this.H;
                var tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(this.animTime * s.twinkle + s.phase));
                var alpha = (0.25 + s.z * 0.55) * tw;
                var size = s.size * (0.7 + s.z * 0.6);
                if (this.overdriveT > 0) {
                    ctx.strokeStyle = 'rgba(200,240,255,' + alpha * 0.8 + ')';
                    ctx.lineWidth = size * 0.8;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x - speed * 6 * (0.3 + s.z), y);
                    ctx.stroke();
                } else {
                    ctx.fillStyle = 'rgba(220,235,255,' + alpha + ')';
                    ctx.beginPath();
                    ctx.arc(x, y, size * 0.65, 0, TAU);
                    ctx.fill();
                }
            }
        },

        drawPulsar: function (ctx) {
            var p = this.palette;
            var cx = this.cx, cy = this.cy;
            var pulse = 0.5 + 0.5 * Math.sin(this.animTime * 2.1);
            var over = this.overdriveT > 0;
            var main = over ? [255, 214, 120] : p.accent;
            var glowSize = this.R * (1.0 + pulse * 0.08) * (over ? 1.25 : 1);
            this.drawGlow(ctx, cx, cy, glowSize, main, 0.4 + pulse * 0.12);
            this.drawGlow(ctx, cx, cy, this.core * 5.2, p.core, 0.3);

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(this.animTime * (over ? 0.45 : 0.18));
            for (var i = 0; i < 16; i++) {
                var a = i / 16 * TAU;
                var len = this.core * (1.35 + 0.28 * Math.sin(this.animTime * 1.7 + i * 1.3));
                ctx.strokeStyle = css(main, 0.06 + 0.1 * (0.5 + 0.5 * Math.sin(this.animTime * 2 + i)));
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * this.core * 0.95, Math.sin(a) * this.core * 0.95);
                ctx.lineTo(Math.cos(a) * (this.core + len), Math.sin(a) * (this.core + len));
                ctx.stroke();
            }
            ctx.restore();

            var coreR = this.core * (0.94 + pulse * 0.05);
            var cg = ctx.createRadialGradient(cx - coreR * 0.2, cy - coreR * 0.2, 0, cx, cy, coreR);
            cg.addColorStop(0, '#ffffff');
            cg.addColorStop(0.42, rgbStr(p.core));
            cg.addColorStop(0.8, css(main, 0.85));
            cg.addColorStop(1, css(main, 0));
            ctx.fillStyle = cg;
            ctx.beginPath();
            ctx.arc(cx, cy, coreR, 0, TAU);
            ctx.fill();

            ctx.strokeStyle = css(p.core, 0.24);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, coreR * 1.55, 0, TAU);
            ctx.stroke();

            // Flow / overdrive gauge around the pulsar.
            var gr = coreR * 2.15;
            ctx.strokeStyle = 'rgba(200,230,255,0.1)';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(cx, cy, gr, 0, TAU);
            ctx.stroke();
            var flow = clamp(this.flow, 0, 1);
            if (flow > 0.002) {
                var gcol = over ? [255, 209, 102] : main;
                ctx.strokeStyle = css(gcol, 0.9);
                ctx.lineWidth = 5;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.arc(cx, cy, gr, -PI / 2, -PI / 2 + TAU * flow);
                ctx.stroke();
                var ex = cx + Math.cos(-PI / 2 + TAU * flow) * gr;
                var ey = cy + Math.sin(-PI / 2 + TAU * flow) * gr;
                this.drawGlow(ctx, ex, ey, 24, gcol, 0.7);
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(ex, ey, 2.2, 0, TAU);
                ctx.fill();
            }
            if (over) {
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(-this.animTime * 0.9);
                ctx.strokeStyle = 'rgba(255,214,120,0.4)';
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 9]);
                ctx.beginPath();
                ctx.arc(0, 0, gr + 9, 0, TAU);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.restore();
            }
        },

        drawRings: function (ctx) {
            var p = this.palette;
            var over = this.overdriveT > 0;
            // Annulus fill.
            ctx.fillStyle = 'rgba(255,255,255,0.012)';
            ctx.beginPath();
            ctx.arc(this.cx, this.cy, this.Rout + this.band, 0, TAU);
            ctx.arc(this.cx, this.cy, this.Rin - this.band, 0, TAU, true);
            ctx.fill();

            var lanes = [
                { r: this.Rin, c: p.lane, alpha: 0.5 },
                { r: this.Rout, c: p.lane2, alpha: 0.55 }
            ];
            for (var i = 0; i < lanes.length; i++) {
                var l = lanes[i];
                ctx.strokeStyle = css(l.c, 0.06);
                ctx.lineWidth = 11;
                ctx.beginPath();
                ctx.arc(this.cx, this.cy, l.r, 0, TAU);
                ctx.stroke();
                ctx.strokeStyle = css(l.c, l.alpha);
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.arc(this.cx, this.cy, l.r, 0, TAU);
                ctx.stroke();
                ctx.strokeStyle = css(l.c, 0.18);
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 12]);
                ctx.lineDashOffset = -this.animTime * 14;
                ctx.beginPath();
                ctx.arc(this.cx, this.cy, l.r + this.band + 3, 0, TAU);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.lineDashOffset = 0;
            }

            // Decorative outer orbit + direction chevrons.
            ctx.strokeStyle = css(p.lane2, 0.1);
            ctx.lineWidth = 1;
            ctx.setLineDash([1, 16]);
            ctx.beginPath();
            ctx.arc(this.cx, this.cy, this.R * 1.22, 0, TAU);
            ctx.stroke();
            ctx.setLineDash([]);
            for (var j = 0; j < 3; j++) {
                var a = this.animTime * 0.06 + j * TAU / 3;
                var r = this.R * 1.22;
                var x = this.cx + Math.cos(a) * r;
                var y = this.cy + Math.sin(a) * r;
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(a + PI / 2);
                ctx.strokeStyle = css(p.lane, 0.24);
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(-3, -2);
                ctx.lineTo(0, 2);
                ctx.lineTo(3, -2);
                ctx.stroke();
                ctx.restore();
            }
            if (over) {
                ctx.strokeStyle = 'rgba(255,209,102,0.12)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(this.cx, this.cy, this.R * 1.1, this.animTime * 0.7, this.animTime * 0.7 + PI * 1.2);
                ctx.stroke();
            }
        },

        drawObstacles: function (ctx) {
            var p = this.palette;
            for (var i = 0; i < this.obstacles.length; i++) {
                var o = this.obstacles[i];
                if (o.dead) continue;
                var r = this.laneRadius(o.lane);
                var band = this.band;
                var a1 = o.angle - o.width / 2;
                var a2 = o.angle + o.width / 2;
                var ahead = o.angle - this.player.angle;
                var warn = ahead > 0 && ahead < 0.85;
                ctx.save();
                if (warn) {
                    ctx.strokeStyle = css(p.obsEdge, 0.18 + 0.14 * Math.sin(this.animTime * 12));
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(this.cx, this.cy, r, a1 - 0.18, a1 - 0.02);
                    ctx.stroke();
                }
                var g = ctx.createRadialGradient(this.cx, this.cy, r - band, this.cx, this.cy, r + band);
                g.addColorStop(0, 'rgba(10,8,24,0.95)');
                g.addColorStop(0.55, 'rgba(45,14,48,0.96)');
                g.addColorStop(1, css(p.obs, 0.24));
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(this.cx, this.cy, r + band, a1, a2);
                ctx.arc(this.cx, this.cy, r - band, a2, a1, true);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = css(p.obsEdge, warn ? 0.95 : 0.65);
                ctx.lineWidth = 1.4;
                ctx.stroke();
                // Crystal veins.
                ctx.strokeStyle = css(p.obsEdge, 0.28);
                ctx.lineWidth = 1;
                for (var k = 0; k < 3; k++) {
                    var aa = a1 + (k + 1) / 4 * (a2 - a1);
                    var rr = r - band * 0.7 + k * band * 0.65;
                    ctx.beginPath();
                    ctx.moveTo(this.cx + Math.cos(aa) * (r - band), this.cy + Math.sin(aa) * (r - band));
                    ctx.lineTo(this.cx + Math.cos(aa + 0.04) * (r + band * 0.7), this.cy + Math.sin(aa + 0.04) * (r + band * 0.7));
                    ctx.stroke();
                }
                // Leading edge glint.
                ctx.fillStyle = css(p.obsEdge, 0.8);
                ctx.beginPath();
                ctx.arc(this.cx + Math.cos(a1) * r, this.cy + Math.sin(a1) * r, 1.8, 0, TAU);
                ctx.fill();
                ctx.restore();
            }
        },

        drawOrbs: function (ctx) {
            var list = this.state === 'menu' ? this._menuOrbs : this.orbs;
            for (var i = 0; i < list.length; i++) {
                var o = list[i];
                var r = this.laneRadius(o.lane);
                var x = this.cx + Math.cos(o.angle) * r;
                var y = this.cy + Math.sin(o.angle) * r;
                var pulse = 0.7 + 0.3 * Math.sin(this.animTime * 4 + (o.phase || 0));
                if (o.kind === 'shard') {
                    this.drawGlow(ctx, x, y, 46 * pulse, '#ffd166', 0.55);
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(this.animTime * 0.8 + (o.phase || 0));
                    ctx.fillStyle = '#ffe7a6';
                    ctx.strokeStyle = 'rgba(255,244,200,0.9)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(0, -8);
                    ctx.lineTo(6, 0);
                    ctx.lineTo(0, 8);
                    ctx.lineTo(-6, 0);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    ctx.strokeStyle = 'rgba(255,209,102,0.5)';
                    ctx.beginPath();
                    ctx.arc(0, 0, 12, 0, TAU);
                    ctx.stroke();
                    ctx.restore();
                } else {
                    this.drawGlow(ctx, x, y, 28 * pulse, '#bffcff', 0.48);
                    ctx.save();
                    ctx.translate(x, y);
                    var size = 4.2 + pulse * 1.2;
                    ctx.fillStyle = '#eaffff';
                    ctx.beginPath();
                    ctx.moveTo(0, -size * 1.8);
                    ctx.quadraticCurveTo(size * 0.35, -size * 0.35, size * 1.8, 0);
                    ctx.quadraticCurveTo(size * 0.35, size * 0.35, 0, size * 1.8);
                    ctx.quadraticCurveTo(-size * 0.35, size * 0.35, -size * 1.8, 0);
                    ctx.quadraticCurveTo(-size * 0.35, -size * 0.35, 0, -size * 1.8);
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.arc(0, 0, size * 0.75, 0, TAU);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        },

        drawPlayer: function (ctx) {
            if (!this.player || this.player.visible === false) return;
            var skin = this.skin || PB.Storage.currentSkin();
            var over = this.overdriveT > 0;
            var inv = this.invulnT > 0;
            var colA = skin.a;
            var colB = skin.b;
            if (skin.style === 'prism') {
                var hue = (this.animTime * 55) % 360;
                colA = hslHex(hue, 92, 66);
                colB = hslHex((hue + 150) % 360, 90, 60);
            }
            var points = [];
            for (var i = 0; i < this.trail.length; i++) {
                var t = this.trail[i];
                points.push({
                    x: this.cx + Math.cos(t.a) * t.r,
                    y: this.cy + Math.sin(t.a) * t.r
                });
            }
            var headR = this.laneRadius(this.player.lanePos);
            var hx = this.cx + Math.cos(this.player.angle) * headR;
            var hy = this.cy + Math.sin(this.player.angle) * headR;
            points.push({ x: hx, y: hy });

            // Wide soft trail.
            if (points.length > 2) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = colB;
                ctx.globalAlpha = 0.1;
                ctx.lineWidth = 15;
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (var j = 1; j < points.length - 1; j++) {
                    var mx = (points[j].x + points[j + 1].x) / 2;
                    var my = (points[j].y + points[j + 1].y) / 2;
                    ctx.quadraticCurveTo(points[j].x, points[j].y, mx, my);
                }
                ctx.lineTo(hx, hy);
                ctx.stroke();
                ctx.globalAlpha = 1;

                for (var k = 1; k < points.length; k++) {
                    var f = k / points.length;
                    ctx.strokeStyle = (k % 2 === 0) ? colA : colB;
                    ctx.globalAlpha = 0.08 + f * 0.72;
                    ctx.lineWidth = 1.2 + f * 4.4;
                    ctx.beginPath();
                    ctx.moveTo(points[k - 1].x, points[k - 1].y);
                    ctx.lineTo(points[k].x, points[k].y);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
            }

            this.drawGlow(ctx, hx, hy, over ? 66 : 46, over ? '#ffd166' : (skin.glow || colA), 0.75);
            if (skin.style === 'singularity') {
                ctx.fillStyle = '#05030c';
                ctx.beginPath();
                ctx.arc(hx, hy, 6.2, 0, TAU);
                ctx.fill();
                ctx.strokeStyle = '#f4ecff';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(hx, hy, 6.4, 0, TAU);
                ctx.stroke();
            } else {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(hx, hy, 4.6, 0, TAU);
                ctx.fill();
                ctx.strokeStyle = colA;
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.arc(hx, hy, 6.3, 0, TAU);
                ctx.stroke();
            }
            if (skin.style === 'phantom') {
                ctx.strokeStyle = 'rgba(235,245,255,0.55)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(hx, hy, 9 + Math.sin(this.animTime * 4) * 1.5, 0, TAU);
                ctx.stroke();
            }
            if (inv) {
                ctx.strokeStyle = 'rgba(150,250,255,' + (0.35 + 0.2 * Math.sin(this.animTime * 9)) + ')';
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.arc(hx, hy, 15 + Math.sin(this.animTime * 6) * 1.5, 0, TAU);
                ctx.stroke();
            }
            if (over) {
                ctx.strokeStyle = 'rgba(255,214,120,0.7)';
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 5]);
                ctx.beginPath();
                ctx.arc(hx, hy, 14, this.animTime * 2, this.animTime * 2 + TAU);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        },

        drawParticles: function (ctx) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (var i = 0; i < this.particles.length; i++) {
                var p = this.particles[i];
                var a = clamp(p.life / p.max, 0, 1);
                if (p.type === 'confetti') {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.spin || 0);
                    ctx.globalAlpha = a;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                    ctx.restore();
                } else {
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.globalAlpha = a;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * (0.6 + a * 0.7), 0, TAU);
                    ctx.fill();
                }
            }
            ctx.restore();
        },

        drawFloaters: function (ctx) {
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            for (var i = 0; i < this.floaters.length; i++) {
                var f = this.floaters[i];
                var a = clamp(f.life / f.max, 0, 1);
                ctx.globalAlpha = a;
                ctx.fillStyle = f.color;
                ctx.font = '800 ' + f.size + 'px "Segoe UI", "SF Pro Display", system-ui, sans-serif';
                ctx.fillText(f.text, f.x, f.y);
            }
            ctx.restore();
        },

        drawVignette: function (ctx) {
            var g = ctx.createRadialGradient(this.cx, this.cy, this.R * 0.4, this.cx, this.cy, Math.max(this.W, this.H) * 0.78);
            g.addColorStop(0, 'rgba(0,0,0,0)');
            g.addColorStop(0.62, 'rgba(0,0,0,0.06)');
            g.addColorStop(1, 'rgba(0,0,0,0.5)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, this.W, this.H);
        },

        drawGlow: function (ctx, x, y, size, color, alpha) {
            if (size <= 0) return;
            if (Object.prototype.toString.call(color) === '[object Array]') color = rgbStr(color);
            var sprite = this.getGlowSprite(color);
            if (!sprite) return;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = clamp(alpha, 0, 1);
            ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
            ctx.restore();
        },

        getGlowSprite: function (color) {
            var key = color;
            if (this._glowCache[key]) return this._glowCache[key];
            var size = 128;
            var c = document.createElement('canvas');
            c.width = size;
            c.height = size;
            var g = c.getContext('2d');
            var rgb = hexToRgb(color);
            var grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
            grad.addColorStop(0, 'rgba(255,255,255,0.95)');
            grad.addColorStop(0.18, 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.8)');
            grad.addColorStop(0.45, 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.24)');
            grad.addColorStop(1, 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0)');
            g.fillStyle = grad;
            g.fillRect(0, 0, size, size);
            this._glowCache[key] = c;
            if (Object.keys(this._glowCache).length > 60) {
                // Keep the cache bounded when Prism cycles hues.
                var first = Object.keys(this._glowCache)[0];
                delete this._glowCache[first];
            }
            return c;
        }
    };

    global.PB = global.PB || {};
    global.PB.Game = Game;
    global.PB.THEMES = THEMES;
})(window);

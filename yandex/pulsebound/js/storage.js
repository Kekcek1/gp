/* Pulsebound — save data, progression, missions and daily gifts. */
(function (global) {
    'use strict';

    var KEY = 'pulsebound_save_v1';
    var CLOUD_KEY = 'pb_save_v1';
    var VERSION = 1;

    var SKINS = [
        { id: 'aurora', price: 0, a: '#79fbff', b: '#8b6bff', glow: '#57f5ff', style: 'comet' },
        { id: 'solaris', price: 250, a: '#ffe08a', b: '#ff9445', glow: '#ffd166', style: 'comet' },
        { id: 'nova', price: 500, a: '#ff8bd0', b: '#ff3d7f', glow: '#ff5cae', style: 'comet' },
        { id: 'verdant', price: 900, a: '#8dffd0', b: '#00cfa6', glow: '#6dffc0', style: 'comet' },
        { id: 'crimson', price: 1400, a: '#ff9a8a', b: '#d6204f', glow: '#ff5570', style: 'comet' },
        { id: 'phantom', price: 2000, a: '#f0f5ff', b: '#8793ff', glow: '#c9d8ff', style: 'phantom' },
        { id: 'prism', price: 3000, a: '#ff9bd2', b: '#6ffcff', glow: '#ff8bd0', style: 'prism' },
        { id: 'singularity', price: 4500, a: '#ffffff', b: '#8f5cff', glow: '#c39bff', style: 'singularity' }
    ];

    var DAILY_REWARDS = [50, 75, 100, 150, 200, 300, 500];

    var MISSION_META = {
        score: { key: 'missionScore', icon: 'i-target', min: 600, step: 220, reward: 90, mode: 'max' },
        orbs: { key: 'missionOrbs', icon: 'i-star', min: 12, step: 4, reward: 85, mode: 'max' },
        switches: { key: 'missionSwitches', icon: 'i-comet', min: 18, step: 7, reward: 75, mode: 'max' },
        time: { key: 'missionTime', icon: 'i-pause', min: 40, step: 12, reward: 95, mode: 'max' },
        shards: { key: 'missionShards', icon: 'i-dust', min: 3, step: 2, reward: 80, mode: 'sum' },
        overdrives: { key: 'missionOverdrives', icon: 'i-bolt', min: 2, step: 1, reward: 95, mode: 'sum' },
        runs: { key: 'missionRuns', icon: 'i-play', min: 3, step: 2, reward: 65, mode: 'sum' },
        dust: { key: 'missionDust', icon: 'i-dust', min: 120, step: 55, reward: 75, mode: 'sum' }
    };

    function todayStr(d) {
        d = d || new Date();
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1);
        var day = String(d.getDate());
        if (m.length < 2) m = '0' + m;
        if (day.length < 2) day = '0' + day;
        return y + '-' + m + '-' + day;
    }

    function dateFromStr(s) {
        if (!s || typeof s !== 'string') return null;
        var p = s.split('-');
        if (p.length !== 3) return null;
        var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
        return isNaN(d.getTime()) ? null : d;
    }

    function daysBetween(a, b) {
        if (!a || !b) return 999;
        var da = dateFromStr(a);
        var db = dateFromStr(b);
        if (!da || !db) return 999;
        return Math.round((db.getTime() - da.getTime()) / 86400000);
    }

    function hashString(str) {
        var h = 2166136261 >>> 0;
        for (var i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return h >>> 0;
    }

    function mulberry32(seed) {
        return function () {
            seed |= 0;
            seed = seed + 0x6D2B79F5 | 0;
            var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    function defaultState() {
        return {
            v: VERSION,
            best: 0,
            dust: 0,
            runs: 0,
            totalOrbs: 0,
            totalDust: 0,
            totalTime: 0,
            bestCombo: 0,
            maxSector: 1,
            owned: ['aurora'],
            equipped: 'aurora',
            sound: true,
            music: true,
            effects: 'high',
            lang: 'auto',
            tutorialDone: false,
            missions: { date: '', progress: {}, claimed: {}, bonusClaimed: false, list: [] },
            daily: { last: '', streak: 0 },
            updatedAt: 0
        };
    }

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function safeInt(n, fallback) {
        n = Number(n);
        return isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
    }

    var Storage = {
        state: defaultState(),
        player: null,
        cloudReady: false,
        cloudKey: CLOUD_KEY,
        skins: SKINS,
        dailyRewards: DAILY_REWARDS,
        missionMeta: MISSION_META,
        _saveTimer: null,
        _cloudTimer: null,
        _lastCloud: 0,

        loadLocal: function () {
            var data = null;
            try {
                var raw = global.localStorage.getItem(KEY);
                if (raw) data = JSON.parse(raw);
            } catch (e) {
                data = null;
            }
            this.state = this.normalize(data || defaultState());
            this.ensureMissions();
            this.state.updatedAt = this.state.updatedAt || Date.now();
            return this.state;
        },

        normalize: function (raw) {
            var base = defaultState();
            if (!raw || typeof raw !== 'object') return base;
            var s = {};
            for (var key in base) {
                if (Object.prototype.hasOwnProperty.call(base, key)) s[key] = raw[key] !== undefined ? raw[key] : base[key];
            }
            s.v = VERSION;
            s.best = safeInt(raw.best, 0);
            s.dust = safeInt(raw.dust, 0);
            s.runs = safeInt(raw.runs, 0);
            s.totalOrbs = safeInt(raw.totalOrbs, 0);
            s.totalDust = safeInt(raw.totalDust, s.dust);
            s.totalTime = Math.max(0, Number(raw.totalTime) || 0);
            s.bestCombo = safeInt(raw.bestCombo, 0);
            s.maxSector = Math.max(1, safeInt(raw.maxSector, 1));
            s.bestCombo = Math.max(1, s.bestCombo);
            var owned = Array.isArray(raw.owned) ? raw.owned.filter(function (id) { return !!Storage.getSkin(id); }) : [];
            if (owned.indexOf('aurora') < 0) owned.push('aurora');
            s.owned = owned;
            s.equipped = s.owned.indexOf(raw.equipped) >= 0 ? raw.equipped : 'aurora';
            s.sound = raw.sound !== false;
            s.music = raw.music !== false;
            s.effects = raw.effects === 'low' ? 'low' : 'high';
            s.lang = ['auto', 'ru', 'en', 'tr'].indexOf(raw.lang) >= 0 ? raw.lang : 'auto';
            s.tutorialDone = !!raw.tutorialDone;
            s.updatedAt = safeInt(raw.updatedAt, 0);
            if (raw.missions && typeof raw.missions === 'object') {
                s.missions = {
                    date: typeof raw.missions.date === 'string' ? raw.missions.date : '',
                    progress: raw.missions.progress && typeof raw.missions.progress === 'object' ? raw.missions.progress : {},
                    claimed: raw.missions.claimed && typeof raw.missions.claimed === 'object' ? raw.missions.claimed : {},
                    bonusClaimed: !!raw.missions.bonusClaimed,
                    list: Array.isArray(raw.missions.list) ? raw.missions.list : []
                };
            }
            if (raw.daily && typeof raw.daily === 'object') {
                s.daily = {
                    last: typeof raw.daily.last === 'string' ? raw.daily.last : '',
                    streak: safeInt(raw.daily.streak, 0)
                };
            }
            return s;
        },

        getSkin: function (id) {
            for (var i = 0; i < SKINS.length; i++) if (SKINS[i].id === id) return SKINS[i];
            return null;
        },

        currentSkin: function () {
            return this.getSkin(this.state.equipped) || SKINS[0];
        },

        isOwned: function (id) {
            return this.state.owned.indexOf(id) >= 0;
        },

        buySkin: function (id) {
            var skin = this.getSkin(id);
            if (!skin || this.isOwned(id)) return { ok: false, reason: 'owned' };
            if (this.state.dust < skin.price) return { ok: false, reason: 'dust' };
            this.state.dust -= skin.price;
            this.state.owned.push(id);
            this.state.updatedAt = Date.now();
            this.saveSoon();
            return { ok: true, skin: skin };
        },

        equipSkin: function (id) {
            if (!this.isOwned(id)) return false;
            this.state.equipped = id;
            this.state.updatedAt = Date.now();
            this.saveSoon();
            return true;
        },

        addDust: function (amount, silent) {
            amount = Math.max(0, Math.floor(Number(amount) || 0));
            if (!amount) return 0;
            this.state.dust += amount;
            this.state.totalDust += amount;
            this.state.updatedAt = Date.now();
            if (!silent) this.saveSoon();
            return amount;
        },

        setSound: function (on) {
            this.state.sound = !!on;
            this.state.updatedAt = Date.now();
            this.saveSoon();
        },

        setMusic: function (on) {
            this.state.music = !!on;
            this.state.updatedAt = Date.now();
            this.saveSoon();
        },

        setEffects: function (mode) {
            this.state.effects = mode === 'low' ? 'low' : 'high';
            this.state.updatedAt = Date.now();
            this.saveSoon();
        },

        setLang: function (lang) {
            this.state.lang = ['auto', 'ru', 'en', 'tr'].indexOf(lang) >= 0 ? lang : 'auto';
            this.state.updatedAt = Date.now();
            this.saveSoon();
        },

        recordRun: function (run) {
            this.ensureMissions();
            var score = Math.max(0, Math.floor(run.score || 0));
            var orbs = Math.max(0, Math.floor(run.orbs || 0));
            var shards = Math.max(0, Math.floor(run.shards || 0));
            var dust = Math.floor(score / 60) + orbs * 2 + shards * 8;
            var newBest = score > this.state.best;
            if (newBest) {
                this.state.best = score;
                dust += 50;
            }
            this.state.dust += dust;
            this.state.totalDust += dust;
            this.state.runs += 1;
            this.state.totalOrbs += orbs;
            this.state.totalTime += Math.max(0, Number(run.time) || 0);
            this.state.bestCombo = Math.max(this.state.bestCombo, Math.max(1, Math.floor(run.maxCombo || 1)));
            this.state.maxSector = Math.max(this.state.maxSector, Math.max(1, Math.floor(run.sector || 1)));
            this.state.updatedAt = Date.now();

            var completed = this.applyRunToMissions(run);
            this.saveSoon();
            return {
                dust: dust,
                newBest: newBest,
                best: this.state.best,
                completed: completed
            };
        },

        // ---------------------------------------------------------------- missions

        generateMissions: function (date) {
            var seed = hashString('pulsebound-' + date);
            var rand = mulberry32(seed);
            var types = Object.keys(MISSION_META);
            var chosen = [];
            // One scoring mission is always present; then two more distinct types.
            var scoreTypes = ['score', 'orbs', 'time', 'switches'];
            var first = scoreTypes[Math.floor(rand() * scoreTypes.length)];
            chosen.push(first);
            var pool = types.slice();
            while (chosen.length < 3 && pool.length) {
                var idx = Math.floor(rand() * pool.length);
                var t = pool.splice(idx, 1)[0];
                if (chosen.indexOf(t) < 0) chosen.push(t);
            }
            chosen.sort(function (a, b) {
                return types.indexOf(a) - types.indexOf(b);
            });
            var list = chosen.map(function (type) {
                var meta = MISSION_META[type];
                var tier = Math.floor(rand() * 4);
                var target = meta.min + meta.step * tier;
                var reward = meta.reward + (tier >= 2 ? 15 : 0);
                return { id: type + '_' + date, type: type, target: target, reward: reward };
            });
            return list;
        },

        ensureMissions: function () {
            var date = todayStr();
            var m = this.state.missions;
            if (!m || m.date !== date || !Array.isArray(m.list) || !m.list.length) {
                var list = this.generateMissions(date);
                m = { date: date, progress: {}, claimed: {}, bonusClaimed: false, list: list };
                this.state.missions = m;
            }
            return m;
        },

        missionList: function () {
            var m = this.ensureMissions();
            var self = this;
            return m.list.map(function (item) {
                var meta = MISSION_META[item.type];
                var progress = Math.min(item.target, Math.max(0, Number(m.progress[item.id]) || 0));
                return {
                    id: item.id,
                    type: item.type,
                    target: item.target,
                    reward: item.reward,
                    progress: progress,
                    done: progress >= item.target,
                    claimed: !!m.claimed[item.id],
                    icon: meta.icon,
                    titleKey: meta.key
                };
            });
        },

        applyRunToMissions: function (run) {
            var m = this.ensureMissions();
            var self = this;
            var completed = [];
            var runDust = Math.floor(Math.max(0, Number(run.score) || 0) / 60) + Math.max(0, Number(run.orbs) || 0) * 2 + Math.max(0, Number(run.shards) || 0) * 8;
            m.list.forEach(function (item) {
                var meta = MISSION_META[item.type];
                var current = Number(m.progress[item.id]) || 0;
                var value = 0;
                if (item.type === 'score') value = Number(run.score) || 0;
                else if (item.type === 'orbs') value = Number(run.orbs) || 0;
                else if (item.type === 'switches') value = Number(run.switches) || 0;
                else if (item.type === 'time') value = Number(run.time) || 0;
                else if (item.type === 'shards') value = Number(run.shards) || 0;
                else if (item.type === 'overdrives') value = Number(run.overdrives) || 0;
                else if (item.type === 'runs') value = 1;
                else if (item.type === 'dust') value = runDust;
                var next;
                if (meta.mode === 'max') next = Math.max(current, value);
                else next = current + value;
                next = Math.min(item.target, next);
                m.progress[item.id] = next;
                if (next >= item.target && !m.claimed[item.id] && !completed.some(function (c) { return c.id === item.id; })) {
                    completed.push({ id: item.id, type: item.type, target: item.target });
                }
            });
            return completed;
        },

        claimMission: function (id) {
            var m = this.ensureMissions();
            var item = null;
            for (var i = 0; i < m.list.length; i++) if (m.list[i].id === id) item = m.list[i];
            if (!item) return 0;
            var progress = Number(m.progress[id]) || 0;
            if (progress < item.target || m.claimed[id]) return 0;
            m.claimed[id] = true;
            this.addDust(item.reward, true);
            this.state.updatedAt = Date.now();
            this.saveSoon();
            return item.reward;
        },

        allMissionsClaimed: function () {
            var m = this.ensureMissions();
            return m.list.every(function (item) { return !!m.claimed[item.id]; });
        },

        claimMissionBonus: function () {
            var m = this.ensureMissions();
            if (!this.allMissionsClaimed() || m.bonusClaimed) return 0;
            m.bonusClaimed = true;
            this.addDust(100, true);
            this.state.updatedAt = Date.now();
            this.saveSoon();
            return 100;
        },

        missionResetMs: function () {
            var now = new Date();
            var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
            return Math.max(0, next.getTime() - now.getTime());
        },

        // ------------------------------------------------------------------ daily

        dailyInfo: function () {
            var today = todayStr();
            var daily = this.state.daily || { last: '', streak: 0 };
            var claimedToday = daily.last === today;
            var canClaim = !claimedToday;
            var gap = daily.last ? daysBetween(daily.last, today) : 999;
            var shownStreak = daily.streak;
            if (!claimedToday && daily.last && gap > 1) shownStreak = 0;
            var nextStreak;
            if (claimedToday) nextStreak = daily.streak;
            else if (daily.last && gap === 1) nextStreak = daily.streak + 1;
            else nextStreak = 1;
            if (nextStreak < 1) nextStreak = 1;
            var day = ((nextStreak - 1) % 7) + 1;
            return {
                canClaim: canClaim,
                claimedToday: claimedToday,
                streak: shownStreak,
                nextStreak: nextStreak,
                day: day,
                claimedDay: claimedToday ? ((daily.streak - 1) % 7) + 1 : 0,
                reward: DAILY_REWARDS[day - 1]
            };
        },

        claimDaily: function () {
            var info = this.dailyInfo();
            if (!info.canClaim) return null;
            var today = todayStr();
            var streak = info.nextStreak;
            var day = ((streak - 1) % 7) + 1;
            var reward = DAILY_REWARDS[day - 1];
            this.state.daily.last = today;
            this.state.daily.streak = streak;
            this.addDust(reward, true);
            this.state.updatedAt = Date.now();
            this.saveSoon();
            return { reward: reward, day: day, streak: streak };
        },

        dailyResetMs: function () {
            var now = new Date();
            var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
            return Math.max(0, next.getTime() - now.getTime());
        },

        // ----------------------------------------------------------------- saving

        serialize: function () {
            this.state.updatedAt = Date.now();
            return clone(this.state);
        },

        saveLocal: function () {
            try {
                global.localStorage.setItem(KEY, JSON.stringify(this.state));
            } catch (e) { /* storage can be unavailable */ }
        },

        saveSoon: function () {
            var self = this;
            this.saveLocal();
            if (this._saveTimer) clearTimeout(this._saveTimer);
            this._saveTimer = setTimeout(function () {
                self.saveLocal();
                self.scheduleCloud(false);
            }, 450);
        },

        flush: function () {
            this.saveLocal();
            this.scheduleCloud(true);
        },

        scheduleCloud: function (flush) {
            if (!this.player || !this.cloudReady) return;
            var self = this;
            if (!flush && this._cloudTimer) return;
            if (this._cloudTimer) clearTimeout(this._cloudTimer);
            var delay = flush ? 0 : 2200;
            this._cloudTimer = setTimeout(function () {
                self._cloudTimer = null;
                self.saveCloud(flush);
            }, delay);
        },

        saveCloud: function (flush) {
            if (!this.player || !this.cloudReady) return;
            var now = Date.now();
            if (!flush && now - this._lastCloud < 2500) return;
            this._lastCloud = now;
            try {
                var payload = {};
                payload[CLOUD_KEY] = this.serialize();
                var p = this.player.setData(payload, !!flush);
                if (p && typeof p.catch === 'function') p.catch(function () { /* offline / limit */ });
            } catch (e) { /* ignore */ }
        },

        initCloud: function (player) {
            var self = this;
            this.player = player || null;
            this.cloudReady = false;
            if (!player) return Promise.resolve(null);
            return Promise.resolve()
                .then(function () { return player.getData([CLOUD_KEY]); })
                .then(function (data) {
                    var cloud = data && data[CLOUD_KEY];
                    if (typeof cloud === 'string') {
                        try { cloud = JSON.parse(cloud); } catch (e) { cloud = null; }
                    }
                    if (cloud && typeof cloud === 'object') {
                        self.state = self.mergeSaves(self.state, self.normalize(cloud));
                        self.ensureMissions();
                        self.saveLocal();
                    }
                    self.cloudReady = true;
                    return self.state;
                })
                .catch(function () {
                    self.cloudReady = true;
                    return null;
                });
        },

        mergeSaves: function (local, cloud) {
            if (!cloud) return local;
            if (!local) return cloud;
            var freshLocal = local.runs === 0 && local.best === 0 && local.dust === 0 && (!local.owned || local.owned.length <= 1);
            if (freshLocal && (cloud.runs > 0 || cloud.best > 0 || cloud.dust > 0 || (cloud.owned && cloud.owned.length > 1) || cloud.tutorialDone)) {
                return cloud;
            }
            var l = this.normalize(local);
            var c = this.normalize(cloud);
            var merged = clone(l);
            var newer = (c.updatedAt || 0) > (l.updatedAt || 0) ? c : l;
            merged.best = Math.max(l.best, c.best);
            // Currency follows the save that made the latest change; taking a max
            // would duplicate spent dust after a purchase made offline.
            merged.dust = newer.dust;
            merged.totalDust = Math.max(l.totalDust, c.totalDust);
            merged.runs = Math.max(l.runs, c.runs);
            merged.totalOrbs = Math.max(l.totalOrbs, c.totalOrbs);
            merged.totalTime = Math.max(l.totalTime, c.totalTime);
            merged.bestCombo = Math.max(l.bestCombo, c.bestCombo);
            merged.maxSector = Math.max(l.maxSector, c.maxSector);
            merged.tutorialDone = l.tutorialDone || c.tutorialDone;
            merged.owned = l.owned.slice();
            c.owned.forEach(function (id) { if (merged.owned.indexOf(id) < 0) merged.owned.push(id); });
            merged.equipped = merged.owned.indexOf(newer.equipped) >= 0 ? newer.equipped : (merged.owned.indexOf(l.equipped) >= 0 ? l.equipped : (merged.owned.indexOf(c.equipped) >= 0 ? c.equipped : 'aurora'));
            merged.sound = newer.sound;
            merged.music = newer.music;
            merged.effects = newer.effects;
            merged.lang = newer.lang || 'auto';
            // Mission state: the newest date wins; same date merges progress and claims.
            var lm = l.missions;
            var cm = c.missions;
            if (cm.date > lm.date) {
                merged.missions = clone(cm);
            } else if (cm.date === lm.date) {
                var mm = clone(lm);
                cm.list.forEach(function (item) {
                    var lp = Number(mm.progress[item.id]) || 0;
                    var cp = Number(cm.progress[item.id]) || 0;
                    mm.progress[item.id] = Math.max(lp, cp);
                    if (cm.claimed[item.id]) mm.claimed[item.id] = true;
                });
                if (!mm.list.length) mm.list = clone(cm.list);
                mm.bonusClaimed = lm.bonusClaimed || cm.bonusClaimed;
                merged.missions = mm;
            }
            // Daily gift: the later claim wins; if equal, the claimed state wins.
            if (c.daily.last > l.daily.last) merged.daily = clone(c.daily);
            else if (c.daily.last === l.daily.last) merged.daily.streak = Math.max(l.daily.streak, c.daily.streak);
            merged.updatedAt = Math.max(l.updatedAt, c.updatedAt, Date.now());
            return merged;
        },

        resetProgress: function () {
            var keep = {
                sound: this.state.sound,
                music: this.state.music,
                effects: this.state.effects,
                lang: this.state.lang
            };
            this.state = defaultState();
            this.state.sound = keep.sound;
            this.state.music = keep.music;
            this.state.effects = keep.effects;
            this.state.lang = keep.lang;
            this.state.updatedAt = Date.now();
            this.ensureMissions();
            try { global.localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
            this.saveLocal();
            if (this.player && this.cloudReady) {
                try {
                    var payload = {};
                    payload[CLOUD_KEY] = null;
                    this.player.setData(payload, true);
                } catch (e) { /* ignore */ }
            }
        },

        clearLocal: function () {
            try { global.localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
        }
    };

    var Util = {
        formatNumber: function (n) {
            n = Math.floor(Number(n) || 0);
            try {
                return new Intl.NumberFormat(PB.I18n.lang).format(n);
            } catch (e) {
                return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            }
        },
        formatTime: function (seconds) {
            seconds = Math.max(0, Math.floor(seconds || 0));
            var h = Math.floor(seconds / 3600);
            var m = Math.floor((seconds % 3600) / 60);
            var s = seconds % 60;
            if (h > 0) return PB.I18n.t('timeHoursMinutes', { h: h, m: m });
            if (m > 0) return PB.I18n.t('timeMinutes', { m: m });
            return PB.I18n.t('timeSeconds', { s: s });
        },
        formatCountdown: function (ms) {
            var total = Math.max(0, Math.floor(ms / 1000));
            var h = Math.floor(total / 3600);
            var m = Math.floor((total % 3600) / 60);
            var s = total % 60;
            if (h > 0) return PB.I18n.t('timeHoursMinutes', { h: h, m: m });
            if (m > 0) return PB.I18n.t('timeMinutes', { m: m });
            return PB.I18n.t('timeSeconds', { s: Math.max(1, s) });
        },
        clamp: function (v, min, max) {
            return v < min ? min : (v > max ? max : v);
        },
        lerp: function (a, b, t) {
            return a + (b - a) * t;
        },
        easeOutCubic: function (t) {
            return 1 - Math.pow(1 - t, 3);
        },
        todayStr: todayStr
    };

    global.PB = global.PB || {};
    global.PB.Storage = Storage;
    global.PB.Util = Util;
})(window);

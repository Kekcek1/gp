/* Pulsebound — interface, screens, meta progression and platform flows. */
(function (global) {
    'use strict';

    function $(id) { return document.getElementById(id); }
    function t(key, vars) { return PB.I18n.t(key, vars); }
    function fmt(n) { return PB.Util.formatNumber(n); }
    function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
    function setText(id, value) {
        var node = $(id);
        if (node) node.textContent = value;
    }
    function show(node) { if (node) node.classList.remove('is-hidden'); }
    function hide(node) { if (node) node.classList.add('is-hidden'); }
    function useIcon(node, id) {
        if (!node) return;
        var use = node.querySelector('use');
        if (use) use.setAttribute('href', '#' + id);
    }
    function addClassTemporary(node, cls, ms) {
        if (!node) return;
        node.classList.add(cls);
        setTimeout(function () { node.classList.remove(cls); }, ms || 500);
    }
    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    var UI = {
        screen: 'boot',
        currentOverlay: null,
        overlayStack: [],
        lastFocus: null,
        confirmResolver: null,
        tutorialKey: null,
        selectedSkin: 'aurora',
        lastResult: null,
        lastStats: null,
        preRecordState: null,
        runRecorded: false,
        doubled: false,
        adBusy: false,
        adActive: false,
        pauseReason: null,
        overTimer: null,
        hintTimer: null,
        toastTimer: null,
        resetTimer: null,
        sectorTimer: null,
        overdriveTimer: null,
        previewRAF: 0,
        previewStart: 0,
        ratingTab: 'top',
        ratingData: null,
        ratingError: false,
        ratingLoading: false,
        ratingLoadedAt: 0,
        lastAdRun: -1,
        lastInterstitialAt: 0,
        countRAF: 0,

        init: function () {
            this.stage = $('stage');
            this.menu = $('screen-menu');
            this.hud = $('hud');
            this.boot = $('boot');
            this.selectedSkin = PB.Storage.state.equipped;
            this.bind();
            this.buildLangOptions();
            this.refreshMenu();
            this.updateSoundUI();
            this.renderSettings();
            this.applyStaticText();
            if (PB.SDK) {
                PB.SDK.pauseHandler = function () { UI.onSdkPause(); };
                PB.SDK.resumeHandler = function () { UI.onSdkResume(); };
            }
        },

        applyStaticText: function () {
            PB.I18n.apply();
        },

        bind: function () {
            var self = this;
            document.addEventListener('click', function (e) {
                var btn = e.target.closest('[data-action]');
                if (!btn) return;
                if (btn.disabled) return;
                e.preventDefault();
                self.action(btn.getAttribute('data-action'), btn, e);
            });

            this.stage.addEventListener('pointerdown', function (e) {
                if (e.button !== undefined && e.button !== 0) return;
                if (self.screen !== 'game' || self.currentOverlay) return;
                if (!PB.Game || PB.Game.state !== 'playing') return;
                if (e.target.closest('button, a, input, textarea, select, .overlay, .menu')) return;
                e.preventDefault();
                PB.Audio.unlock();
                PB.Game.switchLane();
            }, { passive: false });

            document.addEventListener('keydown', function (e) { self.onKeyDown(e); });
            document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
            document.addEventListener('selectstart', function (e) {
                if (!e.target.closest('input, textarea')) e.preventDefault();
            });

            document.addEventListener('visibilitychange', function () {
                if (document.hidden) {
                    PB.Audio.suspend();
                    if (PB.Game && PB.Game.state === 'playing' && !self.adActive) {
                        self.systemPause();
                    }
                } else {
                    if (self.screen === 'menu' && !self.currentOverlay) {
                        PB.Audio.resume();
                        PB.Audio.setScene('menu');
                    }
                }
            });

            window.addEventListener('blur', function () {
                PB.Audio.suspend();
                if (PB.Game && PB.Game.state === 'playing' && !self.adActive) {
                    self.systemPause();
                }
            });

            window.addEventListener('focus', function () {
                if (self.screen === 'menu' && !self.currentOverlay && PB.Storage.state.music) {
                    PB.Audio.resume();
                }
            });

            window.addEventListener('pagehide', function () {
                PB.Storage.flush();
                PB.Audio.suspend();
            });

            var overlays = document.querySelectorAll('.overlay');
            for (var i = 0; i < overlays.length; i++) {
                (function (el) {
                    el.addEventListener('pointerdown', function (e) {
                        if (e.target !== el) return;
                        var id = el.id;
                        if (id === 'overlay-pause') self.resumeGame();
                        else if (id === 'overlay-confirm') self.finishConfirm(false);
                        else if (id !== 'overlay-over') self.closeOverlay(id);
                    });
                })(overlays[i]);
            }
        },

        // ---------------------------------------------------------------- boot/menu

        setBootProgress: function (p) {
            var bar = $('boot-progress');
            if (bar) bar.style.width = Math.round(Math.max(4, Math.min(100, p))) + '%';
        },

        finishBoot: function () {
            var self = this;
            if (this.boot) this.boot.classList.add('is-done');
            this.screen = 'menu';
            show(this.menu);
            hide(this.hud);
            this.refreshMenu();
            this.refreshBest();
            setTimeout(function () {
                if (self.boot) self.boot.classList.add('is-hidden');
            }, 620);
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    if (PB.SDK) {
                        PB.SDK.loadingReady();
                        if (PB.SDK.isAuthorized() && PB.Storage.state.best > 0) {
                            PB.SDK.setLeaderboardScore('best_score', PB.Storage.state.best);
                        }
                    }
                });
            });
        },

        syncFromStorage: function () {
            PB.I18n.setManual(PB.Storage.state.lang);
            PB.Audio.applySettings(PB.Storage.state.sound, PB.Storage.state.music);
            PB.Game.setSkin();
            PB.Game.refreshBest();
            this.selectedSkin = PB.Storage.state.equipped;
            this.applyLanguageAll();
            this.refreshMenu();
            this.refreshBest();
        },

        refreshMenu: function () {
            var s = PB.Storage.state;
            setText('menu-dust', fmt(s.dust));
            setText('menu-best', fmt(s.best));
            setText('hud-best', fmt(s.best));
            var daily = PB.Storage.dailyInfo();
            setText('daily-note', daily.canClaim ? t('dailyAvailable') : t('dailyClaimed'));
            if (daily.canClaim) show($('badge-daily')); else hide($('badge-daily'));
            var missions = PB.Storage.missionList();
            var ready = 0;
            for (var i = 0; i < missions.length; i++) if (missions[i].done && !missions[i].claimed) ready++;
            var bonusReady = PB.Storage.allMissionsClaimed() && !PB.Storage.state.missions.bonusClaimed;
            if (ready > 0 || bonusReady) show($('badge-missions')); else hide($('badge-missions'));
            setText('menu-missions-note', ready > 0 ? ready + ' / 3' : t('missionsNote'));
            setText('menu-shop-note', t('shopNote'));
            this.updateSoundUI();
        },

        refreshBest: function () {
            var best = PB.Storage.state.best;
            setText('menu-best', fmt(best));
            setText('hud-best', fmt(best));
            setText('result-best', fmt(best));
            if (PB.Game) {
                PB.Game.refreshBest();
            }
        },

        // ------------------------------------------------------------------ actions

        action: function (action, btn, ev) {
            PB.Audio.unlock();
            PB.Audio.click();
            switch (action) {
                case 'play': this.play(); break;
                case 'pause': this.pauseGame(); break;
                case 'resume': this.resumeGame(); break;
                case 'restart': this.confirmRestart(); break;
                case 'again': this.again(); break;
                case 'reward-revive': this.handleRewarded('revive'); break;
                case 'reward-double': this.handleRewarded('double'); break;
                case 'skip-tutorial':
                    if (PB.Game.tutorial) PB.Game.finishTutorial();
                    break;
                case 'quit-run': this.confirmQuit(); break;
                case 'quit-to-menu': this.quitToMenu(); break;
                case 'open-missions': this.openMissions(); break;
                case 'open-shop': this.openShop(); break;
                case 'open-rating': this.openRating(); break;
                case 'open-daily': this.openDaily(); break;
                case 'open-settings': this.openSettings(); break;
                case 'open-howto': this.openHowto(); break;
                case 'close': this.closeOverlay(); break;
                case 'toggle-sound': this.toggleSound(); break;
                case 'toggle-music': this.toggleMusic(); break;
                case 'toggle-effects': this.toggleEffects(); break;
                case 'set-lang': this.setLanguage(btn.getAttribute('data-lang')); break;
                case 'claim-mission': this.claimMission(btn.getAttribute('data-id')); break;
                case 'claim-bonus': this.claimMissionBonus(); break;
                case 'claim-daily': this.claimDaily(); break;
                case 'skin-select': this.selectSkin(btn.getAttribute('data-id')); break;
                case 'skin-action': this.skinAction(); break;
                case 'rating-tab': this.switchRatingTab(btn.getAttribute('data-tab')); break;
                case 'login': this.login(); break;
                case 'retry-rating': this.loadLeaderboard(true); break;
                case 'reset-progress': this.resetProgress(); break;
                case 'confirm-yes': this.finishConfirm(true); break;
                case 'confirm-no': this.finishConfirm(false); break;
                default: break;
            }
        },

        play: function () {
            if (this.screen === 'boot') return;
            PB.Audio.unlock();
            var tutorial = !PB.Storage.state.tutorialDone;
            this.startRun(tutorial);
        },

        startRun: function (tutorial) {
            this.closeAllOverlays();
            this.screen = 'game';
            hide(this.menu);
            show(this.hud);
            this.runRecorded = false;
            this.preRecordState = null;
            this.lastResult = null;
            this.lastStats = null;
            this.doubled = false;
            this.pauseReason = null;
            this.tutorialKey = null;
            if (this.countRAF) {
                cancelAnimationFrame(this.countRAF);
                this.countRAF = 0;
            }
            hide($('tutorial-hint'));
            hide($('hud-combo'));
            hide($('record-badge'));
            hide($('game-hint'));
            hide($('toast'));
            hide($('sector-toast'));
            hide($('overdrive-toast'));
            PB.Game.startRun(!!tutorial);
            PB.SDK.gameplayStart();
            PB.Audio.resume();
            PB.Audio.setScene('game');
            this.updateHud({ score: 0, combo: 1, sector: 1, best: PB.Storage.state.best });
            if (!tutorial) this.showHint();
        },

        showHint: function () {
            if (PB.Storage.state.runs >= 2) return;
            var hint = $('game-hint');
            if (!hint) return;
            hint.classList.remove('is-hidden');
            hint.style.animation = 'none';
            void hint.offsetWidth;
            hint.style.animation = '';
            var self = this;
            if (this.hintTimer) clearTimeout(this.hintTimer);
            this.hintTimer = setTimeout(function () { hide(hint); }, 4700);
        },

        pauseGame: function () {
            if (!PB.Game || PB.Game.state !== 'playing') return;
            if (!PB.Game.pause()) return;
            this.pauseReason = 'user';
            PB.SDK.gameplayStop();
            PB.Audio.suspend();
            PB.Audio.setScene('paused');
            setText('pause-score', fmt(PB.Game.stats().score));
            setText('pause-sector', fmt(PB.Game.sector));
            this.openOverlay('overlay-pause');
        },

        systemPause: function () {
            if (!PB.Game || PB.Game.state !== 'playing') return;
            if (!PB.Game.pause()) return;
            this.pauseReason = 'system';
            PB.SDK.gameplayStop();
            PB.Audio.suspend();
            setText('pause-score', fmt(PB.Game.stats().score));
            setText('pause-sector', fmt(PB.Game.sector));
            this.openOverlay('overlay-pause');
        },

        resumeGame: function () {
            if (!PB.Game || PB.Game.state !== 'paused') return;
            this.closeAllOverlays();
            PB.Game.resume();
            this.pauseReason = null;
            PB.SDK.gameplayStart();
            PB.Audio.resume();
            PB.Audio.setScene('game');
        },

        onSdkPause: function () {
            PB.Audio.suspend();
            if (this.adActive) return;
            if (PB.Game && PB.Game.state === 'playing') {
                PB.Game.pause();
                PB.SDK.gameplayStop();
                this.pauseReason = 'sdk';
            }
        },

        onSdkResume: function () {
            if (this.adActive) return;
            if (this.pauseReason === 'sdk' && PB.Game && PB.Game.state === 'paused') {
                PB.Game.resume();
                this.pauseReason = null;
                PB.SDK.gameplayStart();
                PB.Audio.resume();
                PB.Audio.setScene('game');
                return;
            }
            if (this.screen === 'menu') {
                PB.Audio.resume();
                PB.Audio.setScene('menu');
            }
        },

        onGameplayStop: function () {
            PB.SDK.gameplayStop();
        },

        updateHud: function (d) {
            if (!d) return;
            setText('hud-score', fmt(d.score || 0));
            setText('hud-best', fmt(d.best !== undefined ? d.best : PB.Storage.state.best));
            setText('hud-sector', fmt(d.sector || 1));
            var combo = d.combo || 1;
            var chip = $('hud-combo');
            if (combo > 1) {
                setText('hud-combo-text', 'x' + combo);
                show(chip);
            } else {
                hide(chip);
            }
        },

        // ------------------------------------------------------------------- death

        recordRun: function (stats) {
            if (this.runRecorded) return this.lastResult;
            if (!stats) return null;
            this.preRecordState = clone(PB.Storage.state);
            var res = PB.Storage.recordRun(stats);
            this.runRecorded = true;
            this.lastStats = stats;
            this.lastResult = res;
            PB.Storage.flush();
            this.refreshBest();
            PB.Game.refreshBest();
            PB.Game.best = res.best;
            this.refreshMenu();
            if (res.newBest && res.best > 0) {
                PB.SDK.setLeaderboardScore('best_score', res.best);
                this.ratingData = null;
                this.ratingLoadedAt = 0;
            }
            if (res.completed && res.completed.length) {
                var self = this;
                setTimeout(function () { self.toast(t('toastMissionDone'), 'reward'); }, 1300);
            }
            return res;
        },

        onRunEnd: function (stats) {
            if (this.screen !== 'game') return;
            var res = this.recordRun(stats);
            var self = this;
            if (this.overTimer) clearTimeout(this.overTimer);
            this.overTimer = setTimeout(function () {
                self.showGameOver(stats, res);
            }, 900);
        },

        showGameOver: function (stats, res) {
            if (this.screen !== 'game') return;
            if (PB.Game.state === 'playing') return;
            if (!res) res = this.lastResult || { dust: 0, newBest: false, best: PB.Storage.state.best };
            this.closeAllOverlays();
            hide($('toast'));
            hide($('sector-toast'));
            hide($('overdrive-toast'));
            this.currentOverlay = 'overlay-over';
            show($('overlay-over'));
            setText('result-score', '0');
            setText('result-best', fmt(res.best));
            setText('result-dust', '+' + fmt(res.dust));
            setText('result-orbs', fmt(stats.orbs));
            setText('result-combo', 'x' + (stats.maxCombo || 1));
            setText('result-sector', fmt(stats.sector || 1));
            if (res.newBest) show($('record-badge')); else hide($('record-badge'));
            var ads = PB.SDK.available;
            var revive = $('btn-revive');
            var doubleBtn = $('btn-double');
            if (!stats.revived && ads) show(revive); else hide(revive);
            if ((stats.revived || !ads) && ads) show(doubleBtn); else hide(doubleBtn);
            revive.classList.remove('is-busy');
            doubleBtn.classList.remove('is-busy');
            revive.disabled = false;
            doubleBtn.disabled = false;
            this.doubled = false;
            this.countUp($('result-score'), stats.score || 0);
            PB.Audio.setScene('over');
            if (res.newBest) {
                PB.Audio.record();
                PB.Game.celebrate();
            }
            this.focusOverlay();
            this.refreshBest();
        },

        countUp: function (node, target) {
            if (!node) return;
            if (this.countRAF) cancelAnimationFrame(this.countRAF);
            var start = performance.now();
            var self = this;
            function step(now) {
                var k = Math.min(1, (now - start) / 850);
                var eased = 1 - Math.pow(1 - k, 3);
                node.textContent = fmt(Math.floor(target * eased));
                if (k < 1) self.countRAF = requestAnimationFrame(step);
                else { node.textContent = fmt(target); self.countRAF = 0; }
            }
            this.countRAF = requestAnimationFrame(step);
        },

        again: function () {
            if (PB.Game.state !== 'over' && PB.Game.state !== 'dying') return;
            var self = this;
            this.closeAllOverlays();
            this.maybeInterstitial(function () {
                self.startRun(!PB.Storage.state.tutorialDone);
            });
        },

        confirmRestart: function () {
            var self = this;
            this.openConfirm(t('restartConfirmTitle'), t('restartConfirmText'), t('restart')).then(function (ok) {
                if (!ok) return;
                if (PB.Game.run && !PB.Game.run.tutorial && !self.runRecorded) self.recordRun(PB.Game.stats());
                self.startRun(!PB.Storage.state.tutorialDone);
            });
        },

        confirmQuit: function () {
            var self = this;
            this.openConfirm(t('quitConfirmTitle'), t('quitConfirmText'), t('quitYes')).then(function (ok) {
                if (ok) self.quitToMenu();
            });
        },

        quitToMenu: function () {
            if (PB.Game.run && !PB.Game.run.tutorial && !this.runRecorded) {
                this.recordRun(PB.Game.stats());
            }
            this.closeAllOverlays();
            this.screen = 'menu';
            hide(this.hud);
            show(this.menu);
            PB.Game.startMenu();
            PB.Game.refreshBest();
            hide($('sector-toast'));
            hide($('overdrive-toast'));
            PB.SDK.gameplayStop();
            PB.Audio.resume();
            PB.Audio.setScene('menu');
            this.pauseReason = null;
            this.refreshMenu();
            this.refreshBest();
        },

        // ------------------------------------------------------------------ rewarded

        applyReward: function (kind) {
            if (kind === 'revive') {
                var shownBest = Math.max(PB.Storage.state.best, this.lastResult ? this.lastResult.best : 0);
                if (this.preRecordState) {
                    PB.Storage.state = this.preRecordState;
                    this.preRecordState = null;
                    // The score record from the first death remains valid even though
                    // the run's dust/run counters are rolled back before continuing.
                    PB.Storage.state.best = Math.max(PB.Storage.state.best, shownBest);
                    PB.Storage.saveLocal();
                    PB.Storage.saveSoon();
                    this.runRecorded = false;
                    this.lastResult = null;
                    PB.Game.refreshBest();
                    PB.Game.best = PB.Storage.state.best;
                    this.refreshMenu();
                }
                if (!PB.Game.reviveRun()) {
                    this.toast(t('toastError'), 'error');
                    return;
                }
                this.closeAllOverlays();
                this.screen = 'game';
                hide(this.menu);
                show(this.hud);
                this.pauseReason = null;
                PB.SDK.gameplayStart();
                PB.Audio.resume();
                PB.Audio.setScene('game');
                this.toast(t('toastRevive'), 'reward');
                this.refreshMenu();
                PB.Game.emitHud(true);
            } else if (kind === 'double') {
                if (this.doubled || !this.lastResult) return;
                PB.Storage.addDust(this.lastResult.dust, true);
                PB.Storage.flush();
                this.doubled = true;
                setText('result-dust', '+' + fmt(this.lastResult.dust * 2));
                var btn = $('btn-double');
                if (btn) {
                    btn.disabled = true;
                    btn.classList.add('is-busy');
                }
                this.refreshMenu();
                PB.Audio.claim();
                this.toast(t('toastDustDouble'), 'reward');
            }
        },

        handleRewarded: function (kind) {
            if (this.adBusy) return;
            if (!PB.SDK.available) {
                this.toast(t('toastAdUnavailable'), 'error');
                return;
            }
            this.adBusy = true;
            this.adActive = true;
            PB.Audio.suspend();
            var btn = kind === 'revive' ? $('btn-revive') : $('btn-double');
            if (btn) btn.classList.add('is-busy');
            this.toast(t('toastAdLoading'), 'reward', 6000);
            var self = this;
            var rewarded = false;
            var settled = false;
            function finish(gotReward) {
                if (settled) return;
                settled = true;
                self.adBusy = false;
                self.adActive = false;
                if (btn) btn.classList.remove('is-busy');
                PB.Audio.resume();
                if (gotReward) {
                    self.applyReward(kind);
                } else {
                    self.toast(t('toastAdNoReward'), 'error');
                }
            }
            PB.SDK.showRewarded(
                function () { rewarded = true; },
                function () { finish(rewarded); },
                function () { finish(false); }
            );
        },

        maybeInterstitial: function (cb) {
            var self = this;
            var runs = PB.Storage.state.runs;
            var ready = PB.SDK.available && runs >= 3 && runs % 3 === 0 && this.lastAdRun !== runs && (Date.now() - this.lastInterstitialAt > 90000);
            if (!ready) {
                cb();
                return;
            }
            this.adActive = true;
            PB.Audio.suspend();
            var settled = false;
            function done(shown) {
                if (settled) return;
                settled = true;
                self.adActive = false;
                self.lastInterstitialAt = Date.now();
                if (shown) self.lastAdRun = runs;
                PB.Audio.resume();
                cb();
            }
            PB.SDK.showFullscreen(
                function () {},
                function (wasShown) { done(!!wasShown); },
                function () { done(false); }
            );
        },

        // ------------------------------------------------------------------ missions

        openMissions: function () {
            PB.Storage.ensureMissions();
            this.renderMissions();
            this.refreshMenu();
            this.openOverlay('overlay-missions');
            this.startResetTimer();
        },

        renderMissions: function () {
            var list = PB.Storage.missionList();
            var box = $('missions-list');
            if (!box) return;
            var html = '';
            for (var i = 0; i < list.length; i++) {
                var m = list[i];
                var pct = Math.min(100, Math.round(m.progress / m.target * 100));
                var button;
                if (m.claimed) {
                    button = '<button class="mission-claim is-claimed" type="button" disabled>' + escapeHtml(t('claimed')) + '</button>';
                } else if (m.done) {
                    button = '<button class="mission-claim" type="button" data-action="claim-mission" data-id="' + escapeHtml(m.id) + '">' + escapeHtml(t('claim')) + '</button>';
                } else {
                    button = '<button class="mission-claim" type="button" disabled>' + escapeHtml(t('claim')) + '</button>';
                }
                html += '<div class="mission-card">' +
                    '<div class="mission-icon"><svg class="icon"><use href="#' + m.icon + '"></use></svg></div>' +
                    '<div class="mission-body"><div class="mission-title">' + escapeHtml(t(m.titleKey, { n: fmt(m.target) })) + '</div>' +
                    '<div class="mission-progress"><div class="mission-bar"><i style="width:' + pct + '%"></i></div>' +
                    '<small>' + fmt(m.progress) + ' / ' + fmt(m.target) + '</small></div></div>' +
                    '<div class="mission-reward"><span class="dust"><svg class="icon"><use href="#i-dust"></use></svg>' + fmt(m.reward) + '</span>' + button + '</div>' +
                    '</div>';
            }
            box.innerHTML = html;

            var bonus = $('missions-bonus');
            if (bonus) {
                var all = PB.Storage.allMissionsClaimed();
                var claimed = PB.Storage.state.missions.bonusClaimed;
                var btn;
                if (claimed) {
                    btn = '<button class="mission-claim is-claimed" type="button" disabled>' + escapeHtml(t('bonusClaimed')) + '</button>';
                } else if (all) {
                    btn = '<button class="mission-claim" type="button" data-action="claim-bonus">' + escapeHtml(t('claim')) + '</button>';
                } else {
                    btn = '<button class="mission-claim" type="button" disabled>' + escapeHtml(t('claim')) + '</button>';
                }
                bonus.innerHTML = '<div class="bonus-card"><div class="mission-icon"><svg class="icon"><use href="#i-gift"></use></svg></div>' +
                    '<div><h4>' + escapeHtml(t('bonusAll')) + '</h4><p>' + escapeHtml(t('bonusDesc')) + ' · ' + escapeHtml(t('bonusReward', { n: 100 })) + '</p></div>' + btn + '</div>';
            }
            this.updateResetText();
        },

        claimMission: function (id) {
            var reward = PB.Storage.claimMission(id);
            if (!reward) return;
            PB.Audio.claim();
            this.toast(t('toastClaimed') + ' · ' + t('dustAmount', { n: fmt(reward) }), 'reward');
            this.renderMissions();
            this.refreshMenu();
            if (PB.Game && this.screen === 'menu') PB.Game.celebrate();
        },

        claimMissionBonus: function () {
            var reward = PB.Storage.claimMissionBonus();
            if (!reward) return;
            PB.Audio.claim();
            this.toast(t('toastBonus') + ' +' + fmt(reward), 'reward');
            this.renderMissions();
            this.refreshMenu();
        },

        startResetTimer: function () {
            var self = this;
            if (this.resetTimer) clearInterval(this.resetTimer);
            this.resetTimer = setInterval(function () {
                self.updateResetText();
                if (self.currentOverlay === 'overlay-missions') {
                    PB.Storage.ensureMissions();
                    self.renderMissions();
                }
            }, 30000);
        },

        updateResetText: function () {
            setText('missions-reset', t('resetsIn', { time: PB.Util.formatCountdown(PB.Storage.missionResetMs()) }));
        },

        // --------------------------------------------------------------------- daily

        openDaily: function () {
            this.renderDaily();
            this.openOverlay('overlay-daily');
        },

        renderDaily: function () {
            var info = PB.Storage.dailyInfo();
            var rewards = PB.Storage.dailyRewards;
            var box = $('daily-days');
            if (!box) return;
            var html = '';
            var activeDay = info.claimedToday ? info.claimedDay : info.day;
            for (var i = 0; i < 7; i++) {
                var day = i + 1;
                var cls = 'day-cell';
                if (day === activeDay) cls += ' is-today';
                if (info.claimedToday && day <= activeDay) cls += ' is-claimed';
                else if (!info.claimedToday && day < activeDay) cls += ' is-claimed';
                var icon = (info.claimedToday && day <= activeDay) ? 'i-check' : 'i-dust';
                html += '<div class="' + cls + '"><span>' + day + '</span>' +
                    '<svg class="icon"><use href="#' + icon + '"></use></svg>' +
                    '<strong>' + fmt(rewards[i]) + '</strong></div>';
            }
            box.innerHTML = html;
            var status = $('daily-status');
            if (status) {
                status.innerHTML = escapeHtml(t('dailyStatus', { n: info.streak })) +
                    (info.claimedToday ? ' · ' + escapeHtml(t('dailyComeBack')) : '');
            }
            var btn = $('btn-daily-claim');
            if (btn) {
                if (info.claimedToday) {
                    btn.disabled = true;
                    btn.innerHTML = '<span>' + escapeHtml(t('claimed')) + '</span>';
                } else {
                    btn.disabled = false;
                    btn.innerHTML = '<span>' + escapeHtml(t('claimDaily', { n: fmt(info.reward) })) + '</span>';
                }
            }
        },

        claimDaily: function () {
            var res = PB.Storage.claimDaily();
            if (!res) return;
            PB.Audio.claim();
            this.renderDaily();
            this.refreshMenu();
            this.toast(t('toastDaily') + ' +' + fmt(res.reward), 'reward');
            if (PB.Game) PB.Game.celebrate();
        },

        // ---------------------------------------------------------------------- shop

        openShop: function () {
            this.selectedSkin = PB.Storage.state.equipped;
            this.renderShop();
            this.openOverlay('overlay-shop');
            this.startPreview();
        },

        skinKey: function (id, suffix) {
            return 'skin' + id.charAt(0).toUpperCase() + id.slice(1) + suffix;
        },

        renderShop: function () {
            var grid = $('shop-grid');
            if (!grid) return;
            grid.innerHTML = '';
            var owned = PB.Storage.state.owned;
            var equipped = PB.Storage.state.equipped;
            var skins = PB.Storage.skins;
            for (var i = 0; i < skins.length; i++) {
                var skin = skins[i];
                var isOwned = owned.indexOf(skin.id) >= 0;
                var isSelected = this.selectedSkin === skin.id;
                var card = document.createElement('button');
                card.type = 'button';
                card.className = 'skin-card' + (isSelected ? ' is-selected' : '') + (isOwned ? ' is-owned' : ' is-locked');
                card.setAttribute('data-action', 'skin-select');
                card.setAttribute('data-id', skin.id);
                var orb = document.createElement('span');
                orb.className = 'skin-orb';
                orb.style.background = 'radial-gradient(circle at 35% 30%, ' + skin.a + ', ' + skin.b + ' 78%)';
                orb.style.setProperty('--orb-glow', skin.glow + '66');
                var name = document.createElement('span');
                name.className = 'skin-card-name';
                name.textContent = t(this.skinKey(skin.id, 'Name'));
                var state = document.createElement('span');
                state.className = 'skin-card-state';
                if (skin.id === equipped) {
                    state.innerHTML = '<svg class="icon"><use href="#i-check"></use></svg>' + escapeHtml(t('skinActionEquipped'));
                } else if (isOwned) {
                    state.innerHTML = '<svg class="icon"><use href="#i-check"></use></svg>' + escapeHtml(t('skinOwned'));
                } else {
                    state.innerHTML = '<svg class="icon"><use href="#i-dust"></use></svg>' + fmt(skin.price);
                }
                if (skin.id === equipped) {
                    var dot = document.createElement('i');
                    dot.className = 'equipped-dot';
                    card.appendChild(dot);
                }
                card.appendChild(orb);
                card.appendChild(name);
                card.appendChild(state);
                grid.appendChild(card);
            }
            var skin = PB.Storage.getSkin(this.selectedSkin) || skins[0];
            setText('skin-name', t(this.skinKey(skin.id, 'Name')));
            setText('skin-desc', t(this.skinKey(skin.id, 'Desc')));
            var price = $('skin-price');
            if (price) {
                price.textContent = owned.indexOf(skin.id) >= 0 ? t('skinOwned') : fmt(skin.price);
                useIcon(price.parentNode.querySelector('.icon'), owned.indexOf(skin.id) >= 0 ? 'i-check' : 'i-dust');
            }
            var action = $('btn-skin-action');
            if (action) {
                action.classList.remove('is-owned', 'is-equipped');
                if (skin.id === equipped) {
                    action.disabled = true;
                    action.classList.add('is-equipped');
                    action.innerHTML = '<span>' + escapeHtml(t('skinActionEquipped')) + '</span>';
                } else if (owned.indexOf(skin.id) >= 0) {
                    action.disabled = false;
                    action.classList.add('is-owned');
                    action.innerHTML = '<span>' + escapeHtml(t('skinActionEquip')) + '</span>';
                } else {
                    action.disabled = false;
                    action.innerHTML = '<span>' + escapeHtml(t('skinActionBuy')) + '</span>';
                }
            }
        },

        selectSkin: function (id) {
            if (!PB.Storage.getSkin(id)) return;
            this.selectedSkin = id;
            this.renderShop();
        },

        skinAction: function () {
            var id = this.selectedSkin;
            var skin = PB.Storage.getSkin(id);
            if (!skin) return;
            var owned = PB.Storage.isOwned(id);
            if (owned) {
                if (PB.Storage.equipSkin(id)) {
                    PB.Game.setSkin();
                    PB.Audio.buy();
                    this.renderShop();
                    this.toast(t('toastEquipped'), 'reward');
                }
                return;
            }
            var res = PB.Storage.buySkin(id);
            if (!res.ok) {
                PB.Audio.error();
                this.toast(t('toastNotEnough'), 'error');
                addClassTemporary($('shop-grid'), 'shake', 400);
                return;
            }
            PB.Storage.equipSkin(id);
            PB.Game.setSkin();
            PB.Audio.buy();
            this.renderShop();
            this.refreshMenu();
            PB.Game.celebrate();
            this.toast(t('toastPurchase'), 'reward');
        },

        startPreview: function () {
            var self = this;
            this.stopPreview();
            var canvas = $('skin-preview');
            if (!canvas) return;
            var ctx = canvas.getContext('2d');
            this.previewStart = performance.now();
            function draw(now) {
                if (self.currentOverlay !== 'overlay-shop') return;
                var time = (now - self.previewStart) / 1000;
                self.drawPreview(ctx, canvas, time);
                self.previewRAF = requestAnimationFrame(draw);
            }
            this.previewRAF = requestAnimationFrame(draw);
        },

        stopPreview: function () {
            if (this.previewRAF) {
                cancelAnimationFrame(this.previewRAF);
                this.previewRAF = 0;
            }
        },

        drawPreview: function (ctx, canvas, time) {
            var w = canvas.width, h = canvas.height;
            var skin = PB.Storage.getSkin(this.selectedSkin) || PB.Storage.skins[0];
            var a = skin.a, b = skin.b;
            if (skin.style === 'prism') {
                var hue = (time * 55) % 360;
                a = 'hsl(' + hue + ',92%,66%)';
                b = 'hsl(' + ((hue + 150) % 360) + ',90%,60%)';
            }
            var g = ctx.createLinearGradient(0, 0, w, h);
            g.addColorStop(0, '#050a18');
            g.addColorStop(0.6, '#0a1230');
            g.addColorStop(1, '#120a24');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
            var rg = ctx.createRadialGradient(w * 0.5, h * 0.68, 0, w * 0.5, h * 0.68, w * 0.5);
            rg.addColorStop(0, 'rgba(87,245,255,0.12)');
            rg.addColorStop(1, 'rgba(87,245,255,0)');
            ctx.fillStyle = rg;
            ctx.fillRect(0, 0, w, h);
            for (var i = 0; i < 40; i++) {
                var sx = (i * 97 % w);
                var sy = (i * 61 % h);
                var alpha = 0.15 + (i % 5) * 0.08;
                ctx.fillStyle = 'rgba(220,240,255,' + alpha + ')';
                ctx.beginPath();
                ctx.arc(sx, sy, 0.8 + (i % 3) * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
            var cx = w * 0.5, cy = h * 0.55;
            var rx = w * 0.31, ry = h * 0.2;
            ctx.strokeStyle = 'rgba(120,190,255,0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            ctx.stroke();
            var coreR = 26;
            var cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
            cg.addColorStop(0, '#ffffff');
            cg.addColorStop(0.4, '#dffcff');
            cg.addColorStop(0.75, 'rgba(87,245,255,0.55)');
            cg.addColorStop(1, 'rgba(87,245,255,0)');
            ctx.fillStyle = cg;
            ctx.beginPath();
            ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
            ctx.fill();
            var angle = time * 1.1 + 2.1;
            var trail = [];
            for (var k = 0; k < 26; k++) {
                var aa = angle - k * 0.026;
                trail.push({ x: cx + Math.cos(aa) * rx, y: cy + Math.sin(aa) * ry });
            }
            ctx.lineCap = 'round';
            for (var j = 1; j < trail.length; j++) {
                var f = 1 - j / trail.length;
                ctx.strokeStyle = (j % 2 ? a : b);
                ctx.globalAlpha = f * 0.75;
                ctx.lineWidth = 1 + f * 7;
                ctx.beginPath();
                ctx.moveTo(trail[j - 1].x, trail[j - 1].y);
                ctx.lineTo(trail[j].x, trail[j].y);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            var hx = trail[0].x, hy = trail[0].y;
            var hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 34);
            hg.addColorStop(0, a);
            hg.addColorStop(0.3, b);
            hg.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = hg;
            ctx.beginPath();
            ctx.arc(hx, hy, 34, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(hx, hy, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = a;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(hx, hy, 8, 0, Math.PI * 2);
            ctx.stroke();
        },

        // -------------------------------------------------------------------- rating

        openRating: function () {
            this.ratingTab = 'top';
            this.renderRating();
            this.openOverlay('overlay-rating');
            this.loadLeaderboard(false);
        },

        switchRatingTab: function (tab) {
            if (tab !== 'top' && tab !== 'me') return;
            this.ratingTab = tab;
            this.renderRating();
            if (tab === 'top') this.loadLeaderboard(false);
        },

        renderRating: function () {
            var topPane = $('rating-top');
            var mePane = $('rating-me');
            if (topPane) topPane.classList.toggle('is-hidden', this.ratingTab !== 'top');
            if (mePane) mePane.classList.toggle('is-hidden', this.ratingTab !== 'me');
            var tabs = document.querySelectorAll('.tab');
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].classList.toggle('is-active', tabs[i].getAttribute('data-tab') === this.ratingTab);
            }
            var auth = $('auth-box');
            if (auth) auth.classList.toggle('is-hidden', PB.SDK.isAuthorized() || !PB.SDK.available);
            if (this.ratingTab === 'top') this.renderLeaderboard();
            else this.renderMyStats();
        },

        loadLeaderboard: function (force) {
            if (!PB.SDK.available) {
                this.ratingData = null;
                this.ratingError = false;
                this.renderLeaderboard();
                return;
            }
            if (this.ratingLoading) return;
            if (!force && this.ratingData && Date.now() - this.ratingLoadedAt < 30000) {
                this.renderLeaderboard();
                return;
            }
            this.ratingLoading = true;
            this.ratingError = false;
            this.renderLeaderboard();
            var self = this;
            PB.SDK.getLeaderboard('best_score').then(function (res) {
                self.ratingLoading = false;
                if (res && res.ok) {
                    self.ratingData = res.data;
                    self.ratingError = false;
                    self.ratingLoadedAt = Date.now();
                } else {
                    self.ratingData = null;
                    self.ratingError = true;
                }
                if (self.currentOverlay === 'overlay-rating' && self.ratingTab === 'top') self.renderLeaderboard();
            }).catch(function () {
                self.ratingLoading = false;
                self.ratingError = true;
                self.renderLeaderboard();
            });
        },

        renderLeaderboard: function () {
            var list = $('leader-list');
            if (!list) return;
            if (this.ratingLoading) {
                list.innerHTML = '<div class="skeleton-row"></div><div class="skeleton-row"></div><div class="skeleton-row"></div>';
                return;
            }
            list.innerHTML = '';
            if (!PB.SDK.available) {
                list.innerHTML = '<div class="rating-empty"><svg class="icon"><use href="#i-trophy"></use></svg><span>' + escapeHtml(t('leaderboardLocal')) + '</span></div>';
                return;
            }
            if (this.ratingError || !this.ratingData) {
                list.innerHTML = '<div class="rating-empty"><svg class="icon"><use href="#i-info"></use></svg><span>' + escapeHtml(t('leaderboardError')) + '</span>' +
                    '<button class="btn btn-ghost btn-sm" type="button" data-action="retry-rating">' + escapeHtml(t('retry')) + '</button></div>';
                return;
            }
            var data = this.ratingData;
            var entries = (data.entries || []).slice();
            if (!entries.length) {
                list.innerHTML = '<div class="rating-empty"><svg class="icon"><use href="#i-star"></use></svg><span>' + escapeHtml(t('leaderboardEmpty')) + '</span></div>';
                return;
            }
            var myId = '';
            try { if (PB.SDK.player && PB.SDK.player.getUniqueID) myId = PB.SDK.player.getUniqueID(); } catch (e) { myId = ''; }
            var seen = {};
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                var player = entry.player || {};
                var uid = player.uniqueID || ('row' + i);
                if (seen[uid]) continue;
                seen[uid] = true;
                var row = document.createElement('div');
                var isMe = !!(myId && uid === myId);
                row.className = 'leader-row' + (isMe ? ' is-me' : '');
                var rank = document.createElement('div');
                rank.className = 'leader-rank';
                rank.textContent = '#' + (entry.rank || (i + 1));
                var avatar = document.createElement('img');
                avatar.className = 'leader-avatar';
                avatar.alt = '';
                var src = '';
                try { src = player.getAvatarSrc ? player.getAvatarSrc('small') : (player.avatar || ''); } catch (e) { src = ''; }
                if (src) {
                    avatar.src = src;
                    avatar.loading = 'lazy';
                    avatar.referrerPolicy = 'no-referrer';
                    avatar.onerror = function () { this.style.visibility = 'hidden'; };
                } else {
                    avatar.style.visibility = 'hidden';
                }
                var name = document.createElement('div');
                name.className = 'leader-name';
                name.textContent = player.publicName || 'Pilot';
                if (isMe) {
                    var you = document.createElement('small');
                    you.textContent = t('you');
                    name.appendChild(you);
                }
                var score = document.createElement('div');
                score.className = 'leader-score';
                score.textContent = fmt(entry.score || 0);
                row.appendChild(rank);
                row.appendChild(avatar);
                row.appendChild(name);
                row.appendChild(score);
                list.appendChild(row);
            }
            if (data.userRank && PB.SDK.isAuthorized()) {
                var note = document.createElement('div');
                note.className = 'panel-foot-note';
                note.textContent = t('yourRank', { n: data.userRank });
                list.appendChild(note);
            }
        },

        renderMyStats: function () {
            var box = $('me-stats');
            if (!box) return;
            var s = PB.Storage.state;
            var items = [
                ['bestScore', fmt(s.best), true],
                ['bestCombo', 'x' + (s.bestCombo || 1), false],
                ['totalRuns', fmt(s.runs), false],
                ['totalOrbs', fmt(s.totalOrbs), false],
                ['totalDust', fmt(s.totalDust), true],
                ['maxSector', fmt(s.maxSector), false],
                ['totalTime', PB.Util.formatTime(s.totalTime), false],
                ['dustCurrent', fmt(s.dust), true]
            ];
            var html = '';
            for (var i = 0; i < items.length; i++) {
                html += '<div class="me-stat' + (items[i][2] ? ' accent' : '') + '"><span>' + escapeHtml(t(items[i][0])) + '</span><strong>' + escapeHtml(items[i][1]) + '</strong></div>';
            }
            box.innerHTML = html;
            var auth = $('me-auth');
            if (!auth) return;
            if (PB.SDK.isAuthorized()) {
                var name = PB.SDK.username || 'Pilot';
                auth.innerHTML = '<p class="setting-hint" style="margin-bottom:10px">' + escapeHtml(t('signedAs', { name: name })) + '</p>' +
                    '<p class="auth-status"><svg class="icon"><use href="#i-check"></use></svg>' + escapeHtml(t('loggedIn')) + '</p>';
            } else {
                auth.innerHTML = '<p class="setting-hint" style="margin-bottom:10px">' + escapeHtml(t('notLogged')) + '</p>' +
                    '<p class="setting-hint" style="margin-bottom:12px">' + escapeHtml(t('loginBenefit')) + '</p>' +
                    '<button class="btn btn-primary btn-sm" type="button" data-action="login">' + escapeHtml(t('login')) + '</button>';
            }
        },

        login: function () {
            if (!PB.SDK.available) {
                this.toast(t('toastLoginCancel'), 'error');
                return;
            }
            var self = this;
            var buttons = document.querySelectorAll('[data-action="login"]');
            for (var i = 0; i < buttons.length; i++) buttons[i].disabled = true;
            PB.SDK.login().then(function (res) {
                for (var j = 0; j < buttons.length; j++) buttons[j].disabled = false;
                if (res && res.ok && res.authorized) {
                    self.syncFromStorage();
                    self.toast(t('toastLoginSuccess'), 'reward');
                    if (PB.Storage.state.best > 0) PB.SDK.setLeaderboardScore('best_score', PB.Storage.state.best);
                    self.renderRating();
                    self.loadLeaderboard(true);
                } else {
                    self.toast(t('toastLoginCancel'), 'error');
                }
            }).catch(function () {
                for (var k = 0; k < buttons.length; k++) buttons[k].disabled = false;
                self.toast(t('toastError'), 'error');
            });
        },

        // ------------------------------------------------------------------ settings

        openSettings: function () {
            this.renderSettings();
            this.openOverlay('overlay-settings');
        },

        renderSettings: function () {
            var s = PB.Storage.state;
            var toggles = document.querySelectorAll('.toggle[data-action="toggle-sound"]');
            for (var i = 0; i < toggles.length; i++) toggles[i].setAttribute('aria-checked', s.sound ? 'true' : 'false');
            var music = document.querySelectorAll('.toggle[data-action="toggle-music"]');
            for (var j = 0; j < music.length; j++) music[j].setAttribute('aria-checked', s.music ? 'true' : 'false');
            setText('effects-label', t(s.effects === 'low' ? 'effectsLow' : 'effectsHigh'));
            this.buildLangOptions();
            this.updateSoundUI();
        },

        buildLangOptions: function () {
            var box = $('lang-options');
            if (!box) return;
            var current = PB.Storage.state.lang || 'auto';
            var codes = ['auto'].concat(PB.I18n.supported);
            var html = '';
            for (var i = 0; i < codes.length; i++) {
                var code = codes[i];
                var label = code === 'auto' ? t('langAuto') : PB.I18n.languageName(code);
                html += '<button class="lang-btn' + (current === code ? ' is-active' : '') + '" type="button" data-action="set-lang" data-lang="' + code + '">' + escapeHtml(label) + '</button>';
            }
            box.innerHTML = html;
        },

        setLanguage: function (lang) {
            if (!lang) return;
            PB.Storage.setLang(lang);
            PB.I18n.setManual(lang);
            PB.Audio.click();
            this.applyLanguageAll();
        },

        applyLanguageAll: function () {
            PB.I18n.apply();
            var closeBtns = document.querySelectorAll('.close-btn');
            for (var c = 0; c < closeBtns.length; c++) closeBtns[c].setAttribute('aria-label', t('close'));
            var pauseBtn = $('btn-pause');
            if (pauseBtn) pauseBtn.setAttribute('aria-label', t('controlPause'));
            var settingsBtn = document.querySelector('[data-action="open-settings"]');
            if (settingsBtn) settingsBtn.setAttribute('aria-label', t('settingsTitle'));
            this.buildLangOptions();
            this.refreshMenu();
            this.updateSoundUI();
            this.renderSettings();
            if (this.tutorialKey) {
                setText('tutorial-text', t(this.tutorialKey));
            }
            if (this.currentOverlay === 'overlay-missions') this.renderMissions();
            else if (this.currentOverlay === 'overlay-daily') this.renderDaily();
            else if (this.currentOverlay === 'overlay-shop') this.renderShop();
            else if (this.currentOverlay === 'overlay-rating') this.renderRating();
            else if (this.currentOverlay === 'overlay-pause') {
                setText('pause-sound-label', t(PB.Storage.state.sound ? 'soundOn' : 'soundOff'));
            }
        },

        toggleSound: function () {
            var on = !PB.Storage.state.sound;
            PB.Storage.setSound(on);
            PB.Audio.setSound(on);
            if (on) {
                PB.Audio.unlock();
                PB.Audio.resume();
                PB.Audio.click();
            }
            this.updateSoundUI();
            this.renderSettings();
            this.refreshMenu();
        },

        toggleMusic: function () {
            var on = !PB.Storage.state.music;
            PB.Storage.setMusic(on);
            PB.Audio.setMusic(on);
            if (on) {
                PB.Audio.unlock();
                PB.Audio.resume();
            }
            this.renderSettings();
        },

        toggleEffects: function () {
            var next = PB.Storage.state.effects === 'low' ? 'high' : 'low';
            PB.Storage.setEffects(next);
            this.renderSettings();
        },

        updateSoundUI: function () {
            var on = PB.Storage.state.sound;
            var icon = on ? 'i-sound' : 'i-mute';
            var buttons = document.querySelectorAll('[data-action="toggle-sound"]');
            for (var i = 0; i < buttons.length; i++) {
                useIcon(buttons[i], icon);
                buttons[i].setAttribute('aria-label', t(on ? 'soundOn' : 'soundOff'));
                buttons[i].setAttribute('aria-checked', on ? 'true' : 'false');
            }
            setText('pause-sound-label', t(on ? 'soundOn' : 'soundOff'));
        },

        resetProgress: function () {
            var self = this;
            this.openConfirm(t('resetConfirmTitle'), t('resetConfirmText'), t('resetProgress')).then(function (ok) {
                if (!ok) return;
                PB.Storage.resetProgress();
                PB.Game.refreshBest();
                PB.Game.setSkin();
                PB.Audio.applySettings(PB.Storage.state.sound, PB.Storage.state.music);
                self.closeAllOverlays();
                self.screen = 'menu';
                hide(self.hud);
                show(self.menu);
                PB.Game.startMenu();
                self.refreshMenu();
                self.refreshBest();
                self.syncFromStorage();
                self.toast(t('resetDone'), 'reward');
            });
        },

        // -------------------------------------------------------------------- overlays

        openOverlay: function (id) {
            if (!id) return;
            if (this.currentOverlay === id) return;
            if (this.currentOverlay) {
                hide($(this.currentOverlay));
                this.overlayStack.push(this.currentOverlay);
            }
            this.currentOverlay = id;
            var node = $(id);
            if (!node) return;
            hide($('toast'));
            show(node);
            node.scrollTop = 0;
            var panel = node.querySelector('.panel-scroll');
            if (panel) panel.scrollTop = 0;
            this.focusOverlay();
            if (id !== 'overlay-shop') this.stopPreview();
        },

        closeOverlay: function (id) {
            var target = id || this.currentOverlay;
            if (!target) return;
            if (target === 'overlay-over') {
                this.quitToMenu();
                return;
            }
            hide($(target));
            if (this.currentOverlay === target) this.currentOverlay = null;
            if (target === 'overlay-shop') this.stopPreview();
            if (target === 'overlay-missions') {
                if (this.resetTimer) { clearInterval(this.resetTimer); this.resetTimer = null; }
            }
            if (this.overlayStack.length) {
                var prev = this.overlayStack.pop();
                this.currentOverlay = prev;
                show($(prev));
                this.focusOverlay();
                if (prev === 'overlay-missions') this.startResetTimer();
                if (prev === 'overlay-shop') this.startPreview();
            } else {
                this.focusLast();
            }
        },

        closeAllOverlays: function () {
            var ids = ['overlay-pause', 'overlay-over', 'overlay-missions', 'overlay-shop', 'overlay-rating', 'overlay-daily', 'overlay-settings', 'overlay-howto', 'overlay-confirm'];
            for (var i = 0; i < ids.length; i++) hide($(ids[i]));
            this.currentOverlay = null;
            this.overlayStack = [];
            this.stopPreview();
            if (this.resetTimer) { clearInterval(this.resetTimer); this.resetTimer = null; }
            if (this.overTimer) { clearTimeout(this.overTimer); this.overTimer = null; }
        },

        focusOverlay: function () {
            var node = this.currentOverlay ? $(this.currentOverlay) : null;
            if (!node) return;
            this.lastFocus = document.activeElement;
            var target = node.querySelector('.btn-primary:not([disabled])') || node.querySelector('.close-btn:not([disabled])') || node.querySelector('button:not([disabled])');
            if (target) {
                try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
            }
        },

        focusLast: function () {
            if (this.lastFocus && this.lastFocus.focus) {
                try { this.lastFocus.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
            }
        },

        openConfirm: function (title, text, yesLabel) {
            var self = this;
            return new Promise(function (resolve) {
                self.confirmResolver = resolve;
                setText('confirm-title', title);
                setText('confirm-text', text);
                var yes = document.querySelector('#overlay-confirm [data-action="confirm-yes"] span');
                if (yes) yes.textContent = yesLabel || t('confirm');
                self.openOverlay('overlay-confirm');
            });
        },

        finishConfirm: function (yes) {
            var resolver = this.confirmResolver;
            this.confirmResolver = null;
            hide($('overlay-confirm'));
            if (this.currentOverlay === 'overlay-confirm') this.currentOverlay = null;
            if (this.overlayStack.length) {
                var prev = this.overlayStack.pop();
                this.currentOverlay = prev;
                show($(prev));
                this.focusOverlay();
            } else {
                this.focusLast();
            }
            if (resolver) resolver(!!yes);
        },

        // ----------------------------------------------------------------------- misc

        toast: function (text, type, duration) {
            var el = $('toast');
            var label = $('toast-text');
            if (!el || !label) return;
            // On very short screens a modal panel covers the toast area; the
            // panel's own controls already show the result of the action.
            if (this.currentOverlay && window.innerHeight < 620) return;
            label.textContent = text;
            el.classList.remove('is-hidden', 'is-error', 'is-reward', 'is-game');
            if (this.screen === 'game' && !this.currentOverlay) el.classList.add('is-game');
            if (type === 'error') el.classList.add('is-error');
            if (type === 'reward') el.classList.add('is-reward');
            useIcon(el, type === 'error' ? 'i-close' : (type === 'reward' ? 'i-star' : 'i-check'));
            var live = $('aria-live');
            if (live) live.textContent = text;
            if (this.toastTimer) clearTimeout(this.toastTimer);
            el.style.animation = 'none';
            void el.offsetWidth;
            el.style.animation = '';
            var self = this;
            this.toastTimer = setTimeout(function () {
                hide(el);
                self.toastTimer = null;
            }, duration || 2600);
        },

        showSectorToast: function (n) {
            var el = $('sector-toast');
            if (!el) return;
            setText('sector-toast-num', fmt(n));
            el.classList.remove('is-hidden');
            el.style.animation = 'none';
            void el.offsetWidth;
            el.style.animation = '';
            if (this.sectorTimer) clearTimeout(this.sectorTimer);
            this.sectorTimer = setTimeout(function () { hide(el); }, 2700);
        },

        showOverdriveToast: function () {
            var el = $('overdrive-toast');
            if (!el) return;
            el.classList.remove('is-hidden');
            el.style.animation = 'none';
            void el.offsetWidth;
            el.style.animation = '';
            if (this.overdriveTimer) clearTimeout(this.overdriveTimer);
            this.overdriveTimer = setTimeout(function () { hide(el); }, 2300);
        },

        onTutorialHint: function (key) {
            this.tutorialKey = key || null;
            var el = $('tutorial-hint');
            if (!el) return;
            if (!key) {
                hide(el);
                return;
            }
            setText('tutorial-text', t(key));
            show(el);
        },

        onTutorialDone: function () {
            this.onTutorialHint(null);
            this.toast(t('tutorialDone'), 'reward');
            this.refreshMenu();
        },

        onSector: function (n) {
            if (this.overdriveTimer) return;
            this.showSectorToast(n);
        },

        onOverdrive: function () {
            hide($('sector-toast'));
            this.showOverdriveToast();
        },

        onKeyDown: function (e) {
            var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
            if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
            if (e.key === 'Escape') {
                if (this.currentOverlay === 'overlay-confirm') {
                    this.finishConfirm(false);
                    e.preventDefault();
                    return;
                }
                if (this.currentOverlay === 'overlay-pause') {
                    this.resumeGame();
                    e.preventDefault();
                    return;
                }
                if (this.currentOverlay) {
                    this.closeOverlay();
                    e.preventDefault();
                    return;
                }
                if (PB.Game && PB.Game.state === 'playing') {
                    this.pauseGame();
                    e.preventDefault();
                }
                return;
            }
            if (this.currentOverlay) {
                if (e.key === 'Tab') this.trapTab(e);
                return;
            }
            if (!PB.Game || PB.Game.state !== 'playing') return;
            if (e.repeat) return;
            if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (e.target && e.target.closest && e.target.closest('button, a, input, textarea, select')) return;
                e.preventDefault();
                PB.Game.switchLane();
            } else if (e.key === 'p' || e.key === 'P' || e.key === 'з' || e.key === 'З') {
                this.pauseGame();
                e.preventDefault();
            } else if (e.key === 'm' || e.key === 'M' || e.key === 'ь' || e.key === 'Ь') {
                this.toggleSound();
                e.preventDefault();
            }
        },

        trapTab: function (e) {
            var node = this.currentOverlay ? $(this.currentOverlay) : null;
            if (!node) return;
            var all = node.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])');
            var focusable = [];
            for (var i = 0; i < all.length; i++) {
                if (all[i].offsetParent !== null) focusable.push(all[i]);
            }
            if (!focusable.length) return;
            var first = focusable[0];
            var last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        },

        gameCallbacks: function () {
            return {
                onHud: function (data) { UI.updateHud(data); },
                onRunEnd: function (stats) { UI.onRunEnd(stats); },
                onGameplayStop: function () { UI.onGameplayStop(); },
                onSector: function (n) { UI.onSector(n); },
                onOverdrive: function () { UI.onOverdrive(); },
                onTutorialHint: function (key) { UI.onTutorialHint(key); },
                onTutorialDone: function () { UI.onTutorialDone(); }
            };
        }
    };

    global.PB = global.PB || {};
    global.PB.UI = UI;
})(window);

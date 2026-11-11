/* Pulsebound — boot sequence. */
(function (global) {
    'use strict';

    function wait(ms) {
        return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    function timeout(promise, ms, fallback) {
        return new Promise(function (resolve) {
            var done = false;
            var timer = setTimeout(function () {
                if (done) return;
                done = true;
                resolve(fallback);
            }, ms);
            Promise.resolve(promise).then(function (value) {
                if (done) return;
                done = true;
                clearTimeout(timer);
                resolve(value);
            }).catch(function () {
                if (done) return;
                done = true;
                clearTimeout(timer);
                resolve(fallback);
            });
        });
    }

    function boot() {
        var UI = PB.UI;
        var SDK = PB.SDK;
        var Storage = PB.Storage;
        var I18n = PB.I18n;

        // 1. Local progress and language.
        Storage.loadLocal();
        I18n.init(I18n.detect(null));
        I18n.setManual(Storage.state.lang);
        UI.setBootProgress(12);

        // 2. Audio settings and UI shell.
        PB.Audio.init(Storage.state.sound, Storage.state.music);
        PB.Audio.applySettings(Storage.state.sound, Storage.state.music);
        UI.init();
        UI.setBootProgress(26);

        // 3. Renderer.
        var canvas = document.getElementById('scene');
        if (!canvas) return;
        PB.Game.init(canvas, UI.gameCallbacks());
        UI.setBootProgress(42);

        // 4. SDK and cloud save.
        var started = Date.now();
        var sdkLang = null;
        var cloudDone = false;

        var sdkPromise = SDK.init().then(function () {
            UI.setBootProgress(62);
            if (SDK.lang) {
                sdkLang = SDK.lang;
                if (Storage.state.lang === 'auto') {
                    I18n.setDetected(SDK.lang);
                    UI.applyLanguageAll();
                }
            }
            UI.setBootProgress(72);
            return timeout(SDK.loadCloud(), 3200, null);
        }).then(function () {
            cloudDone = true;
            UI.setBootProgress(90);
            UI.syncFromStorage();
            UI.refreshBest();
            UI.applyStaticText();
        }).catch(function (err) {
            cloudDone = true;
            if (global.console && console.warn) console.warn('Pulsebound SDK:', err);
            UI.setBootProgress(90);
        });

        // Keep the loading screen readable even on a fast connection.
        var minimum = wait(820);
        Promise.all([sdkPromise, minimum]).then(function () {
            UI.setBootProgress(100);
            UI.finishBoot();
            UI.syncFromStorage();
            UI.refreshBest();
        });

        // If the cloud responds after the menu is already visible, merge it.
        setTimeout(function () {
            if (!cloudDone) return;
            UI.syncFromStorage();
            UI.refreshBest();
        }, 1500);

        // ---------------------------------------------------------------- debug hooks
        if (/[?&]debug=1(?:&|$)/.test(global.location.search)) {
            global.__pbDebug = {
                state: function () { return PB.Game.state; },
                stats: function () { return PB.Game.stats(); },
                kill: function () { PB.Game.die(); },
                setScore: function (n) { if (PB.Game.run) PB.Game.run.score = Math.max(0, Number(n) || 0); PB.Game.emitHud(true); },
                setFlow: function (n) {
                    PB.Game.flow = Math.max(0, Math.min(1, Number(n) || 0));
                    if (PB.Game.flow >= 1 && PB.Game.overdriveT <= 0) PB.Game.startOverdrive();
                },
                addDust: function (n) { PB.Storage.addDust(n, true); PB.UI.refreshMenu(); },
                setBest: function (n) { PB.Storage.state.best = Math.max(0, Number(n) || 0); PB.Storage.saveLocal(); PB.Game.refreshBest(); PB.UI.refreshBest(); PB.UI.refreshMenu(); },
                finishTutorial: function () { PB.Game.finishTutorial(); },
                skipTutorial: function () {
                    PB.Storage.state.tutorialDone = true;
                    PB.Storage.saveSoon();
                    PB.Game.finishTutorial();
                },
                open: function (id) { PB.UI.openOverlay(id); },
                closeAll: function () { PB.UI.closeAllOverlays(); },
                showGameOver: function () { if (PB.Game.run) PB.Game.die(); },
                setLanguage: function (l) { PB.UI.setLanguage(l); },
                version: '1.0.0'
            };
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    global.addEventListener('error', function (e) {
        if (global.console && console.error) {
            console.error('Pulsebound error:', e.error || e.message || e);
        }
    });
})(window);

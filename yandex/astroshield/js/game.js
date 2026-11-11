/* Gameplay simulation and world rendering. */
(function () {
  "use strict";

  const AG = window.AG;
  const TAU = Math.PI * 2;
  const T = function (key, vars) { return AG.I18N.t(key, vars); };

  class Game {
    constructor(app) {
      this.app = app;
      this.view = app.view;
      this.state = "idle";
      this.time = 0;
      this.projectiles = [];
      this.particles = [];
      this.popups = [];
      this.shockwaves = [];
      this.boss = null;
      this.banner = null;
      this.callout = null;
      this.shake = 0;
      this.flash = 0;
      this.flashColor = "#ff5b63";
      this.hitstop = 0;
      this.hitFlash = 0;
      this.angle = -Math.PI / 2;
      this.targetAngle = this.angle;
      this.keyDir = 0;
      this.energy = 100;
      this.maxEnergy = 100;
      this.hp = 3;
      this.maxHP = 3;
      this.regen = 16;
      this.halfWidth = 0.63;
      this.score = 0;
      this.displayScore = 0;
      this.combo = 1;
      this.comboTimer = 0;
      this.wave = 1;
      this.waveState = "idle";
      this.quota = 0;
      this.spawned = 0;
      this.spawnedCrystals = 0;
      this.spawnTimer = 0;
      this.clearTimer = 0;
      this.nextWaveTimer = 0;
      this.bossClearTimer = 0;
      this.overload = 0;
      this.invuln = 0;
      this.countdown = 0;
      this.countdownLast = 0;
      this.dyingTimer = 0;
      this.controlHint = 0;
      this.firstRun = false;
      this.pickupStreak = 0;
      this.lastKind = "asteroid";
      this.lastSpawnAngle = -Math.PI / 2;
      this.dustTotal = 0;
      this.runStats = this.freshStats();
      this.deathReported = false;
      this.damageScars = 0;
    }

    freshStats() {
      return {
        blocked: 0,
        perfect: 0,
        crystals: 0,
        repairs: 0,
        bossKills: 0,
        damage: 0,
        maxCombo: 1
      };
    }

    startRun() {
      this.view = this.app.view;
      const meta = AG.Meta.fromSave(this.app.save);
      this.meta = meta;
      this.maxEnergy = meta.maxEnergy;
      this.energy = meta.maxEnergy;
      this.regen = meta.regen;
      this.halfWidth = meta.halfWidth;
      this.maxHP = meta.maxHP;
      this.hp = meta.maxHP;
      this.score = 0;
      this.displayScore = 0;
      this.combo = 1;
      this.comboTimer = 0;
      this.wave = 0;
      this.waveState = "countdown";
      this.quota = 0;
      this.spawned = 0;
      this.spawnedCrystals = 0;
      this.spawnTimer = 0;
      this.clearTimer = 0;
      this.nextWaveTimer = 0;
      this.bossClearTimer = 0;
      this.boss = null;
      this.banner = null;
      this.callout = null;
      this.projectiles.length = 0;
      this.particles.length = 0;
      this.popups.length = 0;
      this.shockwaves.length = 0;
      this.angle = -Math.PI / 2;
      this.targetAngle = this.angle;
      this.keyDir = 0;
      this.overload = 0;
      this.invuln = 0;
      this.shake = 0;
      this.flash = 0;
      this.hitstop = 0;
      this.dyingTimer = 0;
      this.state = "countdown";
      this.countdown = 2.65;
      this.countdownLast = 4;
      this.controlHint = 9;
      this.firstRun = this.app.save.runs <= 1;
      this.pickupStreak = 0;
      this.lastKind = "asteroid";
      this.lastSpawnAngle = -Math.PI / 2;
      this.runStats = this.freshStats();
      this.dustTotal = 0;
      this.deathReported = false;
      this.damageScars = 0;
      this.time = 0;
      this.checkAchievements();
      this.banner = { title: T("countdown"), sub: "", life: 2.4, maxLife: 2.4, color: "#cfefff" };
      return this;
    }

    stop() {
      this.state = "idle";
      this.projectiles.length = 0;
      this.particles.length = 0;
      this.popups.length = 0;
      this.shockwaves.length = 0;
      this.boss = null;
      this.banner = null;
    }

    aimAt(x, y) {
      const v = this.app.view;
      const dx = x - v.cx;
      const dy = y - v.cy;
      if (dx * dx + dy * dy < v.V * v.V * 0.012) return;
      this.targetAngle = Math.atan2(dy, dx);
    }

    setKeyDir(dir) {
      this.keyDir = dir > 0 ? 1 : dir < 0 ? -1 : 0;
    }

    get shieldActive() {
      return this.overload <= 0 && this.energy > 0.01;
    }

    update(dt) {
      dt = AG.clamp(dt, 0, 0.05);
      this.time += dt;
      this.shake *= Math.pow(0.03, dt);
      if (this.shake < 0.15) this.shake = 0;
      this.flash = Math.max(0, this.flash - dt * 2.1);
      this.hitFlash = Math.max(0, this.hitFlash - dt * 5);
      if (this.controlHint > 0) this.controlHint -= dt;
      if (this.banner) {
        this.banner.life -= dt;
        if (this.banner.life <= 0) this.banner = null;
      }
      if (this.callout) {
        this.callout.life -= dt;
        if (this.callout.life <= 0) this.callout = null;
      }
      this.displayScore += (this.score - this.displayScore) * Math.min(1, dt * 9);

      if (this.state === "countdown") {
        const before = Math.ceil(this.countdown);
        this.countdown -= dt;
        const now = Math.ceil(this.countdown);
        if (now !== before && now > 0) AG.Audio.play("count");
        if (this.countdown <= 0) {
          this.state = "playing";
          this.banner = null;
          AG.Audio.play("go");
          this.beginWave(1);
          if (this.app.onPlayStart) this.app.onPlayStart();
        }
        this.updateParticles(dt);
        return;
      }

      if (this.state === "dying") {
        this.dyingTimer -= dt;
        this.updateParticles(dt * 0.55);
        if (this.dyingTimer <= 0) {
          this.state = "over";
          if (!this.deathReported) {
            this.deathReported = true;
            this.dustTotal = AG.Save.dustForRun(this.score, this.wave, this.runStats.crystals, this.runStats.bossKills);
            if (this.app.onRunDeath) this.app.onRunDeath(this.getResult());
          }
        }
        return;
      }

      if (this.state === "over") {
        this.updateParticles(dt);
        return;
      }

      if (this.state !== "playing") {
        this.updateParticles(dt);
        return;
      }

      if (this.hitstop > 0) {
        this.hitstop -= dt;
        this.updateParticles(dt * 0.28);
        return;
      }

      if (this.invuln > 0) this.invuln -= dt;
      if (this.overload > 0) {
        this.overload -= dt;
        if (this.overload <= 0) {
          this.overload = 0;
          this.energy = this.maxEnergy * 0.35;
        }
      } else {
        this.energy = Math.min(this.maxEnergy, this.energy + this.regen * dt);
      }

      if (this.comboTimer > 0) {
        this.comboTimer -= dt;
        if (this.comboTimer <= 0) {
          this.combo = 1;
          this.comboTimer = 0;
        }
      }

      if (this.keyDir) this.targetAngle = AG.angNorm(this.targetAngle + this.keyDir * 3.7 * dt);
      this.angle = AG.approachAngle(this.angle, this.targetAngle, 11.5 * dt);

      this.updateWave(dt);
      this.updateBoss(dt);
      this.updateProjectiles(dt);
      this.updateParticles(dt);

      if (this.waveState === "spawning" && this.spawned >= this.quota && this.projectiles.length === 0) {
        this.waveState = "clearing";
        this.clearTimer = 0.7;
      }
      if (this.waveState === "clearing") {
        this.clearTimer -= dt;
        if (this.clearTimer <= 0) this.completeWave();
      }
      if (this.waveState === "waveComplete") {
        this.nextWaveTimer -= dt;
        if (this.nextWaveTimer <= 0) this.beginWave(this.wave + 1);
      }
      if (this.waveState === "bossClear") {
        this.bossClearTimer -= dt;
        if (this.bossClearTimer <= 0) this.completeWave();
      }
    }

    updateWave(dt) {
      if (this.waveState === "spawning") {
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0 && this.spawned < this.quota) {
          const kind = this.pickKind();
          this.spawnObject(kind);
          this.spawned++;
          this.spawnTimer = this.spawnInterval();
          if (this.spawned >= this.quota) this.spawnTimer = 999;
        }
      }
    }

    spawnInterval() {
      const base = Math.max(0.54, 1.75 * Math.pow(0.92, this.wave - 1));
      return base * (0.84 + Math.random() * 0.34);
    }

    pickKind() {
      const w = this.wave;
      if (this.firstRun && w === 1 && this.spawned === 3) return "crystal";
      if (w >= 2 && this.spawnedCrystals === 0 && this.spawned >= this.quota - 3 && this.quota > 4) return "crystal";
      if (this.pickupStreak >= 2) return "asteroid";
      const crystal = w >= 2 ? Math.min(0.18, 0.045 + w * 0.011) : 0;
      const repair = w >= 3 ? 0.042 : 0;
      const split = w >= 4 ? Math.min(0.2, 0.035 + (w - 4) * 0.015) : 0;
      const r = Math.random();
      if (r < repair) return "repair";
      if (r < repair + crystal) return "crystal";
      if (r < repair + crystal + split) return "split";
      return "asteroid";
    }

    waveTag(n) {
      const names = AG.I18N.arr("waveNames");
      return names[(n - 1) % names.length] || "";
    }

    beginWave(n) {
      this.wave = n;
      this.boss = null;
      this.spawned = 0;
      this.spawnedCrystals = 0;
      this.pickupStreak = 0;
      this.spawnTimer = 1.05;
      this.clearTimer = 0;
      this.quota = Math.min(22, 7 + n * 2);
      this.checkAchievements();

      if (n % 5 === 0) {
        this.waveState = "boss";
        this.spawnBoss();
        this.audio("boss");
        this.banner = {
          title: T("wave") + " " + n,
          sub: T("bossName"),
          life: 2.6,
          maxLife: 2.6,
          color: "#ff8a92"
        };
        if (!this.app.save.hints.boss) {
          this.app.save.hints.boss = true;
          this.app.persist();
        }
        this.setCallout(T("bossHint"), "#ffe3a3", 4.0);
      } else {
        this.waveState = "spawning";
        this.banner = {
          title: T("wave") + " " + n,
          sub: this.waveTag(n),
          life: 2.1,
          maxLife: 2.1,
          color: "#dff8ff"
        };
        this.audio("wave");
      }
    }

    completeWave() {
      if (this.waveState === "waveComplete") return;
      const bonus = Math.round(250 * this.wave * this.meta.scoreMul);
      this.score += bonus;
      this.waveState = "waveComplete";
      this.nextWaveTimer = 2.15;
      this.banner = {
        title: T("waveClear"),
        sub: T("waveBonus", { n: AG.I18N.num(bonus) }),
        life: 2.0,
        maxLife: 2.0,
        color: "#8effd9"
      };
      this.audio("reward");
      this.spawnBurst(this.view.cx, this.view.cy, {
        count: 24,
        color: "#6ef7dd",
        speed: this.view.V * 0.32,
        size: 2.6,
        life: 0.85,
        type: "dot",
        glow: true
      });
      this.addShockwave(this.view.cx, this.view.cy, "#6ef7dd", this.view.V * 0.9, 0.9, 2);
      this.checkAchievements();
    }

    spawnBoss() {
      const v = this.view;
      this.boss = {
        angle: 0.05,
        phase: 0,
        dist: v.V * 0.82,
        r: v.V * 0.105,
        maxHp: 6 + this.wave * 1.2,
        hp: 6 + this.wave * 1.2,
        fireTimer: 2.2,
        telegraph: 0,
        aim: 0,
        minionTimer: 3.2,
        hitFlash: 0
      };
      const b = this.boss;
      b.x = v.cx + Math.cos(b.angle) * b.dist;
      b.y = v.cy + Math.sin(b.angle) * b.dist;
      this.addShockwave(b.x, b.y, "#ff7c8e", b.r * 4, 1.2, 3);
    }

    updateBoss(dt) {
      const b = this.boss;
      if (!b) return;
      b.phase += dt;
      b.angle = 0.05 + Math.sin(b.phase * 0.23) * 0.55;
      b.dist = this.view.V * (0.82 + Math.sin(b.phase * 0.7) * 0.012);
      b.x = this.view.cx + Math.cos(b.angle) * b.dist;
      b.y = this.view.cy + Math.sin(b.angle) * b.dist;
      b.hitFlash = Math.max(0, b.hitFlash - dt * 5);
      if (b.telegraph > 0) {
        b.telegraph -= dt;
        if (b.telegraph <= 0) {
          this.fireBossOrb();
          const hpRatio = b.hp / b.maxHp;
          b.fireTimer = Math.max(1.15, (2.3 - (1 - hpRatio) * 0.9)) * (0.9 + Math.random() * 0.2);
        }
      } else {
        b.fireTimer -= dt;
        if (b.fireTimer <= 0) {
          const orbs = this.projectiles.filter(function (p) { return p.kind === "orb"; }).length;
          if (orbs < 5) {
            b.telegraph = 0.62;
            b.aim = Math.atan2(this.view.cy - b.y, this.view.cx - b.x);
          } else {
            b.fireTimer = 0.7;
          }
        }
      }
      b.minionTimer -= dt;
      if (b.minionTimer <= 0) {
        this.spawnObject("asteroid");
        b.minionTimer = 3.6 + Math.random() * 1.8;
      }
    }

    fireBossOrb() {
      const b = this.boss;
      if (!b) return;
      const v = this.view;
      const a = b.aim;
      const r = v.V * 0.022;
      const p = {
        kind: "orb",
        x: b.x + Math.cos(a) * (b.r + r + 3),
        y: b.y + Math.sin(a) * (b.r + r + 3),
        px: 0,
        py: 0,
        vx: Math.cos(a) * v.V * 0.4,
        vy: Math.sin(a) * v.V * 0.4,
        speed: v.V * 0.4,
        r: r,
        rot: 0,
        spin: 0,
        variant: 0,
        reflected: false,
        homing: false,
        dmg: 1,
        born: this.time
      };
      p.px = p.x;
      p.py = p.y;
      this.projectiles.push(p);
      this.audio("shatter");
      this.spawnBurst(p.x, p.y, {
        count: 8,
        color: "#ffae72",
        speed: v.V * 0.16,
        size: 2,
        life: 0.4,
        type: "dot",
        glow: true
      });
    }

    spawnObject(kind, opts) {
      const v = this.view;
      const o = opts || {};
      let angle = o.angle;
      if (angle === undefined) {
        for (let i = 0; i < 10; i++) {
          angle = Math.random() * TAU;
          if (Math.abs(AG.angDiff(angle, this.lastSpawnAngle)) > 0.34) break;
        }
      }
      this.lastSpawnAngle = angle;
      const spawnR = v.V * (o.radiusFactor || 1.035);
      const off = (Math.random() - 0.5) * v.V * 0.055;
      const tx = v.cx + Math.cos(angle + Math.PI / 2) * off;
      const ty = v.cy + Math.sin(angle + Math.PI / 2) * off;
      const x = v.cx + Math.cos(angle) * spawnR;
      const y = v.cy + Math.sin(angle) * spawnR;
      const dir = Math.atan2(ty - y, tx - x);
      let speed = v.V * (0.19 + Math.min(0.27, this.wave * 0.016));
      if (this.firstRun && this.wave === 1) speed *= 0.82;
      let r = v.V * 0.034;
      let split = false;
      let spin = (Math.random() - 0.5) * 1.6;
      let variant = Math.floor(Math.random() * 6);
      if (kind === "crystal") {
        r = v.V * 0.029;
        speed *= 0.92;
        spin = (Math.random() - 0.5) * 0.8;
        variant = 0;
      } else if (kind === "repair") {
        r = v.V * 0.031;
        speed *= 0.88;
        spin = 0;
      } else if (kind === "split") {
        r = v.V * 0.048;
        speed *= 0.9;
        split = true;
        variant = Math.floor(Math.random() * 3);
      }
      speed *= 0.9 + Math.random() * 0.2;
      const p = {
        kind: kind === "split" ? "asteroid" : kind,
        split: split,
        generation: 0,
        x: x,
        y: y,
        px: x,
        py: y,
        vx: Math.cos(dir) * speed,
        vy: Math.sin(dir) * speed,
        speed: speed,
        r: r,
        rot: Math.random() * TAU,
        spin: spin,
        variant: variant,
        reflected: false,
        homing: false,
        dmg: 1,
        trailTimer: 0,
        born: this.time
      };
      this.projectiles.push(p);
      if (kind === "crystal") {
        this.spawnedCrystals++;
        this.pickupStreak++;
        if (!this.app.save.hints.crystal) {
          this.app.save.hints.crystal = true;
          this.app.persist();
          this.setCallout(T("crystalHint"), "#8ffff2", 3.2);
        }
      } else if (kind === "repair") {
        this.pickupStreak++;
        if (!this.app.save.hints.repair) {
          this.app.save.hints.repair = true;
          this.app.persist();
          this.setCallout(T("repairHint"), "#b6ffb8", 3.2);
        }
      } else {
        this.pickupStreak = 0;
      }
      this.lastKind = kind;
      this.addShockwave(x, y, kind === "crystal" ? "#5ffbf1" : "#88a9c6", v.V * 0.11, 0.5, 1.5);
      return p;
    }

    updateProjectiles(dt) {
      const v = this.view;
      const S = v.S;
      const P = v.P;
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        if (!p) continue;
        p.px = p.x;
        p.py = p.y;
        p.rot += p.spin * dt;

        if (p.homing) {
          const b = this.boss;
          if (b) {
            const dx = b.x - p.x;
            const dy = b.y - p.y;
            const d = Math.hypot(dx, dy) || 1;
            const sp = v.V * 0.86;
            p.vx = (dx / d) * sp;
            p.vy = (dy / d) * sp;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (d <= b.r + p.r * 0.8) {
              this.hitBoss(p);
              if (!this.projectiles.length) break;
              if (this.projectiles[i] === p) this.projectiles.splice(i, 1);
              continue;
            }
          } else {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
          }
          if (Math.hypot(p.x - v.cx, p.y - v.cy) > v.V * 1.7) {
            this.projectiles.splice(i, 1);
            continue;
          }
          this.emitTrail(p, dt);
          continue;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        this.emitTrail(p, dt);

        const dx = p.x - v.cx;
        const dy = p.y - v.cy;
        const dist = Math.hypot(dx, dy);
        const prevDist = Math.hypot(p.px - v.cx, p.py - v.cy);

        if (prevDist > S && dist <= S) {
          const f = (prevDist - S) / Math.max(0.0001, prevDist - dist);
          const ix = p.px + (p.x - p.px) * f;
          const iy = p.py + (p.y - p.py) * f;
          const ia = Math.atan2(iy - v.cy, ix - v.cx);
          const d = AG.angDiff(ia, this.angle);
          const angularPad = Math.atan2(p.r, S) * 0.55;
          if (Math.abs(d) <= this.halfWidth + angularPad && this.shieldActive) {
            this.onShieldHit(p, ia, d);
            if (p.reflected) continue;
            this.projectiles.splice(i, 1);
            continue;
          }
        }

        if (dist <= P + p.r * 0.58) {
          if (p.kind === "crystal") this.collectCrystal(p);
          else if (p.kind === "repair") this.collectRepair(p);
          else this.hitPlanet(p);
          this.projectiles.splice(i, 1);
          continue;
        }

        if (dist > v.V * 1.45) {
          this.projectiles.splice(i, 1);
        }
      }
    }

    emitTrail(p, dt) {
      if (p.kind === "crystal" || p.kind === "repair" || p.kind === "orb") {
        p.trailTimer = (p.trailTimer || 0) - dt;
        if (p.trailTimer <= 0) {
          p.trailTimer = 0.06;
          const color = p.kind === "crystal" ? "#5ffbf1" : p.kind === "repair" ? "#8dff9d" : "#ff9a72";
          this.addParticle({
            x: p.x + (Math.random() - 0.5) * p.r,
            y: p.y + (Math.random() - 0.5) * p.r,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12,
            life: 0.45,
            maxLife: 0.45,
            size: p.r * 0.18 + 0.8,
            color: color,
            type: "dot",
            glow: true,
            drag: 2
          });
        }
      }
    }

    onShieldHit(p, ia, d) {
      const v = this.view;
      const perfect = Math.abs(d) < this.halfWidth * 0.44;
      if (p.kind === "crystal" || p.kind === "repair") {
        this.audio("shatter");
        this.spawnBurst(p.x, p.y, {
          count: 10,
          color: p.kind === "crystal" ? "#6ffbf1" : "#8dff9d",
          speed: v.V * 0.22,
          size: 2.2,
          life: 0.55,
          type: "spark"
        });
        return;
      }

      if (this.energy <= 0.01) return;
      const cost = perfect ? 0 : 8;
      if (cost > 0) this.useEnergy(cost);
      else this.energy = Math.min(this.maxEnergy, this.energy + 4);

      this.combo = Math.min(5, this.combo + (perfect ? 0.2 : 0.1));
      this.comboTimer = 4;
      this.runStats.maxCombo = Math.max(this.runStats.maxCombo, this.combo);
      this.runStats.blocked++;
      if (perfect) this.runStats.perfect++;

      if (p.kind === "orb") {
        p.reflected = true;
        p.homing = true;
        p.dmg = perfect ? 2 : 1;
        const a = Math.atan2(p.y - v.cy, p.x - v.cx);
        p.x = v.cx + Math.cos(a) * (v.S + 2);
        p.y = v.cy + Math.sin(a) * (v.S + 2);
        p.vx = Math.cos(a) * v.V * 0.86;
        p.vy = Math.sin(a) * v.V * 0.86;
        this.audio(perfect ? "perfect" : "block", { combo: this.combo });
        this.spawnBurst(p.x, p.y, {
          count: perfect ? 18 : 10,
          color: perfect ? "#ffe9a8" : "#ffb07a",
          speed: v.V * 0.24,
          size: 2.3,
          life: 0.5,
          type: "spark"
        });
        this.addShockwave(p.x, p.y, perfect ? "#ffe9a8" : "#ffb07a", v.V * 0.18, 0.45, 2);
        this.shake = Math.max(this.shake, perfect ? 3.5 : 2);
        this.checkAchievements();
        return;
      }

      this.useEnergy(0);
      const base = perfect ? 250 : 100;
      const gain = Math.round(base * this.combo * this.meta.scoreMul);
      this.score += gain;
      this.popup(p.x, p.y - p.r, "+" + AG.I18N.num(gain), perfect ? "#ffe9a8" : "#dff8ff", perfect ? 19 : 15);
      if (perfect) this.popup(p.x, p.y - p.r - 24, T("perfect"), "#ffe9a8", 11, true);

      this.audio(perfect ? "perfect" : "block", { combo: this.combo });
      this.spawnBurst(p.x, p.y, {
        count: perfect ? 22 : 13,
        color: perfect ? "#ffe9a8" : "#b8d3e3",
        speed: v.V * (perfect ? 0.3 : 0.23),
        size: perfect ? 2.8 : 2.2,
        life: 0.7,
        type: "spark",
        dir: ia
      });
      this.spawnBurst(p.x, p.y, {
        count: 9,
        color: p.kind === "asteroid" ? "#8d7b71" : "#7b93aa",
        speed: v.V * 0.15,
        size: p.r * 0.16,
        life: 0.85,
        type: "shard"
      });
      this.addShockwave(p.x, p.y, perfect ? "#ffe9a8" : "#8fd9ee", v.V * 0.2, 0.48, perfect ? 2.4 : 1.6);
      this.shake = Math.max(this.shake, perfect ? 4.2 : 2.3);
      this.hitFlash = perfect ? 0.25 : 0.12;
      if (perfect) this.hitstop = 0.028;

      if (p.split && p.generation === 0) {
        this.spawnFragments(p, ia);
      }
      this.checkAchievements();
    }

    spawnFragments(p, impactAngle) {
      const v = this.view;
      for (let s = -1; s <= 1; s += 2) {
        const a = impactAngle + Math.PI + s * 0.34 + (Math.random() - 0.5) * 0.08;
        const x = v.cx + Math.cos(a) * v.S * 1.03;
        const y = v.cy + Math.sin(a) * v.S * 1.03;
        const targetA = Math.atan2(v.cy - y, v.cx - x);
        const speed = p.speed * 1.18;
        this.projectiles.push({
          kind: "asteroid",
          split: false,
          generation: 1,
          x: x,
          y: y,
          px: x,
          py: y,
          vx: Math.cos(targetA) * speed,
          vy: Math.sin(targetA) * speed,
          speed: speed,
          r: p.r * 0.56,
          rot: Math.random() * TAU,
          spin: (Math.random() - 0.5) * 2.5,
          variant: (p.variant + 2) % 6,
          reflected: false,
          homing: false,
          dmg: 1,
          trailTimer: 0,
          born: this.time
        });
      }
    }

    useEnergy(cost) {
      if (cost > 0) {
        this.energy -= cost;
        if (this.energy <= 0) {
          this.energy = 0;
          this.triggerOverload();
        }
      }
    }

    triggerOverload() {
      if (this.overload > 0) return;
      this.overload = 1.45;
      this.combo = 1;
      this.comboTimer = 0;
      this.audio("overload");
      this.shake = Math.max(this.shake, 8);
      this.flash = 0.3;
      this.flashColor = "#ff5b63";
      this.addShockwave(this.view.cx, this.view.cy, "#ff6b63", this.view.S * 1.2, 0.6, 3);
      this.setCallout(T("overload"), "#ff9a8d", 2.4);
    }

    hitPlanet(p) {
      const v = this.view;
      this.spawnBurst(p.x, p.y, {
        count: 16,
        color: "#ff7b64",
        speed: v.V * 0.22,
        size: 2.4,
        life: 0.75,
        type: "spark"
      });
      this.addShockwave(p.x, p.y, "#ff7b64", v.V * 0.28, 0.7, 3);
      this.audio("damage");
      this.shake = Math.max(this.shake, 16);
      this.flash = 0.5;
      this.flashColor = "#ff4d5e";
      this.hitstop = 0.07;
      this.damageScars = Math.min(4, this.damageScars + 1);
      if (this.invuln > 0) return;
      this.hp -= 1;
      this.runStats.damage++;
      this.combo = 1;
      this.comboTimer = 0;
      this.invuln = 1.0;
      if (this.hp <= 0) {
        this.hp = 0;
        this.die();
      }
    }

    die() {
      const v = this.view;
      this.state = "dying";
      this.dyingTimer = 1.35;
      this.energy = 0;
      this.shake = 30;
      this.flash = 0.85;
      this.flashColor = "#ff4d5e";
      this.audio("gameover");
      this.spawnBurst(v.cx, v.cy, {
        count: 70,
        color: "#ff9d6c",
        speed: v.V * 0.5,
        size: 3.2,
        life: 1.5,
        type: "spark"
      });
      this.spawnBurst(v.cx, v.cy, {
        count: 26,
        color: "#5b3a3a",
        speed: v.V * 0.22,
        size: 5,
        life: 1.8,
        type: "smoke"
      });
      this.addShockwave(v.cx, v.cy, "#ffb06e", v.V * 1.4, 1.4, 4);
      this.addShockwave(v.cx, v.cy, "#ff5b63", v.V * 0.9, 1.1, 2.5);
    }

    revive() {
      if (!this.boss) this.boss = null;
      this.state = "playing";
      this.deathReported = false;
      this.hp = Math.min(this.maxHP, Math.max(2, Math.floor(this.maxHP * 0.66)));
      this.energy = this.maxEnergy * 0.7;
      this.overload = 0;
      this.invuln = 3.2;
      this.combo = 1;
      this.comboTimer = 0;
      this.dyingTimer = 0;
      this.flash = 0;
      this.shake = 0;
      this.clearProjectiles(false);
      this.banner = {
        title: T("resume"),
        sub: T("hull") + " +" + this.hp,
        life: 1.7,
        maxLife: 1.7,
        color: "#9ffff0"
      };
      this.addShockwave(this.view.cx, this.view.cy, "#8ffff2", this.view.V, 0.9, 2.5);
      this.spawnBurst(this.view.cx, this.view.cy, {
        count: 30,
        color: "#8ffff2",
        speed: this.view.V * 0.35,
        size: 2.5,
        life: 0.8,
        type: "dot",
        glow: true
      });
      this.audio("repair");
    }

    clearProjectiles(withEffects) {
      const v = this.view;
      for (let i = 0; i < this.projectiles.length; i++) {
        const p = this.projectiles[i];
        if (withEffects) {
          this.spawnBurst(p.x, p.y, {
            count: 5,
            color: p.kind === "crystal" ? "#6ffbf1" : "#8fb2c9",
            speed: v.V * 0.13,
            size: 1.8,
            life: 0.4,
            type: "spark"
          });
        }
      }
      this.projectiles.length = 0;
    }

    collectCrystal(p) {
      const v = this.view;
      this.runStats.crystals++;
      this.energy = Math.min(this.maxEnergy, this.energy + 34);
      const gain = Math.round(150 * this.combo * this.meta.scoreMul);
      this.score += gain;
      this.popup(p.x, p.y - 8, "+" + AG.I18N.num(gain), "#8ffff2", 17);
      this.popup(p.x, p.y - 34, T("energy") + " +34", "#b7fff8", 11, true);
      this.audio("crystal");
      this.spawnBurst(p.x, p.y, {
        count: 20,
        color: "#6ffbf1",
        speed: v.V * 0.28,
        size: 2.2,
        life: 0.8,
        type: "dot",
        glow: true
      });
      this.addShockwave(p.x, p.y, "#6ffbf1", v.V * 0.24, 0.6, 2);
      this.shake = Math.max(this.shake, 3);
      this.checkAchievements();
    }

    collectRepair(p) {
      const v = this.view;
      this.runStats.repairs++;
      let text;
      if (this.hp < this.maxHP) {
        this.hp = Math.min(this.maxHP, this.hp + 1);
        text = T("hull") + " +1";
      } else {
        const gain = Math.round(250 * this.meta.scoreMul);
        this.score += gain;
        text = "+" + AG.I18N.num(gain);
      }
      this.popup(p.x, p.y - 10, text, "#b6ffb8", 15);
      this.audio("repair");
      this.spawnBurst(p.x, p.y, {
        count: 22,
        color: "#8dff9d",
        speed: v.V * 0.28,
        size: 2.4,
        life: 0.8,
        type: "dot",
        glow: true
      });
      this.addShockwave(p.x, p.y, "#8dff9d", v.V * 0.24, 0.6, 2);
      this.checkAchievements();
    }

    hitBoss(p) {
      const b = this.boss;
      if (!b) return;
      const v = this.view;
      b.hp -= p.dmg;
      b.hitFlash = 1;
      const gain = Math.round(300 * p.dmg * this.combo * this.meta.scoreMul);
      this.score += gain;
      this.popup(b.x, b.y - b.r, "+" + AG.I18N.num(gain), "#ffd9a0", 17);
      this.audio("bossHit");
      this.spawnBurst(p.x, p.y, {
        count: 18,
        color: "#ffd9a0",
        speed: v.V * 0.3,
        size: 2.6,
        life: 0.65,
        type: "spark"
      });
      this.addShockwave(p.x, p.y, "#ffd9a0", v.V * 0.2, 0.5, 2);
      this.shake = Math.max(this.shake, 6);
      this.hitFlash = 0.18;
      if (b.hp <= 0) this.defeatBoss();
      this.checkAchievements();
    }

    defeatBoss() {
      const b = this.boss;
      if (!b) return;
      const v = this.view;
      this.boss = null;
      this.runStats.bossKills++;
      const gain = Math.round(2500 * this.meta.scoreMul);
      this.score += gain;
      this.hp = Math.min(this.maxHP, this.hp + 1);
      this.energy = Math.min(this.maxEnergy, this.energy + this.maxEnergy * 0.35);
      this.audio("bossDown");
      this.shake = 22;
      this.flash = 0.35;
      this.flashColor = "#ffcf6b";
      this.hitstop = 0.06;
      this.spawnBurst(b.x, b.y, {
        count: 80,
        color: "#ffb36b",
        speed: v.V * 0.5,
        size: 3.4,
        life: 1.3,
        type: "spark"
      });
      this.spawnBurst(b.x, b.y, {
        count: 30,
        color: "#ff7c8e",
        speed: v.V * 0.26,
        size: 4.2,
        life: 1.4,
        type: "smoke"
      });
      this.addShockwave(b.x, b.y, "#ffcf6b", v.V * 0.8, 1.1, 4);
      this.addShockwave(b.x, b.y, "#ff7c8e", v.V * 1.2, 1.3, 2);
      this.popup(b.x, b.y, "+" + AG.I18N.num(gain), "#ffe9a8", 22);
      this.clearProjectiles(true);
      this.waveState = "bossClear";
      this.bossClearTimer = 1.5;
      this.banner = {
        title: T("bossDown"),
        sub: T("waveBonus", { n: AG.I18N.num(gain) }),
        life: 1.9,
        maxLife: 1.9,
        color: "#ffe9a8"
      };
      this.checkAchievements();
    }

    checkAchievements() {
      if (!this.app.unlockAchievement) return;
      const a = this.app.unlockAchievement.bind(this.app);
      if (this.runStats.blocked >= 1) a("first_block");
      if (this.wave >= 5) a("wave5");
      if (this.wave >= 10) a("wave10");
      if (this.combo >= 2) a("combo");
      if (this.runStats.perfect >= 5) a("perfect");
      if (this.runStats.crystals >= 10) a("crystals");
      if (this.runStats.bossKills >= 1) a("boss");
      if (this.score >= 5000) a("score5k");
      if (this.score >= 20000) a("score20k");
      if (this.app.save.runs >= 10) a("runs10");
    }

    getResult() {
      return {
        score: Math.floor(this.score),
        wave: this.wave,
        stats: {
          blocked: this.runStats.blocked,
          perfect: this.runStats.perfect,
          crystals: this.runStats.crystals,
          repairs: this.runStats.repairs,
          bossKills: this.runStats.bossKills,
          damage: this.runStats.damage,
          maxCombo: this.runStats.maxCombo
        },
        dustTotal: AG.Save.dustForRun(this.score, this.wave, this.runStats.crystals, this.runStats.bossKills)
      };
    }

    setCallout(text, color, life) {
      this.callout = { text: text, color: color || "#dff8ff", life: life || 3, maxLife: life || 3 };
    }

    audio(name, opts) {
      AG.Audio.play(name, opts);
    }

    popup(x, y, text, color, size, spaced) {
      this.popups.push({
        x: x,
        y: y,
        text: text,
        color: color || "#fff",
        size: size || 15,
        spaced: !!spaced,
        life: 0.95,
        maxLife: 0.95,
        vy: -36
      });
      if (this.popups.length > 40) this.popups.shift();
    }

    addParticle(p) {
      if (this.particles.length > 620) this.particles.shift();
      this.particles.push(p);
    }

    spawnBurst(x, y, opts) {
      const o = opts || {};
      const count = o.count || 12;
      const baseDir = o.dir === undefined ? Math.random() * TAU : o.dir;
      const spread = o.spread === undefined ? Math.PI * 2 : o.spread;
      for (let i = 0; i < count; i++) {
        const a = baseDir + (Math.random() - 0.5) * spread;
        const s = (o.speed || 100) * (0.25 + Math.random() * 0.95);
        this.addParticle({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: (o.life || 0.7) * (0.6 + Math.random() * 0.7),
          maxLife: o.life || 0.7,
          size: (o.size || 2) * (0.6 + Math.random() * 0.8),
          color: o.color || "#fff",
          type: o.type || "spark",
          glow: !!o.glow,
          drag: o.drag === undefined ? 1.8 : o.drag,
          rot: Math.random() * TAU,
          spin: (Math.random() - 0.5) * 8
        });
      }
    }

    addShockwave(x, y, color, maxR, life, width) {
      this.shockwaves.push({
        x: x,
        y: y,
        color: color,
        maxR: maxR,
        life: life,
        maxLife: life,
        width: width || 2
      });
      if (this.shockwaves.length > 18) this.shockwaves.shift();
    }

    updateParticles(dt) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
        const drag = Math.max(0, 1 - p.drag * dt);
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.spin * dt;
        if (p.type === "shard") p.vy += 26 * dt;
      }
      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const s = this.shockwaves[i];
        s.life -= dt;
        if (s.life <= 0) this.shockwaves.splice(i, 1);
      }
      for (let i = this.popups.length - 1; i >= 0; i--) {
        const p = this.popups[i];
        p.life -= dt;
        if (p.life <= 0) {
          this.popups.splice(i, 1);
          continue;
        }
        p.y += p.vy * dt;
        p.vy *= 0.94;
      }
    }

    /* ------------------------------ render --------------------------- */

    renderWorld(ctx) {
      const v = this.app.view;
      this.view = v;
      const shake = this.shake;
      ctx.save();
      if (shake > 0) {
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      }

      this.drawGuides(ctx, v);

      if (this.state === "idle") {
        ctx.restore();
        return;
      }

      if (!this.boss) {
        // Planet and atmosphere
      }
      AG.Art.drawPlanet(ctx, v.cx, v.cy, v.P, this.time, { glow: 1.9, moons: 0 });

      if (this.damageScars > 0) {
        ctx.save();
        ctx.globalAlpha = 0.22 + 0.12 * Math.sin(this.time * 2.2);
        for (let i = 0; i < this.damageScars; i++) {
          const a = i * 2.1 + 0.5;
          ctx.beginPath();
          ctx.arc(v.cx, v.cy, v.P * (1.02 + i * 0.035), a, a + 0.65);
          ctx.strokeStyle = "#ff6d53";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
        ctx.restore();
      }

      if (this.boss) this.drawBoss(ctx, v);

      for (let i = 0; i < this.projectiles.length; i++) {
        this.drawProjectile(ctx, this.projectiles[i], v);
      }

      AG.Art.drawShield(ctx, v.cx, v.cy, v.S, this.angle, this.halfWidth, {
        time: this.time,
        energy: this.maxEnergy ? this.energy / this.maxEnergy : 0,
        active: this.shieldActive,
        perfectColor: "#ffe9a8",
        energyRing: false
      });

      this.drawShockwaves(ctx);
      this.drawParticles(ctx);
      this.drawPopups(ctx);

      if (this.state === "dying") {
        const t = 1 - Math.max(0, this.dyingTimer) / 1.35;
        ctx.save();
        ctx.globalAlpha = 0.5 * (1 - t);
        ctx.fillStyle = "#ffb06e";
        ctx.fillRect(0, 0, v.w, v.h);
        ctx.restore();
      }

      ctx.restore();

      if (this.flash > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(0.65, this.flash * 0.7);
        ctx.fillStyle = this.flashColor;
        ctx.fillRect(0, 0, v.w, v.h);
        ctx.restore();
      }
    }

    drawGuides(ctx, v) {
      ctx.save();
      const haze = ctx.createRadialGradient(v.cx, v.cy, v.V * 0.1, v.cx, v.cy, v.V * 1.22);
      haze.addColorStop(0, "rgba(32, 148, 150, 0.055)");
      haze.addColorStop(0.55, "rgba(27, 95, 124, 0.025)");
      haze.addColorStop(1, "rgba(8, 30, 52, 0)");
      ctx.fillStyle = haze;
      ctx.fillRect(v.cx - v.V * 1.3, v.cy - v.V * 1.3, v.V * 2.6, v.V * 2.6);
      ctx.translate(v.cx, v.cy);
      ctx.strokeStyle = "rgba(94, 170, 196, 0.085)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 9]);
      ctx.beginPath();
      ctx.arc(0, 0, v.S * 0.66, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, v.S, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = "rgba(94, 170, 196, 0.045)";
      ctx.beginPath();
      ctx.arc(0, 0, v.V * 0.82, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = "rgba(94, 170, 196, 0.032)";
      ctx.beginPath();
      ctx.arc(0, 0, v.V, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(120, 210, 225, 0.14)";
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU;
        const r1 = v.S * (i % 3 === 0 ? 1.065 : 1.04);
        const r2 = v.S * 1.085;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawBoss(ctx, v) {
      const b = this.boss;
      if (!b) return;
      if (b.telegraph > 0) {
        ctx.save();
        ctx.globalAlpha = 0.14 + 0.15 * Math.sin(this.time * 22);
        ctx.strokeStyle = "#ff9a72";
        ctx.lineWidth = 1.4;
        ctx.setLineDash([6, 12]);
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(v.cx, v.cy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }
      AG.Art.drawBoss(ctx, b.x, b.y, b.r, this.time, b.hp / b.maxHp, b.telegraph > 0);
      if (b.hitFlash > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = b.hitFlash * 0.5;
        ctx.fillStyle = "#ffe1a8";
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 1.05, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
    }

    drawProjectile(ctx, p, v) {
      const speed = Math.hypot(p.vx, p.vy) || 1;
      const tx = p.x - (p.vx / speed) * (p.homing ? 40 : 26);
      const ty = p.y - (p.vy / speed) * (p.homing ? 40 : 26);
      if (p.kind === "crystal") {
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.strokeStyle = "#5ffbf1";
        ctx.lineWidth = p.r * 0.55;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.restore();
        AG.Art.drawCrystal(ctx, p.x, p.y, p.r, p.rot, this.time);
      } else if (p.kind === "repair") {
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.strokeStyle = "#8dff9d";
        ctx.lineWidth = p.r * 0.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.restore();
        AG.Art.drawRepair(ctx, p.x, p.y, p.r, this.time);
      } else if (p.kind === "orb") {
        ctx.save();
        ctx.globalAlpha = 0.28;
        ctx.strokeStyle = p.reflected ? "#ffe9a8" : "#ff7b64";
        ctx.lineWidth = p.r * 0.8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.restore();
        AG.Art.drawOrb(ctx, p.x, p.y, p.r, this.time);
        if (p.reflected) {
          ctx.save();
          ctx.strokeStyle = "rgba(255, 233, 168, 0.8)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 1.7, 0, TAU);
          ctx.stroke();
          ctx.restore();
        }
      } else {
        ctx.save();
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = p.split ? "#ff9a72" : "#7fc7e8";
        ctx.lineWidth = p.r * 0.65;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.restore();
        AG.Art.drawRock(ctx, p.x, p.y, p.r, p.rot, { split: p.split, variant: p.variant });
      }
      if (this.invuln > 0 && this.state === "playing") {
        // subtle marker that the planet is currently protected after a hit
      }
    }

    drawParticles(ctx) {
      ctx.save();
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        const a = Math.max(0, p.life / p.maxLife);
        if (a <= 0) continue;
        if (p.type === "spark") {
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = a;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(0.8, p.size * a);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
          ctx.stroke();
        } else if (p.type === "dot") {
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = a;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, p.size * a), 0, TAU);
          ctx.fill();
          if (p.glow && a > 0.35) {
            AG.Art.drawGlow(ctx, p.color, p.x, p.y, p.size * 7, a * 0.3);
          }
        } else if (p.type === "shard") {
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = a;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size, -p.size * 0.4, p.size * 2, p.size * 0.8);
          ctx.restore();
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = a * 0.18;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1.7 - a * 0.7), 0, TAU);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    drawShockwaves(ctx) {
      ctx.save();
      for (let i = 0; i < this.shockwaves.length; i++) {
        const s = this.shockwaves[i];
        const t = 1 - s.life / s.maxLife;
        const r = s.maxR * AG.easeOutCubic(t);
        const a = (1 - t) * (1 - t);
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = a * 0.55;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = Math.max(0.6, s.width * (1 - t));
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, TAU);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawPopups(ctx) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < this.popups.length; i++) {
        const p = this.popups[i];
        const a = Math.min(1, p.life / 0.35);
        ctx.globalAlpha = a;
        ctx.font = "700 " + p.size + "px 'Exo 2', 'Segoe UI', sans-serif";
        ctx.fillStyle = p.color;
        ctx.strokeStyle = "rgba(2, 8, 18, 0.7)";
        ctx.lineWidth = 3;
        if (p.spaced) {
          AG.Art.spacedText(ctx, p.text, p.x, p.y, 1.4, "center");
        } else {
          ctx.strokeText(p.text, p.x, p.y);
          ctx.fillText(p.text, p.x, p.y);
        }
      }
      ctx.restore();
    }

    resizeView(oldV, newV) {
      if (!oldV || !newV) { this.view = newV; return; }
      if (Math.abs(oldV.V - newV.V) < 0.5 && Math.abs(oldV.cx - newV.cx) < 0.5 && Math.abs(oldV.cy - newV.cy) < 0.5) {
        this.view = newV;
        return;
      }
      const k = newV.V / Math.max(1, oldV.V);
      const mapX = function (x) { return newV.cx + (x - oldV.cx) * k; };
      const mapY = function (y) { return newV.cy + (y - oldV.cy) * k; };
      for (let i = 0; i < this.projectiles.length; i++) {
        const p = this.projectiles[i];
        p.x = mapX(p.x);
        p.y = mapY(p.y);
        p.px = mapX(p.px);
        p.py = mapY(p.py);
        p.vx *= k;
        p.vy *= k;
        p.speed *= k;
        p.r *= k;
      }
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.x = mapX(p.x);
        p.y = mapY(p.y);
        p.vx *= k;
        p.vy *= k;
        p.size *= k;
      }
      for (let i = 0; i < this.popups.length; i++) {
        this.popups[i].x = mapX(this.popups[i].x);
        this.popups[i].y = mapY(this.popups[i].y);
      }
      for (let i = 0; i < this.shockwaves.length; i++) {
        this.shockwaves[i].x = mapX(this.shockwaves[i].x);
        this.shockwaves[i].y = mapY(this.shockwaves[i].y);
        this.shockwaves[i].maxR *= k;
      }
      if (this.boss) {
        this.boss.r *= k;
        this.boss.dist *= k;
        this.boss.x = mapX(this.boss.x);
        this.boss.y = mapY(this.boss.y);
      }
      this.view = newV;
    }

    /* Debug helpers, used by automated tests. */
    debugSpawn(kind, angle) {
      return this.spawnObject(kind || "asteroid", { angle: angle });
    }

    debugAim(angle) {
      this.angle = AG.angNorm(angle);
      this.targetAngle = this.angle;
    }

    debugStep(seconds) {
      const steps = Math.max(1, Math.round(seconds * 120));
      for (let i = 0; i < steps; i++) this.update(1 / 120);
    }
  }

  AG.Game = Game;
})();

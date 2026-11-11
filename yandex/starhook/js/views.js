// HTML-представления экранов и модальных окон. Без побочных эффектов.

import {
  ACHIEVEMENTS,
  BAITS,
  CONSTELLATIONS,
  DAILY_GIFTS,
  LOCATIONS,
  LOCATION_BY_ID,
  QUESTS,
  RANKS,
  RARITIES,
  UPGRADES
} from './data.js';
import { FISH, FISH_BY_ID } from './fish.js';
import {
  achievementView,
  collectionCount,
  collectionProgress,
  dailyView,
  guardianCount,
  guardianStatus,
  giftView,
  levelXpNeed,
  locationProgress,
  nextLevelProgress,
  questView,
  rankForLevel,
  upgradeCost,
  upgradeEffect
} from './core.js';
import { t, tData, formatNumber, formatWeight, formatCountdown } from './i18n.js';
import { icon } from './icons.js';

export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[ch]));

export function fishName(fish) {
  return esc(tData(fish?.name, '???'));
}

export function rarityTag(rarityId, extraClass = '') {
  const rarity = RARITIES[rarityId] || RARITIES.common;
  return `<span class="rarity-tag ${extraClass}" style="--rarity:${rarity.color}"><span class="rarity-dot"></span>${esc(tData(rarity.label))}</span>`;
}

export function rewardChips(reward = {}, compact = false) {
  const chips = [];
  if (reward.sparks) {
    chips.push(`<span class="reward-chip"><span class="icon">${icon('spark')}</span>${formatNumber(reward.sparks)}</span>`);
  }
  if (reward.xp) {
    chips.push(`<span class="reward-chip xp"><span class="icon">${icon('star')}</span>${formatNumber(reward.xp)} ${esc(t('common.xp'))}</span>`);
  }
  if (reward.shards) {
    chips.push(`<span class="reward-chip lav"><span class="icon">${icon('shard')}</span>${formatNumber(reward.shards)}</span>`);
  }
  return chips.length ? `<span class="reward-row">${chips.join('')}</span>` : '';
}

function goalLabel(goal) {
  const n = goal.target ?? goal.count ?? 1;
  switch (goal.type) {
    case 'totalCatch':
      return t('goal.totalCatch', { n });
    case 'species':
      return t('goal.species', { n });
    case 'perfectCast':
      return t('goal.perfectCast', { n });
    case 'rareCatch':
      return t('goal.rare', { n });
    case 'locCatch':
      return t('goal.locCatch', {
        n,
        loc: esc(tData(LOCATION_BY_ID[goal.loc]?.name, goal.loc))
      });
    case 'perfectReel':
      return t('goal.perfectReel', { n });
    case 'guardian': {
      const fish = FISH_BY_ID[goal.fish];
      return t('goal.guardian', { name: fish ? fishName(fish) : '???' });
    }
    default:
      return '';
  }
}

function statBox(label, value, sub = '') {
  return `<div class="stat-box"><span>${esc(label)}</span><b>${value}</b>${sub ? `<small class="tiny">${esc(sub)}</small>` : ''}</div>`;
}

function progressLine(current, target) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  return `<span class="progress-line"><span style="width:${pct}%"></span></span>`;
}

function bestCatchText(state) {
  const best = state.stats.bestFish ? FISH_BY_ID[state.stats.bestFish.id] : null;
  if (!best) return t('common.unknown');
  return `${fishName(best)} · ${formatWeight(state.stats.bestWeight)}`;
}

// ── Улов ───────────────────────────────────────────────────────────────────

export function catchView(summary, { adsAvailable = false } = {}) {
  const fish = summary.fish;
  const rarity = RARITIES[fish.rarity] || RARITIES.common;
  const badges = [];
  if (summary.isNew) {
    badges.push(`<span class="catch-new-badge"><span class="icon">${icon('sparkles')}</span>${esc(t('catch.new'))}</span>`);
  } else {
    badges.push('');
  }
  if (summary.isRecord) {
    badges.push(`<span class="catch-record-badge"><span class="icon">${icon('trophy')}</span>${esc(t('catch.record'))}</span>`);
  } else {
    badges.push('');
  }
  const bonusNote = summary.perfect
    ? `<p class="catch-bonus-note"><span class="icon">${icon('check')}</span>${esc(t('catch.perfectBonus'))}</p>`
    : summary.isNew
      ? `<p class="catch-bonus-note"><span class="icon">${icon('sparkles')}</span>${esc(t('catch.firstBonus'))}</p>`
      : '';

  return `
    <div class="catch-layout">
      <div class="catch-portrait-wrap" style="--rarity:${rarity.color}">
        <canvas id="catch-portrait" data-portrait-fish="${fish.id}" aria-label="${fishName(fish)}"></canvas>
        <div class="catch-portrait-badges">${badges[0] || '<span></span>'}${badges[1] || '<span></span>'}</div>
      </div>
      <div class="catch-info">
        <div class="reward-row">
          ${rarityTag(fish.rarity)}
          ${summary.guardianCaught ? `<span class="rarity-tag" style="--rarity:${RARITIES.legendary.color}"><span class="rarity-dot"></span>${esc(t('catch.guardian'))}</span>` : ''}
        </div>
        <h3>${fishName(fish)}</h3>
        <p class="catch-lore">«${esc(tData(fish.lore))}»</p>
        <div class="catch-stats">
          <div class="catch-stat"><span>${esc(t('catch.weight'))}</span><b>${formatWeight(summary.weight)}</b></div>
          <div class="catch-stat"><span>${esc(t('catch.value'))}</span><b id="catch-value">${formatNumber(summary.value)}</b></div>
          <div class="catch-stat"><span>${esc(t('catch.xp'))}</span><b>+${formatNumber(summary.xp)}</b></div>
        </div>
        ${bonusNote}
        <div class="catch-actions">
          <button class="btn btn-primary" type="button" data-action="catch-keep">
            <span class="icon">${icon('check')}</span>${esc(t('catch.keep'))}
          </button>
          ${adsAvailable ? `<button class="btn btn-ad" type="button" data-action="catch-double">
            <span class="icon">${icon('ad')}</span>${esc(t('catch.doubleShort'))}
          </button>` : ''}
        </div>
        <p class="tiny" style="margin-top:8px">${esc(t('catch.sellNote'))}</p>
      </div>
    </div>
  `;
}

// ── Журнал ─────────────────────────────────────────────────────────────────

export function questsView(state, tab = 'story') {
  const story = questView(state);
  const daily = dailyView(state);
  const tabs = `
    <div class="tabs" role="tablist">
      <button class="tab ${tab === 'story' ? 'active' : ''}" type="button" data-action="quest-tab" data-id="story" role="tab">${esc(t('quest.story'))}</button>
      <button class="tab ${tab === 'daily' ? 'active' : ''}" type="button" data-action="quest-tab" data-id="daily" role="tab">${esc(t('quest.daily'))}</button>
    </div>
  `;

  if (tab === 'daily') {
    const resetMs = (() => {
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2);
      return next.getTime() - now.getTime();
    })();
    const tasks = daily.tasks.map((task) => {
      const complete = task.complete;
      return `
        <div class="daily-task ${complete ? 'done' : ''}">
          <span class="daily-check">${complete ? icon('check') : ''}</span>
          <div class="daily-task-copy">
            <b>${esc(tData(task.text))}</b>
            <small>${formatNumber(task.current)} / ${formatNumber(task.target)}</small>
            ${progressLine(task.current, task.target)}
          </div>
          ${complete && !task.claimed
            ? `<button class="shop-buy" type="button" data-action="claim-daily" data-id="${task.id}">${esc(t('quest.claim'))}</button>`
            : `<span class="reward-chip">${icon('spark')}${formatNumber(task.reward)}</span>`}
        </div>
      `;
    }).join('');
    return `
      ${tabs}
      <div class="quest-story" style="border-color:rgba(159,232,208,.16)">
        <div class="quest-story-head">
          <span class="quest-story-icon" style="color:var(--mint)">${icon('calendar')}</span>
          <div>
            <span class="quest-chapter">${esc(t('quest.daily'))}</span>
            <h3>${esc(t('quest.daily'))}</h3>
          </div>
        </div>
        <p>${esc(t('quest.daily'))} · ${esc(t('gift.streak', { n: daily.streak || 1 }))}</p>
        <div class="daily-list">${tasks || `<div class="empty-state">${esc(t('common.empty'))}</div>`}</div>
        <div class="daily-reset">${esc(t('quest.dailyReset', { time: formatCountdown(resetMs) }))}</div>
        ${daily.allDone && !daily.bonus
          ? `<div class="daily-bonus">
              <div class="daily-bonus-copy"><b>${esc(t('quest.bonus'))}</b><small>${esc(t('quest.dailyBonus'))}</small></div>
              <button class="shop-buy" type="button" data-action="claim-daily-bonus">${esc(t('quest.claim'))}</button>
            </div>`
          : daily.bonus
            ? `<div class="daily-bonus"><div class="daily-bonus-copy"><b>${esc(t('quest.bonusClaimed'))}</b><small>${esc(t('quest.tomorrow'))}</small></div><span class="reward-chip lav">${icon('shard')}+1</span></div>`
            : ''}
      </div>
      <button class="btn btn-secondary" style="width:100%;flex-direction:row;min-height:46px" type="button" data-action="open-gift">
        <span class="icon">${icon('gift')}</span>${esc(t('menu.daily'))}
      </button>
    `;
  }

  if (!story) {
    return `
      ${tabs}
      <div class="empty-state">
        ${icon('constellation')}
        <p>${esc(t('quest.freePlay'))}</p>
        <p class="tiny">${esc(t('col.allCaught'))}</p>
      </div>
      <div class="stat-grid">
        ${statBox(t('stats.catches'), formatNumber(state.stats.catches))}
        ${statBox(t('stats.species'), `${collectionCount(state)} / ${FISH.length}`)}
        ${statBox(t('stats.guardians'), `${guardianCount(state)} / ${LOCATIONS.length}`)}
        ${statBox(t('stats.best'), formatWeight(state.stats.bestWeight))}
      </div>
    `;
  }

  const goals = story.goals.map((goal) => `
    <div class="quest-goal">
      <span class="quest-goal-label">${goalLabel(goal)}</span>
      ${progressLine(goal.current, goal.target)}
      <span class="quest-goal-count">${formatNumber(goal.current)} / ${formatNumber(goal.target)}</span>
    </div>
  `).join('');

  const unlockName = story.quest.unlock
    ? esc(tData(LOCATION_BY_ID[story.quest.unlock]?.name, story.quest.unlock))
    : '';

  return `
    ${tabs}
    <div class="quest-story">
      <div class="quest-story-head">
        <span class="quest-story-icon">${icon('quest')}</span>
        <div style="flex:1">
          <span class="quest-chapter">${esc(t('quest.storyProgress', { n: story.index + 1, m: story.total }))}</span>
          <h3>${esc(tData(story.quest.title))}</h3>
        </div>
        ${story.complete ? `<span class="rarity-tag" style="--rarity:var(--gold)"><span class="rarity-dot"></span>${esc(t('quest.completed'))}</span>` : ''}
      </div>
      <p>${esc(tData(story.quest.text))}</p>
      ${goals}
      ${unlockName ? `<p class="catch-bonus-note" style="color:var(--mint)"><span class="icon">${icon('map')}</span>${esc(t('quest.unlock', { name: unlockName }))}</p>` : ''}
      <div class="quest-story-foot">
        <div>${rewardChips(story.quest.reward)}</div>
        ${story.complete
          ? `<button class="btn btn-primary" type="button" data-action="claim-story"><span class="icon">${icon('gift')}</span>${esc(t('quest.claim'))}</button>`
          : `<span class="tiny">${esc(t('quest.ready'))}</span>`}
      </div>
    </div>
  `;
}

// ── Магазин ────────────────────────────────────────────────────────────────

export function shopView(state, tab = 'upgrades') {
  const tabs = `
    <div class="tabs" role="tablist">
      <button class="tab ${tab === 'upgrades' ? 'active' : ''}" type="button" data-action="shop-tab" data-id="upgrades">${esc(t('shop.upgrades'))}</button>
      <button class="tab ${tab === 'baits' ? 'active' : ''}" type="button" data-action="shop-tab" data-id="baits">${esc(t('shop.baits'))}</button>
    </div>
  `;

  if (tab === 'baits') {
    const cards = BAITS.map((bait) => {
      const owned = state.baits.includes(bait.id);
      const active = state.bait === bait.id;
      const locked = state.level < bait.unlockLevel;
      const effects = [];
      if (bait.effects.rare) effects.push(`+${Math.round(bait.effects.rare * 100)}% ${esc(t('bait.rare'))}`);
      if (bait.effects.weight) effects.push(`+${Math.round(bait.effects.weight * 100)}% ${esc(t('bait.weight'))}`);
      if (bait.effects.bite < 1) effects.push(`−${Math.round((1 - bait.effects.bite) * 100)}% ${esc(t('bait.bite'))}`);
      if (bait.effects.zone) effects.push(`+${Math.round(bait.effects.zone * 100)}% ${esc(t('bait.zone'))}`);
      const price = bait.cost ? `<span class="shop-price">${icon('spark')}${formatNumber(bait.cost)}</span>` : `<span class="shop-price">${esc(t('common.free'))}</span>`;
      let button;
      if (active) button = `<button class="shop-buy equip" type="button" disabled>${esc(t('bait.active'))}</button>`;
      else if (owned) button = `<button class="shop-buy equip" type="button" data-action="equip-bait" data-id="${bait.id}">${esc(t('bait.equip'))}</button>`;
      else if (locked) button = `<button class="shop-buy" type="button" disabled>${esc(t('shop.unlockLevel', { n: bait.unlockLevel }))}</button>`;
      else button = `<button class="shop-buy" type="button" data-action="buy-bait" data-id="${bait.id}" ${state.sparks < bait.cost ? 'disabled' : ''}>${esc(t('bait.buy', { n: formatNumber(bait.cost) }))}</button>`;
      return `
        <div class="bait-tile ${active ? 'active' : ''} ${locked && !owned ? 'locked' : ''}">
          <div class="bait-head">
            <span class="bait-icon">${icon('lure')}</span>
            <div style="flex:1">
              <h4>${esc(tData(bait.name))}</h4>
              <small>${esc(tData(bait.short))}</small>
            </div>
            ${active ? `<span class="rarity-tag" style="--rarity:var(--mint)"><span class="rarity-dot"></span>${esc(t('bait.selected'))}</span>` : ''}
          </div>
          <p>${esc(tData(bait.desc))}</p>
          <div class="bait-effects">${effects.map((e) => `<span class="effect-pill">${e}</span>`).join('')}</div>
          <div class="bait-price-row">${price}${button}</div>
        </div>
      `;
    }).join('');
    return `${tabs}<div class="bait-grid">${cards}</div><p class="tiny" style="margin-top:10px">${esc(t('shop.baitNote'))}</p>`;
  }

  const cards = UPGRADES.map((upgrade) => {
    const level = state.upgrades[upgrade.id] || 1;
    const cost = upgradeCost(upgrade.id, level);
    const max = level >= upgrade.max;
    const effectPct = Math.round(upgradeEffect(upgrade.id, level) * 100);
    const nextPct = Math.round(upgradeEffect(upgrade.id, level + 1) * 100);
    let effectText;
    if (upgrade.id === 'rod') effectText = t('shop.rodStat', { n: effectPct });
    else if (upgrade.id === 'line') effectText = t('shop.lineStat', { n: effectPct });
    else if (upgrade.id === 'lure') effectText = t('shop.lureStat', { n: effectPct });
    else effectText = t('shop.lanternStat', { n: effectPct, m: effectPct });
    const nextText = !max
      ? upgrade.id === 'lantern'
        ? t('shop.lanternStat', { n: nextPct, m: nextPct })
        : t(`shop.${upgrade.id}Stat`, { n: nextPct })
      : '';
    const dots = Array.from({ length: upgrade.max }, (_, i) => `<i class="${i < level ? 'on' : ''}"></i>`).join('');
    return `
      <div class="shop-card ${max ? 'maxed' : ''}">
        <div class="shop-card-top">
          <span class="shop-icon">${icon(upgrade.icon)}</span>
          <div>
            <h4>${esc(tData(upgrade.name))}</h4>
            <small>${esc(tData(upgrade.label))}</small>
          </div>
          <span class="rarity-tag" style="--rarity:var(--gold)"><span class="rarity-dot"></span>${level}</span>
        </div>
        <p class="shop-desc">${esc(tData(upgrade.desc))}</p>
        <div class="level-dots">${dots}</div>
        <div class="shop-foot">
          <div>
            <span class="tiny"><b>${esc(t('shop.current'))}:</b> ${esc(effectText)}</span>
            ${nextText ? `<span class="tiny" style="display:block">→ ${esc(nextText)}</span>` : ''}
          </div>
          ${max
            ? `<button class="shop-buy" type="button" disabled>${esc(t('shop.max'))}</button>`
            : `<button class="shop-buy" type="button" data-action="buy-upgrade" data-id="${upgrade.id}" ${state.sparks < cost ? 'disabled' : ''}>
                ${icon('spark')} ${formatNumber(cost)}
              </button>`}
        </div>
      </div>
    `;
  }).join('');

  return `${tabs}<div class="shop-grid">${cards}</div><p class="tiny" style="margin-top:10px">${esc(t('shop.upgradeNote'))}</p>`;
}

// ── Коллекция ──────────────────────────────────────────────────────────────

export function collectionView(state, filter = 'all') {
  const total = collectionProgress(state);
  const filters = [
    `<button class="${filter === 'all' ? 'active' : ''}" type="button" data-action="filter-collection" data-id="all">${esc(t('col.filterAll'))}</button>`,
    ...LOCATIONS.map((loc) => `<button class="${filter === loc.id ? 'active' : ''}" type="button" data-action="filter-collection" data-id="${loc.id}">${esc(tData(loc.name))}</button>`)
  ].join('');
  const list = filter === 'all' ? FISH : FISH.filter((f) => f.loc === filter);
  const tiles = list.map((fish) => {
    const caught = state.species[fish.id];
    const rarity = RARITIES[fish.rarity];
    return `
      <button class="fish-tile ${caught ? '' : 'locked'}" type="button" data-action="fish-detail" data-id="${fish.id}">
        <span class="rarity-dot" style="--rarity:${rarity.color}"></span>
        ${caught && caught.firstAt > Date.now() - 1000 * 60 * 60 * 24 * 2 ? `<span class="fish-new">${esc(t('col.newBadge'))}</span>` : ''}
        <canvas data-thumb-fish="${fish.id}" aria-hidden="true"></canvas>
        ${caught ? '' : `<span class="locked-mark" aria-hidden="true">?</span>`}
        <span class="fish-tile-meta">
          <b>${caught ? fishName(fish) : '???'}</b>
          <small><span>${caught ? rarityTag(fish.rarity) : esc(t('col.unknown'))}</span><span>${caught ? formatWeight(caught.best) : '—'}</span></small>
        </span>
      </button>
    `;
  }).join('');

  return `
    <div class="collection-head">
      <div class="collection-progress">
        ${progressLine(total.caught, total.total)}
        <b>${total.caught} / ${total.total}</b>
      </div>
      <span class="tiny">${esc(t('col.percent', { n: Math.round((total.caught / total.total) * 100) }))}</span>
    </div>
    <div class="segmented">${filters}</div>
    <div class="fish-grid">${tiles || `<div class="empty-state">${esc(t('col.noFish'))}</div>`}</div>
    <p class="tiny" style="margin-top:10px">${esc(t('col.unknownLore'))}</p>
  `;
}

export function fishDetailView(state, fish) {
  const caught = state.species[fish.id];
  const rarity = RARITIES[fish.rarity];
  return `
    <div class="fish-detail">
      <div class="fish-detail-art" style="--rarity:${rarity.color}">
        <canvas data-portrait-fish="${fish.id}" data-unknown="${caught ? '0' : '1'}" aria-label="${fishName(fish)}"></canvas>
      </div>
      <div class="fish-detail-info">
        ${rarityTag(fish.rarity)}
        <h3>${caught ? fishName(fish) : esc(t('col.unknown'))}</h3>
        <p class="fish-detail-lore">«${esc(caught ? tData(fish.lore) : t('col.unknownLore'))}»</p>
        <div class="detail-stats">
          ${statBox(t('col.weight'), caught ? formatWeight(caught.best) : '—')}
          ${statBox(t('col.caughtCount'), caught ? formatNumber(caught.count) : '0')}
          ${statBox(t('fish.location'), esc(tData(LOCATION_BY_ID[fish.loc].name)))}
          ${statBox(t('col.rarity'), esc(tData(rarity.label)))}
        </div>
        <p class="tiny" style="margin-top:10px">${esc(t('col.progress', {
          n: locationProgress(state, fish.loc).caught,
          m: locationProgress(state, fish.loc).total
        }))}</p>
      </div>
    </div>
  `;
}

// ── Карта ──────────────────────────────────────────────────────────────────

export function mapView(state) {
  const currentId = state.currentLocation;
  const cards = LOCATIONS.map((loc) => {
    const unlocked = state.locations.includes(loc.id);
    const progress = locationProgress(state, loc.id);
    const status = guardianStatus(state, loc.id);
    const isCurrent = currentId === loc.id;
    const p = loc.palette;
    return `
      <button class="map-card ${isCurrent ? 'current' : ''} ${unlocked ? '' : 'locked'}"
        type="button" data-action="travel" data-id="${loc.id}" ${unlocked ? '' : 'disabled'}
        style="--map-bg:linear-gradient(160deg, ${p.skyBottom}, ${p.waterBottom} 78%)">
        ${isCurrent ? `<span class="map-current-badge">${esc(t('map.current'))}</span>` : ''}
        <div class="map-card-top">
          <div>
            <h3>${esc(tData(loc.name))}</h3>
            <small>${esc(tData(loc.tagline))}</small>
          </div>
        </div>
        ${unlocked ? '' : `<span class="map-lock">${icon('lock')}</span>`}
        <div class="map-card-bottom">
          <span>${icon('fish')} ${progress.caught} / ${progress.total}</span>
          <span>${status.caught ? `<span class="guardian-dot"></span>` : status.active ? `${status.meter}/${status.need}` : '✦'}</span>
        </div>
      </button>
    `;
  }).join('');
  return `
    <p class="tiny" style="margin-bottom:12px">${esc(t('map.desc'))}</p>
    <div class="map-grid">${cards}</div>
    <p class="tiny" style="margin-top:10px">${esc(t('map.travelHint'))} · ${esc(t('loc.unlock'))}</p>
  `;
}

// ── Рейтинг ────────────────────────────────────────────────────────────────

export function recordsView(state, { leaderboard = null, status = 'idle', playerName = '', authorized = false } = {}) {
  const progress = collectionProgress(state);
  const authBox = authorized
    ? `<div class="auth-box">
        <span class="auth-box-icon">${icon('user')}</span>
        <div class="auth-box-copy"><b>${esc(t('records.authorized', { name: playerName || t('records.you') }))}</b><small>${esc(t('records.authBenefit'))}</small></div>
        <span class="rarity-tag" style="--rarity:var(--mint)"><span class="rarity-dot"></span>${esc(t('common.online'))}</span>
      </div>`
    : `<div class="auth-box">
        <span class="auth-box-icon">${icon('user')}</span>
        <div class="auth-box-copy"><b>${esc(t('records.login'))}</b><small>${esc(t('records.loginDesc'))}</small></div>
        <button class="btn btn-secondary" type="button" data-action="login">${esc(t('settings.login'))}</button>
      </div>`;

  let board = '';
  if (!authorized) {
    board = `<div class="auth-box" style="background:rgba(255,255,255,.025);border-color:var(--line)">
      <span class="auth-box-icon" style="color:var(--muted)">${icon('trophy')}</span>
      <div class="auth-box-copy"><b>${esc(t('records.leaderboard'))}</b><small>${esc(t('records.loginDesc'))}</small></div>
    </div>`;
  } else if (status === 'loading') {
    board = `<div class="empty-state">${icon('refresh')}<p>${esc(t('records.loading'))}</p></div>`;
  } else if (leaderboard && Array.isArray(leaderboard.entries) && leaderboard.entries.length) {
    const userRank = leaderboard.userRank || 0;
    const rows = leaderboard.entries.map((entry) => {
      const name = entry.player?.publicName || t('common.unknown');
      const me = userRank > 0 && entry.rank === userRank;
      return `<div class="record-row ${me ? 'me' : ''}">
        <span class="record-rank">${entry.rank}</span>
        <span class="record-avatar">${esc(name.slice(0, 1).toUpperCase())}</span>
        <span class="record-name">${esc(name)}${me ? ` · ${esc(t('records.you'))}` : ''}</span>
        <span class="record-score">${formatNumber(entry.score)}</span>
      </div>`;
    }).join('');
    board = `<div class="record-list">${rows}</div>
      ${userRank ? `<p class="tiny" style="margin-top:8px">${esc(t('records.rank'))}: ${userRank}</p>` : ''}`;
  } else {
    board = `<div class="empty-state">${icon('trophy')}<p>${esc(t('records.noLeaderboard'))}</p><p class="tiny">${esc(t('records.empty'))}</p></div>`;
  }

  const achievementsCount = ACHIEVEMENTS.filter((a) => state.achievements[a.id]).length;

  return `
    <div class="records-top">
      <div class="records-hero">
        <span>${esc(t('records.totalScore'))}</span>
        <b>${formatNumber(state.score)}</b>
        <small>${esc(t('records.bestWeight'))}: ${formatWeight(state.stats.bestWeight)}</small>
      </div>
      <div class="stat-grid">
        ${statBox(t('records.catches'), formatNumber(state.stats.catches))}
        ${statBox(t('records.species'), `${progress.caught} / ${progress.total}`)}
        ${statBox(t('records.perfect'), formatNumber(state.stats.perfectReels))}
        ${statBox(t('stats.guardians'), `${guardianCount(state)} / ${LOCATIONS.length}`)}
      </div>
    </div>
    ${authBox}
    <div style="display:flex;align-items:center;justify-content:space-between;margin:15px 0 7px">
      <h3 style="margin:0;font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted-2)">${esc(t('records.top'))}</h3>
      ${authorized ? `<button class="icon-btn" type="button" data-action="refresh-records" style="width:28px;height:28px" aria-label="${esc(t('records.refresh'))}">${icon('refresh')}</button>` : ''}
    </div>
    ${board}
    <div class="records-top" style="margin-top:14px;grid-template-columns:1fr">
      <div class="settings-row" style="margin:0">
        <span class="achievement-icon">${icon('trophy')}</span>
        <div class="settings-row-copy"><b>${esc(t('records.achievements'))}</b><small>${esc(t('records.achievementsCount', { n: achievementsCount, m: ACHIEVEMENTS.length }))}</small></div>
        <button class="shop-buy equip" type="button" data-action="open-achievements">${esc(t('records.viewAchievements'))}</button>
      </div>
    </div>
  `;
}

// ── Настройки ──────────────────────────────────────────────────────────────

function toggleRow(label, desc, value, id) {
  return `<div class="settings-row">
    <div class="settings-row-copy"><b>${esc(label)}</b>${desc ? `<small>${esc(desc)}</small>` : ''}</div>
    <button class="switch ${value ? 'on' : ''}" type="button" role="switch" aria-checked="${value}" data-action="toggle-setting" data-id="${id}"></button>
  </div>`;
}

export function settingsView(state, { cloudStatus = 'off', playerName = '', authorized = false } = {}) {
  const langButtons = ['ru', 'en', 'tr'].map((code) => `
    <button class="lang-option ${state.settings.lang === code ? 'active' : ''}" type="button" data-action="set-lang" data-id="${code}">
      ${code === 'ru' ? 'Русский' : code === 'en' ? 'English' : 'Türkçe'}
    </button>
  `).join('');
  const quality = ['auto', 'high', 'low'].map((q) => `
    <button class="${state.settings.quality === q ? 'active' : ''}" type="button" data-action="set-quality" data-id="${q}">
      ${esc(t(q === 'auto' ? 'settings.qualityAuto' : q === 'high' ? 'settings.qualityHigh' : 'settings.qualityLow'))}
    </button>
  `).join('');
  const cloudLabel = cloudStatus === 'on'
    ? t('settings.cloudOn')
    : cloudStatus === 'syncing'
      ? t('settings.cloudSyncing')
      : cloudStatus === 'error'
        ? t('settings.cloudError')
        : t('settings.cloudOff');

  return `
    <div class="settings-group">
      <h3>${esc(t('settings.language'))}</h3>
      <div class="lang-select">${langButtons}</div>
    </div>
    <div class="settings-group">
      <h3>${esc(t('settings.audio'))}</h3>
      ${toggleRow(t('settings.sound'), t('settings.soundNote'), state.settings.sound, 'sound')}
      ${toggleRow(t('settings.music'), '', state.settings.music, 'music')}
    </div>
    <div class="settings-group">
      <h3>${esc(t('settings.graphics'))}</h3>
      ${toggleRow(t('settings.motion'), t('settings.motionDesc'), state.settings.reducedMotion, 'reducedMotion')}
      <div class="settings-row">
        <div class="settings-row-copy"><b>${esc(t('settings.quality'))}</b></div>
        <div class="segmented" style="margin:0">${quality}</div>
      </div>
    </div>
    <div class="settings-group">
      <h3>${esc(t('settings.gameplay'))}</h3>
      ${toggleRow(t('settings.soft'), t('settings.softDesc'), state.settings.softMode, 'softMode')}
    </div>
    <div class="settings-group">
      <h3>${esc(t('settings.cloud'))}</h3>
      <div class="settings-row">
        <span class="achievement-icon" style="color:${cloudStatus === 'error' ? 'var(--coral)' : 'var(--mint)'}">${icon(cloudStatus === 'error' ? 'info' : 'check')}</span>
        <div class="settings-row-copy"><b>${esc(cloudLabel)}</b><small>${authorized ? esc(t('records.authorized', { name: playerName || t('records.you') })) : esc(t('records.guestNote'))}</small></div>
        ${authorized ? '' : `<button class="shop-buy equip" type="button" data-action="login">${esc(t('settings.login'))}</button>`}
      </div>
    </div>
    <div class="settings-group">
      <h3>${esc(t('settings.credits'))}</h3>
      <div class="settings-row">
        <div class="settings-row-copy"><b>${esc(t('settings.about'))}</b><small>${esc(t('settings.creditsText'))}</small></div>
      </div>
      <div class="settings-row danger-row">
        <div class="settings-row-copy"><b>${esc(t('settings.reset'))}</b><small>${esc(t('settings.resetDesc'))}</small></div>
        <button class="btn" type="button" data-action="reset">${esc(t('settings.reset'))}</button>
      </div>
      <p class="tiny" style="margin-top:8px">${esc(t('settings.version', { v: '1.0.0' }))}</p>
    </div>
  `;
}

// ── Помощь и достижения ────────────────────────────────────────────────────

export function helpView() {
  const block = (iconName, title, text) => `
    <div class="settings-row" style="align-items:flex-start">
      <span class="achievement-icon">${icon(iconName)}</span>
      <div class="settings-row-copy"><b>${esc(title)}</b><small>${esc(text)}</small></div>
    </div>
  `;
  return `
    <div class="quest-story" style="border-color:rgba(255,212,121,.16)">
      <div class="quest-story-head">
        <span class="quest-story-icon">${icon('constellation')}</span>
        <div><span class="quest-chapter">${esc(t('help.goal'))}</span><h3>${esc(t('help.goalText'))}</h3></div>
      </div>
    </div>
    <div class="settings-group">
      <h3>${esc(t('help.controls'))}</h3>
      ${block('arc', t('fish.cast'), t('help.cast'))}
      ${block('fish', t('fish.bite'), t('help.bite'))}
      ${block('tension', t('fish.reel'), t('help.reel'))}
      ${block('tension', t('fish.tension'), t('help.tension'))}
    </div>
    <div class="settings-group">
      <h3>${esc(t('help.tips'))}</h3>
      ${block('spark', t('help.tips'), t('help.tipsText'))}
    </div>
    <div class="settings-group">
      <h3>${esc(t('help.about'))}</h3>
      ${block('info', t('help.about'), t('help.aboutText'))}
      ${block('reel', t('help.keyboard'), t('help.keyboardText'))}
      ${block('user', t('help.mobile'), t('help.mobileText'))}
      ${block('sound', t('help.audio'), t('help.audioText'))}
    </div>
  `;
}

export function achievementsView(state) {
  const list = ACHIEVEMENTS.map((a) => {
    const view = achievementView(state, a);
    return `
      <div class="achievement ${view.unlocked ? 'unlocked' : 'locked'}">
        <span class="achievement-icon">${icon(a.icon)}</span>
        <div class="achievement-copy">
          <b>${esc(tData(a.title))}</b>
          <small>${esc(tData(a.desc))}</small>
          ${view.unlocked ? '' : progressLine(view.current, view.target)}
        </div>
        <span class="achievement-shard">${icon('shard')} ${a.shards}</span>
      </div>
    `;
  }).join('');
  const unlocked = ACHIEVEMENTS.filter((a) => state.achievements[a.id]).length;
  return `
    <div class="collection-head">
      <div class="collection-progress">${progressLine(unlocked, ACHIEVEMENTS.length)}<b>${unlocked} / ${ACHIEVEMENTS.length}</b></div>
    </div>
    <div class="achievement-grid">${list}</div>
  `;
}

// ── Подарок ────────────────────────────────────────────────────────────────

export function giftViewFor(state, now = Date.now()) {
  const view = giftView(state, now);
  const days = [1, 2, 3, 4, 5, 6, 7].map((day) => {
    const past = day < view.day || (day === view.day && view.claimed);
    const today = day === view.day && !view.claimed;
    const gift = DAILY_GIFTS[day - 1];
    return `<div class="gift-day ${today ? 'today' : ''} ${past ? 'past' : ''}">
      <small>${esc(t('gift.day', { n: day }))}</small>
      <b>${gift.sparks}</b>
      ${gift.shards ? `<b style="color:var(--lav)">+${gift.shards} ✦</b>` : '<b style="opacity:0">—</b>'}
    </div>`;
  }).join('');
  return `
    <div class="gift-hero">
      <div class="gift-mark">${icon('gift')}</div>
      <h3>${esc(t('gift.title'))}</h3>
      <p>${esc(t('gift.streak', { n: view.streak }))}${view.streakReset ? ` · ${esc(t('gift.streakLost'))}` : ''}</p>
    </div>
    <div class="gift-days">${days}</div>
    ${view.available
      ? `<div class="reward-row" style="justify-content:center;margin-bottom:13px">
          <span class="reward-chip">${icon('spark')}${view.gift.sparks}</span>
          ${view.gift.shards ? `<span class="reward-chip lav">${icon('shard')}${view.gift.shards}</span>` : ''}
        </div>
        <button class="btn btn-primary" style="width:100%;min-height:46px" type="button" data-action="claim-gift">${esc(t('gift.take'))}</button>`
      : `<p class="tiny" style="text-align:center">${esc(t('gift.next'))} · ${esc(t('gift.comingTomorrow'))}</p>`}
  `;
}

// ── Повышение ранга ────────────────────────────────────────────────────────

export function levelUpView(state, data = {}) {
  const rank = rankForLevel(state.level);
  const next = RANKS.find((r) => r.level > state.level);
  const progress = nextLevelProgress(state);
  return `
    <div class="levelup-card">
      <div class="levelup-mark">${state.level}</div>
      <h2>${esc(t('levelup.title'))}</h2>
      <p class="levelup-rank">${esc(t('levelup.rank', { title: tData(rank.title) }))}</p>
      <p class="tiny" style="max-width:320px;margin:0 auto 13px">${esc(t('levelup.text'))}</p>
      ${data.ranks?.length ? `<div class="reward-row" style="justify-content:center;margin-bottom:12px">
        <span class="reward-chip lav">${icon('shard')}${data.ranks.reduce((s, r) => s + (r.shards || 0), 0)}</span>
      </div>` : ''}
      <div class="collection-progress" style="margin-bottom:6px">${progressLine(progress.current, progress.need)}<b>${Math.round(progress.percent)}%</b></div>
      <p class="tiny">${esc(t('levelup.next'))} · ${esc(next ? tData(next.title) : t('levelup.max'))}</p>
    </div>
  `;
}

// ── Письмо, хранитель, финал ───────────────────────────────────────────────

export function introView() {
  return `
    <div class="story-letter">
      <p>${esc(t('intro.p1'))}</p>
      <p>${esc(t('intro.p2'))}</p>
      <p>${esc(t('intro.p3'))}</p>
      <p class="letter-sign"><span class="letter-mark">✦</span>${esc(t('intro.sign'))}</p>
    </div>
    <div class="catch-actions" style="margin-top:14px">
      <button class="btn btn-primary" type="button" data-action="intro-start"><span class="icon">${icon('hook')}</span>${esc(t('intro.start'))}</button>
      <button class="btn btn-secondary" type="button" data-action="intro-later" style="flex-direction:row;min-height:44px;font-size:11px">${esc(t('intro.later'))}</button>
    </div>
  `;
}

export function guardianView(summary) {
  const constellation = CONSTELLATIONS[summary.constellation] || null;
  const fish = summary.fish;
  const cName = constellation ? tData(constellation.name) : '';
  return `
    <div class="guardian-modal">
      <div class="constellation-stage">
        <canvas id="guardian-canvas" data-constellation="${summary.constellation || ''}"></canvas>
      </div>
      <h3>${esc(cName)}</h3>
      <p>${esc(t('guardian.constellation', { name: cName }))}. ${esc(tData(fish.lore))}</p>
      <div class="guardian-reward">
        <span class="reward-chip">${icon('fish')}${esc(fishName(fish))}</span>
        <span class="reward-chip gold">${icon('star')}${formatWeight(summary.weight)}</span>
      </div>
      <button class="btn btn-primary" style="width:100%;min-height:44px" type="button" data-action="close-guardian">
        <span class="icon">${icon('arrow')}</span>${esc(t('guardian.continue'))}
      </button>
    </div>
  `;
}

export function endingView(state) {
  const finalQuest = QUESTS[QUESTS.length - 1];
  return `
    <div class="ending-card">
      <div class="ending-stars"><canvas id="ending-canvas"></canvas></div>
      <p>${esc(t('ending.text'))}</p>
      <div class="stat-grid" style="text-align:left;margin-bottom:10px">
        ${statBox(t('ending.guardians'), `${guardianCount(state)} / ${LOCATIONS.length}`)}
        ${statBox(t('ending.catches'), formatNumber(state.stats.catches))}
        ${statBox(t('ending.species'), `${collectionCount(state)} / ${FISH.length}`)}
        ${statBox(t('ending.best'), formatWeight(state.stats.bestWeight))}
        ${statBox(t('ending.playtime'), `${Math.max(1, Math.round(state.playTime / 60))} ${esc(t('common.minutes'))}`)}
        ${statBox(t('stats.perfect'), formatNumber(state.stats.perfectReels))}
      </div>
      <div class="reward-row" style="justify-content:center;margin-bottom:12px">
        ${rewardChips(finalQuest.reward)}
      </div>
      <p class="tiny" style="margin-bottom:13px">${esc(t('ending.thanks'))}</p>
      <button class="btn btn-primary" style="width:100%;min-height:46px" type="button" data-action="close-ending">
        <span class="icon">${icon('home')}</span>${esc(t('ending.continue'))}
      </button>
    </div>
  `;
}

export function confirmView(text) {
  return `<p style="font-size:12px;line-height:1.6;color:var(--muted);margin:4px 0 2px">${esc(text)}</p>`;
}

// Набор тонких линейных иконок. Все рисуются кодом, без внешних файлов.

const paths = {
  star: '<path d="M12 3.2l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.6l6.1-.9L12 3.2z"/>',
  spark: '<path d="M12 2.8l1.7 6.1 6.1 1.7-6.1 1.7L12 18.4l-1.7-6.1-6.1-1.7 6.1-1.7L12 2.8z"/><path d="M19 16.2l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3z"/>',
  shard: '<path d="M12 2.5l7 5.2-2.7 12.3L12 21.5l-4.3-1.5L5 7.7l7-5.2z"/><path d="M12 2.5v19M5 7.7l14 0M9.5 12.2h5"/>',
  rod: '<path d="M4 20c6.5-1.7 10.5-7 11-16"/><path d="M15 4c3 1.3 4.2 4.4 4.2 7.7"/><path d="M15 15.2V20"/><path d="M13.7 15.2h2.6"/>',
  line: '<path d="M4 5c4 1.2 5.8 4.3 7 9.2"/><path d="M14 17.5c2.2-1.2 2.4-4.2 1.2-6.1"/><circle cx="17.2" cy="19.2" r="1.7"/>',
  lure: '<path d="M12 3.5c-4 2.3-6 5.5-6 9a6 6 0 0012 0c0-3.5-2-6.7-6-9z"/><path d="M12 8.5v3.2"/><circle cx="12" cy="14.6" r="1.2"/>',
  lantern: '<path d="M8.5 6h7l1.5 3.5v8.8L15.5 21h-7L7 18.3V9.5L8.5 6z"/><path d="M10 6V3.5h4V6M5.5 10.5h2M16.5 10.5h2"/><path d="M12 9.5c-1.3 1.4-2 2.7-2 4a2 2 0 004 0c0-1.3-.7-2.6-2-4z"/>',
  hook: '<path d="M12 2.5v10.2a4.2 4.2 0 01-8.4 0"/><path d="M8 8.5l4 4 4-4"/><circle cx="12" cy="2.5" r="1.1"/>',
  book: '<path d="M4 4.5c3-1.1 5.4-.8 8 1v14c-2.6-1.8-5-2.1-8-1v-14z"/><path d="M20 4.5c-3-1.1-5.4-.8-8 1v14c2.6-1.8 5-2.1 8-1v-14z"/>',
  map: '<path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V6l5-2z"/><path d="M9 4v14M15 6v14"/>',
  shop: '<path d="M4 9.5L5.5 4h13L20 9.5"/><path d="M4 9.5h16V20H4V9.5z"/><path d="M9 20v-5.5h6V20"/><path d="M4 9.5c0 1.5 1 2.5 2.3 2.5s2.3-1 2.3-2.5c0 1.5 1 2.5 2.3 2.5s2.3-1 2.3-2.5c0 1.5 1 2.5 2.3 2.5s2.3-1 2.3-2.5c0 1.5 1 2.5 2.3 2.5s2.2-1 2.2-2.5"/>',
  quest: '<path d="M6 3.5h12v17H6v-17z"/><path d="M9 7h6M9 10.5h6M9 14h4"/><path d="M4.5 6h1.5M4.5 10h1.5M4.5 14h1.5"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 01-8 0V4z"/><path d="M8 5.5H4.5V8A3.5 3.5 0 008 11.5M16 5.5h3.5V8A3.5 3.5 0 0116 11.5"/><path d="M12 13v4M8.5 21h7M9.5 17.5h5V21h-5v-3.5z"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.5M12 18.7v2.5M2.8 12h2.5M18.7 12h2.5M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8"/>',
  soundOn: '<path d="M4 9.5h3l4.5-3.5v12L7 14.5H4v-5z"/><path d="M15 8.5c1.7 1.4 1.7 5.6 0 7M17.8 6c3.1 2.7 3.1 9.3 0 12"/>',
  soundOff: '<path d="M4 9.5h3l4.5-3.5v12L7 14.5H4v-5z"/><path d="M15 9l5 6M20 9l-5 6"/>',
  music: '<path d="M9 18V5l10-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  pause: '<path d="M8 4.5v15M16 4.5v15"/>',
  close: '<path d="M5.5 5.5l13 13M18.5 5.5l-13 13"/>',
  arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>',
  check: '<path d="M4.5 12.5l5 5 10-11"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 018 0v3"/>',
  play: '<path d="M8 4.5l11 7.5-11 7.5v-15z"/>',
  gift: '<path d="M4 9.5h16V21H4V9.5z"/><path d="M3 6h18v3.5H3V6zM12 6v15"/><path d="M12 6C10.5 6 7.5 5.6 7.5 3.7 7.5 2.6 8.4 2 9.4 2 11 2 12 4 12 6zM12 6c1.5 0 4.5-.4 4.5-2.3C16.5 2.6 15.6 2 14.6 2 13 2 12 4 12 6z"/>',
  calendar: '<rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2M14 17h2"/>',
  weight: '<path d="M12 6.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/><path d="M6 21l2.2-13h7.6L18 21H6z"/><path d="M9.8 12.5h4.4"/>',
  tension: '<path d="M4 17c2.5-1.2 4-4.8 4-8M20 7c-2.5 1.2-4 4.8-4 8"/><path d="M4 17c4.2 3.2 11.8 3.2 16 0"/><path d="M7 12.5h10"/>',
  arc: '<path d="M4 19C4 10 10 4 20 4"/><path d="M16 4h4v4"/><path d="M6 19h-2M6 16v3"/>',
  crown: '<path d="M4 8l4 4 4-7 4 7 4-4-1.5 11h-13L4 8z"/><path d="M6.5 19h11"/>',
  constellation: '<path d="M5 17l4-9 5 4 5-8"/><circle cx="5" cy="17" r="1.5"/><circle cx="9" cy="8" r="1.5"/><circle cx="14" cy="12" r="1.5"/><circle cx="19" cy="4" r="1.5"/><path d="M7 15.5L8 9.5M10.5 8.8l2.5 2.4M15.5 11.2L18 5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 10.5V17M12 7.2v.1"/>',
  refresh: '<path d="M20 11a8 8 0 10-2.3 6.7"/><path d="M20 4v7h-7"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21c.8-4.2 3.8-6.5 7.5-6.5s6.7 2.3 7.5 6.5"/>',
  sparkles: '<path d="M12 3l1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/>',
  fish: '<path d="M3 12c3-4 7-6 11-6 3.2 0 5.5 1.8 7 4-1.5 2.2-3.8 4-7 4-4 0-8-2-11-6z"/><path d="M21 8.5L17 12l4 3.5"/><circle cx="8" cy="11" r=".7"/>',
  home: '<path d="M3.5 11L12 3.5 20.5 11"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/>',
  reel: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.6"/><path d="M12 3.5v5.9M20.5 12h-5.9M12 20.5v-5.9M3.5 12h5.9"/>',
  ad: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M8 9.5l4 2.5-4 2.5v-5z"/><path d="M15 9.5h2M15 14.5h2"/>',
  sound: '<path d="M4 9.5h3l4.5-3.5v12L7 14.5H4v-5z"/><path d="M15 8.5c1.7 1.4 1.7 5.6 0 7"/>'
};

export function icon(name, className = '') {
  const body = paths[name] || paths.star;
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

export function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    const name = el.dataset.icon;
    if (!name || el.dataset.iconReady === '1') return;
    el.innerHTML = icon(name);
    el.dataset.iconReady = '1';
  });
}

export const ICONS = paths;

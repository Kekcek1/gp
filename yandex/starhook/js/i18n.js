import ru from './i18n-ru.js';
import en from './i18n-en.js';
import tr from './i18n-tr.js';

export const DICTIONARIES = { ru, en, tr };
export const SUPPORTED_LANGS = ['ru', 'en', 'tr'];
export const LANG_NAMES = { ru: 'Русский', en: 'English', tr: 'Türkçe' };

let current = 'ru';
const listeners = new Set();

/** Приводит язык портала к поддерживаемому. */
export function normalizeLang(lang) {
  const code = String(lang || '').toLowerCase().split(/[-_]/)[0];
  if (code === 'ru' || code === 'be' || code === 'uk' || code === 'kk' || code === 'ky') return 'ru';
  if (code === 'tr' || code === 'az') return 'tr';
  if (code === 'en') return 'en';
  // Для остальных языков используем английский — он заявлен как резервный.
  return 'en';
}

export function getLang() {
  return current;
}

export function setLang(lang, { silent = false } = {}) {
  current = SUPPORTED_LANGS.includes(lang) ? lang : normalizeLang(lang);
  document.documentElement.lang = current;
  applyStaticTranslations();
  if (!silent) listeners.forEach((fn) => fn(current));
  return current;
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Перевод по ключу с подстановкой {name}. */
export function t(key, vars) {
  const dict = DICTIONARIES[current] || DICTIONARIES.ru;
  let value = dict[key];
  if (value === undefined) value = DICTIONARIES.en[key];
  if (value === undefined) value = DICTIONARIES.ru[key];
  if (value === undefined) return key;
  if (!vars) return value;
  return String(value).replace(/\{(\w+)\}/g, (m, name) => (vars[name] !== undefined ? vars[name] : m));
}

/** Перевод объекта вида {ru, en, tr}. */
export function tData(obj, fallback = '') {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  return obj[current] || obj.en || obj.ru || fallback;
}

/** Применяет переводы к статической разметке. */
export function applyStaticTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });
  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (key) el.innerHTML = t(key);
  });
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.dataset.i18nAria;
    if (key) el.setAttribute('aria-label', t(key));
  });
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (key) el.setAttribute('title', t(key));
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.setAttribute('placeholder', t(key));
  });
}

export function formatNumber(n, digits = 0) {
  try {
    return new Intl.NumberFormat(current, {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits
    }).format(n);
  } catch {
    return String(n);
  }
}

export function formatWeight(grams) {
  const g = Math.max(0, Number(grams) || 0);
  if (g < 1000) return `${formatNumber(Math.round(g))} ${t('common.g')}`;
  const kg = g / 1000;
  const digits = kg < 10 ? 2 : kg < 100 ? 1 : 0;
  return `${formatNumber(kg, digits)} ${t('common.kg')}`;
}

export function formatDuration(totalSeconds) {
  const sec = Math.max(0, Math.round(Number(totalSeconds) || 0));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h} ${t('common.hours')} ${m} ${t('common.minutes')}`;
  if (m > 0) return `${m} ${t('common.minutes')}`;
  return `${s} ${t('common.seconds')}`;
}

export function formatCountdown(ms) {
  const sec = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (v) => String(v).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function localeTag() {
  return current === 'ru' ? 'ru-RU' : current === 'tr' ? 'tr-TR' : 'en-US';
}

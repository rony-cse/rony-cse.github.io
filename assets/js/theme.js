const KEY = 'theme';

export function initTheme() {
  applyTheme(stored());
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (stored() === 'auto') applyTheme('auto');
  });
}

export function stored() {
  return localStorage.getItem(KEY) || 'auto';
}

export function setTheme(pref) {
  localStorage.setItem(KEY, pref);
  applyTheme(pref);
}

export function applyTheme(pref) {
  const dark = pref === 'dark' || (pref === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

export function cycle() {
  const next = { auto: 'light', light: 'dark', dark: 'auto' }[stored()] || 'auto';
  setTheme(next);
  return next;
}

export function icon(pref) {
  return { dark: '☾', light: '☀', auto: '⊙' }[pref] || '⊙';
}

import {map} from 'lodash-es';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

const DARK_CLASS = 'dark';
const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Runs as an inline script before the first paint, so the page never flashes the wrong theme.
 * It is serialised with `toString()`, therefore it must stay self-contained:
 * no references to anything outside its own body except its arguments
 * (no imports — lodash included).
 */
export const initTheme = (storageKey: string, darkClass: string, darkQuery: string) => {
  const readStoredTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const media = window.matchMedia(darkQuery);

  const applyDark = (isDark: boolean) => {
    document.documentElement.classList.toggle(darkClass, isDark);
  };

  const storedTheme = readStoredTheme();
  applyDark(storedTheme ? storedTheme === 'dark' : media.matches);

  // Follow system changes live until the visitor picks a theme explicitly.
  media.addEventListener('change', (event) => {
    if (!readStoredTheme()) {
      applyDark(event.matches);
    }
  });
};

const scriptArgs = map([THEME_STORAGE_KEY, DARK_CLASS, DARK_QUERY], (arg) =>
  JSON.stringify(arg),
).join(', ');

export const themeScript = `(${initTheme.toString()})(${scriptArgs})`;

export const getTheme = (): Theme =>
  document.documentElement.classList.contains(DARK_CLASS) ? 'dark' : 'light';

export const setTheme = (theme: Theme) => {
  document.documentElement.classList.toggle(DARK_CLASS, theme === 'dark');

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage is unavailable (e.g. blocked by privacy settings): the choice lasts for this page.
  }
};

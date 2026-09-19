import {map} from 'lodash-es';

type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

// An attribute, not a class: React rewrites the <html> className on client-side navigation.
const THEME_ATTRIBUTE = 'data-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Runs as an inline script before the first paint, so the page never flashes the wrong theme.
 * It is serialised with `toString()`, therefore it must stay self-contained:
 * no references to anything outside its own body except its arguments
 * (no imports — lodash included).
 */
const initTheme = (storageKey: string, attribute: string, darkQuery: string) => {
  const readStoredTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const media = window.matchMedia(darkQuery);

  const applyTheme = (isDark: boolean) => {
    document.documentElement.setAttribute(attribute, isDark ? 'dark' : 'light');
  };

  const storedTheme = readStoredTheme();
  applyTheme(storedTheme ? storedTheme === 'dark' : media.matches);

  // Follow system changes live until the visitor picks a theme explicitly.
  media.addEventListener('change', (event) => {
    if (!readStoredTheme()) {
      applyTheme(event.matches);
    }
  });
};

const scriptArgs = map([THEME_STORAGE_KEY, THEME_ATTRIBUTE, DARK_QUERY], (arg) =>
  JSON.stringify(arg),
).join(', ');

export const themeScript = `(${initTheme.toString()})(${scriptArgs})`;

const readStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const getTheme = (): Theme => {
  const storedTheme = readStoredTheme();

  if (storedTheme) {
    return storedTheme === 'dark' ? 'dark' : 'light';
  }

  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
};

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
};

/** Re-applies the current theme; React drops the attribute when the root layout re-renders. */
export const restoreTheme = () => {
  applyTheme(getTheme());
};

export const setTheme = (theme: Theme) => {
  applyTheme(theme);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage is unavailable (e.g. blocked by privacy settings): the choice lasts for this page.
  }
};

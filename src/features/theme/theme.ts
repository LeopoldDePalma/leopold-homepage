import {PREFERENCE_COOKIE_MAX_AGE} from '@/lib/cookies';

export type Theme = 'light' | 'dark';

export const THEME_COOKIE = 'theme';
const THEME_ATTRIBUTE = 'data-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

export const isTheme = (value: string | undefined): value is Theme =>
  value === 'light' || value === 'dark';

export const getTheme = (): Theme => {
  const chosenTheme = document.documentElement.getAttribute(THEME_ATTRIBUTE) ?? undefined;

  if (isTheme(chosenTheme)) {
    return chosenTheme;
  }

  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
};

export const setTheme = (theme: Theme) => {
  const attributes = `path=/;max-age=${String(PREFERENCE_COOKIE_MAX_AGE)};samesite=lax`;

  document.cookie = `${THEME_COOKIE}=${theme};${attributes}`;
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
};

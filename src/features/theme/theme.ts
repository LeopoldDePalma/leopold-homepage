export type Theme = 'light' | 'dark';

export const THEME_COOKIE = 'theme';
const THEME_ATTRIBUTE = 'data-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const isTheme = (value: string | undefined): value is Theme => {
  return value === 'light' || value === 'dark';
};

export const getTheme = (): Theme => {
  const chosenTheme = document.documentElement.getAttribute(THEME_ATTRIBUTE) ?? undefined;

  if (isTheme(chosenTheme)) {
    return chosenTheme;
  }

  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
};

export const setTheme = (theme: Theme) => {
  const attributes = `path=/;max-age=${String(COOKIE_MAX_AGE_SECONDS)};samesite=lax`;

  document.cookie = `${THEME_COOKIE}=${theme};${attributes}`;
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
};

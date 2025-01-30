import React from 'react';
import { ThemeContext } from '../../features/theme/ThemeContext';

type ThemeRouterProviderProps = {
  children: React.ReactNode;
};

export function ThemeRouterProvider({ children }: ThemeRouterProviderProps): React.JSX.Element {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return true;
    }
  });

  const toggleTheme = React.useCallback(() => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, []);

  const value = React.useMemo(
    () => ({
      isDarkMode,
      toggleTheme,
    }),
    [isDarkMode, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

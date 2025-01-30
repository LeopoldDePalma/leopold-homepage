import React from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

export const getInitialTheme = (): boolean => {
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return true;
  }
};

const initialThemeContext: ThemeContextType = {
  isDarkMode: getInitialTheme(),
  toggleTheme: () => {
    throw new Error(`ThemeContext not initialized`);
  },
};

export const ThemeContext = React.createContext<ThemeContextType>(initialThemeContext);
ThemeContext.displayName = 'ThemeContext';

export const useThemeContext = (): ThemeContextType => {
  const context = React.useContext(ThemeContext);
  return context;
};

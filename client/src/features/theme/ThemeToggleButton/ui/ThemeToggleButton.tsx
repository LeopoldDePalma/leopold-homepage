import { DarkMode as DarkModeIcon, LightModeOutlined as LightModeIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useThemeContext } from '../../ThemeContext';
import styles from './ThemeToggleButton.module.css';

export default function ThemeToggleButton(): React.JSX.Element {
  const { isDarkMode, toggleTheme } = useThemeContext();

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      toggleTheme();
    },
    [toggleTheme],
  );

  return (
    <AnimatePresence mode="wait" initial={false} key="theme-toggle">
      <motion.div
        style={{ display: 'inline-block', position: 'relative' }}
        key={isDarkMode ? 'dark-mode' : 'light-mode'}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          aria-label="ToggleTheme"
          onClick={handleClick}
          className={`${styles.toggleButton} ${isDarkMode ? styles.light : styles.dark}`}
        >
          {isDarkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
        </IconButton>
      </motion.div>
    </AnimatePresence>
  );
}

'use client';

import {Moon, Sun} from 'lucide-react';
import {useTranslations} from 'next-intl';

import {IconButton} from '@/components/ui/IconButton';

import {getTheme, setTheme} from './theme';

export const ThemeToggle = () => {
  const t = useTranslations('ThemeToggle');

  const handleClick = () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  };

  return (
    <IconButton label={t('label')} onClick={handleClick}>
      {/* The server can't know the visitor's theme, so both icons are rendered
          and the `dark` class on <html> decides which one is visible. */}
      <Moon aria-hidden className="size-[1.25em] dark:hidden" />
      <Sun aria-hidden className="hidden size-[1.25em] dark:block" />
    </IconButton>
  );
};

'use client';

import {Moon, Sun} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useTheme} from 'next-themes';

import {IconButton} from '@/components/ui/IconButton';

export const ThemeToggle = () => {
  const t = useTranslations('ThemeToggle');
  const {resolvedTheme, setTheme} = useTheme();

  const handleClick = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <IconButton label={t('label')} onClick={handleClick}>
      {/* Both icons are rendered and switched by CSS,
          so server and client markup always match. */}
      <Moon aria-hidden className="size-[1.25em] dark:hidden" />
      <Sun aria-hidden className="hidden size-[1.25em] dark:block" />
    </IconButton>
  );
};

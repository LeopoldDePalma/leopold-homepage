'use client';

import {Moon, Sun} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useTheme} from 'next-themes';

import {cn} from '@/lib/cn';

export function ThemeToggle() {
  const t = useTranslations('ThemeToggle');
  const {resolvedTheme, setTheme} = useTheme();

  function handleClick() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }

  return (
    <button
      type="button"
      aria-label={t('label')}
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center rounded-md border border-border p-[0.5em]',
        'text-accent transition-colors hover:bg-foreground/5',
      )}
    >
      {/* Both icons are rendered and switched by CSS,
          so server and client markup always match. */}
      <Moon aria-hidden className="size-[1.25em] dark:hidden" />
      <Sun aria-hidden className="hidden size-[1.25em] dark:block" />
    </button>
  );
}

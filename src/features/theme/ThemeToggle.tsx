'use client';

import {Icon, IconButton} from '@chakra-ui/react';
import {Moon, Sun} from 'lucide-react';
import {useTranslations} from 'next-intl';

import {whenDark} from '@/styles/shared';

import {getTheme, setTheme} from './theme';

export const ThemeToggle = () => {
  const t = useTranslations('ThemeToggle');

  const handleClick = () => setTheme(getTheme() === 'dark' ? 'light' : 'dark');

  return (
    <IconButton aria-label={t('label')} variant="outline" size="sm" onClick={handleClick}>
      <Icon css={whenDark({display: 'none'})}>
        <Moon />
      </Icon>
      <Icon display="none" css={whenDark({display: 'block'})}>
        <Sun />
      </Icon>
    </IconButton>
  );
};

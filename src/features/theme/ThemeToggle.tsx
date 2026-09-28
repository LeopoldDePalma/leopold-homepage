'use client';

import {Icon, IconButton} from '@chakra-ui/react';
import {Moon, Sun} from 'lucide-react';
import {useTranslations} from 'next-intl';

import {whenDark} from '@/styles/system';

import {getTheme, setTheme} from './theme';

export const ThemeToggle = () => {
  const t = useTranslations('ThemeToggle');

  const handleClick = () => setTheme(getTheme() === 'dark' ? 'light' : 'dark');

  return (
    <IconButton aria-label={t('label')} variant="outline" size="sm" onClick={handleClick}>
      <Icon asChild css={whenDark({display: 'none'})}>
        <Moon aria-hidden />
      </Icon>
      <Icon asChild display="none" css={whenDark({display: 'block'})}>
        <Sun aria-hidden />
      </Icon>
    </IconButton>
  );
};

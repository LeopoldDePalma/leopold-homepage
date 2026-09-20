import {IconBrandGithub} from '@tabler/icons-react';
import {useTranslations} from 'next-intl';
import {tv} from 'tailwind-variants';

import {site} from '@/content/site';
import {ThemeToggle} from '@/features/theme/ThemeToggle';

import {LocaleSwitcher} from './LocaleSwitcher';
import {Logo} from './Logo';

const siteHeader = tv({
  slots: {
    root: ['sticky top-0 z-10', 'bg-background/60 backdrop-blur-md'],
    container: ['mx-auto flex w-full max-w-2xl items-center', 'gap-4 px-4 py-3'],
    nav: 'ms-auto',
    sourceLink: [
      'flex items-center',
      'gap-[0.4em]',
      'text-sm',
      'text-muted',
      'transition-colors hover:text-foreground',
    ],
    sourceIcon: 'size-[1.2em]',
    sourceLabel: 'sr-only sm:not-sr-only',
  },
});

const {root, container, nav, sourceLink, sourceIcon, sourceLabel} = siteHeader();

export const SiteHeader = () => {
  const t = useTranslations('SiteHeader');

  return (
    <header className={root()}>
      <div className={container()}>
        <Logo />

        <nav aria-label={t('navLabel')} className={nav()}>
          <a
            href={site.links.source}
            target="_blank"
            rel="noopener noreferrer"
            className={sourceLink()}
          >
            <IconBrandGithub aria-hidden className={sourceIcon()} />
            <span className={sourceLabel()}>{t('source')}</span>
          </a>
        </nav>

        <LocaleSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
};

import {IconBrandGithub} from '@tabler/icons-react';
import {getTranslations} from 'next-intl/server';
import {tv} from 'tailwind-variants';

import {site} from '@/content/site';
import {MusicToggle} from '@/features/music/MusicToggle';
import {getListening} from '@/features/music/spotify';
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

export const SiteHeader = async () => {
  const t = await getTranslations('SiteHeader');
  // Fetched here so the token never leaves the server: the toggle itself is a client component.
  const listening = await getListening();

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
        {listening ? <MusicToggle initial={listening} /> : null}
        <ThemeToggle />
      </div>
    </header>
  );
};

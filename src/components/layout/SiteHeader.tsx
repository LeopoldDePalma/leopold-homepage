import {SiGithub} from '@icons-pack/react-simple-icons';
import {useTranslations} from 'next-intl';
import {tv} from 'tailwind-variants';

import {LocaleSwitcher} from '@/components/LocaleSwitcher';
import {ThemeToggle} from '@/components/ThemeToggle';
import {site} from '@/content/site';

import {Logo} from './Logo';

const siteHeader = tv({
  slots: {
    root: ['sticky top-0 z-10', 'border-b border-border', 'bg-background/80 backdrop-blur-md'],
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
            <SiGithub aria-hidden className={sourceIcon()} />
            <span className={sourceLabel()}>{t('source')}</span>
          </a>
        </nav>

        <LocaleSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
};

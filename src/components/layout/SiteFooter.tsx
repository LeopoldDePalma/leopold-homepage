import {useTranslations} from 'next-intl';
import type {ReactNode} from 'react';
import {tv} from 'tailwind-variants';

import {site} from '@/content/site';

const siteFooter = tv({
  slots: {
    root: [
      'mx-auto flex w-full max-w-2xl flex-col',
      'gap-2 px-4 py-8',
      'text-center text-sm',
      'text-muted',
    ],
    credit: 'text-xs',
    link: ['underline underline-offset-2', 'transition-colors hover:text-foreground'],
  },
});

const {root, credit, link} = siteFooter();

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
};

// Latin titles keep their own direction inside Arabic text.
const ExternalLink = ({href, children}: ExternalLinkProps) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" dir="ltr" className={link()}>
      {children}
    </a>
  );
};

export const SiteFooter = () => {
  const tSite = useTranslations('Site');
  const t = useTranslations('SiteFooter');
  // Passed as a string so locales with digit grouping don't render "2,026".
  const year = String(new Date().getFullYear());

  return (
    <footer className={root()}>
      <p>{t('copyright', {year, name: tSite('name')})}</p>
      <p className={credit()}>
        {t.rich('modelCredit', {
          model: (chunks) => <ExternalLink href={site.modelCredit.model}>{chunks}</ExternalLink>,
          author: (chunks) => <ExternalLink href={site.modelCredit.author}>{chunks}</ExternalLink>,
          license: (chunks) => (
            <ExternalLink href={site.modelCredit.license}>{chunks}</ExternalLink>
          ),
        })}
      </p>
    </footer>
  );
};

import {Sword} from 'lucide-react';
import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import type {ReactNode} from 'react';
import {tv} from 'tailwind-variants';

import {outlineButton} from '@/components/ui/OutlineButton';
import {site} from '@/content/site';
import {Link} from '@/i18n/navigation';

const notFoundPage = tv({
  slots: {
    root: 'flex flex-1 flex-col items-center gap-4 py-8 text-center',
    // Arms of Swabia, borne by the Hohenstaufen: gold and three black lions.
    emblem: 'h-auto w-[7em]',
    // The code and the title sit side by side, split by a rule, as on the built-in 404.
    title: 'flex items-center',
    code: ['pe-4', 'font-heading text-2xl/none font-bold', 'text-accent'],
    heading: ['py-2 ps-5', 'font-heading text-2xl font-bold', 'border-s border-border'],
    description: ['max-w-md', 'text-muted'],
    blade: ['size-[1.1em]', '-scale-x-100 rtl:scale-x-100'],
    // Takes the space left over, so the button lands halfway between text and licence line.
    action: 'flex flex-1 items-center',
    credit: ['text-xs', 'text-muted/80'],
    creditLink: 'underline underline-offset-2 hover:text-foreground',
  },
});

const {root, emblem, title, code, heading, description, blade, action, credit, creditLink} =
  notFoundPage();

const CreditLink = ({href, children}: {href: string; children: ReactNode}) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={creditLink()}>
      {children}
    </a>
  );
};

const NotFoundPage = async () => {
  const t = await getTranslations('NotFound');

  return (
    <div className={root()}>
      <Image
        src="/images/arms-of-swabia.svg"
        alt=""
        width={220}
        height={260}
        className={emblem()}
      />
      <div className={title()}>
        <p className={code()}>404</p>
        <h1 className={heading()}>{t('title')}</h1>
      </div>
      <p className={description()}>{t('description')}</p>
      <div className={action()}>
        <Link href="/" className={outlineButton()}>
          <Sword aria-hidden className={blade()} />
          {t('home')}
        </Link>
      </div>
      <p className={credit()}>
        {t.rich('armsCredit', {
          arms: (chunks) => <CreditLink href={site.armsCredit.arms}>{chunks}</CreditLink>,
          author: (chunks) => <CreditLink href={site.armsCredit.author}>{chunks}</CreditLink>,
          license: (chunks) => <CreditLink href={site.armsCredit.license}>{chunks}</CreditLink>,
        })}
      </p>
    </div>
  );
};

export default NotFoundPage;

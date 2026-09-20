'use client';

import {map, without} from 'lodash-es';
import {useLocale, useTranslations} from 'next-intl';
import {tv} from 'tailwind-variants';

import {Link, usePathname} from '@/i18n/navigation';
import {localeNames, routing} from '@/i18n/routing';

const localeLink = tv({
  base: ['text-sm', 'text-muted', 'transition-colors hover:text-foreground'],
});

/** Links to the same page in every other locale; the current one is implied by the page. */
export const LocaleSwitcher = () => {
  const t = useTranslations('LocaleSwitcher');
  const currentLocale = useLocale();
  const pathname = usePathname();
  const otherLocales = without(routing.locales, currentLocale);

  return (
    <nav aria-label={t('label')}>
      <ul className="flex gap-3">
        {map(otherLocales, (locale) => (
          <li key={locale}>
            <Link href={pathname} locale={locale} lang={locale} className={localeLink()}>
              {localeNames[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

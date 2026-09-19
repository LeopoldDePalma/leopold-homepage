'use client';

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
  const otherLocales = routing.locales.filter((locale) => locale !== currentLocale);

  return (
    <nav aria-label={t('label')}>
      <ul className="flex gap-3">
        {otherLocales.map((locale) => (
          <li key={locale}>
            <Link
              href={pathname}
              locale={locale}
              lang={locale}
              hrefLang={locale}
              className={localeLink()}
            >
              {localeNames[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

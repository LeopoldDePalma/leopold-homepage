'use client';

import {HStack, Link} from '@chakra-ui/react';
import {map, without} from 'lodash-es';
import {useLocale, useTranslations} from 'next-intl';

import {Link as IntlLink, usePathname} from '@/i18n/navigation';
import {localeNames, routing} from '@/i18n/routing';

/** Links to the same page in every other locale; the current one is implied by the page. */
export const LocaleSwitcher = () => {
  const t = useTranslations('LocaleSwitcher');
  const currentLocale = useLocale();
  const pathname = usePathname();
  const otherLocales = without(routing.locales, currentLocale);

  return (
    <nav aria-label={t('label')}>
      <HStack as="ul" gap="3" listStyle="none">
        {map(otherLocales, (locale) => (
          <li key={locale}>
            <Link
              asChild
              textStyle="sm"
              color="fg.muted"
              _hover={{color: 'fg', textDecoration: 'none'}}
            >
              <IntlLink href={pathname} locale={locale} lang={locale}>
                {localeNames[locale]}
              </IntlLink>
            </Link>
          </li>
        ))}
      </HStack>
    </nav>
  );
};

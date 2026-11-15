import {cookies, headers} from 'next/headers';
import * as rootParams from 'next/root-params';
import {hasLocale, type Messages} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';

import {getPreferredLocale} from './preferredLocale';
import {LOCALE_COOKIE, routing} from './routing';

const getSegmentLocale = async () => {
  const locale = await rootParams.locale();

  return hasLocale(routing.locales, locale) ? locale : undefined;
};

// The 404 renders outside `[locale]`, where there is no segment to read the locale from.
const getVisitorLocale = async () =>
  getPreferredLocale(
    (await cookies()).get(LOCALE_COOKIE)?.value,
    (await headers()).get('accept-language') ?? undefined,
  );

export default getRequestConfig(async (params) => {
  const locale = params.locale ?? (await getSegmentLocale()) ?? (await getVisitorLocale());

  // next-intl types messages with en.json's literal strings, which no other locale can match;
  // messages.test.ts checks that every locale has the same keys and placeholders.
  const {default: messages} = (await import(`@/messages/${locale}.json`)) as {
    default: Messages;
  };

  return {locale, messages};
});

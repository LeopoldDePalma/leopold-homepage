import {notFound} from 'next/navigation';
import * as rootParams from 'next/root-params';
import {hasLocale, type Messages} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';

import {routing} from './routing';

const getSegmentLocale = async () => {
  const locale = await rootParams.locale();

  return hasLocale(routing.locales, locale) ? locale : undefined;
};

export default getRequestConfig(async (params) => {
  const locale =
    params.locale ??
    (await getSegmentLocale()) ??
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- global-not-found has no segment
    (await params.requestLocale);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const {default: messages} = (await import(`../messages/${locale}.json`)) as {
    default: Messages;
  };

  return {locale, messages};
});

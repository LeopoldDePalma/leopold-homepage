import {notFound} from 'next/navigation';
import * as rootParams from 'next/root-params';
import {hasLocale, type Messages} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';

import {routing} from './routing';

export default getRequestConfig(async ({locale}) => {
  const resolvedLocale = locale ?? (await rootParams.locale());

  if (!hasLocale(routing.locales, resolvedLocale)) {
    notFound();
  }

  const {default: messages} = (await import(`../messages/${resolvedLocale}.json`)) as {
    default: Messages;
  };

  return {locale: resolvedLocale, messages};
});

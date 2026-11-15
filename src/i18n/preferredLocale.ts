import {match} from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import {hasLocale} from 'next-intl';

import {type Locale, routing} from './routing';

const matchLanguages = (acceptLanguage: string | undefined) => {
  const languages = new Negotiator({headers: {'accept-language': acceptLanguage}}).languages();

  try {
    return match(languages, routing.locales, routing.defaultLocale);
  } catch {
    // No header ("*") or a malformed tag names no language to match.
    return routing.defaultLocale;
  }
};

/** The saved choice, else the browser's languages, else the default: what the proxy picks. */
export const getPreferredLocale = (
  saved: string | undefined,
  acceptLanguage: string | undefined,
): Locale => {
  if (hasLocale(routing.locales, saved)) {
    return saved;
  }

  const matched = matchLanguages(acceptLanguage);

  return hasLocale(routing.locales, matched) ? matched : routing.defaultLocale;
};

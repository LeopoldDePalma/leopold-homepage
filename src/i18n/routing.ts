import {defineRouting} from 'next-intl/routing';

import {PREFERENCE_COOKIE_MAX_AGE} from '@/lib/cookies';

// Named here, not left to next-intl's default, because request.ts reads it outside `[locale]`.
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const routing = defineRouting({
  locales: ['en', 'ar', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'never',
  localeCookie: {name: LOCALE_COOKIE, maxAge: PREFERENCE_COOKIE_MAX_AGE},
});

export type Locale = (typeof routing.locales)[number];

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
  fr: 'ltr',
};

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
};

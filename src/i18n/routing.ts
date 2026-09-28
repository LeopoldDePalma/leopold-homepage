import {defineRouting} from 'next-intl/routing';

import {PREFERENCE_COOKIE_MAX_AGE} from '@/lib/cookies';

export const routing = defineRouting({
  locales: ['en', 'ar', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'never',
  localeCookie: {maxAge: PREFERENCE_COOKIE_MAX_AGE},
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

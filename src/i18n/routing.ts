import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
});

export type Locale = (typeof routing.locales)[number];

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
};

// Each language is named in its own script so it's recognisable to its readers.
export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
};

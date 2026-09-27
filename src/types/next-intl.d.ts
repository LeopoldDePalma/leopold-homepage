import type {Locale} from '@/i18n/routing';
import type messages from '@/messages/en.json';

declare module 'next-intl' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- merging needs it
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}

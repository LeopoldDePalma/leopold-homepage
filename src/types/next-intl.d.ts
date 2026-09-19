import type { Locale } from '@/i18n/routing';
import type messages from '@/messages/en.json';

declare module 'next-intl' {
  // Declaration merging requires an interface here.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}

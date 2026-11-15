import {getPreferredLocale} from '@/i18n/preferredLocale';

describe('getPreferredLocale', () => {
  it('keeps the language the visitor chose', () => {
    expect(getPreferredLocale('ar', 'fr-FR,fr;q=0.9')).toBe('ar');
  });

  it.each([
    ['the first supported language', undefined, 'de-DE,fr;q=0.8,ar;q=0.5', 'fr'],
    ['a regional variant', undefined, 'ar-EG', 'ar'],
    ['the quality order', undefined, 'en-US;q=0.1,fr;q=0.9', 'fr'],
    ['the browser when the saved value is unknown', 'xx', 'fr-FR', 'fr'],
  ])('follows %s', (_case, saved, acceptLanguage, locale) => {
    expect(getPreferredLocale(saved, acceptLanguage)).toBe(locale);
  });

  it.each([
    ['no header', undefined],
    ['any language', '*'],
    ['an unsupported language', 'de-DE'],
    ['a malformed tag', 'en_US'],
  ])('falls back to English for %s', (_case, acceptLanguage) => {
    expect(getPreferredLocale(undefined, acceptLanguage)).toBe('en');
  });
});

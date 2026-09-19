import '@/styles/globals.css';

import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {cn} from 'tailwind-variants';

import {LocaleSwitcher} from '@/components/LocaleSwitcher';
import {ThemeProvider} from '@/components/ThemeProvider';
import {ThemeToggle} from '@/components/ThemeToggle';
import {localeDirection, routing} from '@/i18n/routing';
import {fontVariables} from '@/styles/fonts';

export const dynamicParams = false;

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({locale}));
};

export const generateMetadata = async ({params}: LayoutProps<'/[locale]'>): Promise<Metadata> => {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({locale, namespace: 'Metadata'});

  return {
    title: {default: t('name'), template: `%s — ${t('name')}`},
    description: t('description'),
    icons: {icon: '/images/eagle.png'},
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  };
};

const LocaleLayout = async ({children, params}: LayoutProps<'/[locale]'>) => {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={`${fontVariables} h-full antialiased`}
      // next-themes sets the theme class on <html> before hydration.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <NextIntlClientProvider>
            <header
              className={cn(
                'mx-auto flex w-full max-w-2xl items-center justify-end gap-4',
                'px-4 pt-6',
              )}
            >
              <LocaleSwitcher />
              <ThemeToggle />
            </header>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;

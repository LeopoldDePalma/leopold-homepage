import '@/styles/globals.css';

import {keyBy, map, mapValues} from 'lodash-es';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {tv} from 'tailwind-variants';

import {SiteFooter} from '@/components/layout/SiteFooter';
import {SiteHeader} from '@/components/layout/SiteHeader';
import {ThemeScript} from '@/features/theme/ThemeScript';
import {type Locale, localeDirection, routing} from '@/i18n/routing';
import {fontVariables} from '@/styles/fonts';

const layout = tv({
  slots: {
    html: 'h-full antialiased',
    body: 'flex min-h-full flex-col',
    main: ['mx-auto w-full max-w-2xl flex-1', 'px-4 py-12'],
  },
});

const styles = layout();

export const dynamicParams = false;

type LocaleParams = {locale: Locale};

export const generateStaticParams = () => {
  // Explicit type arguments make lodash return a mutable array, as Next.js expects.
  return map<Locale, LocaleParams>(routing.locales, (locale) => ({locale}));
};

export const generateMetadata = async ({params}: LayoutProps<'/[locale]'>): Promise<Metadata> => {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({locale, namespace: 'Metadata'});

  return {
    title: {default: t('name'), template: `%s — ${t('name')}`},
    description: t('description'),
    icons: {
      icon: [
        {url: '/images/eagle.svg', type: 'image/svg+xml'},
        {url: '/images/eagle.png', type: 'image/png'},
      ],
    },
    alternates: {
      languages: mapValues(keyBy(routing.locales), (l) => `/${l}`),
    },
  };
};

const LocaleLayout = async ({children, params}: LayoutProps<'/[locale]'>) => {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={styles.html({className: fontVariables})}
      // The theme script sets the `dark` class on <html> before hydration.
      suppressHydrationWarning
    >
      <body className={styles.body()}>
        <ThemeScript />
        <NextIntlClientProvider>
          <SiteHeader />
          <main className={styles.main()}>{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;

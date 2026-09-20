import '@/styles/globals.css';

import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getTranslations} from 'next-intl/server';
import {tv} from 'tailwind-variants';

import {SiteFooter} from '@/components/layout/SiteFooter';
import {SiteHeader} from '@/components/layout/SiteHeader';
import {isTheme, THEME_COOKIE} from '@/features/theme/theme';
import {localeDirection} from '@/i18n/routing';
import {fontVariables} from '@/styles/fonts';

const localeLayout = tv({
  slots: {
    html: 'h-full antialiased',
    body: 'flex min-h-full flex-col',
    // A column so a page can stretch and push its own footnotes to the bottom.
    main: ['mx-auto flex w-full max-w-2xl flex-1 flex-col', 'px-4 py-12'],
  },
});

const {html, body, main} = localeLayout();

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('Site');

  return {
    title: t('name'),
    description: t('description'),
    icons: {
      icon: [
        {url: '/images/eagle.svg', type: 'image/svg+xml'},
        {url: '/images/eagle.png', type: 'image/png'},
      ],
    },
  };
};

const LocaleLayout = async ({children}: LayoutProps<'/[locale]'>) => {
  // Validated in `src/i18n/request.ts`: unknown locales end in notFound().
  const locale = await getLocale();
  // Rendered by the server so the theme is right in the first paint and React owns the attribute.
  const chosenTheme = (await cookies()).get(THEME_COOKIE)?.value;

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={html({className: fontVariables})}
      data-theme={isTheme(chosenTheme) ? chosenTheme : undefined}
    >
      <body className={body()}>
        <NextIntlClientProvider>
          <SiteHeader />
          <main className={main()}>{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;

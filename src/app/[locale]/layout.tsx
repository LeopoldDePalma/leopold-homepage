import {Flex} from '@chakra-ui/react';
import type {Metadata} from 'next';
import {cookies, headers} from 'next/headers';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getTranslations} from 'next-intl/server';

import {SiteFooter} from '@/components/layout/SiteFooter';
import {SiteHeader} from '@/components/layout/SiteHeader';
import {isTheme, THEME_COOKIE} from '@/features/theme/theme';
import {localeDirection} from '@/i18n/routing';
import {fontVariables} from '@/styles/fonts';
import {StyleProvider} from '@/styles/StyleProvider';

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
  // Set by the proxy together with the Content-Security-Policy it belongs to.
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={fontVariables}
      data-theme={isTheme(chosenTheme) ? chosenTheme : undefined}
    >
      <body>
        <StyleProvider locale={locale} nonce={nonce}>
          <NextIntlClientProvider>
            <SiteHeader />
            {/* A column, so a page can stretch and push its own footnotes to the bottom. */}
            <Flex
              as="main"
              direction="column"
              flex="1"
              w="full"
              maxW="2xl"
              mx="auto"
              px="4"
              py="12"
            >
              {children}
            </Flex>
            <SiteFooter />
          </NextIntlClientProvider>
        </StyleProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;

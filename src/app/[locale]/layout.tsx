import {Container} from '@chakra-ui/react';
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
  const locale = await getLocale();
  const chosenTheme = (await cookies()).get(THEME_COOKIE)?.value;
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
            <Container as="main" display="flex" flexDirection="column" flex="1" py="12">
              {children}
            </Container>
            <SiteFooter />
          </NextIntlClientProvider>
        </StyleProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;

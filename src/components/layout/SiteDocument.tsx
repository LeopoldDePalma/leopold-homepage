import {Container} from '@chakra-ui/react';
import {cookies, headers} from 'next/headers';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale} from 'next-intl/server';
import type {ReactNode} from 'react';

import {SiteFooter} from '@/components/layout/SiteFooter';
import {SiteHeader} from '@/components/layout/SiteHeader';
import {isTheme, THEME_COOKIE} from '@/features/theme/theme';
import {localeDirection} from '@/i18n/routing';
import {fontVariables} from '@/styles/fonts';
import {StyleProvider} from '@/styles/StyleProvider';

export const SiteDocument = async ({children}: {children: ReactNode}) => {
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

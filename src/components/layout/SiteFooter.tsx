import {Container, Stack, Text} from '@chakra-ui/react';
import {useTranslations} from 'next-intl';

import {externalLinkTags} from '@/components/ui/ExternalLink';
import {site} from '@/content/site';

export const SiteFooter = () => {
  const tSite = useTranslations('Site');
  const t = useTranslations('SiteFooter');

  // A string, so locales with digit grouping don't render "2,026".
  const year = String(new Date().getFullYear());

  return (
    <Container
      as="footer"
      display="flex"
      flexDirection="column"
      gap="2"
      py="8"
      textAlign="center"
      textStyle="sm"
      color="fg.muted"
    >
      <Text>{t('copyright', {year, name: tSite('name')})}</Text>
      <Stack gap="1" textStyle="xs">
        <Text>
          {t.rich(
            'modelCredit',
            externalLinkTags(site.modelCredit, {variant: 'credit', dir: 'ltr'}),
          )}
        </Text>
        <Text>{t.rich('armsCredit', externalLinkTags(site.armsCredit, {variant: 'credit'}))}</Text>
      </Stack>
    </Container>
  );
};

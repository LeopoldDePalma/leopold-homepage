import {Container, Text} from '@chakra-ui/react';
import {useTranslations} from 'next-intl';

import {renderCreditLink} from '@/components/ui/renderCreditLink';
import {site} from '@/content/site';

export const SiteFooter = () => {
  const tSite = useTranslations('Site');
  const t = useTranslations('SiteFooter');
  // A string, so locales with digit grouping don't render "2,026".
  const year = String(new Date().getFullYear());

  return (
    <Container as="footer" py="8" textAlign="center" textStyle="sm" color="fg.muted">
      <Text>{t('copyright', {year, name: tSite('name')})}</Text>
      <Text mt="2" textStyle="xs">
        {t.rich('modelCredit', {
          model: renderCreditLink(site.modelCredit.model, 'ltr'),
          author: renderCreditLink(site.modelCredit.author, 'ltr'),
          license: renderCreditLink(site.modelCredit.license, 'ltr'),
        })}
      </Text>
    </Container>
  );
};

import {Stack, Text} from '@chakra-ui/react';
import {useTranslations} from 'next-intl';
import type {ReactNode} from 'react';

import {ExternalLink} from '@/components/ui/ExternalLink';
import {site} from '@/content/site';

// Latin titles keep their own direction inside Arabic text.
const renderCreditLink = (href: string) => {
  const CreditLink = (chunks: ReactNode) => {
    return (
      <ExternalLink
        href={href}
        dir="ltr"
        // Inline, not Chakra's inline-flex: a long title has to wrap with the sentence.
        display="inline"
        color="inherit"
        textDecoration="underline"
        textUnderlineOffset="0.15em"
        _hover={{color: 'fg'}}
      >
        {chunks}
      </ExternalLink>
    );
  };

  return CreditLink;
};

export const SiteFooter = () => {
  const tSite = useTranslations('Site');
  const t = useTranslations('SiteFooter');
  // Passed as a string so locales with digit grouping don't render "2,026".
  const year = String(new Date().getFullYear());

  return (
    <Stack
      as="footer"
      gap="2"
      w="full"
      maxW="2xl"
      mx="auto"
      px="4"
      py="8"
      textAlign="center"
      textStyle="sm"
      color="fg.muted"
    >
      <Text>{t('copyright', {year, name: tSite('name')})}</Text>
      <Text textStyle="xs">
        {t.rich('modelCredit', {
          model: renderCreditLink(site.modelCredit.model),
          author: renderCreditLink(site.modelCredit.author),
          license: renderCreditLink(site.modelCredit.license),
        })}
      </Text>
    </Stack>
  );
};

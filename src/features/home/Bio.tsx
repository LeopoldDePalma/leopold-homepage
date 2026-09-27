import {Box, Grid} from '@chakra-ui/react';
import {keyBy, map, mapValues} from 'lodash-es';
import {useTranslations} from 'next-intl';
import type {ReactNode} from 'react';

import {BIO_ENTRIES} from '@/content/bio';
import {routing} from '@/i18n/routing';

const renderInLanguage = (lang: string) => {
  const Quote = (chunks: ReactNode) => <bdi lang={lang}>{chunks}</bdi>;

  return Quote;
};

// `<ar>…</ar>` in a message quotes a name in that language's script.
const LANGUAGE_TAGS = mapValues(keyBy(routing.locales), renderInLanguage);

export const Bio = () => {
  const t = useTranslations('HomePage.bio');

  return (
    <Grid as="dl" templateColumns="auto 1fr" columnGap="3" rowGap="2">
      {map(BIO_ENTRIES, (entry) => (
        <Grid key={entry.id} gridColumn="span 2" templateColumns="subgrid">
          <Box as="dt" fontFamily="heading" fontWeight="bold" whiteSpace="nowrap" color="accent">
            {'untilNow' in entry
              ? t('yearRange', {year: String(entry.year), untilNow: t('untilNow')})
              : entry.year}
          </Box>
          <Box as="dd" lineHeight="relaxed">
            {t.rich(entry.id, LANGUAGE_TAGS)}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

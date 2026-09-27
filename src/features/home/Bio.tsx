import {Box, Grid} from '@chakra-ui/react';
import {map} from 'lodash-es';
import {useTranslations} from 'next-intl';
import type {ReactNode} from 'react';

import {BIO_ENTRIES} from '@/content/bio';

// Every name is followed by its spelling in the other locale, as on the reference site.
// `bdi` isolates the fragment so the brackets around it keep their place in either direction.
const renderArabic = (chunks: ReactNode) => <bdi lang="ar">{chunks}</bdi>;
const renderEnglish = (chunks: ReactNode) => <bdi lang="en">{chunks}</bdi>;

export const Bio = () => {
  const t = useTranslations('HomePage.bio');

  return (
    <Grid as="dl" templateColumns="auto 1fr" columnGap="3" rowGap="2">
      {map(BIO_ENTRIES, (entry) => (
        // Subgrid keeps every event aligned, however wide the year next to it is.
        <Grid key={entry.id} gridColumn="span 2" templateColumns="subgrid">
          <Box as="dt" fontFamily="heading" fontWeight="bold" whiteSpace="nowrap" color="accent">
            {'untilNow' in entry
              ? t('yearRange', {year: String(entry.year), untilNow: t('untilNow')})
              : entry.year}
          </Box>
          <Box as="dd" lineHeight="relaxed">
            {t.rich(entry.id, {ar: renderArabic, en: renderEnglish})}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

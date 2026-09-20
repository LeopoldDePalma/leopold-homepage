import {map} from 'lodash-es';
import {useTranslations} from 'next-intl';
import type {ReactNode} from 'react';
import {tv} from 'tailwind-variants';

import {BIO_ENTRIES} from '@/content/bio';

const bio = tv({
  slots: {
    root: 'grid grid-cols-[auto_1fr] gap-x-3 gap-y-2',
    // Subgrid keeps every event aligned, however wide the year next to it is.
    entry: 'col-span-2 grid grid-cols-subgrid',
    year: ['shrink-0', 'font-heading font-bold', 'whitespace-nowrap', 'text-accent'],
    event: 'leading-relaxed',
  },
});

const {root, entry: entryRow, year, event} = bio();

// Every name is followed by its spelling in the other locale, as on the reference site.
// `bdi` isolates the fragment so the brackets around it keep their place in either direction.
const renderArabic = (chunks: ReactNode) => <bdi lang="ar">{chunks}</bdi>;
const renderEnglish = (chunks: ReactNode) => <bdi lang="en">{chunks}</bdi>;

export const Bio = () => {
  const t = useTranslations('HomePage.bio');

  return (
    <dl className={root()}>
      {map(BIO_ENTRIES, (entry) => (
        <div key={entry.id} className={entryRow()}>
          <dt className={year()}>
            {'untilNow' in entry
              ? t('yearRange', {year: String(entry.year), untilNow: t('untilNow')})
              : entry.year}
          </dt>
          <dd className={event()}>{t.rich(entry.id, {ar: renderArabic, en: renderEnglish})}</dd>
        </div>
      ))}
    </dl>
  );
};

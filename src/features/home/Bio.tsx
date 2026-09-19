import {map} from 'lodash-es';
import {useTranslations} from 'next-intl';
import {tv} from 'tailwind-variants';

import {BIO_ENTRIES} from '@/content/bio';

const bio = tv({
  slots: {
    root: 'flex flex-col gap-2',
    entry: 'flex gap-3',
    year: ['shrink-0', 'font-heading font-bold', 'whitespace-nowrap', 'text-accent'],
    event: 'leading-relaxed',
  },
});

const {root, entry: entryRow, year, event} = bio();

export const Bio = () => {
  const t = useTranslations('HomePage.bio');

  return (
    <dl className={root()}>
      {map(BIO_ENTRIES, (entry) => (
        <div key={entry.id} className={entryRow()}>
          <dt className={year()}>
            {entry.year}
            {'untilNow' in entry ? ` — ${t('untilNow')}` : ''}
          </dt>
          <dd className={event()}>{t(entry.id)}</dd>
        </div>
      ))}
    </dl>
  );
};

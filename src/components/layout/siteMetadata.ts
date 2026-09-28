import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';

export const getSiteMetadata = async (): Promise<Metadata> => {
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

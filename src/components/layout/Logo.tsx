import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {tv} from 'tailwind-variants';

import {Link} from '@/i18n/navigation';

const logo = tv({
  slots: {
    root: ['group flex items-center', 'gap-[0.5em]', 'font-heading text-xl font-bold'],
    // The eagle tilts towards the reading direction on hover.
    emblem: [
      'size-[1.4em]',
      'transition-transform duration-300 motion-reduce:transition-none',
      'group-hover:-rotate-12 rtl:group-hover:rotate-12',
    ],
    // Hidden visually on narrow screens but kept as the link's accessible name.
    name: 'sr-only sm:not-sr-only',
  },
});

const {root, emblem, name} = logo();

export const Logo = () => {
  const t = useTranslations('Site');

  return (
    <Link href="/" className={root()}>
      <Image src="/images/eagle.svg" alt="" width={32} height={32} className={emblem()} />
      <span className={name()}>{t('name')}</span>
    </Link>
  );
};

import {map} from 'lodash-es';
import {useFormatter, useTranslations} from 'next-intl';
import {tv} from 'tailwind-variants';

import {Section} from '@/components/ui/Section';
import {Typewriter} from '@/components/ui/Typewriter';
import {HelmetShowcase} from '@/features/helmet/HelmetShowcase';
import {ProfileHeader} from '@/features/home/ProfileHeader';
import {SocialLinks} from '@/features/home/SocialLinks';

const homePage = tv({
  slots: {
    root: 'flex flex-col gap-10',
    greeting: ['p-4', 'rounded-lg', 'text-center', 'bg-foreground/5'],
    paragraph: 'leading-relaxed',
  },
});

const {root, greeting, paragraph} = homePage();

const INTERESTS = ['programming', 'history', 'books', 'music'] as const;

const HomePage = () => {
  const t = useTranslations('HomePage');
  const format = useFormatter();
  const interests = map(INTERESTS, (interest) => t(`interests.${interest}`));

  return (
    <div className={root()}>
      <HelmetShowcase />

      <Typewriter text={t('greeting')} className={greeting()} />

      <ProfileHeader />

      <Section title={t('about.title')}>
        <p className={paragraph()}>{t('about.text')}</p>
      </Section>

      <Section title={t('interests.title')}>
        <p className={paragraph()}>{format.list(interests, {type: 'conjunction'})}</p>
      </Section>

      <Section title={t('web.title')}>
        <SocialLinks />
      </Section>
    </div>
  );
};

export default HomePage;

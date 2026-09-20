import {map} from 'lodash-es';
import {getFormatter, getTranslations} from 'next-intl/server';
import {tv} from 'tailwind-variants';

import {Section} from '@/components/ui/Section';
import {Typewriter} from '@/components/ui/Typewriter';
import {HelmetShowcase} from '@/features/helmet/HelmetShowcase';
import {Bio} from '@/features/home/Bio';
import {ContactButton} from '@/features/home/ContactButton';
import {ProfileHeader} from '@/features/home/ProfileHeader';
import {SocialLinks} from '@/features/home/SocialLinks';
import {getListening} from '@/features/spotify/api';
import {MUSIC_POPOVER_ID} from '@/features/spotify/MusicToggle';

const homePage = tv({
  slots: {
    root: 'flex flex-col gap-10',
    greeting: ['p-4', 'rounded-lg', 'text-center', 'bg-foreground/5'],
    paragraph: 'leading-relaxed',
    // Opens the same panel as the header button; the wax-seal red marks it as a control.
    musicTrigger: [
      'underline underline-offset-4',
      'text-seal',
      'transition-opacity hover:opacity-80',
    ],
  },
});

const {root, greeting, paragraph, musicTrigger} = homePage();

const INTERESTS = ['programming', 'history', 'books', 'music'] as const;

const HomePage = async () => {
  const t = await getTranslations('HomePage');
  const format = await getFormatter();
  // The trigger only makes sense while there is a panel to open.
  const listening = await getListening();
  const interests = map(INTERESTS, (interest) =>
    interest === 'music' && listening ? (
      <button
        key={interest}
        type="button"
        popoverTarget={MUSIC_POPOVER_ID}
        className={musicTrigger()}
      >
        {t(`interests.${interest}`)}
      </button>
    ) : (
      t(`interests.${interest}`)
    ),
  );

  return (
    <div className={root()}>
      <HelmetShowcase />

      <Typewriter text={t('greeting')} className={greeting()} />

      <ProfileHeader />

      <Section title={t('about.title')}>
        <p className={paragraph()}>{t('about.text')}</p>
      </Section>

      <Section title={t('bio.title')}>
        <Bio />
      </Section>

      <Section title={t('interests.title')}>
        <p className={paragraph()}>{format.list(interests, {type: 'conjunction'})}</p>
      </Section>

      <Section title={t('contact.title')}>
        <SocialLinks />
        <ContactButton />
      </Section>
    </div>
  );
};

export default HomePage;

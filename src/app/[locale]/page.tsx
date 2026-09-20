import {map} from 'lodash-es';
import {getFormatter, getTranslations} from 'next-intl/server';
import {tv} from 'tailwind-variants';

import {Section} from '@/components/ui/Section';
import {Typewriter} from '@/components/ui/Typewriter';
import {site} from '@/content/site';
import {HelmetShowcase} from '@/features/helmet/HelmetShowcase';
import {Bio} from '@/features/home/Bio';
import {ContactButton} from '@/features/home/ContactButton';
import {ProfileHeader} from '@/features/home/ProfileHeader';
import {SocialLinks} from '@/features/home/SocialLinks';
import {MUSIC_POPOVER_ID} from '@/features/music/MusicToggle';
import {getListening} from '@/features/music/spotify';

const homePage = tv({
  slots: {
    root: 'flex flex-col gap-10',
    greeting: ['p-4', 'rounded-lg', 'text-center', 'bg-foreground/5'],
    paragraph: 'leading-relaxed',
    // Wax-seal red marks the two interests that do something when clicked.
    interestLink: [
      'underline underline-offset-4',
      'text-seal',
      'transition-opacity hover:opacity-80',
    ],
  },
});

const {root, greeting, paragraph, interestLink} = homePage();

const INTERESTS = ['programming', 'history', 'heraldry', 'books', 'music'] as const;

const HomePage = async () => {
  const t = await getTranslations('HomePage');
  const format = await getFormatter();
  const listening = await getListening();
  const interests = map(INTERESTS, (interest) => {
    const label = t(`interests.${interest}`);

    if (interest === 'heraldry') {
      return (
        <a
          key={interest}
          href={site.links.heraldry}
          target="_blank"
          rel="noopener noreferrer"
          className={interestLink()}
        >
          {label}
        </a>
      );
    }

    // The trigger only makes sense while there is a panel to open.
    if (interest === 'music' && listening) {
      return (
        <button
          key={interest}
          type="button"
          popoverTarget={MUSIC_POPOVER_ID}
          className={interestLink()}
        >
          {label}
        </button>
      );
    }

    return label;
  });

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

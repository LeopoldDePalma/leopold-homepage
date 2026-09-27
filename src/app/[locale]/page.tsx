import {Stack, type SystemStyleObject, Text} from '@chakra-ui/react';
import {map} from 'lodash-es';
import {getFormatter, getTranslations} from 'next-intl/server';

import {ExternalLink} from '@/components/ui/ExternalLink';
import {Section} from '@/components/ui/Section';
import {Typewriter} from '@/components/ui/Typewriter';
import {site} from '@/content/site';
import {HelmetShowcase} from '@/features/helmet/HelmetShowcase';
import {Bio} from '@/features/home/Bio';
import {ContactButton} from '@/features/home/ContactButton';
import {ProfileHeader} from '@/features/home/ProfileHeader';
import {SocialLinks} from '@/features/home/SocialLinks';
import {MusicMention} from '@/features/music/MusicMention';
import {getListening} from '@/features/music/spotify';

const INTEREST_LINK = {
  display: 'inline',
  color: 'seal',
  textDecoration: 'underline',
  textUnderlineOffset: '0.25em',
  transitionProperty: 'opacity',
  transitionDuration: 'moderate',
  _hover: {opacity: 0.8},
} satisfies SystemStyleObject;

const INTERESTS = ['programming', 'history', 'heraldry', 'books', 'music'] as const;

const HomePage = async () => {
  const t = await getTranslations('HomePage');
  const format = await getFormatter();
  const listening = await getListening();
  const interests = map(INTERESTS, (interest) => {
    const label = t(`interests.${interest}`);

    if (interest === 'heraldry') {
      return (
        <ExternalLink key={interest} href={site.links.heraldry} {...INTEREST_LINK}>
          {label}
        </ExternalLink>
      );
    }

    if (interest === 'music' && listening) {
      return (
        <MusicMention key={interest} {...INTEREST_LINK}>
          {label}
        </MusicMention>
      );
    }

    return label;
  });

  return (
    <Stack gap="10">
      <HelmetShowcase />

      <Typewriter text={t('greeting')} p="4" rounded="lg" textAlign="center" bg="fg/5" />

      <ProfileHeader />

      <Section title={t('about.title')}>
        <Text lineHeight="relaxed">{t('about.text')}</Text>
      </Section>

      <Section title={t('bio.title')}>
        <Bio />
      </Section>

      <Section title={t('interests.title')}>
        <Text lineHeight="relaxed">{format.list(interests, {type: 'conjunction'})}</Text>
      </Section>

      <Section title={t('contact.title')}>
        <SocialLinks />
        <ContactButton />
      </Section>
    </Stack>
  );
};

export default HomePage;

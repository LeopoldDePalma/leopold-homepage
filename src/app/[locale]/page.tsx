import {Stack, Text} from '@chakra-ui/react';
import {getTranslations} from 'next-intl/server';

import {Section} from '@/components/ui/Section';
import {Typewriter} from '@/components/ui/Typewriter';
import {site} from '@/content/site';
import {ContributionGraph} from '@/features/github/ContributionGraph';
import {getContributionCalendar} from '@/features/github/github';
import {HelmetShowcase} from '@/features/helmet/HelmetShowcase';
import {Bio} from '@/features/home/Bio';
import {Contact} from '@/features/home/Contact';
import {Interests} from '@/features/home/Interests';
import {ProfileHeader} from '@/features/home/ProfileHeader';

const HomePage = async () => {
  const t = await getTranslations('HomePage');
  const contributions = await getContributionCalendar();

  return (
    <Stack gap="10">
      <HelmetShowcase />

      <Typewriter text={t('greeting')} p="4" rounded="lg" textAlign="center" bg="fg/5" />

      <ProfileHeader />

      <Section title={t('about.title')}>
        <Text lineHeight="tall">{t('about.text')}</Text>
      </Section>

      <Section title={t('bio.title')}>
        <Bio />
      </Section>

      <Section title={t('interests.title')}>
        <Interests />
      </Section>

      {contributions ? (
        <Section title={site.profiles.github.name}>
          <ContributionGraph calendar={contributions} />
        </Section>
      ) : null}

      <Section title={t('contact.title')}>
        <Contact />
      </Section>
    </Stack>
  );
};

export default HomePage;

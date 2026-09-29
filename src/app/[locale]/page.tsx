import {Flex, Icon, Stack, type SystemStyleObject, Text} from '@chakra-ui/react';
import {IconBrandGithub, IconBrandLinkedin} from '@tabler/icons-react';
import {map} from 'lodash-es';
import {Mail} from 'lucide-react';
import {getFormatter, getTranslations} from 'next-intl/server';

import {BrandButton} from '@/components/ui/BrandButton';
import {EXTERNAL_LINK, ExternalLink} from '@/components/ui/ExternalLink';
import {Section} from '@/components/ui/Section';
import {Typewriter} from '@/components/ui/Typewriter';
import {site} from '@/content/site';
import {ContributionGraph} from '@/features/github/ContributionGraph';
import {getContributionCalendar} from '@/features/github/github';
import {HelmetShowcase} from '@/features/helmet/HelmetShowcase';
import {Bio} from '@/features/home/Bio';
import {ProfileHeader} from '@/features/home/ProfileHeader';
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

const PROFILE_BUTTONS = [
  {palette: 'linkedin', BrandIcon: IconBrandLinkedin, ...site.profiles.linkedin},
  {palette: 'github', BrandIcon: IconBrandGithub, ...site.profiles.github},
] as const;

const INTERESTS = ['programming', 'history', 'heraldry', 'books', 'music'] as const;

const HomePage = async () => {
  const t = await getTranslations('HomePage');
  const format = await getFormatter();
  const [listening, contributions] = await Promise.all([getListening(), getContributionCalendar()]);

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

      {contributions ? (
        <Section title={site.profiles.github.name}>
          <ContributionGraph calendar={contributions} />
        </Section>
      ) : null}

      <Section title={t('contact.title')}>
        <Stack gap="20">
          <Text lineHeight="relaxed">{t('contact.text')}</Text>
          <Flex wrap="wrap" justify="center" gap="3">
            <BrandButton href={`mailto:${site.email}`} colorPalette="mail" borderColor="ink/10">
              <Icon color="seal">
                <Mail />
              </Icon>
              {t('contact.action')}
            </BrandButton>
            {map(PROFILE_BUTTONS, ({name, url, palette, BrandIcon}) => (
              <BrandButton key={name} href={url} {...EXTERNAL_LINK} colorPalette={palette}>
                <Icon>
                  <BrandIcon />
                </Icon>
                <bdi lang="en">{name}</bdi>
              </BrandButton>
            ))}
          </Flex>
        </Stack>
      </Section>
    </Stack>
  );
};

export default HomePage;

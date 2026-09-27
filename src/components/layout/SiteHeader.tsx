import {Box, Container, Flex, Icon, Text} from '@chakra-ui/react';
import {IconBrandGithub} from '@tabler/icons-react';
import {getTranslations} from 'next-intl/server';

import {ExternalLink} from '@/components/ui/ExternalLink';
import {site} from '@/content/site';
import {MusicToggle} from '@/features/music/MusicToggle';
import {getListening} from '@/features/music/spotify';
import {ThemeToggle} from '@/features/theme/ThemeToggle';

import {LocaleSwitcher} from './LocaleSwitcher';
import {Logo} from './Logo';

export const SiteHeader = async () => {
  const t = await getTranslations('SiteHeader');
  const listening = await getListening();

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="sticky"
      bg="bg/60"
      backdropFilter="auto"
      backdropBlur="md"
    >
      <Container display="flex" alignItems="center" gap="4" py="3">
        <Logo />

        <Flex as="nav" aria-label={t('navLabel')} ms="auto">
          <ExternalLink href={site.links.source} variant="muted" gap="0.4em" textStyle="sm">
            <Icon asChild boxSize="1.2em">
              <IconBrandGithub aria-hidden />
            </Icon>
            <Text as="span" srOnly={{base: true, sm: false}}>
              {t('source')}
            </Text>
          </ExternalLink>
        </Flex>

        <LocaleSwitcher />
        {listening ? <MusicToggle initial={listening} /> : null}
        <ThemeToggle />
      </Container>
    </Box>
  );
};

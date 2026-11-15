import {Box, Flex, Heading, Stack, Text} from '@chakra-ui/react';
import {useTranslations} from 'next-intl';

import {OptimizedImage} from '@/components/ui/OptimizedImage';

const GOLD = '{colors.accent}';
const SHINE = `color-mix(in srgb, ${GOLD}, {colors.paper} 55%)`;
const SHADE = `color-mix(in srgb, ${GOLD}, {colors.ink} 45%)`;
// Polished gilt: light catches the ring at two points, as on a metal bezel.
const giltStops = [GOLD, SHINE, GOLD, SHADE, GOLD, SHINE, GOLD, SHADE, GOLD];
const GILT_BEZEL = `conic-gradient(from 200deg, ${giltStops.join(', ')})`;

export const ProfileHeader = () => {
  const tSite = useTranslations('Site');
  const t = useTranslations('ProfileHeader');

  return (
    <Flex align="center" gap="6">
      <Stack flex="1" gap="1">
        <Heading as="h1" fontSize="4xl">
          {tSite('name')}
        </Heading>
        <Text color="fg.muted">{t('role')}</Text>
      </Stack>
      <Box flexShrink="0" p="0.1875rem" rounded="full" bgImage={GILT_BEZEL} shadow="md">
        <OptimizedImage
          src="/images/avatar.jpg"
          alt={t('photoAlt', {name: tSite('name')})}
          width={640}
          height={640}
          sizes="7rem"
          loading="eager"
          boxSize="28"
          rounded="full"
        />
      </Box>
    </Flex>
  );
};

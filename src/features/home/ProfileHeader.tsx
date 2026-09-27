import {Box, Flex, Heading, Text} from '@chakra-ui/react';
import {useTranslations} from 'next-intl';

import {OptimizedImage} from '@/components/ui/OptimizedImage';

const GOLD = '{colors.accent}';
const SHINE = `color-mix(in srgb, ${GOLD}, {colors.paper} 55%)`;
const SHADE = `color-mix(in srgb, ${GOLD}, {colors.ink} 45%)`;
// Polished gilt: light catches the ring at two points, as on a metal bezel.
const GILT_STOPS = [GOLD, SHINE, GOLD, SHADE, GOLD, SHINE, GOLD, SHADE, GOLD];
const GILT_BEZEL = `conic-gradient(from 200deg, ${GILT_STOPS.join(', ')})`;

export const ProfileHeader = () => {
  const tSite = useTranslations('Site');
  const t = useTranslations('ProfileHeader');

  return (
    <Flex align="center" gap="6">
      <Box flex="1">
        <Heading as="h1" fontSize="4xl">
          {tSite('name')}
        </Heading>
        <Text mt="1" color="fg.muted">
          {t('role')}
        </Text>
      </Box>
      <Box flexShrink="0" p="0.1875rem" rounded="full" bgImage={GILT_BEZEL} shadow="md">
        <OptimizedImage
          src="/images/avatar.jpg"
          alt={t('photoAlt', {name: tSite('name')})}
          width={640}
          height={640}
          sizes="7rem"
          loading="eager"
          display="block"
          boxSize="28"
          rounded="full"
          borderWidth="3px"
          borderColor="bg"
        />
      </Box>
    </Flex>
  );
};

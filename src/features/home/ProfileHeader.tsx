import {Box, Flex, Heading, Text} from '@chakra-ui/react';
import {useTranslations} from 'next-intl';

import {OptimizedImage} from '@/components/ui/OptimizedImage';

export const ProfileHeader = () => {
  const tSite = useTranslations('Site');
  const t = useTranslations('ProfileHeader');

  return (
    <Flex align="center" gap="6">
      <Box flex="1">
        <Heading as="h1" fontSize="4xl" fontWeight="bold">
          {tSite('name')}
        </Heading>
        <Text mt="1" color="fg.muted">
          {t('role')}
        </Text>
      </Box>
      <OptimizedImage
        src="/images/avatar.jpg"
        alt={t('photoAlt', {name: tSite('name')})}
        width={640}
        height={640}
        sizes="7rem"
        loading="eager"
        boxSize="28"
        flexShrink="0"
        rounded="full"
        borderWidth="2px"
        borderColor="accent"
      />
    </Flex>
  );
};

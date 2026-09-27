'use client';

import {Button, Heading, Stack, Text} from '@chakra-ui/react';
import {useTranslations} from 'next-intl';

const ErrorPage = ({retry}: {retry: () => void}) => {
  const t = useTranslations('ErrorPage');

  return (
    <Stack align="start" gap="4">
      <Heading as="h1" fontSize="3xl">
        {t('title')}
      </Heading>
      <Text color="fg.muted">{t('description')}</Text>
      <Button variant="quiet" onClick={retry}>
        {t('retry')}
      </Button>
    </Stack>
  );
};

export default ErrorPage;

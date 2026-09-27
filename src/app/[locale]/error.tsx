'use client';

import {Heading, Stack, Text} from '@chakra-ui/react';
import {useTranslations} from 'next-intl';
import {useEffect} from 'react';

import {OutlineButton} from '@/components/ui/OutlineButton';

/** Shown when a page below the layout fails to render; `retry()` re-renders that segment. */
const ErrorPage = ({error, retry}: {error: Error & {digest?: string}; retry: () => void}) => {
  const t = useTranslations('ErrorPage');

  useEffect(() => {
    // No error reporting service here, so the console is where this goes.
    console.error(error);
  }, [error]);

  const handleRetry = () => {
    retry();
  };

  return (
    <Stack align="start" gap="4">
      <Heading as="h1" fontSize="3xl" fontWeight="bold">
        {t('title')}
      </Heading>
      <Text color="fg.muted">{t('description')}</Text>
      <OutlineButton onClick={handleRetry}>{t('retry')}</OutlineButton>
    </Stack>
  );
};

export default ErrorPage;

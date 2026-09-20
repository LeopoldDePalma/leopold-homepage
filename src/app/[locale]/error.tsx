'use client';

import {useTranslations} from 'next-intl';
import {useEffect} from 'react';
import {tv} from 'tailwind-variants';

import {OutlineButton} from '@/components/ui/OutlineButton';

const errorPage = tv({
  slots: {
    root: 'flex flex-col items-start gap-4',
    heading: 'font-heading text-3xl font-bold',
    description: 'text-muted',
  },
});

const {root, heading, description} = errorPage();

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
    <div className={root()}>
      <h1 className={heading()}>{t('title')}</h1>
      <p className={description()}>{t('description')}</p>
      <OutlineButton onClick={handleRetry}>{t('retry')}</OutlineButton>
    </div>
  );
};

export default ErrorPage;

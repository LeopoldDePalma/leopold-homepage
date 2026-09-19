'use client';

import {useServerInsertedHTML} from 'next/navigation';
import {useEffect, useRef} from 'react';

import {usePathname} from '@/i18n/navigation';

import {restoreTheme, themeScript} from './theme';

/**
 * Injects the theme script into the server-rendered HTML stream, outside the React tree:
 * it runs before the first paint and React never renders a <script> element on the client.
 */
export const ThemeScript = () => {
  const isInserted = useRef(false);
  const pathname = usePathname();

  useServerInsertedHTML(() => {
    if (isInserted.current) {
      return null;
    }

    isInserted.current = true;

    return <script dangerouslySetInnerHTML={{__html: themeScript}} />;
  });

  // Switching locale re-renders the root layout, and React strips attributes it doesn't own.
  useEffect(() => {
    restoreTheme();
  }, [pathname]);

  return null;
};

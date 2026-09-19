'use client';

import {useServerInsertedHTML} from 'next/navigation';
import {useRef} from 'react';

import {themeScript} from './theme';

/**
 * Injects the theme script into the server-rendered HTML stream, outside the React tree:
 * it runs before the first paint and React never renders a <script> element on the client.
 */
export const ThemeScript = () => {
  const isInserted = useRef(false);

  useServerInsertedHTML(() => {
    if (isInserted.current) return null;
    isInserted.current = true;

    return <script dangerouslySetInnerHTML={{__html: themeScript}} />;
  });

  return null;
};

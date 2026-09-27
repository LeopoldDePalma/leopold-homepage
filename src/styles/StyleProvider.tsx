'use client';

import {ChakraProvider, LocaleProvider} from '@chakra-ui/react';
import createCache from '@emotion/cache';
import {CacheProvider} from '@emotion/react';
import {filter, isString, map} from 'lodash-es';
import {useServerInsertedHTML} from 'next/navigation';
import {type ReactNode, useState} from 'react';

import {system} from './system';

// Streams the styles Emotion writes during a server render into the HTML, with the CSP nonce.
const createStyleCache = (nonce: string | undefined) => {
  const cache = createCache({key: 'css', nonce});
  const insert = cache.insert;
  let insertedNames: string[] = [];

  cache.compat = true;

  cache.insert = (...args) => {
    const [, serialized] = args;

    if (cache.inserted[serialized.name] === undefined) {
      insertedNames.push(serialized.name);
    }

    return insert(...args);
  };

  const flush = () => {
    const names = insertedNames;

    insertedNames = [];

    return names;
  };

  return {cache, flush};
};

type StyleProviderProps = {
  locale: string;
  nonce: string | undefined;
  children: ReactNode;
};

export const StyleProvider = ({locale, nonce, children}: StyleProviderProps) => {
  const [{cache, flush}] = useState(() => createStyleCache(nonce));

  useServerInsertedHTML(() => {
    const names = flush();

    if (names.length === 0) {
      return null;
    }

    const styles = filter(
      map(names, (name) => cache.inserted[name]),
      isString,
    ).join('');

    return (
      <style
        nonce={nonce}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{__html: styles}}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ChakraProvider value={system}>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};

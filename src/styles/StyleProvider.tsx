'use client';

import {ChakraProvider, LocaleProvider} from '@chakra-ui/react';
import createCache from '@emotion/cache';
import {CacheProvider} from '@emotion/react';
import {filter, isString, map} from 'lodash-es';
import {useServerInsertedHTML} from 'next/navigation';
import {type ReactNode, useState} from 'react';

import {system} from './system';

/*
 * Emotion writes Chakra's styles at runtime. On the server the styles each render produces are
 * collected here and streamed as a <style> tag ahead of the markup that uses them, so the first
 * paint is already styled. Every tag carries the request's CSP nonce, both these and the ones the
 * browser adds later.
 */
const createStyleCache = (nonce: string | undefined) => {
  const cache = createCache({key: 'css', nonce});
  const insert = cache.insert;
  let insertedNames: string[] = [];

  // Stops Emotion from writing its own <style> tags into the markup; the registry does that.
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
  /** Tells Chakra's positioned parts (popovers and the like) which way the text runs. */
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
        // Serialised CSS from our own styles, not user input.
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

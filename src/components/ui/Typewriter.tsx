'use client';

import {Span, Text, type TextProps} from '@chakra-ui/react';
import {useLocale} from 'next-intl';
import {useEffect, useState} from 'react';

import {usePrefersReducedMotion} from '@/lib/hooks/usePrefersReducedMotion';

const TYPING_DELAY_MS = 45;

// Both layers share one grid cell, so the full text reserves the final size.
const sharedCell = {gridColumn: '1', gridRow: '1'} as const;

export const Typewriter = ({text, ...props}: {text: string} & Omit<TextProps, 'children'>) => {
  const locale = useLocale();
  const [typedCount, setTypedCount] = useState(0);
  const [typedText, setTypedText] = useState(text);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Graphemes keep Arabic letters together with their diacritics.
  const segments = new Intl.Segmenter(locale, {granularity: 'grapheme'}).segment(text);
  const graphemes = Array.from(segments, (segment) => segment.segment);

  if (typedText !== text) {
    setTypedText(text);
    setTypedCount(0);
  }

  // The caret shows only while letters are still coming.
  const typing = !prefersReducedMotion && typedCount < graphemes.length;

  useEffect(() => {
    if (!typing) {
      return;
    }

    const timer = setTimeout(() => setTypedCount(typedCount + 1), TYPING_DELAY_MS);

    return () => clearTimeout(timer);
  }, [typing, typedCount]);

  return (
    <Text display="grid" {...props}>
      <Span srOnly>{text}</Span>
      <Span {...sharedCell} visibility="hidden">
        {text}
      </Span>
      <Span aria-hidden {...sharedCell}>
        {prefersReducedMotion ? text : graphemes.slice(0, typedCount).join('')}
        {typing ? (
          <Span
            display="inline-block"
            ms="0.05em"
            h="1em"
            w="0.1em"
            verticalAlign="-0.1em"
            bg="accent"
            animation="caret 1s steps(1) infinite"
          />
        ) : null}
      </Span>
    </Text>
  );
};

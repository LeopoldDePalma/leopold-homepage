'use client';

import {chakra, Text, type TextProps} from '@chakra-ui/react';
import {useLocale} from 'next-intl';
import {useEffect, useState} from 'react';

import {usePrefersReducedMotion} from '@/lib/hooks/usePrefersReducedMotion';

const TYPING_DELAY_MS = 45;

// Both layers share one grid cell, so the full text reserves the final size up front.
const SHARED_CELL = {gridColumn: '1', gridRow: '1'} as const;

/** Types the text out once. Screen readers and reduced-motion users get it in full right away. */
export const Typewriter = ({text, ...props}: {text: string} & Omit<TextProps, 'children'>) => {
  const locale = useLocale();
  // Graphemes, not code units: keeps Arabic letters together with their diacritics.
  const segments = new Intl.Segmenter(locale, {granularity: 'grapheme'}).segment(text);
  const graphemes = Array.from(segments, (segment) => segment.segment);
  const [typedCount, setTypedCount] = useState(0);
  const [typedText, setTypedText] = useState(text);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Switching locale replaces the text mid-flight, so the new one is typed from its first letter.
  if (typedText !== text) {
    setTypedText(text);
    setTypedCount(0);
  }

  useEffect(() => {
    const isDone = typedCount >= graphemes.length;

    if (isDone || prefersReducedMotion) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setTypedCount(typedCount + 1);
    }, TYPING_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [typedCount, graphemes.length, prefersReducedMotion]);

  return (
    <Text display="grid" {...props}>
      <chakra.span srOnly>{text}</chakra.span>
      <chakra.span {...SHARED_CELL} visibility="hidden">
        {text}
      </chakra.span>
      <chakra.span aria-hidden {...SHARED_CELL}>
        {prefersReducedMotion ? text : graphemes.slice(0, typedCount).join('')}
        {!prefersReducedMotion && (
          <chakra.span
            display="inline-block"
            ms="0.05em"
            h="1em"
            w="0.1em"
            verticalAlign="-0.1em"
            bg="accent"
            animation="caret 1s steps(1) infinite"
          />
        )}
      </chakra.span>
    </Text>
  );
};

'use client';

import {useLocale} from 'next-intl';
import {useEffect, useState} from 'react';
import {tv} from 'tailwind-variants';

import {usePrefersReducedMotion} from '@/lib/hooks/usePrefersReducedMotion';

const TYPING_DELAY_MS = 45;

const typewriter = tv({
  slots: {
    // Both layers share one grid cell, so the full text reserves the final size up front.
    root: 'grid',
    placeholder: ['col-start-1 row-start-1', 'invisible'],
    typed: 'col-start-1 row-start-1',
    caret: [
      'inline-block',
      'ms-[0.05em] h-[1em] w-[0.1em]',
      'bg-accent align-[-0.1em]',
      'animate-caret',
    ],
  },
});

const {root, placeholder, typed, caret} = typewriter();

/** Types the text out once. Screen readers and reduced-motion users get it in full right away. */
export const Typewriter = ({text, className}: {text: string; className?: string}) => {
  const locale = useLocale();
  // Graphemes, not code units: keeps Arabic letters together with their diacritics.
  const segments = new Intl.Segmenter(locale, {granularity: 'grapheme'}).segment(text);
  const graphemes = Array.from(segments, (segment) => segment.segment);
  const [typedCount, setTypedCount] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

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
    <p className={root({className})}>
      <span className="sr-only">{text}</span>
      <span className={placeholder()}>{text}</span>
      <span aria-hidden className={typed()}>
        {prefersReducedMotion ? text : graphemes.slice(0, typedCount).join('')}
        {!prefersReducedMotion && <span className={caret()} />}
      </span>
    </p>
  );
};

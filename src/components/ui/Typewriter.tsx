'use client';

import {map} from 'lodash-es';
import {useLocale} from 'next-intl';
import {useEffect, useState} from 'react';
import {tv} from 'tailwind-variants';

const TYPING_DELAY_MS = 45;

const typewriter = tv({
  slots: {
    // Both layers share one grid cell, so the full text reserves the final size up front.
    root: 'grid',
    placeholder: ['col-start-1 row-start-1', 'invisible motion-reduce:visible'],
    typed: ['col-start-1 row-start-1', 'motion-reduce:hidden'],
    caret: [
      'inline-block',
      'ms-[0.05em] h-[1em] w-[0.1em]',
      'bg-accent align-[-0.1em]',
      'animate-caret',
    ],
  },
});

const {root, placeholder, typed, caret} = typewriter();

type TypewriterProps = {
  text: string;
  className?: string;
};

/** Types the text out once. Screen readers and reduced-motion users get it in full right away. */
export const Typewriter = ({text, className}: TypewriterProps) => {
  const locale = useLocale();
  // Graphemes, not code units: keeps Arabic letters together with their diacritics.
  const graphemes = map(
    Array.from(new Intl.Segmenter(locale, {granularity: 'grapheme'}).segment(text)),
    'segment',
  );
  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => {
    const isDone = typedCount >= graphemes.length;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isDone || prefersReducedMotion) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setTypedCount(typedCount + 1);
    }, TYPING_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [typedCount, graphemes.length]);

  return (
    <p className={root({className})}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className={placeholder()}>
        {text}
      </span>
      <span aria-hidden className={typed()}>
        {graphemes.slice(0, typedCount).join('')}
        <span className={caret()} />
      </span>
    </p>
  );
};

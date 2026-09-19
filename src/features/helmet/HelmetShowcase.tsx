'use client';

import dynamic from 'next/dynamic';
import {useRef} from 'react';
import {tv} from 'tailwind-variants';

import {Spinner} from '@/components/ui/Spinner';

import {useIsInViewport} from './useIsInViewport';

const helmetShowcase = tv({
  slots: {
    // Pulled up: cancels the page padding and tucks the model under the translucent header.
    root: ['relative', '-mt-24 aspect-[4/3] w-full'],
    loader: 'absolute inset-0 flex items-center justify-center',
  },
});

const {root, loader} = helmetShowcase();

// Shown while the three.js bundle loads; the scene shows the same spinner while the model loads.
const SceneLoader = () => {
  return (
    <div className={loader()}>
      <Spinner />
    </div>
  );
};

// three.js stays out of the page bundle and loads after the page is shown.
const HelmetScene = dynamic(() => import('./HelmetScene'), {ssr: false, loading: SceneLoader});

/** The helmet with a grotesque visor as an interactive 3D model. */
export const HelmetShowcase = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const isInViewport = useIsInViewport(rootRef);

  return (
    <div ref={rootRef} aria-hidden className={root()}>
      <HelmetScene isActive={isInViewport} />
    </div>
  );
};

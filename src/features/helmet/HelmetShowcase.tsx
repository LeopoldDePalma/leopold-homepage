'use client';

import dynamic from 'next/dynamic';
import {useRef, useState} from 'react';
import {tv} from 'tailwind-variants';

import {Spinner} from '@/components/ui/Spinner';

import {useIsInViewport} from './useIsInViewport';

const helmetShowcase = tv({
  slots: {
    // Pulled up: cancels the page padding and tucks the model under the translucent header.
    root: ['relative', '-mt-24 aspect-[4/3] w-full'],
    loader: 'absolute inset-0 flex items-center justify-center',
    // Hidden until the model is there, so the empty canvas never flashes.
    scene: ['absolute inset-0', 'opacity-0 transition-opacity duration-500'],
  },
  variants: {
    isModelReady: {
      true: {loader: 'hidden', scene: 'opacity-100'},
    },
  },
});

// three.js stays out of the page bundle and loads after the page is shown.
const HelmetScene = dynamic(() => import('./HelmetScene'), {ssr: false});

/** The helmet with a grotesque visor as an interactive 3D model. */
export const HelmetShowcase = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const isInViewport = useIsInViewport(rootRef);
  const [isModelReady, setIsModelReady] = useState(false);
  const {root, loader, scene} = helmetShowcase({isModelReady});

  const handleModelReady = () => {
    setIsModelReady(true);
  };

  return (
    <div ref={rootRef} aria-hidden className={root()}>
      <div className={loader()}>
        <Spinner />
      </div>
      <HelmetScene className={scene()} isActive={isInViewport} onModelReady={handleModelReady} />
    </div>
  );
};

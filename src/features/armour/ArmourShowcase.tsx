'use client';

import {LoaderCircle} from 'lucide-react';
import dynamic from 'next/dynamic';
import {useRef, useState} from 'react';
import {tv} from 'tailwind-variants';

import {useIsInViewport} from './useIsInViewport';

// three.js stays out of the page bundle and loads after the page is shown.
const ArmourScene = dynamic(() => import('./ArmourScene'), {ssr: false});

const armourShowcase = tv({
  slots: {
    root: ['relative', 'aspect-square w-full'],
    loader: 'absolute inset-0 flex items-center justify-center',
    spinner: ['size-8', 'text-accent', 'animate-spin motion-reduce:animate-none'],
    scene: ['absolute inset-0', 'opacity-0 transition-opacity duration-700'],
  },
  variants: {
    isSceneReady: {
      true: {loader: 'hidden', scene: 'opacity-100'},
    },
  },
});

/** The helmet with a grotesque visor: a spinner while it loads, then the 3D model. */
export const ArmourShowcase = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const isInViewport = useIsInViewport(rootRef);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const {root, loader, spinner, scene} = armourShowcase({isSceneReady});

  const handleSceneReady = () => {
    setIsSceneReady(true);
  };

  return (
    <div ref={rootRef} aria-hidden className={root()}>
      <div className={loader()}>
        <LoaderCircle className={spinner()} />
      </div>
      <div className={scene()}>
        <ArmourScene isActive={isInViewport} onReady={handleSceneReady} />
      </div>
    </div>
  );
};

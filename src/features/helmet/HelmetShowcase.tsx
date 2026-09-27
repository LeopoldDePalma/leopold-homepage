'use client';

import {AbsoluteCenter, Box, Spinner} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import {useRef, useState} from 'react';

import {useIsInViewport} from './useIsInViewport';

const HelmetScene = dynamic(() => import('./HelmetScene'), {ssr: false});

export const HelmetShowcase = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const isInViewport = useIsInViewport(rootRef);
  const [isModelReady, setIsModelReady] = useState(false);

  const handleModelReady = () => {
    setIsModelReady(true);
  };

  return (
    <Box ref={rootRef} aria-hidden position="relative" mt="-24" aspectRatio="4 / 3">
      {isModelReady ? null : (
        <AbsoluteCenter>
          <Spinner size="xl" color="accent" _motionReduce={{animation: 'none'}} />
        </AbsoluteCenter>
      )}
      <Box
        position="absolute"
        inset="0"
        opacity={isModelReady ? 1 : 0}
        transitionProperty="opacity"
        transitionDuration="slowest"
        // Beats the inline touch-action OrbitControls sets, which would trap the page on a phone.
        css={{'& canvas': {touchAction: 'pan-y !important'}}}
      >
        <HelmetScene isActive={isInViewport} onModelReady={handleModelReady} />
      </Box>
    </Box>
  );
};

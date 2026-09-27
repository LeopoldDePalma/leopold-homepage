'use client';

import {AbsoluteCenter, Box, Spinner} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import {useRef, useState} from 'react';

import {useIsInViewport} from './useIsInViewport';

// three.js stays out of the page bundle and loads after the page is shown.
const HelmetScene = dynamic(() => import('./HelmetScene'), {ssr: false});

/** The helmet with a grotesque visor as an interactive 3D model. */
export const HelmetShowcase = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const isInViewport = useIsInViewport(rootRef);
  const [isModelReady, setIsModelReady] = useState(false);

  const handleModelReady = () => {
    setIsModelReady(true);
  };

  return (
    // Pulled up: cancels the page padding and tucks the model under the translucent header.
    <Box ref={rootRef} aria-hidden position="relative" mt="-24" w="full" aspectRatio="4 / 3">
      {isModelReady ? null : (
        <AbsoluteCenter>
          <Spinner size="xl" color="accent" _motionReduce={{animation: 'none'}} />
        </AbsoluteCenter>
      )}
      {/*
       * Hidden until the model is there, so the empty canvas never flashes. The important flag
       * beats the inline touch-action OrbitControls writes on connect, which would otherwise
       * swallow vertical swipes and trap the page on a phone.
       */}
      <Box
        position="absolute"
        inset="0"
        opacity={isModelReady ? 1 : 0}
        transitionProperty="opacity"
        transitionDuration="slowest"
        css={{'& canvas': {touchAction: 'pan-y !important'}}}
      >
        <HelmetScene isActive={isInViewport} onModelReady={handleModelReady} />
      </Box>
    </Box>
  );
};

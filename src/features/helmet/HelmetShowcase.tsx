'use client';

import {AbsoluteCenter, Box, Spinner} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import {useRef, useState} from 'react';

import {useOnScreen} from '@/lib/hooks/useOnScreen';

const HelmetScene = dynamic(() => import('./HelmetScene'), {ssr: false});

export const HelmetShowcase = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(rootRef);
  const [modelReady, setModelReady] = useState(false);

  const handleModelReady = () => setModelReady(true);

  return (
    <Box ref={rootRef} aria-hidden position="relative" mt="-24" aspectRatio="4 / 3">
      {modelReady ? null : (
        <AbsoluteCenter>
          <Spinner size="xl" color="accent" _motionReduce={{animation: 'none'}} />
        </AbsoluteCenter>
      )}
      <Box
        position="absolute"
        inset="0"
        opacity={modelReady ? 1 : 0}
        transitionProperty="opacity"
        transitionDuration="slowest"
        // Beats the inline touch-action OrbitControls sets, which would trap the page on a phone.
        css={{'& canvas': {touchAction: 'pan-y !important'}}}
      >
        <HelmetScene active={onScreen} onModelReady={handleModelReady} />
      </Box>
    </Box>
  );
};

import {type PointerEvent, useRef} from 'react';

import {usePrefersReducedMotion} from '@/lib/hooks/usePrefersReducedMotion';

const MAGNET_PULL = 0.25;

export const useMagnet = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const restingCentre = useRef<{x: number; y: number} | null>(null);

  // Measured once, at rest: measuring mid-pull would feed the offset back into the next move.
  const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();

    restingCentre.current = {
      x: box.left + window.scrollX + box.width / 2,
      y: box.top + window.scrollY + box.height / 2,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const centre = restingCentre.current;

    if (!centre || prefersReducedMotion || event.pointerType !== 'mouse') {
      return;
    }

    const pullX = (event.pageX - centre.x) * MAGNET_PULL;
    const pullY = (event.pageY - centre.y) * MAGNET_PULL;

    event.currentTarget.style.translate = `${String(pullX)}px ${String(pullY)}px`;
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    restingCentre.current = null;
    event.currentTarget.style.translate = '';
  };

  return {
    onPointerEnter: handlePointerEnter,
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
  };
};

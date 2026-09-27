'use client';

import {Icon, Link} from '@chakra-ui/react';
import {Mail} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {type PointerEvent, useRef} from 'react';

import {site} from '@/content/site';
import {usePrefersReducedMotion} from '@/lib/hooks/usePrefersReducedMotion';

// How far the button follows the pointer, as a share of the distance from its centre.
const MAGNET_PULL = 0.25;

/** Opens the visitor's mail client. Leans towards the pointer, the way a seal draws the hand. */
export const ContactButton = () => {
  const t = useTranslations('HomePage.contact');
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const restingCentre = useRef<{x: number; y: number} | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Measured once, while the button sits still: reading it mid-pull would feed its own offset
  // back into the next one, and each move would cost a layout pass. Page coordinates, so the
  // measurement survives a scroll under the pointer.
  const handlePointerEnter = () => {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    button.style.translate = '';
    const box = button.getBoundingClientRect();

    restingCentre.current = {
      x: box.left + window.scrollX + box.width / 2,
      y: box.top + window.scrollY + box.height / 2,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const button = buttonRef.current;
    const centre = restingCentre.current;

    // Only a real pointer pulls the button; a finger already lands on it.
    if (!button || !centre || prefersReducedMotion || event.pointerType !== 'mouse') {
      return;
    }

    const pullX = (event.pageX - centre.x) * MAGNET_PULL;
    const pullY = (event.pageY - centre.y) * MAGNET_PULL;

    button.style.translate = `${String(pullX)}px ${String(pullY)}px`;
  };

  const handlePointerLeave = () => {
    const button = buttonRef.current;
    restingCentre.current = null;

    if (!button) {
      return;
    }

    button.style.translate = '';
  };

  return (
    <Link
      ref={buttonRef}
      href={`mailto:${site.email}`}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      alignSelf="center"
      gap="0.5em"
      px="1.25em"
      py="0.6em"
      fontWeight="medium"
      rounded="md"
      borderWidth="1px"
      borderColor="ink/10"
      bg="paper"
      color="ink"
      transitionProperty="filter, transform"
      transitionDuration="moderate"
      _hover={{filter: 'brightness(0.95)', textDecoration: 'none'}}
      _active={{transform: 'scale(0.97)'}}
      _motionReduce={{transition: 'none'}}
    >
      <Icon asChild boxSize="1.25em" color="seal">
        <Mail aria-hidden />
      </Icon>
      {t('action')}
    </Link>
  );
};

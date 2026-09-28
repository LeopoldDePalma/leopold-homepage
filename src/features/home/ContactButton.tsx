'use client';

import {Icon, Link} from '@chakra-ui/react';
import {Mail} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {type PointerEvent, useRef} from 'react';

import {site} from '@/content/site';
import {usePrefersReducedMotion} from '@/lib/hooks/usePrefersReducedMotion';

const MAGNET_PULL = 0.25;

export const ContactButton = () => {
  const t = useTranslations('HomePage.contact');
  const restingCentre = useRef<{x: number; y: number} | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Measured once, at rest: measuring mid-pull would feed the offset back into the next move.
  const handlePointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    const box = event.currentTarget.getBoundingClientRect();

    restingCentre.current = {
      x: box.left + window.scrollX + box.width / 2,
      y: box.top + window.scrollY + box.height / 2,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const centre = restingCentre.current;

    if (!centre || prefersReducedMotion || event.pointerType !== 'mouse') {
      return;
    }

    const pullX = (event.pageX - centre.x) * MAGNET_PULL;
    const pullY = (event.pageY - centre.y) * MAGNET_PULL;

    event.currentTarget.style.translate = `${String(pullX)}px ${String(pullY)}px`;
  };

  const handlePointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    restingCentre.current = null;
    event.currentTarget.style.translate = '';
  };

  return (
    <Link
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
      <Icon boxSize="1.25em" color="seal">
        <Mail />
      </Icon>
      {t('action')}
    </Link>
  );
};

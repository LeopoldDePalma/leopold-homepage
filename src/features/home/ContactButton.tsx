'use client';

import {Mail} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {type PointerEvent, useRef} from 'react';
import {tv} from 'tailwind-variants';

import {site} from '@/content/site';
import {usePrefersReducedMotion} from '@/lib/hooks/usePrefersReducedMotion';

// How far the button follows the pointer, as a share of the distance from its centre.
const MAGNET_PULL = 0.25;

const contactButton = tv({
  slots: {
    root: [
      'inline-flex items-center gap-[0.5em] self-center',
      'px-[1.25em] py-[0.6em]',
      'font-medium',
      'rounded-md border border-ink/10',
      'bg-paper text-ink',
      'transition hover:brightness-95 active:scale-[0.97] motion-reduce:transition-none',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    ],
    icon: ['size-[1.25em]', 'text-seal'],
  },
});

const {root, icon} = contactButton();

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
    <a
      ref={buttonRef}
      href={`mailto:${site.email}`}
      className={root()}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Mail aria-hidden className={icon()} />
      {t('action')}
    </a>
  );
};

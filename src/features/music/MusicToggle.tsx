'use client';

import {IconBrandSpotify} from '@tabler/icons-react';
import {useFormatter, useTranslations} from 'next-intl';
import {type ToggleEvent, useState} from 'react';
import {tv} from 'tailwind-variants';

import {IconButton} from '@/components/ui/IconButton';

import type {Listening} from './spotify';

/** The "Music" word on the home page opens this same popover. */
export const MUSIC_POPOVER_ID = 'music';
const MUSIC_URL = '/api/music';

const musicToggle = tv({
  slots: {
    // Written out in full: Tailwind scans the source statically and cannot see
    // a class name assembled at runtime.
    button: '[anchor-name:--music]',
    icon: 'size-[1.25em]',
    /*
     * The browser puts a popover in the top layer and anchors it under the button. Where anchor
     * positioning is missing, the fixed placement below the header still applies. Nothing here
     * sets `display`: that is how the browser keeps a closed popover hidden.
     */
    panel: [
      'fixed inset-auto end-[max(1rem,calc(50vw-21rem))] top-16 m-0',
      'supports-[position-anchor]:inset-auto supports-[position-anchor]:mt-2',
      '[position-anchor:--music] [position-area:block-end_span-inline-start]',
      '[position-try-fallbacks:flip-inline]',
      'w-[min(20rem,calc(100vw-2rem))] p-3',
      'text-sm',
      'rounded-lg border border-border',
      'bg-background text-foreground shadow-lg',
    ],
    row: 'flex items-center gap-3',
    cover: ['size-14 shrink-0', 'rounded-md border border-border', 'object-cover'],
    details: 'flex min-w-0 flex-col gap-0.5',
    status: ['flex items-center gap-[0.4em]', 'text-xs tracking-wide uppercase', 'text-muted'],
    // A steady dot for the last track, a pulsing one while the music is on.
    dot: ['size-[0.5em] shrink-0', 'rounded-full', 'bg-accent'],
    link: 'transition-colors hover:text-accent',
    track: ['block truncate', 'font-medium'],
    artist: ['block truncate', 'text-muted'],
  },
  variants: {
    isPlaying: {
      true: {dot: 'animate-pulse motion-reduce:animate-none'},
    },
  },
});

/**
 * Header button and the panel it opens. The track comes from the server for the first paint and
 * is fetched again whenever the panel opens — the one moment somebody is looking at it, so no
 * timer is needed. The "Music" word on the home page targets the same popover id.
 */
export const MusicToggle = ({initial}: {initial: Listening}) => {
  const t = useTranslations('Music');
  const format = useFormatter();
  const [listening, setListening] = useState(initial);
  const styles = musicToggle({isPlaying: listening.isPlaying});

  const refresh = async () => {
    try {
      const response = await fetch(MUSIC_URL);

      // An error page can be valid JSON, and casting it would break the next render.
      if (!response.ok) {
        return;
      }

      const fresh = (await response.json()) as Listening | null;

      if (fresh) {
        setListening(fresh);
      }
    } catch (error) {
      // Keep showing the track we already have, but do not swallow the reason.
      console.warn('Could not refresh the Spotify track', error);
    }
  };

  const handleToggle = (event: ToggleEvent<HTMLDivElement>) => {
    if (event.newState !== 'open') {
      return;
    }

    void refresh();
  };

  const status = listening.isPlaying ? t('title') : t('lastPlayed');

  return (
    <>
      <IconButton label={status} popoverTarget={MUSIC_POPOVER_ID} className={styles.button()}>
        <IconBrandSpotify aria-hidden className={styles.icon()} />
      </IconButton>

      <div id={MUSIC_POPOVER_ID} popover="auto" className={styles.panel()} onToggle={handleToggle}>
        <span className={styles.row()}>
          {listening.cover ? (
            // Spotify's own artwork, so it is served straight from their CDN.
            // eslint-disable-next-line @next/next/no-img-element -- not worth a remote image loader
            <img
              src={listening.cover.url}
              alt=""
              width={listening.cover.size}
              height={listening.cover.size}
              className={styles.cover()}
            />
          ) : null}

          <span className={styles.details()}>
            <span className={styles.status()}>
              <span aria-hidden className={styles.dot()} />
              {status}
            </span>
            <a
              href={listening.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link()}
            >
              <span className={styles.track()}>{listening.track}</span>
              <span className={styles.artist()}>
                {format.list(listening.artists, {type: 'conjunction'})}
              </span>
            </a>
          </span>
        </span>
      </div>
    </>
  );
};

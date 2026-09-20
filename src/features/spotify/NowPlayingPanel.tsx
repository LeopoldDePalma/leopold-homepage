'use client';

import {useFormatter, useTranslations} from 'next-intl';
import {type ToggleEvent, useState} from 'react';
import {tv} from 'tailwind-variants';

import type {Listening} from './api';

/** The panel owns the id: it is the popover, and both triggers point at it. */
export const NOW_PLAYING_POPOVER_ID = 'now-playing';

const NOW_PLAYING_URL = '/api/now-playing';

const nowPlayingPanel = tv({
  slots: {
    /*
     * The browser puts a popover in the top layer and anchors it under the button. Where anchor
     * positioning is missing, the fixed placement below the header still applies. Nothing here
     * sets `display`: that is how the browser keeps a closed popover hidden.
     */
    root: [
      'fixed inset-auto end-[max(1rem,calc(50vw-21rem))] top-16 m-0',
      'supports-[position-anchor]:inset-auto supports-[position-anchor]:mt-2',
      '[position-anchor:--now-playing] [position-area:block-end_span-inline-start]',
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
 * The track, refreshed when the panel opens — the one moment somebody is looking at it. The
 * server renders the first value, so the panel is never empty and needs no timer.
 */
export const NowPlayingPanel = ({initial}: {initial: Listening}) => {
  const t = useTranslations('NowPlaying');
  const format = useFormatter();
  const [listening, setListening] = useState(initial);
  const styles = nowPlayingPanel({isPlaying: listening.isPlaying});

  const handleToggle = async (event: ToggleEvent<HTMLDivElement>) => {
    if (event.newState !== 'open') {
      return;
    }

    try {
      const response = await fetch(NOW_PLAYING_URL);
      const fresh = (await response.json()) as Listening | null;

      if (fresh) {
        setListening(fresh);
      }
    } catch {
      // Keep showing the track we already have.
    }
  };

  const handleToggleEvent = (event: ToggleEvent<HTMLDivElement>) => {
    void handleToggle(event);
  };

  const status = listening.isPlaying ? t('title') : t('lastPlayed');

  return (
    <div
      id={NOW_PLAYING_POPOVER_ID}
      popover="auto"
      className={styles.root()}
      onToggle={handleToggleEvent}
    >
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
  );
};

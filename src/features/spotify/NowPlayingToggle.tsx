import {IconBrandSpotify} from '@tabler/icons-react';
import {getFormatter, getTranslations} from 'next-intl/server';
import {tv} from 'tailwind-variants';

import {IconButton} from '@/components/ui/IconButton';

import {getListening} from './api';

/** Shared with the "Music" trigger on the home page, which opens the same panel. */
export const NOW_PLAYING_POPOVER_ID = 'now-playing';

const nowPlayingToggle = tv({
  slots: {
    // Written out in full: Tailwind scans the source statically and cannot see
    // a class name assembled at runtime.
    button: '[anchor-name:--now-playing]',
    icon: 'size-[1.25em]',
    /*
     * The browser puts a popover in the top layer and anchors it under the button. Where anchor
     * positioning is missing, the fixed placement below the header still applies.
     */
    panel: [
      'fixed inset-auto end-[max(1rem,calc(50vw-21rem))] top-16 m-0',
      // Where anchoring works, the explicit offsets step aside and position-area takes over.
      'supports-[position-anchor]:inset-auto supports-[position-anchor]:mt-2',
      '[position-anchor:--now-playing] [position-area:block-end_span-inline-start]',
      '[position-try-fallbacks:flip-inline]',
      'flex w-[min(20rem,calc(100vw-2rem))] items-center gap-3 p-3',
      'text-sm',
      'rounded-lg border border-border',
      'bg-background text-foreground shadow-lg',
    ],
    cover: ['size-14 shrink-0', 'rounded-md border border-border', 'object-cover'],
    details: ['flex min-w-0 flex-col gap-0.5'],
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
 * Header button that opens a panel with the current track, or the last one played. Nothing
 * renders until Spotify is configured, which also keeps the "Music" trigger honest.
 */
export const NowPlayingToggle = async () => {
  const listening = await getListening();

  if (!listening) {
    return null;
  }

  const t = await getTranslations('NowPlaying');
  const format = await getFormatter();
  const styles = nowPlayingToggle({isPlaying: listening.isPlaying});
  const status = listening.isPlaying ? t('title') : t('lastPlayed');

  return (
    <>
      <IconButton label={status} popoverTarget={NOW_PLAYING_POPOVER_ID} className={styles.button()}>
        <IconBrandSpotify aria-hidden className={styles.icon()} />
      </IconButton>

      <div id={NOW_PLAYING_POPOVER_ID} popover="auto" className={styles.panel()}>
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
      </div>
    </>
  );
};

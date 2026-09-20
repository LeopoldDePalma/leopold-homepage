import {IconBrandSpotify} from '@tabler/icons-react';
import {getTranslations} from 'next-intl/server';
import {tv} from 'tailwind-variants';

import {IconButton} from '@/components/ui/IconButton';

import {getListening} from './api';
import {NOW_PLAYING_POPOVER_ID, NowPlayingPanel} from './NowPlayingPanel';

const nowPlayingToggle = tv({
  slots: {
    // Written out in full: Tailwind scans the source statically and cannot see
    // a class name assembled at runtime.
    button: '[anchor-name:--now-playing]',
    icon: 'size-[1.25em]',
  },
});

const {button, icon} = nowPlayingToggle();

/**
 * Header button that opens the panel with the current track, or the last one played. Nothing
 * renders until Spotify is configured, which also keeps the "Music" trigger honest.
 */
export const NowPlayingToggle = async () => {
  const listening = await getListening();

  if (!listening) {
    return null;
  }

  const t = await getTranslations('NowPlaying');

  return (
    <>
      <IconButton
        label={listening.isPlaying ? t('title') : t('lastPlayed')}
        popoverTarget={NOW_PLAYING_POPOVER_ID}
        className={button()}
      >
        <IconBrandSpotify aria-hidden className={icon()} />
      </IconButton>

      <NowPlayingPanel initial={listening} />
    </>
  );
};

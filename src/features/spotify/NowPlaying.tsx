import {getFormatter, getTranslations} from 'next-intl/server';
import {tv} from 'tailwind-variants';

import {Section} from '@/components/ui/Section';

import {getListening} from './api';

const nowPlaying = tv({
  slots: {
    link: ['inline-flex items-center', 'gap-[0.6em]', 'transition-colors hover:text-accent'],
    // A steady dot for the last track, a pulsing one while the music is on.
    dot: ['size-[0.5em] shrink-0', 'rounded-full', 'bg-accent'],
    track: 'font-medium',
    artist: 'text-muted',
  },
  variants: {
    isPlaying: {
      true: {dot: 'animate-pulse motion-reduce:animate-none'},
    },
  },
});

/** Shows what is on the speakers right now, falling back to the last track played. */
export const NowPlaying = async () => {
  const listening = await getListening();

  if (!listening) {
    return null;
  }

  const t = await getTranslations('NowPlaying');
  const format = await getFormatter();
  const {link, dot, track, artist} = nowPlaying({isPlaying: listening.isPlaying});

  return (
    <Section title={listening.isPlaying ? t('title') : t('lastPlayed')}>
      <a href={listening.url} target="_blank" rel="noopener noreferrer" className={link()}>
        <span aria-hidden className={dot()} />
        <span>
          <span className={track()}>{listening.track}</span>{' '}
          <span className={artist()}>{format.list(listening.artists, {type: 'conjunction'})}</span>
        </span>
      </a>
    </Section>
  );
};

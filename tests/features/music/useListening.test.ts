import {renderHook, waitFor} from '@testing-library/react';

import type {Listening} from '@/features/music/spotify';
import {useListening} from '@/features/music/useListening';

const lastPlayed: Listening = {
  playing: false,
  track: 'Old song',
  artists: ['Someone'],
  url: 'https://open.spotify.com/track/old',
};

const nowPlaying: Listening = {
  playing: true,
  track: 'New song',
  artists: ['Someone'],
  url: 'https://open.spotify.com/track/new',
};

const renderListening = (open: boolean) =>
  renderHook((props: {open: boolean}) => useListening(lastPlayed, props.open), {
    initialProps: {open},
  });

describe('useListening', () => {
  it('shows what the server rendered and asks nothing while the panel is closed', () => {
    const fetch = vi.fn();

    vi.stubGlobal('fetch', fetch);

    const {result} = renderListening(false);

    expect(result.current).toEqual({listening: lastPlayed, refreshing: false, failed: false});
    expect(fetch).not.toHaveBeenCalled();
  });

  it('refreshes the track when the panel opens', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(Response.json(nowPlaying))),
    );

    const {result, rerender} = renderListening(false);

    rerender({open: true});

    expect(result.current.refreshing).toBe(true);
    await waitFor(() => {
      expect(result.current).toEqual({listening: nowPlaying, refreshing: false, failed: false});
    });
  });

  it.each([
    ['the request fails', () => Promise.reject(new TypeError('Failed to fetch'))],
    ['the server could not read Spotify', () => Promise.resolve(Response.json(null))],
    ['the server answers an error', () => Promise.resolve(new Response(null, {status: 500}))],
  ])('keeps the track and says it is stale when %s', async (_reason, answer) => {
    vi.stubGlobal('fetch', vi.fn(answer));

    const {result} = renderListening(true);

    await waitFor(() => {
      expect(result.current).toEqual({listening: lastPlayed, refreshing: false, failed: true});
    });
  });

  it('drops an answer that arrives after the panel closed', async () => {
    const answer = Promise.withResolvers<Response>();

    vi.stubGlobal(
      'fetch',
      vi.fn(() => answer.promise),
    );

    const {result, rerender} = renderListening(true);

    rerender({open: false});
    answer.resolve(Response.json(nowPlaying));

    await waitFor(() => expect(result.current.refreshing).toBe(false));
    expect(result.current.listening).toEqual(lastPlayed);
  });
});

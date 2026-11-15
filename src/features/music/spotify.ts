import {map, minBy} from 'lodash-es';
import {unstable_rethrow} from 'next/navigation';
import {cache} from 'react';
import * as z from 'zod/mini';

import type {Listening} from './listening';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const CURRENTLY_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';
const TRACK_TTL_MS = 60_000;
const TOKEN_MARGIN_MS = 60_000;

const trackSchema = z.object({
  name: z.string(),
  artists: z.array(z.object({name: z.string()})),
  external_urls: z.object({spotify: z.string()}),
  album: z.object({images: z.array(z.object({url: z.string(), width: z.number()}))}),
});

const tokenSchema = z.object({access_token: z.string(), expires_in: z.number()});
const currentlyPlayingSchema = z.object({item: z.nullable(trackSchema)});
const recentlyPlayedSchema = z.object({items: z.array(z.object({track: trackSchema}))});

type SpotifyTrack = z.infer<typeof trackSchema>;

type Cached<T> = {value: T; expiresAt: number};

let token: Cached<string> | undefined;
let lastTrack: Cached<Listening> | undefined;

const isFresh = <T>(entry: Cached<T> | undefined): entry is Cached<T> =>
  entry !== undefined && entry.expiresAt > Date.now();

const getAccessToken = async (clientId: string, clientSecret: string, refreshToken: string) => {
  if (isFresh(token)) {
    return token.value;
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`},
    body: new URLSearchParams({grant_type: 'refresh_token', refresh_token: refreshToken}),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Spotify refused the refresh token: ${String(response.status)}`);
  }

  const {access_token: value, expires_in: expiresIn} = tokenSchema.parse(await response.json());

  token = {value, expiresAt: Date.now() + expiresIn * 1000 - TOKEN_MARGIN_MS};

  return value;
};

const toListening = (track: SpotifyTrack, playing: boolean): Listening => {
  // The smallest cover is still bigger than we draw it.
  const cover = minBy(track.album.images, 'width');

  return {
    playing,
    track: track.name,
    artists: map(track.artists, 'name'),
    url: track.external_urls.spotify,
    cover: cover?.url,
  };
};

const fetchListening = async (accessToken: string) => {
  const request = (url: string) =>
    fetch(url, {headers: {Authorization: `Bearer ${accessToken}`}, cache: 'no-store'});

  // 204 means the player is idle.
  const current = await request(CURRENTLY_PLAYING_URL);

  if (current.status === 200) {
    const {item} = currentlyPlayingSchema.parse(await current.json());

    if (item) {
      return toListening(item, true);
    }
  }

  const recent = await request(RECENTLY_PLAYED_URL);

  if (!recent.ok) {
    throw new Error(`Spotify refused the request: ${String(recent.status)}`);
  }

  const {
    items: [last],
  } = recentlyPlayedSchema.parse(await recent.json());

  return last && toListening(last.track, false);
};

/**
 * What is playing now, or the last track played. `undefined` when Spotify is not configured.
 * A failed request keeps the last known track, so a passing error does not hide the feature.
 */
export const getListening = cache(async (): Promise<Listening | undefined> => {
  const {SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN} = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return undefined;
  }

  if (isFresh(lastTrack)) {
    return lastTrack.value;
  }

  try {
    const accessToken = await getAccessToken(
      SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET,
      SPOTIFY_REFRESH_TOKEN,
    );
    const value = await fetchListening(accessToken);

    if (value) {
      lastTrack = {value, expiresAt: Date.now() + TRACK_TTL_MS};
    }

    return value ?? lastTrack?.value;
  } catch (error) {
    unstable_rethrow(error);
    token = undefined;
    console.error('Could not read the Spotify track', error);

    return lastTrack?.value;
  }
});

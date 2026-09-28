import {map, minBy} from 'lodash-es';
import {cache} from 'react';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const CURRENTLY_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';
const TRACK_TTL_MS = 60_000;
const TOKEN_MARGIN_MS = 60_000;

export type Listening = {
  playing: boolean;
  track: string;
  artists: string[];
  url: string;
  cover?: {url: string; size: number};
};

type SpotifyTrack = {
  name: string;
  artists: {name: string}[];
  external_urls: {spotify: string};
  album: {images: {url: string; width: number}[]};
};

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

  const {access_token: value, expires_in: expiresIn} = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

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
    cover: cover && {url: cover.url, size: cover.width},
  };
};

const fetchListening = async (accessToken: string) => {
  const request = (url: string) =>
    fetch(url, {headers: {Authorization: `Bearer ${accessToken}`}, cache: 'no-store'});

  // 204 means the player is idle.
  const current = await request(CURRENTLY_PLAYING_URL);

  if (current.status === 200) {
    const {item} = (await current.json()) as {item: SpotifyTrack | null};

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
  } = (await recent.json()) as {items: {track: SpotifyTrack}[]};

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
    token = undefined;
    console.error('Could not read the Spotify track', error);

    return lastTrack?.value;
  }
});

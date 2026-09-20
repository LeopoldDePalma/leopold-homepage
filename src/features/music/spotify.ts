import {map, minBy} from 'lodash-es';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const CURRENTLY_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';
// How stale the track may get. Spotify is asked again once it expires, and the caller waits for
// that answer rather than being handed the old one.
const TRACK_CACHE_SECONDS = 60;
// Access tokens live an hour; refresh a little early to never serve an expired one.
const TOKEN_SAFETY_MARGIN_SECONDS = 60;

export type Listening = {
  isPlaying: boolean;
  track: string;
  /** Kept as a list so the page can join it the way the locale does. */
  artists: string[];
  url: string;
  cover?: {url: string; size: number};
};

type SpotifyImage = {url: string; width: number; height: number};

type SpotifyTrack = {
  name: string;
  artists: {name: string}[];
  external_urls: {spotify: string};
  album: {images: SpotifyImage[]};
};

type CurrentlyPlaying = {item: SpotifyTrack | null};
type RecentlyPlayed = {items: {track: SpotifyTrack}[]};

/** Credentials live in the environment; without them the feature simply stays off. */
const readCredentials = () => {
  const clientId = process.env['SPOTIFY_CLIENT_ID'];
  const clientSecret = process.env['SPOTIFY_CLIENT_SECRET'];
  const refreshToken = process.env['SPOTIFY_REFRESH_TOKEN'];

  if (!clientId || !clientSecret || !refreshToken) {
    return undefined;
  }

  return {clientId, clientSecret, refreshToken};
};

type MusicCache = {
  token?: {value: string; expiresAt: number};
  track?: {value: Listening; expiresAt: number};
  pending?: Promise<Listening | undefined>;
};

/*
 * Pages and route handlers are separate bundles, so this module is instantiated more than once
 * per server. The cache therefore hangs off globalThis, or each bundle would keep its own and
 * ask Spotify again for an answer the other one already has.
 */
const globalWithCache = globalThis as typeof globalThis & {musicCache?: MusicCache};

const getCache = () => {
  globalWithCache.musicCache ??= {};

  return globalWithCache.musicCache;
};

const getAccessToken = async (
  credentials: NonNullable<ReturnType<typeof readCredentials>>,
  cache: MusicCache,
) => {
  if (cache.token && cache.token.expiresAt > Date.now()) {
    return cache.token.value;
  }

  const basic = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: credentials.refreshToken,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Spotify refused the refresh token: ${String(response.status)}`);
  }

  // A rotated refresh token may come back; with this grant the stored one stays valid, so
  // the response's token is ignored rather than written somewhere we cannot persist.
  const {access_token: accessToken, expires_in: expiresIn} = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cache.token = {
    value: accessToken,
    expiresAt: Date.now() + (expiresIn - TOKEN_SAFETY_MARGIN_SECONDS) * 1000,
  };

  return accessToken;
};

// Spotify sorts covers largest first; the smallest one is still bigger than we draw it.
const toCover = (images: SpotifyImage[]) => {
  const smallest = minBy(images, 'width');

  return smallest ? {url: smallest.url, size: smallest.width} : undefined;
};

const toListening = (track: SpotifyTrack, isPlaying: boolean): Listening => {
  return {
    isPlaying,
    track: track.name,
    artists: map(track.artists, 'name'),
    url: track.external_urls.spotify,
    cover: toCover(track.album.images),
  };
};

const fetchSpotify = async (url: string, accessToken: string) => {
  // Caching lives in this module, not in the fetch cache, whose revalidate serves the stale
  // answer first and refreshes behind it — which showed the previous track on every first look.
  return fetch(url, {headers: {Authorization: `Bearer ${accessToken}`}, cache: 'no-store'});
};

/** A token can stop working before it expires, so one 401 buys a fresh one and a second try. */
const requestWithToken = async (
  url: string,
  credentials: NonNullable<ReturnType<typeof readCredentials>>,
  cache: MusicCache,
) => {
  const response = await fetchSpotify(url, await getAccessToken(credentials, cache));

  if (response.status !== 401) {
    return response;
  }

  delete cache.token;

  return fetchSpotify(url, await getAccessToken(credentials, cache));
};

/** Reads a body that may be absent or broken without losing the fallback to the last track. */
const readTrack = async (response: Response) => {
  try {
    const {item} = (await response.json()) as CurrentlyPlaying;

    return item;
  } catch {
    return null;
  }
};

const fetchListening = async (cache: MusicCache): Promise<Listening | undefined> => {
  const credentials = readCredentials();

  if (!credentials) {
    return undefined;
  }

  try {
    const playingResponse = await requestWithToken(CURRENTLY_PLAYING_URL, credentials, cache);

    // 204 means the player is idle; anything else unexpected falls through to the last track.
    if (playingResponse.ok && playingResponse.status !== 204) {
      const item = await readTrack(playingResponse);

      if (item) {
        return toListening(item, true);
      }
    }

    const recentResponse = await requestWithToken(RECENTLY_PLAYED_URL, credentials, cache);

    if (!recentResponse.ok) {
      return undefined;
    }

    const {items} = (await recentResponse.json()) as RecentlyPlayed;
    const [recent] = items;

    return recent ? toListening(recent.track, false) : undefined;
  } catch {
    return undefined;
  }
};

/**
 * What is playing right now, or the last thing that played. Returns `undefined` only when the
 * feature is not configured or nothing was ever fetched, so a passing network error does not
 * make the music button disappear.
 */
export const getListening = async (): Promise<Listening | undefined> => {
  const cache = getCache();

  if (cache.track && cache.track.expiresAt > Date.now()) {
    return cache.track.value;
  }

  // Concurrent renders (the header and the page) share one request rather than making two.
  cache.pending ??= fetchListening(cache).finally(() => {
    delete cache.pending;
  });

  const value = await cache.pending;

  if (!value) {
    // Failures are not cached: the next caller tries again, and meanwhile the track we already
    // have is better than hiding the feature. Unlike revalidate, this only happens on error.
    return cache.track?.value;
  }

  cache.track = {value, expiresAt: Date.now() + TRACK_CACHE_SECONDS * 1000};

  return value;
};

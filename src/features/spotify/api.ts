import {last, map, sortBy} from 'lodash-es';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const CURRENTLY_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';
// The track on the page may lag behind the speakers by this much.
const TRACK_REVALIDATE_SECONDS = 60;
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

// Kept in the process so a page render costs one Spotify call, not two.
let cachedToken: {value: string; expiresAt: number} | undefined;

const getAccessToken = async (credentials: NonNullable<ReturnType<typeof readCredentials>>) => {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
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

  cachedToken = {
    value: accessToken,
    expiresAt: Date.now() + (expiresIn - TOKEN_SAFETY_MARGIN_SECONDS) * 1000,
  };

  return accessToken;
};

// Spotify sorts covers largest first; the smallest one is still bigger than we draw it.
const toCover = (images: SpotifyImage[]) => {
  const smallest = last(sortBy(images, 'width'));

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
  return fetch(url, {
    headers: {Authorization: `Bearer ${accessToken}`},
    next: {revalidate: TRACK_REVALIDATE_SECONDS},
  });
};

/**
 * What is playing right now, or the last thing that played. Returns `undefined` when the
 * feature is not configured or Spotify is unreachable — the section then stays off the page.
 */
export const getListening = async (): Promise<Listening | undefined> => {
  const credentials = readCredentials();

  if (!credentials) {
    return undefined;
  }

  try {
    const accessToken = await getAccessToken(credentials);
    const playingResponse = await fetchSpotify(CURRENTLY_PLAYING_URL, accessToken);

    // 204 means the player is idle; anything else unexpected falls through to the last track.
    if (playingResponse.ok && playingResponse.status !== 204) {
      const {item} = (await playingResponse.json()) as CurrentlyPlaying;

      if (item) {
        return toListening(item, true);
      }
    }

    const recentResponse = await fetchSpotify(RECENTLY_PLAYED_URL, accessToken);

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

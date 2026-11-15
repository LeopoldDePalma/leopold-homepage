import {useEffect, useState, useTransition} from 'react';

import type {Listening} from './spotify';

const MUSIC_URL = '/api/music';

// The server answers null when it could not read Spotify; to the panel a failed request means
// the same: it keeps the track it has.
const fetchListening = async () => {
  try {
    const response = await fetch(MUSIC_URL);

    return response.ok ? ((await response.json()) as Listening | null) : null;
  } catch {
    return null;
  }
};

export const useListening = (initial: Listening, open: boolean) => {
  const [listening, setListening] = useState(initial);
  const [failed, setFailed] = useState(false);
  const [refreshing, startRefresh] = useTransition();

  useEffect(() => {
    if (!open) {
      return;
    }

    let stale = false;

    startRefresh(async () => {
      const fresh = await fetchListening();

      if (stale) {
        return;
      }

      startRefresh(() => {
        setFailed(!fresh);

        if (fresh) {
          setListening(fresh);
        }
      });
    });

    return () => {
      stale = true;
    };
  }, [open]);

  return {listening, refreshing, failed};
};

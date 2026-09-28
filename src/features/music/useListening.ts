import {useEffect, useState} from 'react';

import type {Listening} from './spotify';

const MUSIC_URL = '/api/music';

const fetchListening = async () => {
  const response = await fetch(MUSIC_URL);

  return response.ok ? ((await response.json()) as Listening | null) : null;
};

export const useListening = (initial: Listening, open: boolean) => {
  const [listening, setListening] = useState(initial);

  useEffect(() => {
    if (!open) {
      return;
    }

    let stale = false;

    const refresh = async () => {
      const fresh = await fetchListening();

      if (fresh && !stale) {
        setListening(fresh);
      }
    };

    refresh().catch(console.warn);

    return () => {
      stale = true;
    };
  }, [open]);

  return listening;
};

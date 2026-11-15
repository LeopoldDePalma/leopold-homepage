import {useEffect, useState, useTransition} from 'react';
import * as z from 'zod/mini';

import {type Listening, listeningSchema} from './listening';

const MUSIC_URL = '/api/music';
const answerSchema = z.nullable(listeningSchema);

// The server answers null when it could not read Spotify; to the panel a failed request or an
// answer of the wrong shape means the same: it keeps the track it has.
const fetchListening = async () => {
  try {
    const response = await fetch(MUSIC_URL);

    if (!response.ok) {
      return null;
    }

    const answer = answerSchema.safeParse(await response.json());

    return answer.success ? answer.data : null;
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

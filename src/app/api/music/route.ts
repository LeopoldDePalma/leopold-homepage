import {getListening} from '@/features/music/spotify';

// Route handlers are uncached by default, so no config is needed. The header is explicit for
// anything between us and the visitor, since one URL answers with whatever is playing now.
export const GET = async () => {
  return Response.json((await getListening()) ?? null, {
    headers: {'Cache-Control': 'no-store'},
  });
};

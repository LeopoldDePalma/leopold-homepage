import {getListening} from '@/features/music/spotify';

// The panel asks for this when it opens, so the answer must be the current one. Rate limiting
// lives in getListening, which keeps a minute of cache in the server process.
export const dynamic = 'force-dynamic';

export const GET = async () => {
  return Response.json((await getListening()) ?? null);
};

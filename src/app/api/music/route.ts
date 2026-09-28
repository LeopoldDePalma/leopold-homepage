import {getListening} from '@/features/music/spotify';

export const GET = async () =>
  Response.json((await getListening()) ?? null, {headers: {'Cache-Control': 'no-store'}});

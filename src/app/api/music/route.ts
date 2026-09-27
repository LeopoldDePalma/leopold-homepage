import {getListening} from '@/features/music/spotify';

export const GET = async () => {
  return Response.json((await getListening()) ?? null, {headers: {'Cache-Control': 'no-store'}});
};

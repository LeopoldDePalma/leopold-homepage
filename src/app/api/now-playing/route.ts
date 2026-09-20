import {getListening} from '@/features/spotify/api';

// The panel asks for this when it opens; the same minute of cache applies as on the page.
export const revalidate = 60;

export const GET = async () => {
  return Response.json((await getListening()) ?? null);
};

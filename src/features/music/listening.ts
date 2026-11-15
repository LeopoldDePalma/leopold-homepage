import * as z from 'zod/mini';

// Shared by the server, which builds it from Spotify, and the panel, which reads it from
// `/api/music`; kept apart from spotify.ts so the client bundle stays free of server code.
export const listeningSchema = z.object({
  playing: z.boolean(),
  track: z.string(),
  artists: z.array(z.string()),
  url: z.string(),
  cover: z.optional(z.string()),
});

export type Listening = z.infer<typeof listeningSchema>;

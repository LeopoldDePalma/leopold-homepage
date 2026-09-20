/**
 * One-off: turns a Spotify login into a refresh token for `SPOTIFY_REFRESH_TOKEN`.
 *
 * Run it with the client credentials already in `.env.local`:
 *   npm run spotify:auth
 *
 * It serves the redirect URI locally, so the app in the Spotify dashboard must list
 * `http://127.0.0.1:8888/callback` — `localhost` is rejected by Spotify.
 */
import {createServer} from 'node:http';

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${String(PORT)}/callback`;
const SCOPES = 'user-read-currently-playing user-read-recently-played';

const clientId = process.env['SPOTIFY_CLIENT_ID'];
const clientSecret = process.env['SPOTIFY_CLIENT_SECRET'];

if (!clientId || !clientSecret) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first.');
  process.exit(1);
}

const exchangeCode = async (code: string) => {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Spotify rejected the code: ${String(response.status)} ${await response.text()}`,
    );
  }

  const {refresh_token: refreshToken} = (await response.json()) as {refresh_token: string};

  return refreshToken;
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', REDIRECT_URI);
  const code = url.searchParams.get('code');

  if (!code) {
    response.writeHead(400).end('No code in the callback.');

    return;
  }

  void exchangeCode(code)
    .then((refreshToken) => {
      response.end('Done. Back to the terminal.');
      console.log('\nAdd this line to .env.local:\n');
      console.log(`SPOTIFY_REFRESH_TOKEN=${refreshToken}\n`);
      server.close();
    })
    .catch((error: unknown) => {
      response.writeHead(500).end('Exchange failed, see the terminal.');
      console.error(error);
      server.close();
      process.exitCode = 1;
    });
});

server.listen(PORT, '127.0.0.1', () => {
  const authorizeUrl = new URL('https://accounts.spotify.com/authorize');

  authorizeUrl.search = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
  }).toString();

  console.log('Open this in your browser and approve access:\n');
  console.log(`${authorizeUrl.toString()}\n`);
});

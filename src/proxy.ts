import {NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';

import {routing} from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

const isDev = process.env.NODE_ENV === 'development';
const SPOTIFY_COVERS = 'https://i.scdn.co';

/*
 * Only scripts carrying this request's nonce run. Next.js reads the nonce from the request header
 * and puts it on its own tags, and 'strict-dynamic' passes the trust on to the chunks they load,
 * such as the 3D scene. The model's decoders compile WebAssembly. The texture one runs in a worker
 * started from a blob, which inherits this policy, and the Basis transcoder shipped with three
 * builds functions from strings (Emscripten embind), so 'unsafe-eval' cannot go. It lets running
 * code evaluate strings; it does not let injected markup run, which still needs the nonce.
 */
const getContentSecurityPolicy = (nonce: string) => {
  const directives = [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval' 'unsafe-eval'`,
    // Dev injects its styles inline.
    `style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    // next/image writes style="color:transparent" into the markup; an attribute cannot run code.
    "style-src-attr 'unsafe-inline'",
    `img-src 'self' blob: data: ${SPOTIFY_COVERS}`,
    // GLTFLoader reads the textures embedded in the model back through fetch(blob:).
    "connect-src 'self' blob:",
    "worker-src 'self' blob:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  return directives.join('; ');
};

const proxy = (request: NextRequest) => {
  const nonce = btoa(crypto.randomUUID());
  const policy = getContentSecurityPolicy(nonce);
  const headers = new Headers(request.headers);

  headers.set('Content-Security-Policy', policy);

  // next-intl copies the request headers into the render, so the nonce reaches Next.js.
  const response = handleI18nRouting(new NextRequest(request, {headers}));

  response.headers.set('Content-Security-Policy', policy);

  return response;
};

export default proxy;

export const config = {
  /*
   * Skip route handlers, Next.js internals and files served from public/. The slashes and the
   * trailing $ matter: without them /apiary and /v1.2/works would skip the locale as well, and
   * their 404 would arrive without layout, theme or translation.
   */
  matcher: '/((?!api/|_next/|.*\\.[a-z0-9]+$).*)',
};

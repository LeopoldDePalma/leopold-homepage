import {NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';

import {routing} from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

const development = process.env.NODE_ENV === 'development';
const SPOTIFY_COVERS = 'https://i.scdn.co';

const getContentSecurityPolicy = (nonce: string) => {
  const directives = [
    "default-src 'self'",
    // 'unsafe-eval': three's Basis transcoder builds functions from strings in a blob worker,
    // which inherits this policy. Injected markup still cannot run without the nonce.
    `script-src 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval' 'unsafe-eval'`,
    `style-src 'self' ${development ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    // next/image writes a style attribute; attributes cannot run code.
    "style-src-attr 'unsafe-inline'",
    `img-src 'self' blob: data: ${SPOTIFY_COVERS}`,
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
  headers.set('x-nonce', nonce);

  const response = handleI18nRouting(new NextRequest(request, {headers}));

  response.headers.set('Content-Security-Policy', policy);

  return response;
};

export default proxy;

export const config = {
  // Skips route handlers, Next internals, the share card and any path that ends in a file
  // extension.
  matcher: '/((?!api/|_next/|opengraph-image$|.*\\.[a-zA-Z0-9]+$).*)',
};

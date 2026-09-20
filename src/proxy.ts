import createMiddleware from 'next-intl/middleware';

import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  /*
   * Skip route handlers, Next.js internals and files served from public/. The slashes and the
   * trailing $ matter: without them /apiary and /v1.2/works would skip the locale as well, and
   * their 404 would arrive without layout, theme or translation.
   */
  matcher: '/((?!api/|_next/|.*\\.[a-z0-9]+$).*)',
};

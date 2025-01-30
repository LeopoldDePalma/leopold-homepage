export const ROUTES = {
  HOME: '/',
  WORKS: '/work',
  POSTS: '/posts',
  USES: '/uses',
  SOURCE: '/source',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = (typeof ROUTES)[RouteKeys];

import {useSyncExternalStore} from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY);

  media.addEventListener('change', onChange);

  return () => {
    media.removeEventListener('change', onChange);
  };
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

// The server can't know the preference: assume reduced motion so nothing animates before hydration.
const getServerSnapshot = () => true;

/** Tracks the `prefers-reduced-motion` setting, including changes while the page is open. */
export const usePrefersReducedMotion = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

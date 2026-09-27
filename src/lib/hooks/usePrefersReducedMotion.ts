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

// The server can't know: assume reduced motion so nothing animates before hydration.
const getServerSnapshot = () => true;

export const usePrefersReducedMotion = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

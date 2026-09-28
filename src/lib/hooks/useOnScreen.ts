import {type RefObject, useEffect, useState} from 'react';

export const useOnScreen = (ref: RefObject<Element | null>) => {
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setOnScreen(entry?.isIntersecting ?? false);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return onScreen;
};

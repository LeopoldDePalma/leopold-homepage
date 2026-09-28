import {type RefObject, useEffect, useState} from 'react';

export const useIsInViewport = (ref: RefObject<Element | null>) => {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsInViewport(entry?.isIntersecting ?? false);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return isInViewport;
};

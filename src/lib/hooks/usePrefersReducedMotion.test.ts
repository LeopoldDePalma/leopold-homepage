import {act, renderHook} from '@testing-library/react';

import {usePrefersReducedMotion} from './usePrefersReducedMotion';

const stubMediaQuery = (initialMatches: boolean) => {
  let matches = initialMatches;
  const listeners = new Set<() => void>();

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches,
      addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
    })),
  );

  return {
    setMatches: (value: boolean) => {
      matches = value;
      listeners.forEach((listener) => {
        listener();
      });
    },
  };
};

describe('usePrefersReducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('follows the system setting while the page is open', () => {
    const {setMatches} = stubMediaQuery(false);
    const {result} = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);

    act(() => {
      setMatches(true);
    });

    expect(result.current).toBe(true);
  });
});

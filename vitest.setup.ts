import '@testing-library/jest-dom/vitest';

// jsdom has no matchMedia: every query misses unless a test stubs its own.
beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn()})),
  );
});

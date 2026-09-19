import {THEME_STORAGE_KEY, themeScript} from './theme';

type ChangeListener = (event: {matches: boolean}) => void;

const stubSystemTheme = (prefersDark: boolean) => {
  const listeners: ChangeListener[] = [];

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: prefersDark,
      addEventListener: (_type: string, listener: ChangeListener) => listeners.push(listener),
    })),
  );

  return {
    changeSystemTheme: (isDark: boolean) => {
      for (const listener of listeners) {
        listener({matches: isDark});
      }
    },
  };
};

// Executes the exact string that is inlined into the page, which also proves the serialised
// function is self-contained.
const runThemeScript = () => {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval -- evaluating it is the point
  const script = new Function(themeScript) as () => void;
  script();
};

describe('theme script', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('follows the system preference when nothing is stored', () => {
    stubSystemTheme(true);
    runThemeScript();

    expect(document.documentElement).toHaveClass('dark');
  });

  it('prefers the stored choice over the system preference', () => {
    stubSystemTheme(true);
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    runThemeScript();

    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('reacts to system changes only until the visitor picks a theme', () => {
    const {changeSystemTheme} = stubSystemTheme(false);
    runThemeScript();

    changeSystemTheme(true);
    expect(document.documentElement).toHaveClass('dark');

    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    changeSystemTheme(false);
    changeSystemTheme(true);
    expect(document.documentElement).toHaveClass('dark');
  });
});

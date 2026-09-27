import {createSystem, defaultConfig, defineConfig, type SystemStyleObject} from '@chakra-ui/react';
import {has, isPlainObject, mapValues} from 'lodash-es';

type ColorModeValue = {_light: string; _dark: string};

const isColorModeValue = (value: unknown): value is ColorModeValue => {
  return isPlainObject(value) && has(value, '_light') && has(value, '_dark');
};

/*
 * Chakra switches its colours with a `.dark` class that a client script would have to set. Our
 * theme lives in `color-scheme` instead (server-rendered `data-theme`, or the system preference),
 * so each `{_light, _dark}` pair becomes `light-dark()`, which the browser resolves from it.
 * `light-dark()` takes colours only, so shadows keep their light variant.
 */
const toLightDark = <T>(tokens: T): T => {
  if (!isPlainObject(tokens)) {
    return tokens;
  }

  // mapValues widens the object; the shape is unchanged, only leaf values are rewritten.
  return mapValues(tokens as Record<string, unknown>, (node, key) => {
    if (key === 'value' && isColorModeValue(node)) {
      return `light-dark(${node._light}, ${node._dark})`;
    }

    return toLightDark(node);
  }) as T;
};

const colorModeColors = defineConfig({
  theme: {semanticTokens: {colors: toLightDark(defaultConfig.theme?.semanticTokens?.colors)}},
});

const INK_HAIRLINE = 'light-dark(#2b21181f, #ede6d91f)';

/* Parchment and iron, with a gold accent, laid over Chakra's own colour names. */
const siteTheme = defineConfig({
  conditions: {
    // The dark theme is in effect when chosen, or when the system prefers it and nothing is
    // chosen; `whenDark` below combines the two.
    themeDark: '[data-theme=dark] &',
    // `html`, not `:root`: Emotion reads a nested selector that starts with a colon as a
    // pseudo-class of the element itself, and the rule would never match.
    themeUnset: 'html:not([data-theme]) &',
  },
  globalCss: {
    ':root': {
      colorScheme: 'light dark',
      // Font stacks follow the language of the text, so a fragment marked `lang="ar"` inside a
      // Latin page (and a Latin one inside an Arabic page) gets the right typeface.
      '--font-latin-body': 'var(--font-jetbrains-mono), ui-monospace, monospace',
      '--font-latin-display': 'var(--font-eb-garamond), ui-serif, serif',
      '--font-arabic-body': 'var(--font-noto-kufi-arabic), ui-sans-serif, sans-serif',
      '--font-arabic-display': 'var(--font-amiri), ui-serif, serif',
    },
    // An explicit choice pins the scheme, and every colour follows it.
    '[data-theme=light]': {colorScheme: 'light'},
    '[data-theme=dark]': {colorScheme: 'dark'},
    ':lang(ar)': {
      '--font-body': 'var(--font-arabic-body)',
      '--font-display': 'var(--font-arabic-display)',
    },
    // Any other language, including a Latin fragment quoted inside an Arabic page.
    '[lang]:not(:lang(ar))': {
      '--font-body': 'var(--font-latin-body)',
      '--font-display': 'var(--font-latin-display)',
    },
    // Re-resolved on every element with a language, or a fragment would inherit the page's font.
    '[lang]': {fontFamily: 'body'},
    'h1, h2, h3': {fontFamily: 'heading'},
    html: {height: 'full', colorPalette: 'accent'},
    // A column, so the main area can stretch and push the footer to the bottom.
    body: {display: 'flex', flexDirection: 'column', minHeight: 'full'},
  },
  theme: {
    tokens: {
      // A letter on the desk: the same paper, ink and wax seal in either theme.
      colors: {
        paper: {value: '#faf7f2'},
        ink: {value: '#2b2118'},
        seal: {value: '#9b2226'},
      },
      fonts: {
        body: {value: 'var(--font-body)'},
        heading: {value: 'var(--font-display)'},
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {value: 'light-dark(#f0e7db, #202023)'},
          panel: {value: '{colors.bg}'},
        },
        fg: {
          DEFAULT: {value: 'light-dark(#2b2118, #ede6d9)'},
          muted: {value: 'light-dark(#6b5a48, #a79e90)'},
        },
        border: {DEFAULT: {value: INK_HAIRLINE}},
        // The default palette: gold on hairline borders, with a faint ink wash on hover.
        accent: {
          DEFAULT: {value: 'light-dark(#7d5a10, #d4a93a)'},
          fg: {value: '{colors.accent}'},
          solid: {value: '{colors.accent}'},
          contrast: {value: '{colors.bg}'},
          subtle: {value: 'light-dark(#2b21180d, #ede6d90d)'},
          muted: {value: INK_HAIRLINE},
          emphasized: {value: 'light-dark(#7d5a1040, #d4a93a40)'},
          border: {value: INK_HAIRLINE},
          focusRing: {value: '{colors.accent}'},
        },
      },
    },
    keyframes: {
      caret: {'50%': {opacity: 0}},
    },
  },
});

export const system = createSystem(defaultConfig, colorModeColors, siteTheme);

/** Styles for the dark theme in effect: the chosen one, or the system's when nothing is chosen. */
export const whenDark = (styles: SystemStyleObject): SystemStyleObject => {
  return {_themeDark: styles, _osDark: {_themeUnset: styles}};
};

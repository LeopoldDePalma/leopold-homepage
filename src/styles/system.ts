import {createSystem, defaultConfig, defineConfig, type SystemStyleObject} from '@chakra-ui/react';
import {has, isPlainObject, mapValues} from 'lodash-es';

type ColorModeValue = {_light: string; _dark: string};

const isColorModeValue = (value: unknown): value is ColorModeValue => {
  return isPlainObject(value) && has(value, '_light') && has(value, '_dark');
};

// Chakra's `_dark` needs a `.dark` class set by a client script. Our theme lives in
// `color-scheme`, so every `{_light, _dark}` colour becomes `light-dark()` instead.
const toLightDark = <T>(tokens: T): T => {
  if (!isPlainObject(tokens)) {
    return tokens;
  }

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

const siteTheme = defineConfig({
  conditions: {
    themeDark: '[data-theme=dark] &',
    // Not `:root`: Emotion reads a nested selector starting with a colon as a pseudo-class.
    themeUnset: 'html:not([data-theme]) &',
  },
  globalCss: {
    ':root': {colorScheme: 'light dark'},
    '[data-theme=light]': {colorScheme: 'light'},
    '[data-theme=dark]': {colorScheme: 'dark'},
    // Resolved on the element itself: the `fonts.body` token is fixed where <html> defines it,
    // so a quoted fragment would keep the page's typeface.
    '[lang]': {fontFamily: 'var(--font-body)'},
    '[lang]:not(:lang(ar))': {
      '--font-body': 'var(--font-jetbrains-mono), ui-monospace, monospace',
      '--font-display': 'var(--font-eb-garamond), ui-serif, serif',
    },
    ':lang(ar)': {
      '--font-body': 'var(--font-noto-kufi-arabic), ui-sans-serif, sans-serif',
      '--font-display': 'var(--font-amiri), ui-serif, serif',
    },
    html: {height: 'full', colorPalette: 'accent'},
    body: {display: 'flex', flexDirection: 'column', minHeight: 'full'},
  },
  theme: {
    tokens: {
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
        border: {DEFAULT: {value: 'light-dark(#2b21181f, #ede6d91f)'}},
        accent: {
          DEFAULT: {value: 'light-dark(#7d5a10, #d4a93a)'},
          fg: {value: '{colors.accent}'},
          subtle: {value: 'light-dark(#2b21180d, #ede6d90d)'},
          emphasized: {value: 'light-dark(#7d5a1040, #d4a93a40)'},
          border: {value: '{colors.border}'},
          focusRing: {value: '{colors.accent}'},
        },
      },
    },
    recipes: {
      container: {base: {maxWidth: '2xl', px: '4'}},
      heading: {base: {fontWeight: 'bold'}},
      button: {
        variants: {
          variant: {
            quiet: {
              borderWidth: '1px',
              borderColor: 'border',
              color: 'fg',
              _hover: {color: 'accent', borderColor: 'accent'},
              _active: {transform: 'scale(0.97)'},
              _motionReduce: {transition: 'none', _active: {transform: 'none'}},
            },
          },
        },
      },
      link: {
        variants: {
          variant: {
            muted: {color: 'fg.muted', _hover: {color: 'fg'}},
            // Inline, so a long title wraps with the sentence around it.
            credit: {
              display: 'inline',
              color: 'inherit',
              textDecoration: 'underline',
              _hover: {color: 'fg'},
            },
          },
        },
      },
    },
    keyframes: {
      caret: {'50%': {opacity: 0}},
    },
  },
});

export const system = createSystem(defaultConfig, colorModeColors, siteTheme);

export const whenDark = (styles: SystemStyleObject): SystemStyleObject => {
  return {_themeDark: styles, _osDark: {_themeUnset: styles}};
};

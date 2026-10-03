import {createSystem, defaultConfig, defineConfig, type SystemStyleObject} from '@chakra-ui/react';
import {has, isPlainObject, mapValues} from 'lodash-es';

import {palette} from './palette';

type ColorModeValue = {_light: string; _dark: string};

// `alpha` is a hex alpha appended to both colours.
const lightDark = ({light, dark}: {light: string; dark: string}, alpha = '') =>
  `light-dark(${light}${alpha}, ${dark}${alpha})`;

const isColorModeValue = (value: unknown): value is ColorModeValue =>
  isPlainObject(value) && has(value, '_light') && has(value, '_dark');

// Chakra's `_dark` needs a `.dark` class set by a client script. Our theme lives in
// `color-scheme`, so every `{_light, _dark}` colour becomes `light-dark()` instead.
const toLightDark = <T>(tokens: T): T => {
  if (!isPlainObject(tokens)) {
    return tokens;
  }

  return mapValues(tokens as Record<string, unknown>, (node, key) => {
    if (key === 'value' && isColorModeValue(node)) {
      return lightDark({light: node._light, dark: node._dark});
    }

    return toLightDark(node);
  }) as T;
};

const shrinkOnPress = {
  _active: {transform: 'scale(0.97)'},
  _motionReduce: {transition: 'none', _active: {transform: 'none'}},
} satisfies SystemStyleObject;

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
        ink: {value: palette.fg.light},
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
          DEFAULT: {value: lightDark(palette.bg)},
          panel: {value: '{colors.bg}'},
        },
        fg: {
          DEFAULT: {value: lightDark(palette.fg)},
          muted: {value: lightDark(palette.fgMuted)},
        },
        border: {DEFAULT: {value: lightDark(palette.fg, '1f')}},
        accent: {
          DEFAULT: {value: lightDark(palette.accent)},
          fg: {value: '{colors.accent}'},
          subtle: {value: lightDark(palette.fg, '0d')},
          emphasized: {value: lightDark(palette.accent, '40')},
          border: {value: '{colors.border}'},
          focusRing: {value: '{colors.accent}'},
        },
        mail: {
          solid: {value: '{colors.paper}'},
          contrast: {value: '{colors.ink}'},
          emphasized: {value: 'color-mix(in srgb, {colors.paper} 95%, black)'},
        },
        linkedin: {
          solid: {value: '#0a66c2'},
          contrast: {value: '#ffffff'},
          emphasized: {value: '#084e96'},
        },
        github: {
          solid: {value: '#2d2d31'},
          contrast: {value: '#ffffff'},
          emphasized: {value: '#38383d'},
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
              ...shrinkOnPress,
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
            brand: {
              gap: '0.5em',
              px: '1.25em',
              py: '0.6em',
              fontWeight: 'medium',
              borderWidth: '1px',
              borderColor: 'transparent',
              rounded: 'md',
              bg: 'colorPalette.solid',
              color: 'colorPalette.contrast',
              transitionProperty: 'background-color, transform',
              transitionDuration: 'moderate',
              focusRingColor: 'accent',
              _icon: {boxSize: '1.25em'},
              _hover: {bg: 'colorPalette.emphasized'},
              ...shrinkOnPress,
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

/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { Theme, ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    navbar: {
      background: string;
      text: string;
    };
  }
  interface PaletteOptions {
    navbar?: {
      background?: string;
      text?: string;
    };
  }
}

const baseThemeOptions: ThemeOptions = {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s ease-in-out',
        },
      },
    },
  },
};

const darkThemeOptions: ThemeOptions = {
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#3d7aed',
    },
    background: {
      default: '#202023',
      paper: '#FFEBB5',
    },
    navbar: {
      background: '#202023',
      text: 'rgba(255, 255, 255, 1)',
    },
  },
};

const lightThemeOptions: ThemeOptions = {
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#ff63c3',
    },
    background: {
      default: '#f0e7db',
      paper: '#ffffff',
    },
    navbar: {
      background: '#ffffff40',
      text: 'rgba(30, 41, 59, 1)',
    },
  },
};

export const getTheme = (mode: 'dark' | 'light'): Theme =>
  createTheme(mode === 'dark' ? darkThemeOptions : lightThemeOptions);

import { CssBaseline, ThemeProvider as MUIThemeProvider } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet';
import { getTheme } from '../features/theme/Theme';
import { useThemeContext } from '../features/theme/ThemeContext';
import AppRouterProvider from './router/AppRouterProvider';
import { ThemeRouterProvider } from './router/ThemeProvider';

const AppContent = React.memo((): React.JSX.Element => {
  const { isDarkMode } = useThemeContext();

  const theme = React.useMemo(() => getTheme(isDarkMode ? 'dark' : 'light'), [isDarkMode]);

  return (
    <MUIThemeProvider theme={theme}>
      <Helmet>
        <link rel="icon" type="image/png" href="/eagle.png" />
      </Helmet>
      <CssBaseline />
      <AppRouterProvider />
    </MUIThemeProvider>
  );
});

AppContent.displayName = 'AppContent';

export default function App(): React.JSX.Element {
  return (
    <ThemeRouterProvider>
      <AppContent />
    </ThemeRouterProvider>
  );
}

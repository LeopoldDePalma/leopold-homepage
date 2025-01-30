import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { IconButton, Menu, MenuItem, Typography, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { IoLogoGithub } from 'react-icons/io5';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggleButton from '../../../features/theme/ThemeToggleButton';
import { ROUTES } from '../../../shared/constants/routes';
import Logo from '../../Logo/ui/Logo';
import styles from './NavBar.module.css';

type LinkItemProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

const LinkItem = ({ to, children, className, ...props }: LinkItemProps): React.JSX.Element => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `${styles.linkItem} ${isActive ? styles.linkItemActive : ''} ${className ?? ''}`
    }
    {...props}
  >
    {children}
  </NavLink>
);

export default function NavBar(): React.JSX.Element {
  const theme = useTheme();
  const [anchorNavMenu, setAnchorNavMenu] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorNavMenu(event.currentTarget);
  };

  const handleCloseNavMenu = (): void => {
    setAnchorNavMenu(null);
  };

  const Pages = (
    <>
      <LinkItem to={ROUTES.WORKS} className={styles.navLink}>
        Works
      </LinkItem>
      <LinkItem to={ROUTES.POSTS} className={styles.navLink}>
        Posts
      </LinkItem>
      <LinkItem to={ROUTES.USES} className={styles.navLink}>
        Uses
      </LinkItem>
      <LinkItem to={ROUTES.SOURCE} className={`${styles.navLink} ${styles.github}`}>
        <IoLogoGithub />
        Source
      </LinkItem>
    </>
  );

  return (
    <AppBar
      className={styles.appbar}
      sx={{
        backgroundColor: theme.palette.navbar.background,
        color: theme.palette.navbar.text,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar className={styles.toolbar} disableGutters>
          <Box className={styles.logo}>
            <Typography
              variant="h1"
              sx={{
                fontSize: '1.5rem',
                letterSpacing: '-0.05em',
                color: theme.palette.navbar.text,
              }}
            >
              <Logo />
            </Typography>
          </Box>

          <Box className={styles.navigationSection} sx={{ color: theme.palette.navbar.text }}>
            {Pages}
          </Box>

          <Box className={styles.buttonContainer}>
            <ThemeToggleButton />
            <IconButton
              className={styles.menuButton}
              edge="end"
              aria-label="ToggleMenu"
              onClick={handleOpenNavMenu}
            >
              <MenuOutlinedIcon fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={anchorNavMenu}
              open={Boolean(anchorNavMenu)}
              onClose={handleCloseNavMenu}
            >
              <MenuItem component={Link} to="/" onClick={handleCloseNavMenu}>
                About
              </MenuItem>
              <MenuItem component={Link} to="/work" onClick={handleCloseNavMenu}>
                Works
              </MenuItem>
              <MenuItem component={Link} to="/posts" onClick={handleCloseNavMenu}>
                Posts
              </MenuItem>
              <MenuItem
                component="a"
                href="null"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCloseNavMenu}
              >
                Uses
              </MenuItem>
              <MenuItem
                component="a"
                href="https://github.com/craftzdog/craftzdog-homepage"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCloseNavMenu}
              >
                View Source
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

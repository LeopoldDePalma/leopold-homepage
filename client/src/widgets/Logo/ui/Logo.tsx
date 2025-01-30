import { Box, Link, Typography, useTheme } from '@mui/material';
import EagleIcon from '../../../../public/icons/EagleIcon/ui/EagleIcon';
import styles from './Logo.module.css';

export default function Logo(): React.JSX.Element {
  const theme = useTheme();

  return (
    <Link href="/">
      <Box className={styles.logo}>
        <EagleIcon />
        <Typography
          sx={{
            fontWeight: 'bold',
            color: theme.palette.navbar.text,
          }}
        >
          Konstantin Konyushkin
        </Typography>
      </Box>
    </Link>
  );
}

import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import HomeIcon from '@mui/icons-material/Home';
import { Box, Button, Container, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.css';

export default function ErrorPage(): React.JSX.Element {
  const navigate = useNavigate();

  const code = '404';
  const title = 'Упс! Страница не найдена.';
  const description = 'Страница, которую вы ищете, не существует или была перемещена.';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box className={styles.background}>
      <div className={styles.backgroundElements}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.circle3} />
        <div className={styles.circle4} />
        <div className={styles.circle5} />
      </div>

      <Container maxWidth="sm" className={styles.container}>
        <Box component="form" className={styles.form}>
          <HealthAndSafetyIcon className={styles.icon} />

          <Typography variant="h2" component="h1" className={styles.title}>
            {code}
          </Typography>

          <Typography variant="h5" className={styles.subtitle}>
            {title}
          </Typography>

          <Typography className={styles.description}>{description}</Typography>

          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            size="large"
            className={styles.button}
          >
            Вернуться на главную
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

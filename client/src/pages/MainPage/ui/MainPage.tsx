import { Box, Container } from '@mui/material';
import React from 'react';
import TypeText from '../../../widgets/TypeText/ui/TypeText';
import styles from './MainPage.module.css';

// const LazyVoxelDog = dynamic(() => import('../voxel-dog'), {
//   ssr: false,
//   loading: () => <VoxelDogLoader />
// })

export default function MainPage(): React.JSX.Element {
  const strings = [
    "Hello, I'm an indie app developer based in Japan!",
    'Welcome to my portfolio!',
    'Feel free to explore!',
  ];

  return (
    <Container className={styles.container}>
      <Box className={styles.typeText}>
        <TypeText strings={strings} />
      </Box>
    </Container>
  );
}

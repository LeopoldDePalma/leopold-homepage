import { Container } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../../../widgets/NavBar/ui/NavBar';
import styles from './Layout.module.css';

const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export default function Layout(): React.JSX.Element {
  return (
    <Container className={styles.layoutContainer}>
      <NavBar />
      <motion.main
        className={styles.mainContent}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.4, type: 'easeInOut' }}
      >
        <Outlet />
      </motion.main>
    </Container>
  );
}

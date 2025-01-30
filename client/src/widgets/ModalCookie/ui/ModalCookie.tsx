import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';
import styles from './ModalCookie.module.css';

export default function ModalCookie({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}): React.JSX.Element {
  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="cookie-dialog-title"
      aria-describedby="cookie-dialog-description"
      PaperProps={{
        className: styles.dialogPaper,
      }}
    >
      <DialogTitle id="cookie-dialog-title" className={styles.dialogTitle}>
        Использование Cookie
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>
        <DialogContentText id="cookie-dialog-description">
          Мы используем файлы cookie для улучшения работы сайта и обеспечения удобства его
          использования. Продолжая использовать этот сайт, вы соглашаетесь с использованием файлов
          cookie.
        </DialogContentText>
      </DialogContent>

      <DialogActions className={styles.dialogActions}>
        <Button onClick={close} variant="contained" className={styles.primaryButton}>
          Понятно
        </Button>
        <Button onClick={close} variant="outlined" className={styles.secondaryButton}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}

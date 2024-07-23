'use client';

import React from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';

export default function Alert({ alertData, handleCloseAlert }) {
  return (
    <Snackbar
      open={alertData.show}
      autoHideDuration={5000} // 5 secs
      onClose={handleCloseAlert}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <MuiAlert 
        onClose={handleCloseAlert} 
        severity={alertData.severity} 
        variant="filled"
      >
        {alertData.message}
      </MuiAlert>
    </Snackbar>
  );
}

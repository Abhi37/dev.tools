// Notification.js
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const Notification = ({ open, onClose, message, severity = 'info', autoHideDuration = 6000 }) => (
  <Snackbar
    open={open}
    autoHideDuration={autoHideDuration}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default Notification;

import React, { FC, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';

interface SnackbarProps{
    open : boolean;
    handleClose : () => void;
    msg : string
    severity : AlertColor
}


const MySnackbar : FC<SnackbarProps> = ({ open, handleClose, msg, severity}) => {
    return (
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity={severity} elevation={6} variant="filled">
          {msg}
        </MuiAlert>
      </Snackbar>
    );
  };

  export default MySnackbar
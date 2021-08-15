import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { sharedNotifier } from 'shared/notifier';

const ORIGIN_TOP_CENTER: SnackbarOrigin = {
  vertical: 'top',
  horizontal: 'center'
}

export const NotifierSnackbar = () => {
  const { opened, text, severity, close } = sharedNotifier();

  return (
    <Snackbar open={opened.val} anchorOrigin={ORIGIN_TOP_CENTER}>
      <Alert onClose={close} severity={severity.val}>
        {text.val}
      </Alert>
    </Snackbar>
  )
}

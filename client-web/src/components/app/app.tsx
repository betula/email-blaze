import { HomePage } from 'components/home/home-page';
import { Layuot } from 'components/layout';
import { NotifierSnackbar } from 'components/notifier-snackbar';
import { PanelPage } from 'components/panel/panel-page';
import React from 'react';
import { sharedAuth } from 'shared/auth';

export const App = () => {
  const { initialized, user } = sharedAuth();

  const body = () => {
    if (!initialized.val) {
      return null;
    }

    if (!user.val) {
      return (
        <HomePage />
      );
    }

    return (
      <PanelPage />
    );
  }

  return (
    <Layuot>
      {body()}
      <NotifierSnackbar />
    </Layuot>
  )
};

import Button, { ButtonTypeMap } from '@material-ui/core/Button';
import React, { FC } from 'react';
import { sharedServerApi } from 'shared/server-api';

type Props = {
  variant?: ButtonTypeMap['props']['variant'],
  color?: ButtonTypeMap['props']['color']
}

export const LogoutButton: FC<Props> = ({ variant, color, children }) => {
  const { authLogout } = sharedServerApi();

  return (
    <Button
      variant={variant}
      color={color}
      onClick={authLogout}
    >
      {children}
    </Button>
  );
};

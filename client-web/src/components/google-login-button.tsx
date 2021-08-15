import Button, { ButtonTypeMap } from '@material-ui/core/Button';
import { AUTH_GOOGLE_URL } from 'constants/auth';
import React, { FC } from 'react';

type Props = {
  variant?: ButtonTypeMap['props']['variant'],
  color?: ButtonTypeMap['props']['color']
}

export const GoogleLoginButton: FC<Props> = ({ variant, color, children }) => {
  return (
    <Button
      variant={variant}
      color={color}
      href={AUTH_GOOGLE_URL}
    >
      {children}
    </Button>
  );
};

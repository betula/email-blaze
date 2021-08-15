import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { GoogleLoginButton } from 'components/google-login-button';
import { useJsx } from 'realar';
import { sharedAuth } from 'shared/auth';
import { LogoutButton } from './logout-button';
import AccountCircle from '@material-ui/icons/AccountCircle';

import logoImage from './logo.png';


const useStyles = makeStyles((theme) => ({
  logo: {
    marginRight: theme.spacing(2),
    width: theme.spacing(4),
    height: theme.spacing(4)
  },
  title: {
    flexGrow: 1,
  },
  userIcon: {
    marginLeft: theme.spacing(1),
    position: 'relative',
  },
  userPicture: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    borderRadius: '50%'
  }
}));

export const Header = () => {
  const classes = useStyles();
  const { user, initialized } = sharedAuth();

  const User = useJsx(() => (
    initialized.val ? (
      user.val ? (
        <>
          <LogoutButton color="inherit">
            Logout
          </LogoutButton>
          <div className={classes.userIcon}>
            <AccountCircle />
            {user.val.picture ? (
              <img src={user.val.picture} className={classes.userPicture} />
            ) : null}
          </div>
        </>
      ) : (
        <GoogleLoginButton color="inherit">
          Login
        </GoogleLoginButton>
      )
    ) : null
  ));

  return (
    <AppBar position="static">
      <Toolbar>
        <img src={logoImage} className={classes.logo} />
        <Typography variant="h6" className={classes.title}>
          Email Blaze
        </Typography>
        <User />
      </Toolbar>
    </AppBar>
  );
}

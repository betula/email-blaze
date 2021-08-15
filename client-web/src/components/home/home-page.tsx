import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { GoogleLoginButton } from 'components/google-login-button';


const useStyles = makeStyles((theme) => ({
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  panel: {
    maxWidth: '400px',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  }
}));

export const HomePage = () => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Paper square className={classes.panel}>
        <Container>
          <Box my={2}>
            <Typography variant="h5">
              Sign in
            </Typography>
          </Box>
          <Box my={2}>
            <Typography variant="body2">
              Welcome to Email Blaze. The easiest way to extract your own text snippets from your sent emails. Well-known and frequently repeated pieces of text should be the Text Blaze snippets to make your life Longer!
            </Typography>
          </Box>
          <Box my={2} className={classes.controls}>
            <GoogleLoginButton color="primary">
              Login via Google
            </GoogleLoginButton>
          </Box>
        </Container>

      </Paper>
    </div>
  );
}

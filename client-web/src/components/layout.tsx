import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Header } from './header';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  }
}));

export const Layuot: FC = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      {children}
    </div>
  );
}

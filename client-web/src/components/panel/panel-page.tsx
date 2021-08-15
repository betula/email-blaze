import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Snippets } from './snippets';
import { Initialization } from './initialization';

const useStyles = makeStyles((theme) => ({
  main: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center'
  }
}));

export const PanelPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Initialization />
      <Snippets />
    </div>
  );
}

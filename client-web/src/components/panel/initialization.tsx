import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { sharedSnippetTable } from 'shared/snippet-table';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  panel: {
    maxWidth: '400px',
    padding: theme.spacing(2),
    textAlign: 'center'
  },
}));

export const Initialization = () => {
  const classes = useStyles();
  const { initialization } = sharedSnippetTable();

  if (!initialization.val) return null;

  return (
    <div className={classes.box}>
      <Paper square className={classes.panel}>
        <CircularProgress />
        <Box my={2}>
          <Typography variant="body2">
            Snippets are now being created from your sent emails, please wait, it will be ready soon!
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { sharedSnippetTable } from 'shared/snippet-table';
import { SnippetsList } from './snippets-list';
import { SnippetsControls } from './snippets-controls';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    maxWidth: '700px',
    paddingTop: theme.spacing(2)
  }
}));

export const Snippets = () => {
  const classes = useStyles();
  const { initialization, load } = sharedSnippetTable();

  if (initialization.val) return null;

  return (
    <div className={classes.root}>
      <SnippetsControls />
      <SnippetsList />
      <SnippetsControls variant="bottom" />
    </div>
  );
}

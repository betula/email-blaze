import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { sharedSnippetTable } from 'shared/snippet-table';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Reply from '@material-ui/icons/Reply';
import IconButton from '@material-ui/core/IconButton';
import { useLocal } from 'realar';
import { sharedNotifier } from 'shared/notifier';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  item: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    position: 'relative'
  },
  save: {
    position: 'absolute',
    top: -theme.spacing(1),
    right: -theme.spacing(1)
  },
  saveIcon: {
    transform: 'scaleX(-1)'
  }
}));

export const SnippetsList = () => {
  const classes = useStyles();
  const { table } = sharedSnippetTable();

  const save = useLocal(() => (
    () => sharedNotifier().info('Export to Text Blaze snippet will be in next version 😊')
  ));

  return (
    <>
      {table.val.map((snippet, i) => (
        <Paper key={i} className={classes.item}>
          <Box my={2} mx={2}>
            <Typography variant="body2" component="pre">
              {snippet.text}
            </Typography>
          </Box>
          <IconButton className={classes.save} onClick={save}>
            <Reply color="primary" className={classes.saveIcon} />
          </IconButton>
        </Paper>
      ))}
    </>
  )
}

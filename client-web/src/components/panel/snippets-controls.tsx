import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { sharedSnippetTable } from 'shared/snippet-table';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import CircularProgress from '@material-ui/core/CircularProgress';

type Props = {
  variant?: 'top' | 'bottom'
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  space: {
    flexGrow: 1
  }
}));

export const SnippetsControls: FC<Props> = ({ variant }) => {
  const classes = useStyles();
  const { load, loadPrev, loadNext, refresh, hasPrev, hasNext } = sharedSnippetTable();

  return (
    <div className={classes.root}>
      <IconButton onClick={loadPrev} disabled={load.pending.val || !hasPrev()}>
        <ChevronLeft />
      </IconButton>
      <IconButton onClick={loadNext} disabled={load.pending.val || !hasNext()}>
        <ChevronRight />
      </IconButton>

      <div class={classes.space} />

      {load.pending.val ? (
        <CircularProgress size={20} color="secondary" />
      ) : null}

      {variant !== 'bottom' ? (
        <Button onClick={refresh} disabled={load.pending.val}>Refresh</Button>
      ) : null}
    </div>
  );
}

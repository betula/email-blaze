import React from 'react';
import { render } from 'react-dom';

import { App } from 'components/app/app';
import { sharedAuth } from 'shared/auth';
import { sharedSnippetTable } from 'shared/snippet-table';

sharedAuth().init();
sharedSnippetTable();

render(<App />, document.getElementById('app')!);

import { pool, shared, value } from 'realar'
import { sharedAuth } from './auth'
import { sharedNotifier } from './notifier';
import { sharedServerApi, SnippetsParams } from './server-api';

export type Snippet = {
  text: string
}

const SnippetTable = () => {
  const auth = sharedAuth();
  const serverApi = sharedServerApi();

  auth.user.to((user) => {
    if (user) {
      load();
    }
  });

  const init = () => {
    if (auth.user.val) load();
  }

  const initialized = value(false);
  const table = value<Snippet[]>([]);
  const page = value(0);
  const pages = value(0);

  const load = pool(async (params?: SnippetsParams) => {
    const { page: p, refresh } = params || {};

    const res = await serverApi.snippets({
      page: typeof p === 'number' ? p : page.val,
      refresh
    });
    initialized(true);

    if (!res) {
      table.reset();
      page.reset();
      pages.reset();
      return;
    }

    if (!res.snippets) {
      sharedNotifier().error('You may not have specified permission to read your emails, or something went wrong 😞');
      return;
    }

    table(
      res.snippets.map((text) => ({ text }))
    );
    page(res.page);
    pages(res.pages);
  });

  const initialization = value.from(() => (
    !initialized.val && load.pending.val
  ));

  const refresh = () => load({ refresh: 1 });

  const hasPrev = () => pages.val > 1 && page.val > 0;
  const hasNext = () => pages.val > 1 && page.val < pages.val - 1;

  const loadNext = async () => {
    if (hasNext()) await load({ page: page.val + 1 });
  };
  const loadPrev = async () => {
    if (hasPrev()) await load({ page: page.val - 1 });
  };

  init();

  return {
    load,
    initialization,
    table,
    refresh,
    hasPrev,
    hasNext,
    loadNext,
    loadPrev
  }
}

export const sharedSnippetTable = () => shared(SnippetTable);

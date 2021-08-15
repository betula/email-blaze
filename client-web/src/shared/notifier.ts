import { shared, value } from 'realar'

const AUTOCLOSE_DELAY_MS = 4000;

type Severity = 'success' | 'info' | 'warning' | 'error';

const Notifier = () => {
  const opened = value(false);

  let autocloseId: any;
  const startAutoclose = () => {
    freeAutoclose();
    autocloseId = setTimeout(() => {
      autocloseId = void 0;
      close();
    }, AUTOCLOSE_DELAY_MS);
  }
  const freeAutoclose = () => {
    autocloseId && clearTimeout(autocloseId);
    autocloseId = void 0;
  }

  const close = () => opened(false);

  const text = value('');
  const severity = value('success' as Severity);

  const open = (info: string, status: Severity) => {
    text(info);
    severity(status);
    opened(true);
    startAutoclose();
  }

  return {
    opened,
    close,
    text,
    severity,

    error: (info: string) => open(info, 'error'),
    warn: (info: string) => open(info, 'warning'),
    info: (info: string) => open(info, 'info')
  }
}

export const sharedNotifier = () => shared(Notifier)

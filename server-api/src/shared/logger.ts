import { shared } from 'node-shared';


export class Logger {

  error(...args: any[]) {
    // eslint-disable-next-line no-console
    console.error.apply(void 0, args);
  }

  info(...args: any[]) {
    // eslint-disable-next-line no-console
    console.log.apply(void 0, args);
  }

  warn(...args: any[]) {
    // eslint-disable-next-line no-console
    console.warn.apply(void 0, args);
  }
}

export const sharedLogger = () => shared(Logger);

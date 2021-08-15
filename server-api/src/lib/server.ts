import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, RequestHandler } from 'express';
import { sharedLogger } from 'shared/logger';

export class Server {
  logger = sharedLogger();

  server: Express;

  constructor() {
    this.server = express();
    this.use(cors({
      origin: true,
      credentials: true
    }));
    this.use(cookieParser());
  }

  use(fn: RequestHandler) {
    this.server.use(fn);
    return this;
  }

  get(route: string, fn: RequestHandler) {
    this.server.get(route, fn);
    return this;
  }

  start(port = 4000, hostname = 'localhost') {
    this.server.listen(port, hostname, () => {
      this.logger.info(`Server started on http://localhost:${port}`);
    });
  }
}

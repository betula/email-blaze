import { generateUid } from 'lib/generate-uid';
import { shared } from 'node-shared';
import { User } from './user-storage';

export interface Session {
  id: string;
  user: {
    id: string;
  }
}

export class SessionStorage {
  storage: Session[] = [];

  async findSessionId(id: string) {
    // Fake to store in memory
    const list = this.storage;
    const len = list.length;
    for (let i = 0; i < len; i++) {
      if (list[i].id === id) {
        return list[i];
      }
    }
  }

  async createSessionId(user: User) {
    // Fake to store in memory
    const session: Session = {
      id: generateUid(),
      user: {
        id: user.id
      }
    };
    this.storage.push(session);
    return session;
  }
}

export const sharedSessionStorage = () => shared(SessionStorage);

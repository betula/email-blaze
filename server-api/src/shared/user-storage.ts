import { generateUid } from 'lib/generate-uid';
import { shared } from 'node-shared';
import { GoogleToken, GoogleUserInfo } from './google';

export interface User {
  id: string;
  google: {
    userInfo: GoogleUserInfo;
    token: GoogleToken;
  },
  snippets?: string[];
}

export class UserStorage {
  storage: User[] = [];

  async findUserById(id: string) {
    // Fake to store in memory
    const list = this.storage;
    const len = list.length;
    for (let i = 0; i < len; i++) {
      if (list[i].id === id) {
        return list[i];
      }
    }
  }

  async findUserByGoogleId(id: string) {
    // Fake to store in memory
    const list = this.storage;
    const len = list.length;
    for (let i = 0; i < len; i++) {
      if (list[i].google.userInfo.id === id) {
        return list[i];
      }
    }
  }

  async updateUserGoogleInfo(user: User, token: GoogleToken, userInfo: GoogleUserInfo) {
    // Fake to store in memory
    user.google.token = token;
    user.google.userInfo = userInfo;
  }

  async createUserFromGoogleInfo(token: GoogleToken, userInfo: GoogleUserInfo) {
    // Fake to store in memory
    const user: User = {
      id: generateUid(),
      google: {
        userInfo,
        token
      }
    };
    this.storage.push(user);
    return user;
  }

  async updateUserSnippets(user: User, snippets: string[]) {
    // Fake to store in memory
    user.snippets = snippets;
  }

}

export const sharedUserStorage = () => shared(UserStorage);

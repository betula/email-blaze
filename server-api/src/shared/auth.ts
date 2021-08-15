import { shared } from 'node-shared';
import { sharedGoogle } from './google';
import { sharedSessionStorage } from './session-storage';
import { sharedUserStorage } from './user-storage';


class Auth {
  google = sharedGoogle();
  userStorage = sharedUserStorage();
  sessionStorage = sharedSessionStorage();

  private async fetchUserByGoogleCode(code: string) {
    const token = await this.google.getTokenByCode(code);
    if (!token) return;

    const userInfo = await this.google.getUserInfoByToken(token);
    if (!userInfo) return;

    let user = await this.userStorage.findUserByGoogleId(userInfo.id);
    if (user) {
      await this.userStorage.updateUserGoogleInfo(user, token, userInfo);
    } else {
      user = await this.userStorage.createUserFromGoogleInfo(token, userInfo);
    }

    return user;
  }

  getGoogleAuthUrl() {
    return this.google.getAuthUrl();
  }

  async fetchSessionIdByGoogleCode(code: string) {
    const user = await this.fetchUserByGoogleCode(code);
    if (!user) return;
    const session = await this.sessionStorage.createSessionId(user);
    return session.id;
  }

  async fetchUserBySessionId(id: string) {
    const session = await this.sessionStorage.findSessionId(id);
    if (!session) return;
    const user = await this.userStorage.findUserById(session.user.id);
    if (!user) return;

    const time = Date.now();
    if (user.google.token.expiry_date <= time) return;

    return user;
  }

}

export const sharedAuth = () => shared(Auth);

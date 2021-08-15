import { SERVER_API_URL } from 'constants/server-api';
import { shared, signal } from 'realar';
import qs from 'qs';
import fetch from 'unfetch';

export type UserInfo = {
  email: string;
  picture?: string;
}

export type SnippetsParams = {
  refresh?: number;
  page?: number;
}

export const logout = signal();
export const invalidAuth = signal();

const ServerApi = () => {

  const authorized = async (path: string, params?: any) => {
    try {
      const q = params ? '?' + qs.stringify(params) : '';
      const res = await fetch(SERVER_API_URL + path + q, {
        credentials: 'include',
      });
      const data = await res.json();

      if (data?.error === 'invalid auth') invalidAuth();

      return data;
    } catch (e) {
      return;
    }
  }

  return {
    async authLogout() {
      await authorized('/auth/logout');
      logout();
    },

    async authUserInfo() {
      const data = await authorized('/user');
      if (!data) return;
      const user = data.user;
      if (user && user.email) {
        return {
          email: user.email,
          picture: user.picture
        } as UserInfo
      }
    },

    async snippets(params: SnippetsParams) {
      const data = await authorized('/user/snippets', params);
      if (!data) return;
      const snippets: string[] | void = data.snippets;
      const pages: number = data.pages || 0;
      const page: number = data.page || 0;

      return {
        snippets,
        pages,
        page
      };
    },
  }
}

export const sharedServerApi = () => shared(ServerApi);

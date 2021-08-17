import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URIS, SCOPES } from 'constants/google';
import { google } from 'googleapis';
import { shared } from 'node-shared';
import { sharedLogger } from 'shared/logger';
import { emailPartsExtractText } from './email-parts-extract-text';


export type GoogleToken = {
  access_token: string;
  expiry_date: number;
}
export type GoogleUserInfo = {
  id: string;
  email: string;
  picture?: string;
}

export class Google {
  logger = sharedLogger();

  private createClient(token?: GoogleToken) {
    const client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URIS[0]
    );
    if (token) {
      client.setCredentials({
        access_token: token.access_token
      });
    }
    return client;
  }

  getAuthUrl() {
    return this.createClient().generateAuthUrl({
      scope: SCOPES,
    });
  }

  async getTokenByCode(code: string) {
    try {
      const res = await this.createClient().getToken(code);
      const tokens = res?.tokens;

      if (tokens) {
        const { access_token, expiry_date } = tokens;
        if (access_token && expiry_date) {
          return {
            access_token,
            expiry_date
          } as GoogleToken
        }
      }
    } catch (err) {
      this.logger.error('Error retrieving access token', err);
    }
  }

  async getUserInfoByToken(token: GoogleToken) {
    const client = this.createClient(token);
    try {
      const res = await google.oauth2('v2').userinfo.get({ auth: client });
      const data = res?.data;
      if (data) {
        const { email, picture, id } = data;
        if (email && id) {
          return { email, picture, id } as GoogleUserInfo;
        }
      }
    } catch (err) {
      this.logger.error('Error retrieving user info by access token', err);
    }
  }

  async getSentTextsByToken(token: GoogleToken, maxResults: number = 100) {
    const client = this.createClient(token);
    try {
      const gmail = google.gmail({version: 'v1', auth: client});

      const res = await gmail.users.messages.list({
        userId: 'me',
        q: 'in:sent',
        maxResults
      });
      const messages = res?.data?.messages;
      if (messages) {
        this.logger.info('count of gmail messages', messages.length);

        const reqs = messages.map(async (message) => {
          try {
            return await gmail.users.messages.get({
              userId: 'me',
              id: message.id!
            });
          } catch (err) {
            this.logger.error('Error retrieving user email by id', err);
          }
          return;
        });

        const responses = await Promise.all(reqs);

        const texts = responses.map(res => (
          emailPartsExtractText(res?.data.payload?.parts)
        ))
          .filter(str => str) as string[];

        this.logger.info('count of text parts from gmail messages', texts.length);

        return {
          texts
        }
      } else {
        this.logger.warn('No have messages in gmail messages list');
      }
    } catch (err) {
      this.logger.error('Error retrieving user sent emails by access token', err);
    }
  }
}

export const sharedGoogle = () => shared(Google);

import { WEB_CLIENT_URL } from 'constants/web';
import { Server } from 'lib/server';
import { sharedAuth } from 'shared/auth';
import { sharedGoogle } from 'shared/google';
import { sharedSnippetter } from 'shared/snippetter';
import { sharedUserStorage } from 'shared/user-storage';

new Server()

  .get('/auth/google', (_req, res) => {
    res.redirect(sharedAuth().getGoogleAuthUrl());
  })

  .get('/auth/google/callback', async (req, res) => {
    const code = String(req.query?.code);
    const id = await sharedAuth().fetchSessionIdByGoogleCode(code);
    if (id) {
      res.cookie('session', id, {
        httpOnly: true
      });
    }
    res.redirect('/auth/finish');
  })
  .get('/auth/finish', (_req, res) => {
    res.redirect(WEB_CLIENT_URL);
  })
  .get('/auth/logout', async (_req, res) => {
    res.cookie('session', void 0, { httpOnly: true });
    res.send({});
  })

  .get('/user', async (req, res) => {
    const id = String(req.cookies?.session);
    const user = await sharedAuth().fetchUserBySessionId(id);
    if (user) {
      res.send({
        user: {
          email: user.google.userInfo.email,
          picture: user.google.userInfo.picture
        }
      });
    } else {
      res.send({});
    }
  })

  .get('/user/snippets', async (req, res) => {
    const id = String(req.cookies?.session);
    const user = await sharedAuth().fetchUserBySessionId(id);
    if (!user) {
      res.send({ error: 'invalid auth' });
      return;
    }

    const query = req.query;
    const pageLimit = parseInt(''+query?.limit) || 10;
    const isRefresh = parseInt(''+query?.refresh) || 0;
    const pageIndex = isRefresh
      ? 0
      : parseInt(''+query?.page) || 0;

    let snippets: string[] | void;
    if (!isRefresh && user.snippets) {
      snippets = user.snippets;
    } else {
      const gmailTexts = await sharedGoogle().getSentTextsByToken(
        user.google.token,
        50
      );
      if (gmailTexts) {
        snippets = await sharedSnippetter().snippetsFromEmails(gmailTexts.texts);
        if (snippets) {
          await sharedUserStorage().updateUserSnippets(user, snippets);
        }
      }
    }

    if (!snippets) {
      res.send({});
      return;
    }

    const slice = snippets.slice(pageIndex * pageLimit, (pageIndex + 1) * pageLimit);
    const count = Math.ceil(snippets.length / pageLimit);

    if (snippets) {
      res.send({
        snippets: slice,
        limit: pageLimit,
        page: pageIndex,
        pages: count
      });
      return;
    }

    res.send({})
  })

  .start();


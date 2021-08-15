import { shared, value } from 'realar';
import { sharedNotifier } from './notifier';
import { invalidAuth, logout, sharedServerApi, UserInfo } from './server-api';

const Auth = () => {
  const notifier = sharedNotifier();
  const serverApi = sharedServerApi();

  const user = value<UserInfo | void>(void 0)
    .update.by(logout, () => void 0);

  const initialized = value(false).pre(() => true);

  const init = async () => {
    user(await serverApi.authUserInfo());
    initialized();
  };

  invalidAuth.to(() => {
    if (user.val) {
      user();
      notifier.warn('Your auth session is expired, please login again');
    }
  })

  return {
    user,
    init,
    initialized
  }
}

export const sharedAuth = () => shared(Auth);

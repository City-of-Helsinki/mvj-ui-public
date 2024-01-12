import { WebStorageStateStore, UserManager } from 'oidc-client-ts';
import type { UserManagerSettings } from 'oidc-client-ts';
import { getRouteById } from '../root/routes';
import { AppRoutes } from '../application/helpers';


const settings = {
  authority:
    import.meta.env.REACT_APP_OPENID_CONNECT_AUTHORITY_URL ||
    'https://api.hel.fi/sso/openid/',
  automaticSilentRenew: true,
  client_id: import.meta.env.REACT_APP_OPENID_CONNECT_CLIENT_ID || '',
  filterProtocolClaims: true,
  loadUserInfo: true,
  redirect_uri: `${location.origin}${getRouteById(AppRoutes.OIDC_CALLBACK)}`,
  response_type: 'code',
  scope:
    import.meta.env.REACT_APP_OPENID_CONNECT_SCOPE ||
    'openid profile https://api.hel.fi/auth/mvj',
  silent_redirect_uri: `${location.origin}/silent_renew.html`,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

const createUserManager = (settings: UserManagerSettings): UserManager => {
  return new UserManager(settings);
};

export const userManager = createUserManager(settings);

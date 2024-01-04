import { createUserManager } from 'redux-oidc';
import { WebStorageStateStore } from 'oidc-client-ts';
import type { UserManagerSettings } from 'oidc-client-ts';
import { AppRoutes, getRouteById } from '../root/routes';

const settings: UserManagerSettings = {
  authority:
    import.meta.env.REACT_APP_OPENID_CONNECT_AUTHORITY_URL ||
    'https://api.hel.fi/sso/openid/',
  automaticSilentRenew: true,
  client_id: import.meta.env.REACT_APP_OPENID_CONNECT_CLIENT_ID || '',
  filterProtocolClaims: true,
  loadUserInfo: true,
  redirect_uri: `${location.origin}${getRouteById(AppRoutes.OIDC_CALLBACK)}`,
  response_type: 'code',
  response_mode: 'query',
  scope:
    import.meta.env.REACT_APP_OPENID_CONNECT_SCOPE ||
    'openid profile https://api.hel.fi/auth/mvj',
  silent_redirect_uri: `${location.origin}/silent_renew.html`,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = createUserManager(settings);

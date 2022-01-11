import { createUserManager } from 'redux-oidc';
import { WebStorageStateStore } from 'oidc-client';
import { AppRoutes, getRouteById } from '../root/routes';

const settings = {
  authority:
    process.env.REACT_APP_OPENID_CONNECT_AUTHORITY_URL ||
    'https://api.hel.fi/sso/openid/',
  automaticSilentRenew: true,
  client_id: process.env.REACT_APP_OPENID_CONNECT_CLIENT_ID || '',
  filterProtocolClaims: true,
  loadUserInfo: true,
  redirect_uri: `${location.origin}${getRouteById(AppRoutes.OIDC_CALLBACK)}`,
  response_type: 'id_token token',
  scope:
    process.env.REACT_APP_OPENID_CONNECT_SCOPE ||
    'openid profile https://api.hel.fi/auth/mvj',
  silent_redirect_uri: `${location.origin}/silent_renew.html`,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = createUserManager(settings);

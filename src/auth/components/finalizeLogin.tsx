import { useNavigate } from 'react-router-dom';
import { LoginCallbackHandler } from 'hds-react';
import type { OidcClientError, User } from 'hds-react';

import BlockLoader from '../../loader/blockLoader';
import { getRedirectUrlFromSessionStorage } from '../util';
import { logError } from '../../root/helpers';
import { AppRoutes, getRouteById } from '../../root/helpers';

export const FinalizeLogin = (): JSX.Element | null => {
  const navigate = useNavigate();

  const onSuccess = (_user: User) => {
    navigate(
      getRedirectUrlFromSessionStorage() || getRouteById(AppRoutes.HOME),
    );
  };
  const onError = (error?: OidcClientError) => {
    // "HANDLING_LOGIN_CALLBACK cannot be handled by a callback" is a known error in HDS
    // https://hds.hel.fi/components/login/api/#logincallbackhandler
    if (
      error?.message ===
      'Current state (HANDLING_LOGIN_CALLBACK) cannot be handled by a callback'
    ) {
      return;
    }
    logError(`Login Callback Error: ${error}`);
  };

  return (
    <LoginCallbackHandler onError={onError} onSuccess={onSuccess}>
      <BlockLoader />
    </LoginCallbackHandler>
  );
};

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useOidcClient } from 'hds-react';
import { setRedirectUrlToSessionStorage } from './util';
import { AppRoutes, getRouteById } from '../root/helpers';
import { clearApiToken, clearUser } from './actions';

const useAuth = () => {
  const { login: oidcLogin, logout: oidcLogout } = useOidcClient();
  const dispatch = useDispatch();

  const determineRedirectPath = (redirectPath: string): string => {
    if (!redirectPath || redirectPath.startsWith('/callback')) {
      return getRouteById(AppRoutes.HOME);
    }
    return redirectPath;
  };

  const login = useCallback(
    (redirectPath: string) => {
      // avoid setting redirectPath to `/callback`, which could happen if there was an error during login
      // and user returns to the callback url with error, and then tries to log in again
      const finalRedirectPath = determineRedirectPath(redirectPath);
      setRedirectUrlToSessionStorage(finalRedirectPath);
      oidcLogin();
    },
    [oidcLogin],
  );

  const logout = useCallback(() => {
    dispatch(clearApiToken());
    dispatch(clearUser());
    oidcLogout();
  }, [oidcLogout, dispatch]);

  return {
    login,
    logout,
  };
};

export default useAuth;

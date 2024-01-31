import { jwtDecode } from 'jwt-decode';
import { AppRoutes } from '../root/helpers';

const REDIRECT_URL_KEY = 'redirectURL';

export const getRedirectUrlFromSessionStorage = (): string => {
  return sessionStorage.getItem(REDIRECT_URL_KEY) || AppRoutes.HOME;
};

export const setRedirectUrlToSessionStorage = (url: string): void => {
  sessionStorage.setItem(REDIRECT_URL_KEY, url);
};

export const isApiTokenExpired = (apiToken: string): boolean => {
  const { exp } = jwtDecode(apiToken);
  // If expiration does not exist, nothing is expired
  if (exp === undefined) {
    return false;
  }
  const currentTime = Date.now() / 1000;
  const BUFFER_TIME = 90; // 1.5 minute
  return exp < currentTime + BUFFER_TIME;
};

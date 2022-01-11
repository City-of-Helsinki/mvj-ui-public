import { AppRoutes } from '../root/routes';

const REDIRECT_URL_KEY = 'redirectURL';

export const getRedirectUrlFromSessionStorage = (): string => {
  return sessionStorage.getItem(REDIRECT_URL_KEY) || AppRoutes.HOME;
};

export const setRedirectUrlToSessionStorage = (url: string): void => {
  sessionStorage.setItem(REDIRECT_URL_KEY, url);
};

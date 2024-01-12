export const getApiToken = () => {
  window.localStorage.getItem('apiToken');
};

export const setApiToken = (token: string) => {
  window.localStorage.setItem('apiToken', token);
};

export const getApiTokenExpirationTime = () => {
  return window.localStorage.getItem('apiTokenExp');
};

export const setApiTokenExpirationTime = (exp: string) => {
  window.localStorage.setItem('apiTokenExp', exp);
};

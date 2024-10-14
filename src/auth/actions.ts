import { createAction } from 'redux-actions';
import type { Action } from 'redux';
import type { User } from 'hds-react';
import type { TokenData } from 'hds-react';

import {
  RECEIVE_API_TOKEN,
  CLEAR_API_TOKEN,
  RENEW_API_TOKEN,
  USER_FOUND,
  CLEAR_USER,
} from './types';

export const receiveApiToken = (apiToken: TokenData): Action<string> =>
  createAction(RECEIVE_API_TOKEN)(apiToken);

export const clearApiToken = (): Action<string> =>
  createAction(CLEAR_API_TOKEN)();

export const isRenewingApiToken = (): Action<string> =>
  createAction(RENEW_API_TOKEN)();

export const userFound = (user: User): Action<string> =>
  createAction(USER_FOUND)(user);

export const clearUser = (): Action<string> => createAction(CLEAR_USER)();

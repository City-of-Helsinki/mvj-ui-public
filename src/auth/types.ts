import { Action } from 'redux-actions';
import type { User, TokenData } from 'hds-react';

export const RECEIVE_API_TOKEN = 'auth/RECEIVE_API_TOKEN';
export const CLEAR_API_TOKEN = 'auth/CLEAR_API_TOKEN';
export const RENEW_API_TOKEN = 'auth/RENEW_API_TOKEN';
export const USER_FOUND = 'auth/USER_FOUND';
export const CLEAR_USER = 'auth/CLEAR_USER';

export interface UserFoundAction {
  type: typeof USER_FOUND;
  payload: User | null;
}
export interface ReceiveApiTokenAction {
  type: typeof RECEIVE_API_TOKEN;
  payload: TokenData;
}

export const receiveApiTokenActionType = (
  payload: ReceiveApiTokenAction['payload'],
): Action<TokenData> => {
  return {
    type: RECEIVE_API_TOKEN,
    payload,
  };
};

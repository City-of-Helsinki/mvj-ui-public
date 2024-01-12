import { Action } from 'redux-actions';
import type { User } from 'oidc-client-ts';

export const FETCH_API_TOKEN = 'auth/FETCH_API_TOKEN';
export const RECEIVE_API_TOKEN = 'auth/RECEIVE_API_TOKEN';
export const STORE_API_TOKEN_SUCCESS = 'auth/STORE_API_TOKEN_SUCCESS';
export const TOKEN_NOT_FOUND = 'auth/TOKEN_NOT_FOUND';
export const USER_EXPIRED = 'auth/USER_EXPIRED';
export const SILENT_RENEW_ERROR = 'auth/SILENT_RENEW_ERROR';
export const SESSION_TERMINATED = 'auth/SESSION_TERMINATED';
export const USER_EXPIRING = 'auth/USER_EXPIRING';
export const USER_FOUND = 'auth/USER_FOUND';
export const LOADING_USER = 'auth/LOADING_USER';
export const USER_SIGNED_OUT = 'auth/USER_SIGNED_OUT';
export const LOAD_USER_ERROR = 'auth/LOAD_USER_ERROR';

export const fetchApiTokenActionType = (payload: string): Action<string> => {
  return {
    type: FETCH_API_TOKEN,
    payload,
  };
};

export interface UserFoundAction {
  type: typeof USER_FOUND;
  payload: User | null;
}
export interface ReceiveApiTokenAction {
  type: typeof RECEIVE_API_TOKEN;
  payload: string;
}

export const receiveApiTokenActionType = (
  payload: string,
): ReceiveApiTokenAction => {
  return {
    type: RECEIVE_API_TOKEN,
    payload,
  };
};

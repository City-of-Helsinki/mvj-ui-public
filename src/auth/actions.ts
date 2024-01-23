import { createAction } from 'redux-actions';
import type { Action } from 'redux';
import type { User } from 'oidc-client-ts';

import {
  FETCH_API_TOKEN,
  TOKEN_NOT_FOUND,
  RECEIVE_API_TOKEN,
  USER_EXPIRED,
  USER_FOUND,
  SILENT_RENEW_ERROR,
  USER_EXPIRING,
  SESSION_TERMINATED,
  LOADING_USER,
  USER_SIGNED_OUT,
  LOAD_USER_ERROR,
} from './types';

export const fetchApiToken = (accessToken: string): Action<string> =>
  createAction(FETCH_API_TOKEN)(accessToken);

export const receiveApiToken = (apiToken: string): Action<string> =>
  createAction(RECEIVE_API_TOKEN)(apiToken);

export const tokenNotFound = (): Action<string> =>
  createAction(TOKEN_NOT_FOUND)();

// dispatched when the existing user expired
export const userExpired = (): Action<string> => createAction(USER_EXPIRED)();

// dispatched when a user has been found in storage
export const userFound = (user: User): Action<string> =>
  createAction(USER_FOUND)(user);

// dispatched when silent renew fails
// payload: the error
export const silentRenewError = (error: Error): Action<string> =>
  createAction(SILENT_RENEW_ERROR)(error);

// dispatched when the user is logged out
export const sessionTerminated = (): Action<string> =>
  createAction(SESSION_TERMINATED)();

// dispatched when the user is expiring (just before a silent renew is triggered)
export const userExpiring = (): Action<string> => createAction(USER_EXPIRING)();

// dispatched when a new user is loading
export const loadingUser = (): Action<string> => createAction(LOADING_USER)();

export const userSignedOut = (): Action<string> =>
  createAction(USER_SIGNED_OUT)();

export const loadUserError = (): Action<string> =>
  createAction(LOAD_USER_ERROR)();

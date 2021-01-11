import { FETCH_API_TOKEN, TOKEN_NOT_FOUND, RECEIVE_API_TOKEN } from './types';
import {createAction} from 'redux-actions';
import { Action } from 'redux';

export const fetchApiToken = (
  accessToken: string,
): Action<string> => createAction(FETCH_API_TOKEN)(accessToken);

export const receiveApiToken = (
  token: Object,
): Action<string> => createAction(RECEIVE_API_TOKEN)(token);

export const tokenNotFound = (): Action<string> => createAction(TOKEN_NOT_FOUND)();

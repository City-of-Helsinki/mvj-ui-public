import { Action } from 'redux';
import { createAction } from 'redux-actions';

import { OPEN_LOGIN_MODAL, HIDE_LOGIN_MODAL } from './types';

export const openLoginModal = (): Action<string> =>
  createAction(OPEN_LOGIN_MODAL)();
export const hideLoginModal = (): Action<string> =>
  createAction(HIDE_LOGIN_MODAL)();

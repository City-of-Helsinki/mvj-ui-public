import { createAction } from 'redux-actions';
import { Action } from 'redux';

import { Notification, POP_NOTIFICATION, PUSH_NOTIFICATION } from './types';

export const popNotification = (payload?: string): Action =>
  createAction(POP_NOTIFICATION)(payload);

export const pushNotification = (payload: Notification): Action =>
  createAction(PUSH_NOTIFICATION)(payload);

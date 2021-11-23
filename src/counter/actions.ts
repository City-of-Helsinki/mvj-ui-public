import { INCREMENT_ASYNC, INCREMENT, DECREMENT, IS_COUNTING } from './types';

import { createAction } from 'redux-actions';
import { Action } from 'redux';

export const incrementAsync = (): Action<string> =>
  createAction(INCREMENT_ASYNC)();

export const increment = (payload: number): Action<string> =>
  createAction(INCREMENT)(payload);

export const decrement = (payload: number): Action<string> =>
  createAction(DECREMENT)(payload);

export const isCounting = (payload: boolean): Action<string> =>
  createAction(IS_COUNTING)(payload);

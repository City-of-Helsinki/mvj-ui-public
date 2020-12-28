import * as actionTypes from './types';
import {createAction} from 'redux-actions';
import { Action } from 'redux';

export const incrementAsync = (): Action<string> => createAction(actionTypes.INCREMENT_ASYNC)();

export const increment = (
  payload: number,
): Action<string> => createAction(actionTypes.INCREMENT)(payload);

export const decrement = (
  payload: number,
): Action<string> => createAction(actionTypes.DECREMENT)(payload);

export const isCounting = (
  payload: boolean,
): Action<string> => createAction(actionTypes.IS_COUNTING)(payload);

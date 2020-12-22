import * as actionTypes from './types';
import {createAction} from 'redux-actions';

export const incrementAsync = (): actionTypes.incrementAsyncAction => ({
  type: actionTypes.INCREMENT_ASYNC,
});

export const increment = (
  payload: number,
) => createAction(actionTypes.INCREMENT)(payload);

export const decrement = (
  payload: number,
) => createAction(actionTypes.DECREMENT)(payload);

export const isCounting = (
  payload: boolean,
) => createAction(actionTypes.IS_COUNTING)(payload);

import { createAction } from 'redux-actions';
import { Action } from 'redux';
import {
  FETCH_UI_DATA,
  FETCH_UI_DATA_ERROR,
  UI_DATA_NOT_FOUND,
  RECEIVE_UI_DATA,
  UiData,
} from './types';

export const fetchUiData = (): Action => createAction(FETCH_UI_DATA)();

export const receiveUiData = (payload: UiData): Action<string> =>
  createAction(RECEIVE_UI_DATA)(payload);

export const uiDataNotFound = (): Action<string> =>
  createAction(UI_DATA_NOT_FOUND)();

export const fetchUiDataError = (): Action<string> =>
  createAction(FETCH_UI_DATA_ERROR)();

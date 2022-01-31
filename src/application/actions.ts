import { ApiAttributes } from '../api/types';
import { Action } from 'redux';
import { createAction } from 'redux-actions';
import {
  FETCH_FORM_ATTRIBUTES,
  FORM_ATTRIBUTES_NOT_FOUND,
  RECEIVE_FORM_ATTRIBUTES,
} from './types';

export const fetchFormAttributes = (): Action<string> =>
  createAction(FETCH_FORM_ATTRIBUTES)();

export const receiveFormAttributes = (payload: ApiAttributes): Action<string> =>
  createAction(RECEIVE_FORM_ATTRIBUTES)(payload);

export const formAttributesNotFound = (): Action<string> =>
  createAction(FORM_ATTRIBUTES_NOT_FOUND)();

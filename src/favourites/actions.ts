import { createAction } from 'redux-actions';
import { Action } from 'redux';

import {
  FETCH_FAVOURITE,
  FAVOURITE_ATTRIBUTES_NOT_FOUND,
  FAVOURITE_NOT_FOUND,
  RECEIVE_FAVOURITE,
  ADD_FAVOURITE_TARGET,
  REMOVE_FAVOURITE_TARGET,
  Favourite,
  RECEIVE_FAVOURITE_ATTRIBUTES,
  AddTargetPayload,
} from './types';
import { ApiAttributes } from '../api/types';

export const fetchFavourite = (): Action<string> =>
  createAction(FETCH_FAVOURITE)();

export const receiveFavourite = (payload: Array<Favourite>): Action<string> =>
  createAction(RECEIVE_FAVOURITE)(payload);

export const addFavouriteTarget = (payload: AddTargetPayload): Action<string> =>
  createAction(ADD_FAVOURITE_TARGET)(payload);

export const removeFavouriteTarget = (payload: number): Action<string> =>
  createAction(REMOVE_FAVOURITE_TARGET)(payload);

export const favouriteNotFound = (): Action<string> =>
  createAction(FAVOURITE_NOT_FOUND)();

export const favouriteAttributesNotFound = (): Action<string> =>
  createAction(FAVOURITE_ATTRIBUTES_NOT_FOUND)();

export const receiveFavouriteAttributes = (
  payload: ApiAttributes
): Action<string> => createAction(RECEIVE_FAVOURITE_ATTRIBUTES)(payload);

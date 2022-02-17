import { createAction } from 'redux-actions';
import { Action } from 'redux';

import {
  FETCH_FAVOURITE,
  FAVOURITE_NOT_FOUND,
  FAVOURITE_FETCH_ERROR,
  RECEIVE_FAVOURITE,
  ADD_FAVOURITE_TARGET,
  REMOVE_FAVOURITE_TARGET,
  Favourite,
  AddTargetPayload,
  INITIALIZE_FAVOURITE,
  UpdateFavouritePayload,
  UPDATE_FAVOURITE,
} from './types';

export const fetchFavourite = (): Action => createAction(FETCH_FAVOURITE)();

export const initializeFavourite = (): Action =>
  createAction(INITIALIZE_FAVOURITE)();

export const receiveFavourite = (payload: Favourite): Action<string> =>
  createAction(RECEIVE_FAVOURITE)(payload);

export const addFavouriteTarget = (payload: AddTargetPayload): Action<string> =>
  createAction(ADD_FAVOURITE_TARGET)(payload);

export const removeFavouriteTarget = (payload: number): Action<string> =>
  createAction(REMOVE_FAVOURITE_TARGET)(payload);

export const favouriteNotFound = (): Action<string> =>
  createAction(FAVOURITE_NOT_FOUND)();

export const updateFavourite = (
  payload: UpdateFavouritePayload
): Action<string> => createAction(UPDATE_FAVOURITE)(payload);

export const favouriteFetchError = (): Action<string> =>
  createAction(FAVOURITE_FETCH_ERROR)();

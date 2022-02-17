import { PlotSearchTarget } from '../plotSearch/types';
import { Notification } from '../globalNotification/types';

export interface FavouriteTarget {
  plot_search_target: PlotSearchTarget;
  plot_search: number | null;
}

export interface Favourite {
  // todo: Figure out more descriptive name for this. Also refactor the backend side.
  created_at: string | null;
  modified_at: string | null;
  targets: FavouriteTarget[];
  id?: number | null;
}

export const MVJ_FAVOURITE = 'mvj_favourite';

export const FETCH_FAVOURITE = 'favourite/FETCH_FAVOURITE';
export const FAVOURITE_NOT_FOUND = 'favourite/FAVOURITE_NOT_FOUND';
export const FAVOURITE_FETCH_ERROR = 'favourite/FAVOURITE_FETCH_ERROR';
export const RECEIVE_FAVOURITE = 'favourite/RECEIVE_FAVOURITE';
export const ADD_FAVOURITE_TARGET = 'favourite/ADD_FAVOURITE_TARGET';
export const REMOVE_FAVOURITE_TARGET = 'favourite/REMOVE_FAVOURITE_TARGET';
export const INITIALIZE_FAVOURITE = 'favourite/INITIALIZE_FAVOURITE';
export const UPDATE_FAVOURITE = 'favourite/UPDATE_FAVOURITE';

export interface AddTargetPayload {
  target: FavouriteTarget;
}

export interface UpdateFavouritePayload {
  apiToken: string;
  notification: Notification;
  newFavourite: Favourite;
}

export interface UpdateFavouriteAction {
  type: typeof UPDATE_FAVOURITE;
  payload: UpdateFavouritePayload;
}

export interface ReceiveFavouriteAction {
  type: typeof RECEIVE_FAVOURITE;
  payload: Favourite;
}

export interface FetchFavouriteAction {
  type: typeof FETCH_FAVOURITE;
}

export interface InitializeFavouriteAction {
  type: typeof INITIALIZE_FAVOURITE;
}

export interface AddFavouriteTargetAction {
  type: typeof ADD_FAVOURITE_TARGET;
  payload: AddTargetPayload;
}

export interface RemoveFavouriteTargetAction {
  type: typeof REMOVE_FAVOURITE_TARGET;
  payload: number;
}

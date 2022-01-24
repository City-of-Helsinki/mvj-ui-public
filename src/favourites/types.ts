import { ApiAttributes } from '../api/types';
import { PlotSearchTarget } from '../plotSearch/types';

export interface Favourite {
  // todo: Figure out more descriptive name for this. Also refactor the backend side.
  user: string | null;
  created_at: string | null;
  modified_at: string | null;
  plotSearch: number | null;
  targets: PlotSearchTarget[];
}

export const FETCH_FAVOURITE = 'favourite/FETCH_FAVOURITE';
export const FETCH_FAVOURITE_ATTRIBUTES =
  'favourite/FETCH_FAVOURITE_ATTRIBUTES';
export const FAVOURITE_NOT_FOUND = 'favourite/FAVOURITE_NOT_FOUND';
export const RECEIVE_FAVOURITE = 'favourite/RECEIVE_FAVOURITE';
export const RECEIVE_FAVOURITE_ATTRIBUTES =
  'favourite/RECEIVE_FAVOURITE_ATTRIBUTES';
export const FAVOURITE_ATTRIBUTES_NOT_FOUND =
  'favourite/FAVOURITE_ATTRIBUTES_NOT_FOUND';
export const ADD_FAVOURITE_TARGET = 'favourite/ADD_FAVOURITE_TARGET';
export const REMOVE_FAVOURITE_TARGET = 'favourite/REMOVE_FAVOURITE_TARGET';

export interface AddTargetPayload {
  target: PlotSearchTarget;
  plotSearch: number;
}

export interface ReceiveFavouriteAction {
  type: typeof RECEIVE_FAVOURITE;
  payload: Favourite;
}

export interface FetchFavouriteAction {
  type: typeof FETCH_FAVOURITE;
  payload: {
    params: Record<string, string>;
  };
}

export interface ReceiveFavouriteAttributesAction {
  type: typeof RECEIVE_FAVOURITE_ATTRIBUTES;
  payload: ApiAttributes;
}

export interface AddFavouriteTargetAction {
  type: typeof ADD_FAVOURITE_TARGET;
  payload: AddTargetPayload;
}

export interface RemoveFavouriteTargetAction {
  type: typeof REMOVE_FAVOURITE_TARGET;
  payload: number;
}

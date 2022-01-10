import { createSlice } from '@reduxjs/toolkit';
import {
  FETCH_FAVOURITE,
  FETCH_FAVOURITE_ATTRIBUTES,
  RECEIVE_FAVOURITE,
  RECEIVE_FAVOURITE_ATTRIBUTES,
  Favourite,
  ReceiveFavouriteAction,
  ReceiveFavouriteAttributesAction,
  ADD_FAVOURITE_TARGET,
  AddFavouriteTargetAction,
  REMOVE_FAVOURITE_TARGET,
  RemoveFavouriteTargetAction,
} from './types';
import { ApiAttributes } from '../api/types';
import { PlotSearchTarget } from '../plotSearch/types';

type CurrentDisplayState = {
  favourite: Favourite;
  favouriteAttributes: ApiAttributes;
  isFetchingFavourite: boolean;
  isFetchingFavouriteAttributes: boolean;
};

const getInitialFavourite = (): Favourite => {
  const favs = localStorage.getItem('mvj_favourite');
  if (favs !== null) {
    return JSON.parse(favs) as Favourite;
  }

  return {
    user: null,
    modified_at: null,
    created_at: null,
    plotSearch: null,
    targets: [],
  };
};

const initialState: CurrentDisplayState = {
  favourite: getInitialFavourite(),
  favouriteAttributes: {},
  isFetchingFavourite: false,
  isFetchingFavouriteAttributes: false,
};

const favouriteSlice = createSlice({
  name: 'favourite',
  initialState,
  reducers: {},
  extraReducers: {
    [RECEIVE_FAVOURITE]: (state, { payload }: ReceiveFavouriteAction) => {
      state.favourite = payload;
      state.isFetchingFavourite = false;
    },
    [FETCH_FAVOURITE]: (state) => {
      state.isFetchingFavourite = true;
    },
    [RECEIVE_FAVOURITE_ATTRIBUTES]: (
      state,
      { payload }: ReceiveFavouriteAttributesAction
    ) => {
      state.favouriteAttributes = payload;
      state.isFetchingFavouriteAttributes = false;
    },
    [FETCH_FAVOURITE_ATTRIBUTES]: (state) => {
      state.isFetchingFavouriteAttributes = true;
    },
    [ADD_FAVOURITE_TARGET]: (state, { payload }: AddFavouriteTargetAction) => {
      const targetAlreadyExists = state.favourite.targets.some((target) => {
        return target.id == payload.target.id;
      });

      if (targetAlreadyExists) {
        return;
      }

      if (
        state.favourite.plotSearch !== null &&
        payload.plotSearch !== state.favourite.plotSearch
      ) {
        return;
      }

      state.favourite.plotSearch = payload.plotSearch;
      state.favourite.targets.push(payload.target as PlotSearchTarget);
      const time = new Date();
      if (!state.favourite.created_at) {
        state.favourite.created_at = time.toISOString();
      }
      state.favourite.modified_at = time.toISOString();
    },
    [REMOVE_FAVOURITE_TARGET]: (
      state,
      { payload }: RemoveFavouriteTargetAction
    ) => {
      state.favourite.targets = state.favourite.targets.filter((target) => {
        return target.id != payload;
      });
      if (state.favourite.targets.length === 0) {
        state.favourite.plotSearch = null;
      }
      state.favourite.modified_at = new Date().toISOString();
    },
  },
});

export default favouriteSlice.reducer;

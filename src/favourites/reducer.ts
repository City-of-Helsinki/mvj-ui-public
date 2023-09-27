import { createSlice } from '@reduxjs/toolkit';
import {
  FETCH_FAVOURITE,
  RECEIVE_FAVOURITE,
  Favourite,
  ReceiveFavouriteAction,
  ADD_FAVOURITE_TARGET,
  REMOVE_FAVOURITE_TARGET,
  FAVOURITE_NOT_FOUND,
  MVJ_FAVOURITE,
  FAVOURITE_FETCH_ERROR,
  DEFAULT_FAVOURITE,
  CLEAR_FAVOURITE,
} from './types';

type CurrentDisplayState = {
  favourite: Favourite;
  isFetchingFavourite: boolean;
};

const getInitialFavourite = (): Favourite => {
  const favs = localStorage.getItem(MVJ_FAVOURITE);
  if (favs !== null) {
    return JSON.parse(favs) as Favourite;
  }

  return DEFAULT_FAVOURITE;
};

const initialState: CurrentDisplayState = {
  favourite: getInitialFavourite(),
  isFetchingFavourite: false,
};

const favouriteSlice = createSlice({
  name: 'favourite',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        RECEIVE_FAVOURITE,
        (state, { payload }: ReceiveFavouriteAction) => {
          state.favourite = payload;
          state.isFetchingFavourite = false;
        },
      )
      .addCase(FETCH_FAVOURITE, (state) => {
        state.isFetchingFavourite = true;
      })
      .addCase(FAVOURITE_NOT_FOUND, (state) => {
        state.isFetchingFavourite = false;
      })
      .addCase(ADD_FAVOURITE_TARGET, (state) => {
        state.isFetchingFavourite = true;
      })
      .addCase(REMOVE_FAVOURITE_TARGET, (state) => {
        state.isFetchingFavourite = true;
      })
      .addCase(FAVOURITE_FETCH_ERROR, (state) => {
        state.isFetchingFavourite = false;
      })
      .addCase(CLEAR_FAVOURITE, (state) => {
        state.favourite.targets = [];
        state.favourite.modified_at = new Date().toISOString();
      });
  },
});

export default favouriteSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import {
  FETCH_FAVOURITE,
  RECEIVE_FAVOURITE,
  Favourite,
  ReceiveFavouriteAction,
  ADD_FAVOURITE_TARGET,
  REMOVE_FAVOURITE_TARGET,
  FAVOURITE_NOT_FOUND,
} from './types';

type CurrentDisplayState = {
  favourite: Favourite;
  isFetchingFavourite: boolean;
};

const getInitialFavourite = (): Favourite => {
  const favs = localStorage.getItem('mvj_favourite');
  if (favs !== null) {
    return JSON.parse(favs) as Favourite;
  }

  return {
    modified_at: null,
    created_at: null,
    targets: [],
  };
};

const initialState: CurrentDisplayState = {
  favourite: getInitialFavourite(),
  isFetchingFavourite: false,
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
    [FAVOURITE_NOT_FOUND]: (state) => {
      state.isFetchingFavourite = false;
    },
    [ADD_FAVOURITE_TARGET]: (state) => {
      state.isFetchingFavourite = true;
    },
    [REMOVE_FAVOURITE_TARGET]: (state) => {
      state.isFetchingFavourite = true;
    },
  },
});

export default favouriteSlice.reducer;

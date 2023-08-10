import { createSlice } from '@reduxjs/toolkit';
import {
  GENERATE_FAVOURITE,
  FAVOURITE_GENERATED,
  FAVOURITE_GENERATION_FAILED,
  GenerateFavouriteAction,
} from './types';

type CurrentDisplayState = {
  directReservationLinkId: string;
  isGeneratingFavourite: boolean;
  generationFailed: boolean;
  generationSuccessful: boolean;
};

const initialState: CurrentDisplayState = {
  directReservationLinkId: '',
  isGeneratingFavourite: false,
  generationFailed: false,
  generationSuccessful: false,
};

const directReservationSlice = createSlice({
  name: 'directReservation',
  initialState,
  reducers: {},
  extraReducers: {
    [GENERATE_FAVOURITE]: (state, { payload }: GenerateFavouriteAction) => {
      state.directReservationLinkId = payload;
      state.isGeneratingFavourite = true;
      state.generationSuccessful = false;
      state.generationFailed = false;
    },
    [FAVOURITE_GENERATED]: (state) => {
      state.generationSuccessful = true;
      state.isGeneratingFavourite = false;
      state.generationFailed = false;
    },
    [FAVOURITE_GENERATION_FAILED]: (state) => {
      state.generationSuccessful = false;
      state.isGeneratingFavourite = false;
      state.generationFailed = true;
    },
  },
});

export default directReservationSlice.reducer;

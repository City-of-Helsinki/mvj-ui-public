import { createSlice } from '@reduxjs/toolkit';
import {
  FETCH_UI_DATA,
  RECEIVE_UI_DATA,
  UiData,
  ReceiveUiDataAction,
  UI_DATA_NOT_FOUND,
  FETCH_UI_DATA_ERROR,
} from './types';

type CurrentDisplayState = {
  uiData: UiData;
  isFetchingUiData: boolean;
  fetchingFailed: boolean;
  uiDataNotFound: boolean;
};

const initialState: CurrentDisplayState = {
  uiData: {
    plot_search: 0,
    other_search: 0,
  },
  isFetchingUiData: false,
  fetchingFailed: false,
  uiDataNotFound: false,
};

const frontPageReducer = createSlice({
  name: 'uiData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(RECEIVE_UI_DATA, (state, { payload }: ReceiveUiDataAction) => {
        state.uiData = payload;
        state.isFetchingUiData = false;
        state.fetchingFailed = false;
        state.uiDataNotFound = false;
      })
      .addCase(FETCH_UI_DATA, (state) => {
        state.isFetchingUiData = true;
        state.fetchingFailed = false;
        state.uiDataNotFound = false;
      })
      .addCase(UI_DATA_NOT_FOUND, (state) => {
        state.isFetchingUiData = false;
        state.fetchingFailed = false;
        state.uiDataNotFound = true;
      })
      .addCase(FETCH_UI_DATA_ERROR, (state) => {
        state.isFetchingUiData = false;
        state.fetchingFailed = true;
        state.uiDataNotFound = false;
      });
  },
});

export default frontPageReducer.reducer;

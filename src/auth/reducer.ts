import { createSlice } from '@reduxjs/toolkit';

import {
  FETCH_API_TOKEN,
  TOKEN_NOT_FOUND,
  RECEIVE_API_TOKEN,
  ReceiveApiTokenAction,
} from './types';

type CurrentDisplayState = {
  apiToken: string;
  isFetching: boolean;
};

const initialState: CurrentDisplayState = {
  apiToken: '',
  isFetching: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FETCH_API_TOKEN, (state) => {
        state.isFetching = true;
      })
      .addCase(TOKEN_NOT_FOUND, (state) => {
        state.isFetching = false;
      })
      .addCase(RECEIVE_API_TOKEN, (state, action: ReceiveApiTokenAction) => {
        state.isFetching = false;
        state.apiToken = action.payload;
      });
  },
});

export default authSlice.reducer;

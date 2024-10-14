import { createSlice } from '@reduxjs/toolkit';
import type { TokenData, User } from 'hds-react';

import {
  RECEIVE_API_TOKEN,
  CLEAR_API_TOKEN,
  RENEW_API_TOKEN,
  ReceiveApiTokenAction,
  USER_FOUND,
  UserFoundAction,
  CLEAR_USER,
} from './types';

type CurrentAuthDisplayState = {
  user: User | null;
  apiToken: TokenData | null;
  isRenewingApiToken: boolean;
};

const initialAuthState: CurrentAuthDisplayState = {
  user: null,
  apiToken: null,
  isRenewingApiToken: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(USER_FOUND, (state, action: UserFoundAction) => {
        state.user = action.payload;
      })
      .addCase(CLEAR_USER, (state) => {
        state.user = null;
      })
      .addCase(RECEIVE_API_TOKEN, (state, action: ReceiveApiTokenAction) => {
        state.isRenewingApiToken = false;
        state.apiToken = action.payload;
      })
      .addCase(CLEAR_API_TOKEN, (state) => {
        state.apiToken = null;
        state.isRenewingApiToken = false;
      })
      .addCase(RENEW_API_TOKEN, (state) => {
        state.isRenewingApiToken = true;
      });
  },
});

export const authReducer = authSlice.reducer;

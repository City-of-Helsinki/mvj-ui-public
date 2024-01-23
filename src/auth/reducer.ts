import { createSlice } from '@reduxjs/toolkit';
import type { User } from 'oidc-client-ts';

import {
  FETCH_API_TOKEN,
  TOKEN_NOT_FOUND,
  RECEIVE_API_TOKEN,
  ReceiveApiTokenAction,
  USER_EXPIRED,
  USER_FOUND,
  UserFoundAction,
  SILENT_RENEW_ERROR,
  SESSION_TERMINATED,
  LOADING_USER,
  USER_SIGNED_OUT,
} from './types';

type OidcState = {
  user: User | null;
  isLoadingUser: boolean;
};

type CurrentAuthDisplayState = {
  apiToken: string | null;
  isFetching: boolean;
};

const initialOidcState: OidcState = {
  user: null,
  isLoadingUser: false,
};

const oidcSlice = createSlice({
  name: 'oidc',
  initialState: initialOidcState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(USER_EXPIRED, (state) => {
        state.user = null;
        state.isLoadingUser = false;
      })
      .addCase(SILENT_RENEW_ERROR, (state) => {
        state.user = null;
        state.isLoadingUser = false;
      })
      .addCase(SESSION_TERMINATED, (state) => {
        state.user = null;
        state.isLoadingUser = false;
      })
      .addCase(USER_SIGNED_OUT, (state) => {
        state.user = null;
        state.isLoadingUser = false;
      })
      .addCase(USER_FOUND, (state, action: UserFoundAction) => {
        state.user = action.payload;
        state.isLoadingUser = false;
      })
      .addCase(LOADING_USER, (state) => {
        state.isLoadingUser = true;
      });
  },
});

const initialAuthState: CurrentAuthDisplayState = {
  apiToken: null,
  isFetching: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
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

export const oidcReducer = oidcSlice.reducer;
export const authReducer = authSlice.reducer;

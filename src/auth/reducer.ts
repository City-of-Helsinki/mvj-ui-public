import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FETCH_API_TOKEN, TOKEN_NOT_FOUND, RECEIVE_API_TOKEN } from './types';

type CurrentDisplayState = {
  apiToken: string;
  isFetching: boolean;
};

const initialState: CurrentDisplayState = {
  apiToken: '',
  isFetching: false,
};

const countSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: {
    [FETCH_API_TOKEN]: (state) => {
      state.isFetching = true;
    },
    [TOKEN_NOT_FOUND]: (state) => {
      state.isFetching = false;
    },
    [RECEIVE_API_TOKEN]: (state, action: PayloadAction<string>) => {
      state.isFetching = false;
      state.apiToken = action.payload;
    },
  },
});

export default countSlice.reducer;

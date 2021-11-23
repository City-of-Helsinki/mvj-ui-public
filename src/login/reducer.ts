import { createSlice } from '@reduxjs/toolkit';
import { OPEN_LOGIN_MODAL, HIDE_LOGIN_MODAL } from './types';

type CurrentDisplayState = {
  isLoginModalOpen: boolean;
};

const initialState: CurrentDisplayState = {
  isLoginModalOpen: false,
};

const countSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: {
    [OPEN_LOGIN_MODAL]: (state) => {
      state.isLoginModalOpen = true;
    },
    [HIDE_LOGIN_MODAL]: (state) => {
      state.isLoginModalOpen = false;
    },
  },
});

export default countSlice.reducer;

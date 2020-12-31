import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CHANGE_LANG, Language } from './types';

type CurrentDisplayState = {
  current: Language,
}

const initialState: CurrentDisplayState = {
  current: Language.FI,
};

const countSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
  },
  extraReducers: {
    [CHANGE_LANG]: (state, action: PayloadAction<Language>) => {
      state.current = action.payload;
    },
  }
});

export default countSlice.reducer;
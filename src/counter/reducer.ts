import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as actionTypes from './types';

type CurrentDisplayState = {
  clicks: number,
  isCounting: boolean,
}

const initialState: CurrentDisplayState = {
  clicks: 0,
  isCounting: false
};

const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
  },
  extraReducers: {
    [actionTypes.INCREMENT]: (state, action: PayloadAction<number>) => {
      state.clicks += action.payload;
    },
    [actionTypes.DECREMENT]: (state, action: PayloadAction<number>) => {
      state.clicks -= action.payload;
    },
    [actionTypes.IS_COUNTING]: (state, action: PayloadAction<boolean>) => {
      state.isCounting = action.payload;
    },
  }
});

export default countSlice.reducer;
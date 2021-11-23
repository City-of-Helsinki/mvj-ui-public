import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INCREMENT, DECREMENT, IS_COUNTING } from './types';

type CurrentDisplayState = {
  clicks: number;
  isCounting: boolean;
};

const initialState: CurrentDisplayState = {
  clicks: 0,
  isCounting: false,
};

const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {},
  extraReducers: {
    [INCREMENT]: (state, action: PayloadAction<number>) => {
      state.clicks += action.payload;
    },
    [DECREMENT]: (state, action: PayloadAction<number>) => {
      state.clicks -= action.payload;
    },
    [IS_COUNTING]: (state, action: PayloadAction<boolean>) => {
      state.isCounting = action.payload;
    },
  },
});

export default countSlice.reducer;

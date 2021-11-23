import { createSlice } from '@reduxjs/toolkit';
import { PlotSearch, RECEIVE_PLOT_SEARCHES } from './types';

type CurrentDisplayState = {
  plotSearches: Array<PlotSearch>;
};

const initialState: CurrentDisplayState = {
  plotSearches: [],
};

const plotSearchSlice = createSlice({
  name: 'plotSearch',
  initialState,
  reducers: {},
  extraReducers: {
    [RECEIVE_PLOT_SEARCHES]: (
      state,
      { payload }: { payload: Array<PlotSearch> }
    ) => {
      state.plotSearches = payload;
    },
  },
});

export default plotSearchSlice.reducer;

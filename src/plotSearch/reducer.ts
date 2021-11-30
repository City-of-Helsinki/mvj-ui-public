import { createSlice } from '@reduxjs/toolkit';
import {
  FETCH_PLOT_SEARCH_ATTRIBUTES,
  FETCH_PLOT_SEARCHES,
  PlotSearch,
  RECEIVE_PLOT_SEARCH_ATTRIBUTES,
  RECEIVE_PLOT_SEARCHES,
} from './types';
import { ApiAttributes } from '../api/types';

type CurrentDisplayState = {
  plotSearches: Array<PlotSearch>;
  plotSearchAttributes: ApiAttributes;
  isFetchingPlotSearches: boolean;
  isFetchingPlotSearchAttributes: boolean;
};

const initialState: CurrentDisplayState = {
  plotSearches: [],
  plotSearchAttributes: {},
  isFetchingPlotSearches: false,
  isFetchingPlotSearchAttributes: false,
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
      state.isFetchingPlotSearches = false;
    },
    [FETCH_PLOT_SEARCHES]: (state) => {
      state.isFetchingPlotSearches = true;
    },
    [RECEIVE_PLOT_SEARCH_ATTRIBUTES]: (
      state,
      { payload }: { payload: ApiAttributes }
    ) => {
      state.plotSearchAttributes = payload;
      state.isFetchingPlotSearchAttributes = false;
    },
    [FETCH_PLOT_SEARCH_ATTRIBUTES]: (state) => {
      state.isFetchingPlotSearchAttributes = true;
    },
  },
});

export default plotSearchSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import {
  FETCH_PLOT_SEARCH_ATTRIBUTES,
  FETCH_PLOT_SEARCH_STAGES,
  FETCH_PLOT_SEARCH_TYPES,
  FETCH_PLOT_SEARCHES,
  PLOT_SEARCHES_NOT_FOUND,
  PlotSearch,
  PlotSearchStage,
  PlotSearchType,
  RECEIVE_PLOT_SEARCH_ATTRIBUTES,
  RECEIVE_PLOT_SEARCH_STAGES,
  RECEIVE_PLOT_SEARCH_TYPES,
  RECEIVE_PLOT_SEARCHES,
  ReceivePlotSearchAttributesAction,
  ReceivePlotSearchesAction,
  ReceivePlotSearchStagesAction,
  ReceivePlotSearchTypesAction,
} from './types';
import { ApiAttributes } from '../api/types';

type CurrentDisplayState = {
  plotSearches: Array<PlotSearch>;
  plotSearchAttributes: ApiAttributes;
  plotSearchTypes: Array<PlotSearchType>;
  plotSearchStages: Array<PlotSearchStage>;
  isFetchingPlotSearches: boolean;
  isFetchingPlotSearchAttributes: boolean;
  isFetchingPlotSearchTypes: boolean;
  isFetchingPlotSearchStages: boolean;
};

const initialState: CurrentDisplayState = {
  plotSearches: [],
  plotSearchAttributes: {},
  plotSearchTypes: [],
  plotSearchStages: [],
  isFetchingPlotSearches: false,
  isFetchingPlotSearchAttributes: false,
  isFetchingPlotSearchTypes: false,
  isFetchingPlotSearchStages: false,
};

const plotSearchSlice = createSlice({
  name: 'plotSearch',
  initialState,
  reducers: {},
  extraReducers: {
    [RECEIVE_PLOT_SEARCHES]: (
      state,
      { payload }: ReceivePlotSearchesAction
    ) => {
      state.plotSearches = payload;
      state.isFetchingPlotSearches = false;
    },
    [FETCH_PLOT_SEARCHES]: (state) => {
      state.isFetchingPlotSearches = true;
    },
    [PLOT_SEARCHES_NOT_FOUND]: (state) => {
      state.isFetchingPlotSearches = false;
    },
    [RECEIVE_PLOT_SEARCH_ATTRIBUTES]: (
      state,
      { payload }: ReceivePlotSearchAttributesAction
    ) => {
      state.plotSearchAttributes = payload;
      state.isFetchingPlotSearchAttributes = false;
    },
    [FETCH_PLOT_SEARCH_ATTRIBUTES]: (state) => {
      state.isFetchingPlotSearchAttributes = true;
    },
    [RECEIVE_PLOT_SEARCH_TYPES]: (
      state,
      { payload }: ReceivePlotSearchTypesAction
    ) => {
      state.plotSearchTypes = payload;
      state.isFetchingPlotSearchTypes = false;
    },
    [FETCH_PLOT_SEARCH_TYPES]: (state) => {
      state.isFetchingPlotSearchTypes = true;
    },
    [RECEIVE_PLOT_SEARCH_STAGES]: (
      state,
      { payload }: ReceivePlotSearchStagesAction
    ) => {
      state.plotSearchStages = payload;
      state.isFetchingPlotSearchStages = false;
    },
    [FETCH_PLOT_SEARCH_STAGES]: (state) => {
      state.isFetchingPlotSearchStages = true;
    },
  },
});

export default plotSearchSlice.reducer;

import { createAction } from 'redux-actions';
import { Action } from 'redux';

import {
  FETCH_PLOT_SEARCH_ATTRIBUTES,
  FETCH_PLOT_SEARCHES,
  PLOT_SEARCH_ATTRIBUTES_NOT_FOUND,
  PLOT_SEARCHES_NOT_FOUND,
  PlotSearch,
  RECEIVE_PLOT_SEARCH_ATTRIBUTES,
  RECEIVE_PLOT_SEARCHES,
} from './types';
import { ApiAttributes } from '../api/types';

export const fetchPlotSearches = (): Action<string> =>
  createAction(FETCH_PLOT_SEARCHES)();

export const receivePlotSearches = (
  plotSearches: Array<PlotSearch>
): Action<string> => createAction(RECEIVE_PLOT_SEARCHES)(plotSearches);

export const plotSearchesNotFound = (): Action<string> =>
  createAction(PLOT_SEARCHES_NOT_FOUND)();

export const fetchPlotSearchAttributes = (): Action<string> =>
  createAction(FETCH_PLOT_SEARCH_ATTRIBUTES)();

export const receivePlotSearchAttributes = (
  plotSearches: ApiAttributes
): Action<string> => createAction(RECEIVE_PLOT_SEARCH_ATTRIBUTES)(plotSearches);

export const plotSearchAttributesNotFound = (): Action<string> =>
  createAction(PLOT_SEARCH_ATTRIBUTES_NOT_FOUND)();

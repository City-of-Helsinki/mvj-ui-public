import { createAction } from 'redux-actions';
import { Action } from 'redux';

import {
  FETCH_PLOT_SEARCH_ATTRIBUTES,
  FETCH_PLOT_SEARCH_TYPES,
  FETCH_PLOT_SEARCHES,
  PLOT_SEARCH_ATTRIBUTES_NOT_FOUND,
  PLOT_SEARCH_TYPES_NOT_FOUND,
  PLOT_SEARCHES_NOT_FOUND,
  PlotSearch,
  PlotSearchType,
  RECEIVE_PLOT_SEARCH_ATTRIBUTES,
  RECEIVE_PLOT_SEARCH_TYPES,
  RECEIVE_PLOT_SEARCHES,
} from './types';
import { ApiAttributes } from '../api/types';

export const fetchPlotSearches = (payload?: {
  params: Record<string, string>;
}): Action<string> => createAction(FETCH_PLOT_SEARCHES)(payload);

export const receivePlotSearches = (
  payload: Array<PlotSearch>
): Action<string> => createAction(RECEIVE_PLOT_SEARCHES)(payload);

export const plotSearchesNotFound = (): Action<string> =>
  createAction(PLOT_SEARCHES_NOT_FOUND)();

export const fetchPlotSearchAttributes = (): Action<string> =>
  createAction(FETCH_PLOT_SEARCH_ATTRIBUTES)();

export const receivePlotSearchAttributes = (
  payload: ApiAttributes
): Action<string> => createAction(RECEIVE_PLOT_SEARCH_ATTRIBUTES)(payload);

export const plotSearchAttributesNotFound = (): Action<string> =>
  createAction(PLOT_SEARCH_ATTRIBUTES_NOT_FOUND)();

export const fetchPlotSearchTypes = (): Action<string> =>
  createAction(FETCH_PLOT_SEARCH_TYPES)();

export const receivePlotSearchTypes = (
  payload: Array<PlotSearchType>
): Action<string> => createAction(RECEIVE_PLOT_SEARCH_TYPES)(payload);

export const plotSearchTypesNotFound = (): Action<string> =>
  createAction(PLOT_SEARCH_TYPES_NOT_FOUND)();

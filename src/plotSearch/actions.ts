import { createAction } from 'redux-actions';
import { Action } from 'redux';

import {
  FETCH_PLOT_SEARCHES,
  PlotSearch,
  RECEIVE_PLOT_SEARCHES,
} from './types';

export const fetchPlotSearches = (): Action<string> =>
  createAction(FETCH_PLOT_SEARCHES)();

export const receivePlotSearches = (
  plotSearches: Array<PlotSearch>
): Action<string> => createAction(RECEIVE_PLOT_SEARCHES)(plotSearches);

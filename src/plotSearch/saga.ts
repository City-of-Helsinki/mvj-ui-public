import { all, call, Effect, fork, takeLatest } from 'redux-saga/effects';
import { fetchPlotSearchesRequest } from './requests';
import {
  FetchPlotSearchesAction,
  FETCH_PLOT_SEARCHES,
  PlotSearch,
} from './types';
import { receivePlotSearches } from './actions';
import { ApiCallResult } from '../api/callApi';

function* fetchPlotSearchesSaga({
  payload,
}: FetchPlotSearchesAction): Generator<Effect, void, ApiCallResult> {
  try {
    const { response, bodyAsJson } = yield call(
      fetchPlotSearchesRequest,
      payload?.params
    );

    switch (response.status) {
      case 200:
        receivePlotSearches(bodyAsJson?.results as Array<PlotSearch>);
        break;
      case 404:
        // ...
        break;
      default:
        break;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export default function* plotSearchSaga(): Generator {
  yield all([
    fork(function* (): Generator {
      yield takeLatest(FETCH_PLOT_SEARCHES, fetchPlotSearchesSaga);
    }),
  ]);
}

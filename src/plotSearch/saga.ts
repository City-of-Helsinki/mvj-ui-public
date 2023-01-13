import { all, call, Effect, fork, put, takeLatest } from 'redux-saga/effects';
import {
  fetchPlotSearchAttributesRequest,
  fetchPlotSearchesRequest,
  fetchPlotSearchTypesRequest,
} from './requests';
import {
  FetchPlotSearchesAction,
  FETCH_PLOT_SEARCHES,
  FETCH_PLOT_SEARCH_ATTRIBUTES,
  FETCH_PLOT_SEARCH_TYPES,
  PlotSearchType,
  PlotSearchFromBackend,
} from './types';
import {
  plotSearchAttributesNotFound,
  plotSearchesNotFound,
  plotSearchTypesNotFound,
  receivePlotSearchAttributes,
  receivePlotSearches,
  receivePlotSearchTypes,
} from './actions';
import { parsePlotSearches } from './helpers';
import { ApiCallResult } from '../api/callApi';
import { ApiAttributes } from '../api/types';
import { logError } from '../root/helpers';

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
        yield put(
          receivePlotSearches(
            parsePlotSearches(
              bodyAsJson?.results as Array<PlotSearchFromBackend>
            )
          )
        );
        break;
      default:
        yield put(plotSearchesNotFound());
        break;
    }
  } catch (e) {
    logError(e);
    yield put(plotSearchesNotFound());
    throw e;
  }
}

function* fetchPlotSearchAttributesSaga(): Generator<
  Effect,
  void,
  ApiCallResult
> {
  try {
    const { response, bodyAsJson } = yield call(
      fetchPlotSearchAttributesRequest
    );

    switch (response.status) {
      case 200:
        yield put(
          receivePlotSearchAttributes(bodyAsJson?.fields as ApiAttributes)
        );
        break;
      default:
        yield put(plotSearchAttributesNotFound());
        break;
    }
  } catch (e) {
    yield put(plotSearchAttributesNotFound());
    throw e;
  }
}

function* fetchPlotSearchTypesSaga(): Generator<Effect, void, ApiCallResult> {
  try {
    const { response, bodyAsJson } = yield call(fetchPlotSearchTypesRequest);

    switch (response.status) {
      case 200:
        yield put(
          receivePlotSearchTypes(bodyAsJson?.results as Array<PlotSearchType>)
        );
        break;
      default:
        yield put(plotSearchTypesNotFound());
        break;
    }
  } catch (e) {
    logError(e);
    yield put(plotSearchTypesNotFound());
    throw e;
  }
}

export default function* plotSearchSaga(): Generator {
  yield all([
    fork(function* (): Generator {
      yield takeLatest(FETCH_PLOT_SEARCHES, fetchPlotSearchesSaga);
      yield takeLatest(
        FETCH_PLOT_SEARCH_ATTRIBUTES,
        fetchPlotSearchAttributesSaga
      );
      yield takeLatest(FETCH_PLOT_SEARCH_TYPES, fetchPlotSearchTypesSaga);
    }),
  ]);
}

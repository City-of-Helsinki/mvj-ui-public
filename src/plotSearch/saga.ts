import {
  all,
  call,
  Effect,
  fork,
  put,
  select,
  takeLatest,
  take,
} from 'redux-saga/effects';
import {
  fetchPlotSearchAttributesRequest,
  fetchPlotSearchesRequest,
  fetchPlotSearchStagesRequest,
  fetchPlotSearchTypesRequest,
} from './requests';
import {
  FetchPlotSearchesAction,
  FETCH_PLOT_SEARCHES,
  FETCH_PLOT_SEARCH_ATTRIBUTES,
  FETCH_PLOT_SEARCH_TYPES,
  PlotSearchType,
  PlotSearchFromBackend,
  PlotSearchStage,
  FETCH_PLOT_SEARCH_STAGES,
  PLOT_SEARCH_STAGES_NOT_FOUND,
  RECEIVE_PLOT_SEARCH_STAGES,
} from './types';
import {
  fetchPlotSearchStages,
  plotSearchAttributesNotFound,
  plotSearchesNotFound,
  plotSearchStagesNotFound,
  plotSearchTypesNotFound,
  receivePlotSearchAttributes,
  receivePlotSearches,
  receivePlotSearchStages,
  receivePlotSearchTypes,
} from './actions';
import { parsePlotSearches } from './helpers';
import { ApiCallResult } from '../api/callApi';
import { ApiAttributes } from '../api/types';
import { logError } from '../root/helpers';
import { RootState } from '../root/rootReducer';

function* fetchPlotSearchesSaga({
  payload,
}: FetchPlotSearchesAction): Generator<Effect, void, never> {
  try {
    let stages: Array<PlotSearchStage> = yield select(
      (state: RootState) => state.plotSearch.plotSearchStages
    );

    if (!stages.length) {
      yield put(fetchPlotSearchStages());
      yield take([RECEIVE_PLOT_SEARCH_STAGES, PLOT_SEARCH_STAGES_NOT_FOUND]);

      stages = yield select(
        (state: RootState) => state.plotSearch.plotSearchStages
      );
    }

    const ongoingId = stages.find((stage) => stage.stage === 'in_action')?.id;

    if (!ongoingId) {
      logError('Could not find ongoing stage ID');
      yield put(plotSearchesNotFound());
      return;
    }

    const result: ApiCallResult = yield call(fetchPlotSearchesRequest, {
      stage: '' + ongoingId,
      ...(payload?.params || {}),
    });
    const { response, bodyAsJson } = result;

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

function* fetchPlotSearchStagesSaga(): Generator<Effect, void, ApiCallResult> {
  try {
    const { response, bodyAsJson } = yield call(fetchPlotSearchStagesRequest);

    switch (response.status) {
      case 200:
        yield put(
          receivePlotSearchStages(bodyAsJson?.results as Array<PlotSearchStage>)
        );
        break;
      default:
        yield put(plotSearchStagesNotFound());
        break;
    }
  } catch (e) {
    logError(e);
    yield put(plotSearchStagesNotFound());
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
      yield takeLatest(FETCH_PLOT_SEARCH_STAGES, fetchPlotSearchStagesSaga);
    }),
  ]);
}

import { all, call, Effect, fork, put, takeLatest } from 'redux-saga/effects';

import { ApiCallResult } from '../api/callApi';
import { logError } from '../root/helpers';
import {
  FETCH_INTENDED_USES,
  IntendedUse,
  SUBMIT_AREA_SEARCH,
  SubmitAreaSearchAction,
} from './types';
import { fetchIntendedUsesRequest, submitAreaSearchRequest } from './requests';
import {
  areaSearchSubmissionFailed,
  intendedUsesNotFound,
  receiveAreaSearchSaved,
  receiveIntendedUses,
} from './actions';

function* submitAreaSearchSaga({
  payload,
}: SubmitAreaSearchAction): Generator<Effect, void, ApiCallResult> {
  try {
    const { response, bodyAsJson } = yield call(
      submitAreaSearchRequest,
      payload
    );

    switch (response.status) {
      case 200:
      case 201:
        yield put(receiveAreaSearchSaved(bodyAsJson.id as number));
        break;
      default:
        yield put(areaSearchSubmissionFailed(bodyAsJson));
        break;
    }
  } catch (e) {
    logError(e);
    yield put(areaSearchSubmissionFailed(e));
  }
}

export function* fetchIntendedUsesSaga(): Generator<
  Effect,
  void,
  ApiCallResult
> {
  try {
    const { response, bodyAsJson } = yield call(fetchIntendedUsesRequest);

    switch (response.status) {
      case 200:
        yield put(
          receiveIntendedUses(bodyAsJson.results as Array<IntendedUse>)
        );
        break;
      default:
        yield put(intendedUsesNotFound());
    }
  } catch (e) {
    logError(e);
    yield put(intendedUsesNotFound());
  }
}

export default function* areaSearchSaga(): Generator {
  yield all([
    fork(function* (): Generator {
      yield takeLatest(SUBMIT_AREA_SEARCH, submitAreaSearchSaga);
      yield takeLatest(FETCH_INTENDED_USES, fetchIntendedUsesSaga);
    }),
  ]);
}

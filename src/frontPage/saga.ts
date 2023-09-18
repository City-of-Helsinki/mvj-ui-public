import { all, call, Effect, fork, put, takeLatest } from 'redux-saga/effects';
import { fetchUiDataRequest } from './requests';

import { FETCH_UI_DATA, UiData } from './types';

import { uiDataNotFound, receiveUiData, fetchUiDataError } from './actions';

import { ApiCallResult } from '../api/callApi';
import { logError } from '../root/helpers';

function* fetchUiDataSaga(): Generator<Effect, void, ApiCallResult> {
  try {
    const { response, bodyAsJson } = yield call(fetchUiDataRequest);

    switch (response.status) {
      case 200:
        yield put(receiveUiData(bodyAsJson as UiData));
        break;
      default:
        yield put(uiDataNotFound());
        break;
    }
  } catch (e) {
    logError(e);
    yield put(fetchUiDataError());
    throw e;
  }
}

export default function* favouriteSaga(): Generator {
  yield all([
    fork(function* (): Generator {
      yield takeLatest(FETCH_UI_DATA, fetchUiDataSaga);
    }),
  ]);
}

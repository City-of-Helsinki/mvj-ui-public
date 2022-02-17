import { all, call, Effect, fork, put, takeLatest } from 'redux-saga/effects';
import { fetchFormAttributesRequest } from './requests';
import { FETCH_FORM_ATTRIBUTES } from './types';
import { formAttributesNotFound, receiveFormAttributes } from './actions';
import { ApiCallResult } from '../api/callApi';
import { ApiAttributes } from '../api/types';
import { logError } from '../root/helpers';

function* fetchFormAttributesSaga(): Generator<Effect, void, ApiCallResult> {
  try {
    const { response, bodyAsJson } = yield call(fetchFormAttributesRequest);

    switch (response.status) {
      case 200:
        yield put(receiveFormAttributes(bodyAsJson?.fields as ApiAttributes));
        break;
      default:
        yield put(formAttributesNotFound());
        break;
    }
  } catch (e) {
    logError(e);
    yield put(formAttributesNotFound());
    throw e;
  }
}

export default function* applicationSaga(): Generator {
  yield all([
    fork(function* (): Generator {
      yield takeLatest(FETCH_FORM_ATTRIBUTES, fetchFormAttributesSaga);
    }),
  ]);
}

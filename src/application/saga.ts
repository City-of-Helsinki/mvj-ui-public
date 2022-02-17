import { all, call, Effect, fork, put, takeLatest } from 'redux-saga/effects';
import {
  fetchFormAttributesRequest,
  submitApplicationRequest,
} from './requests';
import {
  FETCH_FORM_ATTRIBUTES,
  SUBMIT_APPLICATION,
  SubmitApplicationAction,
} from './types';
import {
  applicationSubmissionFailed,
  formAttributesNotFound,
  receiveApplicationSaved,
  receiveFormAttributes,
} from './actions';
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

function* submitApplicationSaga({
  payload,
}: SubmitApplicationAction): Generator<Effect, void, ApiCallResult> {
  try {
    const { response, bodyAsJson } = yield call(
      submitApplicationRequest,
      payload
    );

    switch (response.status) {
      case 200:
      case 201:
        yield put(receiveApplicationSaved(bodyAsJson.id as number));
        break;
      default:
        yield put(applicationSubmissionFailed(bodyAsJson));
        break;
    }
  } catch (e) {
    logError(e);
    yield put(applicationSubmissionFailed(e));
    throw e;
  }
}

export default function* applicationSaga(): Generator {
  yield all([
    fork(function* (): Generator {
      yield takeLatest(FETCH_FORM_ATTRIBUTES, fetchFormAttributesSaga);
      yield takeLatest(SUBMIT_APPLICATION, submitApplicationSaga);
    }),
  ]);
}

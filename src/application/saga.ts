import { all, call, Effect, fork, put, takeLatest } from 'redux-saga/effects';
import {
  deleteUploadRequest,
  fetchFormAttributesRequest,
  fetchPendingUploadsRequest,
  submitApplicationRequest,
  uploadFileRequest,
} from './requests';
import {
  ApplicationResponse,
  DELETE_UPLOAD,
  DeleteUploadAction,
  FETCH_FORM_ATTRIBUTES,
  FETCH_PENDING_UPLOADS,
  FileUploadError,
  SUBMIT_APPLICATION,
  SubmitApplicationAction,
  UPLOAD_FILE,
  UploadFileAction,
} from './types';
import {
  applicationSubmissionFailed,
  fetchPendingUploads,
  fileOperationFinished,
  fileUploadFailed,
  formAttributesNotFound,
  pendingUploadsNotFound,
  receiveApplicationSaved,
  receiveFormAttributes,
  receivePendingUploads,
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
        yield put(receiveApplicationSaved(bodyAsJson as ApplicationResponse));
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

function* fetchPendingUploadsSaga(): Generator<Effect, void, ApiCallResult> {
  try {
    const { response, bodyAsJson } = yield call(fetchPendingUploadsRequest);

    switch (response.status) {
      case 200:
        yield put(receivePendingUploads(bodyAsJson.results));
        break;
      default:
        yield put(pendingUploadsNotFound());
        break;
    }
  } catch (e) {
    logError(e);
    yield put(pendingUploadsNotFound());
    throw e;
  }
}

function* deleteUploadSaga({
  payload,
}: DeleteUploadAction): Generator<Effect, void, ApiCallResult> {
  try {
    yield call(deleteUploadRequest, payload);

    yield put(fileOperationFinished());
    yield put(fetchPendingUploads());
  } catch (e) {
    logError(e);
    yield put(pendingUploadsNotFound());
    throw e;
  }
}

function* uploadFileSaga({
  payload,
}: UploadFileAction): Generator<Effect, void, ApiCallResult> {
  try {
    const { response, bodyAsJson } = yield call(
      uploadFileRequest,
      payload.fileData
    );

    switch (response.status) {
      case 200:
      case 201:
        yield put(fileOperationFinished());
        payload.callback?.(bodyAsJson);
        yield put(fetchPendingUploads());
        break;
      default:
        logError(bodyAsJson);
        yield put(fileUploadFailed());
        payload.callback?.(undefined, FileUploadError.NonOkResponse);
    }
  } catch (e) {
    logError(e);
    yield put(fileUploadFailed());
    payload.callback?.(undefined, FileUploadError.Exception);
    throw e;
  }
}

export default function* applicationSaga(): Generator {
  yield all([
    fork(function* (): Generator {
      yield takeLatest(FETCH_FORM_ATTRIBUTES, fetchFormAttributesSaga);
      yield takeLatest(FETCH_PENDING_UPLOADS, fetchPendingUploadsSaga);
      yield takeLatest(DELETE_UPLOAD, deleteUploadSaga);
      yield takeLatest(UPLOAD_FILE, uploadFileSaga);
      yield takeLatest(SUBMIT_APPLICATION, submitApplicationSaga);
    }),
  ]);
}

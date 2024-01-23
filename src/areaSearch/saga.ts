import { all, call, Effect, fork, put, takeLatest } from 'redux-saga/effects';

import { ApiCallResult } from '../api/callApi';
import { logError } from '../root/helpers';
import {
  FETCH_INTENDED_USES,
  IntendedUse,
  SUBMIT_AREA_SEARCH,
  SubmitAreaSearchAction,
  AreaSearch,
  SUBMIT_AREA_SEARCH_APPLICATION,
  SubmitAreaSearchApplicationAction,
} from './types';
import {
  fetchIntendedUsesRequest,
  submitAreaSearchApplicationRequest,
  submitAreaSearchAttachmentRequest,
  submitAreaSearchRequest,
} from './requests';
import {
  areaSearchApplicationSubmissionFailed,
  areaSearchAttachmentSubmissionFailed,
  areaSearchSubmissionFailed,
  intendedUsesNotFound,
  receiveAreaSearchApplicationSaved,
  receiveAreaSearchAttachmentSaved,
  receiveAreaSearchSaved,
  receiveIntendedUses,
} from './actions';
import { UploadedFileMeta } from '../application/types';

function* submitAreaSearchSaga({
  payload,
}: SubmitAreaSearchAction): Generator<Effect, void, ApiCallResult> {
  try {
    const attachmentIds: number[] = [];
    const failedAttachmentUploads: string[] = [];
    const pushAttachmentIds = (id: number): void => {
      attachmentIds.push(id);
    };

    if (payload.area_search_attachments) {
      yield all(
        payload.area_search_attachments.map((attachment, index) =>
          call(
            function* ({ fileData, callback }) {
              try {
                const { response, bodyAsJson } = yield call(
                  submitAreaSearchAttachmentRequest,
                  fileData,
                );
                switch (response.status) {
                  case 200:
                  case 201:
                    if (callback) {
                      callback(bodyAsJson);
                    }
                    yield put(receiveAreaSearchAttachmentSaved(bodyAsJson));
                    break;
                  default:
                    yield put(areaSearchAttachmentSubmissionFailed(bodyAsJson));
                    failedAttachmentUploads.push(
                      typeof attachment === 'number'
                        ? String(attachment)
                        : attachment.name,
                    );
                    break;
                }
              } catch (e) {
                logError(e);
                yield put(areaSearchAttachmentSubmissionFailed(e));
                failedAttachmentUploads.push(
                  typeof attachment === 'number'
                    ? String(attachment)
                    : attachment.name,
                );
                throw e;
              }
            },
            {
              fileData: {
                field: index,
                file: attachment,
              },
              callback: (file: UploadedFileMeta) => pushAttachmentIds(file.id),
            },
          ),
        ),
      );
    }

    if (failedAttachmentUploads.length > 0) {
      yield put(
        areaSearchSubmissionFailed({
          failedAttachments: failedAttachmentUploads,
        }),
      );
      return;
    }

    const newPayload = { ...payload, area_search_attachments: attachmentIds };

    const { response, bodyAsJson } = yield call(
      submitAreaSearchRequest,
      newPayload,
    );

    switch (response.status) {
      case 200:
      case 201:
        yield put(receiveAreaSearchSaved(bodyAsJson as AreaSearch));
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

function* submitAreaSearchApplicationSaga({
  payload,
}: SubmitAreaSearchApplicationAction): Generator<Effect, void, ApiCallResult> {
  try {
    const { response, bodyAsJson } = yield call(
      submitAreaSearchApplicationRequest,
      payload,
    );

    switch (response.status) {
      case 200:
      case 201:
        yield put(receiveAreaSearchApplicationSaved(bodyAsJson as AreaSearch));
        break;
      default:
        yield put(areaSearchApplicationSubmissionFailed(bodyAsJson));
        break;
    }
  } catch (e) {
    logError(e);
    yield put(areaSearchApplicationSubmissionFailed(e));
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
          receiveIntendedUses(bodyAsJson.results as Array<IntendedUse>),
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
      yield takeLatest(
        SUBMIT_AREA_SEARCH_APPLICATION,
        submitAreaSearchApplicationSaga,
      );
      yield takeLatest(FETCH_INTENDED_USES, fetchIntendedUsesSaga);
    }),
  ]);
}

import { ApiAttributes } from '../api/types';
import { Action } from 'redux';
import { createAction } from 'redux-actions';
import {
  APPLICATION_SUBMISSION_FAILED,
  ApplicationSubmission,
  DELETE_UPLOAD,
  FETCH_FORM_ATTRIBUTES,
  FETCH_PENDING_UPLOADS,
  FILE_OPERATION_FINISHED,
  FILE_UPLOAD_FAILED,
  FileUploadError,
  FORM_ATTRIBUTES_NOT_FOUND,
  PENDING_UPLOADS_NOT_FOUND,
  RECEIVE_APPLICATION_SAVED,
  RECEIVE_FORM_ATTRIBUTES,
  RECEIVE_PENDING_UPLOADS,
  RESET_LAST_APPLICATION_SUBMISSION_ERROR,
  SUBMIT_APPLICATION,
  UPLOAD_FILE,
  UploadedFileMeta,
} from './types';

export const fetchFormAttributes = (): Action<string> =>
  createAction(FETCH_FORM_ATTRIBUTES)();

export const receiveFormAttributes = (payload: ApiAttributes): Action<string> =>
  createAction(RECEIVE_FORM_ATTRIBUTES)(payload);

export const formAttributesNotFound = (): Action<string> =>
  createAction(FORM_ATTRIBUTES_NOT_FOUND)();

export const submitApplication = (
  payload: ApplicationSubmission
): Action<string> => createAction(SUBMIT_APPLICATION)(payload);

export const receiveApplicationSaved = (payload: number): Action<string> =>
  createAction(RECEIVE_APPLICATION_SAVED)(payload);

export const applicationSubmissionFailed = (payload: unknown): Action<string> =>
  createAction(APPLICATION_SUBMISSION_FAILED)(payload);

export const resetLastApplicationSubmissionError = (): Action<string> =>
  createAction(RESET_LAST_APPLICATION_SUBMISSION_ERROR)();

export const fetchPendingUploads = (): Action<string> =>
  createAction(FETCH_PENDING_UPLOADS)();

export const receivePendingUploads = (
  payload: Array<UploadedFileMeta>
): Action<string> => createAction(RECEIVE_PENDING_UPLOADS)(payload);

export const pendingUploadsNotFound = (): Action<string> =>
  createAction(PENDING_UPLOADS_NOT_FOUND)();

export const deleteUpload = (payload: number): Action<string> =>
  createAction(DELETE_UPLOAD)(payload);

export const uploadFile = (payload: {
  fileData: {
    field: number;
    file: File;
  };
  callback?: (file?: UploadedFileMeta, error?: FileUploadError) => void;
}): Action<string> => createAction(UPLOAD_FILE)(payload);

export const fileOperationFinished = (): Action<string> =>
  createAction(FILE_OPERATION_FINISHED)();

export const fileUploadFailed = (): Action<string> =>
  createAction(FILE_UPLOAD_FAILED)();

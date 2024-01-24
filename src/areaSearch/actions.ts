import { Action } from 'redux';
import { createAction } from 'redux-actions';
import { UploadedFileMeta } from '../application/types';

import {
  AREA_SEARCH_SUBMISSION_FAILED,
  AreaSearch,
  AreaSearchSubmission,
  FETCH_INTENDED_USES,
  INTENDED_USES_NOT_FOUND,
  IntendedUse,
  RECEIVE_AREA_SEARCH_SAVED,
  RECEIVE_INTENDED_USES,
  SUBMIT_AREA_SEARCH,
  AreaSearchApplicationSubmission,
  SUBMIT_AREA_SEARCH_APPLICATION,
  RECEIVE_AREA_SEARCH_APPLICATION_SAVED,
  AREA_SEARCH_APPLICATION_SUBMISSION_FAILED,
  SUBMIT_AREA_SEARCH_ATTACHMENT,
  AREA_SEARCH_ATTACHMENT_SUBMISSION_FAILED,
  RECEIVE_AREA_SEARCH_ATTACHMENT_SAVED,
  INITIALIZE_AREA_SEARCH_ATTACHMENTS,
} from './types';

export const submitAreaSearch = (
  payload: AreaSearchSubmission,
): Action<string> => createAction(SUBMIT_AREA_SEARCH)(payload);

export const submitAreaSearchAttachment = (payload: {
  fileData: {
    field: number;
    file: File;
  };
  callback?: (file: UploadedFileMeta) => void;
}): Action<string> => createAction(SUBMIT_AREA_SEARCH_ATTACHMENT)(payload);

export const initializeAreaSearchAttachments = (): Action<string> =>
  createAction(INITIALIZE_AREA_SEARCH_ATTACHMENTS)();

export const areaSearchAttachmentSubmissionFailed = (
  payload: unknown,
): Action<string> =>
  createAction(AREA_SEARCH_ATTACHMENT_SUBMISSION_FAILED)(payload);

export const receiveAreaSearchAttachmentSaved = (
  payload: File,
): Action<string> =>
  createAction(RECEIVE_AREA_SEARCH_ATTACHMENT_SAVED)(payload);

export const receiveAreaSearchSaved = (payload: AreaSearch): Action<string> =>
  createAction(RECEIVE_AREA_SEARCH_SAVED)(payload);

export const areaSearchSubmissionFailed = (payload: unknown): Action<string> =>
  createAction(AREA_SEARCH_SUBMISSION_FAILED)(payload);

export const submitAreaSearchApplication = (
  payload: AreaSearchApplicationSubmission,
): Action<string> => createAction(SUBMIT_AREA_SEARCH_APPLICATION)(payload);

export const receiveAreaSearchApplicationSaved = (
  payload: AreaSearch,
): Action<string> =>
  createAction(RECEIVE_AREA_SEARCH_APPLICATION_SAVED)(payload);

export const areaSearchApplicationSubmissionFailed = (
  payload: unknown,
): Action<string> =>
  createAction(AREA_SEARCH_APPLICATION_SUBMISSION_FAILED)(payload);

export const fetchIntendedUses = (): Action<string> =>
  createAction(FETCH_INTENDED_USES)();

export const receiveIntendedUses = (
  payload: Array<IntendedUse>,
): Action<string> => createAction(RECEIVE_INTENDED_USES)(payload);

export const intendedUsesNotFound = (): Action<string> =>
  createAction(INTENDED_USES_NOT_FOUND)();

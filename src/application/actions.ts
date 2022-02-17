import { ApiAttributes } from '../api/types';
import { Action } from 'redux';
import { createAction } from 'redux-actions';
import {
  APPLICATION_SUBMISSION_FAILED,
  ApplicationSubmission,
  FETCH_FORM_ATTRIBUTES,
  FORM_ATTRIBUTES_NOT_FOUND,
  RECEIVE_APPLICATION_SAVED,
  RECEIVE_FORM_ATTRIBUTES,
  RESET_LAST_APPLICATION_SUBMISSION_ERROR,
  SUBMIT_APPLICATION,
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

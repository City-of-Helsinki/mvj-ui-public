import { Action } from 'redux';
import { createAction } from 'redux-actions';

import {
  AREA_SEARCH_SUBMISSION_FAILED,
  AreaSearchSubmission,
  FETCH_INTENDED_USES,
  INTENDED_USES_NOT_FOUND,
  IntendedUse,
  RECEIVE_AREA_SEARCH_SAVED,
  RECEIVE_INTENDED_USES,
  SUBMIT_AREA_SEARCH,
} from './types';

export const submitAreaSearch = (
  payload: AreaSearchSubmission
): Action<string> => createAction(SUBMIT_AREA_SEARCH)(payload);

export const receiveAreaSearchSaved = (payload: number): Action<string> =>
  createAction(RECEIVE_AREA_SEARCH_SAVED)(payload);

export const areaSearchSubmissionFailed = (payload: unknown): Action<string> =>
  createAction(AREA_SEARCH_SUBMISSION_FAILED)(payload);

export const fetchIntendedUses = (): Action<string> =>
  createAction(FETCH_INTENDED_USES)();

export const receiveIntendedUses = (
  payload: Array<IntendedUse>
): Action<string> => createAction(RECEIVE_INTENDED_USES)(payload);

export const intendedUsesNotFound = (): Action<string> =>
  createAction(INTENDED_USES_NOT_FOUND)();

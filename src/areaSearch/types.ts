import { ApplicationFormRoot } from '../application/types';
import { Geometry } from 'geojson';

export const AREA_SEARCH_FORM_NAME = 'areaSearch';

export type AreaSearchFormRoot = {
  search: {
    start_date: string;
    end_date: string;
    description_area: string;
    description_intended_use: string;
    // UI only, used for filtering the available values for intended_use
    intended_use_category: number | null;
    intended_use: number | null;
    geometry: Geometry | null;
    // Form validation only, actual file selection data is held in context
    // Holds the number of files selected.
    attachments: number;
  };
  form: ApplicationFormRoot;
};

export type AreaSearchSubmission = {
  start_date: string;
  end_date: string;
  description_area: string;
  description_intended_use: string;
  intended_use: number;
  geometry: Geometry | null;
  attachments: Array<File>;
};

export type IntendedSubUse = {
  id: number;
  name: string;
};

export type IntendedUse = {
  id: number;
  name: string;
  subuses: Array<IntendedSubUse>;
};

export const SUBMIT_AREA_SEARCH = 'areaSearch/SUBMIT_AREA_SEARCH';
export interface SubmitAreaSearchAction {
  type: typeof SUBMIT_AREA_SEARCH;
  payload: AreaSearchSubmission;
}

export const RECEIVE_AREA_SEARCH_SAVED = 'areaSearch/RECEIVE_APPLICATION_SAVED';
export interface ReceiveAreaSearchSavedAction {
  type: typeof RECEIVE_AREA_SEARCH_SAVED;
  payload: number;
}
export const AREA_SEARCH_SUBMISSION_FAILED =
  'areaSearch/AREA_SEARCH_SUBMISSION_FAILED';
export interface AreaSearchSubmissionFailedAction {
  type: typeof AREA_SEARCH_SUBMISSION_FAILED;
  payload: Error;
}

export const FETCH_INTENDED_USES = 'areaSearch/FETCH_INTENDED_USES';
export interface FetchIntendedUsesAction {
  type: typeof FETCH_INTENDED_USES;
}
export const RECEIVE_INTENDED_USES = 'areaSearch/RECEIVE_INTENDED_USES';
export interface ReceiveIntendedUsesAction {
  type: typeof RECEIVE_INTENDED_USES;
  payload: Array<IntendedUse>;
}
export const INTENDED_USES_NOT_FOUND = 'areaSearch/INTENDED_USES_NOT_FOUND';
export interface IntendedUsesNotFoundAction {
  type: typeof INTENDED_USES_NOT_FOUND;
}

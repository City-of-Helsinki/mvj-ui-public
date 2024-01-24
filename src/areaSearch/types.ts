import {
  ApplicationFormRoot,
  NestedField,
  UploadedFileMeta,
} from '../application/types';
import { Geometry } from 'geojson';
import { Form } from '../plotSearch/types';

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

export type AreaSearch = {
  id: number;
  start_date: string;
  end_date: string;
  description_area: string;
  description_intended_use: string;
  intended_use: number;
  geometry: Geometry | null;
  form: Form;
  address: string;
  district: string;
};

export type AreaSearchAttachment = {
  id?: number;
  area_search?: null;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
  };
  name: string;
  created_at: string;
  attachment: string;
};

export type AreaSearchSubmission = {
  start_date: string;
  end_date: string | null;
  description_area: string;
  description_intended_use: string;
  intended_use: number;
  geometry: Geometry | null;
  area_search_attachments: Array<number> | Array<File>;
  id?: number; // For PUT operations
};

export type AreaSearchApplicationSubmission = {
  area_search: number;
  form: number;
  entries: NestedField;
};

export type IntendedUse = {
  id: number;
  name: string;
};

export const SUBMIT_AREA_SEARCH = 'areaSearch/SUBMIT_AREA_SEARCH';
export interface SubmitAreaSearchAction {
  type: typeof SUBMIT_AREA_SEARCH;
  payload: AreaSearchSubmission;
}

export const RECEIVE_AREA_SEARCH_SAVED = 'areaSearch/RECEIVE_AREA_SEARCH_SAVED';
export interface ReceiveAreaSearchSavedAction {
  type: typeof RECEIVE_AREA_SEARCH_SAVED;
  payload: AreaSearch;
}
export const AREA_SEARCH_SUBMISSION_FAILED =
  'areaSearch/AREA_SEARCH_SUBMISSION_FAILED';
export interface AreaSearchSubmissionFailedAction {
  type: typeof AREA_SEARCH_SUBMISSION_FAILED;
  payload: Error;
}

export const SUBMIT_AREA_SEARCH_ATTACHMENT =
  'areaSearch/SUBMIT_AREA_SEARCH_ATTACHMENT';
export interface SubmitAreaSearchAttachment {
  type: typeof SUBMIT_AREA_SEARCH_ATTACHMENT;
  payload: {
    fileData: {
      field: number;
      file: File;
    };
    callback?: (file: UploadedFileMeta) => void;
  };
}

export const INITIALIZE_AREA_SEARCH_ATTACHMENTS =
  'areaSearch/INITIALIZE_AREA_SEARCH_ATTACHMENTS';
export interface InitializeAreaSearchAttachments {
  type: typeof INITIALIZE_AREA_SEARCH_ATTACHMENTS;
}

export const AREA_SEARCH_ATTACHMENT_SUBMISSION_FAILED =
  'areaSearch/AREA_SEARCH_ATTACHMENT_SUBMISSION_FAILED';
export interface AreaSearchAttachmentSubmissionFailed {
  type: typeof AREA_SEARCH_ATTACHMENT_SUBMISSION_FAILED;
  payload: unknown;
}

export const RECEIVE_AREA_SEARCH_ATTACHMENT_SAVED =
  'areaSearch/RECEIVE_AREA_SEARCH_ATTACHMENT_SAVED';
export interface ReceiveAreaSearchAttachmentSaved {
  type: typeof RECEIVE_AREA_SEARCH_ATTACHMENT_SAVED;
  payload: AreaSearchAttachment;
}

export const SUBMIT_AREA_SEARCH_APPLICATION =
  'areaSearch/SUBMIT_AREA_SEARCH_APPLICATION';
export interface SubmitAreaSearchApplicationAction {
  type: typeof SUBMIT_AREA_SEARCH_APPLICATION;
  payload: AreaSearchApplicationSubmission;
}

export const RECEIVE_AREA_SEARCH_APPLICATION_SAVED =
  'areaSearch/RECEIVE_AREA_SEARCH_APPLICATION_SAVED';
export interface ReceiveAreaSearchApplicationSavedAction {
  type: typeof RECEIVE_AREA_SEARCH_APPLICATION_SAVED;
}

export const AREA_SEARCH_APPLICATION_SUBMISSION_FAILED =
  'areaSearch/AREA_SEARCH_APPLICATION_SUBMISSION_FAILED';
export interface AreaSearchApplicationSubmissionFailedAction {
  type: typeof AREA_SEARCH_APPLICATION_SUBMISSION_FAILED;
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

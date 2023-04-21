import { createSlice } from '@reduxjs/toolkit';
import {
  APPLICATION_FORM_NAME,
  APPLICATION_SUBMISSION_FAILED,
  ApplicationSubmissionFailedAction,
  DELETE_UPLOAD,
  FETCH_FORM_ATTRIBUTES,
  FieldTypeMapping,
  FILE_OPERATION_FINISHED,
  FILE_UPLOAD_FAILED,
  FORM_ATTRIBUTES_NOT_FOUND,
  RECEIVE_APPLICATION_SAVED,
  RECEIVE_FORM_ATTRIBUTES,
  RECEIVE_PENDING_UPLOADS,
  ReceiveFormAttributesAction,
  ReceivePendingUploadsAction,
  SUBMIT_APPLICATION,
  UPLOAD_FILE,
  UploadedFileMeta,
  /*ReceiveApplicationSavedAction,*/
} from './types';
import { ApiAttributes } from '../api/types';

type CurrentDisplayState = {
  formAttributes: ApiAttributes;
  isFetchingFormAttributes: boolean;
  fieldTypeMapping: FieldTypeMapping;
  isSubmittingApplication: boolean;
  submittedAnswerId: number;
  lastError: unknown;
  pendingUploads: Array<UploadedFileMeta>;
  isPerformingFileOperation: boolean;
};

const initialState: CurrentDisplayState = {
  formAttributes: {},
  isFetchingFormAttributes: false,
  fieldTypeMapping: {},
  isSubmittingApplication: false,
  submittedAnswerId: 0,
  lastError: null,
  pendingUploads: [],
  isPerformingFileOperation: false,
};

const applicationSlice = createSlice({
  name: APPLICATION_FORM_NAME,
  initialState,
  reducers: {},
  extraReducers: {
    [RECEIVE_FORM_ATTRIBUTES]: (
      state,
      { payload }: ReceiveFormAttributesAction
    ) => {
      state.formAttributes = payload;
      state.isFetchingFormAttributes = false;
      state.fieldTypeMapping =
        payload.sections?.child?.children.fields?.child?.children.type?.choices?.reduce(
          (acc, choice) => {
            acc[choice.value as number] = choice.display_name;
            return acc;
          },
          {} as FieldTypeMapping
        ) || {};
    },
    [FETCH_FORM_ATTRIBUTES]: (state) => {
      state.isFetchingFormAttributes = true;
      state.fieldTypeMapping = {};
    },
    [FORM_ATTRIBUTES_NOT_FOUND]: (state) => {
      state.isFetchingFormAttributes = false;
    },
    [SUBMIT_APPLICATION]: (state) => {
      state.isSubmittingApplication = true;
      state.lastError = null;
    },
    [RECEIVE_APPLICATION_SAVED]: (
      state /*, { payload }: ReceiveApplicationSavedAction*/
    ) => {
      state.isSubmittingApplication = false;
      // TODO: ID not provided in the response at the moment
      state.submittedAnswerId = state.submittedAnswerId + 1;
    },
    [APPLICATION_SUBMISSION_FAILED]: (
      state,
      { payload }: ApplicationSubmissionFailedAction
    ) => {
      state.isSubmittingApplication = false;
      state.lastError = payload;
    },
    [RECEIVE_PENDING_UPLOADS]: (
      state,
      { payload }: ReceivePendingUploadsAction
    ) => {
      // TODO: filtering should probably be done server-side already
      state.pendingUploads = payload.filter((upload) => upload.answer === null);
    },
    [UPLOAD_FILE]: (state) => {
      state.isPerformingFileOperation = true;
    },
    [DELETE_UPLOAD]: (state) => {
      state.isPerformingFileOperation = true;
    },
    [FILE_OPERATION_FINISHED]: (state) => {
      state.isPerformingFileOperation = false;
    },
    [FILE_UPLOAD_FAILED]: (state) => {
      state.isPerformingFileOperation = false;
    },
  },
});

export default applicationSlice.reducer;

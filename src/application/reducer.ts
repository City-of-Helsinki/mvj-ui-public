import { createSlice } from '@reduxjs/toolkit';
import {
  APPLICATION_FORM_NAME,
  APPLICATION_SUBMISSION_FAILED,
  ApplicationResponse,
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
  ReceiveApplicationSavedAction,
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
  submittedAnswer: ApplicationResponse;
  lastError: unknown;
  pendingUploads: Array<UploadedFileMeta>;
  isPerformingFileOperation: boolean;
};

const initialState: CurrentDisplayState = {
  formAttributes: {},
  isFetchingFormAttributes: false,
  fieldTypeMapping: {},
  isSubmittingApplication: false,
  lastError: null,
  pendingUploads: [],
  isPerformingFileOperation: false,
  submittedAnswer: {
    id: 0,
    targets: [],
    entries_data: {},
    form: 0,
    information_checks: [],
    target_statuses: [],
  },
};

const applicationSlice = createSlice({
  name: APPLICATION_FORM_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        RECEIVE_FORM_ATTRIBUTES,
        (state, { payload }: ReceiveFormAttributesAction) => {
          state.formAttributes = payload;
          state.isFetchingFormAttributes = false;
          state.fieldTypeMapping =
            payload.sections?.child?.children.fields?.child?.children.type?.choices?.reduce(
              (acc, choice) => {
                acc[choice.value as number] = choice.display_name;
                return acc;
              },
              {} as FieldTypeMapping,
            ) || {};
        },
      )
      .addCase(FETCH_FORM_ATTRIBUTES, (state) => {
        state.isFetchingFormAttributes = true;
        state.fieldTypeMapping = {};
      })
      .addCase(FORM_ATTRIBUTES_NOT_FOUND, (state) => {
        state.isFetchingFormAttributes = false;
      })
      .addCase(SUBMIT_APPLICATION, (state) => {
        state.isSubmittingApplication = true;
        state.lastError = null;
      })
      .addCase(
        RECEIVE_APPLICATION_SAVED,
        (state, { payload }: ReceiveApplicationSavedAction) => {
          state.isSubmittingApplication = false;
          state.submittedAnswer = payload;
        },
      )
      .addCase(
        APPLICATION_SUBMISSION_FAILED,
        (state, { payload }: ApplicationSubmissionFailedAction) => {
          state.isSubmittingApplication = false;
          state.lastError = payload;
        },
      )
      .addCase(
        RECEIVE_PENDING_UPLOADS,
        (state, { payload }: ReceivePendingUploadsAction) => {
          // TODO: filtering should probably be done server-side already
          state.pendingUploads = payload.filter(
            (upload) => upload.answer === null,
          );
        },
      )
      .addCase(UPLOAD_FILE, (state) => {
        state.isPerformingFileOperation = true;
      })
      .addCase(DELETE_UPLOAD, (state) => {
        state.isPerformingFileOperation = true;
      })
      .addCase(FILE_OPERATION_FINISHED, (state) => {
        state.isPerformingFileOperation = false;
      })
      .addCase(FILE_UPLOAD_FAILED, (state) => {
        state.isPerformingFileOperation = false;
      });
  },
});

export default applicationSlice.reducer;

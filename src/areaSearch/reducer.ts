import { createSlice } from '@reduxjs/toolkit';
import {
  AREA_SEARCH_FORM_NAME,
  AREA_SEARCH_SUBMISSION_FAILED,
  AreaSearchSubmissionFailedAction,
  AreaSearch,
  IntendedUse,
  RECEIVE_AREA_SEARCH_SAVED,
  RECEIVE_INTENDED_USES,
  ReceiveAreaSearchSavedAction,
  ReceiveIntendedUsesAction,
  SUBMIT_AREA_SEARCH,
  SUBMIT_AREA_SEARCH_APPLICATION,
  RECEIVE_AREA_SEARCH_APPLICATION_SAVED,
  AREA_SEARCH_APPLICATION_SUBMISSION_FAILED,
  AreaSearchApplicationSubmissionFailedAction,
  SUBMIT_AREA_SEARCH_ATTACHMENT,
  ReceiveAreaSearchAttachmentSaved,
  AreaSearchAttachment,
  AREA_SEARCH_ATTACHMENT_SUBMISSION_FAILED,
  RECEIVE_AREA_SEARCH_ATTACHMENT_SAVED,
  INITIALIZE_AREA_SEARCH_ATTACHMENTS,
  AreaSearchAttachmentSubmissionFailed,
  SET_NEXT_AREA_SEARCH_APPLICATION_STEP,
} from './types';

type CurrentDisplayState = {
  currentStep: number;
  isSubmittingAreaSearch: boolean;
  lastError: unknown | null;
  lastSubmissionId: number;
  lastSubmission: AreaSearch | null;
  intendedUses: Array<IntendedUse> | null;
  isSubmittingAreaSearchApplication: boolean;
  lastApplicationError: unknown | null;
  lastApplicationSubmissionId: number;
  isSubmittingAreaSearchAttachments: boolean;
  areaSearchAttachments: Array<AreaSearchAttachment>;
  areaSearchAttachmentError: unknown;
};

const initialState: CurrentDisplayState = {
  currentStep: 0,
  isSubmittingAreaSearch: false,
  lastError: null,
  lastSubmissionId: 0,
  lastSubmission: null,
  intendedUses: null,
  isSubmittingAreaSearchApplication: false,
  lastApplicationError: null,
  lastApplicationSubmissionId: 0,
  areaSearchAttachments: [],
  areaSearchAttachmentError: null,
  isSubmittingAreaSearchAttachments: false,
};

const areaSearchSlice = createSlice({
  name: AREA_SEARCH_FORM_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(INITIALIZE_AREA_SEARCH_ATTACHMENTS, (state) => {
        state.areaSearchAttachmentError = null;
        state.isSubmittingAreaSearchAttachments = false;
        state.areaSearchAttachments = [];
      })
      .addCase(SET_NEXT_AREA_SEARCH_APPLICATION_STEP, (state) => {
        state.currentStep += 1;
      })
      .addCase(SUBMIT_AREA_SEARCH_ATTACHMENT, (state) => {
        state.isSubmittingAreaSearchAttachments = true;
        state.areaSearchAttachmentError = null;
      })
      .addCase(
        RECEIVE_AREA_SEARCH_ATTACHMENT_SAVED,
        (state, { payload }: ReceiveAreaSearchAttachmentSaved) => {
          state.isSubmittingAreaSearchAttachments = false;
          state.areaSearchAttachments = [
            ...state.areaSearchAttachments,
            payload,
          ];
        },
      )
      .addCase(
        AREA_SEARCH_ATTACHMENT_SUBMISSION_FAILED,
        (state, { payload }: AreaSearchAttachmentSubmissionFailed) => {
          state.isSubmittingAreaSearchAttachments = false;
          state.areaSearchAttachmentError = payload;
        },
      )
      .addCase(SUBMIT_AREA_SEARCH, (state) => {
        state.isSubmittingAreaSearch = true;
        state.lastError = null;
      })
      .addCase(
        RECEIVE_AREA_SEARCH_SAVED,
        (state, { payload }: ReceiveAreaSearchSavedAction) => {
          state.isSubmittingAreaSearch = false;
          state.lastSubmissionId = payload.id;
          state.lastSubmission = payload;
        },
      )
      .addCase(
        AREA_SEARCH_SUBMISSION_FAILED,
        (state, { payload }: AreaSearchSubmissionFailedAction) => {
          state.isSubmittingAreaSearch = false;
          state.lastError = payload;
        },
      )
      .addCase(SUBMIT_AREA_SEARCH_APPLICATION, (state) => {
        state.isSubmittingAreaSearchApplication = true;
        state.lastApplicationError = null;
      })
      .addCase(
        RECEIVE_AREA_SEARCH_APPLICATION_SAVED,
        (
          state,
          // { payload }: ReceiveAreaSearchApplicationSavedAction // API does not provide payload for this yet
        ) => {
          state.isSubmittingAreaSearchApplication = false;
          state.lastApplicationSubmissionId =
            state.lastApplicationSubmissionId + 1;
          state.areaSearchAttachments = [];
          state.areaSearchAttachmentError = null;
          state.isSubmittingAreaSearchAttachments = false;
        },
      )
      .addCase(
        AREA_SEARCH_APPLICATION_SUBMISSION_FAILED,
        (state, { payload }: AreaSearchApplicationSubmissionFailedAction) => {
          state.isSubmittingAreaSearchApplication = false;
          state.lastApplicationError = payload;
        },
      )
      .addCase(
        RECEIVE_INTENDED_USES,
        (state, { payload }: ReceiveIntendedUsesAction) => {
          state.intendedUses = payload;
        },
      );
  },
});

export default areaSearchSlice.reducer;

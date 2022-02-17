import { createSlice } from '@reduxjs/toolkit';
import {
  APPLICATION_FORM_NAME,
  APPLICATION_SUBMISSION_FAILED,
  ApplicationSubmissionFailedAction,
  FETCH_FORM_ATTRIBUTES,
  FieldTypeMapping,
  FORM_ATTRIBUTES_NOT_FOUND,
  RECEIVE_APPLICATION_SAVED,
  RECEIVE_FORM_ATTRIBUTES,
  ReceiveFormAttributesAction,
  SUBMIT_APPLICATION,
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
};

const initialState: CurrentDisplayState = {
  formAttributes: {},
  isFetchingFormAttributes: false,
  fieldTypeMapping: {},
  isSubmittingApplication: false,
  submittedAnswerId: 0,
  lastError: null,
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
  },
});

export default applicationSlice.reducer;

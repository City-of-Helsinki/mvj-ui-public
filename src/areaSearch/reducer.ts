import { createSlice } from '@reduxjs/toolkit';
import {
  AREA_SEARCH_FORM_NAME,
  AREA_SEARCH_SUBMISSION_FAILED,
  AreaSearchSubmissionFailedAction,
  IntendedUse,
  RECEIVE_AREA_SEARCH_SAVED,
  RECEIVE_INTENDED_USES,
  ReceiveAreaSearchSavedAction,
  ReceiveIntendedUsesAction,
  SUBMIT_AREA_SEARCH,
} from './types';

type CurrentDisplayState = {
  isSubmittingAreaSearch: boolean;
  lastError: unknown | null;
  lastSubmissionId: number;
  intendedUses: Array<IntendedUse> | null;
};

const initialState: CurrentDisplayState = {
  isSubmittingAreaSearch: false,
  lastError: null,
  lastSubmissionId: 0,
  intendedUses: null,
};

const areaSearchSlice = createSlice({
  name: AREA_SEARCH_FORM_NAME,
  initialState,
  reducers: {},
  extraReducers: {
    [SUBMIT_AREA_SEARCH]: (state) => {
      state.isSubmittingAreaSearch = true;
      state.lastError = null;
    },
    [RECEIVE_AREA_SEARCH_SAVED]: (
      state,
      { payload }: ReceiveAreaSearchSavedAction
    ) => {
      state.isSubmittingAreaSearch = false;
      state.lastSubmissionId = payload;
    },
    [AREA_SEARCH_SUBMISSION_FAILED]: (
      state,
      { payload }: AreaSearchSubmissionFailedAction
    ) => {
      state.isSubmittingAreaSearch = false;
      state.lastError = payload;
    },
    [RECEIVE_INTENDED_USES]: (
      state,
      { payload }: ReceiveIntendedUsesAction
    ) => {
      state.intendedUses = payload;
    },
  },
});

export default areaSearchSlice.reducer;

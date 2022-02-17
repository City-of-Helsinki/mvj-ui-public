import { createSlice } from '@reduxjs/toolkit';
import {
  APPLICATION_FORM_NAME,
  FETCH_FORM_ATTRIBUTES,
  FieldTypeMapping,
  FORM_ATTRIBUTES_NOT_FOUND,
  RECEIVE_FORM_ATTRIBUTES,
  ReceiveFormAttributesAction,
} from './types';
import { ApiAttributes } from '../api/types';

type CurrentDisplayState = {
  formAttributes: ApiAttributes;
  isFetchingFormAttributes: boolean;
  fieldTypeMapping: FieldTypeMapping;
};

const initialState: CurrentDisplayState = {
  formAttributes: {},
  isFetchingFormAttributes: false,
  fieldTypeMapping: {},
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
  },
});

export default applicationSlice.reducer;

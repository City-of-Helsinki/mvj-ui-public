import { createSlice } from '@reduxjs/toolkit';
import {
  FETCH_FAQS,
  RECEIVE_FAQS,
  Faq,
  ReceiveFaqsAction,
  FAQS_NOT_FOUND,
  FAQS_FETCH_ERROR,
} from './types';

type CurrentDisplayState = {
  faqs: Faq[];
  isFetchingFaqs: boolean;
  fethingFailed: boolean;
  faqsNotFound: boolean;
};

const initialState: CurrentDisplayState = {
  faqs: [],
  isFetchingFaqs: false,
  fethingFailed: false,
  faqsNotFound: false,
};

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {},
  extraReducers: {
    [RECEIVE_FAQS]: (state, { payload }: ReceiveFaqsAction) => {
      state.faqs = payload;
      state.isFetchingFaqs = false;
      state.fethingFailed = false;
      state.faqsNotFound = false;
    },
    [FETCH_FAQS]: (state) => {
      state.isFetchingFaqs = true;
      state.fethingFailed = false;
      state.faqsNotFound = false;
    },
    [FAQS_NOT_FOUND]: (state) => {
      state.isFetchingFaqs = false;
      state.fethingFailed = false;
      state.faqsNotFound = true;
    },
    [FAQS_FETCH_ERROR]: (state) => {
      state.isFetchingFaqs = false;
      state.fethingFailed = true;
      state.faqsNotFound = false;
    },
  },
});

export default faqSlice.reducer;

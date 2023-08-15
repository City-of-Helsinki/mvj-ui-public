import { createAction } from 'redux-actions';
import { Action } from 'redux';

import {
  FETCH_FAQS,
  FAQS_FETCH_ERROR,
  FAQS_NOT_FOUND,
  Faq,
  RECEIVE_FAQS,
} from './types';

export const fetchFaqs = (): Action => createAction(FETCH_FAQS)();

export const receiveFaqs = (payload: Faq[]): Action<string> =>
  createAction(RECEIVE_FAQS)(payload);

export const faqsNotFound = (): Action<string> =>
  createAction(FAQS_NOT_FOUND)();

export const faqsFetchError = (): Action<string> =>
  createAction(FAQS_FETCH_ERROR)();

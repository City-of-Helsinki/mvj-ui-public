export interface Faq {
  question: string;
  answer: string;
}

export const FETCH_FAQS = 'faq/FETCH_FAQS';
export const RECEIVE_FAQS = 'faq/RECEIVE_FAQS';
export const FAQS_NOT_FOUND = 'faq/FAQS_NOT_FOUND';
export const FAQS_FETCH_ERROR = 'faq/FAQS_FETCH_ERROR';

export interface ReceiveFaqsAction {
  type: typeof RECEIVE_FAQS;
  payload: Faq[];
}

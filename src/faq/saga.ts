import { all, call, Effect, fork, put, takeLatest } from 'redux-saga/effects';
import { fetchFaqsRequest } from './requests';

import { FETCH_FAQS, Faq } from './types';

import { faqsNotFound, receiveFaqs, faqsFetchError } from './actions';

import { ApiCallResult } from '../api/callApi';
import { logError } from '../root/helpers';

function* fetchFaqsSaga(): Generator<Effect, void, ApiCallResult> {
  try {
    const { response, bodyAsJson } = yield call(fetchFaqsRequest);

    if (bodyAsJson.count === 0) {
      yield put(faqsNotFound());
      return;
    }

    switch (response.status) {
      case 200:
        yield put(receiveFaqs(bodyAsJson?.results as Array<Faq>));
        break;
      default:
        yield put(faqsNotFound());
        break;
    }
  } catch (e) {
    logError(e);
    yield put(faqsFetchError());
    throw e;
  }
}

export default function* favouriteSaga(): Generator {
  yield all([
    fork(function* (): Generator {
      yield takeLatest(FETCH_FAQS, fetchFaqsSaga);
    }),
  ]);
}

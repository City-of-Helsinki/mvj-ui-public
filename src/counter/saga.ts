import {all, fork, put, delay, takeEvery} from 'redux-saga/effects';
import { addCount } from './';
import * as actionTypes from './types';

export function* incrementAsync() {
  yield delay(1000);
  yield put(addCount(1));
}

export default function* counterSaga() {
  yield all([
    fork(function*() {
      yield takeEvery(actionTypes.INCREMENT_ASYNC, incrementAsync);
    }),
  ]);
}
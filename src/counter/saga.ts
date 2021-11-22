import { all, fork, put, delay, takeEvery } from 'redux-saga/effects';
import { increment, isCounting } from './actions';
import * as actionTypes from './types';

export function* incrementAsync(): Generator {
  yield put(isCounting(true));
  yield delay(1000);
  yield put(increment(1));
  yield put(isCounting(false));
}

export default function* counterSaga(): Generator {
  yield all([
    fork(function* () {
      yield takeEvery(actionTypes.INCREMENT_ASYNC, incrementAsync);
    }),
  ]);
}

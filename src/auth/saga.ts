import {all, fork, put, delay, takeEvery} from 'redux-saga/effects';
import { receiveApiToken } from './actions';
import { FETCH_API_TOKEN, fetchApiTokenActionType } from './types';

export function* fetchApiTokenSaga({payload: accessToken}: ReturnType<typeof fetchApiTokenActionType>): Generator {
  console.log(accessToken);
  yield delay(1000);
  yield put(receiveApiToken('123'));
}

export default function* authSaga(): Generator {
  yield all([
    fork(function*(): Generator {
      yield takeEvery(FETCH_API_TOKEN, fetchApiTokenSaga);
    }),
  ]);
}
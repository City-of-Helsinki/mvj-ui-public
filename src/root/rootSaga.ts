import { all, fork } from 'redux-saga/effects';
import authSaga from '../auth/saga';
import plotSearchSaga from '../plotSearch/saga';

export default function* rootSaga(): Generator {
  yield all([fork(authSaga), fork(plotSearchSaga)]);
}

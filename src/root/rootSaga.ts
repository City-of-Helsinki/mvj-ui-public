import { all, fork } from 'redux-saga/effects';
import authSaga from '../auth/saga';
import counterSaga from '../counter/saga';
import plotSearchSaga from '../plotSearch/saga';

export default function* rootSaga(): Generator {
  yield all([fork(authSaga), fork(counterSaga), fork(plotSearchSaga)]);
}

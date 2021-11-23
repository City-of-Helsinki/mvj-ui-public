import { all, fork } from 'redux-saga/effects';
import authSaga from '../auth/saga';
import counterSaga from '../counter/saga';

export default function* rootSaga(): Generator {
  yield all([fork(counterSaga), fork(authSaga)]);
}

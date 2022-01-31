import { all, fork } from 'redux-saga/effects';
import authSaga from '../auth/saga';
import plotSearchSaga from '../plotSearch/saga';
import favouritesSaga from '../favourites/saga';
import applicationSaga from '../application/saga';

export default function* rootSaga(): Generator {
  yield all([
    fork(authSaga),
    fork(plotSearchSaga),
    fork(favouritesSaga),
    fork(applicationSaga),
  ]);
}

import { all, fork } from 'redux-saga/effects';
import { watchAuthSaga } from '../auth/saga';
import plotSearchSaga from '../plotSearch/saga';
import favouritesSaga from '../favourites/saga';
import applicationSaga from '../application/saga';
import areaSearchSaga from '../areaSearch/saga';
import directReservationSaga from '../directReservation/saga';
import faqSaqa from '../faq/saga';
import frontPageSaga from '../frontPage/saga';

export default function* rootSaga(): Generator {
  yield all([
    fork(watchAuthSaga),
    fork(plotSearchSaga),
    fork(favouritesSaga),
    fork(applicationSaga),
    fork(areaSearchSaga),
    fork(directReservationSaga),
    fork(faqSaqa),
    fork(frontPageSaga),
  ]);
}

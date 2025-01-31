import { all, fork } from 'redux-saga/effects';
import plotSearchSaga from '../plotSearch/saga';
import favouritesSaga from '../favourites/saga';
import applicationSaga from '../application/saga';
import areaSearchSaga from '../areaSearch/saga';
import directReservationSaga from '../directReservation/saga';
import faqSaqa from '../faq/saga';
import frontPageSaga from '../frontPage/saga';
import {
  IS_FEATURE_OTHER_SEARCH_ENABLED,
  IS_FEATURE_PLOT_SEARCH_ENABLED,
} from '../featureFlags';

export default function* rootSaga(): Generator {
  const sagas = [fork(areaSearchSaga), fork(faqSaqa), fork(frontPageSaga)];
  if (IS_FEATURE_PLOT_SEARCH_ENABLED || IS_FEATURE_OTHER_SEARCH_ENABLED) {
    const plotSearchSagas = [
      fork(favouritesSaga),
      fork(plotSearchSaga),
      fork(applicationSaga),
      fork(directReservationSaga),
    ];
    sagas.push(...plotSearchSagas);
  }
  yield all(sagas);
}

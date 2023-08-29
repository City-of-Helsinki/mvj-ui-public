import { all, call, Effect, fork, put, takeLatest } from 'redux-saga/effects';

import { logError } from '../root/helpers';
import { ApiCallResult } from '../api/callApi';
import { GENERATE_FAVOURITE, GenerateFavouriteAction } from './types';
import { generateFavouriteRequest } from './requests';
import { favouriteGenerated, favouriteGenerationFailed } from './actions';

function* generateFavouriteSaga({
  payload,
}: GenerateFavouriteAction): Generator<Effect, void, ApiCallResult> {
  try {
    const { response } = yield call(generateFavouriteRequest, payload);

    switch (response.status) {
      case 200:
        yield put(favouriteGenerated());
        break;
      default:
        yield put(favouriteGenerationFailed());
        break;
    }
  } catch (e) {
    logError(e);
    yield put(favouriteGenerationFailed());
    throw e;
  }
}

export default function* directReservationSaga(): Generator {
  yield all([
    fork(function* (): Generator {
      yield takeLatest(GENERATE_FAVOURITE, generateFavouriteSaga);
    }),
  ]);
}

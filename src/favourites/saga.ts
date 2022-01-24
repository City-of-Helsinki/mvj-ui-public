import { all, call, Effect, fork, put, takeLatest } from 'redux-saga/effects';
import {
  fetchFavouriteAttributesRequest,
  fetchFavouriteRequest,
} from './requests';

import {
  FETCH_FAVOURITE,
  Favourite,
  FETCH_FAVOURITE_ATTRIBUTES,
} from './types';

import {
  favouriteAttributesNotFound,
  favouriteNotFound,
  receiveFavouriteAttributes,
  receiveFavourite,
} from './actions';

import { ApiCallResult } from '../api/callApi';
import { ApiAttributes } from '../api/types';

function* fetchFavouriteSaga(): Generator<Effect, void, ApiCallResult> {
  const user = null;

  if (user) {
    try {
      const { response, bodyAsJson } = yield call(fetchFavouriteRequest);

      switch (response.status) {
        case 200:
          yield put(receiveFavourite(bodyAsJson?.results as Array<Favourite>));
          break;
        default:
          yield put(favouriteNotFound());
          break;
      }
    } catch (e) {
      console.error(e);
      yield put(favouriteNotFound());
      throw e;
    }
  }
}

function* fetchFavouriteAttributesSaga(): Generator<
  Effect,
  void,
  ApiCallResult
> {
  const user = null;

  if (user) {
    try {
      const { response, bodyAsJson } = yield call(
        fetchFavouriteAttributesRequest
      );

      switch (response.status) {
        case 200:
          yield put(
            receiveFavouriteAttributes(bodyAsJson?.fields as ApiAttributes)
          );
          break;
        default:
          yield put(favouriteAttributesNotFound());
          break;
      }
    } catch (e) {
      console.error(e);
      yield put(favouriteAttributesNotFound());
      throw e;
    }
  }
}

export default function* favouriteSaga(): Generator {
  yield all([
    fork(function* (): Generator {
      yield takeLatest(FETCH_FAVOURITE, fetchFavouriteSaga);
      yield takeLatest(
        FETCH_FAVOURITE_ATTRIBUTES,
        fetchFavouriteAttributesSaga
      );
    }),
  ]);
}

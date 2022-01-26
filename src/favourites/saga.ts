import {
  all,
  call,
  Effect,
  fork,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects';
import {
  fetchFavouriteRequest,
  initializeFavouriteRequest,
  updateFavouriteRequest,
} from './requests';

import {
  FETCH_FAVOURITE,
  Favourite,
  INITIALIZE_FAVOURITE,
  RemoveFavouriteTargetAction,
  REMOVE_FAVOURITE_TARGET,
  AddFavouriteTargetAction,
  ADD_FAVOURITE_TARGET,
  MVJ_FAVOURITE,
} from './types';

import {
  favouriteNotFound,
  receiveFavourite,
  initializeFavourite,
  favouriteFetchError,
} from './actions';

import { ApiCallResult } from '../api/callApi';
import { getApiToken } from '../auth/selectors';
import { getFavourite } from './selectors';

function* fetchFavouriteSaga(): Generator<Effect, void, never> {
  try {
    const apiToken: string | null = yield select(getApiToken);
    const localStorageFavouriteItem = localStorage.getItem(MVJ_FAVOURITE);
    const lsFavourite: Favourite | null = localStorageFavouriteItem
      ? JSON.parse(localStorageFavouriteItem)
      : null;

    if (apiToken) {
      const { response, bodyAsJson }: ApiCallResult = yield call(
        fetchFavouriteRequest
      );
      const apiFavourite: Favourite = bodyAsJson.results[0];
      switch (response.status) {
        case 200:
          if (bodyAsJson.results.length <= 0) {
            yield put(initializeFavourite());
            break;
          }
          // Check if localstorage favourite has targets in it and if it is modified later than favourite from API
          if (
            lsFavourite &&
            lsFavourite.targets.length > 0 &&
            lsFavourite.modified_at &&
            apiFavourite.modified_at &&
            Date.parse(lsFavourite.modified_at) >
              Date.parse(apiFavourite.modified_at)
          ) {
            // Use localstorage instead of api
            if (!lsFavourite.id) {
              lsFavourite.id = apiFavourite.id;
            }
            const { response, bodyAsJson }: ApiCallResult = yield call(
              updateFavouriteRequest,
              lsFavourite
            );
            switch (response.status) {
              case 200:
                yield put(receiveFavourite(bodyAsJson));
                break;
              default:
                yield put(favouriteNotFound());
                break;
            }
            return;
          }
          yield put(receiveFavourite(bodyAsJson.results[0] as Favourite));
          break;
        default:
          yield put(favouriteNotFound());
          break;
      }
    }
    yield put(favouriteNotFound());
  } catch (e) {
    console.error(e);
    yield put(favouriteFetchError());
    throw e;
  }
}

function* initializeFavouriteSaga(): Generator<Effect, void, ApiCallResult> {
  try {
    const { response, bodyAsJson } = yield call(initializeFavouriteRequest);
    switch (response.status) {
      case 201:
        yield put(receiveFavourite(bodyAsJson));
        break;
      default:
        yield put(favouriteNotFound());
    }
  } catch (e) {
    console.error(e);
    yield put(favouriteFetchError());
    throw e;
  }
}

function* addFavouriteTargetSaga({
  payload,
}: AddFavouriteTargetAction): Generator<Effect, void, never> {
  try {
    const apiToken: string | null = yield select(getApiToken);
    const oldFavourite: Favourite = yield select(getFavourite);

    if (
      oldFavourite.targets.some(
        (t) => t.plot_search_target.id === payload.target.plot_search_target.id
      ) ||
      (oldFavourite.targets.length > 0 &&
        !oldFavourite.targets.some(
          (t) => t.plot_search === payload.target.plot_search
        ))
    ) {
      // Target is either already in favourites or is from different plot search, which isn't currently allowed
      yield put(favouriteNotFound());
      return;
    }
    const newFavourite: Favourite = {
      id: oldFavourite.id,
      created_at: oldFavourite.created_at,
      modified_at: new Date().toISOString(),
      targets: [...oldFavourite.targets, payload.target],
    };

    if (!apiToken) {
      yield put(receiveFavourite(newFavourite));
      return;
    }

    const { response, bodyAsJson }: ApiCallResult = yield call(
      updateFavouriteRequest,
      newFavourite
    );

    switch (response.status) {
      case 200:
        yield put(receiveFavourite(bodyAsJson));
        break;
      default:
        yield put(favouriteNotFound());
    }
  } catch (e) {
    console.error(e);
    yield put(favouriteFetchError());
  }
}

function* removeFavouriteTargetSaga({
  payload,
}: RemoveFavouriteTargetAction): Generator<Effect, void, never> {
  try {
    const apiToken: string | null = yield select(getApiToken);
    const oldFavourite: Favourite = yield select(getFavourite);

    const newFavourite = {
      id: oldFavourite.id,
      created_at: oldFavourite.created_at,
      modified_at: new Date().toISOString(),
      targets: oldFavourite.targets.filter(
        (target) => target.plot_search_target.id !== payload
      ),
    };

    if (!apiToken) {
      yield put(receiveFavourite(newFavourite));
      return;
    }

    const { response, bodyAsJson }: ApiCallResult = yield call(
      updateFavouriteRequest,
      newFavourite
    );

    switch (response.status) {
      case 200:
        yield put(receiveFavourite(bodyAsJson));
        break;
      default:
        yield put(favouriteNotFound());
    }
  } catch (e) {
    console.error(e);
    yield put(favouriteFetchError());
  }
}

export default function* favouriteSaga(): Generator {
  yield all([
    fork(function* (): Generator {
      yield takeLatest(FETCH_FAVOURITE, fetchFavouriteSaga);
      yield takeLatest(INITIALIZE_FAVOURITE, initializeFavouriteSaga);
      yield takeLatest(REMOVE_FAVOURITE_TARGET, removeFavouriteTargetSaga);
      yield takeLatest(ADD_FAVOURITE_TARGET, addFavouriteTargetSaga);
    }),
  ]);
}

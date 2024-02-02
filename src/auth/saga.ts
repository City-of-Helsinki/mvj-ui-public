import { all, put, takeLatest, call, delay, select } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';

import { logError } from '../root/helpers';
import { receiveApiToken, tokenNotFound, fetchApiToken } from './actions';
import { getAccessToken, getApiToken } from './selectors';
import {
  FETCH_API_TOKEN,
  fetchApiTokenActionType,
  RECEIVE_API_TOKEN,
} from './types';
import { userManager } from './userManager';
import { isApiTokenExpired } from './util';
export function* fetchApiTokenSaga({
  payload: accessToken,
}: ReturnType<typeof fetchApiTokenActionType>): Generator {
  try {
    const request = new Request(
      import.meta.env.REACT_APP_OPENID_CONNECT_API_TOKEN_URL ||
        'https://api.hel.fi/sso/api-tokens/',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    /*
    The solution would be to force TypeScript to ignore the fetch 
    implementation from a fetch polyfill package intended for node, 
    given that its implementation of RequestInit differs from that 
    in the typedefs of both core Node and core browser DOM. 
    I didn't find a way to do so though.
    */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = (yield call<any>(fetch, request)) as Response;
    const { status: statusCode } = response;

    switch (statusCode) {
      case 200: {
        const bodyAsJson = (yield call([response, response.json])) as Record<
          string,
          string
        >;
        const apiToken =
          bodyAsJson[
            import.meta.env.REACT_APP_OPENID_CONNECT_API_TOKEN_KEY as string
          ];
        yield put(receiveApiToken(apiToken));
        break;
      }
      default: {
        yield put(tokenNotFound());
        userManager.removeUser();
        break;
      }
    }
  } catch (error) {
    logError(error);
    yield put(tokenNotFound());
    userManager.removeUser();
  }
}

function* refreshApiTokenSaga(): Generator<Effect, void, string> {
  const TOKEN_CHECK_INTERVAL = 1 * 60 * 1000; // 1 minute

  while (true) {
    const apiToken = yield select(getApiToken);

    if (!apiToken || isApiTokenExpired(apiToken)) {
      const accessToken = yield select(getAccessToken);
      if (accessToken) {
        yield put(fetchApiToken(accessToken));
      }
    }
    yield delay(TOKEN_CHECK_INTERVAL);
  }
}

export function* watchAuthSaga(): Generator {
  yield all([
    takeLatest(FETCH_API_TOKEN, fetchApiTokenSaga),
    takeLatest(RECEIVE_API_TOKEN, refreshApiTokenSaga),
  ]);
}

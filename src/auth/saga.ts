import { all, fork, put, takeEvery, call } from 'redux-saga/effects';

import { receiveApiToken, tokenNotFound } from './actions';
import { FETCH_API_TOKEN, fetchApiTokenActionType } from './types';
import { userManager } from './userManager';

export function* fetchApiTokenSaga({
  payload: accessToken,
}: ReturnType<typeof fetchApiTokenActionType>): Generator {
  try {
    const request = new Request(
      process.env.REACT_APP_OPENID_CONNECT_API_TOKEN_URL ||
        'https://api.hel.fi/sso/api-tokens/',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const response = (yield call(fetch, request)) as Response;
    const { status: statusCode } = response;

    switch (statusCode) {
      case 200: {
        const bodyAsJson = (yield call([response, response.json])) as Record<
          string,
          string
        >;
        yield put(
          receiveApiToken(
            bodyAsJson[process.env.REACT_APP_OPENID_CONNECT_CLIENT_ID as string]
          )
        );
        break;
      }
      default: {
        yield put(tokenNotFound());
        userManager.removeUser();
        break;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch API token with error: ${error}`);
    yield put(tokenNotFound());
    userManager.removeUser();
  }
}

export default function* authSaga(): Generator {
  yield all([
    fork(function* (): Generator {
      yield takeEvery(FETCH_API_TOKEN, fetchApiTokenSaga);
    }),
  ]);
}

import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { jwtDecode } from 'jwt-decode';

import { logError } from '../root/helpers';
import { receiveApiToken, tokenNotFound } from './actions';
import {
  FETCH_API_TOKEN,
  fetchApiTokenActionType,
  RECEIVE_API_TOKEN,
  receiveApiTokenActionType,
  STORE_API_TOKEN_SUCCESS,
} from './types';
import { userManager } from './userManager';
import { setApiToken, setApiTokenExpirationTime } from './helpers';

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
        yield put(
          receiveApiToken(
            bodyAsJson[
              import.meta.env.REACT_APP_OPENID_CONNECT_API_TOKEN_KEY as string
            ],
          ),
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
    logError(error);
    yield put(tokenNotFound());
    userManager.removeUser();
  }
}

function* handleReceiveApiToken({
  payload: token,
}: ReturnType<typeof receiveApiTokenActionType>): Generator {
  const decodedToken = jwtDecode(token);
  const exp = decodedToken?.exp ?? null;
  // Store the token and exp in localStorage
  setApiToken(token);
  if (exp !== null) {
    setApiTokenExpirationTime(exp.toString());
  }

  yield put({ type: STORE_API_TOKEN_SUCCESS, payload: token });
}

export default function* authSaga(): Generator {
  yield all([
    fork(function* (): Generator {
      yield takeEvery(FETCH_API_TOKEN, fetchApiTokenSaga);
      yield takeEvery(RECEIVE_API_TOKEN, handleReceiveApiToken);
    }),
  ]);
}

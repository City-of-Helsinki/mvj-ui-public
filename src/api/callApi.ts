import { call, Effect, select } from 'redux-saga/effects';
import { getApiToken } from '../auth/selectors';

export interface ApiCallResult {
  response: Response;
  // TODO: should probably be unknown + stricter checks elsewhere
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bodyAsJson?: any;
}

function* callApi(
  request: Request
): Generator<Effect, ApiCallResult, Response> {
  const apiToken = yield select(getApiToken);

  if (apiToken) {
    request.headers.set('Authorization', `Bearer ${apiToken}`);
  }

  if (
    request.method === 'PATCH' ||
    request.method === 'POST' ||
    request.method === 'PUT'
  ) {
    request.headers.set('Content-Type', 'application/json');
  }

  const response = yield call(fetch, request);
  const status = response.status;

  switch (status) {
    case 204:
      return { response };
    case 500:
      return {
        response,
        bodyAsJson: {
          exception: response.status,
          message: response.statusText,
        },
      };
  }

  const bodyAsJson = yield call([response, response.json]);
  return { response, bodyAsJson };
}

export default callApi;

import { call, Effect, select } from 'redux-saga/effects';
import { getApiToken } from '../auth/selectors';
import i18n, { defaultLanguage } from '../i18n';
import { logError } from '../root/helpers';

export interface ApiCallResult {
  response: Response;
  // TODO: should probably be unknown + stricter checks elsewhere
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bodyAsJson?: any;
}

function* callApi(
  request: Request
): Generator<Effect, ApiCallResult, Response> {
  try {
    const apiToken = yield select(getApiToken);
    if (apiToken) {
      request.headers.set('Authorization', `Bearer ${apiToken}`);
    }

    request.headers.set(
      'Accept-Language',
      `${i18n.language},${defaultLanguage};q=0.5`
    );

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
      case 404:
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
  } catch (e) {
    logError(e);
    throw e;
  }
}

export default callApi;

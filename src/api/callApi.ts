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
  request: Request,
  options: {
    autoContentType: boolean;
  } = {
    autoContentType: true,
  },
): Generator<Effect, ApiCallResult, Response> {
  try {
    const apiToken = yield select(getApiToken);
    if (apiToken) {
      request.headers.set('Authorization', `Bearer ${apiToken}`);
    }

    request.headers.set(
      'Accept-Language',
      `${i18n.language},${defaultLanguage};q=0.5`,
    );

    if (
      ['PATCH', 'POST', 'PUT'].includes(request.method) &&
      options.autoContentType
    ) {
      request.headers.set('Content-Type', 'application/json');
    }
    /*
    The solution would be to force TypeScript to ignore the fetch 
    implementation from a fetch polyfill package intended for node, 
    given that its implementation of RequestInit differs from that 
    in the typedefs of both core Node and core browser DOM. 
    I didn't find a way to do so though.
    */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = yield call<any>(fetch, request);
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

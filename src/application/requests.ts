import { Effect } from 'redux-saga/effects';
import callApi, { ApiCallResult } from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchFormAttributesRequest = (): Generator<
  Effect,
  ApiCallResult,
  Response
> => {
  return callApi(
    new Request(createUrl('form/'), {
      method: 'OPTIONS',
    })
  );
};

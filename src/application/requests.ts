import { Effect } from 'redux-saga/effects';
import callApi, { ApiCallResult } from '../api/callApi';
import createUrl from '../api/createUrl';
import { ApplicationSubmission } from './types';

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

export const submitApplicationRequest = (
  formData: ApplicationSubmission
): Generator<Effect, ApiCallResult, Response> => {
  return callApi(
    new Request(createUrl('answer/'), {
      method: 'POST',
      body: JSON.stringify(formData),
    })
  );
};

import { Effect } from 'redux-saga/effects';
import callApi, { ApiCallResult } from '../api/callApi';
import createUrl from '../api/createUrl';
import { AreaSearchSubmission } from './types';

export const submitAreaSearchRequest = ({
  attachments,
  geometry,
  ...rest
}: AreaSearchSubmission): Generator<Effect, ApiCallResult, Response> => {
  const formData = new FormData();

  (Object.keys(rest) as Array<keyof typeof rest>).forEach((key) => {
    formData.append(key, '' + rest[key]);
  });
  formData.append('geometry', JSON.stringify(geometry));
  attachments.forEach((file, i) => formData.append(`attachments[${i}]`, file));

  return callApi(
    new Request(createUrl('area_search/'), {
      method: 'POST',
      body: formData,
    }),
    { autoContentType: false }
  );
};

export const fetchIntendedUsesRequest = (): Generator<
  Effect,
  ApiCallResult,
  Response
> => {
  return callApi(
    new Request(
      createUrl('intended_psuse/', {
        limit: '9999',
      })
    )
  );
};

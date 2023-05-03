import { Effect } from 'redux-saga/effects';
import callApi, { ApiCallResult } from '../api/callApi';
import createUrl from '../api/createUrl';
import { AreaSearchApplicationSubmission, AreaSearchSubmission } from './types';

export const submitAreaSearchAttachmentRequest = ({
  field,
  file,
}: {
  field: number;
  file: File;
}): Generator<Effect, ApiCallResult, Response> => {
  const formData = new FormData();

  formData.append('field', field.toString());
  formData.append('name', file.name);
  formData.append('attachment', file);

  return callApi(
    new Request(createUrl('area_search_attachment/'), {
      method: 'POST',
      body: formData,
    }),
    { autoContentType: false }
  );
};

export const submitAreaSearchRequest = ({
  area_search_attachments,
  geometry,
  ...rest
}: AreaSearchSubmission): Generator<Effect, ApiCallResult, Response> => {
  const payload = {
    area_search_attachments: area_search_attachments,
    geometry: JSON.stringify(geometry),
    ...rest,
  };

  return callApi(
    new Request(createUrl('area_search/'), {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  );
};

export const submitAreaSearchApplicationRequest = (
  formData: AreaSearchApplicationSubmission
): Generator<Effect, ApiCallResult, Response> => {
  return callApi(
    new Request(createUrl('answer/'), {
      method: 'POST',
      body: JSON.stringify(formData),
    })
  );
};

export const fetchIntendedUsesRequest = (): Generator<
  Effect,
  ApiCallResult,
  Response
> => {
  return callApi(
    new Request(
      createUrl('intended_use/', {
        limit: '9999',
      })
    )
  );
};

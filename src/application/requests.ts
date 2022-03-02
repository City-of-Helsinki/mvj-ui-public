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

export const fetchPendingUploadsRequest = (): Generator<
  Effect,
  ApiCallResult,
  Response
> => {
  return callApi(new Request(createUrl('attachment/')));
};

export const deleteUploadRequest = (
  id: number
): Generator<Effect, ApiCallResult, Response> => {
  return callApi(
    new Request(createUrl('attachment/' + id), {
      method: 'DELETE',
    })
  );
};

export const uploadFileRequest = ({
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
    new Request(createUrl('attachment/'), {
      method: 'POST',
      body: formData,
    }),
    { autoContentType: false }
  );
};

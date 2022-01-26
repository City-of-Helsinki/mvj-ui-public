import { Effect } from 'redux-saga/effects';
import callApi, { ApiCallResult } from '../api/callApi';
import createUrl from '../api/createUrl';
import { Favourite, MVJ_FAVOURITE } from './types';

export const fetchFavouriteRequest = (): Generator<
  Effect,
  ApiCallResult,
  Response
> => {
  return callApi(new Request(createUrl('favourite/')));
};

export const initializeFavouriteRequest = (): Generator<
  Effect,
  ApiCallResult,
  Response
> => {
  const favouriteFromLs = localStorage.getItem(MVJ_FAVOURITE);
  const body: Favourite = favouriteFromLs
    ? JSON.parse(favouriteFromLs)
    : {
        targets: [],
      };
  const request = new Request(createUrl('favourite/'), {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return callApi(request);
};

export const updateFavouriteRequest = (
  payload: Favourite
): Generator<Effect, ApiCallResult, Response> => {
  if (!payload.id) {
    throw new Error('Favourite does not have id!');
  }

  const request = new Request(createUrl(`favourite/${payload.id}/`), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return callApi(request);
};

export const fetchFavouriteAttributesRequest = (): Generator<
  Effect,
  ApiCallResult,
  Response
> => {
  return callApi(
    new Request(createUrl('favourite/'), {
      method: 'OPTIONS',
    })
  );
};

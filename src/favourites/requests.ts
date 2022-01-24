import { Effect } from 'redux-saga/effects';
import callApi, { ApiCallResult } from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchFavouriteRequest = (): Generator<
  Effect,
  ApiCallResult,
  Response
> => {
  return callApi(new Request(createUrl('favourites/')));
};

export const fetchFavouriteAttributesRequest = (): Generator<
  Effect,
  ApiCallResult,
  Response
> => {
  return callApi(
    new Request(createUrl('favourites/'), {
      method: 'OPTIONS',
    })
  );
};

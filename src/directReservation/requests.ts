import { Effect } from 'redux-saga/effects';
import callApi, { ApiCallResult } from '../api/callApi';
import createUrl from '../api/createUrl';

export const generateFavouriteRequest = (
  id: string
): Generator<Effect, ApiCallResult, Response> => {
  return callApi(
    new Request(createUrl(`direct_reservation_to_favourite/${id}/`))
  );
};

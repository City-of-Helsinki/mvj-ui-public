import { Effect } from 'redux-saga/effects';
import callApi, { ApiCallResult } from '../api/callApi';
import createUrl from '../api/createUrl';
import { PlotSearchTarget } from '../plotSearch/types';

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

export const addFavouriteRequest = (
  target: PlotSearchTarget,
  params?: Record<string, string>
): Generator<Effect, ApiCallResult, Response> => {
  return callApi(new Request(createUrl('favourites/'), params));
};

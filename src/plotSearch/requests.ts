import { Effect } from 'redux-saga/effects';
import callApi, { ApiCallResult } from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchPlotSearchesRequest = (
  params?: Record<string, string>
): Generator<Effect, ApiCallResult, Response> => {
  return callApi(new Request(createUrl('plot_search/', params)));
};

export const fetchPlotSearchAttributesRequest = (): Generator<
  Effect,
  ApiCallResult,
  Response
> => {
  return callApi(
    new Request(createUrl('plot_search/'), {
      method: 'OPTIONS',
    })
  );
};

export const fetchPlotSearchTypesRequest = (): Generator<
  Effect,
  ApiCallResult,
  Response
> => {
  return callApi(new Request(createUrl('plot_search_type/')));
};

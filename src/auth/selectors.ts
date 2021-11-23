import { Selector } from 'react-redux';
import { RootState } from '../root/rootReducer';

export const getApiToken: Selector<RootState, string | null> = (
  state: RootState
): string | null => state.auth.apiToken;

export const getIsFetching: Selector<RootState, boolean> = (
  state: RootState
): boolean => state.auth.isFetching;

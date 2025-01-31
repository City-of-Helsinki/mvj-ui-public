import { RootState } from '../root/rootReducer';
import { Selector } from 'react-redux';
import { Favourite } from './types';
import {
  IS_FEATURE_OTHER_SEARCH_ENABLED,
  IS_FEATURE_PLOT_SEARCH_ENABLED,
} from '../featureFlags';

export const getFavourite: Selector<RootState, Favourite> = (
  state: RootState,
): Favourite => state.favourite.favourite;

export const getIsFetchingFavourite: Selector<RootState, boolean> = (
  state: RootState,
): boolean => {
  if (IS_FEATURE_PLOT_SEARCH_ENABLED || IS_FEATURE_OTHER_SEARCH_ENABLED) {
    return state.favourite.isFetchingFavourite;
  }
  return false;
};

export const getFavouriteCount: Selector<RootState, number> = (
  state: RootState,
): number => {
  if (IS_FEATURE_PLOT_SEARCH_ENABLED || IS_FEATURE_OTHER_SEARCH_ENABLED) {
    return state.favourite.favourite.targets.length;
  }
  return 0;
};

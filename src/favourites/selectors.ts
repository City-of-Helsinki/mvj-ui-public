import { RootState } from '../root/rootReducer';
import { Selector } from 'react-redux';
import { Favourite } from './types';

export const getFavourite: Selector<RootState, Favourite> = (
  state: RootState
): Favourite => state.favourite.favourite;

export const getIsFetchingFavourite: Selector<RootState, boolean> = (
  state: RootState
): boolean => state.favourite.isFetchingFavourite;

export const getFavouriteCount: Selector<RootState, number> = (
  state: RootState
): number => state.favourite.favourite.targets.length;

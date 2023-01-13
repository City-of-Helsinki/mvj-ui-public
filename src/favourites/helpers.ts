import { parseTargetPlan } from '../plotSearch/helpers';
import { PlotSearch } from '../plotSearch/types';
import { RootState } from '../root/rootReducer';
import {
  Favourite,
  FavouriteFromBackend,
  FavouriteTargetFromBackend,
} from './types';

export const getPlotSearchFromFavourites = (
  state: RootState
): PlotSearch | null => {
  const relevantPlotSearch = state.plotSearch.plotSearches.find(
    (plotSearch) =>
      plotSearch.id === state.favourite.favourite?.targets[0]?.plot_search
  );

  return relevantPlotSearch || null;
};

export const parseFavouriteTargetPlans = (
  favourite: FavouriteFromBackend
): Favourite => {
  const parsedTargets = favourite.targets.map(
    (target: FavouriteTargetFromBackend) => ({
      ...target,
      plot_search_target: parseTargetPlan(target.plot_search_target),
    })
  );

  return {
    ...favourite,
    targets: parsedTargets,
  };
};

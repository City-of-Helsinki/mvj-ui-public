import { AppRoutes, getRouteById } from '../root/routes';
import { RootState } from '../root/rootReducer';
import { getPlotSearchFromFavourites } from '../favourites/helpers';

export const getPageForCurrentPlotSearch = (
  state: RootState
): string | null => {
  const plotSearch = getPlotSearchFromFavourites(state);

  switch (plotSearch?.search_class) {
    case 'plot_search':
      return getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS);
    case 'other_search':
      return getRouteById(AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES);
    default:
      return null;
  }
};

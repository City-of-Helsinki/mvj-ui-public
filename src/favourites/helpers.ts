import { PlotSearch } from '../plotSearch/types';
import { RootState } from '../root/rootReducer';

export const getPlotSearchFromFavourites = (
  state: RootState
): PlotSearch | null => {
  const relevantPlotSearch = state.plotSearch.plotSearches.find(
    (plotSearch) =>
      plotSearch.id === state.favourite.favourite?.targets[0]?.plot_search
  );

  return relevantPlotSearch || null;
};

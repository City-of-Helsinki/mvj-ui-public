import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { RootState } from '../root/rootReducer';
import MapSearchComponent from './components/mapSearchComponent';
import MapComponent from './components/mapComponent';
import {
  fetchPlotSearchAttributes,
  fetchPlotSearches,
  fetchPlotSearchTypes,
} from '../plotSearch/actions';

import { ApiAttributes } from '../api/types';
import {
  PlotSearch,
  PlotSearchSubtype,
  PlotSearchTarget,
  PlotSearchType,
} from '../plotSearch/types';

interface State {
  isFetchingPlotSearches: boolean;
  isFetchingPlotSearchAttributes: boolean;
  isFetchingPlotSearchTypes: boolean;
  plotSearches: Array<PlotSearch>;
  plotSearchAttributes: ApiAttributes;
  plotSearchTypes: Array<PlotSearchType>;
}

interface Props {
  fetchPlotSearches: () => void;
  fetchPlotSearchAttributes: () => void;
  fetchPlotSearchTypes: () => void;
  isFetchingPlotSearches: boolean;
  isFetchingPlotSearchAttributes: boolean;
  isFetchingPlotSearchTypes: boolean;
  plotSearches: Array<PlotSearch>;
  plotSearchAttributes: ApiAttributes;
  plotSearchTypes: Array<PlotSearchType>;
}

export type CategoryOptions = Array<{
  id: number;
  name: string;
  subtypes: Array<PlotSearchSubtype>;
  symbol: string;
}>;
export type CategoryVisibilities = Record<number, boolean>;

export type SelectedTarget = {
  target: PlotSearchTarget;
  plotSearch: PlotSearch;
} | null;

const PlotSearchAndCompetitionsPage = (props: Props): JSX.Element => {
  const {
    fetchPlotSearches,
    fetchPlotSearchAttributes,
    fetchPlotSearchTypes,
    isFetchingPlotSearches,
    isFetchingPlotSearchAttributes,
    isFetchingPlotSearchTypes,
    plotSearchTypes,
    plotSearches,
  } = props;
  const [categoryVisibilities, setCategoryVisibilities] =
    useState<CategoryVisibilities>({});
  const [categoryOptions, setCategoryOptions] = useState<CategoryOptions>([]);
  const [selectedTarget, setSelectedTarget] = useState<SelectedTarget>(null);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    fetchPlotSearches();
    fetchPlotSearchAttributes();
    fetchPlotSearchTypes();
  }, []);

  useEffect(() => {
    let newOptions = [...(plotSearchTypes || [])];

    if (newOptions) {
      newOptions = newOptions.filter((option) =>
        plotSearches.some((plotSearch) => plotSearch.type?.id === option.id)
      );

      setCategoryOptions(
        newOptions.map((option, index) => ({
          id: Number(option.id),
          name: option.name,
          subtypes: option.subtypes,
          symbol: String.fromCharCode('A'.charCodeAt(0) + index),
        }))
      );

      setCategoryVisibilities(
        newOptions.reduce((acc, next) => {
          acc[Number(next.id)] = true;
          return acc;
        }, {} as CategoryVisibilities)
      );
    }
  }, [plotSearchTypes, plotSearches]);

  const onToggleCategoryVisibility = (
    categoryId: number,
    isVisible: boolean
  ) => {
    setCategoryVisibilities(
      Object.keys(categoryVisibilities).reduce((acc, key) => {
        const keyIdx = Number(key);
        acc[keyIdx] =
          keyIdx === categoryId ? isVisible : categoryVisibilities[keyIdx];
        return acc;
      }, {} as CategoryVisibilities)
    );
  };

  const onSelectTarget = (target: SelectedTarget | null) => {
    setSelectedTarget(target);
    if (target) {
      setSidebarOpen(true);
    }
  };

  if (
    isFetchingPlotSearches ||
    isFetchingPlotSearchAttributes ||
    isFetchingPlotSearchTypes
  ) {
    // TODO: loader
    return <div />;
  }

  const filteredPlotSearches = plotSearches.filter(
    (s) => s.search_class === 'plot_search'
  );

  return (
    <div className="PlotSearchAndCompetitionsPage">
      <MapSearchComponent
        categoryOptions={categoryOptions}
        categoryVisibilities={categoryVisibilities}
        onToggleVisibility={onToggleCategoryVisibility}
        plotSearches={filteredPlotSearches}
        setSelectedTarget={setSelectedTarget}
        selectedTarget={selectedTarget}
        isOpen={isSidebarOpen}
        toggle={setSidebarOpen}
      />
      <MapComponent
        categoryOptions={categoryOptions}
        categoryVisibilities={categoryVisibilities}
        plotSearches={filteredPlotSearches}
        setSelectedTarget={onSelectTarget}
        selectedTarget={selectedTarget}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState): State => ({
  plotSearches: state.plotSearch.plotSearches,
  plotSearchAttributes: state.plotSearch.plotSearchAttributes,
  plotSearchTypes: state.plotSearch.plotSearchTypes,
  isFetchingPlotSearches: state.plotSearch.isFetchingPlotSearches,
  isFetchingPlotSearchAttributes:
    state.plotSearch.isFetchingPlotSearchAttributes,
  isFetchingPlotSearchTypes: state.plotSearch.isFetchingPlotSearchTypes,
});

export default connect(mapStateToProps, {
  fetchPlotSearches,
  fetchPlotSearchAttributes,
  fetchPlotSearchTypes,
})(PlotSearchAndCompetitionsPage);

import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { RootState } from '../root/rootReducer';
import MapSearchComponent from './mapSearchComponent';
import MapComponent from './mapComponent';
import BlockLoader from '../loader/blockLoader';
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
import { Favourite } from '../favourites/types';
import { AppRoutes, getRouteById } from '../root/routes';
import MainContentElement from '../a11y/MainContentElement';
import { getPageTitle } from '../root/helpers';

interface State {
  isFetchingPlotSearches: boolean;
  isFetchingPlotSearchAttributes: boolean;
  isFetchingPlotSearchTypes: boolean;
  isFetchingPlotSearchStages: boolean;
  plotSearches: Array<PlotSearch>;
  plotSearchAttributes: ApiAttributes;
  plotSearchTypes: Array<PlotSearchType>;
  favourite: Favourite;
}

interface Props {
  searchClass: string;
  fetchPlotSearches: (payload?: { params: Record<string, string> }) => void;
  fetchPlotSearchAttributes: () => void;
  fetchPlotSearchTypes: () => void;
  isFetchingPlotSearches: boolean;
  isFetchingPlotSearchAttributes: boolean;
  isFetchingPlotSearchTypes: boolean;
  isFetchingPlotSearchStages: boolean;
  plotSearches: Array<PlotSearch>;
  plotSearchAttributes: ApiAttributes;
  plotSearchTypes: Array<PlotSearchType>;
  favourite: Favourite;
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

const MapSearchPage = (props: Props): JSX.Element => {
  const {
    searchClass,
    fetchPlotSearches,
    fetchPlotSearchAttributes,
    fetchPlotSearchTypes,
    isFetchingPlotSearches,
    isFetchingPlotSearchAttributes,
    isFetchingPlotSearchTypes,
    isFetchingPlotSearchStages,
    plotSearchTypes,
    plotSearches,
    favourite,
  } = props;
  const [categoryVisibilities, setCategoryVisibilities] =
    useState<CategoryVisibilities>({});
  const [categoryOptions, setCategoryOptions] = useState<CategoryOptions>([]);
  const [selectedTarget, setSelectedTarget] = useState<SelectedTarget>(null);
  const [hoveredTargetId, setHoveredTargetId] = useState<number | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  let pageTitle = '';
  switch (searchClass) {
    case 'plot_search':
      pageTitle = t(
        'plotSearchAndCompetitions.mapView.plotSearches.pageTitle',
        'Plot searches and competitions',
      );
      break;
    case 'other_search':
      pageTitle = t(
        'plotSearchAndCompetitions.mapView.otherSearches.pageTitle',
        'Other competitions and searches',
      );
      break;
  }

  useEffect(() => {
    if (id) {
      const target = plotSearches
        .filter((plotSearch) =>
          plotSearch.plot_search_targets.some((t) => t.id.toString() === id),
        )
        .map((p) => ({
          plotSearch: p,
          target: p.plot_search_targets.filter(
            (t) => t.id.toString() === id,
          )[0],
        }))[0];

      if (!target) {
        navigate(getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS));
        return;
      }

      setSelectedTarget(target);
      return;
    }
    setSelectedTarget(null);
  }, [id, plotSearches]);

  useEffect(() => {
    fetchPlotSearchAttributes();
    fetchPlotSearchTypes();
    fetchPlotSearches({ params: { search_class: searchClass } });
  }, []);

  useEffect(() => {
    let newOptions = [...(plotSearchTypes || [])];

    if (newOptions) {
      newOptions = newOptions.filter((option) =>
        plotSearches.some((plotSearch) => plotSearch.type?.id === option.id),
      );

      setCategoryOptions(
        newOptions.map((option, index) => ({
          id: Number(option.id),
          name: option.name,
          subtypes: option.subtypes,
          symbol: String.fromCharCode('A'.charCodeAt(0) + index),
        })),
      );

      setCategoryVisibilities(
        newOptions.reduce((acc, next) => {
          acc[Number(next.id)] = true;
          return acc;
        }, {} as CategoryVisibilities),
      );
    }
  }, [plotSearchTypes, plotSearches, favourite]);

  const onToggleCategoryVisibility = (
    categoryId: number,
    isVisible: boolean,
  ) => {
    setCategoryVisibilities(
      Object.keys(categoryVisibilities).reduce((acc, key) => {
        const keyIdx = Number(key);
        acc[keyIdx] =
          keyIdx === categoryId ? isVisible : categoryVisibilities[keyIdx];
        return acc;
      }, {} as CategoryVisibilities),
    );
  };

  const filteredPlotSearches = plotSearches.filter(
    (s) => s.search_class === 'plot_search',
  );

  const onSelectTarget = (target: SelectedTarget | null) => {
    setSelectedTarget(target);
    if (target) {
      setSidebarOpen(true);
    }
  };

  if (
    isFetchingPlotSearches ||
    isFetchingPlotSearchAttributes ||
    isFetchingPlotSearchTypes ||
    isFetchingPlotSearchStages
  ) {
    return <BlockLoader />;
  }

  return (
    <MainContentElement className="MapSearchPage">
      <Helmet>
        <title>
          {getPageTitle([
            selectedTarget?.target.target_plan.address,
            pageTitle,
          ])}
        </title>
      </Helmet>
      <MapSearchComponent
        categoryOptions={categoryOptions}
        categoryVisibilities={categoryVisibilities}
        onToggleVisibility={onToggleCategoryVisibility}
        plotSearches={filteredPlotSearches}
        selectedTarget={selectedTarget}
        isOpen={isSidebarOpen}
        toggle={setSidebarOpen}
        favourite={favourite}
        hoveredTargetId={hoveredTargetId}
        setHoveredTargetId={setHoveredTargetId}
      />
      <MapComponent
        categoryOptions={categoryOptions}
        categoryVisibilities={categoryVisibilities}
        plotSearches={filteredPlotSearches}
        setSelectedTarget={onSelectTarget}
        selectedTarget={selectedTarget}
        favourite={favourite}
        hoveredTargetId={hoveredTargetId}
        setHoveredTargetId={setHoveredTargetId}
      />
    </MainContentElement>
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
  isFetchingPlotSearchStages: state.plotSearch.isFetchingPlotSearchStages,
  favourite: state.favourite.favourite,
});

export default connect(mapStateToProps, {
  fetchPlotSearches,
  fetchPlotSearchAttributes,
  fetchPlotSearchTypes,
})(MapSearchPage);

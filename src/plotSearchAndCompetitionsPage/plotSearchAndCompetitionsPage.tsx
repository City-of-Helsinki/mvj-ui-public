import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../root/rootReducer';
// import { Tabs, TabPanel, TabList, Tab } from 'hds-react';
import Tabs from '../tabs/tabs';
import TabPane from '../tabs/tabPane';
import TabContent from '../tabs/tabContent';
import MapSearchComponent from './components/mapSearchComponent';
import MapComponent from '../map/mapComponent';
import {
  fetchPlotSearchAttributes,
  fetchPlotSearches,
  fetchPlotSearchTypes,
} from '../plotSearch/actions';

import { Language } from '../language/types';
import translations from './translations';
import { ApiAttributes } from '../api/types';
import {
  PlotSearch,
  PlotSearchSubtype,
  PlotSearchTarget,
  PlotSearchType,
} from '../plotSearch/types';

interface State {
  currentLanguage: Language;
  isFetchingPlotSearches: boolean;
  isFetchingPlotSearchAttributes: boolean;
  isFetchingPlotSearchTypes: boolean;
  plotSearches: Array<PlotSearch>;
  plotSearchAttributes: ApiAttributes;
  plotSearchTypes: Array<PlotSearchType>;
}

interface Props {
  currentLanguage: string;
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
    currentLanguage,
    fetchPlotSearches,
    fetchPlotSearchAttributes,
    fetchPlotSearchTypes,
    isFetchingPlotSearches,
    isFetchingPlotSearchAttributes,
    isFetchingPlotSearchTypes,
    plotSearchTypes,
    plotSearches,
  } = props;
  const [activeTab, setActiveTab] = useState<number>(0);
  const [categoryVisibilities, setCategoryVisibilities] =
    useState<CategoryVisibilities>({});
  const [categoryOptions, setCategoryOptions] = useState<CategoryOptions>([]);
  const [selectedTarget, setSelectedTarget] = useState<SelectedTarget>(null);
  const navigate = useNavigate();
  const { search } = useLocation();
  const tab = new URLSearchParams(search).get('tab');
  const tabId: number = tab !== null ? parseInt(tab) : 0;

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

  if (tabId != activeTab) {
    setActiveTab(tabId);
  }

  const handleTabClick = (
    tabId: number,
    setActiveTab: (tab: number) => void
  ): void => {
    setActiveTab(tabId);
    navigate({
      pathname: location.pathname,
      search: `?tab=${tabId}`,
    });
  };

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

  if (
    isFetchingPlotSearches ||
    isFetchingPlotSearchAttributes ||
    isFetchingPlotSearchTypes
  ) {
    // TODO: loader
    return <div />;
  }

  return (
    <div className="PlotSearchAndCompetitionsPage container">
      <Tabs
        active={activeTab}
        tabs={[
          {
            label: translations[currentLanguage].MAP_SEARCH,
          },
          {
            label: translations[currentLanguage].LIST,
          },
        ]}
        onTabClick={(id) => handleTabClick(id, setActiveTab)}
      />
      <TabContent active={activeTab}>
        <TabPane>
          <div>
            <MapSearchComponent
              categoryOptions={categoryOptions}
              categoryVisibilities={categoryVisibilities}
              onToggleVisibility={onToggleCategoryVisibility}
              plotSearches={plotSearches.filter(
                (s) => s.search_class === 'plot_search'
              )}
              setSelectedTarget={setSelectedTarget}
              selectedTarget={selectedTarget}
            />
            <MapComponent />
          </div>
        </TabPane>
        <TabPane>
          <div>...</div>
        </TabPane>
      </TabContent>
    </div>
  );
};

const mapStateToProps = (state: RootState): State => ({
  currentLanguage: state.language.current,
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

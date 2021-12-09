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
} from '../plotSearch/actions';

import { Language } from '../language/types';
import translations from './translations';
import { ApiAttributes } from '../api/types';
import { PlotSearch, PlotSearchTarget } from '../plotSearch/types';

interface State {
  currentLanguage: Language;
  isFetchingPlotSearches: boolean;
  isFetchingPlotSearchAttributes: boolean;
  plotSearches: Array<PlotSearch>;
  plotSearchAttributes: ApiAttributes;
}

interface Props {
  currentLanguage: string;
  fetchPlotSearches: () => void;
  fetchPlotSearchAttributes: () => void;
  isFetchingPlotSearches: boolean;
  isFetchingPlotSearchAttributes: boolean;
  plotSearches: Array<PlotSearch>;
  plotSearchAttributes: ApiAttributes;
}

export type CategoryOptions = Array<{
  id: number;
  labelKey: string;
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
    isFetchingPlotSearches,
    isFetchingPlotSearchAttributes,
    plotSearchAttributes,
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
  }, []);

  useEffect(() => {
    let newOptions = [...(plotSearchAttributes?.type?.choices || [])];

    if (newOptions) {
      newOptions.sort((a, b) => (a.value > b.value ? 1 : -1));
      newOptions = newOptions.filter((option) =>
        plotSearches.some((plotSearch) => plotSearch.type?.id === option.value)
      );

      setCategoryOptions(
        newOptions.map((option, index) => ({
          id: Number(option.value),
          labelKey: option.display_name,
          symbol: String.fromCharCode('A'.charCodeAt(0) + index),
        }))
      );

      setCategoryVisibilities(
        newOptions.reduce((acc, next) => {
          acc[Number(next.value)] = true;
          return acc;
        }, {} as CategoryVisibilities)
      );
    }
  }, [plotSearchAttributes, plotSearches]);

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

  if (isFetchingPlotSearches || isFetchingPlotSearchAttributes) {
    // TODO: loader
    return <div />;
  }

  return (
    <div className={'container'}>
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
          <Fragment>
            <MapSearchComponent />
            <MapComponent />
          </Fragment>
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
  isFetchingPlotSearches: state.plotSearch.isFetchingPlotSearches,
  isFetchingPlotSearchAttributes:
    state.plotSearch.isFetchingPlotSearchAttributes,
});

export default connect(mapStateToProps, {
  fetchPlotSearches,
  fetchPlotSearchAttributes,
})(PlotSearchAndCompetitionsPage);

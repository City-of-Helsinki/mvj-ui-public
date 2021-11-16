import React, {Fragment, useState} from 'react';
import { connect } from 'react-redux';
import {useNavigate } from 'react-router-dom';
import { RootState } from '../root/rootReducer';
// import { Tabs, TabPanel, TabList, Tab } from 'hds-react';
import Tabs from '../tabs/tabs';
import TabPane from '../tabs/tabPane';
import TabContent from '../tabs/tabContent';
import MapSearchComponent from './components/mapSearchComponent';
import MapComponent from '../map/mapComponent';

import {
  Language,
} from '../language/types';
import translations from './translations';

interface State {
  currentLanguage: Language,
}

interface Props {
  currentLanguage: string
}

const PlotSearchAndCompetitionsPage = (props: Props): JSX.Element => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const { currentLanguage } = props;
  const navigate = useNavigate();

  const handleTabClick = (tabId: number, setActiveTab: (tab: number) => void): void => {
    setActiveTab(tabId);
    navigate(location.pathname, { state: tabId });

    /*
    this.setState({activeTab: tabId}, () => {
      return history.push({
        ...location,
        search: 'tab=' + tabId,
      });
    });

     */
  };

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
        onTabClick={() => handleTabClick(0, setActiveTab)}
      />
      <TabContent active={activeTab}>
        <TabPane>
          <Fragment>
            <MapSearchComponent/>
            <MapComponent/>
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
});

export default connect(mapStateToProps)(PlotSearchAndCompetitionsPage);

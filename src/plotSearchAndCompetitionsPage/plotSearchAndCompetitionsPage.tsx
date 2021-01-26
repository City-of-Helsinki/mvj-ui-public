import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../root/rootReducer';
//import { Tabs, TabPanel, TabList, Tab } from 'hds-react';
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

interface PathProps {
  history: string,
}

class PlotSearchAndCompetitionsPage extends Component<State & RouteComponentProps<PathProps>> {
  state = {
    activeTab: 0,
  };

  handleTabClick = (tabId: number) => {
    const {history, location, location: { search }} = this.props;
    console.log(search);
    this.setState({activeTab: tabId}, () => {
      return history.push({
        ...location,
        search: 'tab=' + tabId,
      });
    });
  };

  render(): JSX.Element {
    const { currentLanguage } = this.props;
    const { activeTab } = this.state;
    
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
          onTabClick={this.handleTabClick}
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
  }
}

const mapStateToProps = (state: RootState): State => ({
  currentLanguage: state.language.current,
});

export default withRouter(connect(mapStateToProps)(PlotSearchAndCompetitionsPage));

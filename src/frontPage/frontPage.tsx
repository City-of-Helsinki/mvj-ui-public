import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../root/rootReducer';

import {
  Language,
} from '../language/types';
import translations from './translations';

import Box from './components/box';

interface State {
  currentLanguage: Language,
}

interface PathProps {
  history: string,
}

class FrontPage extends Component<State & RouteComponentProps<PathProps>> {
  render(): JSX.Element {
    const { currentLanguage } = this.props;

    return (
      <div className={'container'}>
        <div className={'front-page'}>
          <div className={'banner'}>
            <h3>
              {translations[currentLanguage].FRONT_PAGE_BANNER_TEXT}
            </h3>
            <div className={'banner-koro'}/>
          </div>
          <div className={'content'}>
            <h4>
              {translations[currentLanguage].HOW_CAN_WE_HELP}
            </h4>
            <div className={'boxes'}>
              <Box
                topLabel={translations[currentLanguage].PLOT_SEARCH_AND_COMPETITIONS}
                count={2}
                label={translations[currentLanguage].DO_YOU_WANT_TO}
                bottomText={translations[currentLanguage].PLOTS_FOR}
                color={'pink'}
              />
              <Box
                topLabel={translations[currentLanguage].OTHER_COMPETITIONS_AND_SEARCHES}
                count={14}
                label={translations[currentLanguage].I_WANT_TO}
                bottomText={translations[currentLanguage].DESCRIPTION}
                color={'gray'}
              />
              <Box
                topLabel={translations[currentLanguage].AREA_SEARCH}
                count={0}
                label={translations[currentLanguage].I_WANT_TO_RENT_THE_AREA}
                bottomText={translations[currentLanguage].DESCRIPTION}
                color={'yellow'}
              />
              <Box
                topLabel={'Vuokraukset'}
                count={0}
                label={translations[currentLanguage].IM_SEARCHING_CHANGE_FOR}
                bottomText={translations[currentLanguage].DESCRIPTION}
                color={'blue'}
              />
            </div>
            <h5>
              {translations[currentLanguage].QUESTIONS}
            </h5>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): State => ({
  currentLanguage: state.language.current,
});

export default withRouter(connect(mapStateToProps)(FrontPage));

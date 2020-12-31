import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../root/rootReducer';

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
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): State => ({
  currentLanguage: state.language.current,
});

export default withRouter(connect(mapStateToProps)(FrontPage));

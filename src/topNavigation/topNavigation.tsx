import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Navigation } from 'hds-react';
import { Routes, getRouteById } from '../root/routes';
import { RootState } from '../root/rootReducer';
import {
  changeLang,
} from '../language/actions';
import {
  openLoginModal,
} from '../login/actions';
import {
  Language,
} from '../language/types';
import translations from './translations';

interface State {
  currentLanguage: Language,
}

interface Dispatch {
  changeLang: (lang: Language) => void,
  openLoginModal: () => void,
}

interface PathProps {
  history: string,
}

class TopNavigation extends Component<State & Dispatch & RouteComponentProps<PathProps>> {
  render(): JSX.Element {
    const { 
      currentLanguage, 
      openLoginModal,
      changeLang,
    } = this.props;

    return (
      <Navigation
        menuToggleAriaLabel='menu'
        skipTo='#content' // TODO {getRouteById(Routes.HOME)}
        skipToContentLabel='Skip to content'
      >
        <Navigation.Row variant='inline'>
          <Link to={getRouteById(Routes.PLOT_SEARCH_AND_COMPETITIONS)}>
            <Navigation.Item label={translations[currentLanguage].PLOT_SEARCH_AND_COMPETITIONS}/>
          </Link>
          <Link to={getRouteById(Routes.OTHER_COMPETITIONS_AND_SEARCHES)}>
            <Navigation.Item label={translations[currentLanguage].OTHER_COMPETITIONS_AND_SEARCHES}/>
          </Link>
          <Link to={getRouteById(Routes.AREA_SEARCH)}>
            <Navigation.Item label={translations[currentLanguage].AREA_SEARCH}/>
          </Link>
        </Navigation.Row>
        <Navigation.Actions>
          <Navigation.User label='Sign in' onSignIn={() => openLoginModal()}/>
          <Navigation.LanguageSelector label={currentLanguage}>
            <Navigation.Item label='Suomeksi' onClick={() => changeLang(Language.FI)}/>
            <Navigation.Item label='På svenska' onClick={() => changeLang(Language.SWE)}/>
            <Navigation.Item label='In English' onClick={() => changeLang(Language.EN)}/>
          </Navigation.LanguageSelector>
        </Navigation.Actions>
      </Navigation>
    );
  }
}

const mapDispatchToProps: Dispatch = {
  changeLang,
  openLoginModal,
};

const mapStateToProps = (state: RootState): State => ({
  currentLanguage: state.language.current,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopNavigation));

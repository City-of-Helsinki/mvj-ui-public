import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {Routes, getRouteById} from '../root/routes';
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

  changeLanguage = () => {
    const { currentLanguage, changeLang } = this.props;
    
    switch (currentLanguage) {
    case Language.FI:
      changeLang(Language.EN);
      break;
    case Language.EN:
      changeLang(Language.SWE);
      break;
    case Language.SWE:
      changeLang(Language.FI);
      break;
    default:
      changeLang(Language.FI);
    }
  }

  render(): JSX.Element {
    const { 
      currentLanguage, 
      openLoginModal 
    } = this.props;

    return (
      <div className={'top-navigation'}>
        <div className={'start'}>
          <Link to={getRouteById(Routes.HOME)} className={'helsinki-logo'}>
          </Link>
          <Link to={getRouteById(Routes.PLOT_SEARCH_AND_COMPETITIONS)}>
            {translations[currentLanguage].PLOT_SEARCH_AND_COMPETITIONS}
          </Link>
          <Link to={getRouteById(Routes.OTHER_COMPETITIONS_AND_SEARCHES)}>
            {translations[currentLanguage].OTHER_COMPETITIONS_AND_SEARCHES}
          </Link>
          <Link to={getRouteById(Routes.AREA_SEARCH)}>
            {translations[currentLanguage].AREA_SEARCH}
          </Link>
        </div>
        <div className={'end'}>
          <Link to={getRouteById(Routes.HOME)} className={'about-logo'}>
          </Link>
          <Link to={getRouteById(Routes.HOME)} className={'favorite-logo'}>
          </Link>
          <Link to={''} className={'profile-logo'} onClick={() => openLoginModal()}>
          </Link>
          <Link to={''} className={'language-logo'} onClick={this.changeLanguage}>
            {currentLanguage}
          </Link>
        </div>
      </div>
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

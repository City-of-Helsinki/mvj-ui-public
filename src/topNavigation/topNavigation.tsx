import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navigation } from 'hds-react';
import { AppRoutes, getRouteById } from '../root/routes';
import { RootState } from '../root/rootReducer';
import { changeLang } from '../language/actions';
import { openLoginModal } from '../login/actions';
import { Language } from '../language/types';
import translations from './translations';
import { NavigateFunction } from 'react-router';

interface State {
  currentLanguage: Language;
}

interface Dispatch {
  changeLang: (lang: Language) => void;
  openLoginModal: () => void;
}

interface TopNavigationProps {
  currentLanguage: string;
  openLoginModal: () => void;
  changeLang: (lang: Language) => void;
}

const TopNavigation = (props: TopNavigationProps): JSX.Element => {
  const returnHome = (navigate: NavigateFunction) => {
    navigate(getRouteById(AppRoutes.HOME));
  };

  const { currentLanguage, openLoginModal, changeLang } = props;

  const navigate = useNavigate();

  return (
    <Navigation
      menuToggleAriaLabel="menu"
      skipTo="#content"
      skipToContentLabel="Skip to content"
      onTitleClick={() => returnHome(navigate)}
      fixed={true}
      className={'top-nav'}
    >
      <Navigation.Row variant="inline">
        <Link to={getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS)}>
          <Navigation.Item
            label={translations[currentLanguage].PLOT_SEARCH_AND_COMPETITIONS}
          />
        </Link>
        <Link to={getRouteById(AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES)}>
          <Navigation.Item
            label={
              translations[currentLanguage].OTHER_COMPETITIONS_AND_SEARCHES
            }
          />
        </Link>
        <Link to={getRouteById(AppRoutes.AREA_SEARCH)}>
          <Navigation.Item label={translations[currentLanguage].AREA_SEARCH} />
        </Link>
      </Navigation.Row>
      <Navigation.Actions>
        <Navigation.User label="Sign in" onSignIn={() => openLoginModal()} />
        <Navigation.LanguageSelector label={currentLanguage.toUpperCase()}>
          <Navigation.Item
            label="Suomeksi"
            onClick={() => changeLang(Language.FI)}
          />
          <Navigation.Item
            label="På svenska"
            onClick={() => changeLang(Language.SWE)}
          />
          <Navigation.Item
            label="In English"
            onClick={() => changeLang(Language.EN)}
          />
        </Navigation.LanguageSelector>
      </Navigation.Actions>
    </Navigation>
  );
};

const mapDispatchToProps: Dispatch = {
  changeLang,
  openLoginModal,
};

const mapStateToProps = (state: RootState): State => ({
  currentLanguage: state.language.current,
});

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigation);

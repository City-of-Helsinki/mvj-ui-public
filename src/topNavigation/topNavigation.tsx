import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navigation } from 'hds-react';
import { AppRoutes, getRouteById } from '../root/routes';
import { openLoginModal } from '../login/actions';
import { Language } from '../i18n/types';
import { NavigateFunction } from 'react-router';
import { useTranslation } from 'react-i18next';

interface Dispatch {
  openLoginModal: () => void;
}

interface TopNavigationProps {
  openLoginModal: () => void;
}

const TopNavigation = ({ openLoginModal }: TopNavigationProps): JSX.Element => {
  const returnHome = (navigate: NavigateFunction) => {
    navigate(getRouteById(AppRoutes.HOME));
  };

  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  return (
    <Navigation
      menuToggleAriaLabel="menu"
      skipTo="#content"
      skipToContentLabel={t('topNavigation.skipToContent', 'Skip to content')}
      onTitleClick={() => returnHome(navigate)}
      fixed={true}
      className="TopNavigation"
    >
      <Navigation.Row variant="inline">
        <Link to={getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS)}>
          <Navigation.Item
            label={t(
              'topNavigation.tabs.plotSearchAndCompetitions',
              'Plot search and competitions'
            )}
          />
        </Link>
        <Link to={getRouteById(AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES)}>
          <Navigation.Item
            label={t(
              'topNavigation.tabs.otherCompetitionsAndSearches',
              'Other competitions and searches'
            )}
          />
        </Link>
        <Link to={getRouteById(AppRoutes.AREA_SEARCH)}>
          <Navigation.Item
            label={t('topNavigation.tabs.areaSearch', 'Area search')}
          />
        </Link>
      </Navigation.Row>
      <Navigation.Actions>
        <Navigation.User
          label={t('topNavigation.signIn', 'Sign in')}
          onSignIn={() => openLoginModal()}
        />
        <Navigation.LanguageSelector label={i18n.language.toUpperCase()}>
          <Navigation.Item
            label="Suomeksi"
            lang={Language.FI}
            onClick={() => i18n.changeLanguage(Language.FI)}
          />
          <Navigation.Item
            label="På svenska"
            lang={Language.SV}
            onClick={() => i18n.changeLanguage(Language.SV)}
          />
          <Navigation.Item
            label="In English"
            lang={Language.EN}
            onClick={() => i18n.changeLanguage(Language.EN)}
          />
        </Navigation.LanguageSelector>
      </Navigation.Actions>
    </Navigation>
  );
};

const mapDispatchToProps: Dispatch = {
  openLoginModal,
};

export default connect(null, mapDispatchToProps)(TopNavigation);

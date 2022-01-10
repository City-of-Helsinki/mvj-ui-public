import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { LogoLanguage, Navigation } from 'hds-react';
import { AppRoutes, getRouteById } from '../root/routes';
import { openLoginModal } from '../login/actions';
import { Language } from '../i18n/types';
import { NavigateFunction, useMatch } from 'react-router';
import { useTranslation } from 'react-i18next';

interface Dispatch {
  openLoginModal: () => void;
}

interface TopNavigationProps {
  openLoginModal: () => void;
}

/*
// TODO: Not currently possible due to the way HDS handles the active class name, but possibly in the future.
// For now, the same structure is defined separately for every link further below instead.

interface TopNavigationLinkProps {
  to: string,
  label: ReactNode,
  className?: string
}

const TopNavigationLink = ({to, label, className}: TopNavigationLinkProps): JSX.Element => {
  const match = useMatch(to);

  return <Navigation.Item
      label={label}
      as={Link}
      to={to}
      active={match !== null}
      className={className}
  />;
};
 */

const TopNavigation = ({ openLoginModal }: TopNavigationProps): JSX.Element => {
  const returnHome = (navigate: NavigateFunction) => {
    navigate(getRouteById(AppRoutes.HOME));
  };

  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const matchPlotSearchAndCompetitions = useMatch(
    getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS)
  );
  const matchOtherCompetitionsAndSearches = useMatch(
    getRouteById(AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES)
  );
  const matchAreaSearch = useMatch(getRouteById(AppRoutes.AREA_SEARCH));

  const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language).then(() => {
      document.location.reload();
    });
  };

  return (
    <Navigation
      menuToggleAriaLabel={t('topNavigation.menuLabel', 'Menu')}
      skipTo="#content"
      skipToContentLabel={t('topNavigation.skipToContent', 'Skip to content')}
      onTitleClick={() => returnHome(navigate)}
      fixed
      className="TopNavigation"
      logoLanguage={i18n.language as LogoLanguage}
    >
      <Navigation.Row variant="inline">
        <Navigation.Item
          label={t(
            'topNavigation.tabs.plotSearchAndCompetitions',
            'Plot search and competitions'
          )}
          as={Link}
          to={getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS)}
          active={matchPlotSearchAndCompetitions !== null}
        />
        <Navigation.Item
          label={t(
            'topNavigation.tabs.otherCompetitionsAndSearches',
            'Other competitions and searches'
          )}
          as={Link}
          to={getRouteById(AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES)}
          active={matchOtherCompetitionsAndSearches !== null}
        />
        <Navigation.Item
          label={t('topNavigation.tabs.areaSearch', 'Area search')}
          as={Link}
          to={getRouteById(AppRoutes.AREA_SEARCH)}
          active={matchAreaSearch !== null}
        />
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
            onClick={() => changeLanguage(Language.FI)}
          />
          <Navigation.Item
            label="På svenska"
            lang={Language.SV}
            onClick={() => changeLanguage(Language.SV)}
          />
          <Navigation.Item
            label="In English"
            lang={Language.EN}
            onClick={() => changeLanguage(Language.EN)}
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

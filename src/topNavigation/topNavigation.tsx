import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Header,
  IconSignout,
  IconUser,
  LanguageOption,
  Link,
  Logo,
  logoFi,
} from 'hds-react';
import { useMatch } from 'react-router';
import { useTranslation } from 'react-i18next';

import { AppRoutes, getRouteById } from '../root/helpers';
import { openLoginModal } from '../login/actions';
import { Language } from '../i18n/types';
import TopNavigationFavouritesIcon from './components/topNavigationFavouritesIcon';
import { RootState } from '../root/rootReducer';
import { MVJ_FAVOURITE } from '../favourites/types';
import { getFavouriteCount } from '../favourites/selectors';
import useAuth from '../auth/useAuth';
import { getLoggedInUser } from '../auth/selectors';
import {
  IS_FEATURE_OTHER_SEARCH_ENABLED,
  IS_FEATURE_PLOT_SEARCH_ENABLED,
} from '../featureFlags';

interface Dispatch {
  openLoginModal: () => void;
}

interface TopNavigationProps {
  openLoginModal: () => void;
  favouritesCount: number;
  isLoggedIn: boolean;
}

interface State {
  favouritesCount: number;
  isLoggedIn: boolean;
}

interface TopNavigationLinkProps {
  to: string;
  label: string;
  default?: string;
  className?: string;
}

/**
 * Return a navigation link in an array if the condition is true.
 */
const addNaviLink = (
  condition: boolean,
  link: TopNavigationLinkProps,
): Array<TopNavigationLinkProps> => {
  return condition ? [link] : [];
};

export const naviLinks: TopNavigationLinkProps[] = [
  ...addNaviLink(IS_FEATURE_PLOT_SEARCH_ENABLED, {
    to: AppRoutes.PLOT_SEARCH_AND_COMPETITIONS,
    label: 'topNavigation.tabs.plotSearchAndCompetitions',
    default: 'Plot search and competitions',
  }),
  ...addNaviLink(IS_FEATURE_OTHER_SEARCH_ENABLED, {
    to: AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES,
    label: 'topNavigation.tabs.otherCompetitionsAndSearches',
    default: 'Other competitions and searches',
  }),
  {
    to: AppRoutes.AREA_SEARCH_LANDING,
    label: 'topNavigation.tabs.areaSearch',
    default: 'Area search',
  },
];

const TopNavigationLink = ({
  to,
  label,
  className,
}: TopNavigationLinkProps): JSX.Element => {
  const match = useMatch(to);

  return (
    <Header.Link
      label={label}
      as={RouterLink}
      to={to}
      active={match !== null}
      className={className}
    />
  );
};

const TopNavigation = ({
  openLoginModal,
  favouritesCount,
  isLoggedIn,
}: TopNavigationProps): JSX.Element => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const languages: LanguageOption[] = [
    {
      label: 'Suomi',
      value: Language.FI,
      isPrimary: false,
    },
    {
      label: 'Svenska',
      value: Language.SV,
      isPrimary: false,
    },
    {
      label: 'English',
      value: Language.EN,
      isPrimary: false,
    },
  ];

  const changeLanguage = (lang: string) => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang).then(() => {
        document.location.reload();
      });
    }
  };

  return (
    <Header
      onDidChangeLanguage={changeLanguage}
      languages={languages}
      defaultLanguage={i18n.language}
      className="TopNavigation"
    >
      <Header.SkipLink
        skipTo="#content"
        label={t('topNavigation.skipToContent', 'Skip to content')}
      />
      <Header.ActionBar
        title={t(
          'mainAppTitle',
          'City of Helsinki plot and land leasing system',
        )}
        frontPageLabel={t('frontPage.label', 'Front page')}
        titleAriaLabel={t(
          'mainAppTitle',
          'City of Helsinki plot and land leasing system',
        )}
        titleHref={getRouteById(AppRoutes.HOME)}
        logo={<Logo src={logoFi} alt={t('frontPage.label', 'Front page')} />}
        logoAriaLabel={t('frontPage.label', 'Front page')}
        logoHref={getRouteById(AppRoutes.HOME)}
        menuButtonAriaLabel={t('language.languageSelection', 'Language')}
      >
        <Header.LanguageSelector
          ariaLabel={t('language.languageSelection', 'Language')}
          languageHeading={t('language.heading', 'Other languages')}
        />
        {(IS_FEATURE_PLOT_SEARCH_ENABLED ||
          IS_FEATURE_OTHER_SEARCH_ENABLED) && (
          <Header.ActionBarItem
            label={t('header.actions.favourites.title', 'Favourites')}
            id="action-bar-favourites"
            icon={<TopNavigationFavouritesIcon count={favouritesCount} />}
            onClick={(e) => {
              e.preventDefault();
              navigate(getRouteById(AppRoutes.FAVOURITES));
            }}
          />
        )}
        <Header.ActionBarItem
          label={
            !isLoggedIn
              ? t('header.actions.userManagement.logIn', 'Log in')
              : t('header.actions.userManagement.logOut', 'Log out')
          }
          fixedRightPosition
          icon={!isLoggedIn ? <IconUser /> : <IconSignout />}
          id="action-bar-login"
          onClick={
            !isLoggedIn
              ? (e) => {
                  e.preventDefault();
                  openLoginModal();
                }
              : (e) => {
                  e.preventDefault();
                  localStorage.removeItem(MVJ_FAVOURITE);
                  logout();
                }
          }
        />
      </Header.ActionBar>
      <Header.NavigationMenu>
        {naviLinks.map((link) => (
          <TopNavigationLink
            key={getRouteById(link.to)}
            to={getRouteById(link.to)}
            label={t(link.label, link.default || '')}
          />
        ))}
        <Header.Link
          as={Link}
          label={t('topNavigation.externalLinks.helsinki.label')}
          href={t('topNavigation.externalLinks.helsinki.href')}
          external
          openInExternalDomainAriaLabel={t(
            'application.ariaLabels.openInExternalDomain',
            'Avautuu uudessa välilehdessä.',
          )}
          children={null}
        />
      </Header.NavigationMenu>
    </Header>
  );
};

const mapDispatchToProps: Dispatch = {
  openLoginModal,
};

export default connect(
  (state: RootState): State => ({
    favouritesCount: getFavouriteCount(state),
    isLoggedIn: !!getLoggedInUser(state),
  }),
  mapDispatchToProps,
)(TopNavigation);

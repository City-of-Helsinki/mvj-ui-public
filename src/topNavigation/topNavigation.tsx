import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Header,
  IconSignout,
  IconUser,
  LanguageOption,
  Logo,
  logoFi,
} from 'hds-react';
import { useMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { User } from 'oidc-client';

import { getRouteById } from '../root/routes';
import { openLoginModal } from '../login/actions';
import { Language } from '../i18n/types';
import TopNavigationFavouritesIcon from './components/topNavigationFavouritesIcon';
import { RootState } from '../root/rootReducer';
import { getUser } from '../auth/selectors';
import { userManager } from '../auth/userManager';
import { MVJ_FAVOURITE } from '../favourites/types';
import { getFavouriteCount } from '../favourites/selectors';
import { AppRoutes } from '../application/helpers';

interface Dispatch {
  openLoginModal: () => void;
}

interface TopNavigationProps {
  openLoginModal: () => void;
  user: User | null;
  favouritesCount: number;
}

interface State {
  user: User | null;
  favouritesCount: number;
}

interface TopNavigationLinkProps {
  to: string;
  label: string;
  default?: string;
  className?: string;
}

export const naviLinks: TopNavigationLinkProps[] = [
  {
    to: AppRoutes.PLOT_SEARCH_AND_COMPETITIONS,
    label: 'topNavigation.tabs.plotSearchAndCompetitions',
    default: 'Plot search and competitions',
  },
  {
    to: AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES,
    label: 'topNavigation.tabs.otherCompetitionsAndSearches',
    default: 'Other competitions and searches',
  },
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
      as={Link}
      to={to}
      active={match !== null}
      className={className}
    />
  );
};

const TopNavigation = ({
  openLoginModal,
  favouritesCount,
  user,
}: TopNavigationProps): JSX.Element => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

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
      onDidChangeLanguage={(lang) => changeLanguage(lang)}
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
        />
        <Header.ActionBarItem
          label={t('header.actions.favourites.title', 'Favourites')}
          id="action-bar-favourites"
          icon={<TopNavigationFavouritesIcon count={favouritesCount} />}
          onClick={(e) => {
            e.preventDefault();
            navigate(getRouteById(AppRoutes.FAVOURITES));
          }}
        />
        <Header.ActionBarItem
          label={
            !user
              ? t('header.actions.userManagement.logIn', 'Log in')
              : t('header.actions.userManagement.logOut', 'Log out')
          }
          fixedRightPosition
          icon={!user ? <IconUser /> : <IconSignout />}
          id="action-bar-login"
          onClick={
            !user
              ? (e) => {
                  e.preventDefault();
                  openLoginModal();
                }
              : (e) => {
                  e.preventDefault();
                  userManager.signoutRedirect().then(() => {
                    localStorage.removeItem(MVJ_FAVOURITE);
                  });
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
      </Header.NavigationMenu>
    </Header>
  );
};

const mapDispatchToProps: Dispatch = {
  openLoginModal,
};

export default connect(
  (state: RootState): State => ({
    user: getUser(state),
    favouritesCount: getFavouriteCount(state),
  }),
  mapDispatchToProps,
)(TopNavigation);

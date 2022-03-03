import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from '../App';
import FrontPage from '../frontPage/frontPage';
import ErrorPage from '../errorPage/errorPage';
import MapSearchPage from '../mapSearch/mapSearchPage';
import FavouritesPage from '../favouritesPage/favouritesPage';
import FinalizeLogin from '../auth/components/finalizeLogin';
import AuthDependentContent from '../auth/components/authDependentContent';
import BlockLoader from '../loader/blockLoader';
import ApplicationPage from '../application/applicationPage';
import ApplicationRootPage from '../application/applicationRootPage';
import ApplicationSuccessPage from '../application/applicationSuccessPage';

export const AppRoutes = {
  HOME: 'home',
  ERROR: 'error',
  PLOT_SEARCH_AND_COMPETITIONS: 'plot-search-and-competitions',
  PLOT_SEARCH_AND_COMPETITIONS_TARGET: 'plot-search-and-competitions-target',
  OTHER_COMPETITIONS_AND_SEARCHES: 'other-competitions-and-searches',
  AREA_SEARCH: 'area-search',
  LEASES: 'leases',
  APPLICATIONS: 'applications',
  MESSAGES: 'messages',
  FAVOURITES: 'favourites',
  OIDC_CALLBACK: 'oidc-callback',
  APPLICATION_ROOT: 'application-root',
  APPLICATION_FORM: 'application-form',
  APPLICATION_PREVIEW: 'application-preview',
  APPLICATION_SUBMIT: 'application-submit',
};

/**
 * Get route by id
 * @param {string} id
 * @returns {string}
 */
export const getRouteById = (id: string): string => {
  const routes = {
    [AppRoutes.HOME]: '/',
    [AppRoutes.PLOT_SEARCH_AND_COMPETITIONS]: '/tonttihaut-ja-kilpailut',
    [AppRoutes.PLOT_SEARCH_AND_COMPETITIONS_TARGET]:
      '/tonttihaut-ja-kilpailut/kohteet/',
    [AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES]: '/muut-kilpailut-ja-haut',
    [AppRoutes.AREA_SEARCH]: '/aluehaku',
    [AppRoutes.LEASES]: '/vuokraukset',
    [AppRoutes.APPLICATIONS]: '/hakemukset',
    [AppRoutes.MESSAGES]: '/viestit',
    [AppRoutes.FAVOURITES]: '/suosikit',
    [AppRoutes.OIDC_CALLBACK]: '/oidc/callback',
    [AppRoutes.APPLICATION_ROOT]: '/hakemus',
    [AppRoutes.APPLICATION_FORM]: '/hakemus/tietojen-taytto',
    [AppRoutes.APPLICATION_PREVIEW]: '/hakemus/tietojen-tarkistus',
    [AppRoutes.APPLICATION_SUBMIT]: '/hakemus/lahetys',
  };

  return routes[id] ? routes[id] : '';
};

export const getPartialRouteById = (id: string, parentId: string): string => {
  const target = getRouteById(id);
  const parent = getRouteById(parentId);

  if (!target.startsWith(parent)) {
    throw new Error(
      `Invalid route nesting pattern! ${target} is not a subroute of ${parent}.`
    );
  }

  return target.slice(parent.length);
};

const SiteRoutes = (): JSX.Element => {
  const RouteWithLoader = ({
    children,
  }: {
    children: JSX.Element | null;
  }): JSX.Element | null => (
    <AuthDependentContent>
      {(loading, loggedIn) => {
        if (!loggedIn || !loading) {
          return children || null;
        }

        return <BlockLoader />;
      }}
    </AuthDependentContent>
  );

  return (
    <BrowserRouter>
      <App>
        <Routes>
          <Route
            path={getRouteById(AppRoutes.OIDC_CALLBACK)}
            element={<FinalizeLogin />}
          />
          <Route
            path="/"
            element={
              <RouteWithLoader>
                <FrontPage />
              </RouteWithLoader>
            }
          />
          <Route
            path={getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS)}
            element={
              <RouteWithLoader>
                <MapSearchPage searchClass="plot_search" key="plot_search" />
              </RouteWithLoader>
            }
          />
          <Route
            path={
              getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS_TARGET) +
              ':id'
            }
            element={
              <RouteWithLoader>
                <MapSearchPage searchClass="plot_search" key="plot_search" />
              </RouteWithLoader>
            }
          />
          <Route
            path={getRouteById(AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES)}
            element={
              <RouteWithLoader>
                <MapSearchPage searchClass="other_search" key="other_search" />
              </RouteWithLoader>
            }
          />
          <Route
            path={
              getRouteById(AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES) + ':id'
            }
            element={
              <RouteWithLoader>
                <MapSearchPage searchClass="other_search" key="other_search" />
              </RouteWithLoader>
            }
          />
          <Route
            path={getRouteById(AppRoutes.AREA_SEARCH)}
            element={
              <RouteWithLoader>
                <div>Aluehakusivu</div>
              </RouteWithLoader>
            }
          />
          <Route
            path={getRouteById(AppRoutes.FAVOURITES)}
            element={
              <RouteWithLoader>
                <FavouritesPage />
              </RouteWithLoader>
            }
          />
          <Route
            path={getRouteById(AppRoutes.APPLICATION_ROOT) + '/*'}
            element={
              <ApplicationRootPage>
                <Routes>
                  <Route
                    path={getPartialRouteById(
                      AppRoutes.APPLICATION_FORM,
                      AppRoutes.APPLICATION_ROOT
                    )}
                    element={<ApplicationPage />}
                  />
                  <Route
                    path={getPartialRouteById(
                      AppRoutes.APPLICATION_SUBMIT,
                      AppRoutes.APPLICATION_ROOT
                    )}
                    element={<ApplicationSuccessPage />}
                  />
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </ApplicationRootPage>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </App>
    </BrowserRouter>
  );
};

export default SiteRoutes;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InjectedFormProps } from 'redux-form';

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
import ApplicationPreviewPage from '../application/applicationPreviewPage';
import AreaSearchLandingPage from '../areaSearch/areaSearchLandingPage';
import AreaSearchApplicationRootPage, {
  Props as AreaSearchApplicationRootPageProps,
} from '../areaSearch/areaSearchApplicationRootPage';
import AreaSearchApplicationPage from '../areaSearch/areaSearchApplicationPage';
import AreaSearchApplicationPreview from '../areaSearch/areaSearchApplicationPreview';
import AreaSearchSpecsPage from '../areaSearch/areaSearchSpecsPage';
import AreaSearchApplicationSuccessPage from '../areaSearch/areaSearchApplicationSuccessPage';
import DirectReservationPage from '../directReservation/directReservationPage';
import { AppRoutes } from '../application/helpers';

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
    [AppRoutes.AREA_SEARCH_LANDING]: '/aluehaku',
    [AppRoutes.AREA_SEARCH_APPLICATION_ROOT]: '/aluehaku/hakemus',
    [AppRoutes.AREA_SEARCH_APPLICATION_AREA_SPEC]:
      '/aluehaku/hakemus/alueen-maaritys',
    [AppRoutes.AREA_SEARCH_APPLICATION_FORM]:
      '/aluehaku/hakemus/tietojen-taytto',
    [AppRoutes.AREA_SEARCH_APPLICATION_SUBMIT]: '/aluehaku/hakemus/lahetys',
    [AppRoutes.AREA_SEARCH_APPLICATION_FORM_PREVIEW]:
      '/aluehaku/hakemus/tietojen-tarkistus',
    [AppRoutes.LEASES]: '/vuokraukset',
    [AppRoutes.APPLICATIONS]: '/hakemukset',
    [AppRoutes.MESSAGES]: '/viestit',
    [AppRoutes.FAVOURITES]: '/suosikit',
    [AppRoutes.OIDC_CALLBACK]: '/oidc/callback',
    [AppRoutes.APPLICATION_ROOT]: '/hakemus',
    [AppRoutes.APPLICATION_FORM]: '/hakemus/tietojen-taytto',
    [AppRoutes.APPLICATION_PREVIEW]: '/hakemus/tietojen-tarkistus',
    [AppRoutes.APPLICATION_SUBMIT]: '/hakemus/lahetys',
    [AppRoutes.DIRECT_RESERVATION]: '/suoravaraus/',
  };

  return routes[id] ? routes[id] : '';
};

export const getPartialRouteById = (id: string, parentId: string): string => {
  const target = getRouteById(id);
  const parent = getRouteById(parentId);

  if (!target.startsWith(parent)) {
    throw new Error(
      `Invalid route nesting pattern! ${target} is not a subroute of ${parent}.`,
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
                      AppRoutes.APPLICATION_ROOT,
                    )}
                    element={<ApplicationPage />}
                  />
                  <Route
                    path={getPartialRouteById(
                      AppRoutes.APPLICATION_PREVIEW,
                      AppRoutes.APPLICATION_ROOT,
                    )}
                    element={<ApplicationPreviewPage />}
                  />
                  <Route
                    path={getPartialRouteById(
                      AppRoutes.APPLICATION_SUBMIT,
                      AppRoutes.APPLICATION_ROOT,
                    )}
                    element={<ApplicationSuccessPage />}
                  />
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </ApplicationRootPage>
            }
          />
          <Route
            path={getRouteById(AppRoutes.AREA_SEARCH_LANDING)}
            element={
              <RouteWithLoader>
                <AreaSearchLandingPage />
              </RouteWithLoader>
            }
          />
          <Route
            path={getRouteById(AppRoutes.AREA_SEARCH_APPLICATION_ROOT) + '/*'}
            element={
              <AreaSearchApplicationRootPage>
                {({
                  valid,
                }: InjectedFormProps<
                  unknown,
                  AreaSearchApplicationRootPageProps
                >) => (
                  <Routes>
                    <Route
                      path={getPartialRouteById(
                        AppRoutes.AREA_SEARCH_APPLICATION_AREA_SPEC,
                        AppRoutes.AREA_SEARCH_APPLICATION_ROOT,
                      )}
                      element={<AreaSearchSpecsPage valid={valid} />}
                    />
                    <Route
                      path={getPartialRouteById(
                        AppRoutes.AREA_SEARCH_APPLICATION_FORM,
                        AppRoutes.AREA_SEARCH_APPLICATION_ROOT,
                      )}
                      element={<AreaSearchApplicationPage />}
                    />
                    <Route
                      path={getPartialRouteById(
                        AppRoutes.AREA_SEARCH_APPLICATION_FORM_PREVIEW,
                        AppRoutes.AREA_SEARCH_APPLICATION_ROOT,
                      )}
                      element={<AreaSearchApplicationPreview />}
                    />
                    <Route
                      path={getPartialRouteById(
                        AppRoutes.AREA_SEARCH_APPLICATION_SUBMIT,
                        AppRoutes.AREA_SEARCH_APPLICATION_ROOT,
                      )}
                      element={<AreaSearchApplicationSuccessPage />}
                    />
                    <Route
                      path=""
                      element={
                        <Navigate
                          replace
                          to={getRouteById(
                            AppRoutes.AREA_SEARCH_APPLICATION_AREA_SPEC,
                          )}
                        />
                      }
                    />
                    <Route path="*" element={<ErrorPage />} />
                  </Routes>
                )}
              </AreaSearchApplicationRootPage>
            }
          />
          <Route
            path={getRouteById(AppRoutes.DIRECT_RESERVATION) + ':id'}
            element={
              <RouteWithLoader>
                <DirectReservationPage />
              </RouteWithLoader>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </App>
    </BrowserRouter>
  );
};

export default SiteRoutes;

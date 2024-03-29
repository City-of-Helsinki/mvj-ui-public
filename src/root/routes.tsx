import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from '../App';
import FrontPage from '../frontPage/frontPage';
import ErrorPage from '../errorPage/errorPage';
import MapSearchPage from '../mapSearch/mapSearchPage';
import FavouritesPage from '../favouritesPage/favouritesPage';
import { FinalizeLogin } from '../auth/components/finalizeLogin';
import AuthDependentContent from '../auth/components/authDependentContent';
import BlockLoader from '../loader/blockLoader';
import ApplicationPage from '../application/applicationPage';
import ApplicationRootPage from '../application/applicationRootPage';
import ApplicationSuccessPage from '../application/applicationSuccessPage';
import ApplicationPreviewPage from '../application/applicationPreviewPage';
import AreaSearchLandingPage from '../areaSearch/areaSearchLandingPage';
import AreaSearchApplicationRootPage from '../areaSearch/areaSearchApplicationRootPage';
import DirectReservationPage from '../directReservation/directReservationPage';
import { getRouteById, getPartialRouteById, AppRoutes } from './helpers';

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
            element={<AreaSearchApplicationRootPage />}
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

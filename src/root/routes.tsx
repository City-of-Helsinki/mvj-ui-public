import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import FrontPage from '../frontPage/frontPage';
import ErrorPage from '../errorPage/errorPage';
import CounterPage from '../counter/counterPage';
import PlotSearchAndCompetitionsPage from '../plotSearchAndCompetitionsPage/plotSearchAndCompetitionsPage';

export const AppRoutes = {
  HOME: 'home',
  ERROR: 'error',
  PLOT_SEARCH_AND_COMPETITIONS: 'plot-search-and-competitions',
  OTHER_COMPETITIONS_AND_SEARCHES: 'other-competitions-and-searches',
  AREA_SEARCH: 'area-search',
  LEASES: 'leases',
  APPLICATIONS: 'applications',
  MESSAGES: 'messages',
  DEBUG: 'debug',
};

/**
 * Get route by id
 * @param {string} string
 * @returns {string}
 */
export const getRouteById = (id: string): string => {
  const routes = {
    [AppRoutes.HOME]: '/',
    [AppRoutes.PLOT_SEARCH_AND_COMPETITIONS]: '/tonttihaut-ja-kilpailut',
    [AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES]: '/muut-kilpailut-ja-haut',
    [AppRoutes.AREA_SEARCH]: '/aluehaku',
    [AppRoutes.LEASES]: '/vuokraukset',
    [AppRoutes.APPLICATIONS]: '/hakemukset',
    [AppRoutes.MESSAGES]: '/viestit',
    [AppRoutes.DEBUG]: '/debug',
  };

  return routes[id] ? routes[id] : '';
};

const SiteRoutes = (): JSX.Element => {
  return (
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route
            path={getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS)}
            element={<PlotSearchAndCompetitionsPage />}
          />
          <Route
            path={getRouteById(AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES)}
            element={<div className={'container'}>Muut kilpailut ja haut</div>}
          />
          <Route
            path={getRouteById(AppRoutes.AREA_SEARCH)}
            element={<div className={'container'}>Aluehaku sivu</div>}
          />
          <Route
            path={getRouteById(AppRoutes.DEBUG)}
            element={<CounterPage />}
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </App>
    </BrowserRouter>
  );
};

export default SiteRoutes;

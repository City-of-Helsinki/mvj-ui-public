import React from 'react';
import { Route, Switch } from 'react-router';
import App from '../App';
import FrontPage from '../frontPage/frontPage';
import ErrorPage from '../errorPage/errorPage';
import CounterPage from '../counter/counterPage';
import PlotSearchAndCompetitionsPage from '../plotSearchAndCompetitionsPage/plotSearchAndCompetitionsPage';

export const Routes = {
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
    [Routes.HOME]: '/',
    [Routes.PLOT_SEARCH_AND_COMPETITIONS]: '/tonttihaut-ja-kilpailut',
    [Routes.OTHER_COMPETITIONS_AND_SEARCHES]: '/muut-kilpailut-ja-haut',
    [Routes.AREA_SEARCH]: '/aluehaku',
    [Routes.LEASES]: '/vuokraukset',
    [Routes.APPLICATIONS]: '/hakemukset',
    [Routes.MESSAGES]: '/viestit',
    [Routes.DEBUG]: '/debug',
  };

  return routes[id] ? routes[id] : '';
};

export default
<App>
  <Switch>
    <Route exact path='/' component={FrontPage} />
    <Route exact path={getRouteById(Routes.PLOT_SEARCH_AND_COMPETITIONS)} component={PlotSearchAndCompetitionsPage} />
    <Route exact path={getRouteById(Routes.OTHER_COMPETITIONS_AND_SEARCHES)} render={() => (<div className={'container'}>Muut kilpailut ja haut</div>)} />
    <Route exact path={getRouteById(Routes.AREA_SEARCH)} render={() => (<div className={'container'}>Aluehaku sivu</div>)} />
    <Route exact path={getRouteById(Routes.DEBUG)} component={CounterPage} />
    <Route component={ErrorPage} />
  </Switch>
</App>;
import React from 'react';
import { Route, Switch } from 'react-router';
import App from '../App';

export const Routes = {
  HOME: 'home',
  ERROR: 'error',
  PLOT_SEARCH_AND_COMPETITIONS: 'plot-search-and-competitions',
  OTHER_COMPETITIONS_AND_SEARCHES: 'other-competitions-and-searches',
  AREA_SEARCH: 'area-search',
  LEASES: 'leases',
  APPLICATIONS: 'applications',
  MESSAGES: 'messages',
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
  };

  return routes[id] ? routes[id] : '';
};

export default
<App>
  <Switch>
    <Route exact path='/' render={() => (<div>Etusivu</div>)} />
    <Route exact path={getRouteById(Routes.PLOT_SEARCH_AND_COMPETITIONS)} render={() => (<div>Tonttihaut ja kilpailut</div>)} />
    <Route exact path={getRouteById(Routes.OTHER_COMPETITIONS_AND_SEARCHES)} render={() => (<div>muut-kilpailut-ja-haut</div>)} />
    <Route render={() => (<div>ERROR 404 Sivua ei löytynyt</div>)} />
  </Switch>
</App>;
import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import {Routes, getRouteById} from '../root/routes';

const TopNavigation = (): JSX.Element  => {
  return (
    <div className='top-navigation'>
      <Link to={getRouteById(Routes.HOME)}>
        Helsinki
      </Link>
      <Link to={getRouteById(Routes.PLOT_SEARCH_AND_COMPETITIONS)}>
        Tonttihaut ja kilpailut
      </Link>
      <Link to={getRouteById(Routes.OTHER_COMPETITIONS_AND_SEARCHES)}>
        Muut-kilpailut-ja-haut
      </Link>
      <Link to={getRouteById(Routes.OTHER_COMPETITIONS_AND_SEARCHES)}>
        Aluehaku
      </Link>
      <Link to={getRouteById(Routes.OTHER_COMPETITIONS_AND_SEARCHES)}>
        ?
      </Link>
      <Link to={getRouteById(Routes.OTHER_COMPETITIONS_AND_SEARCHES)}>
        {'<3'}
      </Link>
      <Link to={getRouteById(Routes.OTHER_COMPETITIONS_AND_SEARCHES)}>
        {'>->o'}
      </Link>
      <Link to={getRouteById(Routes.OTHER_COMPETITIONS_AND_SEARCHES)}>
        {'FI'}
      </Link>
    </div>
  );
};

export default withRouter(TopNavigation);

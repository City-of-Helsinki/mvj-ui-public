import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import {Routes, getRouteById} from '../root/routes';

const TopNavigation = (): JSX.Element  => {
  return (
    <div className={'top-navigation'}>
      <div className={'start'}>
        <Link to={getRouteById(Routes.HOME)} className={'helsinki-logo'}>
        </Link>
        <Link to={getRouteById(Routes.PLOT_SEARCH_AND_COMPETITIONS)}>
          Tonttihaut ja kilpailut
        </Link>
        <Link to={getRouteById(Routes.OTHER_COMPETITIONS_AND_SEARCHES)}>
          Muut kilpailut ja haut
        </Link>
        <Link to={getRouteById(Routes.AREA_SEARCH)}>
          Aluehaku
        </Link>
      </div>
      <div className={'end'}>
        <Link to={getRouteById(Routes.HOME)} className={'about-logo'}>
        </Link>
        <Link to={getRouteById(Routes.HOME)} className={'favorite-logo'}>
        </Link>
        <Link to={getRouteById(Routes.HOME)} className={'profile-logo'}>
        </Link>
        <Link to={getRouteById(Routes.HOME)} className={'language-logo'}>
          {'FI'}
        </Link>
      </div>
    </div>
  );
};

export default withRouter(TopNavigation);

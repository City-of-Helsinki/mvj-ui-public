import React, { Component } from 'react';
import {withRouter, RouteProps} from 'react-router';
import {Link} from 'react-router-dom';
import {Routes, getRouteById} from '../root/routes';

class TopNavigation {
  firstLink: any

  setLinkRef = (element: any) => {
    this.firstLink = element;
  }

  render(){    
    return (
      <div className='top-navigation'>
        <Link ref={this.setLinkRef} to={getRouteById(Routes.PLOT_SEARCH_AND_COMPETITIONS)}>
          Tonttihaut ja kilpailut
        </Link>
      </div>
    )
  }
}
 
export default TopNavigation;

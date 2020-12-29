import React, { Component } from 'react';

class FrontPage extends Component {

  render(): JSX.Element {
    return (
      <div className={'container'}>
        <div className={'front-page'}>
          <div className={'banner'}>
            <h3>
              Helsingin kaupungin tonttien, maan, tilojen ja lorem ipsum vuokraus
            </h3>
            <div className={'banner-koro'}/>
          </div>
        </div>
      </div>
    );
  }
}

export default FrontPage;

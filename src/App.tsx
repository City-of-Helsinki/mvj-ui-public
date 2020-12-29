import React from 'react';

import TopNavigation from './topNavigation/topNavigation';
import Footer from './footer/footer';
import './main.scss';

interface Props {
  children: JSX.Element, 
}

const App = ({
  children,
}: Props): JSX.Element  => {
  return (
    <div className={'app'}>
      <TopNavigation/>
      {children}
      <Footer/>
    </div>
  );
};

export default App;
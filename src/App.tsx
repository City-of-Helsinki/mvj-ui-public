import React from 'react';

import CounterPage from './counter/counterPage';
import TopNavigation from './topNavigation/topNavigation';
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
      <CounterPage/>
      {children}
    </div>
  );
};

export default App;
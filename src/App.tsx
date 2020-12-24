import React from 'react';

import logo from './logo.svg';
import Counter from './counter/counter';
import './App.css';

interface Props {
  children: JSX.Element, 
}

const App = ({
  children,
}: Props): JSX.Element  => {
  return (
    <div>
      {children}
    </div>
  );
};

export default App;
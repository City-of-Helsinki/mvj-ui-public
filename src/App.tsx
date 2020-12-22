import React, { FunctionComponent } from 'react';

import logo from './logo.svg';
import Counter from './counter/counter';
import './App.css';

const App: FunctionComponent = () => {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <Counter
        />
      </header>
    </div>
  );
};

export default App;
import React, { FunctionComponent } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './root/rootReducer';
import logo from './logo.svg';
import Counter from './counter/counter';
import { addCount, minusCount } from './counter';
import './App.css';
import {
  incrementAsync,
} from './counter/actions';

const App: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { clicks } = useSelector((state: RootState) => state.count);

  const increment = (page: number) => {
    dispatch(addCount(page));
  };

  const decrement = (page: number) => {
    dispatch(minusCount(page));
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <Counter
          value={clicks}
          onIncrement={() => increment(1)}
          onDecrement={() => decrement(1)}
          onIncrementAsync={() => dispatch(incrementAsync())}
        />
      </header>
    </div>
  );
};

export default App;
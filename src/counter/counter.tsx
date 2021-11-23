import React, { FunctionComponent } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../root/rootReducer';
import CounterButtons from './components/counterButtons';
import { incrementAsync, increment, decrement } from './actions';

const Counter: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { clicks, isCounting } = useSelector((state: RootState) => state.count);

  const incrementBy = (page: number) => {
    dispatch(increment(page));
  };

  const decrementBy = (page: number) => {
    dispatch(decrement(page));
  };

  return (
    <CounterButtons
      value={clicks}
      onIncrement={() => incrementBy(1)}
      onDecrement={() => decrementBy(1)}
      onIncrementAsync={() => dispatch(incrementAsync())}
      isCounting={isCounting}
    />
  );
};

export default Counter;

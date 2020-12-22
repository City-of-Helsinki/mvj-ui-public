import React from 'react';

interface Props {
  value?: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onIncrementAsync?(): void;
}

const CounterButtons = ({
  value, 
  onIncrement, 
  onDecrement, 
  onIncrementAsync,
}: Props): JSX.Element => {
  return (
    <div>    
      <button onClick={onIncrementAsync} className='button'>
      Increment after 1 second
      </button>
      {' '}   
      <button onClick={onIncrement} className='button'>	        
      + Increment
      </button>
      {' '}
      <button onClick={onDecrement} className='button'>
        - Decrement
      </button>
      <hr />
      <div>
        Clicked: {value} times
      </div>
    </div>
  );
};	

export default CounterButtons;
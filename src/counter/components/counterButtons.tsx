import React from 'react';

interface Props {
  value?: number,
  onIncrement: () => void,
  onDecrement: () => void
  onIncrementAsync: () => void,
  isCounting: boolean,
}

const CounterButtons = ({
  value, 
  onIncrement, 
  onDecrement, 
  onIncrementAsync,
  isCounting,
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
        {isCounting?'Laskee':value}
      </div>
    </div>
  );
};	

export default CounterButtons;
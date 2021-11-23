import React from 'react';
import { Button, LoadingSpinner } from 'hds-react';

interface Props {
  value?: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onIncrementAsync: () => void;
  isCounting: boolean;
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
      <Button
        size="small"
        disabled={isCounting}
        onClick={onIncrementAsync}
        variant="secondary"
        style={{
          color: 'var(--color-black)',
          borderColor: 'var(--color-black)',
        }}
      >
        Increment after 1 second
      </Button>{' '}
      <Button
        disabled={isCounting}
        size="small"
        onClick={onIncrement}
        theme={'black'}
      >
        + Increment
      </Button>{' '}
      <Button
        disabled={isCounting}
        size="small"
        onClick={onDecrement}
        theme={'default'}
      >
        - Decrement
      </Button>
      <div>{isCounting ? <LoadingSpinner small /> : value}</div>
    </div>
  );
};

export default CounterButtons;

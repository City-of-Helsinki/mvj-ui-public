import React, { Component } from 'react';

import CounterButtons from './components/counterButtons';
import { connect } from 'react-redux';
import { RootState } from '../root/rootReducer';
import {
  incrementAsync,
  increment,
  decrement,
} from './actions';

interface State {
  clicks: number,
  isCounting: boolean,
}

interface Dispatch {
  increment: (page: number) => void,
  decrement: (page: number) => void,
  incrementAsync: () => void,
}

class CounterPage extends Component<State & Dispatch> {
  incrementBy = (page: number) => {
    const { increment } = this.props;
    increment(page);
  };

  decrementBy = (page: number) => {
    const { decrement } = this.props;
    decrement(page);
  };

  render() {
    const { clicks, incrementAsync, isCounting } = this.props;

    return (
      <div className={'container'}>
        <CounterButtons
          value={clicks}
          onIncrement={() => this.incrementBy(1)}
          onDecrement={() => this.decrementBy(1)}
          onIncrementAsync={() => incrementAsync()}
          isCounting={isCounting}
        />
      </div>
    );
  }
}

const mapDispatchToProps: Dispatch = {
  increment,
  decrement,
  incrementAsync
};

const mapStateToProps = (state: RootState): State => ({
  clicks: state.count.clicks,
  isCounting: state.count.isCounting,
});

export default connect(mapStateToProps, mapDispatchToProps)(CounterPage);

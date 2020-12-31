import { increment } from './actions';
import counterReducer from './reducer';

type CurrentDisplayState = {
  clicks: number,
  isCounting: boolean,
}

const initialState: CurrentDisplayState = {
  clicks: 0,
  isCounting: false
};

describe('counter reducer', () => {

  it('should handle INCREMENT', () => {
    const newState = {...initialState, clicks: 1};

    const state = counterReducer(initialState, increment(1));
    expect(state).toEqual(newState);
  });
});
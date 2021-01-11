import { openLoginModal, hideLoginModal } from './actions';
import loginReducer from './reducer';

type CurrentDisplayState = {
  isLoginModalOpen: boolean,
}

const initialState: CurrentDisplayState = {
  isLoginModalOpen: false
};

describe('login reducer', () => {

  it('should handle OPEN LOGIN MODAL', () => {
    const newState = {...initialState, isLoginModalOpen: true};

    const state = loginReducer(initialState, openLoginModal());
    expect(state).toEqual(newState);
  });

  it('should handle HIDE LOGIN MODAL', () => {
    const newState = {...initialState, isLoginModalOpen: false};

    const state = loginReducer(initialState, hideLoginModal());
    expect(state).toEqual(newState);
  });
});
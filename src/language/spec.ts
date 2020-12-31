import { changeLang } from './actions';
import languageReducer from './reducer';
import { Language } from './types';

type CurrentDisplayState = {
  current: Language,
}

const initialState: CurrentDisplayState = {
  current: Language.EN
};

describe('language reducer', () => {

  it('should handle CHANGE LANGUAGE', () => {
    const newState = {...initialState, current: Language.FI};

    const state = languageReducer(initialState, changeLang(Language.FI));
    expect(state).toEqual(newState);
  });
});
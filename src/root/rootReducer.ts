import { combineReducers } from '@reduxjs/toolkit';

import counterReducer from '../counter/reducer';
import languageReducer from '../language/reducer';

const allReducers = { 
  count: counterReducer,
  language: languageReducer,
};

export let rootReducer = combineReducers({
  ...allReducers,
});

export default function createReducer(injectedReducers = {}): typeof rootReducer {
  rootReducer = combineReducers({
    ...allReducers,
    ...injectedReducers,
  });

  return rootReducer;
}

export type RootState = ReturnType<typeof rootReducer>;
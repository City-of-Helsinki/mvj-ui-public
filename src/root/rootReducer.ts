import { combineReducers } from '@reduxjs/toolkit';

import counterReducer from '../counter/reducer';

const counter = { 
  count: counterReducer,
};

export let rootReducer = combineReducers({
  ...counter,
});

export default function createReducer(injectedReducers = {}) {
  rootReducer = combineReducers({
    ...counter,
    ...injectedReducers,
  });

  return rootReducer;
}

export type RootState = ReturnType<typeof rootReducer>;
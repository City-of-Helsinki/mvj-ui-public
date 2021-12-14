import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '../auth/reducer';
import counterReducer from '../counter/reducer';
import loginReducer from '../login/reducer';
import plotSearchReducer from '../plotSearch/reducer';

const allReducers = {
  auth: authReducer,
  count: counterReducer,
  login: loginReducer,
  plotSearch: plotSearchReducer,
};

export let rootReducer = combineReducers({
  ...allReducers,
});

export default function createReducer(
  injectedReducers = {}
): typeof rootReducer {
  rootReducer = combineReducers({
    ...allReducers,
    ...injectedReducers,
  });

  return rootReducer;
}

export type RootState = ReturnType<typeof rootReducer>;

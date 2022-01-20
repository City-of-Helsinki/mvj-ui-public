import { combineReducers } from '@reduxjs/toolkit';
import { reducer as oidcReducer } from 'redux-oidc';

import authReducer from '../auth/reducer';
import loginReducer from '../login/reducer';
import plotSearchReducer from '../plotSearch/reducer';

const allReducers = {
  auth: authReducer,
  login: loginReducer,
  plotSearch: plotSearchReducer,
  oidc: oidcReducer,
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

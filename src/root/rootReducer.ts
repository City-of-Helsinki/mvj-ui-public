import { combineReducers } from '@reduxjs/toolkit';
import { reducer as oidcReducer } from 'redux-oidc';
import { reducer as formReducer } from 'redux-form';

import authReducer from '../auth/reducer';
import loginReducer from '../login/reducer';
import plotSearchReducer from '../plotSearch/reducer';
import favouriteReducer from '../favourites/reducer';
import notificationReducer from '../globalNotification/reducer';
import applicationReducer from '../application/reducer';

const allReducers = {
  auth: authReducer,
  login: loginReducer,
  plotSearch: plotSearchReducer,
  favourite: favouriteReducer,
  notifications: notificationReducer,
  application: applicationReducer,
  oidc: oidcReducer,
  form: formReducer,
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

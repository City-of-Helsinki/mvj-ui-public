import { combineReducers } from '@reduxjs/toolkit';
import { reducer as formReducer } from 'redux-form';
import { authReducer } from '../auth/reducer';
import loginReducer from '../login/reducer';
import plotSearchReducer from '../plotSearch/reducer';
import favouriteReducer from '../favourites/reducer';
import notificationReducer from '../globalNotification/reducer';
import applicationReducer from '../application/reducer';
import areaSearchReducer from '../areaSearch/reducer';
import directReservationReducer from '../directReservation/reducer';
import faqReducer from '../faq/reducer';
import frontPageReducer from '../frontPage/reducer';
import {
  IS_FEATURE_OTHER_SEARCH_ENABLED,
  IS_FEATURE_PLOT_SEARCH_ENABLED,
} from '../featureFlags';

const allReducers = {
  auth: authReducer,
  login: loginReducer,
  notifications: notificationReducer,
  application: applicationReducer,
  areaSearch: areaSearchReducer,
  form: formReducer,
  directReservation: directReservationReducer,
  faq: faqReducer,
  frontPage: frontPageReducer,
  ...(IS_FEATURE_PLOT_SEARCH_ENABLED || IS_FEATURE_OTHER_SEARCH_ENABLED
    ? {
        plotSearch: plotSearchReducer,
        favourite: favouriteReducer,
      }
    : {}),
};

export let rootReducer = combineReducers({
  ...allReducers,
});

export default function createReducer(
  injectedReducers = {},
): typeof rootReducer {
  rootReducer = combineReducers({
    ...allReducers,
    ...injectedReducers,
  });

  return rootReducer;
}

export type RootState = ReturnType<typeof rootReducer>;

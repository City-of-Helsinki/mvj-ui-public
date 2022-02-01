import React from 'react';
import ReactDOM from 'react-dom';
import { OidcProvider } from 'redux-oidc';
import { Provider } from 'react-redux';

import './i18n';
import configureStore from './root/storeConfig';
import reportWebVitals from './reportWebVitals';
import SiteRoutes from './root/routes';
import { userManager } from './auth/userManager';
import { MVJ_FAVOURITE } from './favourites/types';

const initialState = {};
const store = configureStore(initialState);

// save favourites into localstorage
store.subscribe(() => {
  const { favourite } = store.getState();
  const checkList = ['created_at', 'modified_at', 'targets'];
  const propertyNames = Object.getOwnPropertyNames(favourite.favourite);

  let checkIntegrity = true;
  checkList.forEach((key) => {
    if (propertyNames.some((fKey) => fKey === key)) {
      return;
    }
    checkIntegrity = false;
  });

  if (!checkIntegrity) {
    console.error('Invalid favourite for localstorage', favourite);
    return;
  }
  localStorage.setItem(MVJ_FAVOURITE, JSON.stringify(favourite.favourite));
});

ReactDOM.render(
  <Provider store={store}>
    <OidcProvider store={store} userManager={userManager}>
      <SiteRoutes />
    </OidcProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

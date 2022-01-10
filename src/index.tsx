import React from 'react';
import ReactDOM from 'react-dom';
import { OidcProvider } from 'redux-oidc';
import { Provider } from 'react-redux';

import './i18n';
import configureStore from './root/storeConfig';
import reportWebVitals from './reportWebVitals';
import SiteRoutes from './root/routes';
import { userManager } from './auth/userManager';

const initialState = {};
const store = configureStore(initialState);

// save favourites into localstorage
store.subscribe(() => {
  const { favourite } = store.getState();
  localStorage.setItem('mvj_favourites', JSON.stringify(favourite.favourite));
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

import { createRoot } from 'react-dom/client';
import { LoginProvider } from 'hds-react';
import { Provider } from 'react-redux';

import './i18n';
import configureStore from './root/storeConfig';
import reportWebVitals from './reportWebVitals';
import SiteRoutes from './root/routes';
import { loginProviderProperties } from './auth/constants';
import { MVJ_FAVOURITE } from './favourites/types';
import { logError } from './root/helpers';

const initialState = {};
export const store = configureStore(initialState);

// save favourites into localstorage
store.subscribe(() => {
  try {
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
      throw Error(
        `Invalid object to save on mvj_favourite -localstorage item: ${favourite.favourite}`,
      );
    }

    localStorage.setItem(MVJ_FAVOURITE, JSON.stringify(favourite.favourite));
  } catch (e) {
    logError(e);
  }
});

const container = document.getElementById('root');
const root = createRoot(container as Element);

root.render(
  <Provider store={store}>
    <LoginProvider {...loginProviderProperties}>
      <SiteRoutes />
    </LoginProvider>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

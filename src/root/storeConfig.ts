import { configureStore, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createInjectorsEnhancer } from 'redux-injectors';
import { createBrowserHistory } from 'history';
import { routerMiddleware, connectRouter } from 'connected-react-router';

import createReducer from './rootReducer';
import rootSaga from './rootSaga';
import { userManager } from '../auth/userManager';
import { loadUser } from '../auth/loadUser';
import { USER_FOUND } from '../auth/types';

export const history = createBrowserHistory();

export default function configureAppStore(initialState = {}): Store {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  const middlewares = [sagaMiddleware, routerMiddleware(history)];
  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ];

  const router = {
    router: connectRouter(history),
  };

  const store = configureStore({
    reducer: createReducer(router),
    middleware: (defaultMiddleware) => [
      ...defaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            USER_FOUND,
            'areaSearch/AREA_SEARCH_SUBMISSION_FAILED',
          ],
          ignoredPaths: ['oidc.user', 'areaSearch.lastError'],
        },
      }),
      ...middlewares,
    ],
    preloadedState: initialState,
    devTools: import.meta.env.DEV,
    enhancers,
  });

  sagaMiddleware.run(rootSaga);

  loadUser(store, userManager).then();

  return store;
}

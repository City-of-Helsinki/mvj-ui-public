import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createInjectorsEnhancer } from 'redux-injectors';
import createReducer from './rootReducer';
import rootSaga from './rootSaga';
import { createBrowserHistory } from 'history';

import { routerMiddleware, connectRouter } from 'connected-react-router';

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
    middleware: [
      ...getDefaultMiddleware(),
      ...middlewares
    ],
    preloadedState: initialState,
    devTools: process.env.NODE_ENV !== 'production',
    enhancers,
  });	

  /* tslint:disable-next-line */
  sagaMiddleware.run(rootSaga);
  return store;
}
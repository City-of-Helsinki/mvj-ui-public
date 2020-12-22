import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createInjectorsEnhancer } from 'redux-injectors';
import createReducer from './rootReducer';
import rootSaga from './rootSaga';

export default function configureAppStore(initialState = {}): Store {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  // sagaMiddleware: Makes redux-sagas work
  const middlewares = [sagaMiddleware];
  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ];

  const store = configureStore({
    reducer: createReducer(),
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
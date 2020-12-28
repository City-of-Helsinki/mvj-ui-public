import { all, fork } from 'redux-saga/effects';
import counterSaga from '../counter/saga';

export default function* rootSaga() {	  
  yield all([	    
    fork(counterSaga),
  ]);
}
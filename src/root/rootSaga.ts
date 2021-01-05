import { all, fork } from 'redux-saga/effects';
import counterSaga from '../counter/saga';

export default function* rootSaga(): Generator {	  
  yield all([	    
    fork(counterSaga),
  ]);
}
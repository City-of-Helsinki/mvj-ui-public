import {createAction} from 'redux-actions';
import { Action } from 'redux';

import { CHANGE_LANG, Language } from './types';

export const changeLang = (
  payload: Language,
): Action<string> => createAction(CHANGE_LANG)(payload);
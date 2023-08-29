import { createAction } from 'redux-actions';
import { Action } from 'redux';

import {
  GENERATE_FAVOURITE,
  FAVOURITE_GENERATED,
  FAVOURITE_GENERATION_FAILED,
} from './types';

export const generateFavourite = (id: string): Action<string> =>
  createAction(GENERATE_FAVOURITE)(id);

export const favouriteGenerated = (): Action<string> =>
  createAction(FAVOURITE_GENERATED)();

export const favouriteGenerationFailed = (): Action<string> =>
  createAction(FAVOURITE_GENERATION_FAILED)();

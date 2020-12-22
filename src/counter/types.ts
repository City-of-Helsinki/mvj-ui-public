export const INCREMENT_ASYNC = 'counter/INCREMENT_ASYNC';
export const INCREMENT = 'counter/INCREMENT';
export const DECREMENT = 'counter/DECREMENT';
export const IS_COUNTING = 'counter/IS_COUNTING';

export interface incrementAsyncAction {
  type: typeof INCREMENT_ASYNC;
}
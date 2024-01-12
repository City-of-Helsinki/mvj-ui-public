import { Logger } from 'oidc-client-ts';
import type { UserManager, User } from 'oidc-client-ts';
import type { Store } from 'redux';

import { loadUserError, loadingUser, userExpired, userFound } from './actions';

// stores the redux store here to be accessed by all functions
let reduxStore: Store;

// helper function to set the redux store (for testing)
export function setReduxStore(newStore: Store): void {
  reduxStore = newStore;
}

// helper function to get the redux store (for testing)
export function getReduxStore(): Store {
  return reduxStore;
}

// callback function called when the user has been loaded
export function getUserCallback(user: User | null): User | null {
  if (user && !user.expired) {
    reduxStore.dispatch(userFound(user));
  } else if (!user || (user && user.expired)) {
    reduxStore.dispatch(userExpired());
  }
  return user;
}

// error callback called when the userManager's loadUser() function failed
export function errorCallback(error: Error): void {
  Logger.error(`auth: Error in loadUser() function: ${error.message}`);
  reduxStore.dispatch(loadUserError());
}

// function to load the current user into the store
// NOTE: use only when silent renew is configured
export const loadUser = (store: Store, userManager: UserManager) => {
  if (!store || !store.dispatch) {
    throw new Error(
      'auth: You need to pass the redux store into the loadUser helper!',
    );
  }

  if (!userManager || !userManager.getUser) {
    throw new Error(
      'auth: You need to pass the userManager into the loadUser helper!',
    );
  }

  reduxStore = store;
  store.dispatch(loadingUser());

  return userManager.getUser().then(getUserCallback).catch(errorCallback);
};

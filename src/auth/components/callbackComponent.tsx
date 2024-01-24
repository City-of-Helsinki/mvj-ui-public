import React, { useEffect } from 'react';
import type { UserManager, User } from 'oidc-client-ts';

type Callback<T> = (arg: T) => void;
type SuccessCallback = Callback<User>;
type ErrorCallback = Callback<Error>;

interface CallbackComponentProps {
  children: React.ReactElement;
  userManager: UserManager;
  successCallback: SuccessCallback;
  errorCallback?: ErrorCallback;
}

export const CallbackComponent = ({
  children,
  userManager,
  successCallback,
  errorCallback,
}: CallbackComponentProps) => {
  const onRedirectSuccess = (user: User) => successCallback(user);

  const onRedirectError = (error: Error) => {
    if (!errorCallback) {
      throw new Error(`Error handling redirect callback: ${error.message}`);
    }

    errorCallback(error);
  };

  useEffect(() => {
    userManager
      .signinRedirectCallback()
      .then(onRedirectSuccess)
      .catch(onRedirectError);
  }, []);

  return React.Children.only(children);
};

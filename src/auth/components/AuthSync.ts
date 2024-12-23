import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  useAuthenticatedUser,
  useApiTokens,
  useApiTokensClientTracking,
  isApiTokensUpdatedSignal,
} from 'hds-react';
import {
  receiveApiToken,
  clearApiToken,
  userFound,
  clearUser,
} from '../actions';

/**
 * AuthSync component synchronizes the authentication state from hds-react's LoginProvider
 * with the Redux store. It dispatches actions to update the Redux store based on the
 * authentication state and API token.
 *
 * @returns {null} This component does not render anything.
 */
const AuthSync = (): null => {
  const dispatch = useDispatch();
  const authenticatedUser = useAuthenticatedUser();
  const { getStoredApiTokens } = useApiTokens();
  // Re-renders component when api token changes
  const [apiTokensClientSignal, apiTokensClientSignalReset, _apiTokensClient] =
    useApiTokensClientTracking();

  useEffect(() => {
    if (authenticatedUser && apiTokensClientSignal === undefined) {
      dispatch(userFound(authenticatedUser));
    }
    if (!authenticatedUser) {
      dispatch(clearUser());
      dispatch(clearApiToken());
    }
    const [_apiTokenError, apiToken] = getStoredApiTokens();
    if (isApiTokensUpdatedSignal(apiTokensClientSignal) && apiToken) {
      dispatch(receiveApiToken(apiToken));
    }
    if (apiToken && apiTokensClientSignal === undefined) {
      dispatch(receiveApiToken(apiToken));
    }
    if (_apiTokenError && !apiToken) {
      dispatch(clearApiToken());
    }
    return apiTokensClientSignalReset;
  }, [authenticatedUser, apiTokensClientSignal, dispatch]);

  return null;
};

export default AuthSync;

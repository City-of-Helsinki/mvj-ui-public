import { connect } from 'react-redux';
import type { User } from 'hds-react';

import { RootState } from '../../root/rootReducer';
import {
  getIsRenewingApiToken,
  getLoggedInUser,
  hasApiToken,
} from '../selectors';

interface Props {
  isRenewingApiToken: boolean;
  user: User | null;
  hasApiToken: boolean;
  children: (loading: boolean, loggedIn: boolean) => JSX.Element | null;
}

const AuthDependentContent = ({
  isRenewingApiToken,
  user,
  hasApiToken,
  children,
}: Props): JSX.Element | null => {
  // User exists and api token is not renewing
  const isLoading = !user || isRenewingApiToken;
  // User exists and has api token
  const isLoggedIn = !!user && hasApiToken;
  return children(isLoading, isLoggedIn);
};

export default connect((state: RootState) => ({
  user: getLoggedInUser(state),
  isRenewingApiToken: getIsRenewingApiToken(state),
  hasApiToken: hasApiToken(state),
}))(AuthDependentContent);

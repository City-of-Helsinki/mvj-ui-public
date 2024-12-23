import { connect } from 'react-redux';
import type { User } from 'hds-react';

import { RootState } from '../../root/rootReducer';
import { getLoggedInUser, hasApiToken } from '../selectors';

interface Props {
  user: User | null;
  hasApiToken: boolean;
  children: (hasApiToken: boolean, loggedIn: boolean) => JSX.Element | null;
}

const AuthDependentContent = ({
  user,
  hasApiToken,
  children,
}: Props): JSX.Element | null => {
  // User exists and has api token
  const isLoggedIn = !!user;
  return children(hasApiToken, isLoggedIn);
};

export default connect((state: RootState) => ({
  user: getLoggedInUser(state),
  hasApiToken: hasApiToken(state),
}))(AuthDependentContent);

import { connect } from 'react-redux';
import { User } from 'oidc-client';

import { RootState } from '../../root/rootReducer';
import { getIsFetchingApiToken, getIsLoadingUser, getUser } from '../selectors';

interface Props {
  isLoadingUser: boolean;
  isLoadingApiToken: boolean;
  user: User | null;
  children: (loading: boolean, loggedIn: boolean) => JSX.Element | null;
}

const AuthDependentContent = ({
  isLoadingUser,
  isLoadingApiToken,
  user,
  children,
}: Props): JSX.Element | null =>
  children(isLoadingUser || isLoadingApiToken, !!user);

export default connect((state: RootState) => ({
  user: getUser(state),
  isLoadingUser: getIsLoadingUser(state),
  isLoadingApiToken: getIsFetchingApiToken(state),
}))(AuthDependentContent);

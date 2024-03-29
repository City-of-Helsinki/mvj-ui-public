import { connect } from 'react-redux';
import type { User } from 'oidc-client-ts';

import { RootState } from '../../root/rootReducer';
import {
  getIsFetchingApiToken,
  getIsLoadingUser,
  getUser,
  hasApiToken,
} from '../selectors';

interface Props {
  isLoadingUser: boolean;
  isLoadingApiToken: boolean;
  user: User | null;
  hasApiToken: boolean;
  children: (loading: boolean, loggedIn: boolean) => JSX.Element | null;
}

const AuthDependentContent = ({
  isLoadingUser,
  isLoadingApiToken,
  user,
  hasApiToken,
  children,
}: Props): JSX.Element | null =>
  children(isLoadingUser || isLoadingApiToken, !!user && hasApiToken);

export default connect((state: RootState) => ({
  user: getUser(state),
  isLoadingUser: getIsLoadingUser(state),
  isLoadingApiToken: getIsFetchingApiToken(state),
  hasApiToken: hasApiToken(state),
}))(AuthDependentContent);

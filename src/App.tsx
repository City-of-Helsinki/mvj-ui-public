import { useEffect } from 'react';
import { connect } from 'react-redux';
import { User, Log } from 'oidc-client-ts';
import { setConfiguration as setGridSystemConfiguration } from 'react-grid-system';
import { Helmet } from 'react-helmet';
import TopNavigation from './topNavigation/topNavigation';
import Footer from './footer/footer';
import LoginModal from './login/loginModal';
import { CookieConsent } from './cookieConsent/cookieConsent';
import { RootState } from './root/rootReducer';
import {
  getIsFetchingApiToken,
  getUser,
  hasApiToken,
  getApiToken,
} from './auth/selectors';
import { fetchApiToken, receiveApiToken } from './auth/actions';
import { fetchFavourite } from './favourites/actions';
import GlobalNotificationContainer from './globalNotification/globalNotificationContainer';
import { getIsFetchingFavourite } from './favourites/selectors';
import { getPageTitle } from './root/helpers';

// https://hds.hel.fi/design-tokens/breakpoints
// (container widths adjusted with gutters included)
// TODO: gutter width should be 12/16 in smaller sizes, but isn't configurable on a size class basis
setGridSystemConfiguration({
  breakpoints: [320, 576, 768, 992, 1248],
  containerWidths: [312, 568, 744, 968, 1224],
  gutterWidth: 24,
});

import 'hds-core';
import './main.scss';

interface AppProps {
  children?: JSX.Element;
  user: User | null;
  fetchApiToken: (accessToken: string) => void;
  fetchFavourite: () => void;
  isFetchingFavourite: boolean;
  receiveApiToken: (apiToken: string) => void;
  isFetchingApiToken: boolean;
  hasApiToken: boolean;
  getApiToken: string | null;
}

Log.setLogger(console);

const App = ({
  children,
  user,
  fetchApiToken,
  fetchFavourite,
  isFetchingFavourite,
  isFetchingApiToken,
  hasApiToken,
  getApiToken,
}: AppProps): JSX.Element => {
  useEffect(() => {
    if (user && !hasApiToken && !isFetchingApiToken) {
      fetchApiToken(user.access_token);
    }
  }, [user, getApiToken]);

  useEffect(() => {
    if (!isFetchingFavourite && !isFetchingApiToken && hasApiToken) {
      fetchFavourite();
    }
  }, [isFetchingApiToken]);

  return (
    <div className="App">
      <Helmet>
        <title>{getPageTitle()}</title>
      </Helmet>
      <LoginModal />
      <TopNavigation />
      <GlobalNotificationContainer />
      <CookieConsent />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default connect(
  (state: RootState) => ({
    user: getUser(state),
    isFetchingApiToken: getIsFetchingApiToken(state),
    isFetchingFavourite: getIsFetchingFavourite(state),
    hasApiToken: hasApiToken(state),
    getApiToken: getApiToken(state),
  }),
  { fetchApiToken, receiveApiToken, fetchFavourite },
)(App);

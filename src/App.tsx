import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { User, Log } from 'oidc-client-ts';
import { setConfiguration as setGridSystemConfiguration } from 'react-grid-system';
import { Helmet } from 'react-helmet';

import TopNavigation from './topNavigation/topNavigation';
import Footer from './footer/footer';
import LoginModal from './login/loginModal';
import { CookieConsent } from './cookieConsent/cookieConsent';
import { RootState } from './root/rootReducer';
import { hasApiToken } from './auth/selectors';
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
import type { Action } from 'redux';

interface AppProps {
  children?: JSX.Element;
  user: User | null;
  fetchFavourite: () => Action;
  isFetchingFavourite: boolean;
  receiveApiToken: (apiToken: string) => void;
  isFetchingApiToken: boolean;
  isRenewingApiToken: boolean;
  hasApiToken: boolean;
  getApiToken: string | null;
}

Log.setLogger(console);

const App = ({
  children,
  fetchFavourite,
  isFetchingFavourite,
  hasApiToken,
}: AppProps): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFetchingFavourite && hasApiToken) {
      dispatch(fetchFavourite());
    }
  }, [hasApiToken]);

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
    isFetchingFavourite: getIsFetchingFavourite(state),
    hasApiToken: hasApiToken(state),
  }),
  { fetchFavourite },
)(App);
